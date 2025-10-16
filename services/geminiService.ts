
import { supabase } from './supabaseClient';
import type {
  MenuItem,
  Ingredient,
  SalesHistoryRecord,
  GeneratedMenuItem,
  Forecast,
  ReorderSuggestion,
  DynamicPriceSuggestion,
  ProfitLossStats,
  BasketAnalysis,
  MarketingCampaignSuggestion,
  OperationalCost,
  WasteRecord,
  Supplier,
  SupplierPriceListItem,
  MenuEngineeringAnalysis,
  WastePreventionAdvice,
  CompetitorAnalysis,
} from '../types';

// --- Konfigurasi dan Helper --- //

const GEMINI_PROXY_FUNCTION_NAME = 'gemini-api-proxy';

const handleApiError = (error: any, functionName: string): never => {
  console.error(`Error in ${functionName} calling Supabase proxy:`, error);
  const message = error?.message || 'An unknown error occurred.';
  if (message.includes('Failed to fetch')) {
    throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda atau status Supabase.');
  }
  if (message.includes('GEMINI_API_KEY')) {
      throw new Error('Kunci API Gemini belum diatur di Supabase. Silakan atur di bagian Edge Functions > Secrets.');
  }
  throw new Error(`Gagal memproses permintaan AI: ${message}`);
};

/**
 * Fungsi utama untuk memanggil Supabase Edge Function sebagai proxy ke Gemini.
 * @param body - Payload yang akan dikirim ke Gemini API.
 * @returns {Promise<any>} - Respons dari API.
 */
const invokeGeminiProxy = async (body: Record<string, any>): Promise<any> => {
  const { data, error } = await supabase.functions.invoke(GEMINI_PROXY_FUNCTION_NAME, {
    body,
  });

  if (error) {
    throw error; // Akan ditangkap oleh handleApiError
  }
  
  // Jika proxy function mengembalikan error dari pihak Gemini
  if (data?.error) {
      throw new Error(`AI Error: ${data.error}`);
  }

  return data;
};

// Helper format data (tidak berubah)
const formatIngredients = (ingredients: Ingredient[]) =>
  ingredients.map(i => `${i.name} (ID: ${i.id}, Stok: ${i.stockLevel} ${i.unit}, Harga: ${i.price}/${i.unit})`).join('\n');

const formatMenuItems = (menuItems: MenuItem[]) =>
  menuItems.map(m => `${m.name} (ID: ${m.id}, Harga Jual: ${m.sellingPrice}, HPP: ${m.cogs}, Margin: ${m.actualMargin.toFixed(1)}%)`).join('\n');

const formatSalesHistory = (salesHistory: SalesHistoryRecord[], menuItems: MenuItem[], days = 7) => {
    const menuItemsMap = new Map(menuItems.map(item => [item.id, item.name]));
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    const dateLimitString = dateLimit.toISOString().split('T')[0];
    const recentHistory = salesHistory.filter(s => s.date >= dateLimitString);
    if (recentHistory.length === 0) return "Tidak ada data penjualan dalam periode ini.";
    return recentHistory.map(s => `${s.date}: ${menuItemsMap.get(s.menuItemId) || s.menuItemId} terjual ${s.quantitySold} unit`).join('\n');
};

const formatWasteHistory = (wasteHistory: WasteRecord[], ingredients: Ingredient[], days = 14) => {
    const ingredientsMap = new Map(ingredients.map(i => [i.id, i.name]));
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    const dateLimitString = dateLimit.toISOString().split('T')[0];
    const recentWaste = wasteHistory.filter(w => w.date >= dateLimitString);
    if (recentWaste.length === 0) return "Tidak ada data buangan dalam periode ini.";
    return recentWaste.map(w => `${w.date}: ${ingredientsMap.get(w.ingredientId) || 'Unknown Ingredient'} terbuang ${w.quantity} unit karena ${w.reason} (kerugian ${w.cost})`).join('\n');
};

