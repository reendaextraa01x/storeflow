import type { Metadata } from 'next';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { ProductsProvider } from '@/context/products-context';

export const metadata: Metadata = {
  title: 'StoreFlow',
  description: 'Painel de Controle da Loja',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <ProductsProvider>
            {children}
          </ProductsProvider>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
