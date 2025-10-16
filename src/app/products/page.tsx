import { Header } from "@/components/header";
import ProductsClient from "@/components/products-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estoque | StoreFlow',
};

export default function ProductsPage() {
    return (
        <>
            <Header />
            <main>
                <ProductsClient />
            </main>
        </>
    )
}
