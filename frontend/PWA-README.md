# PWA GPS Logger

## Overview
The Progressive Web App (PWA) version of SmallAviationMonitor GPS Logger provides a cross-platform solution that works on both iOS and Android without requiring app store distribution.

## Features
- ✅ **Cross-Platform**: Works on iOS and Android
- ✅ **GPS Access**: Full Geolocation API access with high accuracy
- ✅ **Offline Support**: Service worker caches for offline operation
- ✅ **Background Sync**: Queues GPS data when offline, syncs when online
- ✅ **Installable**: Add to home screen for app-like experience
- ✅ **No App Store**: No TestFlight, no Google Play required
- ✅ **Instant Updates**: Updates automatically on refresh

## How It Works

### GPS Tracking
- Uses browser's Geolocation API (`navigator.geolocation.watchPosition`)
- High accuracy mode enabled
- Updates every 5 seconds
- Sends data to Cloudflare Workers API

### Offline Support
- Service Worker caches app shell
- IndexedDB stores pending GPS data
- Automatic sync when connection restored
- Background Sync API for reliable delivery

### Installation

#### iOS (Safari)
1. Open https://smallaviationmonitor.pages.dev/pwa in Safari
2. Tap Share button (square with arrow up)
3. Select "Add to Home Screen"
4. Name it and tap "Add"
5. Open from home screen, grant location permission

#### Android (Chrome)
1. Open https://smallaviationmonitor.pages.dev/pwa in Chrome
2. Tap "Add to Home Screen" banner
3. Or: Menu (⋮) → "Install app"
4. Open from home screen, grant location permission

## File Structure

```
frontend/
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── service-worker.js       # Service worker for offline/caching
│   ├── pwa-icon-192.png       # 192x192 app icon
│   └── pwa-icon-512.png       # 512x512 app icon
├── src/
│   ├── components/
│   │   └── PWAGPSLogger.tsx   # Main PWA component
│   └── pages/
│       └── PWA.tsx             # PWA page
└── index.html                  # Updated with PWA meta tags
```

## Configuration

### Manifest (manifest.json)
- App name and icons
- Display mode: standalone (fullscreen)
- Theme colors
- Start URL: /pwa
- Permissions: geolocation

### Service Worker (service-worker.js)
- Caches app shell and assets
- Network-first strategy for API calls
- IndexedDB for pending GPS data
- Background sync support

## Usage

1. **Configure Device**:
   - Select aircraft type (Aircraft, Drone, Paraglider, Hot Air Balloon)
   - Enter pilot name
   - Enter phone number
   - Device ID is auto-generated

2. **Start Tracking**:
   - Tap "Start Tracking"
   - Grant location permission
   - GPS updates sent every 5 seconds
   - Live position displayed

3. **Monitor Status**:
   - Online/Offline indicator
   - Total updates sent
   - Pending updates (when offline)
   - Last update time
   - Live GPS coordinates

## API Integration

### Endpoint
```
POST https://smallaviationmonitor-api.administrator-112.workers.dev/api/v1/gps/position
```

### Payload
```json
{
  "deviceId": "pwa_1234567890_abc123",
  "deviceType": "aircraft",
  "position": {
    "lat": 40.7128,
    "lng": -74.0060,
    "altitude": 100,
    "altitudeUnit": "meters"
  },
  "telemetry": {
    "speed": 120,
    "speedUnit": "kmh",
    "heading": 90,
    "accuracy": 10
  },
  "device": {
    "name": "John Doe",
    "pilot": "John Doe",
    "contact": "+1234567890"
  },
  "timestamp": "2024-01-15T12:00:00.000Z",
  "source": "pwa"
}
```

## Advantages Over Native Apps

### For Users
- ✅ No app store account required
- ✅ No download/install wait time
- ✅ Works on both iOS and Android
- ✅ Always up-to-date
- ✅ Less storage space
- ✅ Can uninstall instantly (just remove from home screen)

### For Developers
- ✅ No App Store approval process ($99/year saved)
- ✅ No Google Play approval process ($25 one-time saved)
- ✅ Single codebase for both platforms
- ✅ Instant updates (no review delay)
- ✅ Easier testing and debugging
- ✅ No build/signing complexity

## Limitations

### iOS
- ⚠️ Safari only (iOS doesn't support PWAs in other browsers)
- ⚠️ No background GPS when app is closed (same as native without special permission)
- ⚠️ 50MB cache limit
- ⚠️ Must be added to home screen for full experience

### Android
- ✅ Works in Chrome, Edge, Samsung Internet
- ✅ Better background support
- ✅ Larger cache limits
- ✅ More reliable service worker

## Browser Support

### iOS
- Safari 11.3+ (iOS 11.3+)
- Requires "Add to Home Screen"
- Full Geolocation API support

### Android
- Chrome 40+
- Edge 79+
- Samsung Internet 4+
- Opera 32+
- Firefox 44+ (limited PWA features)

## Testing

### Local Development
```bash
cd frontend
npm run dev
# Open http://localhost:5173/pwa
```

### Production
```
https://smallaviationmonitor.pages.dev/pwa
```

### Test Offline
1. Open DevTools → Network
2. Check "Offline"
3. Start tracking
4. Verify data queued in IndexedDB
5. Uncheck "Offline"
6. Verify data synced to server

## Troubleshooting

### Location Permission Denied
- iOS: Settings → Safari → Location → "Ask" or "Allow"
- Android: Settings → Apps → Chrome → Permissions → Location → "Allow all the time"

### Service Worker Not Registering
- Check HTTPS (required for service workers)
- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R)

### Data Not Syncing
- Check network connection
- Open DevTools → Application → IndexedDB → aviation-gps-db
- Verify pending-gps store has data
- Manually trigger sync by going online

### App Not Installing
- iOS: Must use Safari, tap Share → Add to Home Screen
- Android: Look for banner or Menu → Install app
- Check manifest.json is accessible: /manifest.json

## Future Enhancements

- [ ] Battery optimization settings
- [ ] Geofencing alerts
- [ ] Flight path visualization
- [ ] Export flight history
- [ ] Share live tracking link
- [ ] Push notifications (when supported)
- [ ] WebAssembly for better performance
- [ ] WebRTC for real-time communication

## Notes

- PWA is **recommended for iOS users** since native iOS apps require App Store approval
- Android users can choose between PWA and native APK
- PWA has same features as native apps for GPS tracking
- Service worker updates automatically on page reload
- IndexedDB stores up to 50MB on iOS, 100MB+ on Android

## Links

- **Launch PWA**: https://smallaviationmonitor.pages.dev/pwa
- **Download Page**: https://smallaviationmonitor.pages.dev/download
- **Main Dashboard**: https://smallaviationmonitor.pages.dev
- **API Docs**: https://github.com/mihrans/SmallAviationMonitor/blob/main/docs/api-specifications.md
