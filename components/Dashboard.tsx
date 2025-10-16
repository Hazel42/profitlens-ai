
import React from 'react';
import type { MenuItem } from '../types';
import MenuItemCard from './MenuItemCard';

interface DashboardProps {
  menuItems: MenuItem[];
  onViewRecipe: (id: string) => void;
  onOptimizePrice: (id: string) => void;
  onEditRecipe: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ menuItems, onViewRecipe, onOptimizePrice, onEditRecipe }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {menuItems.map(item => (
        <MenuItemCard 
          key={item.id} 
          menuItem={item} 
          onViewRecipe={() => onViewRecipe(item.id)}
          onOptimizePrice={() => onOptimizePrice(item.id)}
          onEditRecipe={() => onEditRecipe(item.id)}
        />
      ))}
    </div>
  );
};

export default Dashboard;