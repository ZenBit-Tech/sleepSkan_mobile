import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import AVFAudio
import TSBackgroundFetch

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()

    let s = AVAudioSession.sharedInstance()
    try? s.setCategory(.record, mode: .default, options: [.mixWithOthers, .allowBluetooth])
    // try? s.setActive(true)

    // audioRecorder?.prepareToRecord()
    // audioRecorder?.record(forDuration: chunkDuration)

    self.moduleName = "SleepScan"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    // [REQUIRED] Register BackgroundFetch
    TSBackgroundFetch.sharedInstance().didFinishLaunching();


    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func applicationDidEnterBackground(_ application: UIApplication) {
    // Defensive: keep session active when going to background
    try? AVAudioSession.sharedInstance().setActive(true)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
