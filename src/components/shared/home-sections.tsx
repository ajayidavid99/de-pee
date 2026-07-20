// src/components/shared/home-sections.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Activity, ArrowRight, Building2, Clock, Flame, ShieldCheck, Mail, Phone, MapPin, Calendar, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { DBProduct } from '@/features/products/server/actions';
import type { BlogPost } from '@/features/blog/server/actions';

/* ==========================================================================\
   3. NEW ARRIVALS / PREMIUM ADDITIONS (Compact Card Layout)
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

        {/* Compact Grid matching Product Categories style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((item) => (
            <Card 
              key={item.id} 
              hover 
              className="relative overflow-hidden rounded-xl border border-border/80 bg-card/50 transition-all duration-300 group hover:border-primary/50 flex flex-col justify-between h-44 sm:h-48 p-3"
            >
              {/* Product Image Box */}
              <div className="relative h-20 sm:h-24 w-full rounded-lg bg-muted overflow-hidden border border-border/40 shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>

              {/* Product Info */}
              <div className="space-y-0.5 mt-2 min-w-0 flex-1">
                <span className="text-[9px] font-bold text-primary uppercase tracking-wider font-mono block truncate">
                  {item.category_name}
                </span>
                <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {item.name}
                </h3>
              </div>

              {/* Action Link */}
              <div className="mt-2 pt-2 border-t border-border/40">
                <Button size="sm" asChild className="w-full text-[10px] h-6 font-bold rounded-md">
                  <Link href={`/products/${item.id}`}>Request Quote</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================\
   4. MOBILE featured slider (Now dynamic)
   ========================================================================== */
export function MobileFeaturedProducts({ products }: { products: DBProduct[] }) {
  return (
    <div className="w-full bg-muted/30 py-8 border-t border-border/40 lg:hidden">
      <div className="px-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Fast-Moving Procurement Consumables</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {products.map((p) => (
            <div key={p.id} className="w-48 shrink-0 bg-background border border-border/80 rounded-xl overflow-hidden p-3 space-y-2">
              <div className="h-24 w-full bg-muted rounded-lg overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground truncate">{p.name}</h4>
                <p className="text-[10px] text-muted-foreground truncate uppercase">{p.category_name}</p>
              </div>
              <Button size="sm" asChild className="w-full h-7 text-[10px]">
                <Link href={`/products/${p.id}`}>Add Tender</Link>
              </Button>
            </div>
          ))}
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
   6. MOBILE LATEST NEWS (Now dynamic)
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

/* ==========================================================================\
   7. FOOTER & QUOTATION MODULE
   ========================================================================== */
export function CompanyFooter() {
  return (
    <footer id="quote-form" className="w-full bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-bold">Fast tender setup</span>
              <h3 className="text-sm font-bold text-white">Direct procurement quote request</h3>
              <p className="text-xs text-slate-400">Instantly register requirements with our clinical account coordinators.</p>
            </div>

            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Clinic / Lab Name" className="bg-slate-950/50 border-slate-700 text-xs text-white placeholder:text-slate-500" />
                <Input placeholder="Procurement Email" className="bg-slate-950/50 border-slate-700 text-xs text-white placeholder:text-slate-500" />
              </div>
              <Textarea placeholder="List items or quantities required..." className="bg-slate-950/50 border-slate-700 text-xs text-white placeholder:text-slate-500 min-h-[70px]" />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-9">Send Request</Button>
            </form>
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">De-Pee Medical</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Providing premium procurement tools to clinics and laboratories across local administrative zones.</p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-blue-400" /><span>Lagos & Ife Distribution Centers</span></div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-blue-400" /><span>+234 806 784 4732</span></div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500">
              © {new Date().getFullYear()} De-Pee Medical Procurement. All Rights Reserved.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}