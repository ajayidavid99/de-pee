//de-pee/src/app/(public)/layout.tsx
import { BackgroundGradient } from '@/components/shared/background-gradient';
import Header from '@/features/navigation/header';
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
    </div>
  );
};

export default PublicLayout;