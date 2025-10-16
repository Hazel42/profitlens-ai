import React, { useState, useEffect } from 'react';
import type { Supplier } from '../types';
import { CloseIcon } from './icons/CloseIcon';

type SupplierFormData = Omit<Supplier, 'id'>;

interface SupplierEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cost: any) => void;
  supplier: Supplier | null;
}

const SupplierEditorModal: React.FC<SupplierEditorModalProps> = ({ isOpen, onClose, onSave, supplier }) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    contactPerson: '',
    phone: '',
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        phone: supplier.phone,
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
      });
    }
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supplier) { // Edit mode
      onSave({ ...supplier, ...formData });
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
        <h2 className="text-2xl font-bold text-white mb-6">{supplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nama Supplier</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required placeholder="Contoh: Sumber Pangan Utama" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nama Kontak (PIC)</label>
            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required placeholder="Contoh: Bapak Budi" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nomor Telepon</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required placeholder="08123456789" />
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

export default SupplierEditorModal;