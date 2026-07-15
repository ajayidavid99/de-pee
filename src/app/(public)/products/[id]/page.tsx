// src/app/(public)/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { ArrowLeft, Shield, CheckCircle2, FileText, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/features/products/server/actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Helper to sanitize incoming params by removing any "prod_" prefixes
function cleanProductId(rawId: string): string {
  return rawId.startsWith('prod_') ? rawId.replace('prod_', '') : rawId;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const targetId = cleanProductId(id);
  
  const products = await getProducts();
  const product = products.find((p) => String(p.id) === targetId || String(p.id) === id);
  
  if (!product) return {};
  
  return {
    title: `${product.name} | De-Pee Medical Catalog`,
    description: product.description,
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const targetId = cleanProductId(id);
  
  // Fetch real-time records from Neon database
  const products = await getProducts();
  
  // Clean comparison checking both raw ID and stripped ID
  const product = products.find(
    (p) => String(p.id) === targetId || String(p.id) === id
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full bg-background pt-[var(--app-header-height)] pb-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-6 py-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Image & Overview Section */}
          <div className="md:col-span-5 space-y-4">
            <div className="aspect-square w-full rounded-md border border-border/40 overflow-hidden bg-muted flex items-center justify-center relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <span className="inline-flex items-center rounded bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase tracking-wide">
                {product.category_name || "Medical Catalog Item"}
              </span>
            </div>
          </div>

          {/* Details & Specifications */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{product.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground/90 leading-relaxed">{product.description}</p>
            </div>

            {/* Technical Specifications Block */}
            <div className="space-y-2 border-t border-b border-border/40 py-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Technical Specifications
              </h3>
              <p className="text-xs font-mono text-foreground bg-background p-3 rounded border border-border/40 whitespace-pre-wrap">
                {product.specification || "No custom specifications provided."}
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