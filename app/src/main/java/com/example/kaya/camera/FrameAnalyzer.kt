package com.example.kaya.camera

import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy

/**
 * Implementation of [ImageAnalysis.Analyzer] that processes camera frames.
 * Includes throttling logic to emit frames at a controlled rate.
 */
class FrameAnalyzer(
    private val isAutoEnabled: () -> Boolean,
    private val isManualTriggered: () -> Boolean,
    private val onManualConsumed: () -> Unit,
    private val onFrameProcessed: (String) -> Unit
) : ImageAnalysis.Analyzer {

    private var lastAnalyzedTimestamp = 0L
    private val throttleIntervalMs = 15000L // 15 seconds

    override fun analyze(image: ImageProxy) {
        val currentTimestamp = System.currentTimeMillis()
        val manualRequested = isManualTriggered()
        val autoEnabled = isAutoEnabled()
        
        val shouldAnalyze = manualRequested || 
                (autoEnabled && (currentTimestamp - lastAnalyzedTimestamp) >= throttleIntervalMs)

        if (shouldAnalyze) {
            if (manualRequested) {
                onManualConsumed()
                android.util.Log.d("SCAN", "Manual scan triggered")
            } else {
                android.util.Log.d("SCAN", "Auto-scan triggered (15s interval)")
            }
            lastAnalyzedTimestamp = currentTimestamp
            
            ImageUtils.imageProxyToBase64(image)?.let { onFrameProcessed(it) }
        } else {
            image.close()
        }
    }
}
