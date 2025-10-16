import { Header } from "@/components/header";
import ReportsClient from "@/components/reports-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Relatórios | StoreFlow',
};

export default function ReportsPage() {
    return (
        <>
            <Header />
            <main>
                <ReportsClient />
            </main>
        </>
    )
}
