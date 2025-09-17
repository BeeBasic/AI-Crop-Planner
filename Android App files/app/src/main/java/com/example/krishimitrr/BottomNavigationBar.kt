package com.example.krishimitrr

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.example.krishimitrr.ui.theme.KrishiMitrrTheme
import com.example.krishimitrr.ui.theme.PrimaryGreen

// Sealed class for navigation items - NO ImageVector. Routes and Labels for HomeScreen's nav bar.
sealed class BottomNavItem(val route: String, val label: String) {
    object Home : BottomNavItem("home", "Home")
    object Chatbot : BottomNavItem("chatbot", "Chatbot")
    object Policies : BottomNavItem("policies", "Policies")
}

@Composable
fun BottomNavigationBar(
    selectedRoute: String,
    onItemSelected: (String) -> Unit
) {
    val items = listOf(
        BottomNavItem.Home,
        BottomNavItem.Chatbot, // Changed from KrishiSaathi
        BottomNavItem.Policies  // Changed from Schemes
    )

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface, 
        contentColor = MaterialTheme.colorScheme.onSurface 
    ) {
        items.forEach { item ->
            NavigationBarItem(
                icon = {}, // No icon
                label = { Text(item.label) },
                selected = selectedRoute == item.route,
                onClick = { onItemSelected(item.route) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = PrimaryGreen, 
                    unselectedIconColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                    selectedTextColor = PrimaryGreen, 
                    unselectedTextColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                    indicatorColor = MaterialTheme.colorScheme.surface 
                )
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun BottomNavigationBarPreview() {
    KrishiMitrrTheme {
        // Preview now uses the updated item routes/labels
        BottomNavigationBar(selectedRoute = BottomNavItem.Home.route, onItemSelected = {})
    }
}

@Preview(showBackground = true)
@Composable
fun BottomNavigationBarChatbotSelectedPreview() { // Renamed Preview for clarity
    KrishiMitrrTheme {
        BottomNavigationBar(selectedRoute = BottomNavItem.Chatbot.route, onItemSelected = {})
    }
}
