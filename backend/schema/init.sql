-- SmallAviationMonitor D1 Database Schema
-- SQLite database for Cloudflare D1

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('aircraft', 'drone', 'paraglider', 'balloon')),
  pilot TEXT NOT NULL,
  pilot_email TEXT,
  pilot_phone TEXT,
  api_key TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'offline' CHECK(status IN ('online', 'offline', 'warning', 'emergency')),
  battery INTEGER,
  last_seen DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_type ON devices(type);
CREATE INDEX idx_devices_last_seen ON devices(last_seen);

-- Positions table (time-series GPS data)
CREATE TABLE IF NOT EXISTS positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  lat REAL NOT NULL CHECK(lat >= -90 AND lat <= 90),
  lng REAL NOT NULL CHECK(lng >= -180 AND lng <= 180),
  altitude REAL NOT NULL,
  altitude_unit TEXT DEFAULT 'meters' CHECK(altitude_unit IN ('meters', 'feet')),
  speed REAL,
  speed_unit TEXT DEFAULT 'kmh',
  heading REAL CHECK(heading >= 0 AND heading < 360),
  vertical_speed REAL,
  timestamp DATETIME NOT NULL,
  received_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE INDEX idx_positions_device_id ON positions(device_id);
CREATE INDEX idx_positions_timestamp ON positions(timestamp DESC);
CREATE INDEX idx_positions_device_timestamp ON positions(device_id, timestamp DESC);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  pilot TEXT NOT NULL,
  pilot_email TEXT,
  pilot_phone TEXT,
  pilot_license TEXT,
  polygon TEXT NOT NULL, -- JSON array of [lat, lng] coordinates
  min_altitude REAL NOT NULL,
  max_altitude REAL NOT NULL,
  altitude_unit TEXT DEFAULT 'feet',
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  purpose TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'active', 'completed', 'cancelled')),
  approved_by TEXT,
  approved_at DATETIME,
  rejection_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_time_range ON reservations(start_time, end_time);
CREATE INDEX idx_reservations_device_id ON reservations(device_id);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('airspace_conflict', 'altitude_violation', 'connection_lost', 'emergency', 'proximity_warning', 'system')),
  severity TEXT NOT NULL CHECK(severity IN ('critical', 'warning', 'info')),
  device_id TEXT,
  message TEXT NOT NULL,
  details TEXT, -- JSON with additional context
  location_lat REAL,
  location_lng REAL,
  location_altitude REAL,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by TEXT,
  acknowledged_at DATETIME,
  queue_status TEXT DEFAULT 'pending' CHECK(queue_status IN ('pending', 'queued', 'sent', 'delivered', 'failed')),
  timestamp DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_device_id ON alerts(device_id);
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX idx_alerts_acknowledged ON alerts(acknowledged);

-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  license TEXT,
  role TEXT DEFAULT 'pilot' CHECK(role IN ('pilot', 'admin', 'operator')),
  password_hash TEXT, -- For future password authentication
  api_key TEXT UNIQUE,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'inactive')),
  email_verified BOOLEAN DEFAULT FALSE,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_api_key ON users(api_key);
CREATE INDEX idx_users_status ON users(status);

-- Connection logs (for monitoring)
CREATE TABLE IF NOT EXISTS connection_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT,
  connection_type TEXT CHECK(connection_type IN ('api', 'tcp', 'websocket')),
  event TEXT CHECK(event IN ('connect', 'disconnect', 'error', 'data')),
  ip_address TEXT,
  user_agent TEXT,
  error_message TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

CREATE INDEX idx_connection_logs_device_id ON connection_logs(device_id);
CREATE INDEX idx_connection_logs_timestamp ON connection_logs(timestamp DESC);
CREATE INDEX idx_connection_logs_type ON connection_logs(connection_type);

-- System metrics (for monitoring)
CREATE TABLE IF NOT EXISTS system_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  metric_unit TEXT,
  tags TEXT, -- JSON with additional metadata
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_metrics_name ON system_metrics(metric_name);
CREATE INDEX idx_system_metrics_timestamp ON system_metrics(timestamp DESC);

-- Triggers for updated_at timestamps
CREATE TRIGGER update_devices_timestamp 
AFTER UPDATE ON devices
BEGIN
  UPDATE devices SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_reservations_timestamp 
AFTER UPDATE ON reservations
BEGIN
  UPDATE reservations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_users_timestamp 
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
