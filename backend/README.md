# SmallAviationMonitor Backend (Cloudflare Workers)

This directory contains the Cloudflare Workers backend for SmallAviationMonitor.

## Structure

```
backend/
├── workers/
│   ├── gps-receiver/      # GPS data ingestion worker
│   ├── reservation/       # Airspace reservation worker
│   ├── alert-processor/   # Alert queue consumer
│   └── websocket/         # WebSocket handler (Durable Object)
├── schema/                # D1 database schema
├── shared/                # Shared utilities
└── wrangler.toml         # Cloudflare Workers configuration
```

## Development

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

### Setup
```bash
cd backend
npm install
wrangler login
```

### Development Server
```bash
wrangler dev
```

### Deploy
```bash
wrangler deploy
```

## Workers

### GPS Receiver Worker
- **Path**: `/api/v1/gps/*`
- **Purpose**: Accept GPS position data via REST API
- **Database**: D1 (positions table)

### Reservation Worker
- **Path**: `/api/v1/reservations/*`
- **Purpose**: Manage airspace reservations
- **Database**: D1 (reservations table)
- **Features**: Polygon validation, conflict detection

### Alert Processor Worker
- **Purpose**: Process alert queue messages
- **Queue**: Cloudflare Queue consumer
- **Actions**: Send email/SMS/push notifications

### WebSocket Worker
- **Path**: `/ws`
- **Purpose**: Real-time updates via WebSocket
- **Technology**: Durable Objects for connection management

## Configuration

See `wrangler.toml` for complete configuration including:
- Worker routes
- D1 database bindings
- Queue bindings
- Environment variables
- KV namespaces (if needed)

## Testing

```bash
npm test
```

## Deployment

Production deployment via GitHub Actions:
- Push to `main` branch triggers automatic deployment
- Staging: `staging` branch → `dev.smallaviationmonitor.com`
- Production: `main` branch → `smallaviationmonitor.com`
