import joblib
import pandas as pd
import requests
from datetime import datetime, timedelta
import json

class PricePredictionService:
    def __init__(self):
        # Load the price prediction model
        self.price_model = joblib.load('price_model.pkl')
        
        # Load price data for lag calculations
        self.price_df = pd.read_csv('latest_one_year_prices.csv')
        # Handle date parsing with error handling
        self.price_df['date'] = pd.to_datetime(self.price_df['date'], errors='coerce')
        # Remove rows with invalid dates
        self.price_df = self.price_df.dropna(subset=['date'])
        
        # Crop name mapping from model 1 to model 2
        self.crop_mapping = {
            'rice': 'Rice',
            'wheat': 'Wheat', 
            'maize': 'Maize',
            'cotton': 'Cotton',
            'banana': 'Banana',
            'grapes': 'Grapes',
            'mango': 'Mango',
            'orange': 'Orange',
            'papaya': 'Papaya',
            'pomegranate': 'Pomegranate',
            'coconut': 'Coconut',
            'jute': 'Jute',
            'lentil': 'Lentil (Masur)(Whole)',
            'chickpea': 'Kabuli Chana(Chickpeas-White)',
            'blackgram': 'Black Gram (Urd Beans)(Whole)',
            'moath': 'Moath Dal',
            'soybeans': 'Soybeans'
        }
    
    def get_district_from_coords(self, lat, lon):
        """Get district name from coordinates using reverse geocoding"""
        try:
            # Simple mapping based on coordinates for major Indian regions
            # This is a simplified approach - in production you'd use a proper geocoding service
            
            # Delhi region
            if 28.4 <= lat <= 28.9 and 76.8 <= lon <= 77.4:
                return "Delhi"
            # Mumbai region  
            elif 18.8 <= lat <= 19.3 and 72.7 <= lon <= 73.2:
                return "Mumbai"
            # Bangalore region
            elif 12.8 <= lat <= 13.2 and 77.4 <= lon <= 77.8:
                return "Bangalore"
            # Chennai region
            elif 12.8 <= lat <= 13.2 and 80.1 <= lon <= 80.4:
                return "Chennai"
            # Kolkata region
            elif 22.4 <= lat <= 22.8 and 88.2 <= lon <= 88.6:
                return "Kolkata"
            # Hyderabad region
            elif 17.2 <= lat <= 17.6 and 78.2 <= lon <= 78.8:
                return "Hyderabad"
            # Punjab region
            elif 30.5 <= lat <= 31.5 and 74.5 <= lon <= 76.5:
                return "Punjab"
            # Gujarat region
            elif 22.0 <= lat <= 24.5 and 68.0 <= lon <= 74.5:
                return "Gujarat"
            # Tamil Nadu region
            elif 8.0 <= lat <= 13.5 and 76.0 <= lon <= 80.5:
                return "Tamil Nadu"
            # Karnataka region
            elif 11.5 <= lat <= 18.5 and 74.0 <= lon <= 78.5:
                return "Karnataka"
            # Maharashtra region
            elif 15.5 <= lat <= 22.0 and 72.5 <= lon <= 80.5:
                return "Maharashtra"
            # Andhra Pradesh region
            elif 12.0 <= lat <= 19.5 and 76.5 <= lon <= 84.5:
                return "Andhra Pradesh"
            # Telangana region
            elif 15.5 <= lat <= 19.5 and 77.0 <= lon <= 81.0:
                return "Telangana"
            # West Bengal region
            elif 21.5 <= lat <= 27.0 and 85.5 <= lon <= 89.5:
                return "West Bengal"
            # Uttar Pradesh region
            elif 24.0 <= lat <= 31.0 and 77.0 <= lon <= 84.5:
                return "Uttar Pradesh"
            # Madhya Pradesh region
            elif 21.0 <= lat <= 26.5 and 74.0 <= lon <= 82.5:
                return "Madhya Pradesh"
            # Rajasthan region
            elif 23.0 <= lat <= 30.5 and 69.5 <= lon <= 78.5:
                return "Rajasthan"
            # Haryana region
            elif 27.5 <= lat <= 30.5 and 74.5 <= lon <= 77.5:
                return "Haryana"
            # Kerala region
            elif 8.0 <= lat <= 12.5 and 74.5 <= lon <= 77.5:
                return "Kerala"
            # Odisha region
            elif 17.5 <= lat <= 22.5 and 81.0 <= lon <= 87.5:
                return "Odisha"
            # Assam region
            elif 24.0 <= lat <= 28.0 and 89.5 <= lon <= 96.5:
                return "Assam"
            # Bihar region
            elif 24.0 <= lat <= 27.5 and 83.0 <= lon <= 88.5:
                return "Bihar"
            # Jharkhand region
            elif 21.5 <= lat <= 25.0 and 83.0 <= lon <= 87.5:
                return "Jharkhand"
            # Chhattisgarh region
            elif 17.5 <= lat <= 24.0 and 80.0 <= lon <= 84.5:
                return "Chhattisgarh"
            # Uttarakhand region
            elif 28.5 <= lat <= 31.5 and 77.5 <= lon <= 81.5:
                return "Uttarakhand"
            # Himachal Pradesh region
            elif 30.5 <= lat <= 33.5 and 75.5 <= lon <= 79.5:
                return "Himachal Pradesh"
            # Jammu and Kashmir region
            elif 32.0 <= lat <= 37.0 and 73.5 <= lon <= 80.5:
                return "Jammu and Kashmir"
            # Ladakh region
            elif 32.0 <= lat <= 37.0 and 75.5 <= lon <= 80.5:
                return "Ladakh"
            # Goa region
            elif 14.5 <= lat <= 15.8 and 73.5 <= lon <= 74.5:
                return "Goa"
            # Sikkim region
            elif 27.0 <= lat <= 28.5 and 88.0 <= lon <= 89.0:
                return "Sikkim"
            # Arunachal Pradesh region
            elif 26.0 <= lat <= 29.5 and 91.5 <= lon <= 97.5:
                return "Arunachal Pradesh"
            # Nagaland region
            elif 25.0 <= lat <= 27.5 and 93.0 <= lon <= 95.5:
                return "Nagaland"
            # Manipur region
            elif 23.5 <= lat <= 25.5 and 93.0 <= lon <= 94.5:
                return "Manipur"
            # Mizoram region
            elif 22.0 <= lat <= 24.5 and 92.0 <= lon <= 93.5:
                return "Mizoram"
            # Tripura region
            elif 22.5 <= lat <= 24.5 and 91.0 <= lon <= 92.5:
                return "Tripura"
            # Meghalaya region
            elif 25.0 <= lat <= 26.5 and 89.5 <= lon <= 92.5:
                return "Meghalaya"
            # Andaman and Nicobar region
            elif 6.0 <= lat <= 14.0 and 92.0 <= lon <= 94.0:
                return "Andaman and Nicobar"
            # Lakshadweep region
            elif 8.0 <= lat <= 12.0 and 71.0 <= lon <= 74.0:
                return "Lakshadweep"
            # Puducherry region
            elif 11.5 <= lat <= 12.5 and 79.5 <= lon <= 80.0:
                return "Puducherry"
            # Dadra and Nagar Haveli region
            elif 20.0 <= lat <= 20.5 and 72.5 <= lon <= 73.5:
                return "Dadra and Nagar Haveli"
            # Daman and Diu region
            elif 20.0 <= lat <= 20.5 and 72.5 <= lon <= 73.5:
                return "Daman and Diu"
            # Chandigarh region
            elif 30.5 <= lat <= 31.0 and 76.5 <= lon <= 77.0:
                return "Chandigarh"
            else:
                # Default fallback for coordinates outside India or unrecognized regions
                return "Adilabad"  # Default district from your dataset
            
        except Exception as e:
            print(f"Error getting district: {e}")
            return "Adilabad"  # Default fallback
    
    def get_price_lags(self, crop_id, district_id, current_date):
        """Get price lags for the given crop and district"""
        try:
            # Filter data for the specific crop and district
            crop_district_data = self.price_df[
                (self.price_df['crop_id'] == crop_id) & 
                (self.price_df['district_id'] == district_id)
            ].copy()
            
            if len(crop_district_data) == 0:
                # If no data for this district, get average across all districts
                crop_district_data = self.price_df[self.price_df['crop_id'] == crop_id].copy()
                if len(crop_district_data) > 0:
                    # Group by date and take average
                    crop_district_data = crop_district_data.groupby('date')['price'].mean().reset_index()
                    crop_district_data['district_id'] = district_id
            
            if len(crop_district_data) == 0:
                return 0, 0  # Return zeros if no data available
            
            # Sort by date
            crop_district_data = crop_district_data.sort_values('date')
            
            # Get the most recent price
            latest_price = crop_district_data['price'].iloc[-1]
            
            # Calculate 90-day lag
            current_date = pd.to_datetime(current_date)
            lag_90_date = current_date - timedelta(days=90)
            
            # Find closest date to 90 days ago
            lag_90_data = crop_district_data[crop_district_data['date'] <= lag_90_date]
            price_lag_90d = lag_90_data['price'].iloc[-1] if len(lag_90_data) > 0 else latest_price
            
            # Calculate 365-day lag
            lag_365_date = current_date - timedelta(days=365)
            lag_365_data = crop_district_data[crop_district_data['date'] <= lag_365_date]
            price_lag_365d = lag_365_data['price'].iloc[-1] if len(lag_365_data) > 0 else latest_price
            
            return price_lag_90d, price_lag_365d
            
        except Exception as e:
            print(f"Error calculating price lags: {e}")
            return 0, 0
    
    def predict_price(self, crop_name, lat, lon):
        """Predict 90-day future price for a crop"""
        try:
            # Map crop name to model 2 format
            crop_id = self.crop_mapping.get(crop_name.lower())
            if not crop_id:
                return None
            
            # Get district from coordinates
            district_id = self.get_district_from_coords(lat, lon)
            
            # Get current date and calculate future date (90 days from now)
            current_date = datetime.now()
            future_date = current_date + timedelta(days=90)
            
            # Get price lags
            price_lag_90d, price_lag_365d = self.get_price_lags(crop_id, district_id, current_date)
            
            # Prepare input features for model 2
            input_features = {
                'crop_id': crop_id,
                'district_id': district_id,
                'month': future_date.month,
                'day_of_year': future_date.timetuple().tm_yday,
                'price_lag_90d': price_lag_90d,
                'price_lag_365d': price_lag_365d
            }
            
            # Convert to DataFrame for prediction
            input_df = pd.DataFrame([input_features])
            
            # Make prediction
            predicted_price = self.price_model.predict(input_df)[0]
            
            return {
                'crop_name': crop_name,
                'predicted_price_90d': round(predicted_price, 2),
                'current_price': price_lag_90d,
                'price_change': round(predicted_price - price_lag_90d, 2),
                'price_change_percent': round(((predicted_price - price_lag_90d) / price_lag_90d) * 100, 2) if price_lag_90d > 0 else 0,
                'harvest_month': future_date.strftime('%B %Y')
            }
            
        except Exception as e:
            print(f"Error predicting price for {crop_name}: {e}")
            return None

# Test the service
if __name__ == "__main__":
    service = PricePredictionService()
    
    # Test with sample data
    test_crops = ['maize', 'cotton', 'banana']
    lat, lon = 28.6139, 77.2090  # Delhi coordinates
    
    for crop in test_crops:
        result = service.predict_price(crop, lat, lon)
        if result:
            print(f"{crop}: {result}")
        else:
            print(f"Failed to predict price for {crop}")
