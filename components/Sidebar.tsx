
import React from 'react';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { InventoryIcon } from './icons/InventoryIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { BuildingStorefrontIcon } from './icons/BuildingStorefrontIcon';
import { ArchiveBoxXMarkIcon } from './icons/ArchiveBoxXMarkIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { ChartBarSquareIcon } from './icons/ChartBarSquareIcon';
import { TruckIcon } from './icons/TruckIcon';
import { PuzzlePieceIcon } from './icons/PuzzlePieceIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import type { View } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
    
  const navItemClasses = (view: string) => 
    `flex items-center px-4 py-2.5 text-base rounded-lg transition-colors duration-200 ${
      currentView === view 
        ? 'bg-brand-primary text-white font-bold' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-900 border-r border-gray-800 transform -translate-x-full transition-transform duration-300 ease-in-out lg:translate-x-0">
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800 flex-shrink-0">
              <span className="text-2xl font-bold text-white">ProfitLens</span>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <a
                href="#dashboard"
                onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}
                className={navItemClasses('dashboard')}
              >
                <ChartPieIcon className="w-6 h-6 mr-3" />
                Dashboard
              </a>
              <a
                href="#profitLoss"
                onClick={(e) => { e.preventDefault(); onNavigate('profitLoss'); }}
                className={navItemClasses('profitLoss')}
              >
                <BanknotesIcon className="w-6 h-6 mr-3" />
                Laba & Rugi
              </a>
              <a
                href="#performanceAnalysis"
                onClick={(e) => { e.preventDefault(); onNavigate('performanceAnalysis'); }}
                className={navItemClasses('performanceAnalysis')}
              >
                <ChartBarSquareIcon className="w-6 h-6 mr-3" />
                Analisis Performa
              </a>
              <a
                href="#inventory"
                onClick={(e) => { e.preventDefault(); onNavigate('inventory'); }}
                className={navItemClasses('inventory')}
              >
                <InventoryIcon className="w-6 h-6 mr-3" />
                Inventaris
              </a>
              <a
                href="#suppliers"
                onClick={(e) => { e.preventDefault(); onNavigate('suppliers'); }}
                className={navItemClasses('suppliers')}
              >
                <TruckIcon className="w-6 h-6 mr-3" />
                Supplier
              </a>
              <a
                href="#waste"
                onClick={(e) => { e.preventDefault(); onNavigate('waste'); }}
                className={navItemClasses('waste')}
              >
                <ArchiveBoxXMarkIcon className="w-6 h-6 mr-3" />
                Buangan
              </a>
              <a
                href="#menu"
                onClick={(e) => { e.preventDefault(); onNavigate('menu'); }}
                className={navItemClasses('menu')}
              >
                <BookOpenIcon className="w-6 h-6 mr-3" />
                Menu
              </a>
              <a
                href="#operational"
                onClick={(e) => { e.preventDefault(); onNavigate('operational'); }}
                className={navItemClasses('operational')}
              >
                <BuildingStorefrontIcon className="w-6 h-6 mr-3" />
                Operasional
              </a>
              <a
                href="#forecasting"
                onClick={(e) => { e.preventDefault(); onNavigate('forecasting'); }}
                className={navItemClasses('forecasting')}
              >
                <TrendingUpIcon className="w-6 h-6 mr-3" />
                Proyeksi
              </a>
              <a
                href="#sales"
                onClick={(e) => { e.preventDefault(); onNavigate('sales'); }}
                className={navItemClasses('sales')}
              >
                <ClipboardListIcon className="w-6 h-6 mr-3" />
                Rekap Penjualan
              </a>
               <a
                href="#integrations"
                onClick={(e) => { e.preventDefault(); onNavigate('integrations'); }}
                className={navItemClasses('integrations')}
              >
                <PuzzlePieceIcon className="w-6 h-6 mr-3" />
                Integrasi
              </a>
            </nav>
            <div className="p-4 border-t border-gray-800">
                 <a
                    href="#profile"
                    onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}
                    className={navItemClasses('profile')}
                  >
                    <UserCircleIcon className="w-6 h-6 mr-3" />
                    Profil & Pengaturan
                  </a>
            </div>
        </div>
      </aside>
  );
};

export default Sidebar;
