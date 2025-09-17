package com.example.krishimitrr.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
// Import Poppins if you have it as a font resource
// import androidx.compose.ui.text.font.Font
// import com.example.krishimitrr.R

// If using Poppins, define the FontFamily
/*
val PoppinsFamily = FontFamily(
    Font(R.font.poppins_regular, FontWeight.Normal),
    Font(R.font.poppins_medium, FontWeight.Medium),
    Font(R.font.poppins_semibold, FontWeight.SemiBold),
    Font(R.font.poppins_bold, FontWeight.Bold)
)
*/

// Default Typography - Replace with Roboto or Poppins as per your choice
// For this example, we'll use the default FontFamily and define styles.
// If you use PoppinsFamily, replace FontFamily.Default with PoppinsFamily.

val AppTypography = Typography(
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily if using Poppins
        fontWeight = FontWeight.Bold,
        fontSize = 32.sp,
        lineHeight = 40.sp,
        letterSpacing = 0.sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 36.sp,
        letterSpacing = 0.sp
    ),
    headlineSmall = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp,
        lineHeight = 32.sp,
        letterSpacing = 0.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.SemiBold, // Or FontWeight.Medium for Poppins
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.SemiBold, // Or FontWeight.Medium for Poppins
        fontSize = 18.sp, // Adjusted from 16.sp from M3 default
        lineHeight = 24.sp,
        letterSpacing = 0.15.sp
    ),
    titleSmall = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.Bold,    // Or FontWeight.Medium for Poppins
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.1.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.5.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.25.sp
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.4.sp
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.1.sp
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default, // Replace with PoppinsFamily
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp
    )
)

// Remember to add Poppins font files to res/font directory
// and uncomment the FontFamily definition above if you choose to use Poppins.
