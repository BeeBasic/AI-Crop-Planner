# ✅ Render Deployment Checklist

## 📋 Pre-Deployment Checklist

### Code Preparation

- [ ] All code committed to GitHub
- [ ] `requirements.txt` updated with exact versions
- [ ] `app_production.py` created for production
- [ ] `render.yaml` configuration file created
- [ ] `build.sh` script created
- [ ] Environment variables configured

### Files to Verify in Repository

- [ ] `requirements.txt` - Python dependencies
- [ ] `package.json` - Node.js dependencies
- [ ] `app_production.py` - Production Flask app
- [ ] `render.yaml` - Render configuration
- [ ] `build.sh` - Build script
- [ ] `src/` - Frontend source code
- [ ] `crop_model.pkl` - ML model file
- [ ] `label_encoder.pkl` - Label encoder file
- [ ] `price_prediction_service.py` - Price prediction service

## 🚀 Deployment Steps

### Step 1: Backend Deployment

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `gunicorn app_production:app --bind 0.0.0.0:$PORT`
- [ ] Set environment variables:
  - [ ] `OPENWEATHER_API_KEY`
  - [ ] `SOILGRIDS_BASE_URL`
  - [ ] `CORS_ORIGINS`
  - [ ] `DEBUG=false`
  - [ ] `NODE_ENV=production`
- [ ] Deploy and get backend URL

### Step 2: Frontend Deployment

- [ ] Create new Static Site on Render
- [ ] Connect same GitHub repository
- [ ] Set build command: `npm install && npm run build`
- [ ] Set publish directory: `dist`
- [ ] Set environment variables:
  - [ ] `VITE_OPENWEATHER_API_KEY`
  - [ ] `VITE_BACKEND_URL` (use backend URL from Step 1)
  - [ ] `VITE_MODEL_PREDICT_URL`
  - [ ] `VITE_CHAT_API_URL`
  - [ ] `VITE_TRANSLATE_API_URL`
  - [ ] `VITE_PREDICT_TOP3_API_URL`
  - [ ] `VITE_PREDICT_PRICES_API_URL`
  - [ ] `VITE_SOILGRIDS_BASE_URL`
- [ ] Deploy and get frontend URL

### Step 3: Final Configuration

- [ ] Update backend CORS_ORIGINS with frontend URL
- [ ] Redeploy backend
- [ ] Test both services are working

## 🧪 Testing Checklist

### Backend Testing

- [ ] Health check: `GET /health`
- [ ] Prediction endpoint: `POST /predict`
- [ ] Top 3 predictions: `POST /predict-top3`
- [ ] Price predictions: `POST /predict-prices`
- [ ] Chat endpoint: `POST /chat`
- [ ] Translation endpoint: `POST /translate`

### Frontend Testing

- [ ] Site loads without errors
- [ ] Location detection works
- [ ] Weather data loads
- [ ] Soil data loads
- [ ] Crop recommendations work
- [ ] Crop details page works
- [ ] Chatbot responds
- [ ] Translation works

### Integration Testing

- [ ] Frontend can communicate with backend
- [ ] No CORS errors in browser console
- [ ] All API calls successful
- [ ] Data flows correctly between services

## 🔧 Environment Variables Reference

### Backend (.env)

```env
OPENWEATHER_API_KEY=your_api_key_here
SOILGRIDS_BASE_URL=https://rest.isric.org/soilgrids/v2.0/properties/query
CORS_ORIGINS=https://your-frontend-url.onrender.com
DEBUG=false
NODE_ENV=production
```

### Frontend (.env.local)

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_BACKEND_URL=https://your-backend-url.onrender.com
VITE_MODEL_PREDICT_URL=https://your-backend-url.onrender.com/predict
VITE_CHAT_API_URL=https://your-backend-url.onrender.com/chat
VITE_TRANSLATE_API_URL=https://your-backend-url.onrender.com/translate
VITE_PREDICT_TOP3_API_URL=https://your-backend-url.onrender.com/predict-top3
VITE_PREDICT_PRICES_API_URL=https://your-backend-url.onrender.com/predict-prices
VITE_SOILGRIDS_BASE_URL=https://rest.isric.org/soilgrids/v2.0/properties/query
```

## 🚨 Common Issues & Solutions

### Build Failures

- **Issue**: Python dependencies not found
- **Solution**: Check `requirements.txt` has all dependencies with exact versions

### CORS Errors

- **Issue**: Frontend can't access backend
- **Solution**: Update `CORS_ORIGINS` with correct frontend URL

### Model Loading Errors

- **Issue**: ML model files not found
- **Solution**: Ensure `.pkl` files are committed to repository

### Environment Variable Issues

- **Issue**: API calls failing
- **Solution**: Verify all environment variables are set correctly

## 📞 Support Resources

- [Render Documentation](https://render.com/docs)
- [Flask Deployment Guide](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

**🎯 Once all items are checked, your app should be successfully deployed on Render!**
