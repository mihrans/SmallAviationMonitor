# API Specifications - SmallAviationMonitor

## Overview
SmallAviationMonitor accepts GPS position data from various aviation devices via REST API and TCP/IP connections. This document specifies the data formats, endpoints, and integration methods.

---

## Device Types Supported

- **Aircraft**: Small and large aircraft with GPS transponders
- **Drones**: UAV/UAS with GPS capabilities
- **Paragliders**: Powered and unpowered paragliding equipment
- **Hot Air Balloons**: Balloon aircraft with GPS tracking

---

## GPS Data Submission

### REST API Endpoints

#### 1. Submit GPS Position
**Endpoint**: `POST /api/v1/gps/position`

**Headers**:
```http
Content-Type: application/json
Authorization: Bearer <device_api_key>
```

**Request Body**:
```json
{
  "deviceId": "string (unique identifier)",
  "deviceType": "aircraft | drone | paraglider | balloon",
  "position": {
    "lat": 47.6062,
    "lng": -122.3321,
    "altitude": 1500.5,
    "altitudeUnit": "meters | feet"
  },
  "telemetry": {
    "speed": 120.5,
    "speedUnit": "kmh | knots | mph",
    "heading": 270.0,
    "verticalSpeed": 0.5
  },
  "device": {
    "name": "N12345 - Cessna 172",
    "pilot": "John Doe",
    "battery": 85,
    "status": "online | warning | emergency"
  },
  "timestamp": "2025-10-15T14:30:00Z"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "deviceId": "string",
  "receivedAt": "2025-10-15T14:30:01Z",
  "message": "Position data received"
}
```

**Response** (400 Bad Request):
```json
{
  "success": false,
  "error": "Invalid GPS coordinates",
  "details": ["lat must be between -90 and 90"]
}
```

---

#### 2. Batch GPS Position Update
**Endpoint**: `POST /api/v1/gps/batch`

**Request Body**:
```json
{
  "positions": [
    {
      "deviceId": "device1",
      "deviceType": "aircraft",
      "position": { "lat": 47.6, "lng": -122.3, "altitude": 1500 },
      "timestamp": "2025-10-15T14:30:00Z"
    },
    // ... more positions
  ]
}
```

---

### TCP/IP Connection Protocol

#### Connection
- **Host**: `tcp.smallaviationmonitor.com`
- **Port**: `8080` (TLS) or `8081` (non-TLS)
- **Protocol**: JSON over TCP with newline delimiters

#### Authentication
First message after connection must be authentication:
```json
{
  "type": "auth",
  "deviceId": "device123",
  "apiKey": "your-api-key",
  "deviceType": "aircraft"
}
```

#### Position Updates
Send position updates as JSON with newline delimiter:
```json
{"type":"position","lat":47.6062,"lng":-122.3321,"altitude":1500,"speed":120,"heading":270,"timestamp":"2025-10-15T14:30:00Z"}\n
```

#### Heartbeat
Send heartbeat every 30 seconds:
```json
{"type":"heartbeat","deviceId":"device123","timestamp":"2025-10-15T14:30:00Z"}\n
```

#### Server Responses
```json
{"type":"ack","success":true,"timestamp":"2025-10-15T14:30:01Z"}\n
{"type":"alert","message":"Airspace conflict detected","severity":"warning"}\n
```

---

## Airspace Reservation API

### Create Reservation
**Endpoint**: `POST /api/v1/reservations`

**Request Body**:
```json
{
  "deviceId": "device123",
  "pilot": {
    "name": "John Doe",
    "license": "PPL-12345",
    "contact": "john@example.com"
  },
  "airspace": {
    "polygon": [
      [47.6062, -122.3321],
      [47.6100, -122.3300],
      [47.6100, -122.3400],
      [47.6062, -122.3400],
      [47.6062, -122.3321]
    ],
    "minAltitude": 500,
    "maxAltitude": 2000,
    "altitudeUnit": "feet"
  },
  "timing": {
    "startTime": "2025-10-15T16:00:00Z",
    "endTime": "2025-10-15T18:00:00Z"
  },
  "purpose": "Training flight",
  "notes": "Weather permitting"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "reservationId": "res_abc123",
  "status": "pending",
  "conflicts": [],
  "message": "Reservation submitted for approval"
}
```

