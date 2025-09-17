package com.example.krishimitrr

import android.graphics.Color as AndroidColor // Import for android.R.color.transparent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.example.krishimitrr.ui.theme.KrishiMitrrTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Set the window background to transparent
        // This allows the Composables to fully control their background
        window.setBackgroundDrawableResource(android.R.color.transparent)

        setContent {
            KrishiMitrrTheme {
                // The KrishiMitrrTheme already has its background set to Color.Transparent
                // So this area will be transparent unless LoginScreen or HomeScreen draws something.
                var isLoggedIn by remember { mutableStateOf(false) }

                if (isLoggedIn) {
                    HomeScreen() // HomeScreen includes GrowingPolygonsBackground
                } else {
                    LoginScreen(onLoginSuccess = { isLoggedIn = true }) // LoginScreen includes GrowingPolygonsBackground
                }
            }
        }
    }
}
