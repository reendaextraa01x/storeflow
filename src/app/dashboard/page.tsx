import DashboardClient from '@/components/dashboard-client';
import { Header } from '@/components/header';

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
