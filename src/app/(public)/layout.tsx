// src/app/(public)/layout.tsx
import { BackgroundGradient } from '@/components/shared/background-gradient';
import Header from '@/features/navigation/header';
import { FloatingQuoteBasket } from '@/components/shared/floating-quote-basket';
import type { ReactNode } from 'react';

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <BackgroundGradient />
      <Header />
      {/* Removed the automatic top padding here so the hero can touch the header */}
      <main
        id="main-content"
        className="relative z-10 flex-1"
      >
        {children}
      </main>

      {/* Floating Quote Basket and Support available across all public routes */}
      <FloatingQuoteBasket />
    </div>
  );
};

export default PublicLayout;