import React from 'react';
import { ConnectionStats as Stats } from '../types/aviation';

interface ConnectionStatsProps {
  stats: Stats;
}

const ConnectionStats: React.FC<ConnectionStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
        <div className="text-xs text-slate-400 mb-1">API Connections</div>
        <div className="text-2xl font-bold text-cyan-400 font-mono">{stats.apiConnections}</div>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
        <div className="text-xs text-slate-400 mb-1">TCP/IP Connections</div>
        <div className="text-2xl font-bold text-cyan-400 font-mono">{stats.tcpConnections}</div>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
        <div className="text-xs text-slate-400 mb-1">Active Devices</div>
        <div className="text-2xl font-bold text-green-400 font-mono">{stats.activeDevices}</div>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
        <div className="text-xs text-slate-400 mb-1">Total Devices</div>
        <div className="text-2xl font-bold text-slate-300 font-mono">{stats.totalDevices}</div>
      </div>
    </div>
  );
};

export default ConnectionStats;
