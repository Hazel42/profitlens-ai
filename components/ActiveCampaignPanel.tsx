import React from 'react';
import type { ActiveCampaign } from '../types';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { StopCircleIcon } from './icons/StopCircleIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';

interface ActiveCampaignPanelProps {
  campaign: ActiveCampaign;
  performance: {
    daysRunning: number;
    percentageChange: number;
  };
  onEndCampaign: () => void;
}

const ActiveCampaignPanel: React.FC<ActiveCampaignPanelProps> = ({ campaign, performance, onEndCampaign }) => {
  const isPositive = performance.percentageChange >= 0;
  
  return (
    <div className="bg-brand-dark/50 border-2 border-brand-secondary rounded-lg shadow-lg p-6 animate-fade-in-down">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <MegaphoneIcon className="w-6 h-6 text-brand-secondary mr-3" />
            <span className="text-xs uppercase font-bold text-brand-secondary tracking-wider">Kampanye Pemasaran Aktif</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{campaign.campaignName}</h2>
          <p className="text-yellow-300 font-semibold">{campaign.promoMechanic}</p>
        </div>
        
        <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className="text-sm text-gray-300">Peningkatan Penjualan Item</p>
                <div className={`flex items-center justify-end text-3xl font-bold ${isPositive ? 'text-safe-green' : 'text-alert-red'}`}>
                    {isPositive && <ArrowUpIcon className="w-6 h-6 mr-1" />}
                    <span>{performance.percentageChange.toFixed(1)}%</span>
                </div>
                <p className="text-xs text-gray-400">selama {performance.daysRunning} hari terakhir</p>
            </div>
            <button
                onClick={onEndCampaign}
                className="flex items-center bg-alert-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                title="Akhiri Kampanye"
            >
                <StopCircleIcon className="w-5 h-5 mr-2" />
                <span>Akhiri</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveCampaignPanel;
