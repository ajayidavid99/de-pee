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
                {/* 1. Added explicit h-32 sm:h-36 layout isolation properties directly to the Card wrapper */}
                <Card
                  hover
                  className="relative overflow-hidden rounded-xl border border-border/80 bg-slate-950 shadow-xs transition-all duration-300 group-hover:border-primary/60 h-32 sm:h-36 isolate"
                >
                  {/* Background Image Layer (z-0) */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-slate-950/50 group-hover:from-slate-950 transition-colors duration-300" />
                  </div>

                  {/* 2. New Wrapper: Completely fills the Card area via position absolute, housing layout styling without interfering with the parent flex values */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-between p-3.5 sm:p-4 pointer-events-none">
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
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
