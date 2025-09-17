package com.example.krishimitrr

import android.util.Log
import io.ktor.client.* 
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.* 
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import java.text.DecimalFormat

// The ApiConfig object is now defined in a separate ApiConfig.kt file
// and will be used directly from there.

class EnvironmentalDataService {

    private val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { 
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true 
            })
        }
    }

    private val df = DecimalFormat("#.0") // For formatting temperature and pH
    private val soilPropertyDf = DecimalFormat("#.0") // For soil properties like nitrogen

    suspend fun getWeatherData(latitude: Double, longitude: Double): UIDisplayWeatherData? {
        // Uses ApiConfig.OPENWEATHER_BASE_URL and ApiConfig.OPENWEATHER_API_KEY from the global ApiConfig.kt
        val url = "${ApiConfig.OPENWEATHER_BASE_URL}?lat=$latitude&lon=$longitude&appid=${ApiConfig.OPENWEATHER_API_KEY}&units=metric"
        Log.d("EnvDataService", "Requesting Weather URL: $url")
        return try {
            val response = client.get(url)
            if (response.status.isSuccess()) {
                val data = response.body<WeatherDataResponse>()
                Log.d("EnvDataService", "Weather Data Raw: $data")
                UIDisplayWeatherData(
                    temperature = data.main?.temperature?.let { "${df.format(it)} °C" } ?: "N/A",
                    humidity = data.main?.humidity?.let { "$it%" } ?: "N/A",
                    rainLastHour = data.rain?.lastHour?.let { "$it mm" } ?: "No rain",
                    description = data.weather?.firstOrNull()?.description?.replaceFirstChar { it.uppercase() } ?: "N/A"
                )
            } else {
                Log.e("EnvDataService", "OpenWeatherMap Error: ${response.status} - ${response.body<String>()}")
                null
            }
        } catch (e: Exception) {
            Log.e("EnvDataService", "OpenWeatherMap Exception: ${e.message}", e)
            null
        }
    }

    private suspend fun fetchSoilGridProperty(latitude: Double, longitude: Double, property: String): Double? {
        val depth = "0-5cm" // As per your reference
        val valueType = "mean"  // As per your reference
        // Uses ApiConfig.SOILGRIDS_BASE_URL from the global ApiConfig.kt
        val url = "${ApiConfig.SOILGRIDS_BASE_URL}?lon=$longitude&lat=$latitude&property=$property&depth=$depth&value=$valueType"
        Log.d("EnvDataService", "Requesting SoilGrids URL for $property: $url")

        return try {
            val response = client.get(url)
            if (response.status.isSuccess()) {
                val data = response.body<SoilGridsResponse>()
                Log.d("EnvDataService", "SoilGrids Data Raw for $property: $data")
                val meanValue = data.properties?.layers?.firstOrNull()
                    ?.depths?.firstOrNull { it.label == depth }
                    ?.values?.mean
                
                if (meanValue == null) {
                    Log.w("EnvDataService", "Property '$property' had no 'mean' value in response at $depth.")
                }
                meanValue
            } else {
                Log.e("EnvDataService", "SoilGrids Error for $property: ${response.status} - ${response.body<String>()}")
                null
            }
        } catch (e: Exception) {
            Log.e("EnvDataService", "SoilGrids Exception for $property: ${e.message}", e)
            null
        }
    }

    suspend fun getSoilData(latitude: Double, longitude: Double): UIDisplaySoilData? {
        Log.d("EnvDataService", "Fetching all soil properties for lat=$latitude, lon=$longitude")

        val nitrogenRaw = fetchSoilGridProperty(latitude, longitude, "nitrogen")
        val phh2oRaw = fetchSoilGridProperty(latitude, longitude, "phh2o")

        if (nitrogenRaw == null && phh2oRaw == null) {
            Log.w("EnvDataService", "No soil data (nitrogen or phh2o) was found for this location.")
        }

        val nitrogenDisplay = nitrogenRaw?.let { "${soilPropertyDf.format(it)} units" } ?: "N/A" // Assuming units or g/kg, adjust if known
        val phDisplay = phh2oRaw?.let { "${df.format(it / 10.0)} pH" } ?: "N/A" // pH is divided by 10

        return UIDisplaySoilData(nitrogen = nitrogenDisplay, ph = phDisplay)
    }
}
