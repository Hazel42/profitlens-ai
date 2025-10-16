import React, { useMemo } from 'react';
import type { OperationalCost } from '../types';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { formatRupiah } from '../utils/formatters';

interface OperationalCostSummaryProps {
    costs: OperationalCost[];
}

const OperationalCostSummary: React.FC<OperationalCostSummaryProps> = ({ costs }) => {
    const totalMonthlyCost = useMemo(() => {
        return costs.reduce((total, cost) => {
            const monthlyAmount = cost.interval === 'daily' ? cost.amount * 30 : cost.amount;
            return total + monthlyAmount;
        }, 0);
    }, [costs]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                    <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                        <BuildingStorefrontIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Total Jenis Biaya</p>
                        <p className="text-3xl font-bold text-white">{costs.length}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center">
                    <div className="bg-red-500/20 p-3 rounded-full mr-4">
                        <CurrencyDollarIcon className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Estimasi Biaya / Bulan</p>
                        <p className="text-3xl font-bold text-white">{formatRupiah(totalMonthlyCost, { notation: 'compact' })}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationalCostSummary;
