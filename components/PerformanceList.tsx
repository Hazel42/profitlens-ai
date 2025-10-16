import React from 'react';
import type { PerformanceItem } from '../types';

interface PerformanceListProps {
  title: string;
  items: PerformanceItem[];
  metricFormatter: (value: number) => string;
  metricColorClass: string;
}

const PerformanceList: React.FC<PerformanceListProps> = ({ title, items, metricFormatter, metricColorClass }) => {
  return (
    <div>
      <h4 className="text-md font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-3">{title}</h4>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-500 w-6">{index + 1}.</span>
                <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover mr-3" />
                <span className="font-medium text-white">{item.name}</span>
              </div>
              <span className={`font-bold text-lg ${metricColorClass}`}>
                {metricFormatter(item.metric)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">Data tidak cukup untuk ditampilkan.</p>
      )}
    </div>
  );
};

export default PerformanceList;