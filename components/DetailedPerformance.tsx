import React from 'react';
import type { DetailedPerformanceStats } from '../types';
import PerformanceList from './PerformanceList';
import { TrophyIcon } from './icons/TrophyIcon';
import { TrendingDownIcon } from './icons/TrendingDownIcon';
import { formatRupiah } from '../utils/formatters';

interface DetailedPerformanceProps {
  stats: DetailedPerformanceStats;
}

const DetailedPerformance: React.FC<DetailedPerformanceProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex items-center">
            <TrophyIcon className="w-8 h-8 text-yellow-400 mr-3" />
            <h3 className="text-xl font-bold text-white">Top Performers</h3>
        </div>
        <PerformanceList
          title="Terlaris (Unit)"
          items={stats.bestSellersByUnit}
          metricFormatter={(value) => `${value.toLocaleString('id-ID')} unit`}
          metricColorClass="text-brand-secondary"
        />
        <PerformanceList
          title="Pendapatan Tertinggi"
          items={stats.highestRevenueItems}
          metricFormatter={formatRupiah}
          metricColorClass="text-brand-secondary"
        />
        <PerformanceList
          title="Margin Paling Sehat"
          items={stats.mostProfitableItems}
          metricFormatter={(value) => `${value.toFixed(1)}%`}
          metricColorClass="text-safe-green"
        />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex items-center">
            <TrendingDownIcon className="w-8 h-8 text-red-400 mr-3" />
            <h3 className="text-xl font-bold text-white">Underperformers</h3>
        </div>
         <PerformanceList
          title="Margin Paling Rendah"
          items={stats.leastProfitableItems}
          metricFormatter={(value) => `${value.toFixed(1)}%`}
          metricColorClass="text-alert-red"
        />
      </div>
    </div>
  );
};

export default DetailedPerformance;
