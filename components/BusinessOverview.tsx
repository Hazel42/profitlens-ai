
import React from 'react';
import type { View } from '../types';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';
import { formatRupiah } from '../utils/formatters';

interface BusinessOverviewProps {
  stats: {
    totalRevenue: number;
    netProfit: number;
    totalItemsSold: number;
    averageMargin: number;
    lowStockCount: number;
  };
  onNavigate: (view: View, props?: Record<string, any>) => void;
}

const BusinessOverview: React.FC<BusinessOverviewProps> = ({ stats, onNavigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
        <div className="bg-brand-primary/20 p-3 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-400">Total Pendapatan</p>
          <p className="text-3xl font-bold text-white">{formatRupiah(stats.totalRevenue, { notation: 'compact', maximumFractionDigits: 1 })}</p>
        </div>
      </div>
       <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
        <div className="bg-green-500/20 p-3 rounded-full mr-4">
          <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Laba Bersih</p>
          <p className={`text-3xl font-bold ${stats.netProfit >= 0 ? 'text-white' : 'text-alert-red'}`}>{formatRupiah(stats.netProfit, { notation: 'compact', maximumFractionDigits: 1 })}</p>
        </div>
      </div>
      <div 
        onClick={() => onNavigate('inventory', { filter: 'low_stock' })}
        className={`bg-gray-800 p-6 rounded-lg shadow-lg flex items-center cursor-pointer transition-all duration-200 hover:bg-gray-700 hover:ring-2 hover:ring-brand-secondary ${stats.lowStockCount > 0 ? 'border-2 border-warning-yellow' : ''}`}>
        <div className={`${stats.lowStockCount > 0 ? 'bg-warning-yellow/20' : 'bg-gray-600/20'} p-3 rounded-full mr-4`}>
          <ExclamationCircleIcon className={`w-6 h-6 ${stats.lowStockCount > 0 ? 'text-warning-yellow' : 'text-gray-400'}`} />
        </div>
        <div>
          <p className="text-sm text-gray-400">Bahan Perlu Restock</p>
          <p className="text-3xl font-bold text-white">{stats.lowStockCount}</p>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
        <div className="bg-purple-500/20 p-3 rounded-full mr-4">
          <ChartPieIcon className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Margin Rata-rata Menu</p>
          <p className="text-3xl font-bold text-white">{stats.averageMargin.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessOverview;
