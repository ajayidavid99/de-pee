// src/components/shared/hot-deals.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flame, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import type { DBProduct } from '@/features/products/server/actions';

export function HotDeals({ products }: { products: DBProduct[] }) {
  // Pass up to 6 deal items for a clean grid
  const dealProducts = products.slice(0, 6);

  return (
    <section className="w-full bg-linear-to-b from-background via-amber-500/5 to-background py-10 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 font-mono text-[10px] font-bold uppercase tracking-wider">
              <Flame className="h-3.5 w-3.5 fill-amber-500/20 animate-pulse" />
              <span>Limited Batch Quotations</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Hot Procurement Deals
            </h2>
          </div>
          <Link
            href="/products?filter=deals"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            All Hot Deals <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {dealProducts.map((item, index) => (
            <Card
              key={item.id}
              hover
              className={`relative overflow-hidden rounded-xl border border-amber-500/30 bg-card/60 transition-all duration-300 group hover:border-amber-500/60 flex flex-col justify-between p-3 min-h-[250px] ${
                index >= 4 ? 'hidden lg:block' : 'block'
              }`}
            >
              {/* Product Thumbnail Container */}
              <div className="relative h-24 sm:h-28 w-full rounded-lg bg-muted overflow-hidden border border-border/40 shrink-0">
                
                {/* Special Batch Badge - Anchored directly to image frame */}
                <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-amber-500 text-slate-950 font-bold text-[9px] uppercase px-2 py-0.5 rounded-full shadow-xs">
                  <Tag className="h-2.5 w-2.5" />
                  <span>Special Batch</span>
                </div>

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-1 mt-2.5 min-w-0 flex-1">
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono block truncate">
                  {item.category_name}
                </span>
                <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </h3>
              </div>

              {/* Urgency Progress Bar */}
              <div className="my-2 space-y-1">
                <div className="flex justify-between items-center text-[9px] text-muted-foreground font-mono">
                  <span>Allocation</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">Fast Moving</span>
                </div>
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-3/4 rounded-full" />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-border/40">
                <Button size="sm" asChild className="w-full text-[10px] h-7 font-bold rounded-md bg-amber-500 text-slate-950 hover:bg-amber-400">
                  <Link href={`/products/${item.id}`}>Lock Quote</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}