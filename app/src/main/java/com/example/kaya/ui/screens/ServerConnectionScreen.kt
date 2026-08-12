package com.example.kaya.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.kaya.ui.MainViewModel

@Composable
fun ServerConnectionScreen(
    viewModel: MainViewModel,
    onSuccess: () -> Unit
) {
    var address by remember { mutableStateOf("") }
    val healthStatus by viewModel.healthStatus.collectAsState()
    val isChecking by viewModel.isCheckingHealth.collectAsState()
    
    // Pre-fill if saved
    val savedAddress by viewModel.serverAddress.collectAsState()
    LaunchedEffect(savedAddress) {
        savedAddress?.let { address = it }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Server Configuration",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.height(32.dp))
        
        OutlinedTextField(
            value = address,
            onValueChange = { address = it },
            label = { Text("Server IP/URL (e.g. 192.168.1.100:8000)") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(
            onClick = {
                viewModel.saveServerAddress(address)
                viewModel.checkServerHealth()
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isChecking
        ) {
            if (isChecking) {
                CircularProgressIndicator(size = 24.dp, color = MaterialTheme.colorScheme.onPrimary)
            } else {
                Text("Test Connection")
            }
        }
        
        healthStatus?.let { status ->
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = status,
                color = if (status.contains("Connected")) MaterialTheme.colorScheme.tertiary else MaterialTheme.colorScheme.error
            )
            
            if (status.contains("Connected")) {
                Spacer(modifier = Modifier.height(32.dp))
                Button(
                    onClick = onSuccess,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.tertiary)
                ) {
                    Text("Continue", color = MaterialTheme.colorScheme.onTertiary)
                }
            }
        }
    }
}

@Composable
fun CircularProgressIndicator(size: androidx.compose.ui.unit.Dp, color: androidx.compose.ui.graphics.Color) {
    androidx.compose.material3.CircularProgressIndicator(
        modifier = Modifier.size(size),
        color = color,
        strokeWidth = 2.dp
    )
}
