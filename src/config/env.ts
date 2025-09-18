// Environment configuration
// This file loads environment variables and provides defaults

export const config = {
  // API Keys
  OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY || "f273e9ce95f51d30254d4775f42c5a72",
  
  // Backend URLs
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5001",
  MODEL_PREDICT_URL: import.meta.env.VITE_MODEL_PREDICT_URL || "http://localhost:5001/predict",
  CHAT_API_URL: import.meta.env.VITE_CHAT_API_URL || "http://localhost:5001/chat",
  TRANSLATE_API_URL: import.meta.env.VITE_TRANSLATE_API_URL || "http://localhost:5001/translate",
  PREDICT_TOP3_API_URL: import.meta.env.VITE_PREDICT_TOP3_API_URL || "http://localhost:5001/predict-top3",
  PREDICT_PRICES_API_URL: import.meta.env.VITE_PREDICT_PRICES_API_URL || "http://localhost:5001/predict-prices",
  
  // External APIs
  SOILGRIDS_BASE_URL: import.meta.env.VITE_SOILGRIDS_BASE_URL || "https://rest.isric.org/soilgrids/v2.0/properties/query",
  
  // App Configuration
  NODE_ENV: import.meta.env.MODE || "development",
  DEBUG: import.meta.env.VITE_DEBUG === "true" || false,
  
  // CORS Origins
  CORS_ORIGINS: import.meta.env.VITE_CORS_ORIGINS || "http://localhost:8080,http://127.0.0.1:8080",
};

// Validate required environment variables
export const validateConfig = () => {
  const requiredVars = [
    'OPENWEATHER_API_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !config[varName as keyof typeof config]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default values. Please set proper environment variables for production.');
  }
  
  return missing.length === 0;
};

// Initialize config validation
validateConfig();
