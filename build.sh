#!/bin/bash

# Build script for Render deployment

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Built files are in the 'dist' directory"
