// de-pee/src/app/(public)/page.tsx
import HeroSection from '@/components/shared/hero-section';
import { 
  NewArrivals, 
  MobileFeaturedProducts, 
  WhyChooseUs, 
  MobileLatestNews, 
  CompanyFooter 
} from '@/components/shared/home-sections';
import type { Locale } from '@/features/site/config';
import { getLocale } from 'next-intl/server';

const HomePage = async () => {
  const locale = await getLocale();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Block Frame */}
      <HeroSection locale={locale as Locale} />
      
      {/* 2. New Arrivals Grid Block */}
      <NewArrivals />
      
      {/* 3. Mobile/Tablet responsive horizontal sliding cards (Hidden on PC viewport) */}
      <MobileFeaturedProducts />
      
      {/* 4. Brand Value Statement Segment */}
      <WhyChooseUs />
      
      {/* 5. Mobile/Tablet News segment (Hidden on PC viewport) */}
      <MobileLatestNews />
      
      {/* Spacer component keeping push contents dynamic inside flex tree layout */}
      <div className="flex-1" />
      
      {/* 6. Footer Layout featuring the built-in custom Quote request form */}
      <CompanyFooter />
    </div>
  );
};

export default HomePage;