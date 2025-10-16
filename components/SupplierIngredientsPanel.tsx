import React, { useState, useMemo } from 'react';
import { useProfitLensData } from '../hooks/useProfitLensData';
import type { Supplier, Ingredient, SupplierPriceListItem } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { formatRupiah } from '../utils/formatters';

interface SupplierIngredientsPanelProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

const SupplierIngredientsPanel: React.FC<SupplierIngredientsPanelProps> = ({ supplier, onEdit, onDelete }) => {
    const {
        ingredients,
        supplierPrices,
        linkIngredientToSupplier,
        updateSupplierIngredientPrice,
        unlinkIngredientFromSupplier
    } = useProfitLensData();

    const [newLink, setNewLink] = useState({ ingredientId: '', price: '' });

    const linkedIngredients = useMemo(() => {
        const ingredientsMap = new Map(ingredients.map(i => [i.id, i]));
        return supplierPrices
            .filter(sp => sp.supplierId === supplier.id)
            .map(sp => ({
                ...sp,
                ingredient: ingredientsMap.get(sp.ingredientId)
            }))
            .filter(item => item.ingredient);
    }, [supplier.id, supplierPrices, ingredients]);
    
    const unlinkedIngredients = useMemo(() => {
       const linkedIds = new Set(linkedIngredients.map(item => item.ingredientId));
       return ingredients.filter(ing => !linkedIds.has(ing.id));
    }, [linkedIngredients, ingredients]);

    const handleAddLink = () => {
        if (!newLink.ingredientId || !newLink.price || parseFloat(newLink.price) < 0) {
            alert("Silakan pilih bahan dan masukkan harga yang valid.");
            return;
        }
        linkIngredientToSupplier(supplier.id, newLink.ingredientId, parseFloat(newLink.price));
        setNewLink({ ingredientId: '', price: '' });
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in-down">
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-700">
                <div>
                    <h2 className="text-2xl font-bold text-white">{supplier.name}</h2>
                    <p className="text-gray-400">{supplier.contactPerson}</p>
                    <p className="text-gray-400">{supplier.phone}</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => onEdit(supplier)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"><PencilIcon className="w-5 h-5" /></button>
                    <button onClick={() => onDelete(supplier.id)} className="p-2 text-alert-red hover:text-red-400 hover:bg-red-500/10 rounded-md"><TrashIcon className="w-5 h-5" /></button>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Katalog Harga Bahan Baku</h3>
            
            <div className="space-y-2 mb-6">
                {linkedIngredients.map(item => (
                    <div key={item.id} className="grid grid-cols-3 gap-4 items-center bg-gray-700/50 p-3 rounded-md">
                        <span className="font-medium text-white">{item.ingredient?.name}</span>
                         <input
                            type="number"
                            defaultValue={item.price}
                            onBlur={(e) => updateSupplierIngredientPrice(item.id, parseFloat(e.target.value))}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2"
                         />
                        <button onClick={() => unlinkIngredientFromSupplier(item.id)} className="text-gray-400 hover:text-alert-red justify-self-end">Hapus</button>
                    </div>
                ))}
                {linkedIngredients.length === 0 && (
                     <p className="text-center text-gray-500 py-4">Supplier ini belum memiliki bahan baku yang ditautkan.</p>
                )}
            </div>
            
            <div className="border-t border-gray-700 pt-4">
                 <h4 className="text-lg font-semibold text-white mb-2">Tautkan Bahan Baku Baru</h4>
                 <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Bahan Baku</label>
                        <select value={newLink.ingredientId} onChange={e => setNewLink(p => ({...p, ingredientId: e.target.value}))} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2">
                            <option value="">Pilih bahan...</option>
                            {unlinkedIngredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Harga (Rp)</label>
                        <input type="number" value={newLink.price} onChange={e => setNewLink(p => ({...p, price: e.target.value}))} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" />
                    </div>
                    <button onClick={handleAddLink} className="bg-brand-secondary hover:bg-brand-primary text-white font-bold p-2 rounded-md h-10">
                        <PlusIcon className="w-5 h-5"/>
                    </button>
                 </div>
            </div>

        </div>
    );
};

export default SupplierIngredientsPanel;