**Response** (409 Conflict):
```json
{
  "success": false,
  "error": "Airspace conflict detected",
  "conflicts": [
    {
      "reservationId": "res_xyz789",
      "pilot": "Jane Smith",
      "overlap": {
        "spatial": "45% overlap",
        "temporal": "30 minutes"
      }
    }
  ]
}
```

---

### Get Reservation Status
**Endpoint**: `GET /api/v1/reservations/{reservationId}`

**Response**:
```json
{
  "reservationId": "res_abc123",
  "status": "approved | pending | rejected | active | expired",
  "approvedBy": "admin123",
  "approvedAt": "2025-10-15T15:00:00Z",
  "airspace": { /* airspace data */ },
  "timing": { /* timing data */ }
}
```

---

### List Active Reservations
**Endpoint**: `GET /api/v1/reservations/active`

**Query Parameters**:
- `lat`: Center latitude
- `lng`: Center longitude
- `radius`: Radius in km (default: 50)
- `minAltitude`: Minimum altitude filter
- `maxAltitude`: Maximum altitude filter

**Response**:
```json
{
  "reservations": [
    {
      "reservationId": "res_abc123",
      "pilot": "John Doe",
      "deviceType": "paraglider",
      "bounds": {
        "center": [47.6062, -122.3321],
        "radius": 2.5
      },
      "altitude": { "min": 500, "max": 2000 },
      "activeUntil": "2025-10-15T18:00:00Z"
    }
  ],
  "total": 1
}
```

---

## Alert Queue System

### Alert Types
Alerts are automatically queued when:
1. **Airspace Conflict**: Device enters reserved airspace
2. **Altitude Violation**: Device exceeds altitude limits
3. **Connection Lost**: Device goes offline unexpectedly
4. **Emergency Signal**: Device reports emergency status
5. **Proximity Warning**: Devices too close to each other

### Alert Message Format (Cloudflare Queue)
```json
{
  "alertId": "alert_123",
  "type": "airspace_conflict | altitude_violation | connection_lost | emergency | proximity_warning",
  "severity": "critical | warning | info",
  "timestamp": "2025-10-15T14:30:00Z",
  "device": {
    "id": "device123",
    "name": "N12345 - Cessna 172",
    "type": "aircraft",
    "pilot": "John Doe"
  },
  "location": {
    "lat": 47.6062,
    "lng": -122.3321,
    "altitude": 1500
  },
  "details": {
    "message": "Aircraft entered reserved airspace",
    "conflictingReservation": "res_xyz789",
    "affectedPilots": ["jane@example.com", "bob@example.com"]
  },
  "recipients": [
    {
      "type": "email | sms | push",
      "address": "jane@example.com"
    }
  ]
}
```

### Alert Delivery
- Alerts are placed in Cloudflare Queue
- Worker consumes queue messages
- Delivers via configured channels (email, SMS, push)
- Tracks delivery status
- Retries on failure

---

## WebSocket Real-Time Updates

### Connection
**Endpoint**: `wss://smallaviationmonitor.com/ws`

### Authentication
```json
{
  "type": "subscribe",
  "token": "user-jwt-token",
  "filters": {
    "deviceTypes": ["aircraft", "drone"],
    "bounds": {
      "north": 48.0,
      "south": 47.0,
      "east": -122.0,
      "west": -123.0
    }
  }
}
```

### Real-Time Messages
```json
// Device position update
{
  "type": "position_update",
  "deviceId": "device123",
  "position": { "lat": 47.6062, "lng": -122.3321, "altitude": 1500 },
  "telemetry": { "speed": 120, "heading": 270 },
  "timestamp": "2025-10-15T14:30:00Z"
}

// Device status change
{
  "type": "status_change",
  "deviceId": "device123",
  "oldStatus": "online",
  "newStatus": "warning",
  "timestamp": "2025-10-15T14:30:00Z"
}

// Reservation update
{
  "type": "reservation_update",
  "reservationId": "res_abc123",
  "status": "approved",
  "timestamp": "2025-10-15T14:30:00Z"
}

// Alert notification
{
  "type": "alert",
  "alert": { /* alert object */ }
}
```

---

## Authentication & Authorization

