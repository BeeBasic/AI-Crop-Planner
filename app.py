from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import requests
from price_prediction_service import PricePredictionService

# 1. Initialize the Flask App
app = Flask(__name__)
# Explicit CORS config for local dev
CORS(
    app,
    resources={
        r"/predict": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080", "*"]},
        r"/predict-top3": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080", "*"]},
        r"/predict-prices": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080", "*"]},
        r"/chat": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080", "*"]},
        r"/translate": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080", "*"]},
    },
    supports_credentials=False,
)

# 2. Load the trained model and the label encoder
print("Loading model and encoder...")
model = joblib.load('crop_model.pkl')
label_encoder = joblib.load('label_encoder.pkl')
print("Model and encoder loaded successfully.")

# 2b. Load the price prediction service
print("Loading price prediction service...")
price_service = PricePredictionService()
print("Price prediction service loaded successfully.")

# 3. Define the prediction endpoint
@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({"ok": True})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Vary', 'Origin')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200

    # Get the JSON data sent from the React frontend
    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({'error': 'Invalid JSON body'}), 400
    
    # Create a pandas DataFrame from the received data
    # The order of columns MUST match the order used during training
    features = ['N',  'temperature', 'humidity', 'ph','rainfall']
    input_df = pd.DataFrame([data], columns=features)
    
    # Make a prediction
    prediction_encoded = model.predict(input_df)
    
    # Inverse transform the prediction to get the crop name
    predicted_crop = label_encoder.inverse_transform(prediction_encoded)
    
    # Return the result as JSON
    response = jsonify({'predicted_crop': predicted_crop[0]})
    response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
    response.headers.add('Vary', 'Origin')
    return response

# 3b. Top-3 predictions endpoint (if model supports predict_proba)
@app.route('/predict-top3', methods=['POST', 'OPTIONS'])
def predict_top3():
    if request.method == 'OPTIONS':
        response = jsonify({"ok": True})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Vary', 'Origin')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200

    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({'error': 'Invalid JSON body'}), 400

    features = ['N', 'temperature', 'humidity', 'ph', 'rainfall']
    input_df = pd.DataFrame([data], columns=features)

    if not hasattr(model, 'predict_proba'):
        # Fallback to single prediction if probabilities are unavailable
        prediction_encoded = model.predict(input_df)
        crop = label_encoder.inverse_transform(prediction_encoded)[0]
        payload = [{"name": crop, "score": 1.0}]
    else:
        proba = model.predict_proba(input_df)[0]
        # Get top 3 indices
        top_indices = sorted(range(len(proba)), key=lambda i: proba[i], reverse=True)[:3]
        classes = getattr(model, 'classes_', None)
        if classes is None:
            # Try to infer from label_encoder
            class_labels = list(range(len(proba)))
        else:
            class_labels = classes
        # Map indices to crop names through label_encoder if needed
        names = []
        for idx in top_indices:
            label = class_labels[idx]
            # If labels are encoded, decode; else assume already crop names
            try:
                name = label_encoder.inverse_transform([label])[0]
            except Exception:
                name = str(label)
            names.append({"name": name, "score": float(proba[idx])})
        payload = names

    response = jsonify({"top3": payload})
    response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
    response.headers.add('Vary', 'Origin')
    return response

# 3c. Price prediction endpoint
@app.route('/predict-prices', methods=['POST', 'OPTIONS'])
def predict_prices():
    if request.method == 'OPTIONS':
        response = jsonify({"ok": True})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Vary', 'Origin')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200

    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({'error': 'Invalid JSON body'}), 400

    crops = data.get('crops', [])
    lat = data.get('latitude', 0)
    lon = data.get('longitude', 0)

    if not crops or not lat or not lon:
        return jsonify({'error': 'Missing required fields: crops, latitude, longitude'}), 400

    try:
        price_predictions = []
        for crop in crops:
            prediction = price_service.predict_price(crop, lat, lon)
            if prediction:
                price_predictions.append(prediction)

        response = jsonify({"price_predictions": price_predictions})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Vary', 'Origin')
        return response

    except Exception as e:
        return jsonify({'error': f'Price prediction failed: {str(e)}'}), 500

# 3d. Chatbot proxy endpoint
@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        response = jsonify({"ok": True})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Vary', 'Origin')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200

    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({'error': 'Invalid JSON body'}), 400

    prompt = data.get('prompt', '')
    if not prompt:
        return jsonify({'error': 'Missing prompt'}), 400

    try:
        # Forward the request to your Cloudflare tunnel
        cloudflare_url = "https://mon-yarn-avoiding-then.trycloudflare.com/chat"
        api_key = "supersecret"
        
        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key
        }
        
        payload = {
            "prompt": prompt
        }
        
        # Make the request to Cloudflare tunnel
        response = requests.post(cloudflare_url, headers=headers, json=payload, stream=True)
        response.raise_for_status()
        
        # Create a streaming response
        def generate():
            for line in response.iter_lines():
                if line:
                    yield line + b'\n'
        
        from flask import Response
        return Response(generate(), mimetype='text/plain')
        
    except Exception as e:
        return jsonify({'error': f'Chat request failed: {str(e)}'}), 500

# 3e. Translation proxy endpoint
@app.route('/translate', methods=['POST', 'OPTIONS'])
def translate():
    if request.method == 'OPTIONS':
        response = jsonify({"ok": True})
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Vary', 'Origin')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200

    data = request.get_json()
    if not isinstance(data, dict):
        return jsonify({'error': 'Invalid JSON body'}), 400

    text = data.get('text', '')
    source = data.get('source', 'auto')
    target = data.get('target', 'hi')

    if not text:
        return jsonify({'error': 'Missing text to translate'}), 400

    try:
        # Only support English to Hindi and Hindi to English
        if not ((source == 'en' and target == 'hi') or (source == 'hi' and target == 'en') or (source == 'auto' and target == 'hi')):
            return jsonify({'error': f'Translation not supported: {source} to {target}. Only en↔hi supported.'}), 400

        # Call MyMemory API
        mymemory_url = "https://api.mymemory.translated.net/get"
        params = {
            'q': text,
            'langpair': f'{source if source != "auto" else "en"}|{target}'
        }
        
        response = requests.get(mymemory_url, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get('responseStatus') == 200:
            translated_text = data.get('responseData', {}).get('translatedText', text)
            result = jsonify({'translatedText': translated_text})
            result.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
            result.headers.add('Vary', 'Origin')
            return result
        else:
            return jsonify({'error': 'Translation failed'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Translation request failed: {str(e)}'}), 500

# 4. Run the app
if __name__ == '__main__':
    # The server will run on http://127.0.0.1:5001 (port 5000 is used by AirPlay on macOS)
    app.run(debug=True, port=5001)