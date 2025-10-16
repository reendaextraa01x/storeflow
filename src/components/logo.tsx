import Link from 'next/link';
import { BarChart2 } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2" prefetch={false}>
      <BarChart2 className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold text-primary">StoreFlow</span>
    </Link>
  );
}
