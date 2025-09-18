# Dependencies for Farmer-Friendly Plan App

## Frontend Dependencies (Node.js/React)

The frontend dependencies are already defined in `package.json`. To install them, run:

```bash
npm install
```

### Key Frontend Dependencies:

- **React 18.3.1** - UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool
- **Tailwind CSS 3.4.17** - Styling
- **Radix UI** - Accessible UI components
- **Axios 1.12.2** - HTTP client
- **React Query 5.83.0** - Data fetching
- **Recharts 2.15.4** - Charts and visualization
- **Lucide React 0.462.0** - Icons

## Backend Dependencies (Python)

The Python backend dependencies are defined in `requirements.txt`.

### Installation Instructions:

**For Python 3.12+ (recommended approach):**

```bash
# First, upgrade pip and setuptools
python -m pip install --upgrade pip setuptools wheel

# Install dependencies
pip install -r requirements.txt
```

**If you encounter compatibility issues:**

```bash
# Create a virtual environment (recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Upgrade pip and setuptools
python -m pip install --upgrade pip setuptools wheel

# Install dependencies
pip install -r requirements.txt
```

**Alternative: Install core dependencies individually:**

```bash
pip install flask flask-cors pandas numpy scikit-learn joblib requests python-dotenv
```

### Key Backend Dependencies:

- **Flask 2.3.3** - Web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **Pandas 2.0.3** - Data manipulation
- **NumPy 1.24.3** - Numerical computing
- **Scikit-learn 1.3.0** - Machine learning
- **Requests 2.31.0** - HTTP requests
- **Joblib 1.3.2** - Model serialization

## Installation Instructions

### 1. Frontend Setup

```bash
cd farmer-friendly-plan
npm install
npm run dev
```

### 2. Backend Setup

```bash
cd farmer-friendly-plan
pip install -r requirements.txt
python app.py
```

### 3. Environment Variables

Create a `.env` file in the root directory with:

```
OPENWEATHER_API_KEY=your_openweather_api_key
MODEL_PREDICT_URL=http://127.0.0.1:5000/predict
```

## API Keys Required

1. **OpenWeather API**: Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. **SoilGrids API**: No API key required (free service)

## Running the Application

1. Start the Python backend server:

   ```bash
   python app.py
   ```

2. Start the React frontend:

   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:8080` (or the port shown in terminal)

## Additional Notes

- The app uses external APIs for weather data (OpenWeather) and soil data (SoilGrids)
- Machine learning models are loaded from `.pkl` files
- The frontend communicates with the backend via REST API calls
- All dependencies are pinned to specific versions for reproducibility
