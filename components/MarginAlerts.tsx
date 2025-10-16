import React, { useState } from 'react';
import { BellIcon } from './icons/BellIcon';
import { CloseIcon } from './icons/CloseIcon';

interface MarginAlert {
  ingredientName: string;
  priceIncreasePercent: number;
  affectedMenus: string[];
}

interface MarginAlertsProps {
  alerts: MarginAlert[];
}

const MarginAlerts: React.FC<MarginAlertsProps> = ({ alerts }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!alerts.length || !isVisible) {
    return null;
  }

  return (
    <div className="bg-warning-yellow/10 border-l-4 border-warning-yellow text-warning-yellow p-4 rounded-r-lg shadow-lg relative animate-fade-in mb-6">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-warning-yellow/70 hover:text-warning-yellow"
        aria-label="Tutup peringatan"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
      <div className="flex">
        <div className="py-1">
          <BellIcon className="w-6 h-6 mr-4" />
        </div>
        <div>
          <p className="font-bold text-white mb-2">Peringatan Margin!</p>
          <ul className="space-y-1 text-sm list-disc list-inside">
            {alerts.map((alert, index) => (
              <li key={index}>
                Harga <strong className="text-white">{alert.ingredientName}</strong> naik 
                <strong className="text-white"> {alert.priceIncreasePercent}%</strong>. 
                Ini berpotensi menekan margin pada menu: <em className="text-yellow-400">{alert.affectedMenus.join(', ')}</em>.
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarginAlerts;