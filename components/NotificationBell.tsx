
import React, { useState } from 'react';
import type { Notification, View } from '../types';
import { BellIcon } from './icons/BellIcon';
import { BellAlertIcon } from './icons/BellAlertIcon';

interface NotificationBellProps {
  notifications: Notification[];
  onNavigate: (view: View, props?: Record<string, any>) => void;
  onMarkAsRead: (ids: string[]) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onNavigate, onMarkAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && unreadCount > 0) {
      // Mark as read after a short delay to allow dropdown to open
      setTimeout(() => {
          onMarkAsRead(notifications.filter(n => !n.isRead).map(n => n.id));
      }, 1000);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.relatedView) {
      onNavigate(notification.relatedView, notification.relatedViewProps);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative text-gray-300 hover:text-white p-2">
        {unreadCount > 0 ? (
            <BellAlertIcon className="w-6 h-6 animate-pulse" />
        ) : (
            <BellIcon className="w-6 h-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 animate-fade-in-down">
          <div className="p-3 border-b border-gray-700">
            <h3 className="font-semibold text-white">Notifikasi</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <ul>
                {notifications.map(n => (
                  <li key={n.id} onClick={() => handleNotificationClick(n)} className={`border-b border-gray-700 last:border-b-0 hover:bg-gray-700 cursor-pointer ${!n.isRead ? 'bg-brand-primary/10' : ''}`}>
                    <div className="p-3">
                      <p className={`text-sm ${n.type === 'margin_alert' ? 'text-warning-yellow' : 'text-blue-400'} font-bold`}>
                        {n.type === 'margin_alert' ? 'Peringatan Margin' : 'Stok Menipis'}
                      </p>
                      <p className="text-sm text-gray-300">{n.message}</p>
                       <p className="text-xs text-gray-500 mt-1">{new Date(n.timestamp).toLocaleString('id-ID')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-6">Tidak ada notifikasi baru.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
