// de-pee/src/app/(public)/about/page.tsx
import { Target, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export const metadata = {
  title: 'About Us | De-Pee Medical',
  description: 'Supplying quality medical equipment and consumables at affordable prices across Nigeria.',
};

export default function AboutPage() {
  return (
    <div className="w-full bg-background pt-[var(--app-header-height)] pb-20">
      <div className="mx-auto max-w-4xl px-4 lg:px-6 py-8 space-y-16">
        
        {/* Core Profile Summary */}
        <section className="space-y-4 text-center md:text-left">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-2 py-1 rounded-sm inline-block">
            Who We Are
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            De-Pee Medical Equipments & Consumables
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
            We combine quality, affordability, and exceptional customer service to ensure that healthcare institutions, clinical teams, and distributors have access to critical medical products exactly when they need them. By partnering exclusively with reputable manufacturers and suppliers, we deliver solutions that consistently comply with recognized global quality standards.
          </p>
        </section>

        {/* Mission Directives Grid */}
        <section className="space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Our Strategic Mission</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-border/80 bg-card space-y-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Award className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">Quality Assured</h3>
              <p className="text-xs text-muted-foreground leading-normal">
                To supply high-quality medical products at affordable baseline prices across all diagnostics and consumables tiers.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border/80 bg-card space-y-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">Timely Operations</h3>
              <p className="text-xs text-muted-foreground leading-normal">
                To provide exceptional customer service backed by rigid logistics control for timely procurement fulfillments.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border/80 bg-card space-y-2">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">Trusted Synergy</h3>
              <p className="text-xs text-muted-foreground leading-normal">
                To foster lasting healthcare network relationships grounded firmly on structural trust and operational integrity.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}