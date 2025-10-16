'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useProducts } from '@/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function DashboardClient() {
  const { user, isUserLoading } = useUser();
  const { totalRevenue, totalCost, totalNetProfit, isLoading: productsLoading } = useProducts();
  const router = useRouter();
  
  const productsImage = PlaceHolderImages.find(p => p.id === 'products-card');
  const reportsImage = PlaceHolderImages.find(p => p.id === 'reports-card');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

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

      <Card className="mb-8">
          <CardHeader>
              <CardTitle className="font-headline">Resumo Financeiro</CardTitle>
              <CardDescription>Visão geral das suas finanças com base em todas as suas vendas.</CardDescription>
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
                          <p className="text-sm text-muted-foreground">Faturamento Bruto Total</p>
                          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                      </div>
                      <div className="space-y-1 rounded-lg bg-card p-4 border">
                          <p className="text-sm text-muted-foreground">Custo dos Produtos Vendidos</p>
                          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCost)}</p>
                      </div>
                      <div className="space-y-1 rounded-lg bg-card p-4 border">
                          <p className="text-sm text-muted-foreground">Lucro Líquido Total</p>
                          <p className="text-2xl font-bold text-primary">{formatCurrency(totalNetProfit)}</p>
                      </div>
                  </>
              )}
          </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2">
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
    </div>
  );
}
