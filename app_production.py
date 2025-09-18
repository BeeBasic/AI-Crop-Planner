from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import requests
import os
from dotenv import load_dotenv
from price_prediction_service import PricePredictionService

# Load environment variables
load_dotenv()

# 1. Initialize the Flask App
app = Flask(__name__)

# Get CORS origins from environment variables
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:8080,http://127.0.0.1:8080').split(',')

# Production CORS config
CORS(
    app,
    resources={
        r"/predict": {"origins": cors_origins + ["*"]},
        r"/predict-top3": {"origins": cors_origins + ["*"]},
        r"/predict-prices": {"origins": cors_origins + ["*"]},
        r"/chat": {"origins": cors_origins + ["*"]},
        r"/translate": {"origins": cors_origins + ["*"]},
    },
    supports_credentials=False,
)

# 2. Load the trained model and the label encoder
print("Loading model and encoder...")
try:
    model = joblib.load('crop_model.pkl')
    label_encoder = joblib.load('label_encoder.pkl')
    print("Model and encoder loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    label_encoder = None

# 2b. Load the price prediction service
print("Loading price prediction service...")
try:
    price_service = PricePredictionService()
    print("Price prediction service loaded successfully.")
except Exception as e:
    print(f"Error loading price service: {e}")
    price_service = None

# 3. Define the prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract features
        N = float(data.get('N', 0))
        ph = float(data.get('ph', 0))
        temperature = float(data.get('temperature', 0))
        humidity = float(data.get('humidity', 0))
        rainfall = float(data.get('rainfall', 0))
        
        if model is None or label_encoder is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Make prediction
        features = [[N, ph, temperature, humidity, rainfall]]
        prediction = model.predict(features)
        predicted_crop = label_encoder.inverse_transform(prediction)[0]
        
        return jsonify({'predicted_crop': predicted_crop})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict-top3', methods=['POST'])
def predict_top3():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Extract features
        N = float(data.get('N', 0))
        ph = float(data.get('ph', 0))
        temperature = float(data.get('temperature', 0))
        humidity = float(data.get('humidity', 0))
        rainfall = float(data.get('rainfall', 0))
        
        if model is None or label_encoder is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Make prediction
        features = [[N, ph, temperature, humidity, rainfall]]
        prediction = model.predict(features)
        predicted_crop = label_encoder.inverse_transform(prediction)[0]
        
        # For top 3, we'll return the same crop 3 times with different scores
        # In a real implementation, you'd use predict_proba to get probabilities
        top3 = [
            {'name': predicted_crop, 'score': 0.95},
            {'name': 'Rice', 'score': 0.85},
            {'name': 'Maize', 'score': 0.75}
        ]
        
        return jsonify({'top3': top3})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict-prices', methods=['POST'])
def predict_prices():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        crop_names = data.get('crop_names', [])
        latitude = data.get('latitude', 0)
        longitude = data.get('longitude', 0)
        
        if price_service is None:
            return jsonify({'error': 'Price service not loaded'}), 500
        
        # Get price predictions
        price_predictions = price_service.predict_prices(crop_names, latitude, longitude)
        
        return jsonify({'price_predictions': price_predictions})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Simple chatbot response
        response = f"Thank you for your message: '{message}'. This is a demo response from the Farmer-Friendly Plan chatbot."
        
        return jsonify({'response': response})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        text = data.get('text', '')
        target_lang = data.get('target_lang', 'hi')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Simple translation (in production, use a real translation service)
        if target_lang == 'hi':
            translated_text = f"[Hindi] {text}"
        else:
            translated_text = text
        
        return jsonify({'translated_text': translated_text})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'price_service_loaded': price_service is not None
    })

# 4. Run the app
if __name__ == '__main__':
    # Get configuration from environment variables
    debug = os.getenv('DEBUG', 'false').lower() == 'true'
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', os.getenv('BACKEND_PORT', '5001')))
    
    print(f"Starting server on http://{host}:{port}")
    print(f"Debug mode: {debug}")
    
    # The server will run on the configured host and port
    app.run(debug=debug, host=host, port=port)
