// src/app/(public)/page.tsx
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
import { getProducts, getCategories } from '@/features/products/server/actions';
import { getBlogPosts } from '@/features/blog/server/actions';

export const dynamic = 'force-dynamic';

const HomePage = async () => {
  const locale = await getLocale();

  // Query actual live database assets in parallel
  const [products, categories, posts] = await Promise.all([
    getProducts(),
    getCategories(),
    getBlogPosts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Block Frame - Now receiving database items */}
      <HeroSection 
        locale={locale as Locale} 
        products={products} 
        categories={categories}
        posts={posts}
      />
      
      {/* 2. New Arrivals Grid Block - Powered by live database items */}
      <NewArrivals products={products.slice(0, 4)} />
      
      {/* 3. Mobile responsive slides */}
      <MobileFeaturedProducts products={products.slice(0, 6)} />
      
      {/* 4. Brand Value Statement Segment */}
      <WhyChooseUs />
      
      {/* 5. Mobile/Tablet News - Powered by your actual DB posts */}
      <MobileLatestNews posts={posts.slice(0, 3)} />
      
      <div className="flex-1" />
      
      {/* 6. Footer Layout */}
      <CompanyFooter />
    </div>
  );
};

export default HomePage;