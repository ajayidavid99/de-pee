// src/components/shared/site-footer.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { submitDirectQuoteRequest } from '@/features/inbox/server/actions';

interface SiteFooterProps {
  showQuoteForm?: boolean;
}

export function SiteFooter({ showQuoteForm }: SiteFooterProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/en'; 
  const shouldDisplayQuote = showQuoteForm ?? isHomePage;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.details || !formData.phone) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      await submitDirectQuoteRequest(formData);

      toast.success('Quote request sent! Our clinical coordinators will contact you shortly.');
      
      setFormData({ name: '', address: '', email: '', phone: '', details: '' });
    } catch (error) {
      console.error('Quote submission error:', error);
      toast.error('Failed to send request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer id="footer" className="w-full bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-300 py-6 transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        
        <div className={`grid grid-cols-1 ${shouldDisplayQuote ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 mb-4 pb-4 border-b border-slate-300 dark:border-slate-800`}>
          
          {shouldDisplayQuote && (
            <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-300 dark:border-slate-800 space-y-3 lg:col-span-2 shadow-sm dark:shadow-none">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-blue-700 dark:text-blue-400 uppercase tracking-widest font-bold">Fast tender setup</span>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">Direct procurement quote request</h3>
                <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">Instantly register requirements with our clinical account coordinators.</p>
              </div>

              <form className="space-y-2.5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <Input 
                    placeholder="Full Name / Clinic Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isLoading}
                    className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-xs text-slate-950 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 font-medium truncate" 
                  />
                  <Input 
                    placeholder="Delivery / Facility Address" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isLoading}
                    className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-xs text-slate-950 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 font-medium truncate" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <Input 
                    type="email" 
                    placeholder="Procurement Email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                    className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-xs text-slate-950 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 font-medium truncate" 
                  />
                  <Input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isLoading}
                    className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-xs text-slate-950 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 font-medium truncate" 
                  />
                </div>

                <Textarea 
                  placeholder="List items or quantities required..." 
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  disabled={isLoading}
                  className="bg-slate-50 dark:bg-slate-950/50 border-slate-300 dark:border-slate-700 text-xs text-slate-950 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 font-medium min-h-[60px]" 
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9"
                >
                  {isLoading ? 'Sending Request...' : 'Send Request'}
                </Button>
              </form>
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${shouldDisplayQuote ? 'lg:col-span-2' : 'lg:col-span-4'}`}>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-950 dark:text-white">De-Pee Ventures</h3>
              <p className="text-xs text-slate-800 dark:text-slate-400 leading-relaxed font-medium">
                Providing premium procurement tools, diagnostic systems, and medical equipment across local administrative zones.
              </p>
              <div className="space-y-1 text-xs text-slate-900 dark:text-slate-300 pt-1 font-semibold">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400 shrink-0" />
                  <span>Lagos & Ife Distribution Centers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400 shrink-0" />
                  <span>+234 806 784 4732</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider font-mono">Quick Links</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/products" className="text-slate-800 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Products Catalog</Link></li>
                <li><Link href="/about" className="text-slate-800 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors font-semibold">About Us</Link></li>
                <li><Link href="/blog" className="text-slate-800 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Blog & Advisories</Link></li>
                <li><Link href="/contact" className="text-slate-800 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Contact Support</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider font-mono">Legal & Compliance</h4>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/privacy" className="text-slate-800 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Privacy Policy (NDPA)</Link></li>
                <li><Link href="/terms" className="text-slate-800 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-slate-800 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors font-semibold">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-700 dark:text-slate-400 gap-2 pt-1 font-medium">
          <p>© {new Date().getFullYear()} De-Pee Ventures. All Rights Reserved.</p>
          <p>Compliant with the Nigeria Data Protection Act (NDPA 2023).</p>
        </div>
      </div>
    </footer>
  );
}