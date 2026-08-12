package com.example.kaya.ui.screens

import android.view.ViewGroup
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.example.kaya.data.models.HazardAlert
import com.example.kaya.camera.FrameAnalyzer
import com.example.kaya.network.SiteLensWebSocketClient
import com.example.kaya.ui.MainViewModel
import java.util.concurrent.Executors

@Composable
fun LiveMonitoringScreen(
    viewModel: MainViewModel,
    onStop: () -> Unit
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val haptic = LocalHapticFeedback.current
    val connectionState by viewModel.webSocketClient.connectionState.collectAsState()
    val latestAlert by viewModel.webSocketClient.latestAlert.collectAsState()
    val isProcessing by viewModel.webSocketClient.isProcessing.collectAsState()
    
    val isAutoEnabled by viewModel.isAutoMonitoring.collectAsState()
    val manualScanTriggered by viewModel.manualScanTriggered.collectAsState()

    var isPaused by remember { mutableStateOf(false) }
    val cameraExecutor = remember { Executors.newSingleThreadExecutor() }

    LaunchedEffect(latestAlert) {
        if (latestAlert?.severityLevel?.lowercase() == "critical") {
            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
        }
    }

    DisposableEffect(Unit) {
        viewModel.connectWebSocket()
        onDispose {
            viewModel.disconnectWebSocket()
            cameraExecutor.shutdown()
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        // Camera Preview
        if (!isPaused) {
            AndroidView(
                factory = { ctx ->
                    PreviewView(ctx).apply {
                        layoutParams = ViewGroup.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        )
                    }
                },
                modifier = Modifier.fillMaxSize(),
                update = { previewView ->
                    val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
                    cameraProviderFuture.addListener({
                        val cameraProvider = cameraProviderFuture.get()
                        val preview = Preview.Builder().build().also {
                            it.setSurfaceProvider(previewView.surfaceProvider)
                        }

                        val imageAnalysis = ImageAnalysis.Builder()
                            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                            .build()
                            .also {
                                it.setAnalyzer(cameraExecutor, FrameAnalyzer(
                                    isAutoEnabled = { viewModel.isAutoMonitoring.value },
                                    isManualTriggered = { viewModel.manualScanTriggered.value },
                                    onManualConsumed = { viewModel.onScanConsumed() },
                                    onFrameProcessed = { frame ->
                                        if (!isPaused) {
                                            viewModel.webSocketClient.sendFrame(frame)
                                        }
                                    }
                                ))
                            }

                        try {
                            cameraProvider.unbindAll()
                            cameraProvider.bindToLifecycle(
                                lifecycleOwner,
                                CameraSelector.DEFAULT_BACK_CAMERA,
                                preview,
                                imageAnalysis
                            )
                        } catch (e: Exception) {
                            e.printStackTrace()
                        }
                    }, ContextCompat.getMainExecutor(context))
                }
            )
        } else {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black),
                contentAlignment = Alignment.Center
            ) {
                Text("Monitoring Paused", color = Color.White, style = MaterialTheme.typography.headlineMedium)
            }
        }

        // Overlay UI
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                StatusChip(connectionState)
                Spacer(modifier = Modifier.width(8.dp))
                if (isAutoEnabled) {
                    Surface(
                        color = Color.Blue.copy(alpha = 0.6f),
                        shape = MaterialTheme.shapes.small
                    ) {
                        Text("Auto-Scan On (15s)", color = Color.White, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 4.dp))
                    }
                }
            }
            
            Spacer(modifier = Modifier.weight(1f))
            
            // Hazard Alert Banner
            Box(contentAlignment = Alignment.TopCenter, modifier = Modifier.fillMaxWidth()) {
                latestAlert?.let { alert ->
                    HazardAlertBanner(
                        alert = alert,
                        onDismiss = { viewModel.webSocketClient.clearAlert() }
                    )
                }
                
                if (isProcessing) {
                    Surface(
                        color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.9f),
                        shape = MaterialTheme.shapes.medium,
                        modifier = Modifier.padding(top = 8.dp),
                        shadowElevation = 4.dp
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                strokeWidth = 2.dp,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                "VLM ANALYZING...",
                                style = MaterialTheme.typography.labelLarge,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Controls
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.Black.copy(alpha = 0.4f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(8.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Auto-Toggle
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Switch(
                            checked = isAutoEnabled,
                            onCheckedChange = { viewModel.setAutoMonitoring(it) }
                        )
                        Text("Auto", color = Color.White, fontSize = 10.sp)
                    }

                    // Scan Button
                    Button(
                        onClick = { viewModel.triggerManualScan() },
                        enabled = !isPaused,
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        Icon(Icons.Default.Refresh, contentDescription = null)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("SCAN")
                    }

                    // Pause Button
                    IconButton(
                        onClick = { isPaused = !isPaused },
                        modifier = Modifier.background(MaterialTheme.colorScheme.surface.copy(alpha = 0.7f), MaterialTheme.shapes.medium)
                    ) {
                        Icon(
                            imageVector = if (isPaused) Icons.Default.PlayArrow else Icons.Default.Pause,
                            contentDescription = "Pause/Play",
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                    
                    // Stop Button
                    IconButton(
                        onClick = onStop,
                        modifier = Modifier.background(MaterialTheme.colorScheme.error.copy(alpha = 0.7f), MaterialTheme.shapes.medium)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Stop,
                            contentDescription = "Stop",
                            tint = Color.White
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun StatusChip(state: SiteLensWebSocketClient.ConnectionState) {
    val (text, color) = when (state) {
        is SiteLensWebSocketClient.ConnectionState.Connected -> "Connected" to Color.Green
        is SiteLensWebSocketClient.ConnectionState.Connecting -> "Connecting..." to Color.Yellow
        is SiteLensWebSocketClient.ConnectionState.Disconnected -> "Disconnected" to Color.Gray
        is SiteLensWebSocketClient.ConnectionState.Error -> "Error" to Color.Red
    }

    Surface(
        color = Color.Black.copy(alpha = 0.6f),
        shape = MaterialTheme.shapes.small,
        modifier = Modifier.padding(4.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .background(color, MaterialTheme.shapes.extraSmall)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(text = text, color = Color.White, fontSize = 12.sp)
        }
    }
}

@Composable
fun HazardAlertBanner(alert: HazardAlert, onDismiss: () -> Unit) {
    val isCritical = alert.severityLevel?.lowercase() == "critical"
    val backgroundColor = when (alert.severityLevel?.lowercase()) {
        "critical", "high" -> Color(0xFFFF1744) // Vibrant Red
        "medium", "warning" -> Color(0xFFFFAB40) // Alert Orange
        else -> Color(0xFF00E676) // Safety Green
    }
    
    val textColor = if (isCritical) Color.White else Color.Black

    Card(
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        modifier = Modifier.fillMaxWidth().heightIn(max = 300.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Box(modifier = Modifier.fillMaxWidth()) {
            // Content
            LazyColumn(modifier = Modifier.padding(16.dp).fillMaxWidth()) {
                item {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = if (isCritical) "🚨 CRITICAL ALERT" else "⚠️ SITE ALERT",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.ExtraBold,
                            color = textColor
                        )
                        Spacer(modifier = Modifier.weight(1f))
                        Text(
                            text = "Lvl: ${alert.severityLevel?.uppercase() ?: "INFO"}",
                            style = MaterialTheme.typography.labelMedium,
                            color = textColor.copy(alpha = 0.8f)
                        )
                        // Add some space for the close button
                        Spacer(modifier = Modifier.width(40.dp))
                    }
                }
                
                item { Spacer(modifier = Modifier.height(8.dp)) }
                
                item {
                    val detailText = alert.hazardsDetail ?: "No specific hazard detail."
                    Text(
                        text = detailText,
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Bold,
                        color = textColor
                    )
                }
                
                item {
                    if (!alert.imageSummary.isNullOrEmpty()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "SUMMARY:",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = textColor.copy(alpha = 0.7f)
                        )
                        Text(
                            text = alert.imageSummary,
                            style = MaterialTheme.typography.bodyMedium,
                            color = textColor,
                            lineHeight = 18.sp
                        )
                    }
                }

                item {
                    val decisionText = alert.decision ?: "No action required"
                    Spacer(modifier = Modifier.height(12.dp))
                    Surface(
                        color = textColor.copy(alpha = 0.2f),
                        shape = MaterialTheme.shapes.small
                    ) {
                        Text(
                            text = "ACTION: $decisionText",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Black,
                            color = textColor
                        )
                    }
                }
                
                item {
                    alert.sopReference?.let {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Ref: $it",
                            style = MaterialTheme.typography.labelSmall,
                            color = textColor.copy(alpha = 0.7f)
                        )
                    }
                }
            }

            // Close Button
            IconButton(
                onClick = onDismiss,
                modifier = Modifier.align(Alignment.TopEnd).padding(4.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Dismiss",
                    tint = textColor
                )
            }
        }
    }
}
