'use client';

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { collection } from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/types';

interface ProductsContextType {
  products: Product[] | null;
  isLoading: boolean;
  error: Error | null;
  totalRevenue: number;
  totalCost: number;
  totalNetProfit: number;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'products');
  }, [firestore, user]);

  const { data: products, isLoading: productsLoading, error } = useCollection<Product>(productsQuery);

  const { totalRevenue, totalCost, totalNetProfit } = useMemo(() => {
    if (!products) return { totalRevenue: 0, totalCost: 0, totalNetProfit: 0 };
    
    // Faturamento Bruto Total: Soma total das vendas (valor de venda * quantidade vendida).
    const revenue = products.reduce((acc, p) => acc + p.salePrice * p.quantitySold, 0);

    // Custo Total do Inventário: Custo total de todos os produtos comprados (valor de compra * quantidade comprada).
    const totalCostOfInventory = products.reduce((acc, p) => acc + p.purchasePrice * p.quantityPurchased, 0);
    
    // Lucro Líquido Total: Soma do lucro individual de cada produto vendido.
    const netProfit = products.reduce((acc, p) => acc + (p.salePrice - p.purchasePrice) * p.quantitySold, 0);

    return { totalRevenue: revenue, totalCost: totalCostOfInventory, totalNetProfit: netProfit };
  }, [products]);

  const value = {
    products,
    isLoading: isUserLoading || productsLoading,
    error,
    totalRevenue,
    totalCost,
    totalNetProfit,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
