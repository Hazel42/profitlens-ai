
import React, { useState, useEffect } from 'react';
import type { WasteRecord, SalesHistoryRecord, Ingredient, WastePreventionAdvice, MenuItem } from '../types';
import { getWastePreventionAdvice } from '../services/geminiService';
import SkeletonLoader from './SkeletonLoader';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { formatRupiah } from '../utils/formatters';

interface AiWasteAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  wasteHistory: WasteRecord[];
  salesHistory: SalesHistoryRecord[];
  ingredients: Ingredient[];
  menuItems: MenuItem[];
}

const AiWasteAdvisorModal: React.FC<AiWasteAdvisorModalProps> = ({ isOpen, onClose, wasteHistory, salesHistory, ingredients, menuItems }) => {
  const [advice, setAdvice] = useState<WastePreventionAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchAdvice = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await getWastePreventionAdvice(wasteHistory, salesHistory, ingredients, menuItems);
          setAdvice(result);
        } catch (err) {
          console.error("Failed to get AI waste prevention advice:", err);
          const message = err instanceof Error ? err.message : "Gagal mengambil saran dari AI.";
          setError(message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAdvice();
    }
  }, [isOpen, wasteHistory, salesHistory, ingredients, menuItems]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <SkeletonLoader className="h-6 w-3/4" />
          <SkeletonLoader className="h-4 w-1/2" />
          <div className="pt-4 space-y-4">
             <SkeletonLoader className="h-24 w-full" />
             <SkeletonLoader className="h-24 w-full" />
          </div>
        </div>
      );
    }

    if (error || !advice) {
      return (
        <div className="text-center text-alert-red bg-alert-red/10 rounded-lg p-6 min-h-[250px] flex flex-col justify-center items-center">
          <p className="text-xl font-semibold mb-2">Terjadi Kesalahan</p>
          <p>{error || "Tidak dapat memuat saran."}</p>
        </div>
      );
    }
    
    return (
        <div className="animate-fade-in space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                <h3 className="text-md font-semibold text-brand-secondary mb-2">Ringkasan Analisis AI</h3>
                <p className="text-gray-300 italic">"{advice.summary}"</p>
            </div>
             <div>
              <h3 className="text-md font-semibold text-white mb-2">Pola & Rekomendasi</h3>
               {advice.patterns.length > 0 ? (
                    <div className="space-y-3">
                        {advice.patterns.map((pattern, index) => (
                            <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                                <p className="font-semibold text-white">{pattern.patternDescription}</p>
                                <p className="text-sm text-gray-300 mt-1"><span className="font-semibold text-brand-secondary">Rekomendasi: </span>{pattern.recommendation}</p>
                                <p className="text-sm text-gray-400 mt-2">Potensi Penghematan: <span className="font-bold text-safe-green">{formatRupiah(pattern.estimatedCostSaved)}/bulan</span></p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">AI tidak menemukan pola pemborosan yang signifikan saat ini. Kerja bagus!</p>
                )}
            </div>
        </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 relative animate-fade-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex-shrink-0">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <div className="flex items-center text-2xl font-bold text-white mb-4">
            <LightBulbIcon className="w-6 h-6 mr-3 text-yellow-400" />
            <span>Penasihat Pencegahan Buangan AI</span>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            {renderContent()}
        </div>
        <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-700 flex justify-end">
            <button onClick={onClose} className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-md">
                Mengerti
            </button>
        </div>
      </div>
    </div>
  );
};

export default AiWasteAdvisorModal;
