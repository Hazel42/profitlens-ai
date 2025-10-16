
import React, { useState, useEffect } from 'react';
import type { Ingredient, ReorderSuggestion, Supplier, PurchaseOrderItem, PendingOrder, WasteRecord, MenuItem, Forecast } from '../types';
import { useProfitLensData } from '../hooks/useProfitLensData';
import { getReorderSuggestion, getSalesForecast } from '../services/geminiService';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { DocumentPlusIcon } from './icons/DocumentPlusIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { formatRupiah } from '../utils/formatters';

interface AiReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lowStockIngredients: Ingredient[];
  // FIX: Updated type to omit `outletId` as it's handled by the data hook.
  onConfirmOrder: (order: Omit<PendingOrder, 'id' | 'poNumber' | 'orderDate' | 'outletId'>) => void;
  wasteHistory: WasteRecord[];
}

const AiReorderModal: React.FC<AiReorderModalProps> = ({ isOpen, onClose, lowStockIngredients, onConfirmOrder, wasteHistory }) => {
  const { ingredients, menuItems, salesHistory, suppliers, supplierPrices } = useProfitLensData();
  const [suggestion, setSuggestion] = useState<ReorderSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('AI sedang menganalisis tingkat konsumsi...');
  const [error, setError] = useState<string | null>(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');

  useEffect(() => {
      if (isOpen && suppliers.length > 0 && !selectedSupplierId) {
          setSelectedSupplierId(suppliers[0].id);
      }
  }, [isOpen, suppliers, selectedSupplierId]);

  useEffect(() => {
    if (isOpen) {
      const fetchSuggestion = async () => {
        setIsLoading(true);
        setError(null);
        try {
            setLoadingMessage('Membuat proyeksi penjualan untuk item relevan...');
            const lowStockIngredientIds = new Set(lowStockIngredients.map(i => i.id));
            const affectedMenuItems = menuItems.filter(item => 
                item.recipe.some(component => lowStockIngredientIds.has(component.ingredientId))
            );
            
            const forecastPromises = affectedMenuItems.map(item => 
                getSalesForecast(item, salesHistory).then(forecast => ({ itemName: item.name, forecast }))
            );
            const forecasts = await Promise.all(forecastPromises);
            
            setLoadingMessage('Menyusun rekomendasi pesanan & supplier...');
            const result = await getReorderSuggestion(lowStockIngredients, ingredients, salesHistory, menuItems, wasteHistory, forecasts, suppliers, supplierPrices);
            setSuggestion(result);

            if (result.recommendedSupplier) {
                setSelectedSupplierId(result.recommendedSupplier.supplierId);
            }

        } catch (err) {
          console.error("Failed to get AI reorder suggestion:", err);
          setError("Gagal mengambil saran pemesanan ulang dari AI.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchSuggestion();
    }
  }, [isOpen, lowStockIngredients, ingredients, salesHistory, menuItems, wasteHistory, suppliers, supplierPrices]);

  const handleCreatePO = () => {
    if (!suggestion || !selectedSupplierId) {
        alert("Tidak ada saran atau supplier belum dipilih.");
        return;
    }
    // FIX: Explicitly typing the Map to prevent type inference issues with `get`.
    const ingredientsByName = new Map<string, Ingredient>(ingredients.map(i => [i.name, i]));
    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    if (!supplier) {
        alert("Supplier tidak ditemukan.");
        return;
    }

    // FIX: Refactored order item creation to be more type-safe and robust.
    // This resolves errors where properties on `ingredient` were inaccessible because it could be undefined.
    const orderItems: PurchaseOrderItem[] = suggestion.purchaseList
        .map(item => {
            const ingredient = ingredientsByName.get(item.ingredientName);
            if (!ingredient) {
                console.warn(`AI suggested reordering "${item.ingredientName}", but it was not found in the local ingredients list.`);
                return null;
            }
            return {
                ingredientId: ingredient.id,
                ingredientName: item.ingredientName,
                quantityToOrder: item.quantityToOrder,
                unit: ingredient.unit, // Using internal data for consistency
                price: ingredient.price, // Using internal price as estimate
            };
        })
        .filter((item): item is PurchaseOrderItem => item !== null);

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantityToOrder), 0);
    
    // FIX: Updated type to omit `outletId` to match the prop type and hook function signature.
    const newOrder: Omit<PendingOrder, 'id' | 'poNumber' | 'orderDate' | 'outletId'> = {
        supplier: { id: supplier.id, name: supplier.name },
        items: orderItems,
        totalAmount,
    };
    
    onConfirmOrder(newOrder);
    onClose();
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400">
          <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg text-center">{loadingMessage}</p>
        </div>
      );
    }
    
    if (error || !suggestion) {
      return (
        <div className="text-center text-alert-red bg-alert-red/10 rounded-lg p-6 min-h-[300px] flex flex-col justify-center items-center">
          <p className="text-xl font-semibold mb-2">Terjadi Kesalahan</p>
          <p>{error || "Tidak dapat memuat saran."}</p>
        </div>
      );
    }
    
    return (
        <div className="animate-fade-in space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-md font-semibold text-brand-secondary mb-2">Ringkasan AI</h3>
                <p className="text-gray-300 italic">"{suggestion.summary}"</p>
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-white mb-2">Daftar Pembelian yang Disarankan</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {suggestion.purchaseList.map((item, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 items-center bg-gray-700/50 p-3 rounded-md">
                          <span className="font-semibold text-white">{item.ingredientName}</span>
                          <span className="text-center font-bold text-brand-secondary text-lg">{item.quantityToOrder.toLocaleString('id-ID')} {item.unit}</span>
                          <span className="text-right text-gray-300">{formatRupiah(item.estimatedCost)}</span>
                      </div>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              {suggestion.recommendedSupplier && (
                <div className="bg-brand-primary/10 border border-brand-secondary p-4 rounded-lg mb-4">
                  <h3 className="text-md font-semibold text-brand-secondary mb-2 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Rekomendasi Supplier AI
                  </h3>
                   <p className="text-gray-300 italic">"{suggestion.recommendedSupplier.justification}"</p>
                </div>
              )}
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-300 mb-1">Pilih Supplier untuk PO</label>
                <select
                    id="supplier"
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2"
                >
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
        </div>
    );
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 relative animate-fade-in flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-shrink-0">
            <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div className="flex items-center text-2xl font-bold text-white mb-4">
                <LightBulbIcon className="w-6 h-6 mr-3 text-yellow-400"/>
                <span>Saran Pemesanan Ulang Cerdas</span>
            </div>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
          {renderContent()}
        </div>
        
        {!isLoading && !error && suggestion && (
            <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-700 flex justify-end">
                <button 
                    onClick={handleCreatePO}
                    disabled={!selectedSupplierId || suggestion.purchaseList.length === 0}
                    className="flex items-center justify-center bg-brand-primary hover:bg-brand-dark disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md"
                >
                    <DocumentPlusIcon className="w-5 h-5 mr-2" />
                    Buat Purchase Order
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AiReorderModal;