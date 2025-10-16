import React from 'react';
import type { Forecast } from '../types';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface SalesAnalysisModalProps {
  analysisResult: string | null;
  forecasts: { itemName: string; forecast: Forecast }[] | null;
  onClose: () => void;
}

const SalesAnalysisModal: React.FC<SalesAnalysisModalProps> = ({ analysisResult, forecasts, onClose }) => {
  
  const renderAnalysisContent = () => {
    if (!analysisResult) {
       return (
        <div className="flex flex-col items-center justify-center min-h-[250px] text-gray-400">
          <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">ProfitLens AI sedang menganalisis penjualan...</p>
          <p>Stok inventaris sedang diperbarui.</p>
        </div>
      );
    }
    
    // Simple markdown-to-html renderer
    const formattedResult = analysisResult
      .split('\n')
      .map(line => {
        if (line.startsWith('### ')) return `<h3 class="text-xl font-bold text-brand-secondary mt-4 mb-2">${line.substring(4)}</h3>`;
        if (line.startsWith('#### ')) return `<h4 class="text-lg font-semibold text-white mt-3 mb-1">${line.substring(5)}</h4>`;
        if (line.startsWith('*   ')) return `<li class="ml-5 list-disc text-gray-300">${line.substring(4)}</li>`;
        if (line.startsWith('- **')) return `<p class="text-gray-300 mb-1">${line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')}</p>`;
        if (line.trim() === '---') return `<hr class="border-gray-600 my-4">`;
        if (line.trim() === '') return `<br />`;
        return `<p class="text-gray-300 mb-2">${line.replace(/`([^`]+)`/g, '<code class="bg-gray-900 text-warning-yellow font-mono px-2 py-1 rounded-md">$1</code>').replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')}</p>`;
      })
      .join('');

    return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formattedResult }} />;
  };

  const renderForecastContent = () => {
      if (!analysisResult) return null; // Don't show forecast section until analysis is done

      if (!forecasts) {
          return (
              <div className="flex items-center justify-center mt-6 text-gray-400 border-t border-gray-700 pt-4">
                  <svg className="animate-spin h-5 w-5 text-brand-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Membuat proyeksi untuk besok...</span>
              </div>
          );
      }
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDay = tomorrow.toLocaleDateString('id-ID', { weekday: 'long' });

      return (
        <div className="mt-6 border-t border-gray-700 pt-4 animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <TrendingUpIcon className="w-6 h-6 mr-2 text-brand-secondary" />
                Proyeksi Penjualan untuk Besok ({tomorrowDay})
            </h3>
            <div className="space-y-2">
                {forecasts.map(({ itemName, forecast }) => {
                    const tomorrowForecast = forecast.dailyForecasts[0];
                    return (
                        <div key={itemName} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md">
                            <p className="font-semibold text-white">{itemName}</p>
                            <p className="font-bold text-brand-secondary text-lg">{tomorrowForecast?.predictedSales || '?'} unit</p>
                        </div>
                    );
                })}
            </div>
        </div>
      );
  };


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 relative animate-fade-in max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0">
            <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Laporan & Analisis Penjualan Harian</h2>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2">
          {renderAnalysisContent()}
          {renderForecastContent()}
        </div>
        
        <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-700 text-right">
            <button onClick={onClose} className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-md">
                Tutup
            </button>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalysisModal;