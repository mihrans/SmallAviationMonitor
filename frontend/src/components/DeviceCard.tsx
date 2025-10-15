import React from 'react';
import { GPSDevice } from '../types/aviation';

interface DeviceCardProps {
  device: GPSDevice;
  onSelect: (device: GPSDevice) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onSelect }) => {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    warning: 'bg-amber-500'
  };

  const typeIcons = {
    aircraft: '✈️',
    drone: '🚁',
    paraglider: '🪂',
    balloon: '🎈'
  };

  return (
    <div 
      onClick={() => onSelect(device)}
      className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-cyan-500 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{typeIcons[device.type]}</span>
          <div>
            <h3 className="font-semibold text-white">{device.name}</h3>
            <p className="text-xs text-slate-400 font-mono">{device.id}</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColors[device.status]} animate-pulse`} />
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Altitude:</span>
          <span className="font-mono">{device.altitude} ft</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Speed:</span>
          <span className="font-mono">{device.speed} kts</span>
        </div>
        {device.battery && (
          <div className="flex justify-between text-slate-300">
            <span>Battery:</span>
            <span className="font-mono">{device.battery}%</span>
          </div>
        )}
        <div className="text-xs text-slate-500 mt-2">
          Pilot: {device.pilot}
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
