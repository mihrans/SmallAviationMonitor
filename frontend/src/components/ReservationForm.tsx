import React, { useState } from 'react';

interface ReservationFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    deviceId: '',
    minAltitude: 1000,
    maxAltitude: 5000,
    duration: 60,
    pilot: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Request Airspace Reservation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Device ID</label>
            <input
              type="text"
              value={formData.deviceId}
              onChange={(e) => setFormData({...formData, deviceId: e.target.value})}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Min Alt (ft)</label>
              <input
                type="number"
                value={formData.minAltitude}
                onChange={(e) => setFormData({...formData, minAltitude: parseInt(e.target.value)})}
                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Max Alt (ft)</label>
              <input
                type="number"
                value={formData.maxAltitude}
                onChange={(e) => setFormData({...formData, maxAltitude: parseInt(e.target.value)})}
                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Pilot Name</label>
            <input
              type="text"
              value={formData.pilot}
              onChange={(e) => setFormData({...formData, pilot: e.target.value})}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded font-semibold transition-colors">
              Submit Request
            </button>
            <button type="button" onClick={onClose} className="px-6 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
