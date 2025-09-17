package com.example.krishimitrr.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Using the custom colors defined in Color.kt
private val LightColorScheme = lightColorScheme(
    primary = PrimaryGreen,
    onPrimary = Color.White, // Text/icons on primary color
    secondary = DarkGreen,    // Accent color
    onSecondary = Color.White, // Text/icons on secondary color
    background = Color.Transparent, // Changed from WarmOffWhite
    onBackground = DarkGrayText,
    surface = WarmOffWhite,   // Cards, sheets, and menus will still use WarmOffWhite
    onSurface = DarkGrayText, // Text/icons on surface
    error = Color(0xFFB00020), // Standard error color
    onError = Color.White
)

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryGreen, 
    onPrimary = Color.White,
    secondary = DarkGreen, 
    onSecondary = Color.White,
    background = Color.Transparent, // Changed from Color(0xFF121212)
    onBackground = WarmOffWhite, 
    surface = Color(0xFF1E1E1E),   // Dark surface for cards, etc.
    onSurface = WarmOffWhite,   
    error = Color(0xFFCF6679), 
    onError = Color.Black
)

@Composable
fun KrishiMitrrTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            // Set status bar color
            // If background is transparent, status bar might need a specific color or to be transparent too.
            // For now, let's keep it based on surface or primary as before.
            window.statusBarColor = if (darkTheme) DarkColorScheme.surface.toArgb() else PrimaryGreen.toArgb()
            // Setting window background to transparent if it's not already handled by themes for full transparency
            // window.setBackgroundDrawableResource(android.R.color.transparent) // Potentially needed for full transparency
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = AppTypography, 
        content = content
    )
}
