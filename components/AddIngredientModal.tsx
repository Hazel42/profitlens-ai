
import React, { useState } from 'react';
import type { Ingredient } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Updated type to omit `outletId` as it's handled by the hook.
  onSave: (newIngredient: Omit<Ingredient, 'id' | 'outletId'>) => void;
}

// FIX: Updated type to omit `outletId` to match the `onSave` prop.
const initialFormState: Omit<Ingredient, 'id' | 'outletId'> = {
  name: '',
  price: 0,
  unit: 'gram',
  stockLevel: 0,
  reorderPoint: 0,
};

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumericField = ['price', 'stockLevel', 'reorderPoint'].includes(name);
    setFormData(prev => ({ 
      ...prev, 
      [name]: isNumericField ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama bahan baku tidak boleh kosong.');
      return;
    }
    onSave(formData);
    setFormData(initialFormState); // Reset form for next time
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6 relative animate-fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">Tambah Bahan Baku Baru</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nama Bahan Baku</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" 
              required 
              placeholder="Contoh: Biji Kopi Arabika"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Harga (Rp)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required min="0" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Satuan</label>
              <input type="text" name="unit" value={formData.unit} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required placeholder="gram, ml, pcs, dll."/>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Stok Awal</label>
              <input type="number" name="stockLevel" value={formData.stockLevel} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Titik Pemesanan Ulang</label>
              <input type="number" name="reorderPoint" value={formData.reorderPoint} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required min="0" />
            </div>
          </div>
          
          <div className="flex justify-end pt-6">
            <button type="submit" className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-md">
              Simpan Bahan Baku
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIngredientModal;