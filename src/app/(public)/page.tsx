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

  // 1. Filter products based on admin toggles
  const featuredProducts = products.filter((p) => p.is_featured);
  const hotDeals = products.filter((p) => p.is_hot_deal);
  const premiumAdditions = products.filter((p) => p.is_premium);

  // 2. Fallbacks: use sliced defaults if no items are flagged yet
  const heroProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);
  const newArrivalList = premiumAdditions.length > 0 ? premiumAdditions : products.slice(0, 4);
  const hotDealList = hotDeals.length > 0 ? hotDeals : products.slice(4, 10);
  const mobileFeaturedList = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Block */}
      <HeroSection 
        locale={locale as Locale} 
        products={heroProducts} 
        categories={categories}
        posts={posts}
      />
      
      {/* 2. Product Categories Grid */}
      <ProductCategories categories={categories} />

      {/* 3. Premium Additions / New Arrivals */}
      <NewArrivals products={newArrivalList} />

      {/* 4. Hot Procurement Deals Section */}
      <HotDeals products={hotDealList} />
      
      {/* 5. Fast-Moving Consumables Slider (Mobile) */}
      <MobileFeaturedProducts products={mobileFeaturedList} />
      
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