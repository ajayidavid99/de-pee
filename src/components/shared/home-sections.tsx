// src/components/shared/home-sections.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SiteFooter } from '@/components/shared/site-footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Activity, ArrowRight, Building2, Clock, Flame, ShieldCheck, Mail, Phone, MapPin, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { BlogPost } from '@/features/blog/server/actions';
import type { DBProduct } from '@/features/products/schema';

/* ==========================================================================\
   3. NEW ARRIVALS / PREMIUM ADDITIONS (Compact Clickable Card Layout)
   ========================================================================== */
export function NewArrivals({ products }: { products: DBProduct[] }) {
  return (
    <section className="w-full bg-background py-10 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
              Recently Cataloged
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Premium Additions
            </h2>
          </div>
          <Link 
            href="/products" 
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Browse Store <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((item) => {
            const displayImage = item.images?.[0] || item.image || '/placeholder.png';

            return (
              <Card 
                key={item.id} 
                hover 
                className="relative overflow-hidden rounded-xl border border-border/80 bg-card/50 transition-all duration-300 group hover:border-primary/50 flex flex-col justify-between h-44 sm:h-48 p-3"
              >
                {/* Clickable Image + Title Area */}
                <Link href={`/products/${item.id}`} className="group/item block cursor-pointer flex-1 min-w-0">
                  <div className="relative h-20 sm:h-24 w-full rounded-lg bg-muted overflow-hidden border border-border/40 shrink-0">
                    <img 
                      src={displayImage} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300" 
                    />
                  </div>

                  <div className="space-y-0.5 mt-2 min-w-0">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider font-mono block truncate">
                      {item.category_name}
                    </span>
                    <h3 className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors truncate">
                      {item.name}
                    </h3>
                  </div>
                </Link>

                {/* Action Link */}
                <div className="mt-2 pt-2 border-t border-border/40">
                  <Button size="sm" asChild className="w-full text-[10px] h-6 font-bold rounded-md">
                    <Link href={`/products/${item.id}`}>Request Quote</Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================\
   4. MOBILE featured slider (Clickable Items)
   ========================================================================== */
export function MobileFeaturedProducts({ products }: { products: DBProduct[] }) {
  return (
    <div className="w-full bg-muted/30 py-8 border-t border-border/40 lg:hidden">
      <div className="px-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Fast-Moving Procurement Consumables</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {products.map((p) => {
            const displayImage = p.images?.[0] || p.image || '/placeholder.png';

            return (
              <div key={p.id} className="w-48 shrink-0 bg-background border border-border/80 rounded-xl overflow-hidden p-3 space-y-2 flex flex-col justify-between">
                <Link href={`/products/${p.id}`} className="group block cursor-pointer space-y-2">
                  <div className="h-24 w-full bg-muted rounded-lg overflow-hidden">
                    <img src={displayImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{p.name}</h4>
                    <p className="text-[10px] text-muted-foreground truncate uppercase">{p.category_name}</p>
                  </div>
                </Link>
                <Button size="sm" asChild className="w-full h-7 text-[10px]">
                  <Link href={`/products/${p.id}`}>Add Tender</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================\
   5. WHY CHOOSE US
   ========================================================================== */
export function WhyChooseUs() {
  const steps = [
    { icon: Building2, title: 'Direct Logistics Fulfillment', desc: 'Secure medical container cargo tracking directly out of Lagos and Ife depots.' },
    { icon: ShieldCheck, title: 'Calibrated Certified Lots', desc: 'Surgical instruments undergo rigorous metallurgy checkouts ensuring non-magnetic sterile thresholds.' },
    { icon: Clock, title: 'Express Lead-Times', desc: 'Receive validated competitive quotations within 12 hours from our procurement desk.' },
  ];

  return (
    <div className="w-full bg-background py-16 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="max-w-xl mb-12">
          <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">Enterprise Compliance</span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Engineered for Clinical & Laboratory Integrity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="space-y-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================\
   6. MOBILE LATEST NEWS
   ========================================================================== */
export function MobileLatestNews({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="w-full bg-muted/10 py-10 border-t border-border/60 lg:hidden">
      <div className="px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resources & Advisories</h3>
          <Link href="/blog" className="text-xs text-primary font-medium">Read all</Link>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-lg bg-muted overflow-hidden shrink-0">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h4 className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <span>{post.published_at}</span>
                    <span>•</span>
                    <span>{post.read_time}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
