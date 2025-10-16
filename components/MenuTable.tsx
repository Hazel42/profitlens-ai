import React from 'react';
import type { MenuItem } from '../types';
import { MarginStatus } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { formatRupiah } from '../utils/formatters';

interface MenuTableProps {
  menuItems: MenuItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusStyles = {
  [MarginStatus.Safe]: 'text-safe-green',
  [MarginStatus.Warning]: 'text-warning-yellow',
  [MarginStatus.Danger]: 'text-alert-red',
};

const MenuTable: React.FC<MenuTableProps> = ({ menuItems, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">Nama Menu</th>
              <th scope="col" className="px-4 py-3">Harga Jual</th>
              <th scope="col" className="px-4 py-3">Modal (HPP)</th>
              <th scope="col" className="px-4 py-3">Margin Aktual</th>
              <th scope="col" className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map(item => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                  <div className="flex items-center">
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover mr-4" />
                    {item.name}
                  </div>
                </td>
                <td className="px-4 py-3">{formatRupiah(item.sellingPrice)}</td>
                <td className="px-4 py-3">{formatRupiah(item.cogs)}</td>
                <td className={`px-4 py-3 font-bold ${statusStyles[item.marginStatus]}`}>
                  {item.actualMargin.toFixed(1)}%
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => onEdit(item.id)} 
                        className="text-gray-400 hover:text-white"
                        aria-label={`Edit ${item.name}`}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => onDelete(item.id)} 
                        className="text-alert-red hover:text-red-400"
                        aria-label={`Hapus ${item.name}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTable;
