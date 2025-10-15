import React from 'react';
import { Alert } from '../types/aviation';

interface AlertItemProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onAcknowledge }) => {
  const typeStyles = {
    critical: 'bg-red-900/30 border-red-500 text-red-200',
    warning: 'bg-amber-900/30 border-amber-500 text-amber-200',
    info: 'bg-blue-900/30 border-blue-500 text-blue-200'
  };

  const typeIcons = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`border-l-4 p-3 rounded ${typeStyles[alert.type]} ${alert.acknowledged ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span>{typeIcons[alert.type]}</span>
            <span className="text-xs font-semibold uppercase">{alert.type}</span>
          </div>
          <p className="text-sm">{alert.message}</p>
          <div className="flex items-center gap-3 mt-2 text-xs opacity-70">
            <span>{alert.timestamp.toLocaleTimeString()}</span>
            <span className="px-2 py-0.5 bg-slate-700 rounded">{alert.queueStatus}</span>
          </div>
        </div>
        {!alert.acknowledged && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors"
          >
            ACK
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertItem;
