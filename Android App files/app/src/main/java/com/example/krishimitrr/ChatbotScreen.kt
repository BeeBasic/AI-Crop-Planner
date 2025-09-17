package com.example.krishimitrr

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.krishimitrr.ui.theme.DarkGreen
import com.example.krishimitrr.ui.theme.LightGreenCardBackground
import com.example.krishimitrr.ui.theme.PrimaryGreen
import com.example.krishimitrr.ui.theme.WarmOffWhite
import kotlinx.coroutines.launch

@Composable
fun ChatbotScreen(viewModel: ChatbotViewModel = viewModel()) {
    val messages by remember { derivedStateOf { viewModel.messages } }
    var userInput by remember { mutableStateOf(TextFieldValue("")) }
    val listState = rememberLazyListState()
    val coroutineScope = rememberCoroutineScope()

    // Automatically scroll to the bottom when new messages are added
    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            coroutineScope.launch {
                listState.animateScrollToItem(messages.size - 1)
            }
        }
    }

    Scaffold(
        bottomBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp)
                    .background(WarmOffWhite),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = userInput,
                    onValueChange = { userInput = it },
                    placeholder = { Text("Type your message...") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                IconButton(
                    onClick = {
                        if (userInput.text.isNotBlank()) {
                            viewModel.sendMessage(userInput.text)
                            userInput = TextFieldValue("")
                        }
                    },
                    colors = IconButtonDefaults.iconButtonColors(containerColor = PrimaryGreen)
                ) {
                    Icon(Icons.Filled.Send, contentDescription = "Send", tint = Color.White)
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(WarmOffWhite)
        ) {
            LazyColumn(
                state = listState,
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                contentPadding = PaddingValues(vertical = 8.dp)
            ) {
                items(messages, key = { it.id }) { message ->
                    ChatBubble(message = message)
                }
            }
        }
    }
}

@Composable
fun ChatBubble(message: ChatMessage) {
    val alignment = if (message.sender == Sender.USER) Alignment.CenterEnd else Alignment.CenterStart
    val backgroundColor = when {
        message.sender == Sender.USER -> PrimaryGreen
        message.isLoading -> LightGreenCardBackground.copy(alpha = 0.7f)
        else -> LightGreenCardBackground
    }
    val textColor = if (message.sender == Sender.USER) Color.White else Color.Black

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(
                start = if (message.sender == Sender.USER) 40.dp else 0.dp,
                end = if (message.sender == Sender.BOT) 40.dp else 0.dp
            ),
        contentAlignment = alignment
    ) {
        Row(verticalAlignment = Alignment.Bottom) {
             if (message.sender == Sender.BOT && message.isLoading && message.text.isEmpty()) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp).padding(end = 4.dp),
                    strokeWidth = 2.dp,
                    color = DarkGreen
                )
            }
            Text(
                text = if (message.sender == Sender.BOT && message.isLoading && message.text.isEmpty()) "Typing..." else message.text,
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(backgroundColor)
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                color = textColor,
                fontSize = 16.sp
            )
        }
    }
}
