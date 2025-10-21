#!/bin/bash

echo "🚀 Building Pizoo Android App..."

# Build web app
echo "📦 Building web application..."
cd "$(dirname "$0")"
yarn install
yarn build

# Sync with Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync android

# Build Android APK
echo "📱 Building Android APK..."
cd android
./gradlew assembleDebug --no-daemon

echo "✅ Build complete! APK location:"
echo "$(pwd)/app/build/outputs/apk/debug/app-debug.apk"
