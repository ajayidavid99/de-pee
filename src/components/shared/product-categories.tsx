// src/components/shared/product-categories.tsx
'use client';

import { Card } from '@/components/ui/card';
import { ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';

interface DBCategory {
  id: string;
  name: string;
  image?: string;
  parent_id?: string | null;
}

export function ProductCategories({ categories }: { categories: DBCategory[] }) {
  const displayCategories = (
    categories.filter((c) => !c.parent_id).length > 0
      ? categories.filter((c) => !c.parent_id)
      : categories
  ).slice(0, 8);

  return (
    <section className="w-full bg-background py-10 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
              Browse Inventory
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Product Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            All Categories <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Responsive Grid: 2x3 Mobile | 3x2 Tablet | 4x2 Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className={`group ${index >= 6 ? 'hidden lg:block' : 'block'}`}
            >
              <Card
                hover
                className="relative overflow-hidden rounded-xl border border-border/80 bg-slate-900 shadow-xs transition-all duration-300 group-hover:border-primary/60 flex flex-col justify-between h-28 sm:h-32 p-3 sm:p-4"
              >
                {/* Image Layer with Dark Gradient Tint */}
                {category.image ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${category.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-950/30 group-hover:from-slate-950/95 transition-colors" />
                  </>
                ) : (
                  <div className="absolute top-3 right-3 text-white/20">
                    <Layers className="h-8 w-8" />
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2 drop-shadow-xs">
                    {category.name}
                  </h3>
                </div>

                <div className="relative z-10 flex items-center gap-1 text-[10px] font-bold text-white/80 group-hover:text-primary group-hover:translate-x-1 transition-all">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}