import React, { useState } from 'react';
import type { Ingredient } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';
import { formatRupiah } from '../utils/formatters';

interface IngredientsTableProps {
  ingredients: Ingredient[];
  onPriceChange: (id: string, newPrice: number) => void;
  onStockChange: (id: string, newStock: number) => void;
  onUnitChange: (id: string, newUnit: string) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
}

const WasteTooltip: React.FC<{ cost: number }> = ({ cost }) => {
  const [show, setShow] = useState(false);
  return (
    <div 
      className="relative flex items-center ml-2"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <ExclamationCircleIcon className="w-5 h-5 text-warning-yellow cursor-pointer" />
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-700 text-white text-sm rounded-lg shadow-lg z-10 text-left normal-case tracking-normal">
          <p className="font-bold text-warning-yellow">Peringatan Buangan</p>
          <p>Kerugian dari buangan item ini dalam 30 hari terakhir adalah <span className="font-bold">{formatRupiah(cost)}</span>.</p>
        </div>
      )}
    </div>
  );
};


const IngredientsTable: React.FC<IngredientsTableProps> = ({ ingredients, onPriceChange, onStockChange, onUnitChange, onDelete, isEditing }) => {
  const [editingPriceValues, setEditingPriceValues] = useState<Record<string, string>>({});
  const [editingStockValues, setEditingStockValues] = useState<Record<string, string>>({});
  const [editingUnitValues, setEditingUnitValues] = useState<Record<string, string>>({});

  const handlePriceInputChange = (id: string, value: string) => {
    setEditingPriceValues(prev => ({ ...prev, [id]: value }));
  };

  const handlePriceInputBlur = (id: string) => {
    const value = parseFloat(editingPriceValues[id]);
    if (!isNaN(value) && value >= 0) {
      onPriceChange(id, value);
    }
    const { [id]: _, ...rest } = editingPriceValues;
    setEditingPriceValues(rest);
  };
  
  const handlePriceKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      handlePriceInputBlur(id);
      e.currentTarget.blur();
    }
  }

  const handleStockInputChange = (id: string, value: string) => {
    setEditingStockValues(prev => ({ ...prev, [id]: value }));
  };

  const handleStockInputBlur = (id: string) => {
    const value = parseFloat(editingStockValues[id]);
    if (!isNaN(value) && value >= 0) {
      onStockChange(id, value);
    }
    const { [id]: _, ...rest } = editingStockValues;
    setEditingStockValues(rest);
  };

  const handleStockKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      handleStockInputBlur(id);
      e.currentTarget.blur();
    }
  }

  const handleUnitInputChange = (id: string, value: string) => {
    setEditingUnitValues(prev => ({ ...prev, [id]: value }));
  };

  const handleUnitInputBlur = (id: string) => {
    const value = editingUnitValues[id];
    if (value && value.trim() !== '') {
      onUnitChange(id, value.trim());
    }
    const { [id]: _, ...rest } = editingUnitValues;
    setEditingUnitValues(rest);
  };

  const handleUnitKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      handleUnitInputBlur(id);
      e.currentTarget.blur();
    }
  }


  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">Bahan Baku</th>
              <th scope="col" className="px-4 py-3">Harga / Satuan</th>
              <th scope="col" className="px-4 py-3">Stok di Gudang</th>
              <th scope="col" className="px-4 py-3">Satuan</th>
              {isEditing && <th scope="col" className="px-4 py-3">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {ingredients.map(ingredient => (
              <tr key={ingredient.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                  <div className="flex items-center">
                    <span>{ingredient.name}</span>
                    {ingredient.wasteCostLast30Days && ingredient.wasteCostLast30Days > 0 && (
                      <WasteTooltip cost={ingredient.wasteCostLast30Days} />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <span>Rp</span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={editingPriceValues[ingredient.id] ?? ingredient.price}
                        onChange={(e) => handlePriceInputChange(ingredient.id, e.target.value)}
                        onBlur={() => handlePriceInputBlur(ingredient.id)}
                        onKeyPress={(e) => handlePriceKeyPress(e, ingredient.id)}
                        className="w-24 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-1.5"
                      />
                    </div>
                  ) : (
                    <span>{formatRupiah(ingredient.price)} / {ingredient.unit}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={editingStockValues[ingredient.id] ?? ingredient.stockLevel}
                        onChange={(e) => handleStockInputChange(ingredient.id, e.target.value)}
                        onBlur={() => handleStockInputBlur(ingredient.id)}
                        onKeyPress={(e) => handleStockKeyPress(e, ingredient.id)}
                        className="w-24 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-1.5"
                      />
                    </div>
                  ) : (
                     <span>{ingredient.stockLevel.toLocaleString('id-ID')} {ingredient.unit}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                   {isEditing ? (
                    <input
                        type="text"
                        value={editingUnitValues[ingredient.id] ?? ingredient.unit}
                        onChange={(e) => handleUnitInputChange(ingredient.id, e.target.value)}
                        onBlur={() => handleUnitInputBlur(ingredient.id)}
                        onKeyPress={(e) => handleUnitKeyPress(e, ingredient.id)}
                        className="w-20 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-1.5"
                      />
                   ) : (
                    <span>{ingredient.unit}</span>
                   )}
                </td>
                {isEditing && (
                    <td className="px-4 py-3">
                        <button 
                            onClick={() => onDelete(ingredient.id)} 
                            className="text-alert-red hover:text-red-400"
                            aria-label={`Hapus ${ingredient.name}`}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientsTable;
