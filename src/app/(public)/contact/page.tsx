// de-pee/src/app/(public)/contact/page.tsx
import { MapPin, Mail, Phone, Clock, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'Contact Information | De-Pee Medical',
  description: 'Reach our distribution and procurement offices in Yaba, Lagos and Ife, Osun State.',
};

export default function ContactPage() {
  return (
    <div className="w-full bg-background pt-[var(--app-header-height)] pb-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-6 py-8">
        
        {/* Upper Branding Header */}
        <div className="border-b border-border/60 pb-6 mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">Connect With Our Team</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Get in touch directly with our localized logistics hubs to discuss supply contracts, technical hardware allocations, or quick quote fulfillments.
          </p>
        </div>

        {/* Dynamic Multi-Location Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT & MIDDLE ZONE: Dual Hub Addresses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Branch 1: Lagos Hub */}
              <Card className="p-5 border border-border/80 bg-card space-y-4">
                <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-foreground">Lagos Distribution Office</h2>
                </div>
                
                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="leading-normal">
                      Herbert Macaulay Way, Yaba Area,<br />
                      Lagos State, Nigeria.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>+234 (0) 803 000 1111</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>lagos@depeemedical.com</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
                  </div>
                </div>
              </Card>

              {/* Branch 2: Osun Hub */}
              <Card className="p-5 border border-border/80 bg-card space-y-4">
                <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold text-foreground">Ife Operational Hub</h2>
                </div>
                
                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="leading-normal">
                      Ibadan Road, Near University Axis,<br />
                      Ile-Ife, Osun State, Nigeria.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>+234 (0) 805 222 3333</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>ife@depeemedical.com</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Mon - Sat: 8:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </Card>

            </div>
          </div>

          {/* RIGHT ZONE: Quick Inquiry Dynamic Form */}
          <aside className="lg:col-span-1 border border-border/80 rounded-2xl p-5 bg-linear-to-b from-card to-muted/20 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Direct Desk Message</h3>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Drop your clinical hardware requirements here and a procurement representative will respond.
              </p>
            </div>

            <form className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Institution Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ife Central Clinic" 
                  className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Target Hub Office</label>
                <select className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-hidden focus:ring-1 focus:ring-ring">
                  <option value="yaba">Yaba, Lagos Branch</option>
                  <option value="ife">Ife, Osun Branch</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Detailed Request</label>
                <textarea 
                  rows={3} 
                  placeholder="Specify asset types or logistics requirements..." 
                  className="w-full rounded-md border border-input bg-background p-2 text-xs focus:outline-hidden focus:ring-1 focus:ring-ring resize-none"
                  required
                />
              </div>

              <Button type="submit" size="sm" className="w-full text-[11px] h-8 font-medium">
                Dispatch Inquiry
              </Button>
            </form>
          </aside>

        </div>
      </div>
    </div>
  );
}