import { Header } from "@/components/header";
import SalesClient from "@/components/sales-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendas | StoreFlow',
};

export default function SalesPage() {
    return (
        <>
            <Header />
            <main>
                <SalesClient />
            </main>
        </>
    )
}
