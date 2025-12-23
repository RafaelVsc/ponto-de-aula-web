import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 pb-24 sm:pb-24">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
