// de-pee/src/components/shared/hero-section.tsx

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
      className="relative flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 text-center shadow-xs md:p-8"
    >
      <div className="flex flex-col items-center">
        {/* Large Centered Circular Icon matching the image layout */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-xs">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
          {description}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary group cursor-pointer hover:opacity-80">
        <span>Learn more</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Card>
  );
}

export default function HeroSection({ locale }: { locale: Locale }) {
  return (
    <div className="w-full flex flex-col gap-16 pb-12">
      
      {/* Sharp-Edged Full Width Hero Banner sitting flush with header */}
      <div className="relative w-full h-[450px] md:h-[520px] bg-slate-900 rounded-none overflow-hidden flex flex-col">
        {/* Background Banner Image with sharp corners */}
        <div 
          className="absolute inset-0 bg-cover bg-center rounded-none"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=2000&q=80')` 
          }}
        />
        {/* High-visibility overlay to guarantee high-contrast reading text */}
        <div className="absolute inset-0 bg-slate-950/45 rounded-none z-0" />

        {/* Content alignment tracking behind layout header parameters */}
        <div className="relative z-10 max-w-5xl mx-auto w-full h-full px-6 flex flex-col justify-center items-center text-center text-white pt-[calc(var(--app-header-height)+1rem)] pb-12">
          
          {/* Main Title heading matching text copy from your design with reduced font weight */}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl max-w-4xl leading-tight [text-wrap:balance]">
            Your Trusted Source for Medical Supplies. Quality and Reliability Guaranteed.
          </h1>

          {/* Clean primary call-to-action block matching white rectangular design button */}
          <div className="mt-8">
            <Button 
              size="lg" 
              className="rounded-md bg-white text-slate-900 hover:bg-slate-100 px-8 py-3 text-sm font-medium tracking-wide shadow-sm"
            >
              View Products
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Content Deck Layer matching bottom row of mockup image */}
      <div className="mx-auto max-w-7xl w-full px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CategoryCard
            icon={Stethoscope}
            title="Diagnostic Tools"
            description="Professional patient assessment instruments, monitoring toolkits, and tools required for comprehensive medical evaluations."
          />
          <CategoryCard
            icon={Activity}
            title="Surgical Instruments"
            description="High-grade stainless steel surgical tools and premium instrumentation engineered for diverse medical workflows."
          />
          <CategoryCard
            icon={ShieldAlert}
            title="Hospital Consumables"
            description="Sterile hospital care essentials, disposable medical devices, protective accessories, and daily patient consumables."
          />
        </div>
      </div>

    </div>
  );
}