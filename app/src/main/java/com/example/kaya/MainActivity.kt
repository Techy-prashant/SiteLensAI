package com.example.kaya

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.compose.foundation.layout.fillMaxSize

import androidx.activity.viewModels
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.example.kaya.data.repo.SettingsRepository
import com.example.kaya.network.SiteLensApiService
import com.example.kaya.network.SiteLensWebSocketClient
import com.example.kaya.ui.MainViewModel
import com.example.kaya.ui.SiteLensNavHost
import com.example.kaya.ui.theme.SiteLensTheme
import kotlinx.serialization.json.Json
import okhttp3.OkHttpClient

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels {
        object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                val okHttpClient = OkHttpClient()
                val json = Json { ignoreUnknownKeys = true }
                val settingsRepo = SettingsRepository(applicationContext)
                val apiService = SiteLensApiService(okHttpClient, json)
                val wsClient = SiteLensWebSocketClient(okHttpClient, json)
                return MainViewModel(settingsRepo, apiService, wsClient) as T
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SiteLensTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    SiteLensNavHost(viewModel = viewModel)
                }
            }
        }
    }
}
