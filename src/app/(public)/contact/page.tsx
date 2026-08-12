// src/app/(public)/contact/page.tsx
import { MapPin, Mail, Phone, Clock, Landmark, MessageSquare, ExternalLink, Building2, ShieldCheck, Truck } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'Contact Information | De-Pee Medical',
  description: 'Reach our head office in Ile-Ife, Osun State or connect with our regional logistics network in Lagos.',
};

export default function ContactPage() {
  return (
    <div className="w-full bg-background pt-[var(--app-header-height)] pb-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-6 py-8">
        
        {/* Upper Branding Header */}
        <div className="border-b border-border/60 pb-6 mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Connect With Our Team</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Reach out directly to our central administrative base or request procurement logistics through our regional support channels.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT & MIDDLE ZONE: Main Office & Logistics Overview */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Primary Head Office Card */}
            <Card className="p-6 border border-border/80 bg-card space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-base font-bold text-foreground">Headquarters & Central Hub</h2>
                    <p className="text-[11px] text-muted-foreground">Primary administrative and operational center</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Ile-Ife
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground pt-1">
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block mb-0.5">Head Office Address</strong>
                      <p className="leading-relaxed">
                        Ilesa Road, directly opposite the Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC) Phase 1,<br />
                        Ile-Ife, Osun State, Nigeria.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="text-foreground block text-[10px] uppercase">Phone Line</strong>
                      <span className="text-foreground font-medium">+234 806 784 4732</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                    <div>
                      <strong className="text-foreground block text-[10px] uppercase">Official Email</strong>
                      <span className="text-foreground font-medium">info@mail.depeeventures.com</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                    <div>
                      <strong className="text-foreground block text-[10px] uppercase">Operating Hours</strong>
                      <span className="text-foreground font-medium">Mon - Sat: 8:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Regional Presence & Logistics Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-foreground">Dual-State Coverage</h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Operating dedicated operational nodes across <strong>Lagos State</strong> and <strong>Osun State</strong> to streamline regional clinical hardware delivery.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-foreground">Direct Procurement Support</h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Fast-track medical equipment sourcing and bulk supply inquiries through our centralized logistics desk.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT ZONE: Instant Support & Contact Panel */}
          <aside className="lg:col-span-1 border border-border/80 rounded-2xl p-5 bg-muted/20 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Direct Desk Support
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Need urgent assistance or pricing for specific clinical hardware? Use our floating support desk at the bottom-right of your screen to drop a direct message or chat with our admin team live.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <a 
                href="https://wa.me/2348067844732" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a 
                href="mailto:info@mail.depeeventures.com" 
                className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-border/80 bg-background text-foreground font-medium hover:bg-muted transition-colors"
              >
                <span>Email Procurement Desk</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center gap-2 text-[10px] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Verified logistics & medical supply partner</span>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}