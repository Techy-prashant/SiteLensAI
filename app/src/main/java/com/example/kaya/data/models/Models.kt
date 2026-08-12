package com.example.kaya.data.models

import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName

@Serializable
data class HazardAlert(
    @SerialName("type") val type: String,
    @SerialName("frame_number") val frameNumber: Int? = null,
    @SerialName("processing_time_ms") val processingTimeMs: Double? = null,
    @SerialName("hazard_detected") val hazardDetected: Boolean = false,
    @SerialName("severity_level") val severityLevel: String? = null,
    @SerialName("image_summary") val imageSummary: String? = null,
    @SerialName("hazards_detail") val hazardsDetail: String? = null,
    @SerialName("sop_reference") val sopReference: String? = null,
    @SerialName("decision") val decision: String? = null,
    @SerialName("decision_reasoning") val decisionReasoning: String? = null
)

@Serializable
data class ServerHealth(
    val status: String,
    val version: String? = null,
    val uptime: Double? = null
)

@Serializable
data class FrameMessage(
    val frame: String // Base64 encoded frame
)

@Serializable
data class PingMessage(
    val type: String = "ping",
    val timestamp: Long = System.currentTimeMillis()
)

@Serializable
data class QueryMessage(
    val type: String = "query",
    val query: String
)
