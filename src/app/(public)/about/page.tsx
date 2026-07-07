// de-pee/src/app/(public)/about/page.tsx
import {
  getLocaleDirection,
  siteConfig,
  type Locale,
} from '@/features/site/config';
import { cn } from '@/libs/utils';
import { Building2, Eye, HeartHandshake, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations();
  return {
    title: `About Us | ${siteConfig.appName || 'De-Pee Medical'}`,
    description:
      'To supply quality medical related equipments and consumables at affordable prices.',
  };
};

function AboutCard({
  title,
  children,
  isRtl,
}: {
  title: string;
  children: React.ReactNode;
  isRtl: boolean;
}) {
  return (
    <div
      className={cn(
        'ui-card ui-hover-lift relative flex min-h-[12rem] flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-card p-6 text-left shadow-sm sm:p-7',
        isRtl && 'text-right',
      )}
    >
      <h2 className="text-base font-extrabold tracking-tight">
        <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      {children}
    </div>
  );
}

const AboutPage = async () => {
  const locale = await getLocale();
  const isRtl = getLocaleDirection(locale as Locale) === 'rtl';

  return (
    <div className="flex flex-col gap-12 pb-16 lg:gap-16">
      <div className="mx-auto w-full max-w-7xl px-4 pt-12">
        <div className="mx-auto w-full max-w-screen-xl space-y-8 px-5 sm:space-y-10 xl:px-0">
          <header
            className={cn('space-y-2 text-center', !isRtl && 'lg:text-left')}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              About De-Pee Medical
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Equipments and consumables built on corporate trust, accessible
              pricing models, and clinical safety patterns.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-3 lg:gap-8">
            <div className="md:col-span-2">
              <AboutCard title="Our Corporate Profile" isRtl={isRtl}>
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    De-Pee Medical Equipments and Consumables combines
                    real-world quality metrics, structural affordability, and
                    exceptional customer service pathways to ensure that
                    clinical clients retain stable access to items exactly when
                    they need them.
                  </p>
                  <p>
                    We interface closely with reputable manufacturers and global
                    medical suppliers to supply products that strictly comply
                    with universally recognized validation standards.
                  </p>
                </div>
              </AboutCard>
            </div>

            <AboutCard title="Distribution Network" isRtl={isRtl}>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2 font-semibold text-foreground">
                  <Building2 className="h-4 w-4 text-primary" /> Locations
                  Matrix
                </p>
                <p>
                  Fully established, fully functional localized hubs handling
                  secure storage, inventory management, and regional
                  transportation dispatching:
                </p>
                <div className="flex gap-2 pt-2">
                  <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-bold">
                    Lagos Hub
                  </span>
                  <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-bold">
                    Ife Hub
                  </span>
                </div>
              </div>
            </AboutCard>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-extrabold tracking-tight text-foreground">
              Our Strategic Pillars
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-7 lg:gap-8">
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Eye className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  Core Objective
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  To supply premium quality medical related equipment platforms
                  and high-utility consumables at affordable market tiers.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  Exceptional Care
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  To consistently deliver premium customer service solutions
                  alongside timely logistical supply operations to prevent
                  shortages.
                </p>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  Integrity Commitments
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  To proactively foster durable, lasting partnerships with
                  healthcare administrators based firmly on truth, metrics, and
                  deep trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
