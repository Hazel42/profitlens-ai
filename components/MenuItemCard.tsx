import React, { useState } from 'react';
import type { MenuItem } from '../types';
import { MarginStatus } from '../types';
import { AlertIcon } from './icons/AlertIcon';
import { InfoIcon } from './icons/InfoIcon';
import { PencilIcon } from './icons/PencilIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { formatRupiah } from '../utils/formatters';

interface MenuItemCardProps {
  menuItem: MenuItem;
  onViewRecipe: () => void;
  onOptimizePrice: () => void;
  onEditRecipe: () => void;
}

const statusStyles = {
  [MarginStatus.Safe]: {
    bg: 'bg-safe-green/20',
    text: 'text-safe-green',
    label: 'Margin Sehat',
  },
  [MarginStatus.Warning]: {
    bg: 'bg-warning-yellow/20',
    text: 'text-warning-yellow',
    label: 'Waspada',
  },
  [MarginStatus.Danger]: {
    bg: 'bg-alert-red/20',
    text: 'text-alert-red',
    label: 'Bahaya',
  },
};

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState(false);
  return (
    <div 
      className="relative flex items-center ml-2"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <InfoIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-700 text-white text-sm rounded-lg shadow-lg z-10 text-left normal-case tracking-normal">
          {text}
        </div>
      )}
    </div>
  );
};

const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItem, onViewRecipe, onOptimizePrice, onEditRecipe }) => {
  const status = menuItem.marginStatus || MarginStatus.Safe;
  const styles = statusStyles[status];
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <img src={menuItem.imageUrl} alt={menuItem.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${styles.bg} ${styles.text}`}>
          {styles.label}
        </div>
        <h3 className="text-xl font-bold mt-2 text-white">{menuItem.name}</h3>
        
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Harga Jual:</span>
            <span className="font-semibold text-white">{formatRupiah(menuItem.sellingPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Modal (HPP):</span>
            <span className="font-semibold text-white">{formatRupiah(menuItem.cogs ?? 0)}</span>
          </div>
          <div className="flex justify-between items-center">
             <div className="flex items-center">
                <span className="text-gray-400">Margin Aktual:</span>
                <InfoTooltip text="Persentase keuntungan dari harga jual. Contoh: Kalau harga jual Rp 25.000 dan modalnya Rp 10.000, untungnya Rp 15.000. Maka, Margin Untungnya 60%." />
            </div>
            <span className={`font-bold text-lg ${styles.text}`}>
              {(menuItem.actualMargin ?? 0).toFixed(1)}%
            </span>
          </div>
           <div className="flex justify-between pt-1">
            <span className="text-gray-400">Target Margin:</span>
            <span className="font-semibold text-gray-300">{menuItem.targetMargin}%</span>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-2">
          <button 
            onClick={onViewRecipe}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <InfoIcon className="w-4 h-4" />
            <span>Lihat Resep</span>
          </button>
           <button 
            onClick={onEditRecipe}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Edit</span>
          </button>
          </div>
          {status === MarginStatus.Danger && (
            <button 
              onClick={onOptimizePrice}
              className="w-full mt-2 bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 animate-pulse"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Optimalkan Harga</span>
            </button>
          )}
      </div>
    </div>
  );
};

export default MenuItemCard;
