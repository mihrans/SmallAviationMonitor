# Quick Start Commands

## 🚀 Immediate Next Steps

### 1. ✅ GitHub Repository (DONE)
Repository: https://github.com/mihrans/SmallAviationMonitor

### 2. ✅ Cloudflare Deployment (DONE)
- Frontend: https://smallaviationmonitor.pages.dev
- Backend API: https://smallaviationmonitor-api.administrator-112.workers.dev
- Database: Cloudflare D1 (7 tables initialized)

### 3. 🗺️ Setup Google Maps API Key

**Required for map functionality:**

1. Get API Key:
   - Go to https://console.cloud.google.com/google/maps-apis
   - Create project or select existing
   - Enable "Maps JavaScript API"
   - Create credentials → API Key
   - Restrict key to your domain

2. For Local Development:
   ```bash
   cd frontend
   cp .env.local.example .env.local
   # Edit .env.local and add your API key:
   # VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. For Production (Cloudflare Pages):
   - Go to https://dash.cloudflare.com
   - Pages → smallaviationmonitor → Settings → Environment variables
   - Add variable: `VITE_GOOGLE_MAPS_API_KEY` = your API key
   - Redeploy frontend

### 4. Test Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 in your browser

---

## 🔧 Development Commands

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend
```bash
cd backend

# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create smallaviationmonitor-db

# Initialize database
wrangler d1 execute smallaviationmonitor-db --file=./schema/init.sql

# Create Queue
wrangler queues create smallaviationmonitor-alerts

# Run development server
wrangler dev

# Deploy to production
wrangler deploy

# Deploy to staging
npm run deploy:staging
```

---

## 📦 Cloudflare Setup

### Prerequisites
```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Database Setup
```bash
cd backend

# Create D1 database
wrangler d1 create smallaviationmonitor-db

# Copy the database_id from output and update wrangler.toml

# Initialize database schema
wrangler d1 execute smallaviationmonitor-db --file=./schema/init.sql

# Verify database
wrangler d1 execute smallaviationmonitor-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### Queue Setup
```bash
# Create alert queue
wrangler queues create smallaviationmonitor-alerts
```

### Deploy Frontend
```bash
cd frontend

# Install dependencies
npm install

# Build
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=smallaviationmonitor
```

### Deploy Backend
```bash
cd backend

# Update wrangler.toml with your account_id and database_id

# Deploy
wrangler deploy
```

---

## 🔑 GitHub Secrets Setup

Add these secrets to your GitHub repository:
Settings → Secrets and variables → Actions → New repository secret

1. **CLOUDFLARE_API_TOKEN**
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Create Token → Edit Cloudflare Workers template
   - Copy and paste as GitHub secret

2. **CLOUDFLARE_ACCOUNT_ID**
   - Go to Cloudflare Dashboard → Workers & Pages
   - Copy Account ID from right sidebar
   - Paste as GitHub secret

---

## 🧪 Testing Commands

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### Linting
```bash
# Frontend
cd frontend
npm run lint

# Check for type errors
npx tsc --noEmit
```

---

## 📊 Monitoring Commands

### View Worker Logs
```bash
cd backend
wrangler tail
```

### View D1 Database
```bash
# List all devices
wrangler d1 execute smallaviationmonitor-db --command="SELECT * FROM devices LIMIT 10;"

# List recent positions
wrangler d1 execute smallaviationmonitor-db --command="SELECT * FROM positions ORDER BY timestamp DESC LIMIT 10;"

# List active reservations
wrangler d1 execute smallaviationmonitor-db --command="SELECT * FROM reservations WHERE status='active';"
```

### View Deployments
```bash
# List Pages deployments
wrangler pages deployment list --project-name=smallaviationmonitor

# List Workers deployments
wrangler deployments list
```

---

## 🗄️ Database Management

### Backup Database
```bash
# Export all tables
wrangler d1 export smallaviationmonitor-db --output=backup.sql

# Export specific table
wrangler d1 execute smallaviationmonitor-db --command="SELECT * FROM devices;" > devices_backup.json
```

### Query Database
```bash
# Count devices by type
wrangler d1 execute smallaviationmonitor-db --command="SELECT type, COUNT(*) as count FROM devices GROUP BY type;"

# Recent alerts
wrangler d1 execute smallaviationmonitor-db --command="SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 20;"

# Active connections
wrangler d1 execute smallaviationmonitor-db --command="SELECT * FROM connection_logs WHERE event='connect' ORDER BY timestamp DESC LIMIT 10;"
```

---

## 🌍 Custom Domain Setup

### Via Cloudflare Dashboard

1. **Add Domain to Cloudflare**
   - Add your domain to Cloudflare
   - Update nameservers

2. **Configure Pages Custom Domain**
   - Workers & Pages → smallaviationmonitor
   - Custom domains → Set up a custom domain
   - Enter: `smallaviationmonitor.com`

3. **Configure Workers Route**
   - Workers & Pages → smallaviationmonitor-api
   - Triggers → Custom Domains
   - Add: `api.smallaviationmonitor.com`

---

## 🔄 Git Workflow

### Create Feature Branch
```bash
git checkout -b feature/gps-receiver
# Make changes
git add .
git commit -m "Add GPS receiver worker"
git push origin feature/gps-receiver
```

### Update from Main
```bash
git checkout main
git pull origin main
git checkout feature/your-feature
git merge main
```

### Create Release
```bash
git checkout main
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"
git push origin v1.0.0
```

---

## 📱 Testing API Endpoints

### Test GPS Position Submission
```bash
curl -X POST https://api.smallaviationmonitor.com/api/v1/gps/position \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "deviceId": "test-device-1",
    "deviceType": "aircraft",
    "position": {
      "lat": 47.6062,
      "lng": -122.3321,
      "altitude": 1500
    },
    "telemetry": {
      "speed": 120,
      "heading": 270
    },
    "timestamp": "2025-10-15T14:30:00Z"
  }'
```

### Test Reservation Creation
```bash
curl -X POST https://api.smallaviationmonitor.com/api/v1/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "deviceId": "test-device-1",
    "pilot": {"name": "John Doe", "contact": "john@example.com"},
    "airspace": {
      "polygon": [[47.6, -122.3], [47.61, -122.3], [47.61, -122.4], [47.6, -122.4], [47.6, -122.3]],
      "minAltitude": 500,
      "maxAltitude": 2000
    },
    "timing": {
      "startTime": "2025-10-16T16:00:00Z",
      "endTime": "2025-10-16T18:00:00Z"
    }
  }'
```

---

## 🆘 Troubleshooting

### Frontend not building
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Wrangler login issues
```bash
wrangler logout
wrangler login
```

### D1 database not accessible
```bash
# Check database exists
wrangler d1 list

# Verify database ID in wrangler.toml matches
wrangler d1 info smallaviationmonitor-db
```

### Workers deployment fails
```bash
# Check wrangler.toml syntax
wrangler deploy --dry-run

# View detailed logs
wrangler deploy --verbose
```

---

## 📚 Documentation

- **Project Overview**: [README.md](README.md)
- **API Specifications**: [docs/api-specifications.md](docs/api-specifications.md)
- **Architecture**: [docs/architecture.md](docs/architecture.md)
- **Cloudflare Setup**: [CLOUDFLARE-SETUP.md](CLOUDFLARE-SETUP.md)
- **Project Status**: [PROJECT-STATUS.md](PROJECT-STATUS.md)
- **Full Documentation**: [docs/](docs/)

---

## 🎯 Quick Links

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **GitHub Repository**: (add after creating)
- **Frontend Local**: http://localhost:5173
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler
- **D1 Docs**: https://developers.cloudflare.com/d1

---

**Last Updated**: October 15, 2025  
**Version**: 1.0.0  
**Status**: Ready for GitHub push and Cloudflare deployment
