// src/components/shared/product-categories.tsx
'use client';

import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface DBCategory {
  id: string;
  name: string;
  image?: string | null;
  slug?: string;
  parent_id?: string | null;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  diagnostic: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop',
  consumables: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
  surgical: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop',
  laboratory: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop',
  equipment: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop',
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
    <section className="w-full bg-background my-2">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
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
                <Card hover className="overflow-hidden border border-border/40 bg-slate-900 shadow-xs transition-all duration-300 group-hover:border-primary/80 rounded-xl">
                  
                  <div className="relative w-full h-32 sm:h-36 isolate">
                    
                    {/* Background Image Container */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent transition-colors duration-300" />
                    </div>

                    {/* Text and Actions Overlay Container */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-3.5">
                      {/* Top Content: Softened pre-hover backdrop */}
                      <div>
                        <div className="inline-block rounded-lg bg-black/25 backdrop-blur-xs px-2.5 py-1 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground max-w-full">
                          <h3 className="text-xs sm:text-sm font-bold text-white transition-colors line-clamp-2 leading-snug">
                            {category.name}
                          </h3>
                        </div>
                      </div>

                      {/* Bottom Action: Exploration tag */}
                      <div className="flex items-center gap-1 text-[11px] font-bold text-white group-hover:translate-x-1 transition-all drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
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