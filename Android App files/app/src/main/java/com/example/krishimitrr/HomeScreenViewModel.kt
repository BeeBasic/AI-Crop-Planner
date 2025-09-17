package com.example.krishimitrr

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class HomeScreenViewModel : ViewModel() {

    private val environmentalDataService = EnvironmentalDataService()

    // Weather Data State
    private val _weatherData = MutableStateFlow<UIDisplayWeatherData?>(null)
    val weatherData: StateFlow<UIDisplayWeatherData?> = _weatherData.asStateFlow()

    // Soil Data State
    private val _soilData = MutableStateFlow<UIDisplaySoilData?>(null)
    val soilData: StateFlow<UIDisplaySoilData?> = _soilData.asStateFlow()

    // Loading State
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    // Error State
    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    fun fetchEnvironmentalData(latitude: Double, longitude: Double) {
        if (_isLoading.value) return // Prevent multiple simultaneous loads

        Log.d("HomeScreenViewModel", "Fetching environmental data for Lat: $latitude, Lon: $longitude")
        _isLoading.value = true
        _errorMessage.value = null // Clear previous errors
        _weatherData.value = null // Clear previous data
        _soilData.value = null    // Clear previous data

        viewModelScope.launch {
            var weatherSuccess = false
            var soilSuccess = false
            var errorMsg: String? = null

            try {
                // Fetch weather data
                val weather = environmentalDataService.getWeatherData(latitude, longitude)
                if (weather != null) {
                    _weatherData.value = weather
                    weatherSuccess = true
                    Log.d("HomeScreenViewModel", "Weather data updated: $weather")
                } else {
                    Log.e("HomeScreenViewModel", "Failed to get weather data from service.")
                }

                // Fetch soil data
                val soil = environmentalDataService.getSoilData(latitude, longitude)
                if (soil != null) {
                    _soilData.value = soil
                    soilSuccess = true
                    Log.d("HomeScreenViewModel", "Soil data updated: $soil")
                } else {
                    Log.e("HomeScreenViewModel", "Failed to get soil data from service.")
                }

                if (!weatherSuccess && !soilSuccess) {
                    errorMsg = "Failed to load weather and soil data."
                } else if (!weatherSuccess) {
                    errorMsg = "Failed to load weather data."
                } else if (!soilSuccess) {
                    errorMsg = "Failed to load soil data."
                }

            } catch (e: Exception) {
                Log.e("HomeScreenViewModel", "Exception fetching environmental data", e)
                errorMsg = "An error occurred: ${e.localizedMessage}"
            } finally {
                _errorMessage.value = errorMsg
                _isLoading.value = false
                Log.d("HomeScreenViewModel", "Finished fetching environmental data. Loading: ${_isLoading.value}")
            }
        }
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }
}
