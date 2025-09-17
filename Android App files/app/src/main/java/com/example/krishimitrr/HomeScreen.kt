package com.example.krishimitrr

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.krishimitrr.ui.theme.*
import java.util.Calendar

// Import the BottomNavItem from BottomNavigationBar.kt
import com.example.krishimitrr.BottomNavItem 

// Dummy data classes for UI representation (remain the same)
data class Crop(val iconPlaceholder: String, val name: String, val trendUp: Boolean)
data class MarketPrice(val name: String, val price: String)
data class SchemeHighlight(val title: String, val deadline: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen() { 
    var selectedItemRoute by remember { mutableStateOf(BottomNavItem.Home.route) } 
    val navItems = listOf(BottomNavItem.Home, BottomNavItem.Chatbot, BottomNavItem.Policies)

    Scaffold(
        bottomBar = {
            BottomNavigationBar(
                selectedRoute = selectedItemRoute,
                onItemSelected = { route -> selectedItemRoute = route }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .padding(innerPadding) 
                .fillMaxSize()
                .background(WarmOffWhite) 
        ) {
            when (selectedItemRoute) {
                BottomNavItem.Home.route -> HomeContent(onNavigateToPoliciesTab = { 
                    selectedItemRoute = BottomNavItem.Policies.route
                })
                BottomNavItem.Chatbot.route -> ChatbotScreenPlaceholder()
                BottomNavItem.Policies.route -> PoliciesScreenPlaceholder()
            }
        }
    }
}

@Composable
fun HomeContent(onNavigateToPoliciesTab: () -> Unit) {
    val userName = "Kisan Mitra"
    val greeting = getGreeting()

    val weatherIconPlaceholder = "Weather"
    val currentTemp = "28°C"
    val highLowTemp = "32°C / 22°C"
    val forecast = "Sunny with afternoon clouds"
    val humidity = "65%"
    val windSpeed = "10 km/h"

    val topCrops = listOf(
        Crop("Crop1", "Wheat", true),
        Crop("Crop2", "Rice", false),
        Crop("Crop3", "Maize", true)
    )

    val marketPrices = listOf(
        MarketPrice("Tomato", "₹25/kg"),
        MarketPrice("Onion", "₹30/kg"),
        MarketPrice("Potato", "₹20/kg"),
        MarketPrice("Wheat", "₹22/kg")
    )

    val featuredScheme = SchemeHighlight("PM Fasal Bima Yojana", "Deadline: July 31st")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 20.dp) 
    ) {
        GreetingSection(greeting = greeting, userName = userName)
        Spacer(modifier = Modifier.height(24.dp))

        TodayWeatherCard(
            iconPlaceholder = weatherIconPlaceholder, currentTemp = currentTemp, highLow = highLowTemp,
            forecast = forecast, humidity = humidity, windSpeed = windSpeed
        )
        Spacer(modifier = Modifier.height(20.dp))

        InDemandCropsCard(crops = topCrops)
        Spacer(modifier = Modifier.height(20.dp))

        CropPricingCard(prices = marketPrices)
        Spacer(modifier = Modifier.height(20.dp))

        GovernmentSchemeHighlightCard(
            scheme = featuredScheme,
            onLearnMoreClicked = onNavigateToPoliciesTab 
        )
        Spacer(modifier = Modifier.height(20.dp))
    }
}

@Composable
fun ChatbotScreenPlaceholder() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Chatbot Screen - Coming Soon!", style = MaterialTheme. typography.headlineMedium)
    }
}

@Composable
fun PoliciesScreenPlaceholder() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Government Policies Screen - Coming Soon!", style = MaterialTheme.typography.headlineMedium)
    }
}


@Composable
fun GreetingSection(greeting: String, userName: String) {
    Column(horizontalAlignment = Alignment.Start) {
        Text(
            text = "$greeting, $userName!",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = DarkGrayText // Main greeting remains DarkGrayText for prominence
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "Your soil is your wealth!",
            style = MaterialTheme.typography.bodyMedium,
            color = DarkGreen // Changed to DarkGreen
        )
    }
}

fun getGreeting(): String {
    return when (Calendar.getInstance().get(Calendar.HOUR_OF_DAY)) {
        in 0..11 -> "Good Morning"
        in 12..16 -> "Good Afternoon"
        else -> "Good Evening"
    }
}

@Composable
fun TodayWeatherCard(
    iconPlaceholder: String, currentTemp: String, highLow: String,
    forecast: String, humidity: String, windSpeed: String
) {
    DefaultCard {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(text = iconPlaceholder, modifier = Modifier.size(48.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(currentTemp, style = MaterialTheme.typography.headlineMedium, color = DarkGrayText)
                    Text(highLow, style = MaterialTheme.typography.bodySmall, color = DarkGrayText.copy(alpha = 0.7f))
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(forecast, style = MaterialTheme.typography.titleSmall, color = DarkGreen) // Title changed to DarkGreen
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                WeatherMetric(iconPlaceholder = "Hum", label = "Humidity", value = humidity)
                WeatherMetric(iconPlaceholder = "Wind", label = "Wind", value = windSpeed)
                WeatherMetric(iconPlaceholder = "Temp", label = "Feels like", value = "29°C")
            }
        }
    }
}

@Composable
fun WeatherMetric(iconPlaceholder: String, label: String, value: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(text = iconPlaceholder, modifier = Modifier.size(20.dp))
        Spacer(modifier = Modifier.width(4.dp))
        Text("$value", style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.SemiBold, color = DarkGrayText)
    }
}

@Composable
fun InDemandCropsCard(crops: List<Crop>) {
    DefaultCard {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Top Crops in Demand", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = DarkGreen) // Title changed to DarkGreen
            Spacer(modifier = Modifier.height(12.dp))
            Row(modifier = Modifier.horizontalScroll(rememberScrollState())) {
                crops.forEachIndexed { index, crop ->
                    CropItem(crop)
                    if (index < crops.size - 1) Spacer(modifier = Modifier.width(16.dp))
                }
            }
        }
    }
}

@Composable
fun CropItem(crop: Crop) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(80.dp)) {
        Text(text = crop.iconPlaceholder, modifier = Modifier.size(40.dp))
        Spacer(modifier = Modifier.height(6.dp))
        Text(crop.name, style = MaterialTheme.typography.bodySmall, maxLines = 1, overflow = TextOverflow.Ellipsis, color = DarkGrayText)
        Text(if (crop.trendUp) "Up" else "Down", modifier = Modifier.size(16.dp))
    }
}

@Composable
fun CropPricingCard(prices: List<MarketPrice>) {
    DefaultCard {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Market Prices Today", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = DarkGreen) // Title changed to DarkGreen
            Spacer(modifier = Modifier.height(12.dp))
            prices.take(3).forEach { price ->
                MarketPriceItem(price)
                Divider(color = DarkGrayText.copy(alpha = 0.1f), thickness = 1.dp, modifier = Modifier.padding(vertical = 8.dp))
            }
            if (prices.size > 3) {
                TextButton(onClick = { /* TODO: Handle View More */ }, modifier = Modifier.align(Alignment.End)) {
                    Text("View More", color = PrimaryGreen, style = MaterialTheme.typography.labelLarge)
                }
            }
        }
    }
}

@Composable
fun MarketPriceItem(price: MarketPrice) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
        Text(price.name, style = MaterialTheme.typography.bodyMedium, color = DarkGrayText)
        Text(price.price, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, color = PrimaryGreen)
    }
}

@Composable
fun GovernmentSchemeHighlightCard(scheme: SchemeHighlight, onLearnMoreClicked: () -> Unit) {
    DefaultCard {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Featured Scheme", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = DarkGreen) // Title changed to DarkGreen
            Spacer(modifier = Modifier.height(12.dp))
            Text(scheme.title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold, color = PrimaryGreen) // Scheme title changed to PrimaryGreen
            Spacer(modifier = Modifier.height(4.dp))
            Text(scheme.deadline, style = MaterialTheme.typography.bodySmall, color = DarkGrayText.copy(alpha = 0.7f))
            Spacer(modifier = Modifier.height(12.dp))
            Button(
                onClick = onLearnMoreClicked,
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = PrimaryGreen),
                modifier = Modifier.align(Alignment.End)
            ) {
                Text("Learn More", color = Color.White)
            }
        }
    }
}

@Composable
fun DefaultCard(content: @Composable ColumnScope.() -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        colors = CardDefaults.cardColors(containerColor = LightGreenCardBackground), // Changed to LightGreenCardBackground
        content = content
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Preview(showBackground = true, widthDp = 390, heightDp = 844)
@Composable
fun HomeScreenPreview() {
    KrishiMitrrTheme {
        HomeScreen()
    }
}
