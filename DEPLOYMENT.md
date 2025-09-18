# 🚀 Deployment Guide for Render

This guide will help you deploy your Farmer-Friendly Plan application on Render.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be pushed to GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **API Keys** - You'll need your OpenWeather API key

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify these files are in your repository:**
   - ✅ `requirements.txt` (Python dependencies)
   - ✅ `package.json` (Node.js dependencies)
   - ✅ `app_production.py` (Production Flask app)
   - ✅ `render.yaml` (Render configuration)
   - ✅ `build.sh` (Build script)
   - ✅ `src/` directory (Frontend code)

### Step 2: Deploy Backend (Flask API)

1. **Go to Render Dashboard:**

   - Visit [render.com](https://render.com)
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository:**

   - Select your repository
   - Choose the branch (usually `main`)

3. **Configure Backend Service:**

   ```
   Name: farmer-friendly-plan-backend
   Environment: Python 3
   Region: Choose closest to your users
   Branch: main
   Root Directory: (leave empty)
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app_production:app --bind 0.0.0.0:$PORT
   ```

4. **Set Environment Variables:**

   ```
   OPENWEATHER_API_KEY = your_actual_api_key_here
   SOILGRIDS_BASE_URL = https://rest.isric.org/soilgrids/v2.0/properties/query
   CORS_ORIGINS = https://farmer-friendly-plan-frontend.onrender.com
   DEBUG = false
   NODE_ENV = production
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://farmer-friendly-plan-backend.onrender.com`)

### Step 3: Deploy Frontend (React App)

1. **Create New Static Site:**

   - Click "New +" → "Static Site"
   - Connect the same GitHub repository

2. **Configure Frontend Service:**

   ```
   Name: farmer-friendly-plan-frontend
   Branch: main
   Root Directory: (leave empty)
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Set Environment Variables:**

   ```
   VITE_OPENWEATHER_API_KEY = your_actual_api_key_here
   VITE_BACKEND_URL = https://farmer-friendly-plan-backend.onrender.com
   VITE_MODEL_PREDICT_URL = https://farmer-friendly-plan-backend.onrender.com/predict
   VITE_CHAT_API_URL = https://farmer-friendly-plan-backend.onrender.com/chat
   VITE_TRANSLATE_API_URL = https://farmer-friendly-plan-backend.onrender.com/translate
   VITE_PREDICT_TOP3_API_URL = https://farmer-friendly-plan-backend.onrender.com/predict-top3
   VITE_PREDICT_PRICES_API_URL = https://farmer-friendly-plan-backend.onrender.com/predict-prices
   VITE_SOILGRIDS_BASE_URL = https://rest.isric.org/soilgrids/v2.0/properties/query
   ```

4. **Deploy:**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://farmer-friendly-plan-frontend.onrender.com`)

### Step 4: Update CORS Settings

1. **Go back to your backend service**
2. **Update the CORS_ORIGINS environment variable:**
   ```
   CORS_ORIGINS = https://farmer-friendly-plan-frontend.onrender.com
   ```
3. **Redeploy the backend**

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails:**

   - Check that all dependencies are in `requirements.txt`
   - Verify Python version compatibility
   - Check build logs for specific errors

2. **CORS Errors:**

   - Ensure CORS_ORIGINS includes your frontend URL
   - Check that URLs don't have trailing slashes

3. **API Not Working:**

   - Verify environment variables are set correctly
   - Check that the backend URL is correct in frontend config

4. **Model Loading Issues:**
   - Ensure `crop_model.pkl` and `label_encoder.pkl` are in the repository
   - Check file paths in the code

### Debug Commands:

```bash
# Check if backend is running
curl https://your-backend-url.onrender.com/health

# Test a prediction
curl -X POST https://your-backend-url.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{"N": 1.5, "ph": 6.5, "temperature": 25, "humidity": 60, "rainfall": 100}'
```

## 📊 Monitoring

1. **Check Logs:**

   - Go to your service dashboard
   - Click "Logs" tab
   - Monitor for errors

2. **Health Check:**
   - Visit `https://your-backend-url.onrender.com/health`
   - Should return status information

## 🔄 Updates

To update your deployment:

1. **Make changes to your code**
2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update for deployment"
   git push origin main
   ```
3. **Render will automatically redeploy**

## 💰 Cost Considerations

- **Free Tier:** 750 hours/month per service
- **Backend:** Uses free tier (may sleep after inactivity)
- **Frontend:** Static site, always available
- **Upgrade:** If you need more resources, consider paid plans

## 🎯 Final Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] API keys working
- [ ] Health check passing
- [ ] Frontend can communicate with backend

## 🆘 Support

If you encounter issues:

1. Check the Render documentation
2. Review build and runtime logs
3. Verify all environment variables
4. Test API endpoints individually
5. Check GitHub issues or create a new one

---

**🎉 Congratulations! Your Farmer-Friendly Plan app should now be live on Render!**
