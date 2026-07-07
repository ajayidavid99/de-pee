// de-pee/src/components/shared/hero-section.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type Locale } from '@/features/site/config';
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
      className="relative flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8"
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
      <div className="group mt-6 flex items-center gap-2 text-sm font-bold text-primary">
        <span>View Products</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Card>
  );
} 

export default function HeroSection({ locale }: { locale: Locale }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-4">
      {/* Dynamic Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
        {/* Abstract tint overlay rather than raw image to preserve look/feel and maximize dark text contrast */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-primary/10" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

        <div className="relative z-10 max-w-3xl px-6 py-16 text-left sm:px-12 sm:py-20 md:py-24 lg:px-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs font-semibold text-blue-400">
            <Building2 className="h-3 w-3" />
            <span>Serving Lagos & Ife Healthcare Facilities</span>
          </div>

          <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Quality Medical Equipment <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              At Affordable Prices.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Partnering with globally recognized, reputable manufacturers to
            deliver trusted medical diagnostics, machinery, and daily surgical
            consumables.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              variant="primary"
              size="lg"
              className="rounded-xl font-semibold shadow-md"
            >
              Request a Quote
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-white/20 bg-white/5 font-semibold text-white backdrop-blur-xs hover:bg-white/10"
            >
              Our Products
            </Button>
          </div>
        </div>
      </div>

      {/* Core Product Categories Grid */}
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-2 text-left">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Product Portfolio
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Complying strictly with recognized medical regulatory criteria to
            protect staff and healthcare standards.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CategoryCard
            icon={Stethoscope}
            title="Diagnostic Tools"
            description="Advanced primary monitoring instruments, premium stethoscopes, visual scopes, and electronic clinical parameters gauges."
          />
          <CategoryCard
            icon={Activity}
            title="Surgical Instruments"
            description="Precision-engineered stainless steel surgical tools, retractors, scalpel platforms, and sterile operational kits."
          />
          <CategoryCard
            icon={ShieldAlert}
            title="Hospital Consumables"
            description="High-volume protective equipment, clinical single-use needles, procedural dressings, gloves, and sanitation consumables."
          />
        </div>
      </div>

      {/* Corporate Value Props Section */}
      <div className="grid grid-cols-1 gap-8 border-t border-border/60 pt-12 md:grid-cols-3">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Dual-Hub Distribution</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Strategic processing warehouses in Lagos and Ife ensure quick
              access and rapid procurement dispatch across regions.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">
              Timely Supply Commitments
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              We sync logistical parameters directly with clinical timelines
              because your inventory status impacts human well-being.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Reputable Compliance</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Working strictly with certified suppliers to guarantee that all
              delivered systems mirror stringent medical parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
