
import React from 'react';
import type { View } from '../types';
import { ChartPieIcon } from './icons/ChartPieIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { InventoryIcon } from './icons/InventoryIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface BottomNavBarProps {
  currentView: string;
  onNavigate: (view: View) => void;
}

const navItems = [
    { view: 'dashboard', label: 'Dasbor', icon: ChartPieIcon },
    { view: 'profitLoss', label: 'Laba/Rugi', icon: BanknotesIcon },
    { view: 'inventory', label: 'Stok', icon: InventoryIcon },
    { view: 'menu', label: 'Menu', icon: BookOpenIcon },
];

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, onNavigate }) => {

    const NavItem: React.FC<{ item: typeof navItems[0]}> = ({ item }) => {
        const isActive = currentView === item.view;
        const Icon = item.icon;
        const classes = `flex flex-col items-center justify-center text-xs w-full transition-colors duration-200 ${
            isActive ? 'text-brand-secondary' : 'text-gray-400 hover:text-white'
        }`;

        return (
            <button onClick={() => onNavigate(item.view as View)} className={classes}>
                <Icon className="w-6 h-6 mb-1" />
                <span className="font-semibold">{item.label}</span>
            </button>
        );
    }
    
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-800 flex justify-around items-center z-40 lg:hidden">
            {navItems.map(item => <NavItem key={item.view} item={item} />)}
        </nav>
    );
};

export default BottomNavBar;
