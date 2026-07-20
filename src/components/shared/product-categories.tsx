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
                {/* Reduced overall card background intensity to a lighter slate/40 blur base */}
                <Card hover className="overflow-hidden border border-border/80 bg-slate-900/40 shadow-xs transition-all duration-300 group-hover:border-primary/60 rounded-xl">
                  
                  <div className="relative w-full h-32 sm:h-36 isolate">
                    
                    {/* Background Image Container */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Significantly lightened the gradient masking layer and removed the heavy hover darkening effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent transition-opacity duration-300" />
                    </div>

                    {/* Text and Actions Overlay Container */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-3.5 sm:p-4">
                      {/* Top Content */}
                      <div className="space-y-1">
                        {/* Swapped text colors to text-slate-900 / dark foreground adjustments for light card contrast if needed, or left brightened white with solid shadows */}
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">
                          {category.name}
                        </h3>
                      </div>

                      {/* Bottom Action */}
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-100 group-hover:text-primary group-hover:translate-x-1 transition-all [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)]">
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
