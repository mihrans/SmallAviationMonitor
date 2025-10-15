import React, { useState, useEffect } from 'react';
import MapView from './MapView';
import Sidebar from './Sidebar';
import ReservationForm from './ReservationForm';
import DeviceDetails from './DeviceDetails';
import APIEndpoints from './APIEndpoints';
import Toast from './Toast';
import { GPSDevice, Alert, AirspaceReservation, ConnectionStats } from '../types/aviation';
import { mockDevices, mockAlerts, mockReservations } from '../data/mockData';



const AppLayout: React.FC = () => {
  const [devices, setDevices] = useState<GPSDevice[]>(mockDevices);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [reservations, setReservations] = useState<AirspaceReservation[]>(mockReservations);
  const [selectedDevice, setSelectedDevice] = useState<GPSDevice | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [stats, setStats] = useState<ConnectionStats>({
    apiConnections: 12,
    tcpConnections: 8,
    totalDevices: mockDevices.length,
    activeDevices: mockDevices.filter(d => d.status === 'online').length
  });


  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        lat: device.lat + (Math.random() - 0.5) * 0.001,
        lng: device.lng + (Math.random() - 0.5) * 0.001,
        altitude: device.altitude + (Math.random() - 0.5) * 50,
        lastUpdate: new Date()
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAlertAck = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
    setToast({ message: 'Alert acknowledged', type: 'success' });
  };


  const handleReservationSubmit = (data: any) => {
    const newReservation: AirspaceReservation = {
      id: `RES${Date.now()}`,
      deviceId: data.deviceId,
      polygon: [[37.77, -122.42], [37.78, -122.42], [37.78, -122.41], [37.77, -122.41]],
      minAltitude: data.minAltitude,
      maxAltitude: data.maxAltitude,
      startTime: new Date(),
      endTime: new Date(Date.now() + data.duration * 60000),
      status: 'pending',
      pilot: data.pilot
    };
    setReservations(prev => [...prev, newReservation]);
    
    const newAlert: Alert = {
      id: `ALT${Date.now()}`,
      type: 'info',
      message: `New airspace reservation request from ${data.pilot}`,
      timestamp: new Date(),
      acknowledged: false,
      queueStatus: 'pending'
    };
    setAlerts(prev => [...prev, newAlert]);
    setToast({ message: 'Airspace reservation request submitted', type: 'success' });
  };


  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-2xl">
            ✈️
          </div>
          <div>
            <h1 className="text-xl font-bold">AirTraffic Monitor</h1>
            <p className="text-xs text-slate-400">Real-time GPS Tracking & Airspace Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            <span className="text-green-400 font-mono">{stats.activeDevices}</span> / {stats.totalDevices} Active
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <MapView 
            devices={devices}
            reservations={reservations}
            selectedDevice={selectedDevice}
            onDeviceClick={setSelectedDevice}
          />
        </div>
        <Sidebar
          devices={devices}
          alerts={alerts}
          reservations={reservations}
          stats={stats}
          onDeviceSelect={setSelectedDevice}
          onAlertAck={handleAlertAck}
          onRequestReservation={() => setShowReservationForm(true)}
        />
      </div>

      {showReservationForm && (
        <ReservationForm
          onSubmit={handleReservationSubmit}
          onClose={() => setShowReservationForm(false)}
        />
      )}

      {selectedDevice && (
        <DeviceDetails
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      <APIEndpoints />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
};

export default AppLayout;
