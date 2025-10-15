export type DeviceType = 'aircraft' | 'drone' | 'paraglider' | 'balloon';

export interface GPSDevice {
  id: string;
  name: string;
  type: DeviceType;
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  heading: number;
  status: 'online' | 'offline' | 'warning';
  lastUpdate: Date;
  battery?: number;
  pilot: string;
}

export interface AirspaceReservation {
  id: string;
  deviceId: string;
  polygon: [number, number][];
  minAltitude: number;
  maxAltitude: number;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  pilot: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  deviceId?: string;
  timestamp: Date;
  acknowledged: boolean;
  queueStatus: 'pending' | 'sent' | 'delivered';
}

export interface ConnectionStats {
  apiConnections: number;
  tcpConnections: number;
  totalDevices: number;
  activeDevices: number;
}
