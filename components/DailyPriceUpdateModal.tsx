
import React, { useState, useEffect, useRef } from 'react';
import type { Ingredient } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { formatRupiah } from '../utils/formatters';

interface DailyPriceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  onSave: (updatedPrices: Record<string, number>) => void;
}

const DailyPriceUpdateModal: React.FC<DailyPriceUpdateModalProps> = ({ isOpen, onClose, ingredients, onSave }) => {
  const [updatedPrices, setUpdatedPrices] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];
      
      firstElement?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      };
      
      const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      
      const currentModalRef = modalRef.current;
      currentModalRef?.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keydown', handleEsc);

      return () => {
        currentModalRef?.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keydown', handleEsc);
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  const handlePriceChange = (id: string, value: string) => {
    setUpdatedPrices(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const pricesToSave: Record<string, number> = {};
    for (const id in updatedPrices) {
      const price = parseFloat(updatedPrices[id]);
      if (!isNaN(price) && price >= 0) {
        pricesToSave[id] = price;
      }
    }
    onSave(pricesToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 relative animate-fade-in flex flex-col max-h-[90vh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-shrink-0">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white">Pembaruan Harga Harian</h2>
            <p className="text-gray-400 mb-4">Masukkan harga terbaru dari supplier hari ini. Margin menu akan dihitung ulang secara otomatis.</p>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            <div className="space-y-3">
            {ingredients.map(ingredient => (
                <div key={ingredient.id} className="grid grid-cols-3 gap-4 items-center bg-gray-700/50 p-3 rounded-md">
                    <div className="col-span-1">
                        <p className="font-semibold text-white">{ingredient.name}</p>
                        <p className="text-sm text-gray-400">Harga saat ini: {formatRupiah(ingredient.price)}</p>
                    </div>
                    <div className="col-span-2">
                        <div className="flex items-center">
                            <span className="text-gray-400 mr-2">Rp</span>
                            <input
                                type="number"
                                placeholder={ingredient.price.toString()}
                                value={updatedPrices[ingredient.id] || ''}
                                onChange={(e) => handlePriceChange(ingredient.id, e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2 focus:ring-brand-primary focus:border-brand-primary"
                            />
                             <span className="text-gray-400 ml-2">/{ingredient.unit}</span>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>

        <div className="flex-shrink-0 flex justify-end pt-6 mt-4 border-t border-gray-700">
          <button onClick={handleSubmit} className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-md">
            Simpan Perubahan Harga
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyPriceUpdateModal;
