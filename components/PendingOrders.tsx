import React from 'react';
import type { PendingOrder } from '../types';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ArchiveBoxArrowDownIcon } from './icons/ArchiveBoxArrowDownIcon';
import { formatRupiah } from '../utils/formatters';

interface PendingOrdersProps {
  orders: PendingOrder[];
  onReceive: (orderId: string) => void;
  onViewPO: (order: PendingOrder) => void;
}

const PendingOrders: React.FC<PendingOrdersProps> = ({ orders, onReceive, onViewPO }) => {
  const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Pesanan dalam Proses ({orders.length})</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-4">Tidak ada pesanan yang sedang dalam proses.</p>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map(order => (
            <div key={order.id} className="bg-gray-700/50 p-4 rounded-lg flex flex-wrap justify-between items-center gap-4">
                <div className="flex-grow">
                    <p className="font-bold text-white">{order.poNumber}</p>
                    <p className="text-sm text-gray-300">Supplier: <span className="font-semibold">{order.supplier.name}</span></p>
                    <p className="text-xs text-gray-400">
                        {new Date(order.orderDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        &nbsp;&bull;&nbsp;{order.items.length} item
                    </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Total</p>
                        <p className="font-bold text-white">{formatRupiah(order.totalAmount)}</p>
                    </div>
                    <button onClick={() => onViewPO(order)} title="Lihat & Cetak PO" className="p-2 text-gray-300 hover:text-white bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">
                        <DocumentTextIcon className="w-5 h-5"/>
                    </button>
                    <button onClick={() => onReceive(order.id)} title="Tandai sebagai Diterima" className="flex items-center bg-safe-green hover:bg-green-600 text-white font-bold py-2 px-3 rounded-md transition-colors">
                        <ArchiveBoxArrowDownIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
