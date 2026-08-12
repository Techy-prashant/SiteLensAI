package com.example.kaya.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.kaya.data.models.HazardAlert
import com.example.kaya.data.models.ServerHealth
import com.example.kaya.data.repo.SettingsRepository
import com.example.kaya.network.SiteLensApiService
import com.example.kaya.network.SiteLensWebSocketClient
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class MainViewModel(
    private val settingsRepository: SettingsRepository,
    private val apiService: SiteLensApiService,
    val webSocketClient: SiteLensWebSocketClient,
    applicationContext: android.content.Context
) : ViewModel() {

    private val ttsHelper = TtsHelper(applicationContext)

    init {
        viewModelScope.launch {
            webSocketClient.latestAlert.collect { alert ->
                alert?.hazardsDetail?.let { hazards ->
                    if (hazards.isNotBlank() && hazards != "No specific hazard detail.") {
                        ttsHelper.speak(hazards)
                    }
                }
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        ttsHelper.shutdown()
    }

    val serverAddress = settingsRepository.serverAddress.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)
    val username = settingsRepository.username.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)
    val lastSiteName = settingsRepository.lastSiteName.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    private val _healthStatus = MutableStateFlow<String?>(null)
    val healthStatus: StateFlow<String?> = _healthStatus

    private val _isCheckingHealth = MutableStateFlow(false)
    val isCheckingHealth: StateFlow<Boolean> = _isCheckingHealth

    private val _isAutoMonitoring = MutableStateFlow(false) // Default to off as requested
    val isAutoMonitoring: StateFlow<Boolean> = _isAutoMonitoring

    private val _manualScanTriggered = MutableStateFlow(false)
    val manualScanTriggered: StateFlow<Boolean> = _manualScanTriggered

    fun setAutoMonitoring(enabled: Boolean) {
        _isAutoMonitoring.value = enabled
    }

    fun triggerManualScan() {
        _manualScanTriggered.value = true
    }

    fun onScanConsumed() {
        _manualScanTriggered.value = false
    }

    fun saveServerAddress(address: String) {
        viewModelScope.launch {
            settingsRepository.saveServerAddress(address)
        }
    }

    fun saveUsername(name: String) {
        viewModelScope.launch {
            settingsRepository.saveUsername(name)
        }
    }

    fun saveSiteName(siteName: String) {
        viewModelScope.launch {
            settingsRepository.saveLastSiteName(siteName)
        }
    }

    fun checkServerHealth() {
        val address = serverAddress.value ?: return
        val url = if (address.startsWith("http")) {
            address
        } else {
            "http://$address"
        }
        viewModelScope.launch {
            _isCheckingHealth.value = true
            try {
                val health = apiService.getHealth(url)
                _healthStatus.value = "Connected: ${health.status}"
            } catch (e: Exception) {
                _healthStatus.value = "Error: ${e.message}"
            } finally {
                _isCheckingHealth.value = false
            }
        }
    }

    fun connectWebSocket() {
        serverAddress.value?.let { address ->
            var wsUrl = if (address.startsWith("http")) {
                address.replace("http", "ws")
            } else {
                "ws://$address"
            }
            
            // Ensure the path is appended correctly
            if (!wsUrl.endsWith("/ws/stream")) {
                wsUrl = if (wsUrl.endsWith("/")) "${wsUrl}ws/stream" else "$wsUrl/ws/stream"
            }
            
            webSocketClient.connect(wsUrl)
        }
    }

    fun disconnectWebSocket() {
        webSocketClient.disconnect()
    }
}
