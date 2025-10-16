
import React, { useState } from 'react';
import type { Ingredient, WasteRecord } from '../types';
import { WasteReason } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface WasteLogFormProps {
  ingredients: Ingredient[];
  // FIX: Updated `record` type to omit `outletId` as it is handled by the data hook.
  onSave: (record: Omit<WasteRecord, 'id' | 'cost' | 'outletId'>) => void;
}

const WasteLogForm: React.FC<WasteLogFormProps> = ({ ingredients, onSave }) => {
  const [ingredientId, setIngredientId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState<WasteReason>(WasteReason.Expired);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedIngredient = ingredients.find(i => i.id === ingredientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientId || !quantity || parseFloat(quantity) <= 0) {
      alert('Silakan lengkapi semua field dengan benar.');
      return;
    }
    onSave({
      date,
      ingredientId,
      quantity: parseFloat(quantity),
      reason,
    });
    // Reset form
    setIngredientId('');
    setQuantity('');
    setReason(WasteReason.Expired);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Tambah Catatan Buangan Baru</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">Bahan Baku</label>
          <select
            value={ingredientId}
            onChange={(e) => setIngredientId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2.5"
            required
          >
            <option value="">Pilih bahan...</option>
            {ingredients.map(ing => (
              <option key={ing.id} value={ing.id}>{ing.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Jumlah</label>
          <div className="flex">
             <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-l-md text-white p-2.5"
                required
                min="0"
                step="any"
                placeholder="0"
              />
              <span className="inline-flex items-center px-3 text-sm text-gray-300 bg-gray-700 border border-l-0 border-gray-600 rounded-r-md">
                {selectedIngredient?.unit || 'satuan'}
              </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Alasan</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as WasteReason)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2.5"
            required
          >
            {Object.values(WasteReason).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
            <button
                type="submit"
                className="w-full flex items-center justify-center bg-brand-primary hover:bg-brand-dark text-white font-bold py-2.5 px-4 rounded-md transition-colors duration-200"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Tambah
            </button>
        </div>
      </form>
    </div>
  );
};

export default WasteLogForm;