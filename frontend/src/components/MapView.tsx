import React, { useEffect, useRef } from 'react';
import { GPSDevice, AirspaceReservation } from '../types/aviation';
import MapLegend from './MapLegend';


interface MapViewProps {
  devices: GPSDevice[];
  reservations: AirspaceReservation[];
  selectedDevice: GPSDevice | null;
  onDeviceClick: (device: GPSDevice) => void;
}

const MapView: React.FC<MapViewProps> = ({ devices, reservations, selectedDevice, onDeviceClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const getDeviceIcon = (type: string) => {
    const icons: any = {
      aircraft: '✈️',
      drone: '🚁',
      paraglider: '🪂',
      balloon: '🎈'
    };
    return icons[type] || '📍';
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      online: '#10b981',
      offline: '#6b7280',
      warning: '#f59e0b'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="relative w-full h-full bg-slate-900">
      {/* Map background with grid */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Simulated map with device markers */}
      <div ref={mapRef} className="relative w-full h-full overflow-hidden">
        {devices.map((device) => {
          const x = ((device.lng + 122.5) * 2000) % 100;
          const y = ((37.8 - device.lat) * 2000) % 100;
          
          return (
            <div
              key={device.id}
              onClick={() => onDeviceClick(device)}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                filter: selectedDevice?.id === device.id ? 'drop-shadow(0 0 10px cyan)' : 'none'
              }}
            >
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-75"
                  style={{ backgroundColor: getStatusColor(device.status) }}
                />
                <div 
                  className="relative text-3xl"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                >
                  {getDeviceIcon(device.type)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Airspace reservations */}
        {reservations.map((res) => (
          <div
            key={res.id}
            className="absolute border-2 border-amber-500 bg-amber-500/10 rounded"
            style={{
              left: '30%',
              top: '30%',
              width: '20%',
              height: '20%'
            }}
          >
            <div className="text-xs text-amber-300 p-2">
              Reserved: {res.minAltitude}-{res.maxAltitude}ft
            </div>
          </div>
        ))}
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur rounded-lg p-2 space-y-2">
        <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition-colors">+</button>
        <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition-colors">-</button>
      </div>

      {/* Map Legend */}
      <MapLegend />

    </div>
  );
};

export default MapView;
