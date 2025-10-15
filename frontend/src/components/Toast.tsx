import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500'
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  return (
    <div className={`fixed top-20 right-4 ${styles[type]} border-l-4 rounded-lg p-4 shadow-lg z-50 animate-slide-in-right`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icons[type]}</span>
        <p className="text-white font-medium">{message}</p>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">×</button>
      </div>
    </div>
  );
};

export default Toast;
