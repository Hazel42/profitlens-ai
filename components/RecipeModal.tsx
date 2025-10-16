import React, { useEffect, useRef } from 'react';
import type { MenuItem, Ingredient } from '../types';
import { formatRupiah } from '../utils/formatters';

interface RecipeModalProps {
  menuItem: MenuItem & { ingredients: (Ingredient & { quantity: number })[] };
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ menuItem, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (menuItem) { // Modal is open
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];

      // Focus the close button on open
      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        // Trap focus
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
      
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }

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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          ref={closeButtonRef}
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Tutup resep"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 id="recipe-modal-title" className="text-2xl font-bold text-white mb-1">Resep untuk {menuItem.name}</h2>
        <p className="text-gray-400 mb-4">Berdasarkan harga bahan baku saat ini.</p>

        <div className="space-y-3">
            {menuItem.ingredients.map(ing => (
                <div key={ing.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md">
                    <div>
                        <p className="font-semibold text-white">{ing.name}</p>
                        <p className="text-sm text-gray-400">{ing.quantity} {ing.unit} @ {formatRupiah(ing.price)}/{ing.unit}</p>
                    </div>
                    <p className="font-bold text-brand-secondary text-lg">
                        {formatRupiah(ing.quantity * ing.price)}
                    </p>
                </div>
            ))}
        </div>
        
        <div className="mt-6 border-t border-gray-700 pt-4">
            <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-300">Total Modal (HPP):</span>
                <span className="text-white">{formatRupiah(menuItem.cogs ?? 0)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
