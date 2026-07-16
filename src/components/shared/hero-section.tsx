// src/components/shared/hero-section.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type Locale } from '@/features/site/config';
import { Activity, ArrowRight, Clock, ShieldAlert, Stethoscope, Briefcase, FileText } from 'lucide-react';
import Link from 'next/link';
import type { DBProduct, DBCategory } from '@/features/products/server/actions';
import type { BlogPost } from '@/features/blog/server/actions';

interface HeroSectionProps {
  locale: Locale;
  products: DBProduct[];
  categories: DBCategory[];
  posts: BlogPost[];
}

const B2B_METADATA: Record<string, { icon: any; description: string; b2bBadge: string }> = {
  'Diagnostics': {
    icon: Stethoscope,
    b2bBadge: 'WHO / ISO Certified',
    description: 'Bulk procurement channels for primary health clinics, public diagnostic labs, and radiology centers.',
  },
  'Surgical': {
    icon: Activity,
    b2bBadge: 'High-Alloy Autoclavable',
    description: 'Stainless steel operating theater kits, surgical tools, and custom instrumentation cases.',
  },
  'Consumables': {
    icon: ShieldAlert,
    b2bBadge: 'Logistics Contracts',
    description: 'High-volume clinical protective wear, gloves, sterile dressings, and laboratory consumables.',
  }
};

export default function HeroSection({ locale, products, categories, posts }: HeroSectionProps) {
  const latestPosts = posts.slice(0, 3);
  const featuredProducts = products.slice(0, 3);
  const rootCategories = categories.filter((c) => !c.parent_id).slice(0, 3);

  return (
    <section className="relative w-full bg-background pt-24 pb-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: Hero Actions & Categories */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-8">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary tracking-wide">
                🏥 Premium Hospital Supply & B2B Procurement
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Equipping West African Healthcare with Precision Hardware
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                Streamlining high-volume supply chains and medical procurement contracts. Select instruments to build your RFQ quotation cart instantly.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="sm" asChild className="h-10 text-xs font-bold px-6">
                  <Link href="/products">Browse Store Catalog</Link>
                </Button>
                <Button size="sm" variant="outline" asChild className="h-10 text-xs font-bold px-6">
                  <a href="#quote-form">Submit Direct Tender</a>
                </Button>
              </div>
            </div>

            {/* B2B CATEGORY CHANNELS GRID */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Bulk B2B Procurement Categories
                </h3>
                <span className="text-[11px] text-primary font-medium">Lagos & Ife Distribution hubs</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rootCategories.map((cat) => {
                  const meta = B2B_METADATA[cat.name] || {
                    icon: Briefcase,
                    b2bBadge: 'Wholesale Catalog',
                    description: `Access complete institutional catalog inventories for the ${cat.name} department.`
                  };
                  const Icon = meta.icon;

                  return (
                    <Card 
                      key={cat.id} 
                      hover 
                      className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 p-5 shadow-xs bg-card/50"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-[9px] font-mono font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase">
                            {meta.b2bBadge}
                          </span>
                        </div>
                        <h3 className="mb-1 text-sm font-bold tracking-tight text-foreground">{cat.name}</h3>
                        <p className="text-[11px] leading-relaxed text-muted-foreground">{meta.description}</p>
                      </div>
                      
                      <Link 
                        href={`/products?category=${cat.id}`} 
                        className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline group"
                      >
                        <span>Configure Tender</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Sidebar (Hero Image -> Latest Advisories -> Featured Products) */}
          <aside className="space-y-6 lg:border-l lg:border-border/60 lg:pl-6">
            
            {/* 1. HERO IMAGE CONTAINER */}
            <div className="hero-image-container relative h-40 w-full rounded-2xl border border-border/60 overflow-hidden bg-muted shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop" 
                alt="Medical Diagnostic Hardware Supply" 
                className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-3.5">
                <p className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-widest">Supply Hub</p>
                <h4 className="text-xs font-bold text-white">Advanced Surgical & Lab Ware</h4>
              </div>
            </div>

            {/* 2. LATEST ADVISORIES (Top) */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Latest Advisories</h2>
              <div className="flex flex-col gap-3">
                {latestPosts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No updates available at this time.</p>
                ) : (
                  latestPosts.map((post) => (
                    <Link 
                      href={`/blog/${post.slug}`} 
                      key={post.id} 
                      className="flex gap-2 group cursor-pointer"
                    >
                      <div className="h-8 w-8 rounded-lg bg-muted/60 border border-border/40 shrink-0 flex items-center justify-center text-muted-foreground">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                          <Clock className="h-2.5 w-2.5" /> {post.read_time}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* 3. FEATURED PRODUCTS (Moved below Advisories) */}
            <div className="space-y-4 pt-4 border-t border-border/60">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Featured Products</h2>
              <div className="flex flex-col gap-3">
                {featuredProducts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No products found in stock.</p>
                ) : (
                  featuredProducts.map((p) => (
                    <Link 
                      href={`/products/${p.id}`} 
                      key={p.id} 
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border/40 transition duration-200 group"
                    >
                      <div className="relative h-11 w-11 rounded-lg bg-muted border border-border/60 shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{p.name}</h4>
                        <p className="text-[10px] text-muted-foreground truncate uppercase">{p.category_name}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

          </aside>
          
        </div>
      </div>
    </section>
  );
}