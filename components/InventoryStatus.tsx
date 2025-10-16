
import React, { useMemo } from 'react';
import type { Ingredient } from '../types';
import { InventoryIcon } from './icons/InventoryIcon';
import { ArchiveBoxXMarkIcon } from './icons/ArchiveBoxXMarkIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';
import { formatRupiah } from '../utils/formatters';

interface InventoryStatusProps {
    stats: {
        totalItems: number;
        lowStockCount: number;
        totalStockValue: number;
        totalWasteCostLast30Days: number;
    };
    onFilterChange: (filter: 'low_stock' | null) => void;
    activeFilter: string | null;
}

const InventoryStatus: React.FC<InventoryStatusProps> = ({ stats, onFilterChange, activeFilter }) => {
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                    <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                        <InventoryIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Total Jenis Bahan</p>
                        <p className="text-3xl font-bold text-white">{stats.totalItems}</p>
                    </div>
                </div>
            </div>
            <div 
                onClick={() => onFilterChange('low_stock')}
                className={`bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-200 ${
                    activeFilter === 'low_stock' ? 'ring-2 ring-brand-secondary scale-105' : 'hover:bg-gray-700'
                } ${stats.lowStockCount > 0 && activeFilter !== 'low_stock' ? 'border-2 border-warning-yellow' : ''}`}
            >
                <div className="flex items-center">
                    <div className={`${stats.lowStockCount > 0 ? 'bg-warning-yellow/20' : 'bg-green-500/20'} p-3 rounded-full mr-4`}>
                        <ExclamationCircleIcon className={`w-6 h-6 ${stats.lowStockCount > 0 ? 'text-warning-yellow' : 'text-green-400'}`} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Bahan Perlu Restock</p>
                        <p className="text-3xl font-bold text-white">{stats.lowStockCount}</p>
                    </div>
                </div>
            </div>
             <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                     <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Estimasi Nilai Stok</p>
                        <p className="text-3xl font-bold text-white">{formatRupiah(stats.totalStockValue, { notation: 'compact' })}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                     <div className="bg-red-500/20 p-3 rounded-full mr-4">
                        <ArchiveBoxXMarkIcon className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Kerugian Buangan (30 Hari)</p>
                        <p className="text-3xl font-bold text-white">{formatRupiah(stats.totalWasteCostLast30Days, { notation: 'compact' })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryStatus;
