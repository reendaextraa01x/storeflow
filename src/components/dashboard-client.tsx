'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useProducts } from '@/hooks/use-products';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, Package } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isSameDay, isSameMonth } from 'date-fns';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function DashboardClient() {
  const { user, isUserLoading } = useUser();
  const { products, isLoading: productsLoading } = useProducts();
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const productsImage = PlaceHolderImages.find(p => p.id === 'products-card');
  const reportsImage = PlaceHolderImages.find(p => p.id === 'reports-card');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const now = new Date();
    if (filter === 'today') {
        return products.filter(p => p.lastSaleDate && isSameDay(p.lastSaleDate.toDate(), now));
    }
    if (filter === 'month') {
        return products.filter(p => p.lastSaleDate && isSameMonth(p.lastSaleDate.toDate(), now));
    }
    return products;
  }, [products, filter]);

  const { totalRevenue, totalCostOfGoodsSold, totalNetProfit } = useMemo(() => {
    if (!filteredProducts) return { totalRevenue: 0, totalCostOfGoodsSold: 0, totalNetProfit: 0 };
    
    const revenue = filteredProducts.reduce((acc, p) => acc + (p.salePrice || 0) * (p.quantitySold || 0), 0);
    const costOfGoodsSold = filteredProducts.reduce((acc, p) => acc + (p.purchasePrice || 0) * (p.quantitySold || 0), 0);
    const netProfit = revenue - costOfGoodsSold;

    return { totalRevenue: revenue, totalCostOfGoodsSold: costOfGoodsSold, totalNetProfit: netProfit };
  }, [filteredProducts]);

  const { totalInventoryCost, overallBalance, unsoldProducts } = useMemo(() => {
    if (!products) return { totalInventoryCost: 0, overallBalance: 0, unsoldProducts: [] };

    const inventoryCost = products.reduce((acc, p) => acc + (p.purchasePrice || 0) * (p.quantityPurchased || 0), 0);
    const totalRevenueAllTime = products.reduce((acc, p) => acc + (p.salePrice || 0) * (p.quantitySold || 0), 0);
    const balance = totalRevenueAllTime - inventoryCost;
    const notSold = products.filter(p => (p.quantitySold || 0) === 0);

    return { totalInventoryCost: inventoryCost, overallBalance: balance, unsoldProducts: notSold };
  }, [products]);


  if (isUserLoading || !user) {
    return null; // Or a loading spinner
  }

  const isLoading = productsLoading || isUserLoading;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Visão Geral, {user.displayName || user.email?.split('@')[0]}!
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Aqui está um resumo rápido do seu negócio.
      </p>

      <Tabs defaultValue="all" onValueChange={setFilter} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="month">Este Mês</TabsTrigger>
            <TabsTrigger value="all">Desde o início</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-8">
          <CardHeader>
              <CardTitle className="font-headline">Resumo Financeiro por Período</CardTitle>
              <CardDescription>Visão geral das suas finanças com base no período selecionado acima.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isLoading ? (
                  <>
                      <Skeleton className="h-24 w-full"/>
                      <Skeleton className="h-24 w-full"/>
                      <Skeleton className="h-24 w-full"/>
                  </>
              ) : (
                  <>
                      <div className="space-y-1 rounded-lg bg-card p-4 border">
                          <p className="text-sm text-muted-foreground">Faturamento Bruto</p>
                          <p className="text-2xl font-bold text-chart-1">{formatCurrency(totalRevenue)}</p>
                      </div>
                      <div className="space-y-1 rounded-lg bg-card p-4 border">
                          <p className="text-sm text-muted-foreground">Custo dos Produtos Vendidos</p>
                          <p className="text-2xl font-bold text-destructive">{formatCurrency(totalCostOfGoodsSold)}</p>
                      </div>
                      <div className="space-y-1 rounded-lg bg-card p-4 border">
                          <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                          <p className="text-2xl font-bold text-primary">{formatCurrency(totalNetProfit)}</p>
                      </div>
                  </>
              )}
          </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline">Balanço Geral do Negócio</CardTitle>
          <CardDescription>Análise do seu investimento total versus o faturamento total.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <>
              <div className="space-y-1 rounded-lg bg-card p-4 border">
                <p className="text-sm text-muted-foreground">Custo Total do Estoque</p>
                <p className="text-2xl font-bold">{formatCurrency(totalInventoryCost)}</p>
              </div>
              <div className={`space-y-1 rounded-lg p-4 border ${overallBalance < 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                <p className="text-sm text-muted-foreground">Balanço (Faturamento - Custo Estoque)</p>
                <p className={`text-2xl font-bold ${overallBalance < 0 ? 'text-destructive' : 'text-chart-1'}`}>
                  {formatCurrency(overallBalance)}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Link href="/products" className="group">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary">
            {productsImage && (
               <Image
                src={productsImage.imageUrl}
                alt={productsImage.description}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint={productsImage.imageHint}
              />
            )}
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center justify-between">
                Gerenciar Estoque
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardTitle>
              <CardDescription>Adicione, edite e controle seu inventário.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/sales" className="group">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary">
            {reportsImage && (
              <Image
                src={reportsImage.imageUrl}
                alt={reportsImage.description}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
                data-ai-hint={reportsImage.imageHint}
              />
            )}
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center justify-between">
                Analisar Vendas
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardTitle>
              <CardDescription>Analise suas vendas e lucros com gráficos interativos.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Produtos sem Vendas</CardTitle>
            <CardDescription>Itens do seu estoque que ainda não tiveram nenhuma unidade vendida.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <Skeleton className="h-24 w-full" />
            ) : unsoldProducts.length > 0 ? (
                <ul className="space-y-2">
                    {unsoldProducts.map(product => (
                        <li key={product.id} className="flex items-center gap-2 rounded-md border p-3">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{product.name}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 border rounded-md">
                    <p className="font-medium">Tudo certo por aqui!</p>
                    <p className="text-sm text-muted-foreground">Todos os seus produtos já tiveram vendas registradas.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
