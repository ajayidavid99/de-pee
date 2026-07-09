'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type Locale } from '@/features/site/config';
import { cn } from '@/libs/utils';
import {
  Activity,
  ArrowRight,
  Building2,
  Clock,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react';
import Image from 'next/image';

interface CategoryCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function CategoryCard({ icon: Icon, title, description }: CategoryCardProps) {
  return (
    <Card
      hover
      className="relative flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-2xl border border-border/80 p-6 shadow-xs"
    >
      <div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-base font-extrabold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-primary group cursor-pointer">
        <span>Learn more</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
}

export default function HeroSection({ locale }: { locale: Locale }) {
  return (
    <div className="w-full bg-background pt-[var(--app-header-height)]">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-6">
        
        {/* Main Classic 2-Column Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* LEFT MAIN CONTENT AREA (Takes up 3/4 widths) */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            
            {/* Full-bleed Sharp Hero Box Container */}
            <div className="relative w-full h-[400px] md:h-[460px] bg-slate-900 rounded-none overflow-hidden group">
              <div 
                className="absolute inset-0 bg-cover bg-center rounded-none transition-transform duration-700 group-hover:scale-102"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80')` 
                }}
              />
              {/* Specialized Medical Overlay Blue-Tint Tones Match Mockup */}
              <div className="absolute inset-0 bg-slate-950/40 mix-blend-multiply rounded-none z-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent rounded-none z-0" />

              {/* Inner Text Context Layer */}
              <div className="relative z-10 h-full p-6 md:p-12 flex flex-col justify-center items-start text-left text-white max-w-2xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                  Your Trusted Source for Medical Supplies. Quality and Reliability Guaranteed.
                </h1>
                
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button variant="primary" size="lg" className="rounded-md font-semibold px-6 bg-white text-slate-900 hover:bg-slate-100 shadow-sm">
                    View Products
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Portfolio Grid */}
            <div className="w-full flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CategoryCard
                  icon={Stethoscope}
                  title="Diagnostic Tools"
                  description="Advanced primary patient checking instruments and portable diagnostic tools built for clean medical evolutions."
                />
                <CategoryCard
                  icon={Activity}
                  title="Surgical Instruments"
                  description="High grade surgical implements engineered directly from durable alloys for premium operational performance."
                />
                <CategoryCard
                  icon={ShieldAlert}
                  title="Hospital Consumables"
                  description="Sterile protective apparel, clinical single-use needles, procedural sets, and high-volume sanitization tools."
                />
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR PANEL (Takes up 1/4 width) */}
          <aside className="lg:col-span-1 flex flex-col gap-8 lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)]">
            
            {/* Latest News Feed Block */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border pb-2">
                Latest News
              </h2>
              
              <div className="space-y-4">
                <article className="space-y-1 group cursor-pointer">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    De-Pee Medical equipment for Medical Supplies
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>1 hour ago</span>
                  </div>
                </article>

                <article className="space-y-1 group cursor-pointer border-t border-border/50 pt-3">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    De-Pee Medical equipment and consumables expansion in Nigeria
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>1 hour ago</span>
                  </div>
                </article>
              </div>
            </div>

            {/* Featured Products Sidebar Section */}
            <div className="space-y-4 pt-2">
              <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border pb-2">
                Featured Products
              </h2>
              
              <div className="flex flex-col gap-3">
                {/* Item 1 */}
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border/40 transition duration-200 cursor-pointer group">
                  <div className="relative h-12 w-12 rounded-lg bg-muted border border-border/60 shrink-0 flex items-center justify-center overflow-hidden">
                    <Stethoscope className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      Medical equipment and products
                    </h4>
                    <p className="text-[10px] text-muted-foreground truncate">Diagnostics Essentials</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border/40 transition duration-200 cursor-pointer group">
                  <div className="relative h-12 w-12 rounded-lg bg-muted border border-border/60 shrink-0 flex items-center justify-center overflow-hidden">
                    <Activity className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      Surgical Instruments - Surgical
                    </h4>
                    <p className="text-[10px] text-muted-foreground truncate">Precision Alloy Kits</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border/40 transition duration-200 cursor-pointer group">
                  <div className="relative h-12 w-12 rounded-lg bg-muted border border-border/60 shrink-0 flex items-center justify-center overflow-hidden">
                    <ShieldAlert className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      Hospital Consumables equipment
                    </h4>
                    <p className="text-[10px] text-muted-foreground truncate">Acute Care Solutions</p>
                  </div>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}