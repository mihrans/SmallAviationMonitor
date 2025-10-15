import React, { useState } from 'react';
import { GPSDevice, Alert, AirspaceReservation, ConnectionStats as Stats, DeviceType } from '../types/aviation';
import DeviceCard from './DeviceCard';
import AlertItem from './AlertItem';
import ConnectionStats from './ConnectionStats';
import FilterBar from './FilterBar';


interface SidebarProps {
  devices: GPSDevice[];
  alerts: Alert[];
  reservations: AirspaceReservation[];
  stats: Stats;
  onDeviceSelect: (device: GPSDevice) => void;
  onAlertAck: (id: string) => void;
  onRequestReservation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ devices, alerts, reservations, stats, onDeviceSelect, onAlertAck, onRequestReservation }) => {
  const [activeTab, setActiveTab] = useState<'devices' | 'alerts' | 'reservations'>('devices');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<DeviceType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.pilot.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || device.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || device.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });


  if (isCollapsed) {
    return (
      <div className="w-12 bg-slate-900 border-l border-slate-700 flex flex-col items-center py-4">
        <button onClick={() => setIsCollapsed(false)} className="text-white hover:text-cyan-400">
          ☰
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Control Panel</h2>
        <button onClick={() => setIsCollapsed(true)} className="text-slate-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="p-4 border-b border-slate-700">
        <ConnectionStats stats={stats} />
      </div>

      <div className="flex border-b border-slate-700">
        {['devices', 'alerts', 'reservations'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 text-sm font-semibold uppercase transition-colors ${
              activeTab === tab ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'devices' && (
          <>
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
            <div className="p-4 space-y-3">
              {filteredDevices.map(device => (
                <DeviceCard key={device.id} device={device} onSelect={onDeviceSelect} />
              ))}
            </div>
          </>
        )}
        
        {activeTab === 'alerts' && (
          <div className="p-4 space-y-3">
            {alerts.map(alert => (
              <AlertItem key={alert.id} alert={alert} onAcknowledge={onAlertAck} />
            ))}
          </div>
        )}
        
        {activeTab === 'reservations' && (
          <div className="p-4 space-y-3">
            <button
              onClick={onRequestReservation}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              + New Reservation
            </button>
            {reservations.map(res => (
              <div key={res.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{res.id}</span>
                  <span className={`px-2 py-1 rounded text-xs ${res.status === 'active' ? 'bg-green-600' : 'bg-amber-600'}`}>
                    {res.status}
                  </span>
                </div>
                <div className="text-sm text-slate-300 space-y-1">
                  <div>Altitude: {res.minAltitude}-{res.maxAltitude} ft</div>
                  <div>Pilot: {res.pilot}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Sidebar;