const formatForecasts = (forecasts: { itemName: string; forecast: Forecast }[]): string => {
    if (forecasts.length === 0) return "Tidak ada proyeksi penjualan yang relevan.";
    return forecasts.map(f => `Proyeksi untuk \"${f.itemName}\":\n${f.forecast.dailyForecasts.map(d => `- ${d.day}: ${d.predictedSales} unit`).join('\n')}`).join('\n\n');
};

const formatSuppliersWithPrices = (suppliers: Supplier[], supplierPrices: SupplierPriceListItem[], ingredients: Ingredient[]): string => {
    if (suppliers.length === 0) return "Tidak ada data supplier.";
    const ingredientsMap = new Map(ingredients.map(i => [i.id, i.name]));
    return suppliers.map(s => {
        const prices = supplierPrices.filter(sp => sp.supplierId === s.id).map(sp => {
            const ingredientName = ingredientsMap.get(sp.ingredientId);
            return ingredientName ? `- ${ingredientName}: ${sp.price}` : null;
        }).filter(Boolean).join('\n');
        return `Supplier: ${s.name} (ID: ${s.id})\n${prices || 'Tidak ada daftar harga.'}`;
    }).join('\n\n');
};


// --- Fungsi AI yang Telah Direfactor --- //

export const getMarginFixRecommendation = async (menuItem: MenuItem): Promise<string> => {
    try {
        const prompt = `
          Menu item saya \"${menuItem.name}\" sedang mengalami masalah margin.
          - Harga Jual: ${menuItem.sellingPrice}
          - Modal (HPP): ${menuItem.cogs}
          - Margin Aktual: ${menuItem.actualMargin.toFixed(1)}%
          - Target Margin: ${menuItem.targetMargin}%
          
          Berikan rekomendasi konkret dalam format markdown untuk memperbaiki margin. Fokus pada:
          1.  Analisis penyebab masalah (misalnya kenaikan harga bahan baku).
          2.  Saran penyesuaian harga jual dengan justifikasi.
          3.  Ide efisiensi resep jika memungkinkan.
          4.  Saran bundling atau promosi untuk meningkatkan penjualan.
        `;
        
        const response = await invokeGeminiProxy({
            model: 'gemini-1.5-flash',
            contents: prompt
        });
        
        return response.text;
    } catch (error) {
        handleApiError(error, 'getMarginFixRecommendation');
    }
};

