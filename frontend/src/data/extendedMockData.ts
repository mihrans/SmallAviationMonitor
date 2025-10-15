import { GPSDevice } from '../types/aviation';

export const extendedDevices: GPSDevice[] = [
  { id: 'AC001', name: 'Cessna 172', type: 'aircraft', lat: 37.7749, lng: -122.4194, altitude: 3500, speed: 120, heading: 45, status: 'online', lastUpdate: new Date(), battery: 85, pilot: 'John Smith' },
  { id: 'DR002', name: 'DJI Mavic', type: 'drone', lat: 37.7849, lng: -122.4094, altitude: 400, speed: 25, heading: 180, status: 'online', lastUpdate: new Date(), battery: 65, pilot: 'Sarah Lee' },
  { id: 'PG003', name: 'Paraglider Alpha', type: 'paraglider', lat: 37.7649, lng: -122.4294, altitude: 2000, speed: 15, heading: 90, status: 'warning', lastUpdate: new Date(), pilot: 'Mike Chen' },
  { id: 'BL004', name: 'Hot Air Express', type: 'balloon', lat: 37.7549, lng: -122.4394, altitude: 5000, speed: 8, heading: 270, status: 'online', lastUpdate: new Date(), pilot: 'Emma Davis' },
  { id: 'AC005', name: 'Piper PA-28', type: 'aircraft', lat: 37.7949, lng: -122.3994, altitude: 4200, speed: 135, heading: 315, status: 'online', lastUpdate: new Date(), battery: 92, pilot: 'Tom Wilson' },
  { id: 'DR006', name: 'Phantom 4 Pro', type: 'drone', lat: 37.7699, lng: -122.4144, altitude: 350, speed: 30, heading: 225, status: 'online', lastUpdate: new Date(), battery: 78, pilot: 'Lisa Wang' },
  { id: 'AC007', name: 'Boeing 737', type: 'aircraft', lat: 37.7899, lng: -122.4244, altitude: 8500, speed: 450, heading: 180, status: 'online', lastUpdate: new Date(), battery: 95, pilot: 'James Brown' },
  { id: 'PG008', name: 'Paraglider Beta', type: 'paraglider', lat: 37.7599, lng: -122.4044, altitude: 1800, speed: 12, heading: 135, status: 'online', lastUpdate: new Date(), pilot: 'Anna Martinez' },
  { id: 'DR009', name: 'Inspire 2', type: 'drone', lat: 37.7799, lng: -122.4344, altitude: 420, speed: 28, heading: 90, status: 'warning', lastUpdate: new Date(), battery: 45, pilot: 'David Kim' },
  { id: 'BL010', name: 'Sky Voyager', type: 'balloon', lat: 37.7449, lng: -122.4244, altitude: 4800, speed: 10, heading: 315, status: 'online', lastUpdate: new Date(), pilot: 'Rachel Green' },
  { id: 'AC011', name: 'Airbus A320', type: 'aircraft', lat: 37.7999, lng: -122.4144, altitude: 9200, speed: 480, heading: 270, status: 'online', lastUpdate: new Date(), battery: 88, pilot: 'Chris Taylor' },
  { id: 'DR012', name: 'Mavic Air 2', type: 'drone', lat: 37.7649, lng: -122.3994, altitude: 380, speed: 32, heading: 45, status: 'online', lastUpdate: new Date(), battery: 82, pilot: 'Nina Patel' },
  { id: 'PG013', name: 'Paraglider Gamma', type: 'paraglider', lat: 37.7849, lng: -122.4444, altitude: 2200, speed: 18, heading: 180, status: 'online', lastUpdate: new Date(), pilot: 'Alex Johnson' },
  { id: 'AC014', name: 'Gulfstream G650', type: 'aircraft', lat: 37.7499, lng: -122.4094, altitude: 12000, speed: 520, heading: 90, status: 'online', lastUpdate: new Date(), battery: 90, pilot: 'Victoria Stone' },
  { id: 'DR015', name: 'Mini 3 Pro', type: 'drone', lat: 37.7749, lng: -122.3894, altitude: 310, speed: 22, heading: 270, status: 'offline', lastUpdate: new Date(), battery: 15, pilot: 'Kevin Zhang' },
];
