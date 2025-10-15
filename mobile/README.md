# SmallAviationMonitor - Mobile GPS Logger

A simple, cross-platform (iOS & Android) GPS logger application for SmallAviationMonitor that sends precise location data to the monitoring server.

## Features

✅ **Simple Configuration**
- Aircraft type selection (Aircraft, Drone, Paraglider, Hot Air Balloon)
- Pilot name
- Phone number
- Auto-generated unique device ID

✅ **Precise GPS Tracking**
- High-accuracy location tracking
- Requests and uses precise location permissions
- Updates every 5 seconds or 10 meters
- Sends data to SmallAviationMonitor API

✅ **Real-time Data Transmission**
- Automatic background location updates
- Displays current position, altitude, speed, and accuracy
- Shows last update time and total updates sent
- Error tracking and display

✅ **User-friendly Interface**
- Clean, modern design
- Easy configuration form
- One-toggle tracking control
- Real-time statistics
- Visual feedback for all states

## Requirements

### Development
- Node.js 18+
- React Native CLI
- Xcode (for iOS development, Mac only)
- Android Studio (for Android development)

### Device Requirements
- **iOS**: iOS 13.0 or higher
- **Android**: Android 6.0 (API level 23) or higher
- GPS/Location services enabled
- Internet connection

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. iOS Setup (Mac only)

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

Ensure Android SDK is installed and configured. The app should work out of the box.

## Running the App

### iOS Simulator/Device

```bash
npm run ios

# Or for a specific device/simulator
npm run ios -- --simulator="iPhone 15 Pro"
```

### Android Emulator/Device

```bash
npm run android

# Or to list devices
adb devices
npm run android -- --deviceId=<device_id>
```

## Building for Production

### iOS (requires Apple Developer account)

1. Open `ios/SmallAviationMonitor.xcworkspace` in Xcode
2. Select your development team
3. Update bundle identifier
4. Archive and distribute via App Store or TestFlight

### Android

```bash
cd android
./gradlew assembleRelease

# APK will be at:
# android/app/build/outputs/apk/release/app-release.apk
```

For signed release:
1. Generate keystore
2. Configure `android/gradle.properties`
3. Run `./gradlew bundleRelease` for AAB (Google Play)

## Configuration

### API Endpoint

The app sends data to:
```
https://smallaviationmonitor-api.administrator-112.workers.dev/api/v1/gps/position
```

To change this, edit `API_URL` in `App.tsx`.

### Update Interval

Default: 5 seconds or 10 meters

To change, modify in `App.tsx`:
```typescript
const LOCATION_UPDATE_INTERVAL = 5000; // milliseconds
```

And in the Geolocation configuration:
```typescript
distanceFilter: 10, // meters
```

## Permissions

### iOS (Info.plist)
- `NSLocationWhenInUseUsageDescription` - Location when app is in use
- `NSLocationAlwaysAndWhenInUseUsageDescription` - Background location

### Android (AndroidManifest.xml)
- `ACCESS_FINE_LOCATION` - Precise location
- `ACCESS_COARSE_LOCATION` - Approximate location
- `ACCESS_BACKGROUND_LOCATION` - Background location (Android 10+)
- `INTERNET` - Network access

## Usage

### First Time Setup

1. **Launch the app**
2. **Grant location permission** when prompted
3. **Fill in configuration**:
   - Select aircraft type
   - Enter your name
   - Enter phone number
4. **Tap "Save Configuration"**
5. **Toggle tracking ON** using the switch

### During Flight

- The app will automatically send location updates every 5 seconds
- Keep the app open or in background
- Monitor real-time position, altitude, and speed
- Check "Updates Sent" counter to verify data transmission

### After Flight

- Toggle tracking OFF using the switch
- Review statistics
- Check for any errors in the "Recent Errors" section

## Data Format

The app sends JSON data in this format:

```json
{
  "deviceId": "device_1234567890_abc123",
  "deviceType": "aircraft",
  "position": {
    "lat": 40.7128,
    "lng": -74.0060,
    "altitude": 3500,
    "altitudeUnit": "meters"
  },
  "telemetry": {
    "speed": 150,
    "speedUnit": "kmh",
    "heading": 270,
    "accuracy": 5.0
  },
  "device": {
    "name": "John Doe",
    "pilot": "John Doe",
    "contact": "+1234567890"
  },
  "timestamp": "2025-10-15T12:34:56.789Z"
}
```

## Troubleshooting

### Location Not Updating

1. Check if location permissions are granted
2. Ensure GPS/Location services are enabled on device
3. Try restarting the app
4. Check if device has clear view of sky (for GPS signal)

### Data Not Sending

1. Check internet connection
2. Verify API endpoint is accessible
3. Review "Recent Errors" section in app
4. Check backend logs for errors

### App Crashes

1. Check console logs: `npm start` and press `i` for iOS or `a` for Android
2. Verify all dependencies are installed
3. Clean and rebuild:
   ```bash
   # iOS
   cd ios && pod install && cd ..
   npm run ios
   
   # Android
   cd android && ./gradlew clean && cd ..
   npm run android
   ```

## Known Limitations

- Background tracking may be limited on iOS due to system restrictions
- Battery consumption increases during active tracking
- Requires constant internet connection for data transmission
- Location accuracy depends on device GPS capabilities and environment

## Privacy & Security

- Device ID is generated locally and never shared
- Only location data and configured information is sent to server
- All data transmission uses HTTPS
- No data is stored locally except configuration
- User can stop tracking at any time

## Future Enhancements

- [ ] Background tracking optimization
- [ ] Offline data queue (send when connection restored)
- [ ] Flight path visualization
- [ ] Battery usage optimization
- [ ] Multiple device profiles
- [ ] Push notifications for alerts
- [ ] Flight history

## Support

For issues or questions:
- GitHub: https://github.com/mihrans/SmallAviationMonitor/issues
- Documentation: See main project README

## License

See LICENSE file in root project directory.

---

**Version**: 1.0.0  
**Last Updated**: October 15, 2025  
**Platform**: iOS & Android (React Native)
