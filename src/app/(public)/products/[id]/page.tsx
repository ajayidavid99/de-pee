// src/app/(public)/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { ArrowLeft, Shield, CheckCircle2, FileText, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/features/products/server/actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  
  // Clean the ID (e.g., strip "prod_" prefix if the DB uses plain UUIDs or numbers)
  const cleanId = id.replace(/^prod_/, ''); 
  
  const products = await getProducts();
  const product = products.find((p) => String(p.id) === cleanId || String(p.id) === id);
  
  if (!product) return {};
  
  return {
    title: `${product.name} | De-Pee Medical Catalog`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  // Clean the ID
  const cleanId = id.replace(/^prod_/, '');

  const products = await getProducts();
  
  // Try to match with the raw parameter ID or the stripped ID
  const product = products.find((p) => String(p.id) === cleanId || String(p.id) === id);

  if (!product) {
    // Return a friendly fallback instead of calling notFound() to avoid parallel-route bugs
    return (
      <div className="w-full text-center py-20 bg-background pt-[var(--app-header-height)]">
        <h2 className="text-xl font-bold text-muted-foreground">Product Not Found</h2>
        <p className="text-sm text-muted-foreground/80 mt-1">We couldn't find a product matching ID: {id}</p>
        <Link href="/products" className="text-blue-600 underline text-xs mt-4 inline-block">
          Return to portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-background pt-[var(--app-header-height)] pb-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-6 py-8">
        
        {/* Navigation Action */}
        <div className="mb-6">
          <Link href="/products" passHref>
            <Button variant="ghost" size="sm" className="text-xs gap-1.5 pl-0 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Product Portfolio
            </Button>
          </Link>
        </div>

        {/* Core Description Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left: Product Image Block */}
          <div className="w-full h-72 sm:h-96 bg-muted rounded-2xl overflow-hidden border border-border/80 shadow-xs">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>

          {/* Right: Technical Details Panel */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-2 py-1 rounded-sm inline-block">
                {product.category_name} Inventory Item
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="border-t border-b border-border/60 py-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ClipboardList className="h-3.5 w-3.5" /> Core Description
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications Container */}
            <div className="bg-muted/40 rounded-xl p-4 border border-border/60 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Technical Specifications
              </h3>
              <p className="text-xs font-mono text-foreground bg-background p-3 rounded border border-border/40">
                {product.specification}
              </p>
            </div>

            {/* Quality Standards & Trust Elements */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Quality Assurance Metrics
              </h4>
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Certified surgical and healthcare infrastructure compliance benchmarks.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Full technical calibration and tracking verification prior to deployment.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Full regional logistics fulfillment coordination out of Lagos or Ife hubs.
                </li>
              </ul>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}