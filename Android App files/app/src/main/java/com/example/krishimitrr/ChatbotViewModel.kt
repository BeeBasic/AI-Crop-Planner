package com.example.krishimitrr

import androidx.compose.runtime.mutableStateListOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch

class ChatbotViewModel : ViewModel() {

    private val chatbotService = ChatbotService()

    private val _messages = mutableStateListOf<ChatMessage>()
    val messages: List<ChatMessage> = _messages

    // You might want to expose loading/error states as separate StateFlows for more granular UI updates
    // For now, we'll use the isLoading property in ChatMessage

    fun sendMessage(userPrompt: String) {
        if (userPrompt.isBlank()) return

        // Add user message to the list
        _messages.add(ChatMessage(text = userPrompt, sender = Sender.USER))

        // Add a temporary bot message that will be updated with the stream
        val botMessageId = java.util.UUID.randomUUID().toString()
        val tempBotMessage = ChatMessage(id = botMessageId, text = "", sender = Sender.BOT, isLoading = true)
        _messages.add(tempBotMessage)

        viewModelScope.launch {
            chatbotService.getChatStream(userPrompt)
                .onEach { streamResponse ->
                    val existingBotMessageIndex = _messages.indexOfFirst { it.id == botMessageId }
                    if (existingBotMessageIndex != -1) {
                        val currentBotMessage = _messages[existingBotMessageIndex]
                        val updatedText = currentBotMessage.text + (streamResponse.token ?: "")
                        _messages[existingBotMessageIndex] = currentBotMessage.copy(
                            text = updatedText,
                            isLoading = !streamResponse.isDone // Stop loading when done
                        )
                    }
                }
                .catch { e ->
                    // Handle errors, e.g., update the bot message to show an error
                    val existingBotMessageIndex = _messages.indexOfFirst { it.id == botMessageId }
                    if (existingBotMessageIndex != -1) {
                        _messages[existingBotMessageIndex] = _messages[existingBotMessageIndex].copy(
                            text = "Error: ${e.localizedMessage ?: "Failed to get response"}",
                            isLoading = false
                        )
                    }
                    println("ChatbotViewModel Error: ${e.message}")
                }
                .launchIn(viewModelScope) // Collect the flow within the viewModelScope
        }
    }

    override fun onCleared() {
        super.onCleared()
        chatbotService.close() // Release Ktor client resources
    }
}
