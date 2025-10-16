import React, { useState, useCallback } from 'react';
import type { Ingredient, GeneratedMenuItem, MenuItem } from '../types';
import { createMenuItemWithAi, generateMenuImage } from '../services/geminiService';
import { PlusIcon } from './icons/PlusIcon';
import { formatRupiah } from '../utils/formatters';
import SkeletonLoader from './SkeletonLoader';

interface AiCreateMenuModalProps {
  ingredients: Ingredient[];
  onClose: () => void;
  onSave: (newItem: Omit<MenuItem, 'cogs' | 'actualMargin' | 'marginStatus'>) => void;
}

const AiCreateMenuModal: React.FC<AiCreateMenuModalProps> = ({ ingredients, onClose, onSave }) => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedItem, setGeneratedItem] = useState<GeneratedMenuItem | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedItem(null);
    try {
      const result = await createMenuItemWithAi(userInput, ingredients);
      setGeneratedItem(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!generatedItem) return;

    setIsGeneratingImage(true);
    try {
        const imageUrl = await generateMenuImage(generatedItem.name, generatedItem.description);
        setGeneratedImageUrl(imageUrl); // Show the image
        
        const ingredientsByName: Map<string, Ingredient> = new Map(ingredients.map(i => [i.name.toLowerCase(), i]));
        
        const newMenuItem: Omit<MenuItem, 'cogs' | 'actualMargin' | 'marginStatus'> = {
          id: `menu${Date.now()}`,
          name: generatedItem.name,
          imageUrl: imageUrl,
          sellingPrice: generatedItem.sellingPrice,
          targetMargin: 60,
          recipe: generatedItem.recipe
            .map(comp => {
              const ingredient = ingredientsByName.get(comp.ingredientName.toLowerCase());
              if (!ingredient) return null;
              return {
                ingredientId: ingredient.id,
                quantity: comp.quantity,
              };
            })
            .filter((r): r is { ingredientId: string; quantity: number } => r !== null),
        };
        onSave(newMenuItem);
        onClose();

    } catch (err) {
        setError(err instanceof Error ? `Gagal membuat gambar: ${err.message}` : "Gagal membuat gambar menu.");
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 min-h-[300px]">
          <SkeletonLoader className="h-8 w-2/3" />
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-5/6" />
          <div className="pt-4">
            <SkeletonLoader className="h-10 w-full" />
            <SkeletonLoader className="h-10 w-full mt-2" />
          </div>
        </div>
      );
    }
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-alert-red bg-alert-red/10 rounded-lg p-8 min-h-[300px]">
                <p className="text-xl font-semibold text-white mb-2">Gagal Membuat Resep</p>
                <p className="text-red-300 mb-6">{error}</p>
                <button
                    onClick={handleGenerate}
                    className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-md"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    if (generatedItem) {
      return (
        <div className="animate-fade-in">
          <h3 className="text-xl font-bold text-brand-secondary">{generatedItem.name}</h3>
          <p className="text-gray-400 mt-1 mb-4 italic">"{generatedItem.description}"</p>
          <div className="space-y-3">
             <div className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md">
                <p className="font-semibold text-white">Saran Harga Jual</p>
                <p className="font-bold text-white text-lg">{formatRupiah(generatedItem.sellingPrice)}</p>
            </div>
            <h4 className="font-semibold text-white pt-2">Resep:</h4>
            {generatedItem.recipe.map((ing, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-md">
                    <p className="font-semibold text-white">{ing.ingredientName}</p>
                    <p className="text-gray-300">{ing.quantity} {ing.unit}</p>
                </div>
            ))}
          </div>
           <div className="mt-6 flex justify-end space-x-3">
                <button onClick={() => setGeneratedItem(null)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md">
                    Ubah Deskripsi
                </button>
                <button 
                  onClick={handleSave} 
                  disabled={isGeneratingImage}
                  className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-md flex items-center justify-center"
                >
                  {isGeneratingImage ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Membuat Gambar...
                    </>
                  ) : "Simpan Menu"}
                </button>
            </div>
        </div>
      );
    }

    return (
        <>
          <p className="text-gray-300 mb-4">
            Jelaskan ide menu baru Anda. Contoh: "es kopi susu creamy dengan rasa pandan" atau "croissant renyah isi cokelat dan almond".
          </p>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Contoh: minuman teh melati dengan leci dan sentuhan soda..."
            className="w-full h-28 p-3 bg-gray-900 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
            rows={4}
          />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!userInput.trim()}
              className="flex items-center justify-center bg-brand-primary hover:bg-brand-dark disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Buat dengan AI
            </button>
          </div>
        </>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">AI Menu Creator</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default AiCreateMenuModal;