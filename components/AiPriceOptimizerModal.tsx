
import React, { useState, useEffect, useRef } from 'react';
import type { MenuItem, DynamicPriceSuggestion } from '../types';
import { getDynamicPriceSuggestion } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { formatRupiah } from '../utils/formatters';
import SkeletonLoader from './SkeletonLoader';

interface AiPriceOptimizerModalProps {
  menuItem: MenuItem;
  onClose: () => void;
  onApplyPrice: (itemId: string, newPrice: number) => void;
}

const AiPriceOptimizerModal: React.FC<AiPriceOptimizerModalProps> = ({ menuItem, onClose, onApplyPrice }) => {
  const [suggestion, setSuggestion] = useState<DynamicPriceSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getDynamicPriceSuggestion(menuItem);
        setSuggestion(result);
      } catch (err) {
        console.error("Failed to get AI price suggestion:", err);
        setError("Gagal mengambil rekomendasi harga dari AI.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestion();
  }, [menuItem]);

  useEffect(() => {
    if (menuItem) { // Modal is open
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];

      firstElement?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) { // Shift+Tab
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      };
      
      const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }

      const currentModalRef = modalRef.current;
      currentModalRef?.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keydown', handleEsc);

      return () => {
        currentModalRef?.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keydown', handleEsc);
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [menuItem, onClose]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <SkeletonLoader className="h-20" />
              <div className="flex items-center justify-center">
                  <ArrowRightIcon className="w-8 h-8 text-gray-500"/>
              </div>
              <SkeletonLoader className="h-20" />
            </div>
            <SkeletonLoader className="h-32" />
            <SkeletonLoader className="h-20" />
        </div>
      );
    }
    
    if (error || !suggestion) {
        return (
            <div className="text-center text-alert-red bg-alert-red/10 rounded-lg p-6 min-h-[250px] flex flex-col justify-center items-center">
                <p className="text-xl font-semibold mb-2">Terjadi Kesalahan</p>
                <p>{error || "Tidak dapat memuat saran."}</p>
            </div>
        );
    }

    const currentProfit = menuItem.sellingPrice - menuItem.cogs;
    const projectedProfit = suggestion.newSellingPrice - menuItem.cogs;

    return (
        <div className="animate-fade-in space-y-6">
            <div className="text-center">
                <p className="text-gray-400">Margin untuk <span className="font-bold text-white">{menuItem.name}</span> turun karena kenaikan biaya. AI merekomendasikan harga baru untuk mencapai target profitabilitas Anda.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Harga Saat Ini</p>
                    <p className="text-2xl font-bold text-alert-red line-through">{formatRupiah(menuItem.sellingPrice)}</p>
                </div>
                <div className="flex items-center justify-center">
                    <ArrowRightIcon className="w-8 h-8 text-gray-500"/>
                </div>
                <div className="bg-brand-primary/20 p-4 rounded-lg border border-brand-secondary">
                    <p className="text-sm text-gray-400">Saran Harga AI</p>
                    <p className="text-2xl font-bold text-safe-green">{formatRupiah(suggestion.newSellingPrice)}</p>
                </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
                <InfoRow label="Modal (HPP) Baru" value={formatRupiah(menuItem.cogs)} />
                <InfoRow label="Margin Saat Ini" value={`${menuItem.actualMargin.toFixed(1)}%`} valueClass="text-alert-red" />
                <InfoRow label="Proyeksi Margin Baru" value={`${suggestion.projectedMargin.toFixed(1)}%`} valueClass="text-safe-green" />
                <InfoRow label="Laba per Unit (Saat Ini)" value={formatRupiah(currentProfit)} valueClass="text-alert-red" />
                <InfoRow label="Proyeksi Laba per Unit" value={formatRupiah(projectedProfit)} valueClass="text-safe-green" />
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                <h3 className="text-md font-semibold text-brand-secondary mb-2">Justifikasi AI</h3>
                <p className="text-gray-300 italic">"{suggestion.justification}"</p>
            </div>
        </div>
    );
  };
  
  const handleApply = () => {
    if (suggestion) {
      onApplyPrice(menuItem.id, suggestion.newSellingPrice);
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6 relative animate-fade-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div className="flex items-center text-2xl font-bold text-white mb-4">
          <SparklesIcon className="w-6 h-6 mr-3 text-brand-secondary"/>
          <span>Asisten Harga Cerdas</span>
        </div>
        
        <div className="flex-grow">
          {renderContent()}
        </div>
        
        {!isLoading && suggestion && (
            <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-700 flex justify-end space-x-3">
                <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md">
                    Tutup
                </button>
                 <button onClick={handleApply} className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-md">
                    Terapkan Harga Baru
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const InfoRow: React.FC<{label: string, value: string, valueClass?: string}> = ({ label, value, valueClass = 'text-white' }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">{label}:</span>
        <span className={`font-bold text-lg ${valueClass}`}>{value}</span>
    </div>
);


export default AiPriceOptimizerModal;
