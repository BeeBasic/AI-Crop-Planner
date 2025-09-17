package com.example.krishimitrr

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.krishimitrr.ui.theme.*
import java.util.Calendar


data class Crop(val iconPlaceholder: String, val name: String, val trendUp: Boolean)
data class MarketPrice(val name: String, val price: String)
data class SchemeHighlight(val title: String, val deadline: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(homeScreenViewModel: HomeScreenViewModel = viewModel()) {
    var selectedItemRoute by remember { mutableStateOf(BottomNavItem.Home.route) }

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
                BottomNavItem.Home.route -> HomeContent(
                    viewModel = homeScreenViewModel,
                    onNavigateToPoliciesTab = { selectedItemRoute = BottomNavItem.Policies.route }
                )
                BottomNavItem.Chatbot.route -> ChatbotScreen() // Make sure ChatbotScreen is defined
                BottomNavItem.Policies.route -> PoliciesScreenPlaceholder()
            }
        }
    }
}

@Composable
fun HomeContent(viewModel: HomeScreenViewModel, onNavigateToPoliciesTab: () -> Unit) {
    val userName = "Kisan Mitra"
    val greeting = getGreeting()
    val context = LocalContext.current // Keep context if needed for other things, or remove

    var latitudeText by remember { mutableStateOf("") }
    var longitudeText by remember { mutableStateOf("") }

    val weatherData by viewModel.weatherData.collectAsStateWithLifecycle()
    val soilData by viewModel.soilData.collectAsStateWithLifecycle()
    val isLoading by viewModel.isLoading.collectAsStateWithLifecycle()
    val errorMessage by viewModel.errorMessage.collectAsStateWithLifecycle()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 20.dp)
    ) {
        GreetingSection(greeting = greeting, userName = userName)
        Spacer(modifier = Modifier.height(16.dp))

        // Latitude and Longitude Input Fields
        OutlinedTextField(
            value = latitudeText,
            onValueChange = { latitudeText = it },
            label = { Text("Enter Latitude") },
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
        )
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
            value = longitudeText,
            onValueChange = { longitudeText = it },
            label = { Text("Enter Longitude") },
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
        )
        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                val lat = latitudeText.toDoubleOrNull()
                val lon = longitudeText.toDoubleOrNull()
                if (lat != null && lon != null) {
                    viewModel.fetchEnvironmentalData(lat, lon)
                } else {
                    // Optionally, show a temporary error/toast to user about invalid input
                    Log.e("HomeContent", "Invalid latitude or longitude input")
                }
            },
            modifier = Modifier.align(Alignment.CenterHorizontally),
            enabled = !isLoading
        ) {
            Text("Fetch Environmental Data")
        }
        Spacer(modifier = Modifier.height(16.dp))

        if (isLoading) {
            CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
            Spacer(modifier = Modifier.height(16.dp))
        }

        errorMessage?.let {
            Text(
                text = it,
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier
                    .padding(vertical = 8.dp)
                    .fillMaxWidth(),
                textAlign = TextAlign.Center
            )
            Button(
                onClick = { viewModel.clearErrorMessage() },
                modifier = Modifier.align(Alignment.CenterHorizontally)
            ) {
                Text("Dismiss Error")
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        TodayWeatherCard(weatherData = weatherData)
        Spacer(modifier = Modifier.height(20.dp))

        SoilDataCard(soilData = soilData)
        Spacer(modifier = Modifier.height(20.dp))

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
fun TodayWeatherCard(weatherData: UIDisplayWeatherData?) {
    DefaultCard {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Current Weather", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = DarkGreen)
            Spacer(modifier = Modifier.height(12.dp))
            if (weatherData != null) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(text = "☀️", style = MaterialTheme.typography.headlineLarge, modifier = Modifier.size(48.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(weatherData.temperature ?: "N/A", style = MaterialTheme.typography.headlineMedium, color = DarkGrayText)
                        Text(weatherData.description ?: "N/A", style = MaterialTheme.typography.bodySmall, color = DarkGrayText.copy(alpha = 0.7f))
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                Row(horizontalArrangement = Arrangement.SpaceAround, modifier = Modifier.fillMaxWidth()) {
                    WeatherMetric(label = "Humidity", value = weatherData.humidity ?: "N/A")
                    WeatherMetric(label = "Rain (1h)", value = weatherData.rainLastHour ?: "N/A")
                }
            } else {
                Text("Enter coordinates and tap 'Fetch Data' to see weather.", style = MaterialTheme.typography.bodyMedium, color = DarkGrayText.copy(alpha = 0.7f))
            }
        }
    }
}

@Composable
fun SoilDataCard(soilData: UIDisplaySoilData?) {
    DefaultCard {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Soil Nutrients (Top Layer)", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = DarkGreen)
            Spacer(modifier = Modifier.height(12.dp))
            if (soilData != null) {
                SoilMetric(label = "Nitrogen:", value = soilData.nitrogen ?: "N/A")
                Spacer(modifier = Modifier.height(8.dp))
                SoilMetric(label = "pH (H₂O):", value = soilData.ph ?: "N/A")
            } else {
                Text("Enter coordinates and tap 'Fetch Data' to see soil data.", style = MaterialTheme.typography.bodyMedium, color = DarkGrayText.copy(alpha = 0.7f))
            }
        }
    }
}

@Composable
fun SoilMetric(label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, style = MaterialTheme.typography.bodyMedium, color = DarkGrayText)
        Text(value, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, color = PrimaryGreen)
    }
}

@Composable
fun WeatherMetric(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(label, style = MaterialTheme.typography.labelSmall, color = DarkGrayText.copy(alpha = 0.7f))
        Text(value, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, color = DarkGrayText)
    }
}

@Composable
fun ChatbotScreenPlaceholder() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("Chatbot Screen - Coming Soon!", style = MaterialTheme.typography.headlineMedium)
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
            color = DarkGrayText
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "Your soil is your wealth!",
            style = MaterialTheme.typography.bodyMedium,
            color = DarkGreen
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
fun InDemandCropsCard(crops: List<Crop>) {
    DefaultCard {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Top Crops in Demand", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = DarkGreen)
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
        Text(text = crop.iconPlaceholder, modifier = Modifier.size(40.dp)) // Replace with actual Icon
        Spacer(modifier = Modifier.height(6.dp))
        Text(crop.name, style = MaterialTheme.typography.bodySmall, maxLines = 1, overflow = TextOverflow.Ellipsis, color = DarkGrayText)
        Text(if (crop.trendUp) "▲" else "▼", color = if (crop.trendUp) DarkGreen else Color.Red, style = MaterialTheme.typography.bodySmall)
    }
}

@Composable
fun CropPricingCard(prices: List<MarketPrice>) {
    DefaultCard {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Market Prices Today", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = DarkGreen)
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
            Text("Featured Scheme", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = DarkGreen)
            Spacer(modifier = Modifier.height(12.dp))
            Text(scheme.title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold, color = PrimaryGreen)
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
        colors = CardDefaults.cardColors(containerColor = LightGreenCardBackground),
        content = content
    )
}

@OptIn(ExperimentalMaterial3Api::class) // Removed ExperimentalPermissionsApi from here
@Preview(showBackground = true, widthDp = 390, heightDp = 844)
@Composable
fun HomeScreenPreview() {
    KrishiMitrrTheme {
        HomeScreen(homeScreenViewModel = viewModel())
    }
}
