import React from 'react';
import { DeviceType } from '../types/aviation';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: DeviceType | 'all';
  onTypeChange: (type: DeviceType | 'all') => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange
}) => {
  const deviceTypes: (DeviceType | 'all')[] = ['all', 'aircraft', 'drone', 'paraglider', 'balloon'];
  const statuses = ['all', 'online', 'offline', 'warning'];

  return (
    <div className="bg-slate-800 p-4 space-y-3 border-b border-slate-700">
      <input
        type="text"
        placeholder="Search devices..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
      />
      
      <div className="flex gap-2 flex-wrap">
        {deviceTypes.map(type => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedType === type
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {type === 'all' ? 'All Types' : type}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`flex-1 px-3 py-1 rounded text-xs font-semibold transition-colors ${
              selectedStatus === status
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
