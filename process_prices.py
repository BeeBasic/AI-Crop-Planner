import pandas as pd
import json
from datetime import datetime, timedelta
import os

def process_crop_prices():
    """Process CSV data to get 30-day price trends for each crop"""
    
    # Read the CSV file
    df = pd.read_csv('latest_one_year_prices.csv')
    
    # Convert date column to datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # Get unique crops
    crops = df['crop_id'].unique()
    
    # Create mapping from model predictions to CSV crop names
    crop_mapping = {
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
        'soybeans': 'Soybeans'  # Fallback
    }
    
    # Process each crop
    crop_data = {}
    
    for model_name, csv_name in crop_mapping.items():
        if csv_name in crops:
            # Filter data for this crop
            crop_df = df[df['crop_id'] == csv_name].copy()
            
            if len(crop_df) > 0:
                # Group by date and take average price across districts
                daily_prices = crop_df.groupby('date')['price'].mean().reset_index()
                daily_prices = daily_prices.sort_values('date')
                
                # Get the most recent 30 days of data
                if len(daily_prices) >= 30:
                    recent_30_days = daily_prices.tail(30)
                else:
                    # If less than 30 days, take all available data
                    recent_30_days = daily_prices
                
                # Format data for the chart
                chart_data = []
                for i, (_, row) in enumerate(recent_30_days.iterrows(), 1):
                    chart_data.append({
                        'date': row['date'].strftime('%Y-%m-%d'),
                        'price': round(float(row['price']), 2),
                        'day': i
                    })
                
                crop_data[model_name] = chart_data
                print(f"Processed {model_name} -> {csv_name}: {len(chart_data)} days")
            else:
                print(f"No data found for {csv_name}")
        else:
            print(f"Crop {csv_name} not found in dataset")
    
    # Save to JSON file for the frontend to use
    with open('crop_price_data.json', 'w') as f:
        json.dump(crop_data, f, indent=2)
    
    print(f"\nProcessed data for {len(crop_data)} crops")
    print("Data saved to crop_price_data.json")
    
    return crop_data

if __name__ == "__main__":
    process_crop_prices()
