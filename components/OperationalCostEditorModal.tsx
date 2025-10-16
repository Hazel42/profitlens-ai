
import React, { useState, useEffect } from 'react';
import type { OperationalCost } from '../types';
import { CloseIcon } from './icons/CloseIcon';

// FIX: Updated type to omit `outletId` since it's handled by the data hook.
type CostFormData = Omit<OperationalCost, 'id' | 'outletId'>;

interface OperationalCostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Improved `any` type to be more specific for create and update actions.
  onSave: (cost: CostFormData | OperationalCost) => void;
  cost: OperationalCost | null;
}

const OperationalCostEditorModal: React.FC<OperationalCostEditorModalProps> = ({ isOpen, onClose, onSave, cost }) => {
  const [formData, setFormData] = useState<CostFormData>({
    name: '',
    amount: 0,
    interval: 'monthly',
  });

  useEffect(() => {
    if (cost) {
      setFormData({
        name: cost.name,
        amount: cost.amount,
        interval: cost.interval,
      });
    } else {
      setFormData({
        name: '',
        amount: 0,
        interval: 'monthly',
      });
    }
  }, [cost, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value as 'daily' | 'monthly' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cost) { // Edit mode
      onSave({ ...cost, ...formData });
    } else { // Create mode
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6 relative animate-fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">{cost ? 'Edit Biaya' : 'Tambah Biaya Baru'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nama Biaya</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required placeholder="Contoh: Sewa Ruko" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Jumlah (Rp)</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Interval Pembayaran</label>
              <select name="interval" value={formData.interval} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2">
                <option value="monthly">Bulanan</option>
                <option value="daily">Harian</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end pt-6">
            <button type="submit" className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-md">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OperationalCostEditorModal;