
import React from 'react';
import type { View } from '../types';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface OpportunityCardProps {
  onNavigate: (view: View) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ onNavigate }) => {
  return (
    <div className="bg-brand-dark/50 border-2 border-dashed border-gray-600 rounded-lg shadow-lg p-6 animate-fade-in-down flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center">
        <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
            <LightBulbIcon className="w-8 h-8 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">💡 Peluang Tersembunyi!</h2>
          <p className="text-gray-300">Temukan produk yang sering dibeli bersamaan & dapatkan ide kampanye dari AI.</p>
        </div>
      </div>
      <button
        onClick={() => onNavigate('performanceAnalysis')}
        className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md transition-colors"
      >
        <span>Lakukan Analisis Keranjang</span>
        <ArrowRightIcon className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

export default OpportunityCard;
