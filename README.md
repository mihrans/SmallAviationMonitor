# SmallAviationMonitor

> A worldwide GPS device monitoring system for aviation traffic with real-time tracking via Progressive Web App.

[![Project Status](https://img.shields.io/badge/status-production-green.svg)](https://smallaviationmonitor.pages.dev)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![Cloudflare](https://img.shields.io/badge/deployed%20on-Cloudflare-orange.svg)](https://www.cloudflare.com)

## 🚀 Live URLs

- **Dashboard**: https://smallaviationmonitor.pages.dev
- **GPS Logger PWA**: https://smallaviationmonitor.pages.dev/pwa
- **Download Page**: https://smallaviationmonitor.pages.dev/download
- **Backend API**: https://smallaviationmonitor-api.administrator-112.workers.dev

## 📋 Project Overview

SmallAviationMonitor is a real-time GPS tracking and airspace monitoring web application designed for pilots operating various types of aircraft including small and large aircraft, drones, paragliders, and hot air balloons. The system enables worldwide traffic monitoring through a Progressive Web App that works on iOS and Android.

### Current Status: **✅ PRODUCTION** 

The system is fully deployed and operational:
- ✅ **Frontend**: Deployed on Cloudflare Pages
- ✅ **Backend API**: Running on Cloudflare Workers
- ✅ **Database**: Cloudflare D1 (SQLite) with 7 tables
- ✅ **GPS Logger**: Progressive Web App (iOS & Android)

## 📱 GPS Logger PWA

### Quick Start
1. Visit: https://smallaviationmonitor.pages.dev/download
2. Scan QR code with your phone
3. **iOS**: Safari → Share → "Add to Home Screen"
4. **Android**: Chrome → "Install app"
5. Open app, configure device, start tracking!

### Features
- ✅ Works on iOS (Safari 11.3+) & Android (Chrome, Edge)
- ✅ No app store required
- ✅ Full GPS/location access with high accuracy
- ✅ Offline support with IndexedDB + background sync
- ✅ 5-second update interval
- ✅ Device configuration (aircraft type, name, phone)
- ✅ Live position display (lat, lng, altitude, speed, heading)
- ✅ Automatic updates

### Why PWA?
- **For iOS**: No $99/year Apple Developer account needed
- **For Android**: No Google Play approval process  
- **For Everyone**: Instant updates, cross-platform, smaller footprint
- **Full GPS**: Same location accuracy as native apps

See [PWA Documentation](frontend/PWA-README.md) for complete details.

## 🎯 Key Features

### ✅ Currently Live

#### GPS Tracking (PWA)
- Progressive Web App installable on iOS and Android
- High-accuracy GPS tracking with 5-second updates
- Offline support with background sync
- Real-time telemetry (position, speed, heading, altitude)
- Device configuration and management
- Auto-generated device IDs

#### Monitoring Dashboard
- Real-time GPS device tracking on interactive map
- Multiple device type support (aircraft, drone, paraglider, balloon)
- Device status monitoring (online/offline/warning)
- Connection statistics dashboard
- Modern responsive UI with dark/light mode
- Live position updates

#### Backend Infrastructure
- RESTful API on Cloudflare Workers
- Global edge deployment for low latency
- Cloudflare D1 database (7 tables)
- CORS-enabled public API
- Health monitoring endpoint
- Automatic scaling

### 📋 Planned Features
- User authentication and pilot accounts
- Airspace reservation system (GPS polygons)
- Alert queue for notifications
- Historical playback of flight paths
- Push notifications (when Safari supports)
- Native mobile apps (currently archived)

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **PWA**: Service Worker + IndexedDB
- **Deployment**: Cloudflare Pages

### Backend
- **Runtime**: Cloudflare Workers (serverless)
- **Language**: TypeScript
- **Database**: Cloudflare D1 (SQLite)
- **API**: RESTful
- **Deployment**: Wrangler CLI

### GPS Logger PWA
- **Frontend**: React + TypeScript
- **GPS**: Geolocation API (watchPosition with high accuracy)
- **Offline**: Service Worker + IndexedDB queuing
- **Sync**: Background Sync API
- **Manifest**: PWA manifest.json for installability

## 📖 API Documentation

### GPS Position Endpoint
```http
POST /api/v1/gps/position
Content-Type: application/json

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

### Other Endpoints
- `GET /api/v1/devices` - List all devices
- `POST /api/v1/devices` - Register device
- `GET /api/v1/devices/:id` - Get device details
- `POST /api/v1/reservations` - Create airspace reservation
- `GET /api/v1/reservations` - List reservations
- `GET /health` - Health check

See [API Specifications](docs/api-specifications.md) for complete documentation.

## 🗂️ Project Structure

```
SmallAviationMonitor/
├── backend/                   # Cloudflare Workers API
│   ├── src/
│   │   └── index.ts          # Main API worker (500+ lines)
│   ├── schema/
│   │   └── init.sql          # Database schema (7 tables)
│   └── wrangler.toml         # Cloudflare configuration
├── frontend/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # 15+ React components
│   │   │   ├── PWAGPSLogger.tsx  # PWA GPS tracker (600+ lines)
│   │   │   ├── MobileDownload.tsx # Download page
│   │   │   └── ...
│   │   ├── pages/            # Index, Download, PWA, NotFound
│   │   └── contexts/         # App state management
│   ├── public/
│   │   ├── manifest.json     # PWA manifest
│   │   ├── service-worker.js # Service worker
│   │   └── pwa-icon-*.svg    # PWA icons
│   └── PWA-README.md         # PWA documentation
├── docs/                      # Complete documentation (15+ files)
│   ├── product-vision.md
│   ├── functionality-planning.md
│   ├── architecture.md
│   ├── api-specifications.md
│   └── ...
├── _ARCHIVED/                 # Future features (not in active development)
│   ├── mobile/               # React Native app (for future use)
│   └── _INCOMING/            # Previous codebase
└── README.md                  # This file
```

## 💻 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Wrangler CLI: `npm install -g wrangler`

### Backend
```bash
cd backend
npm install
wrangler dev
# API runs at http://localhost:8787
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

### PWA (Local)
```bash
cd frontend
npm run dev
# Open http://localhost:5173/pwa
```

## 🚀 Deployment

### Automated Deployment (GitHub Actions)
The project automatically deploys when you push to main:
- Frontend → Cloudflare Pages
- Backend → Cloudflare Workers

**Note**: Configure `CLOUDFLARE_API_TOKEN` in GitHub secrets for auto-deployment.

### Manual Deployment

#### Backend
```bash
cd backend
npm install
wrangler deploy
```

#### Frontend
```bash
cd frontend
npm install
npm run build
npm run deploy
```

## 📚 Documentation

### Getting Started
- [Quick Start Guide](QUICK-START.md)
- [Workspace Setup](WORKSPACE-SETUP.md)
- [Getting Started Guide](docs/getting-started.md)

### Deployment
- [Cloudflare Setup](CLOUDFLARE-SETUP.md)
- [GitHub Setup](GITHUB-SETUP.md)
- [Deployment Complete](DEPLOYMENT-COMPLETE.md)
- [Final Deployment Status](FINAL-DEPLOYMENT-STATUS.md)

### Features
- [PWA Implementation](PWA-IMPLEMENTATION.md)
- [PWA Documentation](frontend/PWA-README.md)
- [API Specifications](docs/api-specifications.md)

### Planning
- [Product Vision](docs/product-vision.md)
- [Functionality Planning](docs/functionality-planning.md)
- [Architecture Design](docs/architecture.md)
- [Technical Requirements](docs/technical-requirements.md)
- [Roadmap](docs/roadmap.md)

## 🎯 Current Focus: PWA Only

**Note**: Native mobile apps (Android APK and iOS apps) are currently archived in `_ARCHIVED/mobile/`. We're focusing on the Progressive Web App solution which:
- ✅ Works on both iOS and Android
- ✅ No app store approval required
- ✅ Instant updates
- ✅ Same GPS capabilities as native apps
- ✅ Smaller footprint
- ✅ Cross-platform with single codebase

Native apps will be enabled later when needed.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.

## 🆘 Support

- **Issues**: https://github.com/mihrans/SmallAviationMonitor/issues
- **Documentation**: Check the `docs/` folder
- **PWA Guide**: [frontend/PWA-README.md](frontend/PWA-README.md)

## 📊 Project Status

| Component | Status | URL/Details |
|-----------|--------|-------------|
| Frontend Dashboard | ✅ Production | https://smallaviationmonitor.pages.dev |
| GPS Logger PWA | ✅ Production | https://smallaviationmonitor.pages.dev/pwa |
| Download Page | ✅ Production | https://smallaviationmonitor.pages.dev/download |
| Backend API | ✅ Production | https://smallaviationmonitor-api.administrator-112.workers.dev |
| Database (D1) | ✅ Production | 7 tables initialized |
| CI/CD Pipeline | ✅ Configured | GitHub Actions |
| Documentation | ✅ Complete | 40,000+ words, 20+ files |
| Native Apps | 📦 Archived | Available in _ARCHIVED/mobile/ |

## 📈 Statistics

- **Total Files**: 100+ files
- **Lines of Code**: 5,000+ lines
- **Documentation**: 40,000+ words (20+ markdown files)
- **React Components**: 15+ components
- **API Endpoints**: 8+ REST endpoints
- **Database Tables**: 7 tables with 18 indexes
- **Git Commits**: 18+ commits
- **Deployment**: Fully automated via GitHub Actions

## 🌟 Features Highlight

### For End Users
- 📱 Progressive Web App (no app store)
- 🌍 Worldwide GPS tracking
- 📡 5-second position updates
- 💾 Offline support with sync
- 🎯 High-accuracy GPS mode
- 🔄 Automatic app updates
- 📊 Live dashboard monitoring
- 🎨 Clean, modern interface

### For Developers
- ⚡ Serverless architecture (Cloudflare Workers)
- 🗄️ Edge database (D1/SQLite)
- 🌐 Global CDN deployment
- 🔒 HTTPS everywhere
- 📝 Complete documentation
- 🔄 CI/CD automation
- 🛠️ Modern tech stack (React 18, TypeScript, Vite)
- 🧪 Ready for testing and extension

---

**SmallAviationMonitor** - Tracking aviation worldwide, one GPS signal at a time. ✈️🚁🪂🎈

Made with ❤️ using Cloudflare Edge Platform
