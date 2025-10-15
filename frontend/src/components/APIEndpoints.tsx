import React, { useState } from 'react';

const APIEndpoints: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const endpoints = [
    {
      method: 'POST',
      path: '/api/gps/update',
      description: 'Send GPS position update',
      params: 'deviceId, lat, lng, altitude, speed, heading'
    },
    {
      method: 'POST',
      path: '/api/airspace/reserve',
      description: 'Request airspace reservation',
      params: 'deviceId, polygon, minAlt, maxAlt, startTime, endTime'
    },
    {
      method: 'GET',
      path: '/api/devices',
      description: 'Get all active devices',
      params: 'none'
    },
    {
      method: 'POST',
      path: '/api/alerts/queue',
      description: 'Queue alert message',
      params: 'type, message, deviceId'
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2 z-40"
      >
        <span>📡</span>
        <span className="font-semibold">API Docs</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full border border-slate-700 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">API Endpoints</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4">
              {endpoints.map((endpoint, idx) => (
                <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      endpoint.method === 'POST' ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-cyan-400 font-mono text-sm">{endpoint.path}</code>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{endpoint.description}</p>
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold">Parameters:</span> {endpoint.params}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-bold text-white mb-2">TCP/IP Connection</h3>
              <code className="text-cyan-400 font-mono text-sm">tcp://api.airtraffic.monitor:8080</code>
              <p className="text-xs text-slate-400 mt-2">Send JSON-formatted GPS data via TCP socket connection</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default APIEndpoints;
