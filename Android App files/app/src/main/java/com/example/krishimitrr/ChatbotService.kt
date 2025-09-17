package com.example.krishimitrr

import io.ktor.client.plugins.HttpTimeout // Keep this for the plugin installation
import io.ktor.client.* 
import io.ktor.client.engine.cio.* 
import io.ktor.client.plugins.contentnegotiation.* 
import io.ktor.client.plugins.defaultRequest
import io.ktor.client.plugins.HttpRequestTimeoutException // Added for specific timeout exception
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.* 
import io.ktor.serialization.kotlinx.json.* 
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.channelFlow
import kotlinx.serialization.json.Json

class ChatbotService {

    private val jsonParser = Json {
        isLenient = true
        ignoreUnknownKeys = true
        prettyPrint = true
    }

    private val client = HttpClient(CIO) {
        // Install HttpTimeout plugin for longer timeouts
        install(HttpTimeout) {
            requestTimeoutMillis = 300000 // 5 minutes for the entire request
            connectTimeoutMillis = 60000  // 1 minute to connect
            socketTimeoutMillis = 300000  // 5 minutes between packets (for streaming)
        }

        install(ContentNegotiation) {
            json(Json { 
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true 
            })
        }
        defaultRequest {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            header("x-api-key", ApiConfig.API_KEY) 
        }
    }

    suspend fun testConnection() {
        println("[ChatbotService] Attempting connection test to base URL...")
        try {
            val baseUrl = ApiConfig.CHAT_API_URL.replace("/chat", "")
            println("[ChatbotService] Test URL: $baseUrl")
            val response: HttpResponse = client.get(baseUrl)
            println("[ChatbotService] Connection test response status: ${response.status}")
            println("[ChatbotService] Connection test response body (first 100 chars): ${response.bodyAsText().take(100)}")
        } catch (e: Exception) {
            println("[ChatbotService] Connection test FAILED: ${e.message}")
        }
    }

    fun getChatStream(prompt: String): Flow<ChatStreamResponse> = channelFlow {
        println("[ChatbotService] getChatStream called with prompt: '$prompt'")
        try {
            println("[ChatbotService] Preparing POST request to ${ApiConfig.CHAT_API_URL}")
            client.preparePost(ApiConfig.CHAT_API_URL) {
                setBody(ChatRequest(prompt = prompt))
                println("[ChatbotService] Request body set with prompt: '$prompt'")
            }.execute { httpResponse ->
                println("[ChatbotService] Received HTTP response. Status: ${httpResponse.status}")
                if (!httpResponse.status.isSuccess()) {
                    val errorBody = httpResponse.bodyAsText()
                    println("[ChatbotService] API Error: ${httpResponse.status} - $errorBody")
                    val errorResponse = ChatStreamResponse(token = "Error: Server returned ${httpResponse.status}. $errorBody", isDone = true)
                    send(errorResponse)
                    close(IllegalStateException("API request failed with status ${httpResponse.status}"))
                    return@execute
                }

                val responseChannel = httpResponse.bodyAsChannel()
                println("[ChatbotService] Reading response from channel...")
                while (!responseChannel.isClosedForRead) {
                    val line = responseChannel.readUTF8Line(limit = Int.MAX_VALUE)
                    if (line != null) {
                        println("[ChatbotService] Raw line received: '$line'")
                        if (line.isNotBlank()) { 
                            try {
                                val streamResponse = jsonParser.decodeFromString<ChatStreamResponse>(line)
                                println("[ChatbotService] Parsed line: $streamResponse")
                                send(streamResponse)
                                if (streamResponse.isDone) {
                                    println("[ChatbotService] 'isDone' received in stream, closing.")
                                    break
                                }
                            } catch (e: kotlinx.serialization.SerializationException) {
                                println("[ChatbotService] JSON Parsing Error: ${e.message} for line: '$line'")
                                val parseError = ChatStreamResponse(token = "Error: Could not understand server response. Details: ${e.message}", isDone = true)
                                send(parseError)
                                break 
                            } catch (e: Exception) {
                                println("[ChatbotService] Error during stream processing for line '$line': ${e.message}")
                                val lineError = ChatStreamResponse(token = "Error: Problem processing server message.", isDone = true)
                                send(lineError)
                                break 
                            }
                        }
                    } else {
                        println("[ChatbotService] Received null line (end of stream?).")
                        break 
                    }
                }
                println("[ChatbotService] Finished reading response channel.")
            }
        } catch (e: Exception) {
            println("[ChatbotService] Network or other error in getChatStream: ${e.message}") // This will now show the timeout error if it occurs
            val errorToken = if (e is HttpRequestTimeoutException) { // Changed to HttpRequestTimeoutException
                "Error: The request took too long to complete."
            } else {
                e.localizedMessage ?: "Could not connect to server or other network error."
            }
            val errorResponse = ChatStreamResponse(token = errorToken, isDone = true)
            send(errorResponse)
            close(e)
        }
        println("[ChatbotService] getChatStream flow processing complete.")
    }

    fun close() {
        println("[ChatbotService] Closing Ktor client.")
        client.close()
    }
}
