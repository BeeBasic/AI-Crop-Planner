# 🌾 Agro-Advisor: An AI-Powered Crop Recommendation Platform  

Agro-Advisor is an end-to-end web application designed to empower Indian farmers by leveraging machine learning to make data-driven decisions. This platform provides **personalized crop recommendations** by analyzing soil, weather, and real-time market data, helping to maximize profitability and resource efficiency.  

---

<p align="center">
  <img src="https://github.com/BeeBasic/AI-Crop-Planner/blob/9b8aeb47218fa0d4ba799cf776fe9f63e4b91729/demo%20-%20app/Android%20App%20ScreenShots/anim.gif" alt="demo" />
</p>
## ✨ Key Features  
- **AI-Driven Crop Suitability**: XGBoost model analyzes hyperlocal soil & weather data to recommend the **top 3 most suitable crops** with confidence scores.  
- **90-Day Price Forecasting**: CatBoost time-series model predicts **market prices 90 days ahead**, enabling farmers to choose the most profitable crop.  
- **Interactive Dashboard**: Clean, user-friendly interface with ranked recommendations, price trends, and visualizations.  
- **Government Scheme Integration**: Direct links to relevant agricultural schemes.  
- **Fine-Tuned AI Chatbot**: Powered by a fine-tuned **Gemma model**, supporting multi-language farmer queries.  
- **Secure Authentication**: Google Firebase ensures user and data security.  
- **Multi-lingual Support**: Full translation into **Hindi** for accessibility.  

---

## 🛠️ Tech Stack  
| Category          | Technology |
|-------------------|------------|
| **Frontend**      | React, JavaScript, Axios, CSS |
| **Backend & API** | Python, Flask, Flask-CORS |
| **Machine Learning** | Scikit-learn, Pandas, NumPy, XGBoost, CatBoost |
| **Authentication** | Google Firebase |
| **Data APIs**     | OpenWeatherMap (Weather), ISRIC SoilGrids (Soil Data) |
| **Chatbot**       | Gemma Language Model, Cloudflare Tunnel |

---

## 🏛️ Architecture and Workflow  
1. **Authentication** – Secure Google login with Firebase.  
2. **Location & Data Fetching** – React app fetches user latitude & longitude, then calls APIs (OpenWeatherMap + ISRIC SoilGrids).  
3. **Model 1 (Suitability)** – XGBoost model predicts **top 3 crops** with confidence scores.  
4. **Model 2 (Profitability)** – CatBoost forecasts **90-day future prices** for those crops using mandi data with lag features.  
5. **Dashboard** – Renders ranked list of crops with suitability, predicted prices, trend graphs, and government scheme links.  
6. **Chatbot Interaction** – Fine-tuned Gemma chatbot served locally and exposed via Cloudflare Tunnel for multilingual farmer queries.  

---

## 🧠 Machine Learning Models  

### Model 1: Crop Suitability (XGBoost Classifier)  
- **Inputs**: Nitrogen (N), Soil pH, Temperature, Humidity, Rainfall  
- **Output**: Probabilities for all crops → Top 3 selected  

### Model 2: Price Forecasting (CatBoost Regressor)  
- **Inputs**: crop_id, district_id, month, day_of_year, lag features (price_lag_365d, etc.)  
- **Output**: Predicted **future price (₹)** for 90 days ahead  

### Farmer's Assistant (Fine-Tuned Gemma)  
- **Base Model**: Google’s Gemma  
- **Fine-Tuning**: Custom dataset of farmer queries, agricultural FAQs, and scheme info  
- **Purpose**: Conversational, context-aware support in **multiple languages**  

---

## 🚀 Setup and Installation  

### 📌 Prerequisites  
- Node.js & npm  
- Python 3.8+ & pip  
- A Google Firebase project  
- API key for **OpenWeatherMap**  

### 🔧 Backend Setup  
```bash
git clone https://github.com/your-username/agro-advisor.git
cd agro-advisor/backend
pip install -r requirements.txt
# Add API keys in .env
# Example: OPENWEATHER_API_KEY=your_key_here
python app.py
```
### 👕 FrontEnd Setup  
cd ../frontend
npm install
# Add Firebase config in .env.local
npm start

###  🤖 ChatBot Setup
cd ../chatbot
# (Follow Gemma setup instructions)
cloudflared tunnel --url http://localhost:PORT
