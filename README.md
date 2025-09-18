# Farmer-Friendly Plan - AI Crop Recommendation System

A comprehensive web application that helps farmers make informed decisions about crop selection based on weather conditions, soil properties, and market trends.

## 🌟 Features

- **AI-Powered Crop Recommendations** - Get personalized crop suggestions based on your location
- **Real-time Weather Data** - Current weather conditions and forecasts
- **Soil Analysis** - Soil properties including pH and nitrogen content
- **Market Price Tracking** - Current market prices and trends
- **Comprehensive Crop Database** - Detailed information for 17+ crops
- **Multi-language Support** - Available in English and Hindi
- **Responsive Design** - Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd farmer-friendly-plan
   ```

2. **Install Frontend Dependencies**

   ```bash
   npm install
   ```

3. **Install Backend Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up Environment Variables**

   ```bash
   # Copy the example environment file
   cp env.example .env

   # Edit .env with your actual values
   # At minimum, you need to add your OpenWeather API key
   ```

5. **Get API Keys**
   - Get a free OpenWeather API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Add it to your `.env` file

### Running the Application

1. **Start the Backend Server**

   ```bash
   python app.py
   ```

   The backend will run on `http://localhost:5001`

2. **Start the Frontend Development Server**

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:8080`

3. **Open your browser** and navigate to `http://localhost:8080`

## 📁 Project Structure

```
farmer-friendly-plan/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── data/              # Static data and databases
│   └── types/             # TypeScript type definitions
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── env.example           # Environment variables template
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required
OPENWEATHER_API_KEY=your_openweather_api_key_here
MODEL_PREDICT_URL=http://127.0.0.1:5001/predict

# Optional
BACKEND_PORT=5001
FRONTEND_PORT=8080
DEBUG=true
```

### API Keys Required

1. **OpenWeather API** - Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. **SoilGrids API** - No API key required (free service)

## 🌾 Supported Crops

The application includes detailed information for 17 crops:

- Apple
- Arhar Dal (Pigeon Pea)
- Banana
- Black Gram (Urd Beans)
- Coconut
- Cotton
- Grapes
- Jute
- Kabuli Chana (White Chickpeas)
- Lentil (Masur)
- Maize
- Mango
- Moath Dal (Moth Bean)
- Orange
- Papaya
- Pomegranate
- Rice

## 🛠️ Development

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Backend Development

```bash
# Run Flask development server
python app.py

# Run with debug mode
FLASK_DEBUG=1 python app.py
```

## 📊 API Endpoints

### Backend API

- `POST /predict` - Get crop recommendations
- `POST /predict-top3` - Get top 3 crop recommendations
- `POST /predict-prices` - Get price predictions
- `POST /translate` - Translate text
- `POST /chat` - Chat with AI assistant

### External APIs

- **OpenWeather API** - Weather data
- **SoilGrids API** - Soil properties

## 🚀 Deployment

### Frontend Deployment

1. Build the production version:

   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service

### Backend Deployment

1. Install production dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Set production environment variables

3. Run with a production WSGI server:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5001 app:app
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- SoilGrids for soil property data
- React and Flask communities
- All contributors and farmers who provided feedback

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

- **v1.0.0** - Initial release with basic crop recommendations
- **v1.1.0** - Added comprehensive crop database
- **v1.2.0** - Enhanced UI and removed non-functional elements

---

**Made with ❤️ for farmers worldwide**
