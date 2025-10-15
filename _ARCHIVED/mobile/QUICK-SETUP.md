# Mobile App Quick Setup Guide

## 🚀 Quick Start

The mobile GPS logger is ready to use! Follow these steps to get it running:

### Option 1: Expo (Easiest - Recommended)

For the simplest setup, we can convert this to Expo which handles most configuration automatically:

```bash
cd mobile
npx create-expo-app@latest --template blank-typescript
# Then copy our App.tsx and configuration
```

### Option 2: React Native CLI (Full control)

**Prerequisites:**
- Node.js 18+ installed
- For iOS: Mac with Xcode
- For Android: Android Studio with SDK

**Setup Steps:**

```bash
# 1. Navigate to mobile directory
cd H:\SmallAviationMonitor\mobile

# 2. Install dependencies
npm install

# 3a. For iOS (Mac only)
cd ios
pod install
cd ..
npx react-native run-ios

# 3b. For Android
npx react-native run-android
```

## 📱 What the App Does

### Configuration Screen
- Select aircraft type (Aircraft, Drone, Paraglider, Hot Air Balloon)
- Enter pilot name
- Enter phone number
- Auto-generates unique device ID

### GPS Tracking
- Requests precise location permission
- Tracks position every 5 seconds or 10 meters
- Sends data to: `https://smallaviationmonitor-api.administrator-112.workers.dev/api/v1/gps/position`

### Real-time Display
- Current latitude, longitude, altitude
- Speed and heading
- Location accuracy
- Update statistics
- Error tracking

## 🔧 Configuration

### Change API Endpoint
Edit `mobile/App.tsx`, line 20:
```typescript
const API_URL = 'https://your-api-url.com/api/v1/gps/position';
```

### Change Update Frequency
Edit `mobile/App.tsx`, line 21:
```typescript
const LOCATION_UPDATE_INTERVAL = 5000; // milliseconds
```

## 📦 Dependencies

The app uses:
- **react-native-geolocation-service** - High-accuracy GPS tracking
- **@react-native-async-storage/async-storage** - Local storage for configuration
- **axios** - HTTP requests to API

## 🔒 Permissions

### iOS (automatically requested)
- Location when in use
- Location always (for background tracking)

### Android (automatically requested)
- Fine location (precise GPS)
- Background location (Android 10+)

## 🎨 Features

✅ Simple, clean UI
✅ One-toggle tracking control
✅ Real-time position display
✅ Automatic data transmission
✅ Error handling and display
✅ Statistics tracking
✅ Offline configuration storage

## 📱 Testing Without Building

For quick testing without setting up React Native:

1. Use **Expo Go** app (available on App Store/Play Store)
2. Convert project to Expo
3. Scan QR code to run on your device

## 🐛 Troubleshooting

**Can't build?**
- Ensure Android Studio or Xcode is properly installed
- Try cleaning build: `cd android && ./gradlew clean`
- For iOS: `cd ios && pod install`

**GPS not working?**
- Check device location services are enabled
- Grant app permissions when prompted
- Test outdoors for better GPS signal

**Can't connect to API?**
- Check internet connection
- Verify API URL is correct
- Test API with curl/Postman first

## 🚀 Quick Test with Expo (Recommended for Testing)

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Create new Expo project
npx create-expo-app aviation-gps-logger --template blank-typescript

# Copy our App.tsx content to the new project
# Install location package
npm install expo-location axios @react-native-async-storage/async-storage

# Start development server
npx expo start

# Scan QR code with Expo Go app on your phone
```

## 📖 Full Documentation

See `mobile/README.md` for complete documentation including:
- Detailed setup instructions
- Building for production
- Data format specification
- Advanced configuration
- Privacy considerations

---

**Quick Links:**
- API Endpoint: https://smallaviationmonitor-api.administrator-112.workers.dev
- GitHub: https://github.com/mihrans/SmallAviationMonitor
- Backend Documentation: `docs/api-specifications.md`
