import Foundation
import AVFoundation
import React
import UserNotifications

// MARK: - Event Emitter (exports events to JS)
@objc(RecordAudioEvents)
class RecordAudioEvents: RCTEventEmitter {
  static var shared: RecordAudioEvents?
  private var hasListeners = false

  override init() {
    super.init()
    RecordAudioEvents.shared = self
  }

  override static func requiresMainQueueSetup() -> Bool { true }

  override func supportedEvents() -> [String]! {
    return ["RecordAudioChunk", "RecordAudioError", "RecordAudioState"]
  }

  override func startObserving() { hasListeners = true }
  override func stopObserving()  { hasListeners = false }

  func emit(_ name: String, _ body: [String: Any]) {
    guard hasListeners else { return }
    sendEvent(withName: name, body: body)
  }
}

// MARK: - Recording Service
@objc(RecordAudioService)
class RecordAudioService: NSObject {
  private var audioRecorder: AVAudioRecorder?
  private var filePathBase: String?
  private var currentIndex: Int = 1
  /// For testing: 2 minutes. For production: e.g. 30 * 60.
  private let chunkDuration: TimeInterval = 10*60
  private var healthCheckTimer: Timer?

  private enum RecordingState { case stopped, recording, interrupted }
  private var recordingState: RecordingState = .stopped

  // MARK: Start / Stop
  @objc(StartAudioService:resolver:rejecter:)
  func StartAudioService(filePathName: String,
                         resolver: @escaping RCTPromiseResolveBlock,
                         rejecter: @escaping RCTPromiseRejectBlock) {
    print("StartAudioService called with filePathName: \(filePathName)")

    filePathBase = filePathName
    currentIndex = 1
    recordingState = .stopped

    requestNotificationPermissions()
    registerNotifications()

    do {
      // Prepare session once up-front
      let session = AVAudioSession.sharedInstance()
      try session.setCategory(.record, mode: .default, options: [.mixWithOthers, .allowBluetooth])
      try session.setActive(true)
    } catch {
      rejecter("AudioSession", "Failed to setup audio session: \(error.localizedDescription)", error)
      return
    }

    // Start the first chunk
    startNewChunk(resolver: { msg in
      RecordAudioEvents.shared?.emit("RecordAudioState", ["state": "recording"])
      self.startHealthCheckTimer()
      resolver(msg)
    }, rejecter: { code, message, err in
      RecordAudioEvents.shared?.emit("RecordAudioError", ["message": message ?? "Unknown error"])
      rejecter(code, message, err)
    })
  }

  @objc(StopAudioService:rejecter:)
  func StopAudioService(resolver: @escaping RCTPromiseResolveBlock,
                        rejecter: @escaping RCTPromiseRejectBlock) {
    print("StopAudioService called")

    NotificationCenter.default.removeObserver(self)

    stopAudioRecorder()
    stopHealthCheckTimer()

    recordingState = .stopped
    audioRecorder = nil
    filePathBase = nil
    currentIndex = 1

    RecordAudioEvents.shared?.emit("RecordAudioState", ["state": "stopped"])
    resolver("StopAudioService successfully stopped.")
  }

