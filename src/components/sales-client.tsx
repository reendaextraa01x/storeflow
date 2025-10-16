'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from './ui/skeleton';
import { useProducts } from '@/context/products-context';
import type { Product } from '@/lib/types';

const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000) {
        return `R$${(value / 1000).toFixed(1)}k`;
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const chartConfig: ChartConfig = {
    lucro: {
        label: 'Lucro',
        color: 'hsl(var(--chart-1))',
    },
    receita: {
        label: 'Receita',
        color: 'hsl(var(--chart-1))',
    },
    custo: {
        label: 'Custo',
        color: 'hsl(var(--chart-2))',
    },
};

const availableYears = Array.from(new Set(
    ((): number[] => {
      const currentYear = new Date().getFullYear();
      const years: number[] = [];
      for (let i = 0; i < 5; i++) {
        years.push(currentYear - i);
      }
      return years;
    })()
  )).sort((a, b) => b - a);

const availableMonths = [
    { value: 'all', label: 'Todos os meses' },
    { value: '0', label: 'Janeiro' },
    { value: '1', label: 'Fevereiro' },
    { value: '2', label: 'Março' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Maio' },
    { value: '5', label: 'Junho' },
    { value: '6', label: 'Julho' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Setembro' },
    { value: '9', label: 'Outubro' },
    { value: '10', label: 'Novembro' },
    { value: '11', label: 'Dezembro' },
];

export default function SalesClient() {
    const { products, isLoading, totalRevenue, totalCost, totalNetProfit } = useProducts();
    const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
    const [selectedMonth, setSelectedMonth] = useState<string>('all');

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter((product: Product) => {
            if (!product.lastSaleDate) return false;
            const saleDate = product.lastSaleDate.toDate();
            const yearMatch = saleDate.getFullYear() === parseInt(selectedYear);
            const monthMatch = selectedMonth === 'all' || saleDate.getMonth() === parseInt(selectedMonth);
            return yearMatch && monthMatch;
        });
    }, [products, selectedYear, selectedMonth]);

    const profitData = useMemo(() => {
        if (!filteredProducts) return [];
        return filteredProducts.map(p => ({
            name: p.name,
            lucro: (p.salePrice - p.purchasePrice) * p.quantitySold,
        })).filter(p => p.lucro !== 0).sort((a,b) => b.lucro - a.lucro);
    }, [filteredProducts]);

    const revenueCostData = useMemo(() => {
        if (!filteredProducts) return [];
        return filteredProducts.map(p => ({
            name: p.name,
            receita: p.salePrice * p.quantitySold,
            custo: p.purchasePrice * p.quantityPurchased,
        })).filter(d => d.receita > 0 || d.custo > 0);
    }, [filteredProducts]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
                 <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-10 w-64 mb-2" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                </div>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48 mb-2"/>
                        <Skeleton className="h-4 w-64"/>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Skeleton className="h-24 w-full"/>
                        <Skeleton className="h-24 w-full"/>
                        <Skeleton className="h-24 w-full"/>
                    </CardContent>
                </Card>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    <Card><CardHeader><Skeleton className="h-6 w-48 mb-2"/><Skeleton className="h-4 w-64"/></CardHeader><CardContent><Skeleton className="h-72 w-full"/></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-48 mb-2"/><Skeleton className="h-4 w-64"/></CardHeader><CardContent><Skeleton className="h-72 w-full"/></CardContent></Card>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
                        Relatórios de Vendas
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Visualize o desempenho dos seus produtos.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableMonths.map(month => (
                                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map(year => (
                                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline">Resumo Financeiro</CardTitle>
                    <CardDescription>Visão geral das suas finanças com base nos filtros selecionados.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1 rounded-lg bg-card p-4 border">
                        <p className="text-sm text-muted-foreground">Faturamento Bruto Total</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <div className="space-y-1 rounded-lg bg-card p-4 border">
                        <p className="text-sm text-muted-foreground">Custo Total do Inventário</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(totalCost)}</p>
                    </div>
                    <div className="space-y-1 rounded-lg bg-card p-4 border">
                        <p className="text-sm text-muted-foreground">Lucro Líquido Total</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(totalNetProfit)}</p>
                    </div>
                </CardContent>
            </Card>

            {products && products.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                    <CardTitle className="font-headline text-2xl mb-2">Sem dados para exibir</CardTitle>
                    <CardDescription>Adicione produtos e registre vendas para ver os relatórios.</CardDescription>
                </Card>
            ) : filteredProducts.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                    <CardTitle className="font-headline text-2xl mb-2">Nenhum dado encontrado</CardTitle>
                    <CardDescription>Não há dados de vendas para o período selecionado.</CardDescription>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Lucro por Produto</CardTitle>
                            <CardDescription>Lucro líquido total gerado por cada produto vendido no período.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                                <BarChart accessibilityLayer data={profitData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                                        content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))}/>}
                                    />
                                    <Bar dataKey="lucro" fill="var(--color-lucro)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Receita vs. Custo por Produto</CardTitle>
                            <CardDescription>Comparativo entre receita gerada e custo de aquisição no período.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                                <LineChart accessibilityLayer data={revenueCostData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} tickLine={false} axisLine={false}/>
                                    <Tooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))}/>} />
                                    <Legend />
                                    <Line type="monotone" dataKey="receita" stroke="var(--color-receita)" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="custo" stroke="var(--color-custo)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
