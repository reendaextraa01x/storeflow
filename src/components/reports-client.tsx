'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Line, LineChart } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from './ui/skeleton';
import { useProducts } from '@/context/products-context';

const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000) {
        return `R$${(value / 1000).toFixed(1)}k`;
    }
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export default function ReportsClient() {
    const { products, isLoading } = useProducts();

    const profitData = useMemo(() => {
        if (!products) return [];
        return products.map(p => ({
            name: p.name,
            lucro: (p.salePrice - p.purchasePrice) * p.quantitySold,
        })).filter(p => p.lucro !== 0).sort((a,b) => b.lucro - a.lucro);
    }, [products]);

    const revenueCostData = useMemo(() => {
        if (!products) return [];
        return products.map(p => ({
            name: p.name,
            receita: p.salePrice * p.quantitySold,
            custo: p.purchasePrice * p.quantityBought,
        })).filter(d => d.receita > 0 || d.custo > 0);
    }, [products]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
                 <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-10 w-64 mb-2" />
                        <Skeleton className="h-6 w-96" />
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    <Card><CardHeader><Skeleton className="h-6 w-48 mb-2"/><Skeleton className="h-4 w-64"/></CardHeader><CardContent><Skeleton className="h-72 w-full"/></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-48 mb-2"/><Skeleton className="h-4 w-64"/></CardHeader><CardContent><Skeleton className="h-72 w-full"/></CardContent></Card>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
                        Relatórios da Loja
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Visualize o desempenho dos seus produtos.
                    </p>
                </div>
            </div>

            {products && products.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                    <CardTitle className="font-headline text-2xl mb-2">Sem dados para exibir</CardTitle>
                    <CardDescription>Adicione produtos e registre vendas para ver os relatórios.</CardDescription>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Lucro por Produto</CardTitle>
                            <CardDescription>Lucro líquido total gerado por cada produto vendido.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={profitData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'hsl(var(--accent) / 0.3)' }}
                                        content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))}/>}
                                    />
                                    <Bar dataKey="lucro" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Receita vs. Custo por Produto</CardTitle>
                            <CardDescription>Comparativo entre receita gerada e custo de aquisição.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueCostData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} tickLine={false} axisLine={false}/>
                                    <Tooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))}/>} />
                                    <Legend />
                                    <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={2} />
                                    <Line type="monotone" dataKey="custo" stroke="hsl(var(--destructive))" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
