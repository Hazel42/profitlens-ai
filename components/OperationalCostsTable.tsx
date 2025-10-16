import React from 'react';
import type { OperationalCost } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { formatRupiah } from '../utils/formatters';

interface OperationalCostsTableProps {
  costs: OperationalCost[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const intervalLabels = {
    daily: 'Harian',
    monthly: 'Bulanan'
};

const OperationalCostsTable: React.FC<OperationalCostsTableProps> = ({ costs, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">Nama Biaya</th>
              <th scope="col" className="px-4 py-3">Jumlah</th>
              <th scope="col" className="px-4 py-3">Interval</th>
              <th scope="col" className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {costs.map(cost => (
              <tr key={cost.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                  {cost.name}
                </td>
                <td className="px-4 py-3">{formatRupiah(cost.amount)}</td>
                <td className="px-4 py-3">{intervalLabels[cost.interval]}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => onEdit(cost.id)} 
                        className="text-gray-400 hover:text-white"
                        aria-label={`Edit ${cost.name}`}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => onDelete(cost.id)} 
                        className="text-alert-red hover:text-red-400"
                        aria-label={`Hapus ${cost.name}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
             {costs.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400">
                        Belum ada biaya operasional yang ditambahkan.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperationalCostsTable;