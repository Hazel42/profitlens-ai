
export type View = 'dashboard' | 'inventory' | 'forecasting' | 'sales' | 'menu' | 'operational' | 'waste' | 'profitLoss' | 'performanceAnalysis' | 'suppliers' | 'integrations' | 'profile';

export interface User {
  name: string;
  role: string;
  avatarUrl: string;
}

export enum MarginStatus {
  Safe = 'safe',
  Warning = 'warning',
  Danger = 'danger',
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  price: number;
  previousPrice?: number;
  stockLevel: number;
  reorderPoint: number;
  wasteCostLast30Days?: number;
  outletId: string;
}

export interface RecipeComponent {
  ingredientId: string;
  quantity: number;
}

export interface MenuItem {
  id: string;
  name: string;
  imageUrl: string;
  sellingPrice: number;
  targetMargin: number;
  recipe: RecipeComponent[];
  cogs: number;
  actualMargin: number;
  marginStatus: MarginStatus;
}

export interface SalesData {
  date: string;
  itemsSold: number;
}

export interface SalesHistoryRecord {
  date: string;
  menuItemId: string;
  quantitySold: number;
  totalRevenue: number;
  outletId: string;
}

export interface Forecast {
  summary: string;
  dailyForecasts: {
    day: string;
    predictedSales: number;
  }[];
}

export interface GeneratedMenuItem {
    name: string;
    description: string;
    sellingPrice: number;
    recipe: {
        ingredientName: string;
        quantity: number;
        unit: string;
    }[];
}

export interface ReorderSuggestion {
  summary: string;
  purchaseList: {
    ingredientName: string;
    quantityToOrder: number;
    unit: string;
    estimatedCost: number;
  }[];
  recommendedSupplier?: {
    supplierId: string;
    supplierName: string;
    justification: string;
  };
}

export interface PerformanceItem {
  id: string;
  name: string;
  imageUrl: string;
  metric: number;
}

export interface DetailedPerformanceStats {
  bestSellersByUnit: PerformanceItem[];
  highestRevenueItems: PerformanceItem[];
  mostProfitableItems: PerformanceItem[];
  leastProfitableItems: PerformanceItem[];
}

export interface OperationalCost {
  id: string;
  name: string;
  amount: number;
  interval: 'daily' | 'monthly';
  outletId: string;
}

export enum WasteReason {
  Expired = 'Kedaluwarsa',
  Damaged = 'Rusak',
  KitchenError = 'Kesalahan Dapur',
  Other = 'Lainnya',
}

export interface WasteRecord {
  id: string;
  date: string;
  ingredientId: string;
  quantity: number;
  reason: WasteReason;
  cost: number;
  outletId: string;
}

export interface ProfitLossStats {
  periodDays: number;
  totalRevenue: number;
  totalCogs: number;
  grossProfit: number;
  totalOperationalCost: number;
  totalWasteCost: number;
  netProfit: number;
  grossProfitMargin: number;
  netProfitMargin: number;
}

export interface ItemPairing {
  item1Name: string;
  item2Name: string;
  item1ImageUrl: string;
  item2ImageUrl: string;
  analysis: string;
}

export interface BasketAnalysis {
  summary: string;
  pairings: ItemPairing[];
}

export interface MarketingCampaignSuggestion {
  campaignName: string;
  marketingCopy: string;
  promoMechanic: string;
  justification: string;
  involvedItems: {
    item1Name: string;
    item2Name: string;
  };
}

export interface DynamicPriceSuggestion {
  newSellingPrice: number;
  justification: string;
  projectedMargin: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
}

export interface SupplierPriceListItem {
    id: string;
    supplierId: string;
    ingredientId: string;
    price: number;
}

export interface PurchaseOrderItem {
  ingredientId: string;
  ingredientName: string;
  quantityToOrder: number;
  unit: string;
  price: number;
}

export interface PendingOrder {
  id: string;
  poNumber: string;
  supplier: {
    id: string;
    name: string;
  };
  orderDate: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  outletId: string;
}

export interface ActiveCampaign extends MarketingCampaignSuggestion {
  startDate: string; // ISO date string
}

export interface Outlet {
  id: string;
  name: string;
}

export type MenuEngineeringCategory = 'Star' | 'Cash Cow' | 'Question Mark' | 'Dog';

export interface MenuEngineeringItem {
  id: string;
  name: string;
  imageUrl: string;
  category: MenuEngineeringCategory;
}

export interface MenuEngineeringAnalysis {
  summary: string;
  recommendation: string;
  items: MenuEngineeringItem[];
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'margin_alert';
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedView?: View;
  relatedViewProps?: Record<string, any>;
}

// Tipe untuk Penasihat Pencegahan Buangan
export interface WastePattern {
    patternDescription: string;
    recommendation: string;
    implicatedIngredient: string;
    estimatedCostSaved: number;
}

export interface WastePreventionAdvice {
    summary: string;
    patterns: WastePattern[];
}

// Tipe untuk Analisis Kompetitor
export interface GroundingSource {
    uri: string;
    title: string;
}

export interface CompetitorAnalysis {
    analysisText: string;
    sources: GroundingSource[];
}
