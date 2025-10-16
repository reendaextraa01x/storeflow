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
  totalGrossProfit: number;
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

  const { totalRevenue, totalCost, totalGrossProfit, totalNetProfit } = useMemo(() => {
    if (!products) return { totalRevenue: 0, totalCost: 0, totalGrossProfit: 0, totalNetProfit: 0 };
    
    const revenue = products.reduce((acc, p) => acc + p.salePrice * p.quantitySold, 0);
    const costOfGoodsSold = products.reduce((acc, p) => acc + p.purchasePrice * p.quantitySold, 0);
    const totalCostOfInventory = products.reduce((acc, p) => acc + p.purchasePrice * p.quantityBought, 0);

    const grossProfit = revenue - costOfGoodsSold;
    const netProfit = revenue - totalCostOfInventory;

    return { totalRevenue: revenue, totalCost: totalCostOfInventory, totalGrossProfit: grossProfit, totalNetProfit: netProfit };
  }, [products]);

  const value = {
    products,
    isLoading: isUserLoading || productsLoading,
    error,
    totalRevenue,
    totalCost,
    totalGrossProfit,
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
