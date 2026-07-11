//de-pee/src/app/(public)/products/page.tsx
import ProductCatalog from '@/components/shared/product-catalog';

export const metadata = {
  title: 'Product Categories | De-Pee Medical',
  description: 'Request item quotations across our core diagnostic tools, stainless steel surgical kits, and facility protective consumables.',
};

export default function ProductsPage() {
  return <ProductCatalog />;
}