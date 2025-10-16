import React from 'react';
import type { Supplier, PendingOrder } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { PrinterIcon } from './icons/PrinterIcon';
import { formatRupiah } from '../utils/formatters';

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
  order: PendingOrder;
}

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({ isOpen, onClose, supplier, order }) => {
    if (!isOpen) return null;
    
    const { poNumber, orderDate, items, totalAmount } = order;
    const poDate = new Date(orderDate);
    
    const handlePrint = () => {
        window.print();
    };

    return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 no-print"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl p-6 relative animate-fade-in max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div id="purchase-order" className="bg-white text-gray-900 p-8 print-bg-white print-text-black">
            <div className="flex justify-between items-start pb-4 border-b print-border-gray">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 print-text-black">PURCHASE ORDER</h1>
                    <p className="text-gray-500 print-text-black">{poNumber}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-gray-800 print-text-black">ProfitLens Cafe</h2>
                    <p className="text-gray-600 print-text-black">Jl. Cilandak No. 12, Jakarta</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                    <p className="text-sm text-gray-500 print-text-black font-semibold">SUPPLIER</p>
                    <p className="font-bold text-gray-800 print-text-black">{supplier.name}</p>
                    <p className="text-gray-600 print-text-black">{supplier.contactPerson}</p>
                    <p className="text-gray-600 print-text-black">{supplier.phone}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 print-text-black font-semibold">TANGGAL</p>
                    <p className="font-bold text-gray-800 print-text-black">{poDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
            </div>

            <div className="mt-8">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 print-bg-white">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-gray-600 print-text-black">NAMA BARANG</th>
                            <th className="p-3 text-sm font-semibold text-gray-600 print-text-black text-center">KUANTITAS</th>
                            <th className="p-3 text-sm font-semibold text-gray-600 print-text-black text-right">HARGA SATUAN</th>
                            <th className="p-3 text-sm font-semibold text-gray-600 print-text-black text-right">SUBTOTAL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y print-border-gray">
                        {items.map(item => (
                            <tr key={item.ingredientName}>
                                <td className="p-3 text-gray-800 print-text-black">{item.ingredientName}</td>
                                <td className="p-3 text-gray-800 print-text-black text-center">{item.quantityToOrder.toLocaleString('id-ID')} {item.unit}</td>
                                <td className="p-3 text-gray-800 print-text-black text-right">{formatRupiah(item.price)}</td>
                                <td className="p-3 text-gray-800 print-text-black text-right">{formatRupiah(item.price * item.quantityToOrder)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mt-8">
                <div className="w-full max-w-xs">
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600 print-text-black">Subtotal</span>
                        <span className="text-gray-800 print-text-black">{formatRupiah(totalAmount)}</span>
                    </div>
                     <div className="flex justify-between py-2 font-bold text-xl border-t-2 print-border-gray">
                        <span className="text-gray-800 print-text-black">TOTAL</span>
                        <span className="text-gray-800 print-text-black">{formatRupiah(totalAmount)}</span>
                    </div>
                </div>
            </div>

             <div className="mt-12 text-center text-xs text-gray-500 print-text-black">
                <p>Terima kasih atas kerja sama Anda.</p>
                <p>Harap konfirmasi pesanan ini dan informasikan estimasi waktu pengiriman.</p>
            </div>
        </div>

        <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-700 flex justify-between items-center no-print">
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md">
                Tutup
            </button>
            <button onClick={handlePrint} className="flex items-center bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-6 rounded-md">
                <PrinterIcon className="w-5 h-5 mr-2" />
                Cetak PO
            </button>
        </div>

      </div>
    </div>
    );
};

export default PurchaseOrderModal;
