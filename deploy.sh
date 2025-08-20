#!/bin/bash

# WMX TOPUP - Vercel Deployment Script
echo "🚀 Starting WMX TOPUP deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project locally first to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix build errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"

# Check if environment variables are set
echo "🔍 Checking environment variables..."

if [ -z "$VITE_SUPABASE_URL" ] && [ ! -f ".env" ]; then
    echo "⚠️  Environment variables not found. Make sure .env file exists or variables are set."
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

# Deploy to preview first
echo "📦 Deploying to preview environment..."
vercel --confirm

if [ $? -ne 0 ]; then
    echo "❌ Preview deployment failed!"
    exit 1
fi

echo "✅ Preview deployment successful!"

# Ask user if they want to deploy to production
read -p "🎯 Deploy to production? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to production..."
    vercel --prod --confirm
    
    if [ $? -eq 0 ]; then
        echo "🎉 Production deployment successful!"
        echo "📊 You can monitor your deployment at: https://vercel.com/dashboard"
    else
        echo "❌ Production deployment failed!"
        exit 1
    fi
else
    echo "⏸️  Production deployment skipped."
fi

echo "✅ Deployment process completed!"