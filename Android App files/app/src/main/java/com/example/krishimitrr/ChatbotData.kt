package com.example.krishimitrr

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class ChatRequest(
    val prompt: String
)

@Serializable
data class ChatStreamResponse(
    @SerialName("response") // Matches the JSON key from your Python example
    val token: String? = null, // The actual text token
    
    @SerialName("done") // Matches the JSON key
    val isDone: Boolean = false, // Indicates if the generation is complete

    // Ollama sometimes includes other fields, you can add them if needed
    // e.g., @SerialName("model") val model: String? = null,
    // @SerialName("created_at") val createdAt: String? = null,
    // @SerialName("total_duration") val totalDuration: Long? = null,
    // @SerialName("load_duration") val loadDuration: Long? = null,
    // @SerialName("prompt_eval_count") val promptEvalCount: Int? = null,
    // @SerialName("eval_count") val evalCount: Int? = null,
    // @SerialName("eval_duration") val evalDuration: Long? = null
)

// Represents a single message in the chat UI
data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val text: String,
    val sender: Sender,
    var isLoading: Boolean = false // For bot messages, to show a loading indicator
)

enum class Sender {
    USER, BOT
}
