// src/components/shared/site-footer.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

interface SiteFooterProps {
  showQuoteForm?: boolean;
}

export function SiteFooter({ showQuoteForm = false }: SiteFooterProps) {
  return (
    <footer id="footer" className="w-full bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className={`grid grid-cols-1 ${showQuoteForm ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8 mb-8 pb-8 border-b border-slate-800`}>
          
          {/* Conditional Quote Request Form (Rendered only on Homepage) */}
          {showQuoteForm && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-bold">Fast tender setup</span>
                <h3 className="text-sm font-bold text-white">Direct procurement quote request</h3>
                <p className="text-xs text-slate-400">Instantly register requirements with our clinical account coordinators.</p>
              </div>

              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Clinic / Lab Name" className="bg-slate-950/50 border-slate-700 text-xs text-white placeholder:text-slate-500" />
                  <Input placeholder="Procurement Email" className="bg-slate-950/50 border-slate-700 text-xs text-white placeholder:text-slate-500" />
                </div>
                <Textarea placeholder="List items or quantities required..." className="bg-slate-950/50 border-slate-700 text-xs text-white placeholder:text-slate-500 min-h-[70px]" />
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-9">Send Request</Button>
              </form>
            </div>
          )}

          {/* Company Summary Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">De-Pee Ventures</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Providing premium procurement tools, electronics, laptops, and medical equipment across local administrative zones.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-blue-400" />
                <span>Lagos & Ife Distribution Centers</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-blue-400" />
                <span>+234 806 784 4732</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products" className="hover:text-white transition-colors">Products Catalog</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Advisories</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Legal Compliance Links (NDPA 2023) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy (NDPA)</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} De-Pee Ventures. All Rights Reserved.</p>
          <p>Compliant with the Nigeria Data Protection Act (NDPA 2023).</p>
        </div>
      </div>
    </footer>
  );
}