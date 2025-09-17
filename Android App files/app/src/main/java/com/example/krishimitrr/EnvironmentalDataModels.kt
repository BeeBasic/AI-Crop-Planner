package com.example.krishimitrr

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// --- OpenWeatherMap Data Models ---

@Serializable
data class WeatherDataResponse(
    @SerialName("main") val main: MainWeatherData? = null,
    val rain: RainData? = null, // Rain data might be null if not raining
    val weather: List<WeatherDescription>? = null, // For general weather conditions
    @SerialName("name") val cityName: String? = null // City name from response
)

@Serializable
data class MainWeatherData(
    @SerialName("temp") val temperature: Double? = null, // Kelvin
    val humidity: Int? = null // Percentage
)

@Serializable
data class RainData(
    @SerialName("1h") val lastHour: Double? = null, // Rain volume for the last 1 hour in mm
    @SerialName("3h") val last3Hours: Double? = null // Rain volume for the last 3 hours in mm
)

@Serializable
data class WeatherDescription(
    val main: String? = null, // e.g., "Rain", "Clouds"
    val description: String? = null // e.g., "light rain", "broken clouds"
)

// --- SoilGrids Data Models ---

@Serializable
data class SoilGridsResponse(
    @SerialName("properties") val properties: SoilProperties? = null
)

@Serializable
data class SoilProperties(
    @SerialName("layers") val layers: List<SoilLayer>? = null
)

@Serializable
data class SoilLayer(
    @SerialName("name") val name: String? = null, // e.g., "nitrogen", "phh2o"
    @SerialName("depths") val depths: List<SoilDepthInterval>? = null,
    @SerialName("unit_measure") val unitMeasure: SoilUnitMeasure? = null
)

@Serializable
data class SoilDepthInterval(
    @SerialName("label") val label: String? = null, // e.g., "0-5cm"
    @SerialName("values") val values: SoilDepthValue? = null
)

@Serializable
data class SoilDepthValue(
    // SoilGrids often returns mean, median, uncertainty. We'll take mean or Q0.5 (median)
    // Naming might vary slightly based on actual SoilGrids response for specific properties.
    // We will query for specific properties like "nitrogen_0-5cm_mean"
    // So the direct response for a queried property might be simpler.
    // Let's adjust if the actual API query structure is different.
    // For a direct query like /properties/query?lon=X&lat=Y&property=nitrogen&depth=0-5cm&value=mean
    // The response might be more direct, e.g. just the value or a simpler structure.
    // For now, assuming we might get a map or a more structured value.
    // Let's assume a simplified structure for direct property queries for now,
    // and we will parse specific common values.

    // Q0.05, Q0.5, Q0.95, mean, uncertainty etc.
    // Let's assume we can get a "mean" value for simplicity for now
    // The SoilGrids API returns values with varying confidence intervals (quantiles)
    // For nitrogen, unit is typically g/kg (needs conversion to cg/kg or mg/kg if SoilGrids gives g/kg)
    // For phh2o, unit is pH*10 (needs division by 10)

    @SerialName("mean") val mean: Double? = null, // For properties like nitrogen (e.g., in g/kg)
    @SerialName("Q0.5") val median: Double? = null // For phh2o (e.g., pH*10)
    // Add other quantiles if needed, e.g., Q0.05, Q0.95, uncertainty
)

@Serializable
data class SoilUnitMeasure(
    @SerialName("value") val value: String? = null // e.g. "g/kg" or "pH*10"
)

// Simplified models for direct display if we parse them into these

data class UIDisplayWeatherData(
    val temperature: String? = null, // e.g., "25 °C"
    val humidity: String? = null,    // e.g., "60%"
    val rainLastHour: String? = null, // e.g., "1.0 mm"
    val description: String? = null   // e.g., "Light Rain"
)

data class UIDisplaySoilData(
    val nitrogen: String? = null,      // e.g., "1.5 g/kg (0-5cm)" or similar
    val ph: String? = null             // e.g., "6.5 pH (0-5cm)"
)
