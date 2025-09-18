#!/usr/bin/env node

import fs from "fs";
import path from "path";

// Create .env file with all necessary environment variables
const envContent = `# ===========================================
# ENVIRONMENT VARIABLES FOR FARMER-FRIENDLY PLAN
# ===========================================

# API Keys (Required)
OPENWEATHER_API_KEY=f273e9ce95f51d30254d4775f42c5a72

# Backend Configuration
BACKEND_URL=http://localhost:5001
MODEL_PREDICT_URL=http://localhost:5001/predict
CHAT_API_URL=http://localhost:5001/chat
TRANSLATE_API_URL=http://localhost:5001/translate
PREDICT_TOP3_API_URL=http://localhost:5001/predict-top3
PREDICT_PRICES_API_URL=http://localhost:5001/predict-prices

# External APIs
SOILGRIDS_BASE_URL=https://rest.isric.org/soilgrids/v2.0/properties/query

# App Configuration
NODE_ENV=development
DEBUG=true
FRONTEND_URL=http://localhost:8080
CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080

# Security
SECRET_KEY=your_secret_key_change_this_in_production

# Logging
LOG_LEVEL=INFO
`;

// Create .env file
fs.writeFileSync(".env", envContent);

// Create .env.local for Vite (client-side)
const viteEnvContent = `# ===========================================
# VITE ENVIRONMENT VARIABLES (CLIENT-SIDE)
# ===========================================
# Note: Vite requires VITE_ prefix for client-side variables

# API Keys
VITE_OPENWEATHER_API_KEY=f273e9ce95f51d30254d4775f42c5a72

# Backend Configuration
VITE_BACKEND_URL=http://localhost:5001
VITE_MODEL_PREDICT_URL=http://localhost:5001/predict
VITE_CHAT_API_URL=http://localhost:5001/chat
VITE_TRANSLATE_API_URL=http://localhost:5001/translate
VITE_PREDICT_TOP3_API_URL=http://localhost:5001/predict-top3
VITE_PREDICT_PRICES_API_URL=http://localhost:5001/predict-prices

# External APIs
VITE_SOILGRIDS_BASE_URL=https://rest.isric.org/soilgrids/v2.0/properties/query

# App Configuration
VITE_DEBUG=true
VITE_CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
`;

fs.writeFileSync(".env.local", viteEnvContent);

console.log("✅ Environment files created successfully!");
console.log("📁 Created: .env (for backend)");
console.log("📁 Created: .env.local (for frontend)");
console.log("");
console.log("🔧 Next steps:");
console.log("1. Review the environment variables in both files");
console.log("2. Update API keys if needed");
console.log("3. Run: npm run dev (for frontend)");
console.log("4. Run: python app.py (for backend)");
