
import React, { useState, useEffect } from 'react';
import type { MenuItem } from '../types';
import { getMarginFixRecommendation } from '../services/geminiService';
import SkeletonLoader from './SkeletonLoader';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';

interface AiRecommendationModalProps {
  menuItem: MenuItem;
  onClose: () => void;
}

const AiRecommendationModal: React.FC<AiRecommendationModalProps> = ({ menuItem, onClose }) => {
  const [recommendation, setRecommendation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMarginFixRecommendation(menuItem);
        setRecommendation(result);
      } catch (err) {
        console.error("Failed to get AI recommendation:", err);
        const message = err instanceof Error ? err.message : "Maaf, saya tidak dapat mengambil rekomendasi saat ini.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendation();
  }, [menuItem]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <SkeletonLoader className="h-8 w-1/2" />
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-3/4" />
          <SkeletonLoader className="h-6 w-1/3 mt-4" />
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-5/6" />
        </div>
      );
    }
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-alert-red bg-alert-red/10 rounded-lg p-6 min-h-[250px]">
                <ExclamationCircleIcon className="w-12 h-12 mb-4" />
                <p className="text-xl font-semibold text-white mb-2">Gagal Mendapatkan Rekomendasi</p>
                <p className="text-red-300">{error}</p>
            </div>
        );
    }
    
    // Simple markdown-to-html renderer
    const formattedRecommendation = recommendation
      .split('\n')
      .map(line => {
        if (line.startsWith('### ')) return `<h3 class="text-xl font-bold text-brand-secondary mt-4 mb-2">${line.substring(4)}</h3>`;
        if (line.startsWith('#### ')) return `<h4 class="text-lg font-semibold text-white mt-3 mb-1">${line.substring(5)}</h4>`;
        if (line.startsWith('*   ')) return `<li class="ml-5 list-disc text-gray-300">${line.substring(4)}</li>`;
        if (line.trim() === '---') return `<hr class="border-gray-600 my-4">`;
        if (line.trim() === '') return `<br />`;
        return `<p class="text-gray-300 mb-2">${line.replace(/`([^`]+)`/g, '<code class="bg-gray-900 text-warning-yellow font-mono px-2 py-1 rounded-md">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>')}</p>`;
      })
      .join('');


    return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formattedRecommendation }} />;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">Penjaga Margin AI</h2>

        <div className="prose prose-invert max-w-none">
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default AiRecommendationModal;