### API Keys
- Each device receives a unique API key
- Include in `Authorization` header: `Bearer <api_key>`
- Keys are scoped to specific device IDs
- Keys can be revoked via admin panel

### User JWT Tokens (Future)
- For pilot web dashboard access
- Include in WebSocket and API calls
- Tokens expire after 24 hours
- Refresh token mechanism

---

## Rate Limits

### GPS Position Updates
- **REST API**: 1 request per second per device
- **TCP/IP**: Continuous stream, max 10 updates/second
- **Batch API**: 100 positions per request, 10 requests/minute

### Reservations
- 10 reservation requests per hour per pilot
- 5 active reservations per pilot simultaneously

### Queries
- 60 requests per minute per API key
- WebSocket: 1 connection per user

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid data format |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Airspace reservation conflict |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Temporary unavailable |

---

## Data Validation

### GPS Coordinates
- Latitude: -90 to 90
- Longitude: -180 to 180
- Altitude: 0 to 50,000 meters (0 to 164,000 feet)

### Polygon Validation
- Minimum 3 vertices
- Maximum 100 vertices
- Must form a closed polygon (first point = last point)
- No self-intersecting polygons
- Maximum area: 100 km²

### Timing
- All timestamps in ISO 8601 UTC format
- Reservation duration: 15 minutes to 24 hours
- Advance booking: 1 hour to 30 days

---

## Cloudflare-Specific Implementation

### Workers
- **GPS Receiver Worker**: Handles REST API and TCP connections
- **Reservation Worker**: Manages airspace reservations
- **Alert Worker**: Processes queue messages and sends notifications
- **WebSocket Worker**: Manages Durable Objects for real-time updates

### D1 Database Schema (SQLite)
```sql
-- Devices table
CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  pilot TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'offline',
  last_seen DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Positions table (time-series data)
CREATE TABLE positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  altitude REAL NOT NULL,
  speed REAL,
  heading REAL,
  timestamp DATETIME NOT NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

-- Reservations table
CREATE TABLE reservations (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  pilot TEXT NOT NULL,
  polygon TEXT NOT NULL, -- JSON array
  min_altitude REAL NOT NULL,
  max_altitude REAL NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

-- Alerts table
CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  device_id TEXT,
  message TEXT NOT NULL,
  details TEXT, -- JSON
  acknowledged BOOLEAN DEFAULT FALSE,
  timestamp DATETIME NOT NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);
```

### Queues
- **Alert Queue**: Processes alerts asynchronously
- **Notification Queue**: Sends email/SMS/push notifications

### Durable Objects
- **WebSocket Coordinator**: Manages WebSocket connections and broadcasts

---

## Example Integration

### Python Client
```python
import requests
import json

API_URL = "https://smallaviationmonitor.com/api/v1"
API_KEY = "your-api-key"

def send_position(device_id, lat, lng, altitude):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "deviceId": device_id,
        "deviceType": "aircraft",
        "position": {
            "lat": lat,
            "lng": lng,
            "altitude": altitude,
            "altitudeUnit": "feet"
        },
        "telemetry": {
            "speed": 120,
            "speedUnit": "knots",
            "heading": 270
        },
        "timestamp": "2025-10-15T14:30:00Z"
    }
    
    response = requests.post(
        f"{API_URL}/gps/position",
        headers=headers,
        json=data
    )
    
    return response.json()
```

### JavaScript/Node.js Client
```javascript
const API_URL = 'https://smallaviationmonitor.com/api/v1';
const API_KEY = 'your-api-key';

async function sendPosition(deviceId, lat, lng, altitude) {
  const response = await fetch(`${API_URL}/gps/position`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deviceId,
      deviceType: 'drone',
      position: { lat, lng, altitude, altitudeUnit: 'meters' },
      telemetry: { speed: 45, speedUnit: 'kmh', heading: 180 },
      timestamp: new Date().toISOString()
    })
  });
  
  return await response.json();
}
```

---

## Testing Endpoints

### Development Environment
- **URL**: `https://dev.smallaviationmonitor.com`
- Use test API keys for development
- Mock data generation available

### Production Environment
- **URL**: `https://smallaviationmonitor.com`
- Live GPS data
- Real-time monitoring

---

*Document Version: 1.0*  
*Last Updated: October 15, 2025*  
*Status: Draft - Implementation in Progress*
