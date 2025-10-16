import DashboardClient from '@/components/dashboard-client';
import { Header } from '@/components/header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visão Geral | StoreFlow',
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main>
        <DashboardClient />
      </main>
    </>
  );
}
