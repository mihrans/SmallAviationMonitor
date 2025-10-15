import React from 'react';import React, { useEffect, useRef } from 'react';

import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';import { GPSDevice, AirspaceReservation } from '../types/aviation';

import { GPSDevice, AirspaceReservation } from '../types/aviation';import MapLegend from './MapLegend';

import MapLegend from './MapLegend';



interface MapViewProps {interface MapViewProps {

  devices: GPSDevice[];  devices: GPSDevice[];

  reservations: AirspaceReservation[];  reservations: AirspaceReservation[];

  selectedDevice: GPSDevice | null;  selectedDevice: GPSDevice | null;

  onDeviceClick: (device: GPSDevice) => void;  onDeviceClick: (device: GPSDevice) => void;

}}



const MapView: React.FC<MapViewProps> = ({ devices, reservations, selectedDevice, onDeviceClick }) => {const MapView: React.FC<MapViewProps> = ({ devices, reservations, selectedDevice, onDeviceClick }) => {

  const [openInfoWindowId, setOpenInfoWindowId] = React.useState<string | null>(null);  const mapRef = useRef<HTMLDivElement>(null);



  // Get API key from environment variable  const getDeviceIcon = (type: string) => {

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';    const icons: any = {

      aircraft: '✈️',

  const getDeviceIcon = (type: string) => {      drone: '🚁',

    const icons: { [key: string]: string } = {      paraglider: '🪂',

      aircraft: '✈️',      balloon: '🎈'

      drone: '🚁',    };

      paraglider: '🪂',    return icons[type] || '📍';

      balloon: '🎈'  };

    };

    return icons[type] || '📍';  const getStatusColor = (status: string) => {

  };    const colors: any = {

      online: '#10b981',

  const getStatusColor = (status: string) => {      offline: '#6b7280',

    const colors: { [key: string]: string } = {      warning: '#f59e0b'

      online: '#10b981',    };

      offline: '#6b7280',    return colors[status] || '#6b7280';

      warning: '#f59e0b'  };

    };

    return colors[status] || '#6b7280';  return (

  };    <div className="relative w-full h-full bg-slate-900">

      {/* Map background with grid */}

  // Default center (San Francisco area)      <div className="absolute inset-0 opacity-20" style={{

  const defaultCenter = { lat: 37.7749, lng: -122.4194 };        backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',

        backgroundSize: '50px 50px'

  // Calculate center based on devices      }} />

  const mapCenter = devices.length > 0

    ? {      {/* Simulated map with device markers */}

        lat: devices.reduce((sum, d) => sum + d.lat, 0) / devices.length,      <div ref={mapRef} className="relative w-full h-full overflow-hidden">

        lng: devices.reduce((sum, d) => sum + d.lng, 0) / devices.length        {devices.map((device) => {

      }          const x = ((device.lng + 122.5) * 2000) % 100;

    : defaultCenter;          const y = ((37.8 - device.lat) * 2000) % 100;

          

  if (!apiKey) {          return (

    return (            <div

      <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">              key={device.id}

        <div className="text-center p-6 bg-red-500/10 border border-red-500 rounded-lg max-w-md">              onClick={() => onDeviceClick(device)}

          <h3 className="text-red-500 font-bold text-lg mb-2">⚠️ Google Maps API Key Missing</h3>              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125"

          <p className="text-red-400 text-sm mb-3">              style={{

            Please add your Google Maps API key to use the map feature.                left: `${x}%`,

          </p>                top: `${y}%`,

          <div className="bg-slate-800 p-3 rounded text-left text-xs">                filter: selectedDevice?.id === device.id ? 'drop-shadow(0 0 10px cyan)' : 'none'

            <p className="text-slate-300 mb-2">Create <code className="bg-slate-700 px-1">.env.local</code> file:</p>              }}

            <code className="text-green-400 block">            >

              VITE_GOOGLE_MAPS_API_KEY=your_api_key_here              <div className="relative">

            </code>                <div 

          </div>                  className="absolute inset-0 rounded-full animate-ping opacity-75"

          <p className="text-slate-400 text-xs mt-3">                  style={{ backgroundColor: getStatusColor(device.status) }}

            Get your API key at:{' '}                />

            <a                 <div 

              href="https://console.cloud.google.com/google/maps-apis"                   className="relative text-3xl"

              target="_blank"                   style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}

              rel="noopener noreferrer"                >

              className="text-blue-400 hover:underline"                  {getDeviceIcon(device.type)}

            >                </div>

              Google Cloud Console              </div>

            </a>            </div>

          </p>          );

        </div>        })}

      </div>

    );        {/* Airspace reservations */}

  }        {reservations.map((res) => (

          <div

  return (            key={res.id}

    <div className="relative w-full h-full">            className="absolute border-2 border-amber-500 bg-amber-500/10 rounded"

      <APIProvider apiKey={apiKey}>            style={{

        <Map              left: '30%',

          defaultCenter={mapCenter}              top: '30%',

          defaultZoom={10}              width: '20%',

          mapId="smallaviationmonitor-map"              height: '20%'

          gestureHandling="greedy"            }}

          disableDefaultUI={false}          >

          style={{ width: '100%', height: '100%' }}            <div className="text-xs text-amber-300 p-2">

        >              Reserved: {res.minAltitude}-{res.maxAltitude}ft

          {/* Device Markers */}            </div>

          {devices.map((device) => (          </div>

            <AdvancedMarker        ))}

              key={device.id}      </div>

              position={{ lat: device.lat, lng: device.lng }}

              onClick={() => {      {/* Map controls */}

                onDeviceClick(device);      <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur rounded-lg p-2 space-y-2">

                setOpenInfoWindowId(device.id);        <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition-colors">+</button>

              }}        <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center text-white transition-colors">-</button>

            >      </div>

              <div

                className="flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-lg cursor-pointer hover:scale-110 transition-transform"      {/* Map Legend */}

                style={{      <MapLegend />

                  backgroundColor: getStatusColor(device.status),

                  borderColor: device.id === selectedDevice?.id ? '#3b82f6' : 'white',    </div>

                  borderWidth: device.id === selectedDevice?.id ? '3px' : '2px'  );

                }}};

              >

                <span className="text-xl">{getDeviceIcon(device.type)}</span>export default MapView;

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

          {/* Airspace Reservations (simplified as circles for now) */}
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
