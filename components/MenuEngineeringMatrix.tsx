import React from 'react';
import type { MenuEngineeringAnalysis, MenuEngineeringItem } from '../types';

interface QuadrantProps {
  title: string;
  items: MenuEngineeringItem[];
  className: string;
  description: string;
}

const Quadrant: React.FC<QuadrantProps> = ({ title, items, className, description }) => (
  <div className={`p-4 rounded-lg ${className}`}>
    <h3 className="font-bold text-xl mb-1">{title}</h3>
    <p className="text-xs text-white/70 mb-3">{description}</p>
    <div className="space-y-2">
      {items.length > 0 ? items.map(item => (
        <div key={item.id} className="flex items-center bg-black/30 p-2 rounded-md">
          <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover mr-3" />
          <span className="text-sm font-medium text-white">{item.name}</span>
        </div>
      )) : <p className="text-sm text-center text-white/50 py-4">Tidak ada</p>}
    </div>
  </div>
);

interface MenuEngineeringMatrixProps {
  analysis: MenuEngineeringAnalysis;
}

const MenuEngineeringMatrix: React.FC<MenuEngineeringMatrixProps> = ({ analysis }) => {
  const stars = analysis.items.filter(i => i.category === 'Star');
  const cashCows = analysis.items.filter(i => i.category === 'Cash Cow');
  const questionMarks = analysis.items.filter(i => i.category === 'Question Mark');
  const dogs = analysis.items.filter(i => i.category === 'Dog');

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-gray-900/50 p-5 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-brand-secondary mb-2">Ringkasan & Rekomendasi Strategis AI</h3>
            <p className="text-gray-300 max-w-3xl mx-auto"><span className="font-bold">Ringkasan:</span> {analysis.summary}</p>
            <p className="text-gray-300 max-w-3xl mx-auto mt-1"><span className="font-bold">Rekomendasi:</span> {analysis.recommendation}</p>
       </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        <Quadrant title="⭐ Stars" description="Populer & Menguntungkan" items={stars} className="bg-safe-green/20" />
        <Quadrant title="❓ Question Marks" description="Kurang Populer, Tapi Untung" items={questionMarks} className="bg-blue-500/20" />
        <Quadrant title="🐄 Cash Cows" description="Populer, Tapi Kurang Untung" items={cashCows} className="bg-warning-yellow/20" />
        <Quadrant title="🐶 Dogs" description="Kurang Populer & Kurang Untung" items={dogs} className="bg-alert-red/20" />
      </div>
    </div>
  );
};

export default MenuEngineeringMatrix;