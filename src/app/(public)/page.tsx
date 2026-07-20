// src/app/(public)/page.tsx
import HeroSection from '@/components/shared/hero-section';
import { ProductCategories } from '@/components/shared/product-categories';
import { HotDeals } from '@/components/shared/hot-deals';
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
      
      {/* 2. Product Categories Grid */}
      <ProductCategories categories={categories} />

      {/* 3. Premium Additions / New Arrivals */}
      <NewArrivals products={products.slice(0, 4)} />

      {/* 4. Hot Procurement Deals Section */}
      <HotDeals products={products.slice(4, 8)} />
      
      {/* 5. Fast-Moving Consumables Slider (Mobile) */}
      <MobileFeaturedProducts products={products.slice(0, 6)} />
      
      {/* 6. Engineered for Clinical & Laboratory Integrity */}
      <WhyChooseUs />
      
      {/* 7. Mobile/Tablet News */}
      <MobileLatestNews posts={posts.slice(0, 3)} />
      
      <div className="flex-1" />
      
      {/* 8. Quote Form & Footer */}
      <CompanyFooter />
    </div>
  );
};

export default HomePage;