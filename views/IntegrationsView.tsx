import React from 'react';
import { PuzzlePieceIcon } from '../components/icons/PuzzlePieceIcon';

const IntegrationCard: React.FC<{ name: string, description: string }> = ({ name, description }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
    <div className="bg-gray-700 p-4 rounded-full mb-4">
        <PuzzlePieceIcon className="w-8 h-8 text-brand-secondary"/>
    </div>
    <h3 className="text-xl font-bold text-white">{name}</h3>
    <p className="text-gray-400 mt-2 flex-grow">{description}</p>
    <span className="mt-4 text-sm font-semibold bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">Segera Hadir</span>
  </div>
);

const IntegrationsView: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Integrasi</h1>
                <p className="text-gray-400">Hubungkan ProfitLens AI dengan alat lain yang Anda gunakan untuk mengotomatiskan alur kerja Anda.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IntegrationCard 
                    name="Moka POS"
                    description="Sinkronkan data penjualan Anda secara otomatis dari Moka POS untuk analisis real-time dan pembaruan inventaris."
                />
                <IntegrationCard 
                    name="Majoo"
                    description="Hubungkan dengan sistem kasir Majoo untuk menarik data transaksi harian tanpa input manual."
                />
                <IntegrationCard 
                    name="GoBiz"
                    description="Integrasikan dengan GoBiz untuk melacak penjualan dari GoFood dan menyatukannya dalam laporan laba rugi Anda."
                />
            </div>
        </div>
    );
};

export default IntegrationsView;