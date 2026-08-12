package com.example.kaya.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.kaya.ui.MainViewModel

@Composable
fun SiteEntryScreen(
    viewModel: MainViewModel,
    onSuccess: () -> Unit
) {
    var siteName by remember { mutableStateOf("") }
    val savedSiteName by viewModel.lastSiteName.collectAsState()
    
    LaunchedEffect(savedSiteName) {
        savedSiteName?.let { siteName = it }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Site Selection",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.height(32.dp))
        
        OutlinedTextField(
            value = siteName,
            onValueChange = { siteName = it },
            label = { Text("Site Name / Location") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Button(
            onClick = {
                if (siteName.isNotBlank()) {
                    viewModel.saveSiteName(siteName)
                    onSuccess()
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = siteName.isNotBlank()
        ) {
            Text("Enter Site")
        }
    }
}
