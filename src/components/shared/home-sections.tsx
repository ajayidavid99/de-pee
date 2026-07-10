// de-pee/src/components/shared/home-sections.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Activity, ArrowRight, Building2, Clock, Flame, ShieldCheck, Star, Stethoscope, Mail, Phone, MapPin } from 'lucide-react';

/* ==========================================================================
   3. NEW ARRIVALS COMPONENT
   ========================================================================== */
export function NewArrivals() {
  const arrivals = [
    { title: 'Digital Blood Pressure Monitor', cat: 'Diagnostics', desc: 'Clinical grade precision automated reader.' },
    { title: 'Stainless Steel Surgical Forceps', cat: 'Surgical', desc: 'Ergonomic, high-alloy durability.' },
    { title: 'Premium Nitrile Exam Gloves', cat: 'Consumables', desc: 'Powder-free extra barrier protection.' },
  ];

  return (
    <section className="w-full py-10 bg-background border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center gap-2 mb-6">
          <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">New Arrivals</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {arrivals.map((item, idx) => (
            <Card key={idx} className="p-5 border border-border/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-sm">{item.cat}</span>
                <h3 className="text-base font-bold text-foreground mt-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Quote Only</span>
                <Button variant="outline" size="sm" className="text-xs h-7">Request</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   4. FEATURED PRODUCTS MOBILE CAROUSEL (Hides on Desktop/Widescreens)
   ========================================================================== */
export function MobileFeaturedProducts() {
  const mockProducts = [
    { name: 'Ophthalmoscope Pro V1', tag: 'Diagnostic' },
    { name: 'Premium Scalpel Blades #11', tag: 'Surgical' },
    { name: 'Sterile Gauze Sponges 4x4', tag: 'Consumable' },
    { name: 'Clinical Infrared Thermometer', tag: 'Diagnostic' },
  ];

  return (
    <section className="block lg:hidden w-full py-8 bg-muted/30 border-t border-border/40">
      <div className="px-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground mb-4">Featured Products</h2>
        {/* Horizontal scrollable box container */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-none">
          {mockProducts.map((p, i) => (
            <div key={i} className="w-[200px] shrink-0 snap-start bg-background border border-border/80 p-4 rounded-xl flex flex-col justify-between min-h-[140px]">
              <div>
                <span className="text-[9px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">{p.tag}</span>
                <h3 className="text-xs font-bold text-foreground mt-2 line-clamp-2">{p.name}</h3>
              </div>
              <Button size="sm" className="w-full text-[11px] h-7 mt-3">Get Quote</Button>
            </div>
          ))}
          {/* Last element as "More" link navigation trigger */}
          <div className="w-[160px] shrink-0 snap-start bg-primary/5 border border-dashed border-primary/40 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer group">
            <span className="text-sm font-bold text-primary group-hover:underline">View More</span>
            <ArrowRight className="h-4 w-4 text-primary mt-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   5. WHY CHOOSE DE-PEE COMPONENT (Company Identity & Core Pillars)
   ========================================================================== */
export function WhyChooseUs() {
  return (
    <section className="w-full py-12 bg-background border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Why Choose De-Pee?</h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Based out of Lagos and Ife, De-Pee Medical Equipments and Consumables combines quality, affordability, and exceptional customer service. We work strictly alongside reputable global manufacturers to source items completely compliant with recognized medical quality standards.[cite: 8]
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><ShieldCheck className="h-3.5 w-3.5" /></div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Affordable Pricing Framework</h4>
                  <p className="text-xs text-muted-foreground">High quality solutions contextually managed without high premium budgets.[cite: 8]</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><Clock className="h-3.5 w-3.5" /></div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Timely Distribution Cycles</h4>
                  <p className="text-xs text-muted-foreground">Strategic distribution models ensuring rapid procurement for emergency facility infrastructure.[cite: 8]</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted/40 border border-border p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-foreground mb-4">Our Core Mission</h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">✔ <span className="pt-0.5">Supply high-quality medical products at affordable prices.[cite: 8]</span></li>
              <li className="flex items-start gap-2">✔ <span className="pt-0.5">Provide exceptional customer service and rapid turnaround times.[cite: 8]</span></li>
              <li className="flex items-start gap-2">✔ <span className="pt-0.5">Foster lasting procurement relationships built on core integrity.[cite: 8]</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   6. MOBILE LATEST NEWS (Hides on Desktop/Widescreens)
   ========================================================================== */
export function MobileLatestNews() {
  return (
    <section className="block lg:hidden w-full py-8 bg-background border-t border-border/40">
      <div className="px-4 space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border pb-2">Latest News</h2>
        <div className="space-y-4">
          <article className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground leading-snug">De-Pee Medical equipment for Medical Supplies</h3>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /><span>1 hour ago</span></div>
          </article>
          <article className="space-y-1 border-t border-border/50 pt-3">
            <h3 className="text-sm font-semibold text-foreground leading-snug">De-Pee Medical equipment and consumables expansion in Nigeria</h3>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /><span>1 hour ago</span></div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   FINAL INTEGRATED FOOTER + CONTACT / NEWSLETTER SECTION
   ========================================================================== */
export function CompanyFooter() {
  return (
    <footer className="w-full bg-slate-900 text-slate-200 border-t border-slate-800 mt-12">
      {/* Upper Grid: Contact Form paired with Location Specs */}
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact/Quote Column */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Quick Quote & Inquiries</h3>
          <p className="text-xs text-slate-400">Since we feature custom quote configurations across our catalogue without direct prices, send us a quick note below.[cite: 8]</p>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Your Name" className="bg-slate-950/50 border-slate-700 text-xs h-9 text-white placeholder:text-slate-500" />
              <Input placeholder="Email or Phone" className="bg-slate-950/50 border-slate-700 text-xs h-9 text-white placeholder:text-slate-500" />
            </div>
            <Textarea placeholder="List items or quantities required..." className="bg-slate-950/50 border-slate-700 text-xs text-white placeholder:text-slate-500 min-h-[70px]" />
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-9">Send Request</Button>
          </form>
        </div>

        {/* Directory Metadata details */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">De-Pee Medical</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Providing premium procurement tools to clinics and laboratories across local administrative zones.[cite: 8]</p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-blue-400" /><span>Lagos & Ife Distribution Centers[cite: 8]</span></div>
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-blue-400" /><span>+234 806 784 4732[cite: 8]</span></div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} De-Pee Medical. All rights reserved.</span>
            <span className="hover:underline cursor-pointer">Privacy & Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
