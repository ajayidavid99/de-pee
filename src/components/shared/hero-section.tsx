'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type Locale } from '@/features/site/config';
import type { DBProduct } from '@/features/products/server/actions';
import type { BlogPost } from '@/features/blog/server/actions';
// If needed for mapping types, import your DBCategory type here or use any
import { Activity, ArrowRight, Clock, ShieldAlert, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { Globe, Headphones, ShieldCheck } from 'lucide-react';

interface ValueCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <Card hover className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 p-4 shadow-xs">
      <div>
        <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <h3 className="mb-1 text-sm font-extrabold tracking-tight text-foreground">{title}</h3>
        <p className="text-[11px] leading-snug text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}

interface HeroSectionProps {
  locale: Locale;
  products: DBProduct[];
  categories: any[]; // Explicitly added to fix the IntrinsicAttributes type assignment error
  posts: BlogPost[];
}

export default function HeroSection({ locale, products, categories, posts }: HeroSectionProps) {
  return (
    <div className="w-full bg-background pt-[calc(var(--app-header-height)/2)]">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* LEFT MAIN CONTENT AREA */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-10">
            {/* Retained raw sharp square edges canvas layout */}
            <div className="relative w-full h-[380px] md:h-[460px] bg-slate-900 rounded-none overflow-hidden group border border-border/40">
              <div 
                className="absolute inset-0 bg-cover bg-center rounded-2xl md:rounded-none hero-image-container" 
                style={{ backgroundImage: `url('/hero_img.jpg')` }}
              />
              
              {/* Layout wording and soft transparent background plates preserved exactly */}
              <div className="absolute bottom-6 left-6 right-6 md:left-8 md:bottom-8 z-10 flex flex-col items-start text-left text-white/60 max-w-xl gap-3">
                
                <div className="bg-slate-950/45 backdrop-blur-xs px-4 py-3 rounded-lg border border-white/5 shadow-xs">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-snug text-white">
                    Your Trusted Source for Medical Supplies. Quality and Reliability Guaranteed.
                  </h1>
                </div>

                <div className="bg-slate-950/45 backdrop-blur-xs px-4 py-2.5 rounded-lg border border-white/5 shadow-xs">
                  <p className="text-xs sm:text-sm text-slate-100 font-normal opacity-95 leading-relaxed">
                    Providing healthcare facilities globally with premium clinical-grade consumables, diagnostics, and surgical instrumentation built on compliance.
                  </p>
                </div>

                <div className="mt-2 flex flex-wrap gap-3">
                  <Button asChild variant="primary" size="sm" className="rounded-md font-semibold px-5 bg-white text-slate-900 hover:bg-slate-100 text-xs shadow-xs">
                    <Link href="/products">View Products</Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="sm" className="rounded-md font-semibold px-5 bg-transparent border-white text-white hover:bg-white/10 text-xs shadow-xs">
                    <Link href="/contact">Inquire Now</Link>
                  </Button>
                </div>

              </div>
            </div>

            {/* Our Value Proposition */}
            <div className="w-full flex flex-col gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                Why Partner With Us
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ValueCard 
                  icon={ShieldCheck} 
                  title="Our Commitment" 
                  description="Certified, clinical-grade medical equipment compliant with strict international health standards." 
                />
                <ValueCard 
                  icon={Globe} 
                  title="Global Sourcing" 
                  description="Direct partnerships with top global manufacturers for dependable inventory and competitive pricing." 
                />
                <ValueCard 
                  icon={Headphones} 
                  title="Expert Support" 
                  description="Dedicated technical advice and rapid response quote processing tailored for healthcare facilities." 
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR PANEL - FULLY DYNAMIC */}
          <aside className="hidden lg:flex lg:col-span-1 flex-col gap-8 lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)]">
            <div className="space-y-4">
              <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border pb-2">Latest News</h2>
              <div className="space-y-4">
                {posts.slice(0, 2).map((post, index) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`} 
                    className={`block space-y-1 group cursor-pointer ${index > 0 ? 'border-t border-border/50 pt-3' : ''}`}
                  >
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.published_at || post.read_time || 'Recent'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border pb-2">Featured Products</h2>
              <div className="flex flex-col gap-3">
                {products.slice(0, 3).map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/products/${product.id}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border/40 transition duration-200 cursor-pointer group"
                  >
                    <div className="relative h-12 w-12 rounded-lg bg-muted border border-border/60 shrink-0 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Stethoscope className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {product.category_name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}