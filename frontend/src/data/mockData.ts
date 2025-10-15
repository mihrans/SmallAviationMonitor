import { GPSDevice, AirspaceReservation, Alert } from '../types/aviation';
import { extendedDevices } from './extendedMockData';


export const mockDevices: GPSDevice[] = extendedDevices;


export const mockReservations: AirspaceReservation[] = [
  { id: 'RES001', deviceId: 'AC001', polygon: [[37.77, -122.42], [37.78, -122.42], [37.78, -122.41], [37.77, -122.41]], minAltitude: 3000, maxAltitude: 5000, startTime: new Date(), endTime: new Date(Date.now() + 3600000), status: 'active', pilot: 'John Smith' },
  { id: 'RES002', deviceId: 'BL004', polygon: [[37.75, -122.44], [37.76, -122.44], [37.76, -122.43], [37.75, -122.43]], minAltitude: 4500, maxAltitude: 6000, startTime: new Date(), endTime: new Date(Date.now() + 7200000), status: 'active', pilot: 'Emma Davis' },
  { id: 'RES003', deviceId: 'AC007', polygon: [[37.79, -122.42], [37.80, -122.42], [37.80, -122.41], [37.79, -122.41]], minAltitude: 8000, maxAltitude: 10000, startTime: new Date(Date.now() + 1800000), endTime: new Date(Date.now() + 5400000), status: 'pending', pilot: 'James Brown' },
];

export const mockAlerts: Alert[] = [
  { id: 'ALT001', type: 'warning', message: 'Low battery warning for DR002', deviceId: 'DR002', timestamp: new Date(), acknowledged: false, queueStatus: 'sent' },
  { id: 'ALT002', type: 'critical', message: 'Airspace conflict detected between AC001 and AC005', timestamp: new Date(), acknowledged: false, queueStatus: 'pending' },
  { id: 'ALT003', type: 'warning', message: 'Weather advisory: Strong winds in sector B', timestamp: new Date(Date.now() - 300000), acknowledged: true, queueStatus: 'delivered' },
  { id: 'ALT004', type: 'info', message: 'New device DR015 registered', deviceId: 'DR015', timestamp: new Date(Date.now() - 600000), acknowledged: true, queueStatus: 'delivered' },
  { id: 'ALT005', type: 'critical', message: 'Device DR009 battery critically low (45%)', deviceId: 'DR009', timestamp: new Date(Date.now() - 120000), acknowledged: false, queueStatus: 'sent' },
  { id: 'ALT006', type: 'warning', message: 'Paraglider PG003 approaching restricted airspace', deviceId: 'PG003', timestamp: new Date(Date.now() - 180000), acknowledged: false, queueStatus: 'pending' },
  { id: 'ALT007', type: 'info', message: 'Airspace reservation RES001 expires in 30 minutes', timestamp: new Date(Date.now() - 240000), acknowledged: true, queueStatus: 'delivered' },
];

