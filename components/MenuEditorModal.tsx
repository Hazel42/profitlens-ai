
import React, { useState, useEffect, useRef } from 'react';
import type { MenuItem, Ingredient, RecipeComponent } from '../types';
import { CloseIcon } from './icons/CloseIcon';

type MenuItemFormData = Omit<MenuItem, 'id' | 'cogs' | 'actualMargin' | 'marginStatus'>;

// This will be the type for a new item or an existing one
type SavableMenuItem = MenuItemFormData | (MenuItemFormData & { id: string });

interface MenuEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: SavableMenuItem) => void;
  onDelete: (id: string) => void;
  ingredients: Ingredient[];
  menuItem: Omit<MenuItem, 'cogs' | 'actualMargin' | 'marginStatus'> | null;
}

const MenuEditorModal: React.FC<MenuEditorModalProps> = ({ isOpen, onClose, onSave, onDelete, ingredients, menuItem }) => {
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: '',
    sellingPrice: 0,
    targetMargin: 60,
    imageUrl: '',
    recipe: [],
  });
  const [newRecipeComponent, setNewRecipeComponent] = useState<{ ingredientId: string; quantity: string }>({
    ingredientId: '',
    quantity: '',
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name,
        sellingPrice: menuItem.sellingPrice,
        targetMargin: menuItem.targetMargin,
        imageUrl: menuItem.imageUrl,
        recipe: menuItem.recipe,
      });
    } else {
      setFormData({
        name: '',
        sellingPrice: 0,
        targetMargin: 60,
        imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`,
        recipe: [],
      });
    }
  }, [menuItem, isOpen]);

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];
      
      firstElement?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      };
      
      const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      
      const currentModalRef = modalRef.current;
      currentModalRef?.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keydown', handleEsc);

      return () => {
        currentModalRef?.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keydown', handleEsc);
        previouslyFocusedElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'sellingPrice' || name === 'targetMargin' ? parseFloat(value) || 0 : value }));
  };
  
  const handleRecipeChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewRecipeComponent(prev => ({ ...prev, [name]: value }));
  }

  const addIngredientToRecipe = () => {
      if (!newRecipeComponent.ingredientId || !newRecipeComponent.quantity || parseFloat(newRecipeComponent.quantity) <= 0) {
          alert("Pilih bahan dan masukkan kuantitas yang valid.");
          return;
      }
      if (formData.recipe.some(r => r.ingredientId === newRecipeComponent.ingredientId)) {
          alert("Bahan ini sudah ada di dalam resep.");
          return;
      }
      
      setFormData(prev => ({
          ...prev,
          recipe: [...prev.recipe, { ingredientId: newRecipeComponent.ingredientId, quantity: parseFloat(newRecipeComponent.quantity) }]
      }));
      setNewRecipeComponent({ ingredientId: '', quantity: '' });
  };
  
  const removeIngredientFromRecipe = (ingredientId: string) => {
      setFormData(prev => ({
          ...prev,
          recipe: prev.recipe.filter(r => r.ingredientId !== ingredientId)
      }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (menuItem) { // Edit mode
      onSave({ ...menuItem, ...formData });
    } else { // Create mode
      onSave({ ...formData, id: `menu${Date.now()}` });
    }
    onClose();
  };

  const handleDelete = () => {
    if (menuItem && window.confirm(`Apakah Anda yakin ingin menghapus "${menuItem.name}"?`)) {
      onDelete(menuItem.id);
      onClose();
    }
  };
  
  const ingredientsMap: Map<string, Ingredient> = new Map(ingredients.map(i => [i.id, i]));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div ref={modalRef} className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl p-6 relative animate-fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">{menuItem ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nama Menu</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Harga Jual (Rp)</label>
              <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Target Margin (%)</label>
              <input type="number" name="targetMargin" value={formData.targetMargin} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" required />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mt-4 mb-2 border-t border-gray-700 pt-4">Resep</h3>
            <div className="space-y-2">
                {formData.recipe.map(comp => {
                    const ingredient = ingredientsMap.get(comp.ingredientId);
                    return (
                        <div key={comp.ingredientId} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                            <span>{ingredient?.name}</span>
                            <div className="flex items-center gap-2">
                                <span>{comp.quantity} {ingredient?.unit}</span>
                                <button type="button" onClick={() => removeIngredientFromRecipe(comp.ingredientId)} className="text-red-500 hover:text-red-400">&times;</button>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex items-end gap-2 mt-3">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bahan Baku</label>
                    <select name="ingredientId" value={newRecipeComponent.ingredientId} onChange={handleRecipeChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2">
                        <option value="">Pilih Bahan</option>
                        {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                    </select>
                </div>
                <div className="w-24">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Kuantitas</label>
                    <input type="number" name="quantity" value={newRecipeComponent.quantity} onChange={handleRecipeChange} className="w-full bg-gray-900 border border-gray-600 rounded-md text-white p-2" />
                </div>
                <button type="button" onClick={addIngredientToRecipe} className="bg-brand-secondary hover:bg-brand-primary text-white font-bold p-2 rounded-md">Tambah</button>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-6">
            <div>
              {menuItem && (
                  <button type="button" onClick={handleDelete} className="bg-transparent hover:bg-alert-red/20 text-alert-red font-bold py-2 px-4 rounded-md">
                      Hapus Menu
                  </button>
              )}
            </div>
            <button type="submit" className="bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-md">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuEditorModal;
