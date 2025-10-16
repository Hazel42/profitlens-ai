import React from 'react';
import type { MenuItem } from '../types';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface ForecastingControlsProps {
    menuItems: MenuItem[];
    selectedMenuItemId: string;
    onMenuItemChange: (id: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

const ForecastingControls: React.FC<ForecastingControlsProps> = ({ menuItems, selectedMenuItemId, onMenuItemChange, onGenerate, isLoading }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-8 text-center flex flex-col items-center justify-center h-96">
            <div className="bg-brand-primary/20 p-4 rounded-full mb-4">
                <TrendingUpIcon className="w-10 h-10 text-brand-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Siap untuk Melihat Masa Depan?</h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-6">
                Pilih item menu, lalu gunakan kekuatan AI untuk menganalisis data penjualan Anda dan dapatkan proyeksi 7 hari ke depan.
            </p>
            <div className="w-full max-w-md mb-4">
                <select
                    value={selectedMenuItemId}
                    onChange={(e) => onMenuItemChange(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg text-white p-3 text-center"
                    disabled={isLoading}
                >
                    <option value="" disabled>-- Pilih Item Menu --</option>
                    {menuItems.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>
            <button
                onClick={onGenerate}
                disabled={isLoading || !selectedMenuItemId}
                className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-dark disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg shadow-lg"
            >
                {isLoading ? 'Menganalisis...' : 'Buat Proyeksi Penjualan 7 Hari'}
            </button>
        </div>
    );
};

export default ForecastingControls;