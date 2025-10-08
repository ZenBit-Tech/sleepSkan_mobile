package com.sleepscan.app

import android.annotation.SuppressLint
import android.content.Context
import android.os.PowerManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WakeLockModule(private val ctx: ReactApplicationContext)
  : ReactContextBaseJavaModule(ctx) {

  private var wakeLock: PowerManager.WakeLock? = null

  override fun getName(): String = "WakeLock"

  @ReactMethod
  fun acquire(promise: Promise) {
    try {
      synchronized(this) {
        if (wakeLock?.isHeld != true) {
          val pm = ctx.getSystemService(Context.POWER_SERVICE) as PowerManager
          @SuppressLint("WakelockTimeout")
          run {
            wakeLock = pm.newWakeLock(
              PowerManager.PARTIAL_WAKE_LOCK,
              "SleepScan:Recorder"    // tag shown in dumpsys power
            ).apply {
              setReferenceCounted(false)
              acquire()               // hold until release()
            }
          }
        }
      }
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("wakelock", e)
    }
  }

  @ReactMethod
  fun release(promise: Promise) {
    try {
      synchronized(this) {
        wakeLock?.let { if (it.isHeld) it.release() }
        wakeLock = null
      }
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("wakelock", e)
    }
  }
}
