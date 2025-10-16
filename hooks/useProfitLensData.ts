import { useState, useEffect, useMemo, useCallback } from 'react';
import type { MenuItem, Ingredient, SalesHistoryRecord, DetailedPerformanceStats, PerformanceItem, OperationalCost, WasteRecord, ProfitLossStats, Supplier, SupplierPriceListItem, PendingOrder, ActiveCampaign, MarketingCampaignSuggestion, Outlet, Notification, View, User } from '../types';
import { MarginStatus, WasteReason } from '../types';
import { generateSalesHistory } from '../data/salesHistory';

const initialOutlets: Outlet[] = [
    { id: 'out001', name: 'Cabang Utama Cilandak' },
    { id: 'out002', name: 'Pop-up Kemang' }
];

// Mock Data - Used only if localStorage is empty
const initialIngredients: Omit<Ingredient, 'id' | 'outletId'>[] = [
  // Coffee & Base
  { name: 'Biji Kopi Espresso', unit: 'gram', price: 300, stockLevel: 5000, reorderPoint: 500 },
  { name: 'Susu UHT', unit: 'ml', price: 17, stockLevel: 20000, reorderPoint: 2000 },
  { name: 'Gula Aren Cair', unit: 'ml', price: 35, stockLevel: 5000, reorderPoint: 1000 },
  { name: 'Daun Teh Melati', unit: 'gram', price: 200, stockLevel: 1000, reorderPoint: 200 },
  { name: 'Bubuk Cokelat', unit: 'gram', price: 150, stockLevel: 2000, reorderPoint: 300 },
  
  // Syrups & Flavors
  { name: 'Sirup Vanila', unit: 'ml', price: 40, stockLevel: 3000, reorderPoint: 500 },
  { name: 'Sirup Karamel', unit: 'ml', price: 45, stockLevel: 3000, reorderPoint: 500 },
  { name: 'Ekstrak Pandan', unit: 'ml', price: 100, stockLevel: 1000, reorderPoint: 100 },

  // Pastry
  { name: 'Tepung Terigu', unit: 'gram', price: 15, stockLevel: 10000, reorderPoint: 1500 },
  { name: 'Mentega', unit: 'gram', price: 80, stockLevel: 5000, reorderPoint: 500 },
  { name: 'Gula Pasir', unit: 'gram', price: 14, stockLevel: 10000, reorderPoint: 1000 },
  { name: 'Telur', unit: 'butir', price: 2000, stockLevel: 100, reorderPoint: 24 },
  { name: 'Cokelat Batang', unit: 'gram', price: 120, stockLevel: 3000, reorderPoint: 500 },
];

const generateMultiOutletIngredients = (): Ingredient[] => {
    let ingredients: Ingredient[] = [];
    let idCounter = 1;
    initialOutlets.forEach((outlet, outletIndex) => {
        initialIngredients.forEach((ing, ingIndex) => {
            const stockMultiplier = outletIndex === 0 ? 1.0 : 0.7; // Kemang has 70% stock of Cilandak
            const priceMultiplier = outletIndex === 0 ? 1.0 : 1.05; // Kemang prices are 5% higher
            ingredients.push({
                ...ing,
                id: `ing${outlet.id.slice(-3)}-${String(ingIndex + 1).padStart(3, '0')}`,
                outletId: outlet.id,
                stockLevel: Math.round(ing.stockLevel * stockMultiplier),
                price: Math.round(ing.price * priceMultiplier),
            });
        });
    });
    return ingredients;
}


const initialMenuItems: Omit<MenuItem, 'cogs' | 'actualMargin' | 'marginStatus'>[] = [
  {
    id: 'menu001',
    name: 'Kopi Susu Gula Aren',
    imageUrl: 'https://images.unsplash.com/photo-1579953934344-33d3b1e32777?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    sellingPrice: 22000,
    targetMargin: 65,
    recipe: [
      { ingredientId: 'ing-001', quantity: 18 }, // Base ingredient ID, will be mapped per outlet
      { ingredientId: 'ing-002', quantity: 120 },
      { ingredientId: 'ing-003', quantity: 20 },
    ],
  },
  {
    id: 'menu002',
    name: 'Caramel Macchiato',
    imageUrl: 'https://images.unsplash.com/photo-1542990253-a78140d72069?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    sellingPrice: 28000,
    targetMargin: 60,
    recipe: [
      { ingredientId: 'ing-001', quantity: 18 },
      { ingredientId: 'ing-002', quantity: 150 },
      { ingredientId: 'ing-006', quantity: 15 },
      { ingredientId: 'ing-007', quantity: 10 },
    ],
  },
  {
    id: 'menu003',
    name: 'Brownies Cokelat',
    imageUrl: 'https://images.unsplash.com/photo-1606890356254-7776b0102604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    sellingPrice: 25000,
    targetMargin: 70,
    recipe: [
      { ingredientId: 'ing-013', quantity: 50 },
      { ingredientId: 'ing-010', quantity: 40 },
      { ingredientId: 'ing-009', quantity: 30 },
      { ingredientId: 'ing-011', quantity: 35 },
      { ingredientId: 'ing-012', quantity: 1 },
    ],
  },
   {
    id: 'menu004',
    name: 'Pandan Latte',
    imageUrl: 'https://images.unsplash.com/photo-1621217068576-281b31a851d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    sellingPrice: 26000,
    targetMargin: 65,
    recipe: [
      { ingredientId: 'ing-001', quantity: 18 },
      { ingredientId: 'ing-002', quantity: 120 },
      { ingredientId: 'ing-008', quantity: 15 },
      { ingredientId: 'ing-011', quantity: 10 },
    ],
  },
];

