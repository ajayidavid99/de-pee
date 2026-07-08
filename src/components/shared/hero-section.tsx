'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type Locale } from '@/features/site/config';
import { cn } from '@/libs/utils';
import {
  Activity,
  ArrowRight,
  ShieldAlert,
  Stethoscope,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface CategoryCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function CategoryCard({ icon: Icon, title, description }: CategoryCardProps) {
  return (
    <Card
      hover
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8"
    >
      <div>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-3 text-lg font-extrabold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary group cursor-pointer">
        <span>Browse Category</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
}

interface HotProductCardProps {
  title: string;
  badge: string;
  specs: string[];
}

function HotProductCard({ title, badge, specs }: HotProductCardProps) {
  return (
    <Card hover className="flex flex-col overflow-hidden rounded-2xl p-0 border border-border/60">
      {/* Mock Image Wrapper */}
      <div className="relative h-48 w-full bg-muted/40 flex items-center justify-center border-b border-border/40">
        <div className="absolute top-3 left-3 bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md">
          {badge}
        </div>
        <span className="text-xs text-muted-foreground font-medium">Product Image Placeholder</span>
      </div>
      
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-extrabold text-base text-foreground tracking-tight mb-3">
            {title}
          </h4>
          <ul className="space-y-1.5">
            {specs.map((spec, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="truncate">{spec}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-5 rounded-xl font-medium text-xs">
          View Specifications
        </Button>
      </div>
    </Card>
  );
}

export default function HeroSection({ locale }: { locale: Locale }) {
  return (
    <div className="w-full space-y-16 pb-12">
      
      {/* 1. Full-Width Large Impact Hero Banner */}
      <section className="relative w-full overflow-hidden rounded-3xl bg-slate-950 text-white min-h-[500px] flex items-center shadow-xl">
        {/* Large Mock Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=2000&auto=format&fit=crop')` 
          }}
        />
        {/* Precise Linear Shading to guarantee high typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-0" />

        <div className="relative z-10 max-w-4xl px-6 py-16 sm:px-12 sm:py-20 lg:px-16 text-left">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight">
            Premium Medical Supplies <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              With Guaranteed Reliability.
            </span>
          </h1>
          
          <p className="mt-6 max-w-xl text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
            Supplying healthcare channels across Lagos and Ife with verified tools, high-tier clinical diagnostics, and sterile hospital consumables.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="primary" size="lg" className="rounded-xl font-semibold shadow-md">
              Order Consumables
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl border-white/20 text-white bg-white/5 hover:bg-white/10 font-semibold backdrop-blur-xs">
              View Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Core Product Categories Portfolio */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col gap-1 text-left">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Product Portfolio
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            Sourced exclusively from reputable manufacturers to comply with recognized clinical standards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CategoryCard
            icon={Stethoscope}
            title="Diagnostic Tools"
            description="Precision testing setups, electronic blood pressure parameter tools, assessment equipment, and clinical kits."
          />
          <CategoryCard
            icon={Activity}
            title="Surgical Instruments"
            description="Premium surgical stainless tools, dissecting scissors, sterile tissue forcep configurations, and scalpel platforms."
          />
          <CategoryCard
            icon={ShieldAlert}
            title="Hospital Consumables"
            description="High-grade clinical syringes, gloves, examination materials, protective single-use gowns, and daily items."
          />
        </div>
      </section>

      {/* 3. Hot Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2 text-left">
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-500">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              Hot Products
            </h2>
          </div>
          <span className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1">
            See All Hot Deals <ArrowRight className="h-3 w-3" />
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <HotProductCard 
            title="Digital Clinical Ultrasound" 
            badge="High Demand"
            specs={["High-resolution imaging", "Portable design configuration", "ISO compliant certification"]}
          />
          <HotProductCard 
            title="Premium Surgical Forceps Kit" 
            badge="Top Seller"
            specs={["Medical-grade stainless steel", "Autoclave safe profile", "Sterile sealed pack sets"]}
          />
          <HotProductCard 
            title="Electronic Vital Signs Monitor" 
            badge="Trending"
            specs={["Real-time telemetry tracking", "Rechargeable internal battery", "Multi-parameter tracking system"]}
          />
          <HotProductCard 
            title="Sterile Disposable Gloves (Bulk)" 
            badge="In Stock"
            specs={["Powder-free textured nitrile", "100 units per master pack", "High tactile feedback design"]}
          />
        </div>
      </section>

    </div>
  );
}