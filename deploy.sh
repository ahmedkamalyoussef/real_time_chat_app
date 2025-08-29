#!/bin/bash

echo "🚀 Starting deployment process..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build:prod
cd ..

# Build backend
echo "🔧 Building backend..."
cd backend
npm run build:prod
cd ..

echo "✅ Build complete!"
echo "🌐 To start production server:"
echo "   cd backend && npm run start:prod"
echo ""
echo "📱 Frontend will be served from backend at:"
echo "   http://localhost:3000"