const initialOperationalCosts: Omit<OperationalCost, 'id'>[] = [
  { name: 'Sewa Ruko', amount: 5000000, interval: 'monthly', outletId: 'out001' },
  { name: 'Gaji 2 Karyawan', amount: 8000000, interval: 'monthly', outletId: 'out001' },
  { name: 'Listrik & Air', amount: 1500000, interval: 'monthly', outletId: 'out001' },
  { name: 'Lain-lain (Pemasaran, dll)', amount: 100000, interval: 'daily', outletId: 'out001' },
  { name: 'Sewa Pop-up', amount: 2000000, interval: 'monthly', outletId: 'out002' },
  { name: 'Gaji 1 Karyawan', amount: 4000000, interval: 'monthly', outletId: 'out002' },
  { name: 'Listrik & Air', amount: 800000, interval: 'monthly', outletId: 'out002' },
];

const initialWasteHistory: WasteRecord[] = [];

const initialSuppliers: Supplier[] = [
    { id: 'sup001', name: 'Sumber Pangan Utama', contactPerson: 'Bapak Budi', phone: '081234567890' },
    { id: 'sup002', name: 'Kopi Jaya Abadi', contactPerson: 'Ibu Siti', phone: '081298765432' },
];

const initialSupplierPrices: SupplierPriceListItem[] = [
    // These are simplified and don't reflect multi-outlet pricing from suppliers
    { id: 'sp001', supplierId: 'sup001', ingredientId: 'ing-002', price: 17 }, // Susu UHT
    { id: 'sp002', supplierId: 'sup001', ingredientId: 'ing-009', price: 15 }, // Tepung
    { id: 'sp003', supplierId: 'sup002', ingredientId: 'ing-001', price: 300 }, // Kopi
    { id: 'sp004', supplierId: 'sup002', ingredientId: 'ing-001', price: 295 }, // Kopi promo
];

const listeners = new Set<() => void>();

