package com.sleepscan.app

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    setTheme(R.style.Theme_SleepScan_Splash) // dots → underscores
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_splash)

    // Ensure the layout draws at least once, then hold ~2s
    window.decorView.post {
      Handler(Looper.getMainLooper()).postDelayed({
        startActivity(Intent(this, MainActivity::class.java))
        overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        finish()
      }, 1500L)
    }
  }
}
