import React from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { GPSDevice, AirspaceReservation } from '../types/aviation';
import MapLegend from './MapLegend';


interface MapViewProps {
  devices: GPSDevice[];
  reservations: AirspaceReservation[];
  selectedDevice: GPSDevice | null;
  onDeviceClick: (device: GPSDevice) => void;
}

const MapView: React.FC<MapViewProps> = ({ devices, reservations, selectedDevice, onDeviceClick }) => {
  const [openInfoWindowId, setOpenInfoWindowId] = React.useState<string | null>(null);

  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const getDeviceIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      aircraft: '✈️',
      drone: '🚁',
      paraglider: '🪂',
      balloon: '🎈'
    };
    return icons[type] || '📍';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      online: '#10b981',
      offline: '#6b7280',
      warning: '#f59e0b'
    };
    return colors[status] || '#6b7280';
  };

  // Default center (San Francisco area)
  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

  // Calculate center based on devices
  const mapCenter = devices.length > 0
    ? {
        lat: devices.reduce((sum, d) => sum + d.lat, 0) / devices.length,
        lng: devices.reduce((sum, d) => sum + d.lng, 0) / devices.length
      }
    : defaultCenter;

  if (!apiKey) {
    return (
      <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
        <div className="text-center p-6 bg-red-500/10 border border-red-500 rounded-lg max-w-md">
          <h3 className="text-red-500 font-bold text-lg mb-2">⚠️ Google Maps API Key Missing</h3>
          <p className="text-red-400 text-sm mb-3">
            Please add your Google Maps API key to use the map feature.
          </p>
          <div className="bg-slate-800 p-3 rounded text-left text-xs">
            <p className="text-slate-300 mb-2">Create <code className="bg-slate-700 px-1">.env.local</code> file:</p>
            <code className="text-green-400 block">
              VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
            </code>
          </div>
          <p className="text-slate-400 text-xs mt-3">
            Get your API key at:{' '}
            <a 
              href="https://console.cloud.google.com/google/maps-apis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={10}
          mapId="smallaviationmonitor-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Device Markers */}
          {devices.map((device) => (
            <AdvancedMarker
              key={device.id}
              position={{ lat: device.lat, lng: device.lng }}
              onClick={() => {
                onDeviceClick(device);
                setOpenInfoWindowId(device.id);
              }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                style={{
                  backgroundColor: getStatusColor(device.status),
                  borderColor: device.id === selectedDevice?.id ? '#3b82f6' : 'white',
                  borderWidth: device.id === selectedDevice?.id ? '3px' : '2px'
                }}
              >
                <span className="text-xl">{getDeviceIcon(device.type)}</span>
              </div>
              {openInfoWindowId === device.id && (
                <InfoWindow
                  position={{ lat: device.lat, lng: device.lng }}
                  onCloseClick={() => setOpenInfoWindowId(null)}
                >
                  <div className="p-2 text-slate-900">
                    <h3 className="font-bold text-lg mb-1">{device.name}</h3>
                    <p className="text-sm text-slate-600 mb-1">
                      {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                    </p>
                    <p className="text-xs text-slate-500 mb-2">
                      Pilot: {device.pilot || 'Unknown'}
                    </p>
                    <div className="text-xs space-y-1">
                      <p>
                        <span className="font-semibold">Altitude:</span> {device.altitude.toFixed(0)} {device.altitudeUnit}
                      </p>
                      <p>
                        <span className="font-semibold">Speed:</span> {device.speed.toFixed(0)} {device.speedUnit}
                      </p>
                      <p>
                        <span className="font-semibold">Heading:</span> {device.heading}°
                      </p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <span
                        className="inline-block px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: getStatusColor(device.status),
                          color: 'white'
                        }}
                      >
                        {device.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          ))}

          {/* Airspace Reservations */}
          {reservations.map((reservation) => (
            <AdvancedMarker
              key={reservation.id}
              position={{ lat: reservation.centerLat, lng: reservation.centerLng }}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/30 border-2 border-blue-500">
                <span className="text-xs">🛡️</span>
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {/* Legend overlay */}
      <div className="absolute bottom-4 right-4 z-10">
        <MapLegend />
      </div>

      {/* Device count badge */}
      <div className="absolute top-4 left-4 z-10 bg-slate-800/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
        <div className="text-white text-sm font-semibold">
          {devices.length} Active Device{devices.length !== 1 ? 's' : ''}
        </div>
        {reservations.length > 0 && (
          <div className="text-blue-400 text-xs mt-1">
            {reservations.length} Reservation{reservations.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
