package com.example.krishimitrr

import androidx.compose.foundation.background // Added this import
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.krishimitrr.ui.theme.KrishiMitrrTheme
import com.example.krishimitrr.ui.theme.PrimaryGreen
import com.example.krishimitrr.ui.theme.DarkGreen
import com.example.krishimitrr.ui.theme.WarmOffWhite
import com.example.krishimitrr.ui.theme.DarkGrayText

// Data class for Scheme Information
data class SchemeInfo(
    val name: String,
    val description: String,
    val status: String, // e.g., "Active", "Ending Soon"
    val statusColor: Color // Color for the status tag
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SchemesScreen() {
    val schemes = listOf(
        SchemeInfo(
            name = "PM-KISAN Samman Nidhi",
            description = "Income support for all landholding farmers.",
            status = "Active",
            statusColor = PrimaryGreen
        ),
        SchemeInfo(
            name = "National Mission on Sustainable Agriculture (NMSA)",
            description = "Enhancing agricultural productivity in a sustainable manner.",
            status = "Active",
            statusColor = PrimaryGreen
        ),
        SchemeInfo(
            name = "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            description = "Insurance cover against failure of any notified crop.",
            status = "Active",
            statusColor = PrimaryGreen
        ),
        SchemeInfo(
            name = "Soil Health Card Scheme",
            description = "Assisting farmers to improve soil health and fertility.",
            status = "Ending Soon",
            statusColor = Color(0xFFFFA500) // Orange for 'Ending Soon'
        ),
        SchemeInfo(
            name = "Micro Irrigation Fund (MIF)",
            description = "Financial assistance for expanding micro-irrigation coverage.",
            status = "Active",
            statusColor = PrimaryGreen
        )
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Government Schemes", color = Color.White) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = PrimaryGreen
                )
            )
        },
        containerColor = WarmOffWhite
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            Text(
                text = "Benefits and Support for You",
                style = MaterialTheme.typography.titleMedium,
                color = DarkGrayText.copy(alpha = 0.8f),
                modifier = Modifier.padding(bottom = 16.dp, top = 8.dp)
            )

            LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                items(schemes) { scheme ->
                    SchemeCard(scheme = scheme)
                }
            }
        }
    }
}

@Composable
fun SchemeCard(scheme: SchemeInfo) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = scheme.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = DarkGreen,
                    modifier = Modifier.weight(1f, fill = false) // Prevents text from pushing tag off-screen
                )
                StatusTag(status = scheme.status, color = scheme.statusColor)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = scheme.description,
                style = MaterialTheme.typography.bodyMedium,
                color = DarkGrayText.copy(alpha = 0.9f),
                lineHeight = 20.sp
            )
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = { /* TODO: Handle Apply Now / Learn More */ },
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryGreen),
                modifier = Modifier.align(Alignment.End)
            ) {
                Text("Apply Now / Learn More", color = Color.White, fontSize = 14.sp)
            }
        }
    }
}

@Composable
fun StatusTag(status: String, color: Color) {
    Box(
        modifier = Modifier
            .background(color = color.copy(alpha = 0.15f), shape = RoundedCornerShape(6.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = status,
            color = color, // Use the more saturated version of the color for text
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium
        )
    }
}

@Preview(showBackground = true, widthDp = 390, heightDp = 844)
@Composable
fun SchemesScreenPreview() {
    KrishiMitrrTheme {
        SchemesScreen()
    }
}
