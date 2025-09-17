import csv
import json
from datetime import datetime
from collections import defaultdict

def process_crop_prices():
    """Process CSV data to get 30-day price trends for each crop"""
    
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
    
    # Dictionary to store daily average prices for each crop
    crop_daily_prices = defaultdict(lambda: defaultdict(list))
    
    print("Processing CSV data...")
    
    # Read the CSV file
    with open('latest_one_year_prices.csv', 'r') as f:
        reader = csv.DictReader(f)
        row_count = 0
        for row in reader:
            row_count += 1
            if row_count % 50000 == 0:
                print(f"Processed {row_count} rows...")
            
            crop_id = row['crop_id']
            date_str = row['date']
            price = float(row['price']) if row['price'] else 0
            
            # Store price for this crop and date
            crop_daily_prices[crop_id][date_str].append(price)
    
    print(f"Total rows processed: {row_count}")
    
    # Process each crop
    crop_data = {}
    
    for model_name, csv_name in crop_mapping.items():
        if csv_name in crop_daily_prices:
            # Get daily average prices for this crop
            daily_prices = crop_daily_prices[csv_name]
            
            # Convert to list of (date, avg_price) tuples and sort by date
            price_list = []
            for date_str, prices in daily_prices.items():
                if prices:  # Only include dates with valid prices
                    avg_price = sum(prices) / len(prices)
                    price_list.append((date_str, avg_price))
            
            # Sort by date
            price_list.sort(key=lambda x: x[0])
            
            # Get the most recent 30 days of data
            if len(price_list) >= 30:
                recent_30_days = price_list[-30:]
            else:
                # If less than 30 days, take all available data
                recent_30_days = price_list
            
            # Format data for the chart
            chart_data = []
            for i, (date_str, avg_price) in enumerate(recent_30_days, 1):
                chart_data.append({
                    'date': date_str,
                    'price': round(avg_price, 2),
                    'day': i
                })
            
            crop_data[model_name] = chart_data
            print(f"Processed {model_name} -> {csv_name}: {len(chart_data)} days")
        else:
            print(f"No data found for {csv_name}")
    
    # Save to JSON file for the frontend to use
    with open('crop_price_data.json', 'w') as f:
        json.dump(crop_data, f, indent=2)
    
    print(f"\nProcessed data for {len(crop_data)} crops")
    print("Data saved to crop_price_data.json")
    
    return crop_data

if __name__ == "__main__":
    process_crop_prices()
