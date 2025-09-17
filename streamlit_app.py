import os
import requests
import streamlit as st


SOILGRIDS_BASE_URL = "https://rest.isric.org/soilgrids/v2.0/properties/query"
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "f273e9ce95f51d30254d4775f42c5a72")
MODEL_PREDICT_URL = os.getenv("MODEL_PREDICT_URL", "http://127.0.0.1:5000/predict")


def fetch_soil_n_and_ph(lat: float, lon: float) -> tuple[float, float]:
    params = {
        "lon": lon,
        "lat": lat,
        "property": ",".join(["nitrogen", "phh2o"]),
        "depth": "0-5cm",
        "value": "mean",
    }
    r = requests.get(SOILGRIDS_BASE_URL, params=params, timeout=20)
    r.raise_for_status()
    data = r.json()
    layers = data.get("properties", {}).get("layers", []) or data.get("layers", [])

    nitrogen = None
    ph = None
    for layer in layers:
        name = str(layer.get("name") or layer.get("variable") or "").lower()
        depths = layer.get("depths", [])
        first_depth = depths[0] if depths else {}
        values = first_depth.get("values", {})
        mean = values.get("mean", None)
        if isinstance(mean, (int, float)):
            if "nitrogen" in name:
                nitrogen = mean
            if "phh2o" in name or name == "ph":
                ph = mean

    if nitrogen is None or ph is None:
        raise ValueError("Could not parse SoilGrids response for N and pH")

    return float(nitrogen), float(ph)


def fetch_openweather(lat: float, lon: float) -> tuple[float, float, float]:
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "metric"}
    r = requests.get(url, params=params, timeout=20)
    r.raise_for_status()
    data = r.json()
    temperature = float(data.get("main", {}).get("temp", 0))
    humidity = float(data.get("main", {}).get("humidity", 0))
    rain_block = data.get("rain", {}) or {}
    rainfall = float(rain_block.get("1h") or rain_block.get("3h") or 0)
    return temperature, humidity, rainfall


def call_model_predict(N: float, temperature: float, humidity: float, ph: float, rainfall: float) -> str:
    payload = {
        "N": N,
      
        "temperature": temperature,
        "humidity": humidity,
        "ph": ph,
        "rainfall": rainfall,
    }
    r = requests.post(MODEL_PREDICT_URL, json=payload, timeout=20)
    r.raise_for_status()
    data = r.json()
    return str(data.get("predicted_crop", "Unknown"))


st.set_page_config(page_title="AI Crop Planner - Streamlit", layout="centered")
st.title("AI Crop Planner - Streamlit Model Runner")
st.caption("This tool fetches N & pH from SoilGrids, weather from OpenWeather, and calls the local model API.")

with st.form("inputs"):
    col1, col2 = st.columns(2)
    with col1:
        lat = st.number_input("Latitude", value=28.6139, format="%f")
        manual_N = st.number_input("Override N (optional)", value=0.0, format="%f")
        manual_ph = st.number_input("Override pH (optional)", value=0.0, format="%f")
    with col2:
        lon = st.number_input("Longitude", value=77.2090, format="%f")
        manual_temp = st.number_input("Override Temperature °C (optional)", value=0.0, format="%f")
        manual_humidity = st.number_input("Override Humidity % (optional)", value=0.0, format="%f")
        manual_rain = st.number_input("Override Rainfall mm (optional)", value=0.0, format="%f")
    submitted = st.form_submit_button("Get Recommendation")

if submitted:
    try:
        with st.spinner("Fetching soil properties..."):
            N, ph = fetch_soil_n_and_ph(lat, lon)
        with st.spinner("Fetching weather..."):
            temperature, humidity, rainfall = fetch_openweather(lat, lon)

        # Apply manual overrides if provided (> 0)
        if manual_N > 0:
            N = manual_N
        if manual_ph > 0:
            ph = manual_ph
        if manual_temp > 0:
            temperature = manual_temp
        if manual_humidity > 0:
            humidity = manual_humidity
        if manual_rain > 0:
            rainfall = manual_rain

        with st.spinner("Calling model..."):
            crop = call_model_predict(N, ph, temperature, humidity, rainfall)

        st.success(f"Recommended Crop: {crop}")
        st.json({
            "N": N,
           
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall,
        })
    except Exception as e:
        st.error(f"Error: {e}")

st.divider()
st.write("Model endpoint:", MODEL_PREDICT_URL)
st.write("Set OPENWEATHER_API_KEY or MODEL_PREDICT_URL via environment variables if needed.")


