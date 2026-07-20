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
  // Prefer parent categories (top-level), fallback to all if not structured
  const displayCategories = (
    categories.filter((c) => !c.parent_id).length > 0
      ? categories.filter((c) => !c.parent_id)
      : categories
  ).slice(0, 8); // Max 8 for desktop 4x2 grid

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

        {/* 
          - Mobile (< sm): 2 cols x 3 rows (Max 6 shown via CSS/slice)
          - Tablet (sm -> lg): 3 cols x 2 rows
          - Desktop (lg+): 4 cols x 2 rows
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className={`group ${index >= 6 ? 'hidden lg:block' : 'block'}`}
            >
              <Card
                hover
                className="relative overflow-hidden rounded-xl border border-border/80 p-3 sm:p-4 bg-card/40 transition-all duration-200 group-hover:border-primary/50 flex flex-col justify-between h-28 sm:h-32"
              >
                {/* Background image overlay with soft gradient */}
                {category.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-300"
                    style={{ backgroundImage: `url('${category.image}')` }}
                  />
                ) : (
                  <div className="absolute top-3 right-3 text-muted-foreground/20">
                    <Layers className="h-10 w-10" />
                  </div>
                )}

                <div className="relative z-10 space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                </div>

                <div className="relative z-10 flex items-center gap-1 text-[10px] font-bold text-primary group-hover:translate-x-1 transition-transform">
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