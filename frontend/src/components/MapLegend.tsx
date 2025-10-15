import React from 'react';

const MapLegend: React.FC = () => {
  const deviceTypes = [
    { icon: '✈️', label: 'Aircraft', color: 'text-white' },
    { icon: '🚁', label: 'Drone', color: 'text-white' },
    { icon: '🪂', label: 'Paraglider', color: 'text-white' },
    { icon: '🎈', label: 'Balloon', color: 'text-white' }
  ];

  const statuses = [
    { color: 'bg-green-500', label: 'Online' },
    { color: 'bg-amber-500', label: 'Warning' },
    { color: 'bg-gray-500', label: 'Offline' }
  ];

  return (
    <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur rounded-lg p-4 border border-slate-700">
      <h3 className="text-sm font-bold text-white mb-3">Legend</h3>
      
      <div className="space-y-2 mb-4">
        <div className="text-xs text-slate-400 font-semibold mb-1">Device Types</div>
        {deviceTypes.map(type => (
          <div key={type.label} className="flex items-center gap-2">
            <span className="text-xl">{type.icon}</span>
            <span className="text-xs text-slate-300">{type.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="text-xs text-slate-400 font-semibold mb-1">Status</div>
        {statuses.map(status => (
          <div key={status.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${status.color}`} />
            <span className="text-xs text-slate-300">{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
