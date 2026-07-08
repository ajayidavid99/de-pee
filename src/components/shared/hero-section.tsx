// de-pee/src/components/shared/hero-section.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type Locale } from '@/features/site/config';
import { cn } from '@/libs/utils';
import {
  Activity,
  ArrowRight,
  Building2,
  MapPin,
  ShieldAlert,
  Stethoscope,
  Truck,
  Users,
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
      className="relative flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8"
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
      <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary group">
        <span>View Products</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
}

export default function HeroSection({ locale }: { locale: Locale }) {
  return (
    <div className="w-full flex flex-col gap-16 pb-12">
      
      {/* Full-Width Large Hero Image with Sharp Edges - No gaps */}
      <div className="relative w-full min-h-[550px] md:h-[650px] bg-slate-900 rounded-none overflow-hidden flex flex-col">
        {/* Background Image - Strict Sharp Edges */}
        <div 
          className="absolute inset-0 bg-cover bg-center rounded-none"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=2000&q=80')` 
          }}
        />
        {/* Semi-transparent dark overlay for high contrast visibility */}
        <div className="absolute inset-0 bg-slate-950/55 rounded-none z-0" />

        {/* Hero Content Layer - Dynamically padded at top to account for header height context */}
        <div className="relative z-10 max-w-7xl mx-auto w-full h-full px-6 flex-1 flex flex-col justify-center items-start text-left text-white pt-[calc(var(--app-header-height)+2rem)] pb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/25 border border-primary/40 px-3 py-1 text-xs font-semibold text-blue-400 mb-6 backdrop-blur-xs">
            <Building2 className="h-3 w-3" />
            <span>Serving Lagos & Ife Healthcare Facilities</span>
          </div>
          
          {/* Changed from font-extrabold to font-semibold for a cleaner appearance */}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl max-w-3xl leading-tight">
            Quality Medical Equipment & Consumables At Affordable Prices
          </h1>
          
          <p className="mt-6 max-w-xl text-base sm:text-lg text-slate-200 font-normal leading-relaxed opacity-95">
            Partnering directly with globally recognized manufacturers to deliver trusted medical diagnostics, machinery, and critical surgical consumables.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button variant="primary" size="lg" className="rounded-xl font-semibold shadow-md">
              Request a Quote
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl border-white/35 text-white bg-white/5 hover:bg-white/15 font-semibold backdrop-blur-xs">
              View Catalog
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area (Restricted Grid Width) */}
      <div className="mx-auto max-w-7xl w-full px-4 flex flex-col gap-16">
        
        {/* Product Portfolio / Hot Categories Section */}
        <div className="w-full space-y-6">
          <div className="flex flex-col gap-2 text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Product Portfolio
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Complying strictly with recognized medical regulatory criteria to ensure patient protection and clinical accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CategoryCard
              icon={Stethoscope}
              title="Diagnostic Tools"
              description="Advanced primary monitoring instruments, premium stethoscopes, imaging devices, and electronic vital metric gauges."
            />
            <CategoryCard
              icon={Activity}
              title="Surgical Instruments"
              description="Precision-engineered stainless steel surgical tools, retractors, forceps, scalpel handles, and sterile operational kits."
            />
            <CategoryCard
              icon={ShieldAlert}
              title="Hospital Consumables"
              description="High-volume protective tools, clinical single-use needles, procedural dressings, gloves, and daily management supplies."
            />
          </div>
        </div>

        {/* Corporate Value Strip */}
        <div className="grid grid-cols-1 gap-8 border-t border-border/60 pt-12 md:grid-cols-3">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Dual-Hub Distribution</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Strategic processing warehouses in Lagos and Ife ensure quick regional access and rapid procurement timelines.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Timely Supply Commitments</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">We sync logistical delivery options directly with hospital timelines to keep your facility stocked with core items.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Certified Sourcing</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Working exclusively alongside reputable producers to promise complete compliance with quality frameworks.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}