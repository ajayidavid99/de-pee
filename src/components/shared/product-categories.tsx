'use client';

import { Card } from '@/components/ui/card';
import { ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';

interface DBCategory {
  id: string;
  name: string;
  image?: string | null;
  slug?: string;
  parent_id?: string | null;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  diagnostic: 'https://unsplash.com',
  consumables: 'https://unsplash.com',
  surgical: 'https://unsplash.com',
  laboratory: 'https://unsplash.com',
  equipment: 'https://unsplash.com',
  default: 'https://unsplash.com',
};

function getCategoryImageUrl(category: DBCategory): string {
  if (category.image && category.image.trim() !== '') {
    return category.image;
  }

  const nameLower = category.name.toLowerCase();
  for (const [key, url] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (key !== 'default' && nameLower.includes(key)) {
      return url;
    }
  }

  return CATEGORY_FALLBACK_IMAGES.default ?? '';
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayCategories.map((category, index) => {
            const imageUrl = getCategoryImageUrl(category);

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className={`group ${index >= 6 ? 'hidden lg:block' : 'block'}`}
              >
                <Card hover className="overflow-hidden border border-border/80 bg-slate-950 shadow-xs transition-all duration-300 group-hover:border-primary/60 rounded-xl">
                  
                  <div className="relative w-full h-32 sm:h-36 isolate">
                    
                    {/* Background Image Container */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* 1. INITIAL LIGHT STATE (rgba black at 45% at the bottom, 15% in the middle) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.45)] via-[rgba(0,0,0,0.15)] to-transparent transition-opacity duration-300 opacity-100 group-hover:opacity-0" />
                      
                      {/* 2. HOVER DARKER STATE (rgba black climbs up to 75% at the bottom, 40% in the middle) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.75)] via-[rgba(0,0,0,0.40)] to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                    </div>

                    {/* Text and Actions Overlay Container */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-3.5 sm:p-4">
                      {/* Top Content */}
                      <div className="space-y-1">
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug drop-shadow-md">
                          {category.name}
                        </h3>
                      </div>

                      {/* Bottom Action */}
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all drop-shadow-sm">
                        <span>Explore</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>

                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