const createDataStore = () => {
  let ingredientsStore: Ingredient[] = [];
  let menuItemsStore: Omit<MenuItem, 'cogs' | 'actualMargin' | 'marginStatus'>[] = [];
  let salesHistoryStore: SalesHistoryRecord[] = [];
  let operationalCostsStore: OperationalCost[] = [];
  let wasteHistoryStore: WasteRecord[] = [];
  let suppliersStore: Supplier[] = [];
  let supplierPricesStore: SupplierPriceListItem[] = [];
  let pendingOrdersStore: PendingOrder[] = [];
  let activeCampaignStore: ActiveCampaign | null = null;
  let outletsStore: Outlet[] = [];
  let userStore: User | null = null;
  let currentOutletId: string = '';

  const loadData = () => {
    try {
      const savedIngredients = localStorage.getItem('profitlens_ingredients');
      const savedMenuItems = localStorage.getItem('profitlens_menuItems');
      const savedOperationalCosts = localStorage.getItem('profitlens_operationalCosts');
      const savedWasteHistory = localStorage.getItem('profitlens_wasteHistory');
      const savedSuppliers = localStorage.getItem('profitlens_suppliers');
      const savedSupplierPrices = localStorage.getItem('profitlens_supplierPrices');
      const savedPendingOrders = localStorage.getItem('profitlens_pendingOrders');
      const savedActiveCampaign = localStorage.getItem('profitlens_activeCampaign');
      const savedOutlets = localStorage.getItem('profitlens_outlets');
      const savedSalesHistory = localStorage.getItem('profitlens_salesHistory');
      const savedUser = localStorage.getItem('profitlens_user');

      outletsStore = savedOutlets ? JSON.parse(savedOutlets) : initialOutlets;
      currentOutletId = outletsStore[0]?.id || '';
      
      userStore = savedUser ? JSON.parse(savedUser) : {
          name: 'Admin ProfitLens',
          role: 'Manajer',
          avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=Admin`,
      };

      if (!savedIngredients || !savedMenuItems || !savedSalesHistory) {
        console.log("Initializing with mock data...");
        ingredientsStore = generateMultiOutletIngredients();
        menuItemsStore = initialMenuItems;
        operationalCostsStore = initialOperationalCosts.map((c, i) => ({...c, id: `op${i+1}`}));
        wasteHistoryStore = initialWasteHistory;
        suppliersStore = initialSuppliers;
        supplierPricesStore = initialSupplierPrices;
        pendingOrdersStore = [];
        activeCampaignStore = null;
        salesHistoryStore = generateSalesHistory(initialMenuItems, 90, outletsStore);
      } else {
        ingredientsStore = JSON.parse(savedIngredients);
        menuItemsStore = JSON.parse(savedMenuItems);
        operationalCostsStore = savedOperationalCosts ? JSON.parse(savedOperationalCosts) : initialOperationalCosts.map((c, i) => ({...c, id: `op${i+1}`}));
        wasteHistoryStore = savedWasteHistory ? JSON.parse(savedWasteHistory) : initialWasteHistory;
        suppliersStore = savedSuppliers ? JSON.parse(savedSuppliers) : initialSuppliers;
        supplierPricesStore = savedSupplierPrices ? JSON.parse(savedSupplierPrices) : initialSupplierPrices;
        pendingOrdersStore = savedPendingOrders ? JSON.parse(savedPendingOrders) : [];
        activeCampaignStore = savedActiveCampaign ? JSON.parse(savedActiveCampaign) : null;
        salesHistoryStore = JSON.parse(savedSalesHistory);
      }
    } catch (error) {
      console.error("Failed to load or parse data from localStorage, falling back to mock data.", error);
      outletsStore = initialOutlets;
      currentOutletId = outletsStore[0]?.id || '';
      userStore = { name: 'Admin ProfitLens', role: 'Manajer', avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=Admin` };
      ingredientsStore = generateMultiOutletIngredients();
      menuItemsStore = initialMenuItems;
      salesHistoryStore = generateSalesHistory(initialMenuItems, 90, outletsStore);
      operationalCostsStore = initialOperationalCosts.map((c, i) => ({...c, id: `op${i+1}`}));
      wasteHistoryStore = initialWasteHistory;
      suppliersStore = initialSuppliers;
      supplierPricesStore = initialSupplierPrices;
      pendingOrdersStore = [];
      activeCampaignStore = null;
    }
  };

  const saveData = () => {
    localStorage.setItem('profitlens_ingredients', JSON.stringify(ingredientsStore));
    localStorage.setItem('profitlens_menuItems', JSON.stringify(menuItemsStore));
    localStorage.setItem('profitlens_salesHistory', JSON.stringify(salesHistoryStore));
    localStorage.setItem('profitlens_operationalCosts', JSON.stringify(operationalCostsStore));
    localStorage.setItem('profitlens_wasteHistory', JSON.stringify(wasteHistoryStore));
    localStorage.setItem('profitlens_suppliers', JSON.stringify(suppliersStore));
    localStorage.setItem('profitlens_supplierPrices', JSON.stringify(supplierPricesStore));
    localStorage.setItem('profitlens_pendingOrders', JSON.stringify(pendingOrdersStore));
    localStorage.setItem('profitlens_activeCampaign', JSON.stringify(activeCampaignStore));
    localStorage.setItem('profitlens_outlets', JSON.stringify(outletsStore));
    localStorage.setItem('profitlens_user', JSON.stringify(userStore));
    listeners.forEach(listener => listener());
  };

  loadData();
  saveData();

  let lastId = Date.now();
  const getUniqueId = (prefix: string) => {
    lastId++;
    return `${prefix}${lastId}`;
  };

  return {
    getIngredients: (outletId: string) => ingredientsStore.filter(i => i.outletId === outletId),
    getAllIngredients: () => ingredientsStore,
    getMenuItems: () => menuItemsStore,
    getSalesHistory: (outletId: string) => salesHistoryStore.filter(s => s.outletId === outletId),
    getAllSalesHistory: () => salesHistoryStore,
    getOperationalCosts: (outletId: string) => operationalCostsStore.filter(c => c.outletId === outletId),
    getAllOperationalCosts: () => operationalCostsStore,
    getWasteHistory: (outletId: string) => wasteHistoryStore.filter(w => w.outletId === outletId),
    getAllWasteHistory: () => wasteHistoryStore,
    getSuppliers: () => suppliersStore,
    getSupplierPrices: () => supplierPricesStore,
    getPendingOrders: (outletId: string) => pendingOrdersStore.filter(p => p.outletId === outletId),
    getAllPendingOrders: () => pendingOrdersStore,
    getActiveCampaign: () => activeCampaignStore,
    getOutlets: () => outletsStore,
    getUser: () => userStore,
    getCurrentOutletId: () => currentOutletId,
    setCurrentOutletId: (id: string) => {
        if (outletsStore.some(o => o.id === id)) {
            currentOutletId = id;
            saveData();
        }
    },
    
    updateUser: (updatedUser: Omit<User, 'avatarUrl'>) => {
        if (userStore) {
            userStore = { ...userStore, ...updatedUser };
            saveData();
        }
    },
    
    addOutlet: (name: string) => {
        if (!name.trim()) return;
        const newOutlet: Outlet = {
            id: getUniqueId('out'),
            name: name.trim(),
        };
        outletsStore = [...outletsStore, newOutlet];
        saveData();
    },

    updateOutlet: (id: string, name: string) => {
        if (!name.trim()) return;
        outletsStore = outletsStore.map(o => o.id === id ? { ...o, name: name.trim() } : o);
        saveData();
    },

    deleteOutlet: (id: string) => {
        if (outletsStore.length <= 1) {
            return { success: false, message: "Tidak dapat menghapus satu-satunya cabang." };
        }
        if (id === currentOutletId) {
            return { success: false, message: "Tidak dapat menghapus cabang yang sedang aktif. Silakan pindah ke cabang lain terlebih dahulu." };
        }
        const hasData = ingredientsStore.some(i => i.outletId === id) ||
                        salesHistoryStore.some(s => s.outletId === id) ||
                        operationalCostsStore.some(o => o.outletId === id);
        if (hasData) {
            return { success: false, message: "Cabang ini memiliki data terkait (inventaris, penjualan, dll.) dan tidak dapat dihapus." };
        }
        outletsStore = outletsStore.filter(o => o.id !== id);
        saveData();
        return { success: true };
    },

    addIngredient: (newIngredient: Omit<Ingredient, 'id' | 'outletId'>) => {
      const ingredient = { ...newIngredient, id: getUniqueId('ing'), outletId: currentOutletId };
      ingredientsStore = [...ingredientsStore, ingredient];
      saveData();
      return ingredient;
    },
    
    addMenuItem: (newItem: Omit<MenuItem, 'id' | 'cogs' | 'actualMargin' | 'marginStatus'>) => {
      const item = { ...newItem, id: getUniqueId('menu') };
      menuItemsStore = [...menuItemsStore, item];
      saveData();
      return item;
    },

    updateIngredientPrices: (updatedPrices: Record<string, number>) => {
        ingredientsStore = ingredientsStore.map(ing => {
            if (ing.outletId === currentOutletId && updatedPrices[ing.id] !== undefined) {
                return { ...ing, previousPrice: ing.price, price: updatedPrices[ing.id] };
            }
            return ing;
        });
        saveData();
    },
    updateIngredientPrice: (id: string, newPrice: number) => {
        ingredientsStore = ingredientsStore.map(ing => ing.id === id ? { ...ing, previousPrice: ing.price, price: newPrice } : ing);
        saveData();
    },
     updateIngredientStock: (id: string, newStock: number) => {
        ingredientsStore = ingredientsStore.map(ing => ing.id === id ? { ...ing, stockLevel: newStock } : ing);
        saveData();
    },
    updateIngredientUnit: (id: string, newUnit: string) => {
        ingredientsStore = ingredientsStore.map(ing => ing.id === id ? { ...ing, unit: newUnit } : ing);
        saveData();
    },
    deleteIngredient: (id: string) => {
        const isUsedInRecipe = menuItemsStore.some(item => item.recipe.some(r => r.ingredientId === id));
        if (isUsedInRecipe) {
            return { success: false, message: 'Bahan ini masih digunakan dalam resep. Hapus dari resep terlebih dahulu.' };
        }
        ingredientsStore = ingredientsStore.filter(ing => ing.id !== id);
        saveData();
        return { success: true };
    },
    updateMenuItem: (updatedItem: Omit<MenuItem, 'cogs' | 'actualMargin' | 'marginStatus'> & {id: string}) => {
        menuItemsStore = menuItemsStore.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item);
        saveData();
    },
     updateMenuItemPrice: (id: string, newPrice: number) => {
        menuItemsStore = menuItemsStore.map(item => item.id === id ? { ...item, sellingPrice: newPrice } : item);
        saveData();
    },
    deleteMenuItem: (id: string) => {
        menuItemsStore = menuItemsStore.filter(item => item.id !== id);
        saveData();
    },
    addOperationalCost: (cost: Omit<OperationalCost, 'id' | 'outletId'>) => {
        const newCost = { ...cost, id: getUniqueId('op'), outletId: currentOutletId };
        operationalCostsStore = [...operationalCostsStore, newCost];
        saveData();
    },
    updateOperationalCost: (cost: OperationalCost) => {
        operationalCostsStore = operationalCostsStore.map(c => c.id === cost.id ? cost : c);
        saveData();
    },
    deleteOperationalCost: (id: string) => {
        operationalCostsStore = operationalCostsStore.filter(c => c.id !== id);
        saveData();
    },
    addWasteRecord: (record: Omit<WasteRecord, 'id' | 'cost' | 'outletId'>) => {
        const ingredient = ingredientsStore.find(i => i.id === record.ingredientId && i.outletId === currentOutletId);
        if (!ingredient) return;

        const cost = ingredient.price * record.quantity;
        const newRecord = { ...record, id: getUniqueId('waste'), cost, outletId: currentOutletId };
        wasteHistoryStore = [...wasteHistoryStore, newRecord];
        
        ingredientsStore = ingredientsStore.map(ing => 
            ing.id === record.ingredientId ? { ...ing, stockLevel: Math.max(0, ing.stockLevel - record.quantity) } : ing
        );
        
        saveData();
    },
    deleteWasteRecord: (id: string) => {
        wasteHistoryStore = wasteHistoryStore.filter(w => w.id !== id);
        saveData();
    },
    addSupplier: (supplier: Omit<Supplier, 'id'>) => {
        const newSupplier = { ...supplier, id: getUniqueId('sup') };
        suppliersStore = [...suppliersStore, newSupplier];
        saveData();
    },
    updateSupplier: (supplier: Supplier) => {
        suppliersStore = suppliersStore.map(s => s.id === supplier.id ? supplier : s);
        saveData();
    },
    deleteSupplier: (id: string) => {
        suppliersStore = suppliersStore.filter(s => s.id !== id);
        supplierPricesStore = supplierPricesStore.filter(sp => sp.supplierId !== id);
        saveData();
    },
    linkIngredientToSupplier: (supplierId: string, ingredientId: string, price: number) => {
        const newLink = { id: getUniqueId('sp'), supplierId, ingredientId, price };
        supplierPricesStore = [...supplierPricesStore, newLink];
        saveData();
    },
    updateSupplierIngredientPrice: (linkId: string, newPrice: number) => {
        supplierPricesStore = supplierPricesStore.map(sp => sp.id === linkId ? { ...sp, price: newPrice } : sp);
        saveData();
    },
    unlinkIngredientFromSupplier: (linkId: string) => {
        supplierPricesStore = supplierPricesStore.filter(sp => sp.id !== linkId);
        saveData();
    },
    addPendingOrder: (order: Omit<PendingOrder, 'id' | 'poNumber' | 'orderDate' | 'outletId'>) => {
        const poNumber = `PO-${Date.now()}`;
        const newOrder = { 
            ...order, 
            id: getUniqueId('po'),
            poNumber,
            orderDate: new Date().toISOString(),
            outletId: currentOutletId,
        };
        pendingOrdersStore = [...pendingOrdersStore, newOrder];
        saveData();
    },
    receiveStock: (orderId: string) => {
        const order = pendingOrdersStore.find(o => o.id === orderId);
        if (!order) return;

        const updatedStockMap = new Map<string, number>();
        order.items.forEach(item => {
            updatedStockMap.set(item.ingredientId, (updatedStockMap.get(item.ingredientId) || 0) + item.quantityToOrder);
        });
        
        ingredientsStore = ingredientsStore.map(ing => {
            if (updatedStockMap.has(ing.id)) {
                return { ...ing, stockLevel: ing.stockLevel + updatedStockMap.get(ing.id)! };
            }
            return ing;
        });

        pendingOrdersStore = pendingOrdersStore.filter(o => o.id !== orderId);
        saveData();
    },
    launchCampaign: (campaign: MarketingCampaignSuggestion) => {
        activeCampaignStore = {
            ...campaign,
            startDate: new Date().toISOString(),
        };
        saveData();
    },
    endCampaign: () => {
        activeCampaignStore = null;
        saveData();
    },
    processDailySales: (sales: Record<string, number>) => {
      const today = new Date().toISOString().split('T')[0];
      const currentOutletIngredients = ingredientsStore.filter(i => i.outletId === currentOutletId);
      
      let ingredientsToUpdate = new Map<string, number>();

      menuItemsStore.forEach(menuItem => {
        const soldCount = sales[menuItem.id] || 0;
        if (soldCount > 0) {
          salesHistoryStore.push({
            date: today,
            menuItemId: menuItem.id,
            quantitySold: soldCount,
            totalRevenue: soldCount * menuItem.sellingPrice,
            outletId: currentOutletId,
          });

          menuItem.recipe.forEach(component => {
             const outletIngredient = currentOutletIngredients.find(i => i.name === initialIngredients[parseInt(component.ingredientId.split('-')[1]) - 1].name);
             if (outletIngredient) {
                const currentConsumption = ingredientsToUpdate.get(outletIngredient.id) || 0;
                ingredientsToUpdate.set(outletIngredient.id, currentConsumption + (component.quantity * soldCount));
             }
          });
        }
      });
      
      const updatedIngredients = ingredientsStore.map(ing => {
          if (ingredientsToUpdate.has(ing.id)) {
              return { ...ing, stockLevel: Math.max(0, ing.stockLevel - (ingredientsToUpdate.get(ing.id) || 0)) };
          }
          return ing;
      });
      ingredientsStore = updatedIngredients;
      
      saveData();
      return updatedIngredients.filter(i => i.outletId === currentOutletId);
    },
    checkStockAvailability: (sales: Record<string, number>) => {
        const currentOutletIngredients = ingredientsStore.filter(i => i.outletId === currentOutletId);
        const requiredIngredients = new Map<string, { required: number, name: string }>();
        const stockMap = new Map(currentOutletIngredients.map(i => [i.name, i.stockLevel]));
        const ingredientNameMap = new Map(currentOutletIngredients.map(i => [i.name, i.name]));
        
        menuItemsStore.forEach(menuItem => {
            const soldCount = sales[menuItem.id] || 0;
            if (soldCount > 0) {
                menuItem.recipe.forEach(component => {
                    const ingName = initialIngredients[parseInt(component.ingredientId.split('-')[1]) - 1].name;
                    const currentRequired = requiredIngredients.get(ingName)?.required || 0;
                    requiredIngredients.set(ingName, {
                        required: currentRequired + component.quantity * soldCount,
                        name: ingName
                    });
                });
            }
        });

        const warnings: Record<string, string> = {};
        menuItemsStore.forEach(menuItem => {
            const soldCount = sales[menuItem.id] || 0;
            if (soldCount > 0) {
                 const insufficient = menuItem.recipe.find(component => {
                    const ingName = initialIngredients[parseInt(component.ingredientId.split('-')[1]) - 1].name;
                    const needed = requiredIngredients.get(ingName)?.required || 0;
                    const available = stockMap.get(ingName) || 0;
                    return needed > available;
                 });
                 if (insufficient) {
                     const ingName = initialIngredients[parseInt(insufficient.ingredientId.split('-')[1]) - 1].name;
                     warnings[menuItem.id] = `Stok ${ingName} mungkin tidak cukup untuk memenuhi penjualan.`;
                 }
            }
        });
        return warnings;
    },
    subscribe: (callback: () => void) => {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    }
  };
};

