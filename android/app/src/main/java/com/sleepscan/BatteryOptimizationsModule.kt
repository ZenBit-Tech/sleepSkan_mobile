package com.sleepscan.app

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.PowerManager
import android.provider.Settings
import com.facebook.react.bridge.*

class BatteryOptimizationsModule(private val rc: ReactApplicationContext)
  : ReactContextBaseJavaModule(rc) {

  override fun getName(): String = "BatteryOptimizations"

  @ReactMethod
  fun isIgnoring(promise: Promise) {
    try {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
        promise.resolve(true); return
      }
      val pm = rc.getSystemService(ReactApplicationContext.POWER_SERVICE) as PowerManager
      promise.resolve(pm.isIgnoringBatteryOptimizations(rc.packageName))
    } catch (e: Exception) {
      promise.reject("battery_opt", e)
    }
  }

  @ReactMethod
  fun requestIgnore(promise: Promise) {
    try {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
        promise.resolve(true); return
      }
      val pkg = rc.packageName
      val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
        .setData(Uri.parse("package:$pkg"))
        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

      val current = currentActivity
      if (current != null) current.startActivity(intent) else rc.startActivity(intent)

      promise.resolve(true)
    } catch (e: Exception) {
      // Fallback to the list screen
      try {
        val fallback = Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)
          .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        rc.startActivity(fallback)
        promise.resolve(true)
      } catch (e2: Exception) {
        promise.reject("battery_opt", e2)
      }
    }
  }
}
