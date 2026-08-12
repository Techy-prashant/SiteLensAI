package com.example.kaya.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat

@Composable
fun CameraConnectScreen(
    onCameraReady: () -> Unit
) {
    val context = LocalContext.current
    var hasCameraPermission by remember {
        mutableStateOf(
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED
        )
    }

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission(),
        onResult = { granted ->
            hasCameraPermission = granted
        }
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        if (hasCameraPermission) {
            Text(
                text = "Camera Access Granted",
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.tertiary
            )
            Spacer(modifier = Modifier.height(16.dp))
            
            // Simplified Preview Placeholder
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
                    .background(Color.DarkGray),
                contentAlignment = Alignment.Center
            ) {
                Text("Camera Preview Ready", color = Color.White)
            }
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Button(
                onClick = onCameraReady,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Start Monitoring")
            }
        } else {
            Text(
                text = "Camera Permission Required",
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.error
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text("To monitor the site, we need access to your camera.")
            Spacer(modifier = Modifier.height(32.dp))
            Button(onClick = { launcher.launch(Manifest.permission.CAMERA) }) {
                Text("Grant Permission")
            }
        }
    }
}