const store = createDataStore();

export const useProfitLensData = () => {
  const [_, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = store.subscribe(() => forceUpdate({}));
    return () => unsubscribe();
  }, []);

  const currentOutletId = store.getCurrentOutletId();
  
  // Get raw data from store
  const allIngredients = store.getAllIngredients();
  const menuItemsData = store.getMenuItems();
  const allSalesHistory = store.getAllSalesHistory();
  const allOperationalCosts = store.getAllOperationalCosts();
  const allWasteHistory = store.getAllWasteHistory();
  const allPendingOrders = store.getAllPendingOrders();
  const suppliers = store.getSuppliers();
  const supplierPrices = store.getSupplierPrices();
  const activeCampaign = store.getActiveCampaign();
  const outlets = store.getOutlets();
  const user = store.getUser();

  // Memoize filtered data to stabilize references and prevent unnecessary re-renders
  const ingredients = useMemo(() => allIngredients.filter(i => i.outletId === currentOutletId), [allIngredients, currentOutletId]);
  const salesHistory = useMemo(() => allSalesHistory.filter(s => s.outletId === currentOutletId), [allSalesHistory, currentOutletId]);
  const operationalCosts = useMemo(() => allOperationalCosts.filter(c => c.outletId === currentOutletId), [allOperationalCosts, currentOutletId]);
  const wasteHistory = useMemo(() => allWasteHistory.filter(w => w.outletId === currentOutletId), [allWasteHistory, currentOutletId]);
  const pendingOrders = useMemo(() => allPendingOrders.filter(p => p.outletId === currentOutletId), [allPendingOrders, currentOutletId]);

  const [dateRange, setDateRange] = useState(30);
  const [isComparing, setIsComparing] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);

  const toggleComparison = useCallback(() => setIsComparing(prev => !prev), []);

  const ingredientsMapByName = useMemo(() => new Map(initialIngredients.map((i, idx) => [`ing-${String(idx + 1).padStart(3, '0')}`, i.name])), []);

  const menuItems = useMemo<MenuItem[]>(() => {
    const outletIngredientsMap = new Map(ingredients.map(i => [i.name, i]));
    return menuItemsData.map(item => {
      const cogs = item.recipe.reduce((total, component) => {
        const baseIngredientName = ingredientsMapByName.get(component.ingredientId);
        const outletIngredient = baseIngredientName ? outletIngredientsMap.get(baseIngredientName) : undefined;
        return total + (outletIngredient ? outletIngredient.price * component.quantity : 0);
      }, 0);
      
      const actualMargin = item.sellingPrice > 0 ? ((item.sellingPrice - cogs) / item.sellingPrice) * 100 : 0;
      
      let marginStatus = MarginStatus.Safe;
      const marginDifference = actualMargin - item.targetMargin;
      if (marginDifference < 0 && marginDifference >= -10) {
        marginStatus = MarginStatus.Warning;
      } else if (marginDifference < -10) {
        marginStatus = MarginStatus.Danger;
      }

      return { ...item, cogs, actualMargin, marginStatus };
    });
  }, [ingredients, menuItemsData, ingredientsMapByName]);
  
  const getMenuItemById = useCallback((id: string | null): (MenuItem & { ingredients: (Ingredient & { quantity: number })[] }) | null => {
    if (!id) return null;
    const menuItem = menuItems.find(item => item.id === id);
    if (!menuItem) return null;

    const outletIngredientsMap = new Map(ingredients.map(i => [i.name, i]));
    const populatedIngredients = menuItem.recipe.map(component => {
        const baseIngredientName = ingredientsMapByName.get(component.ingredientId);
        const outletIngredient = baseIngredientName ? outletIngredientsMap.get(baseIngredientName) : undefined;
        return outletIngredient ? { ...outletIngredient, quantity: component.quantity } : null;
      })
      .filter((i): i is Ingredient & { quantity: number } => i !== null);
      
    return { ...menuItem, ingredients: populatedIngredients };
  }, [menuItems, ingredients, ingredientsMapByName]);

  const salesHistoryForRange = useMemo(() => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - dateRange);
      return salesHistory.filter(record => new Date(record.date) >= cutoffDate);
  }, [salesHistory, dateRange]);

  const dashboardStats = useMemo(() => {
    const totalRevenue = salesHistoryForRange.reduce((sum, record) => sum + record.totalRevenue, 0);
    const { netProfit } = calculateProfitLoss(dateRange, salesHistory, menuItems, operationalCosts, wasteHistory);
    const lowStockCount = ingredients.filter(ing => ing.stockLevel <= ing.reorderPoint).length;
    const totalItemsSold = salesHistoryForRange.reduce((sum, record) => sum + record.quantitySold, 0);
    const averageMargin = menuItems.length > 0 ? menuItems.reduce((sum, item) => sum + item.actualMargin, 0) / menuItems.length : 0;
    return { totalRevenue, netProfit, lowStockCount, totalItemsSold, averageMargin };
  }, [salesHistoryForRange, menuItems, ingredients, operationalCosts, wasteHistory, dateRange]);

  const chartData = useMemo(() => {
      const data: { [date: string]: number } = {};
      const labels: string[] = [];
      for (let i = dateRange - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        labels.push(dateString);
        data[dateString] = 0;
      }
      salesHistoryForRange.forEach(record => {
        if (data[record.date] !== undefined) {
          data[record.date] += record.totalRevenue;
        }
      });
      return { labels: labels, data: Object.values(data) };
  }, [salesHistoryForRange, dateRange]);

  const comparisonChartData = useMemo(() => {
    const data: { [date: string]: number } = {};
    const labels: string[] = [];

    // Previous period
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - dateRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (dateRange * 2));

    const salesForComparisonRange = salesHistory.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate < endDate;
    });

    for (let i = dateRange - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - dateRange - i);
        const dateString = date.toISOString().split('T')[0];
        data[dateString] = 0;
    }

    salesForComparisonRange.forEach(record => {
        if (data[record.date] !== undefined) {
            data[record.date] += record.totalRevenue;
        }
    });

    return { data: Object.values(data) };
  }, [salesHistory, dateRange]);

  const inventoryOverviewStats = useMemo(() => {
    const totalItems = ingredients.length;
    const lowStockCount = ingredients.filter(ing => ing.stockLevel <= ing.reorderPoint).length;
    const totalStockValue = ingredients.reduce((sum, ing) => sum + (ing.price * ing.stockLevel), 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const totalWasteCostLast30Days = wasteHistory
        .filter(w => new Date(w.date) >= thirtyDaysAgo)
        .reduce((sum, w) => sum + w.cost, 0);
    return { totalItems, lowStockCount, totalStockValue, totalWasteCostLast30Days };
  }, [ingredients, wasteHistory]);

  const ingredientsWithWasteCost = useMemo(() => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const wasteCostMap = new Map<string, number>();
      wasteHistory
        .filter(w => new Date(w.date) >= thirtyDaysAgo)
        .forEach(w => {
            wasteCostMap.set(w.ingredientId, (wasteCostMap.get(w.ingredientId) || 0) + w.cost);
        });
      return ingredients.map(ing => ({
          ...ing,
          wasteCostLast30Days: wasteCostMap.get(ing.id) || 0,
      }));
  }, [ingredients, wasteHistory]);
  
  const marginAlerts = useMemo(() => {
    const alerts: { ingredientName: string; priceIncreasePercent: number; affectedMenus: string[] }[] = [];
    ingredients.forEach(ing => {
        if (ing.previousPrice && ing.price > ing.previousPrice) {
            const priceIncreasePercent = ((ing.price - ing.previousPrice) / ing.previousPrice) * 100;
            if (priceIncreasePercent > 10) {
                const affectedMenus = menuItems
                    .filter(m => m.recipe.some(r => {
                        const baseIngName = ingredientsMapByName.get(r.ingredientId);
                        return baseIngName === ing.name;
                    }))
                    .map(m => m.name);
                if (affectedMenus.length > 0) {
                    alerts.push({
                        ingredientName: ing.name,
                        priceIncreasePercent: Math.round(priceIncreasePercent),
                        affectedMenus
                    });
                }
            }
        }
    });
    return alerts;
  }, [ingredients, menuItems, ingredientsMapByName]);

  const detailedPerformanceStats = useMemo<DetailedPerformanceStats>(() => {
    const salesStats: Record<string, { units: number; revenue: number }> = {};
    menuItems.forEach(item => { salesStats[item.id] = { units: 0, revenue: 0 }; });
    salesHistoryForRange.forEach(record => {
        if (salesStats[record.menuItemId]) {
            salesStats[record.menuItemId].units += record.quantitySold;
            salesStats[record.menuItemId].revenue += record.totalRevenue;
        }
    });
    const performanceItems = menuItems.map(item => ({
        ...item,
        unitsSold: salesStats[item.id].units,
        revenue: salesStats[item.id].revenue
    }));
    const createPerformanceList = (
        items: typeof performanceItems,
        metricKey: 'unitsSold' | 'revenue' | 'actualMargin',
        sort: 'asc' | 'desc'
    ): PerformanceItem[] => {
        return items.sort((a, b) => sort === 'desc' ? b[metricKey] - a[metricKey] : a[metricKey] - b[metricKey]).slice(0, 3).map(item => ({ id: item.id, name: item.name, imageUrl: item.imageUrl, metric: item[metricKey] }));
    };
    return {
        bestSellersByUnit: createPerformanceList(performanceItems, 'unitsSold', 'desc'),
        highestRevenueItems: createPerformanceList(performanceItems, 'revenue', 'desc'),
        mostProfitableItems: createPerformanceList(performanceItems, 'actualMargin', 'desc'),
        leastProfitableItems: createPerformanceList(performanceItems, 'actualMargin', 'asc'),
    };
  }, [menuItems, salesHistoryForRange]);
  
  const wasteSummary = useMemo(() => {
        const wasteByReason: Record<string, number> = {};
        Object.values(WasteReason).forEach(r => wasteByReason[r] = 0);
        wasteHistory.forEach(record => { wasteByReason[record.reason] = (wasteByReason[record.reason] || 0) + record.cost; });
        return { labels: Object.keys(wasteByReason), data: Object.values(wasteByReason) };
    }, [wasteHistory]);
    
  const profitLossStats = useMemo<ProfitLossStats>(() => {
      return calculateProfitLoss(dateRange, salesHistory, menuItems, operationalCosts, wasteHistory);
  }, [dateRange, salesHistory, menuItems, operationalCosts, wasteHistory]);
    
  const campaignPerformance = useMemo(() => {
      if (!activeCampaign) return null;
      const startDate = new Date(activeCampaign.startDate);
      const now = new Date();
      const daysRunning = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const involvedItemsMap = new Map<string, boolean>();
      involvedItemsMap.set(activeCampaign.involvedItems.item1Name, true);
      involvedItemsMap.set(activeCampaign.involvedItems.item2Name, true);
      const involvedItemIds = new Set(menuItems.filter(m => involvedItemsMap.has(m.name)).map(m => m.id));
      const allSalesHistory = store.getAllSalesHistory();
      const salesDuringCampaign = allSalesHistory.filter(s => new Date(s.date) >= startDate && involvedItemIds.has(s.menuItemId));
      const totalUnitsDuring = salesDuringCampaign.reduce((sum, s) => sum + s.quantitySold, 0);
      const avgDailyUnitsDuring = totalUnitsDuring / (daysRunning || 1);
      const beforeStartDate = new Date(startDate);
      beforeStartDate.setDate(beforeStartDate.getDate() - daysRunning);
      const salesBeforeCampaign = allSalesHistory.filter(s => { const d = new Date(s.date); return d >= beforeStartDate && d < startDate && involvedItemIds.has(s.menuItemId); });
      const totalUnitsBefore = salesBeforeCampaign.reduce((sum, s) => sum + s.quantitySold, 0);
      const avgDailyUnitsBefore = totalUnitsBefore / (daysRunning || 1);
      let percentageChange = 0;
      if (avgDailyUnitsBefore > 0) { percentageChange = ((avgDailyUnitsDuring - avgDailyUnitsBefore) / avgDailyUnitsBefore) * 100; } 
      else if (avgDailyUnitsDuring > 0) { percentageChange = 100; }
      return { daysRunning, percentageChange };
  }, [activeCampaign, menuItems]);

  const notifications = useMemo<Notification[]>(() => {
    const allNotifications: Omit<Notification, 'isRead'>[] = [];

    // Low stock notifications
    ingredients.forEach(ing => {
        if (ing.stockLevel <= ing.reorderPoint) {
            allNotifications.push({
                id: `lowstock-${ing.id}`,
                type: 'low_stock',
                message: `Stok untuk ${ing.name} menipis (${ing.stockLevel} ${ing.unit}). Segera lakukan pemesanan ulang.`,
                timestamp: new Date().toISOString(),
                relatedView: 'inventory',
                relatedViewProps: { filter: 'low_stock' },
            });
        }
    });

    // Margin alerts notifications
    marginAlerts.forEach((alert, index) => {
        allNotifications.push({
            id: `margin-${alert.ingredientName}-${index}`,
            type: 'margin_alert',
            message: `Harga ${alert.ingredientName} naik ${alert.priceIncreasePercent}%, mempengaruhi margin ${alert.affectedMenus.join(', ')}.`,
            timestamp: new Date().toISOString(),
            relatedView: 'dashboard'
        });
    });

    return allNotifications.map(n => ({...n, isRead: readNotifications.includes(n.id) })).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [ingredients, marginAlerts, readNotifications]);

  const markNotificationsAsRead = useCallback((ids: string[]) => {
      setReadNotifications(prev => [...new Set([...prev, ...ids])]);
  }, []);

  return {
    ...store,
    ingredients: ingredientsWithWasteCost,
    menuItems,
    menuItemsData,
    salesHistory,
    operationalCosts,
    wasteHistory,
    suppliers,
    supplierPrices,
    pendingOrders,
    activeCampaign,
    outlets,
    user,
    currentOutletId,
    getMenuItemById,
    dashboardStats,
    chartData,
    comparisonChartData,
    inventoryOverviewStats,
    marginAlerts,
    detailedPerformanceStats,
    wasteSummary,
    profitLossStats,
    campaignPerformance,
    notifications,
    markNotificationsAsRead,
    dateRange,
    setDateRange,
    isComparing,
    toggleComparison,
  };
};

