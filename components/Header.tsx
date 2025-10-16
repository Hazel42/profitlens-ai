
import React from 'react';
import NotificationBell from './NotificationBell';
import type { Outlet, Notification, View } from '../types';

interface HeaderProps {
  outlets: Outlet[];
  currentOutletId: string;
  onOutletChange: (id: string) => void;
  notifications: Notification[];
  onNavigate: (view: View, props?: Record<string, any>) => void;
  onMarkNotificationsAsRead: (ids: string[]) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    outlets, 
    currentOutletId, 
    onOutletChange,
    notifications,
    onNavigate,
    onMarkNotificationsAsRead
}) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-30 p-4 lg:px-8 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
           <h1 className="text-xl font-bold text-white">ProfitLens AI</h1>
           {outlets.length > 0 && (
              <select 
                value={currentOutletId} 
                onChange={e => onOutletChange(e.target.value)} 
                className="ml-4 bg-gray-700 border border-gray-600 rounded-md text-white p-1.5 text-sm focus:ring-brand-primary focus:border-brand-primary"
                aria-label="Pilih Cabang"
              >
                {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
           )}
        </div>
        <div className="flex items-center space-x-4">
            <NotificationBell 
                notifications={notifications}
                onNavigate={onNavigate}
                onMarkAsRead={onMarkNotificationsAsRead}
            />
        </div>
      </div>
    </header>
  );
};

export default Header;
