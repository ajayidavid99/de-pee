//src/app/(public)/products/page.tsx
import ProductCatalog from '@/components/shared/product-catalog';
import { getProducts, getCategories } from '@/features/products/server/actions';

export const metadata = {
  title: 'Product Categories | De-Pee Medical',
  description: 'Request item quotations across our core diagnostic tools, stainless steel surgical kits, and facility protective consumables.',
};

export default async function ProductsPage() {
  // Fire queries in parallel during the server-side render phase
  const [dbProducts, dbCategories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <ProductCatalog 
      initialProducts={dbProducts} 
      initialCategories={dbCategories} 
    />
  );
}