  // MARK: Notifications
  private func registerNotifications() {
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(handleInterruption),
      name: AVAudioSession.interruptionNotification,
      object: AVAudioSession.sharedInstance()
    )

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(handleRouteChange),
      name: AVAudioSession.routeChangeNotification,
      object: AVAudioSession.sharedInstance()
    )

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(appDidEnterBackground),
      name: UIApplication.didEnterBackgroundNotification,
      object: nil
    )

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(appWillEnterForeground),
      name: UIApplication.willEnterForegroundNotification,
      object: nil
    )
  }

  // MARK: Start a new chunk
  private func startNewChunk(resolver: @escaping RCTPromiseResolveBlock,
                             rejecter: @escaping RCTPromiseRejectBlock,
                             attempt: Int = 1) {
    guard let basePath = filePathBase else {
      rejecter("FilePathError", "Base filepath not set", nil)
      return
    }

    let baseURL = URL(fileURLWithPath: basePath)
    let dir = baseURL.deletingLastPathComponent()
    let stem = baseURL.deletingPathExtension().lastPathComponent
    let fileURL = dir.appendingPathComponent("\(stem)_\(currentIndex).aac")

    let settings: [String: Any] = [
      AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
      AVSampleRateKey: 44100,
      AVNumberOfChannelsKey: 1,
      AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
    ]

    do {
      let session = AVAudioSession.sharedInstance()
      try session.setActive(true) // keep alive

      audioRecorder = try AVAudioRecorder(url: fileURL, settings: settings)
      audioRecorder?.delegate = self
      audioRecorder?.prepareToRecord()

      // Time-bounded chunk; delegate will fire when it ends.
      let ok = audioRecorder?.record(forDuration: chunkDuration) ?? false
      if ok {
        recordingState = .recording
        print("Recording chunk started at \(fileURL.path)")
        resolver("Recording chunk started at \(fileURL.path)")
      } else {
        throw NSError(domain: "RecordAudioService", code: -2, userInfo: [NSLocalizedDescriptionKey: "record() returned false"])
      }
    } catch {
      if attempt < 3 {
        let delay = pow(2.0, Double(attempt))
        DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
          self.startNewChunk(resolver: resolver, rejecter: rejecter, attempt: attempt + 1)
        }
      } else {
        let msg = "Failed to start recording: \(error.localizedDescription)"
        print(msg)
        RecordAudioEvents.shared?.emit("RecordAudioError", ["message": msg])
        rejecter("RecorderError", msg, error)
      }
    }
  }

  // MARK: Interruption / route change / app lifecycle
  @objc private func handleInterruption(notification: Notification) {
    guard
      let userInfo = notification.userInfo,
      let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
      let type = AVAudioSession.InterruptionType(rawValue: typeValue)
    else { return }

    if type == .began {
      recordingState = .interrupted
      audioRecorder?.pause()
      notifyUser(message: "Audio recording paused due to an interruption.")
      RecordAudioEvents.shared?.emit("RecordAudioState", ["state": "interrupted"])
    } else if type == .ended {
      let optsValue = userInfo[AVAudioSessionInterruptionOptionKey] as? UInt
      let opts = AVAudioSession.InterruptionOptions(rawValue: optsValue ?? 0)
      if opts.contains(.shouldResume) {
        resumeAfterInterruption()
      } else {
        recordingState = .stopped
        RecordAudioEvents.shared?.emit("RecordAudioState", ["state": "stopped"])
      }
    }
  }

  @objc private func handleRouteChange(notification: Notification) {
    guard
      let userInfo = notification.userInfo,
      let reasonValue = userInfo[AVAudioSessionRouteChangeReasonKey] as? UInt,
      let reason = AVAudioSession.RouteChangeReason(rawValue: reasonValue)
    else { return }

    switch reason {
      case .newDeviceAvailable:
        print("New audio device available.")
      case .oldDeviceUnavailable:
        print("Audio device removed.")
      case .categoryChange:
        print("Audio session category changed.")
      default: break
    }
  }

  @objc private func appDidEnterBackground() {
    print("App entered background")
    try? AVAudioSession.sharedInstance().setActive(true)
  }

  @objc private func appWillEnterForeground() {
    print("App will enter foreground")
  }

  private func resumeAfterInterruption() {
    guard recordingState == .interrupted else { return }
    currentIndex += 1
    startNewChunk(resolver: { _ in
      self.recordingState = .recording
      RecordAudioEvents.shared?.emit("RecordAudioState", ["state": "recording"])
    }, rejecter: { _, msg, _ in
      print("Could not resume recording: \(msg ?? "unknown")")
      RecordAudioEvents.shared?.emit("RecordAudioError", ["message": msg ?? "Could not resume"])
    })
  }

  // MARK: Health check (restarts if something stopped unexpectedly)
  private func startHealthCheckTimer() {
    stopHealthCheckTimer()
    let t = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
      guard let self = self else { return }
      let isRec = self.audioRecorder?.isRecording ?? false
      if self.recordingState != .recording || !isRec {
        print("HealthCheck: restarting recorder")
        self.currentIndex += 1
        self.startNewChunk(resolver: { _ in }, rejecter: { _, msg, _ in
          RecordAudioEvents.shared?.emit("RecordAudioError", ["message": msg ?? "Health restart failed"])
        })
      }
    }
    RunLoop.main.add(t, forMode: .common)
    healthCheckTimer = t
  }

  private func stopHealthCheckTimer() {
    healthCheckTimer?.invalidate()
    healthCheckTimer = nil
  }

  // MARK: Stop recorder
  private func stopAudioRecorder() {
    if let r = audioRecorder, r.isRecording { r.stop() }
    audioRecorder = nil
  }

  // MARK: Local notifications (optional)
  private func notifyUser(message: String) {
    let content = UNMutableNotificationContent()
    content.title = "Audio recording"
    content.body = message
    content.sound = .default
    let req = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: nil)
    UNUserNotificationCenter.current().add(req, withCompletionHandler: nil)
  }

  private func requestNotificationPermissions() {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in }
  }
}

// MARK: - AVAudioRecorderDelegate
extension RecordAudioService: AVAudioRecorderDelegate {
  func audioRecorderDidFinishRecording(_ recorder: AVAudioRecorder, successfully flag: Bool) {
    // If we intentionally stopped, do nothing further.
    guard recordingState != .stopped else { return }

    // Emit the finished chunk to JS BEFORE incrementing index
    let finishedPath = recorder.url.path
    let finishedIndex = currentIndex
    print("Emitting RecordAudioChunk path=\(finishedPath) idx=\(finishedIndex) success=\(flag)")
    RecordAudioEvents.shared?.emit("RecordAudioChunk", [
      "path": finishedPath,
      "index": finishedIndex,
      "success": flag
    ])

    // Start next chunk
    currentIndex += 1
    startNewChunk(resolver: { _ in }, rejecter: { _, msg, _ in
      RecordAudioEvents.shared?.emit("RecordAudioError", ["message": msg ?? "Failed to start next chunk"])
    })
  }
}

