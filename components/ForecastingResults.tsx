import React from 'react';
import type { Forecast, MenuItem } from '../types';

interface ForecastingResultsProps {
  forecast: Forecast;
  menuItem: MenuItem;
  onReset: () => void;
}

const ForecastingResults: React.FC<ForecastingResultsProps> = ({ forecast, menuItem, onReset }) => {
  const maxSales = Math.max(...forecast.dailyForecasts.map(d => d.predictedSales), 1);

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-white">Hasil Proyeksi untuk "{menuItem.name}"</h2>
                <p className="text-gray-400">Berikut adalah proyeksi penjualan untuk 7 hari ke depan.</p>
            </div>
             <button
                onClick={onReset}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
                Buat Proyeksi Baru
            </button>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Summary */}
            <div className="lg:col-span-1 bg-gray-900/50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-brand-secondary mb-3 border-b border-gray-700 pb-2">Ringkasan AI</h3>
                <p className="text-gray-300 prose prose-invert">
                    {forecast.summary}
                </p>
            </div>

            {/* Chart */}
            <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4">Grafik Proyeksi Penjualan (Unit)</h3>
                <div className="flex justify-between items-end h-64 space-x-2 bg-gray-900/50 p-4 rounded-lg">
                    {forecast.dailyForecasts.map(({ day, predictedSales }) => (
                        <div key={day} className="flex-1 flex flex-col items-center justify-end">
                            <div className="text-sm font-bold text-white mb-1">{predictedSales}</div>
                            <div
                                className="w-full bg-brand-secondary rounded-t-md hover:bg-brand-primary transition-colors duration-200"
                                style={{ height: `${(predictedSales / maxSales) * 100}%` }}
                                title={`${day}: ${predictedSales} unit`}
                            ></div>
                            <div className="mt-2 text-xs text-gray-400 font-medium">{day.substring(0,3)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ForecastingResults;