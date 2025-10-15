import React from 'react';
import { GPSDevice } from '../types/aviation';

interface DeviceDetailsProps {
  device: GPSDevice;
  onClose: () => void;
}

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ device, onClose }) => {
  const typeIcons: any = {
    aircraft: '✈️',
    drone: '🚁',
    paraglider: '🪂',
    balloon: '🎈'
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg p-6 max-w-lg w-full border border-slate-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{typeIcons[device.type]}</span>
            <div>
              <h2 className="text-2xl font-bold text-white">{device.name}</h2>
              <p className="text-slate-400 font-mono">{device.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">×</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Latitude</div>
            <div className="text-lg font-mono text-cyan-400">{device.lat.toFixed(6)}°</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Longitude</div>
            <div className="text-lg font-mono text-cyan-400">{device.lng.toFixed(6)}°</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Altitude</div>
            <div className="text-lg font-mono text-white">{device.altitude.toFixed(0)} ft</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Speed</div>
            <div className="text-lg font-mono text-white">{device.speed} kts</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-1">Heading</div>
            <div className="text-lg font-mono text-white">{device.heading}°</div>
          </div>
          {device.battery && (
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Battery</div>
              <div className="text-lg font-mono text-green-400">{device.battery}%</div>
            </div>
          )}
        </div>

        <div className="bg-slate-900 rounded-lg p-3 mb-4">
          <div className="text-xs text-slate-400 mb-1">Pilot</div>
          <div className="text-white">{device.pilot}</div>
        </div>

        <div className="bg-slate-900 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Last Update</div>
          <div className="text-white">{device.lastUpdate.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetails;
