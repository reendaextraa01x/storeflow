'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/types';

interface UseProductsResult {
  products: Product[] | null;
  isLoading: boolean;
  error: Error | null;
}

export const useProducts = (): UseProductsResult => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'products');
  }, [firestore, user]);

  const { data: products, isLoading: productsLoading, error } = useCollection<Product>(productsQuery);

  return {
    products,
    isLoading: isUserLoading || productsLoading,
    error,
  };
};
