import React from 'react';
import type { WasteRecord, Ingredient } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { formatRupiah } from '../utils/formatters';

interface WasteHistoryTableProps {
  wasteHistory: WasteRecord[];
  ingredients: Ingredient[];
  onDelete: (id: string) => void;
}

const WasteHistoryTable: React.FC<WasteHistoryTableProps> = ({ wasteHistory, ingredients, onDelete }) => {
  const ingredientsMap: Map<string, Ingredient> = new Map(ingredients.map(i => [i.id, i]));
  const sortedHistory = [...wasteHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold text-white mb-4 px-2">Riwayat Pencatatan</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                <th scope="col" className="px-4 py-3">Tanggal</th>
                <th scope="col" className="px-4 py-3">Bahan Baku</th>
                <th scope="col" className="px-4 py-3">Jumlah</th>
                <th scope="col" className="px-4 py-3">Alasan</th>
                <th scope="col" className="px-4 py-3">Estimasi Kerugian</th>
                <th scope="col" className="px-4 py-3">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {sortedHistory.map(record => {
                    const ingredient = ingredientsMap.get(record.ingredientId);
                    return (
                        <tr key={record.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                            <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                            {new Date(record.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-3">{ingredient?.name || 'Tidak diketahui'}</td>
                            <td className="px-4 py-3">{record.quantity} {ingredient?.unit}</td>
                            <td className="px-4 py-3">{record.reason}</td>
                            <td className="px-4 py-3 text-alert-red font-semibold">{formatRupiah(record.cost)}</td>
                            <td className="px-4 py-3">
                                <button onClick={() => onDelete(record.id)} className="text-alert-red hover:text-red-400">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    )
                })}
                 {sortedHistory.length === 0 && (
                    <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-400">
                           Belum ada catatan bahan baku yang terbuang.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
    </div>
  );
};

export default WasteHistoryTable;