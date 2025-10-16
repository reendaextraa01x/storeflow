'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MoreHorizontal, PlusCircle, FileDown, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, updateDoc, deleteDoc, doc, collection, serverTimestamp } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { useProducts } from '@/context/products-context';

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  quantityPurchased: z.coerce.number().min(0, 'Deve ser positivo.'),
  purchasePrice: z.coerce.number().min(0, 'Deve ser positivo.'),
  salePrice: z.coerce.number().min(0, 'Deve ser positivo.'),
  quantitySold: z.coerce.number().min(0, 'Deve ser positivo.'),
  lastSaleDate: z.date().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function ProductsClient() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  
  const { products, isLoading } = useProducts();
  const loading = isLoading;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      quantityPurchased: 0,
      purchasePrice: 0,
      salePrice: 0,
      quantitySold: 0,
    },
  });

  const handleOpenDialog = (product: Product | null = null) => {
    setEditingProduct(product);
    if (product) {
      form.reset({
        name: product.name,
        quantityPurchased: product.quantityPurchased,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        quantitySold: product.quantitySold,
        lastSaleDate: product.lastSaleDate?.toDate()
      });
    } else {
      form.reset({
        name: '',
        quantityPurchased: 0,
        purchasePrice: 0,
        salePrice: 0,
        quantitySold: 0,
        lastSaleDate: new Date(),
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user) return;

    try {
      const productData = {
        ...data,
        userId: user.uid,
        lastSaleDate: data.lastSaleDate || new Date(), // Fallback to current date
      };

      if (editingProduct) {
        const productRef = doc(firestore, 'users', user.uid, 'products', editingProduct.id);
        await updateDoc(productRef, productData);
        toast({ title: 'Produto atualizado com sucesso!' });
      } else {
        await addDoc(collection(firestore, 'users', user.uid, 'products'), productData);
        toast({ title: 'Produto adicionado com sucesso!' });
      }
      setDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product: ', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o produto. Tente novamente."
      });
    }
  };

  const handleDelete = async (productId: string) => {
    if(!user) return;
    try {
        await deleteDoc(doc(firestore, 'users', user.uid, 'products', productId));
        toast({ title: 'Produto excluído com sucesso!' });
    } catch (error) {
        console.error("Error deleting product: ", error);
        toast({
            variant: "destructive",
            title: "Erro ao excluir",
            description: "Não foi possível excluir o produto. Tente novamente."
        });
    }
  }

  const exportToCSV = () => {
    if (!products) return;
    const headers = ['Nome', 'Qtd. Comprada', 'Valor Compra (Unit)', 'Valor Venda (Unit)', 'Qtd. Vendida', 'Estoque Atual' ,'Lucro Individual', 'Lucro Total'];
    const csvRows = [headers.join(',')];

    for (const product of products) {
        const individualProfit = (product.salePrice || 0) - (product.purchasePrice || 0);
        const totalProfit = individualProfit * (product.quantitySold || 0);
        const currentStock = (product.quantityPurchased || 0) - (product.quantitySold || 0);
        const values = [
            `"${product.name}"`,
            product.quantityPurchased || 0,
            product.purchasePrice || 0,
            product.salePrice || 0,
            product.quantitySold || 0,
            currentStock,
            individualProfit.toFixed(2),
            totalProfit.toFixed(2),
        ].join(',');
        csvRows.push(values);
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'estoque.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  if (!user) return null;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
            Gestão de Estoque
          </h1>
          <p className="text-lg text-muted-foreground">
            Gerencie seu inventário de forma fácil e rápida.
          </p>
        </div>
        <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="font-headline">
                    {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct
                      ? 'Atualize as informações do seu produto.'
                      : 'Preencha os detalhes do novo produto.'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Nome do produto</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="quantityPurchased" render={({ field }) => (
                            <FormItem><FormLabel>Qtd. comprada</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="purchasePrice" render={({ field }) => (
                            <FormItem><FormLabel>Valor de compra</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="quantitySold" render={({ field }) => (
                            <FormItem><FormLabel>Qtd. vendida</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="salePrice" render={({ field }) => (
                            <FormItem><FormLabel>Valor de venda</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                  </form>
                </Form>
                <DialogFooter>
                  <Button type="submit" form="product-form" className="w-full sm:w-auto">
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do produto</TableHead>
                <TableHead className="text-right">Qtd. comprada</TableHead>
                <TableHead className="text-right">Valor de compra</TableHead>
                <TableHead className="text-right">Qtd. vendida</TableHead>
                <TableHead className="text-right">Estoque Atual</TableHead>
                <TableHead className="text-right">Valor de venda</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 Array.from({length: 3}).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24 float-right" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24 float-right" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24 float-right" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24 float-right" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24 float-right" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-8 float-right" /></TableCell>
                    </TableRow>
                 ))
              ) : products && products.length > 0 ? (
                products.map((product) => {
                  const currentStock = (product.quantityPurchased || 0) - (product.quantitySold || 0);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.quantityPurchased || 0}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.purchasePrice || 0)}</TableCell>
                      <TableCell className="text-right">{product.quantitySold || 0}</TableCell>
                      <TableCell className="text-right font-semibold">{currentStock}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.salePrice || 0)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Abrir menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenDialog(product)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Editar</span>
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start p-2 h-8 font-normal text-destructive focus:text-destructive focus:bg-destructive/10">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Excluir</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Essa ação não pode ser desfeita. Isso excluirá permanentemente o produto.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(product.id)}>Continuar</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum produto encontrado. Comece adicionando um!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
