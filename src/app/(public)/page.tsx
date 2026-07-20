// src/app/(public)/page.tsx
import HeroSection from '@/components/shared/hero-section';
import { ProductCategories } from '@/components/shared/product-categories';
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

  const [products, categories, posts] = await Promise.all([
    getProducts(),
    getCategories(),
    getBlogPosts(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Block */}
      <HeroSection 
        locale={locale as Locale} 
        products={products} 
        categories={categories}
        posts={posts}
      />
      
      {/* 2. Categories Grid (2x3 on Mobile, 4x2 on Desktop) */}
      <ProductCategories categories={categories} />

      {/* 3. New Arrivals / Premium Additions */}
      <NewArrivals products={products.slice(0, 4)} />
      
      {/* 4. Fast-Moving Procurement Items (Mobile Slider) */}
      <MobileFeaturedProducts products={products.slice(0, 6)} />
      
      {/* 5. Engineered for Clinical & Laboratory Integrity */}
      <WhyChooseUs />
      
      {/* 6. Mobile/Tablet Resources & News */}
      <MobileLatestNews posts={posts.slice(0, 3)} />
      
      <div className="flex-1" />
      
      {/* 7. Quote Form & Footer */}
      <CompanyFooter />
    </div>
  );
};

export default HomePage;