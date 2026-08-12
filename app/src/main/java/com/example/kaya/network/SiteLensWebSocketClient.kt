package com.example.kaya.network

import android.util.Log
import com.example.kaya.data.models.HazardAlert
import com.example.kaya.data.models.FrameMessage
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import okhttp3.*
import java.util.concurrent.TimeUnit
import kotlin.math.pow

class SiteLensWebSocketClient(
    private val client: OkHttpClient,
    private val json: Json
) {
    private var webSocket: WebSocket? = null
    private var connectionJob: Job? = null
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    private val _connectionState = MutableStateFlow<ConnectionState>(ConnectionState.Disconnected)
    val connectionState: StateFlow<ConnectionState> = _connectionState

    private val _latestAlert = MutableStateFlow<HazardAlert?>(null)
    val latestAlert: StateFlow<HazardAlert?> = _latestAlert

    private val _isProcessing = MutableStateFlow(false)
    val isProcessing: StateFlow<Boolean> = _isProcessing

    private var currentUrl: String? = null
    private var retryCount = 0

    sealed class ConnectionState {
        object Connected : ConnectionState()
        object Connecting : ConnectionState()
        object Disconnected : ConnectionState()
        data class Error(val message: String) : ConnectionState()
    }

    fun connect(url: String) {
        currentUrl = url
        retryCount = 0
        startConnection(url)
    }

    private fun startConnection(url: String) {
        connectionJob?.cancel()
        connectionJob = scope.launch {
            _connectionState.value = ConnectionState.Connecting
            val request = Request.Builder().url(url).build()
            webSocket = client.newWebSocket(request, createListener())
        }
    }

    fun disconnect() {
        webSocket?.close(1000, "User disconnected")
        webSocket = null
        connectionJob?.cancel()
        _connectionState.value = ConnectionState.Disconnected
    }

    fun clearAlert() {
        _latestAlert.value = null
    }

    fun sendFrame(frameBase64: String) {
        _isProcessing.value = true // Show "Analyzing..." state in UI
        val message = FrameMessage(frame = frameBase64)
        val jsonString = json.encodeToString(message)
        Log.d("WS_SEND", "Sending frame (Size: ${jsonString.length / 1024} KB)")
        webSocket?.send(jsonString)
    }

    private fun createListener() = object : WebSocketListener() {
        override fun onOpen(webSocket: WebSocket, response: Response) {
            Log.d("WS", "Connected to ${currentUrl}")
            _connectionState.value = ConnectionState.Connected
            _isProcessing.value = false
            retryCount = 0
        }

        override fun onMessage(webSocket: WebSocket, text: String) {
            Log.d("WS_PAYLOAD", "Received: $text")
            _isProcessing.value = false // Response received, stop loading state
            try {
                val alert = json.decodeFromString<HazardAlert>(text)
                // Always update for 'alert' type, or if we get a result
                if (alert.type == "alert" || alert.hazardDetected || alert.imageSummary != null) {
                    _latestAlert.value = alert
                } else if (alert.type == "frame_skipped") {
                    Log.d("WS", "Server skipped frame ${alert.frameNumber}")
                }
            } catch (e: Exception) {
                Log.e("WS", "Error parsing message: $text", e)
            }
        }

        override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
            _connectionState.value = ConnectionState.Disconnected
        }

        override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
            Log.e("WS", "Connection failure", t)
            _connectionState.value = ConnectionState.Error(t.message ?: "Unknown error")
            attemptReconnect()
        }

        override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
            if (_connectionState.value !is ConnectionState.Disconnected) {
                attemptReconnect()
            }
        }
    }

    private fun attemptReconnect() {
        val url = currentUrl ?: return
        scope.launch {
            val delayMillis = (2.0.pow(retryCount.toDouble()) * 1000).toLong().coerceAtMost(30000L)
            Log.d("WS", "Attempting reconnect in ${delayMillis}ms (retry $retryCount)")
            delay(delayMillis)
            retryCount++
            startConnection(url)
        }
    }
}
