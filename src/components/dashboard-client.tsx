'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function DashboardClient() {
  const { user, isUserLoading } = useUser();
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

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Bem-vindo(a) ao seu Painel, {user.displayName || user.email?.split('@')[0]}!
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Aqui está um resumo rápido do seu negócio.
      </p>

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
                Gerenciar Produtos
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardTitle>
              <CardDescription>Adicione, edite e controle seu inventário.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/reports" className="group">
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
                Visualizar Relatórios
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