export const getSalesForecast = async (menuItem: MenuItem, salesHistory: SalesHistoryRecord[]): Promise<Forecast> => {
    try {
        const relevantSales = salesHistory.filter(s => s.menuItemId === menuItem.id);
        const salesHistoryString = relevantSales.map(s => `${s.date}: ${s.quantitySold} unit`).join('\n');
        
        const prompt = `
        Analyze the following sales data for the menu item \"${menuItem.name}\" and provide a 7-day sales forecast. Consider potential weekly patterns (weekends vs weekdays).

        Historical Sales Data (last 90 days):
        ${salesHistoryString}

        Today is ${new Date().toLocaleDateString('id-ID', { weekday: 'long' })}. Provide a forecast for the next 7 days (e.g., Selasa, Rabu, etc.), starting from tomorrow.

        Provide the output in a structured JSON format. The JSON should have two keys: \"summary\" and \"dailyForecasts\".
        - \"summary\": A brief, insightful text summary of the sales trend and forecast, mentioning any seasonal or weekly patterns observed.
        - \"dailyForecasts\": An array of objects, where each object has \"day\" (e.g., \"Selasa\") and \"predictedSales\" (a number).
        `;

        const response = await invokeGeminiProxy({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                response_mime_type: 'application/json',
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        handleApiError(error, 'getSalesForecast');
    }
};


export const createMenuItemWithAi = async (userInput: string, ingredients: Ingredient[]): Promise<GeneratedMenuItem> => {
    try {
        const ingredientsString = ingredients.map(i => `${i.name} (${i.unit})`).join(', ');
        const prompt = `
          You are a creative chef for a modern coffee shop. Based on the user's idea and the available ingredients, create a new menu item.

          User Idea: \"${userInput}\"

          Available Ingredients: ${ingredientsString}

          Provide a response in a structured JSON format with the following keys: \"name\", \"description\", \"sellingPrice\", and \"recipe\".
          - \"name\": A creative and appealing name for the new menu item.
          - \"description\": A short, enticing description for the menu.
          - \"sellingPrice\": A recommended selling price (integer) in IDR, considering typical coffee shop pricing.
          - \"recipe\": An array of objects, where each object has \"ingredientName\", \"quantity\" (number), and \"unit\" (e.g., 'gram', 'ml'). The ingredient names must be chosen from the available ingredients list.
        `;
        
        const response = await invokeGeminiProxy({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                response_mime_type: 'application/json',
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        handleApiError(error, 'createMenuItemWithAi');
    }
};

export const generateMenuImage = async (menuName: string, description: string): Promise<string> => {
    try {
        const response = await invokeGeminiProxy({
            model: 'imagen-8b', // Menggunakan model spesifik untuk gambar
            prompt: `Food photography, ${menuName}, ${description}, coffee shop ambiance, delicious, high detail, professional quality`,
            isImageRequest: true // Flag untuk ditangani oleh Edge Function
        });

        // Asumsi Edge Function mengembalikan base64 string secara langsung
        return `data:image/png;base64,${response.base64Image}`;
    } catch (error) {
        handleApiError(error, 'generateMenuImage');
    }
};

// --- [Fungsi-fungsi lain akan mengikuti pola yang sama] --- //

// Semua fungsi lain seperti getSalesAnalysis, getReorderSuggestion, dll.
// harus diubah untuk menggunakan invokeGeminiProxy seperti contoh di atas.
// Kode di bawah ini adalah placeholder dan perlu diimplementasikan sepenuhnya.

export const getSalesAnalysis = async (
    salesData: { menuItem: MenuItem; sold: number }[],
    originalIngredients: Ingredient[],
    updatedIngredients: Ingredient[]
): Promise<string> => {
    // TODO: Implement using invokeGeminiProxy
    console.warn("getSalesAnalysis is not fully integrated with Supabase yet.");
    return "Analysis functionality is being updated.";
}

export const getReorderSuggestion = async (
    lowStockIngredients: Ingredient[], 
    allIngredients: Ingredient[], 
    salesHistory: SalesHistoryRecord[], 
    menuItems: MenuItem[], 
    wasteHistory: WasteRecord[],
    forecasts: { itemName: string; forecast: Forecast }[],
    suppliers: Supplier[],
    supplierPrices: SupplierPriceListItem[]
): Promise<ReorderSuggestion> => {
    // TODO: Implement using invokeGeminiProxy
    console.warn("getReorderSuggestion is not fully integrated with Supabase yet.");
    // Mengembalikan data dummy agar tidak error
    return {
        summary: "Fungsi sedang diperbarui untuk integrasi Supabase.",
        purchaseList: [],
        recommendedSupplier: undefined
    }
}

export const getDynamicPriceSuggestion = async (menuItem: MenuItem): Promise<DynamicPriceSuggestion> => {
    // TODO: Implement using invokeGeminiProxy
    console.warn("getDynamicPriceSuggestion is not fully integrated with Supabase yet.");
    return {
        newSellingPrice: menuItem.sellingPrice,
        justification: "Fungsi sedang diperbarui.",
        projectedMargin: menuItem.actualMargin
    }
}

// ... (Implementasi fungsi lainnya dengan pola yang sama)


// --- Fungsi Chat yang Telah Direfactor --- //

let chatSystemInstruction: any = null;

export const startAiChat = async (menuItems: MenuItem[], ingredients: Ingredient[], salesHistory: SalesHistoryRecord[], operationalCosts: OperationalCost[]) => {
    try {
        const context = `
            You are ProfitLens AI, an expert business analyst and guide for a coffee shop owner using this application.
            Your main role is to help the user understand their business data and how to use the ProfitLens AI application's features.

            **Application Features Guide:**
            If the user asks about a feature, explain it clearly based on this guide.

            *   **Dashboard:** The main control center showing a real-time overview of business health (Revenue, Profit, Margin). It includes a sales chart, margin alerts, and AI-powered growth opportunities.
            *   **Laba & Rugi (Profit & Loss):** Automatically calculates the profit and loss statement by breaking down all costs (COGS, operational, waste) to show the net profit. It also offers AI financial analysis.
            *   **Analisis Performa (Performance Analysis):** Provides deep strategic insights. Includes AI Menu Engineering (Stars, Dogs, etc.), Basket Analysis (what items sell together), and Market Intelligence (competitor pricing research via Google Search).
            *   **Inventaris (Inventory):** For real-time raw material tracking. It shows low-stock items and provides AI-driven reorder suggestions to prevent stockouts. Also manages Purchase Orders.
            *   **Supplier:** A directory to manage supplier contacts and their price lists for different ingredients.
            *   **Buangan (Waste):** A feature to log discarded ingredients. The AI analyzes these logs to find patterns and recommend ways to reduce waste and save money.
            *   **Menu:** The place to manage all menu items, including recipes, prices, and real-time profit margins. Includes an AI feature to generate new, creative menu ideas.
            *   **Operasional (Operational):** For tracking all non-ingredient business costs like salaries, rent, and utilities, which is essential for accurate P&L reports.
            *   **Proyeksi (Forecasting):** Uses AI to predict future sales for any menu item, helping with inventory and staff planning.
            *   **Rekap Penjualan (Sales Summary):** Where daily sales figures are entered. This action automatically updates inventory and sales history, which fuels all AI analyses.
            *   **Profil & Pengaturan (Profile & Settings):** Used for managing the user profile and business outlets (adding, editing, or removing them).

            **Current Business Data Context:**
            Below is the current data for the user's selected outlet. Use this to answer specific questions about their business.
            
            Menu:
            ${formatMenuItems(menuItems)}

            Inventory:
            ${formatIngredients(ingredients)}
            
            Operational Costs:
            ${operationalCosts.map(c => `- ${c.name}: ${c.amount} per ${c.interval}`).join('\n')}

            Recent Sales (last 7 days):
            ${formatSalesHistory(salesHistory, menuItems, 7)}
        `;

        chatSystemInstruction = { role: "system", parts: [{ text: context }] };
        // Tidak perlu lagi membuat instance chat di client

    } catch (error) {
        handleApiError(error, 'startAiChat');
    }
};

export const sendMessageToAiChatStream = async function* (history: any[], message: string) {
    if (!chatSystemInstruction) {
        throw new Error("Chat not initialized. Call startAiChat first.");
    }

    const functionUrl = `${supabase.functions.getURL(GEMINI_PROXY_FUNCTION_NAME)}`;

    const contents = [...history, { role: "user", parts: [{ text: message }] }];

    try {
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabase.auth.getSession()?.data.session?.access_token}`
            },
            body: JSON.stringify({
                model: 'gemini-1.5-flash',
                contents: [chatSystemInstruction, ...contents],
                streaming: true, // Memberi tahu proxy untuk streaming
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Proses Server-Sent Events (SSE)
            const lines = chunk.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonString = line.substring(6);
                    if (jsonString) {
                        try {
                            const parsed = JSON.parse(jsonString);
                            yield parsed; // yield object { text: '...' }
                        } catch (e) {
                            console.error("Failed to parse stream chunk:", jsonString);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error in sendMessageToAiChatStream:", error);
        handleApiError(error, 'sendMessageToAiChatStream');
    }
};

// Note: Functions like getBasketAnalysis, getMarketingCampaignSuggestion, etc., 
// still need to be refactored to use `invokeGeminiProxy`.
// This implementation provides the core structure for the new architecture.

