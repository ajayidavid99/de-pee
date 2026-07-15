// src/app/(public)/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import { ArrowLeft, Shield, CheckCircle2, FileText, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/features/products/server/actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Extracts a standard UUID from any incoming route param.
 * Handles: "prod_2ccef732-2701-49c9-bd31-683c10f49757" -> "2ccef732-2701-49c9-bd31-683c10f49757"
 * Also gracefully accepts standard un-prefixed IDs.
 */
function cleanProductId(rawId: string): string {
  if (!rawId) return '';
  return rawId.startsWith('prod_') ? rawId.replace('prod_', '') : rawId;
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { id } = await params;
    const targetId = cleanProductId(id);
    
    const products = await getProducts();
    const product = products.find(
      (p) => String(p.id) === targetId || String(p.id) === id
    );
    
    if (!product) {
      return {
        title: 'Product Not Found | De-Pee Medical',
      };
    }
    
    return {
      title: `${product.name} | De-Pee Medical Catalog`,
      description: product.description,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Medical Catalog | De-Pee Medical',
    };
  }
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const targetId = cleanProductId(id);
  
  // Fetch real-time records from Neon database
  const products = await getProducts();
  const product = products.find(
    (p) => String(p.id) === targetId || String(p.id) === id
  );

  // Instead of crashing, gracefully drop to 404
  if (!product) {
    notFound();
  }

  return (
    <div className="w-full bg-background pt-[var(--app-header-height)] pb-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-6 py-8">
        
        <div className="mb-6">
          <Link href="/products" passHref>
            <Button variant="ghost" size="sm" className="text-xs gap-1.5 pl-0 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Product Portfolio
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
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

            {product.specification && (
              <div className="bg-muted/40 rounded-xl p-4 border border-border/60 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Technical Specifications
                </h3>
                <p className="text-xs font-mono text-foreground bg-background p-3 rounded border border-border/40 whitespace-pre-wrap">
                  {product.specification}
                </p>
              </div>
            )}

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