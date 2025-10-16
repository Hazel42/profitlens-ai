
import type { MenuItem, SalesHistoryRecord, Outlet } from '../types';

// Function to generate more realistic historical sales data for multiple outlets
export const generateSalesHistory = (
    menuItems: Omit<MenuItem, 'cogs' | 'actualMargin' | 'marginStatus'>[],
    days: number,
    outlets: Outlet[]
): SalesHistoryRecord[] => {
    const history: SalesHistoryRecord[] = [];
    const today = new Date();

    const itemPopularity = {
        'menu001': 1.0, // Kopi Susu Gula Aren (most popular)
        'menu002': 0.8, // Caramel Macchiato
        'menu003': 0.6, // Brownies
        'menu004': 0.7, // Pandan Latte
    };

    const outletSalesMultiplier = {
        'out001': 1.0, // Cilandak
        'out002': 0.6, // Kemang
    };

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay(); // Sunday - 0, Saturday - 6

        // Simulate higher sales on weekends
        let dayMultiplier = 1.0;
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday, Saturday
            dayMultiplier = 1.8;
        } else if (dayOfWeek === 5) { // Friday
            dayMultiplier = 1.5;
        }

        outlets.forEach(outlet => {
            const outletMultiplier = (outletSalesMultiplier as any)[outlet.id] || 0.5;
            menuItems.forEach(item => {
                const baseSales = 20;
                const popularity = (itemPopularity as any)[item.id] || 0.5;
                const randomFactor = Math.random() * 0.4 + 0.8; // between 0.8 and 1.2
                
                const quantitySold = Math.round(baseSales * popularity * dayMultiplier * outletMultiplier * randomFactor);
                
                if (quantitySold > 0) {
                     history.push({
                        date: dateString,
                        menuItemId: item.id,
                        quantitySold: quantitySold,
                        totalRevenue: quantitySold * item.sellingPrice,
                        outletId: outlet.id,
                    });
                }
            });
        });
    }

    return history.sort((a, b) => a.date.localeCompare(b.date));
};
