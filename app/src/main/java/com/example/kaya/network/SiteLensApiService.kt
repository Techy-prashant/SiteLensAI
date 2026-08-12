package com.example.kaya.network

import com.example.kaya.data.models.HazardAlert
import com.example.kaya.data.models.ServerHealth
import kotlinx.serialization.json.Json
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlinx.coroutines.suspendCancellableCoroutine

class SiteLensApiService(
    private val client: OkHttpClient,
    private val json: Json
) {
    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    suspend fun getHealth(baseUrl: String): ServerHealth {
        val request = Request.Builder()
            .url("$baseUrl/health")
            .build()

        return executeRequest(request)
    }

    suspend fun detectHazard(baseUrl: String, frameBase64: String): HazardAlert {
        val body = """{"frame": "$frameBase64"}""".toRequestBody(jsonMediaType)
        val request = Request.Builder()
            .url("$baseUrl/api/detect")
            .post(body)
            .build()

        return executeRequest(request)
    }

    private suspend inline fun <reified T> executeRequest(request: Request): T {
        return suspendCancellableCoroutine { continuation ->
            client.newCall(request).enqueue(object : Callback {
                override fun onResponse(call: Call, response: Response) {
                    response.use {
                        if (!response.isSuccessful) {
                            continuation.resumeWithException(IOException("Unexpected code $response"))
                            return
                        }
                        val body = response.body?.string()
                        if (body == null) {
                            continuation.resumeWithException(IOException("Empty body"))
                            return
                        }
                        try {
                            val result = json.decodeFromString<T>(body)
                            continuation.resume(result)
                        } catch (e: Exception) {
                            continuation.resumeWithException(e)
                        }
                    }
                }

                override fun onFailure(call: Call, e: IOException) {
                    continuation.resumeWithException(e)
                }
            })
        }
    }
}