const calculateProfitLoss = ( periodDays: number, salesHistory: SalesHistoryRecord[], menuItems: MenuItem[], operationalCosts: OperationalCost[], wasteHistory: WasteRecord[]): ProfitLossStats => {
    const menuItemsMap = new Map(menuItems.map(item => [item.id, item]));
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodDays);
    const relevantSales = salesHistory.filter(r => new Date(r.date) >= cutoffDate);
    const relevantWaste = wasteHistory.filter(r => new Date(r.date) >= cutoffDate);
    let totalRevenue = 0;
    let totalCogs = 0;
    relevantSales.forEach(sale => {
        const menuItem = menuItemsMap.get(sale.menuItemId);
        if (menuItem) {
            totalRevenue += sale.totalRevenue;
            totalCogs += menuItem.cogs * sale.quantitySold;
        }
    });
    const totalOperationalCost = operationalCosts.reduce((sum, cost) => {
        const dailyCost = cost.interval === 'monthly' ? cost.amount / 30 : cost.amount;
        return sum + (dailyCost * periodDays);
    }, 0);
    const totalWasteCost = relevantWaste.reduce((sum, record) => sum + record.cost, 0);
    const grossProfit = totalRevenue - totalCogs;
    const netProfit = grossProfit - totalOperationalCost - totalWasteCost;
    const grossProfitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const netProfitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    return { periodDays, totalRevenue, totalCogs, grossProfit, totalOperationalCost, totalWasteCost, netProfit, grossProfitMargin, netProfitMargin };
}