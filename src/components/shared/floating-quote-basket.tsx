// src/components/shared/floating-quote-basket.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/features/auth/hooks/auth-provider';
import { submitQuoteRequest } from '@/features/quotes/server/actions';
import { submitDirectMessage } from '@/features/inbox/server/actions';
import { toast } from 'sonner';
import { 
  ShoppingBag, 
  FileText, 
  CheckCircle, 
  Package, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Headphones, 
  Mail, 
  PhoneCall,
  MessageCircle,
  MapPin,
  Send,
  Loader2
} from 'lucide-react';
import type { DBProduct } from '@/features/products/schema';

interface CartItem {
  product: DBProduct;
  quantity: number;
}

export function FloatingQuoteBasket() {
  const { user } = useAuth(); // Pre-fills support form if logged in

  const [quoteCart, setQuoteCart] = useState<CartItem[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Direct Message Support Form State
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportFormData, setSupportFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });

  // Keep user details synced when auth state resolves
  useEffect(() => {
    if (user) {
      setSupportFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Sync basket with localStorage
  useEffect(() => {
    const syncCart = () => {
      const savedCart = localStorage.getItem('depee_quote_basket');
      if (savedCart) {
        try {
          setQuoteCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse quote basket:', e);
        }
      }
    };

    syncCart();
    window.addEventListener('cart-updated', syncCart);
    return () => window.removeEventListener('cart-updated', syncCart);
  }, []);

  const updateCartState = (newCart: CartItem[]) => {
    setQuoteCart(newCart);
    localStorage.setItem('depee_quote_basket', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const adjustBasketQuantity = (productId: string, delta: number) => {
    const newCart = quoteCart.map((item) => {
      if (item.product.id === productId) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    updateCartState(newCart);
  };

  const deleteBasketItem = (productId: string) => {
    const newCart = quoteCart.filter((item) => item.product.id !== productId);
    updateCartState(newCart);
  };

  const handleSubmitRequest = async () => {
    if (quoteCart.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = quoteCart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const result = await submitQuoteRequest(payload);

      if (result.success) {
        toast.success(`Quote ${result.referenceNo} submitted! Admin has been notified.`);
        setFormSubmitted(true);
        updateCartState([]);
      }
    } catch (error: any) {
      toast.error(error.message || 'Please log in to submit a quote request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingMessage(true);
    try {
      await submitDirectMessage(supportFormData);

      // Enhanced Toast Notification informing user of contact channels and spam check
      toast.success('Message sent successfully!', {
        description: 'We will reach out to you shortly via phone or email. Please endeavor to check your spam folder if you do not see a reply in your inbox.',
        duration: 7000,
      });

      setShowSupportForm(false);
      setSupportFormData((prev) => ({ ...prev, message: '' }));
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleSupportClick = () => {
    if (typeof window !== 'undefined' && (window as any).Tawk_API?.maximize) {
      (window as any).Tawk_API.maximize();
    } else {
      setIsSupportOpen(!isSupportOpen);
      setIsBasketOpen(false);
    }
  };

  const totalBasketItemCount = quoteCart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col sm:flex-row items-center bg-card border border-border/80 shadow-2xl rounded-2xl sm:rounded-full p-1.5 gap-1 backdrop-blur-md bg-card/95">
        
        {/* Quote Basket Popover */}
        <Popover open={isBasketOpen} onOpenChange={(open) => { setIsBasketOpen(open); if (open) setIsSupportOpen(false); }}>
          <PopoverTrigger asChild>
            <button className="relative flex items-center justify-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-full hover:bg-accent transition-colors text-xs font-medium text-foreground w-full sm:w-auto">
              <ShoppingBag className="h-5 w-5 sm:h-4 sm:w-4 text-blue-600" />
              <span className="hidden sm:inline">Quote Basket</span>
              {totalBasketItemCount > 0 ? (
                <span className="absolute -top-1 -right-1 sm:relative sm:top-0 sm:right-0 bg-blue-600 text-white text-[10px] font-extrabold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalBasketItemCount}
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground sm:inline hidden">(0)</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent 
            align="end" 
            sideOffset={14} 
            className="w-[340px] sm:w-[380px] p-4 shadow-2xl border-border bg-card text-card-foreground rounded-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-blue-600" /> Quotation Request Basket
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsBasketOpen(false)} className="h-6 w-6 text-muted-foreground">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {formSubmitted ? (
              <div className="text-center py-6 bg-emerald-500/10 text-emerald-600 rounded-lg p-3 space-y-2 border border-emerald-500/20">
                <CheckCircle className="h-8 w-8 mx-auto" />
                <p className="text-xs font-bold">Request Compiled Successfully</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Our logistics specialists across our branch layers are reviewing specifications to draft precise pricing timelines and will reach you via supplied contact or on this platform!</p>
              </div>
            ) : quoteCart.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg space-y-1.5">
                <Package className="h-6 w-6 mx-auto opacity-40" />
                <p className="text-[11px]">Your quotation basket is empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1">
                  {quoteCart.map((item) => (
                    <div key={item.product.id} className="flex flex-col gap-1.5 pb-2 border-b border-border/40 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start text-[11px]">
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-foreground truncate">{item.product.name}</p>
                          <p className="text-[9px] text-muted-foreground uppercase">{item.product.category_name}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteBasketItem(item.product.id)}
                          className="h-5 w-5 text-muted-foreground hover:text-destructive shrink-0 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between bg-muted/50 p-1 rounded-md border border-border/40">
                        <span className="text-[10px] font-medium px-1 text-muted-foreground">Quantity</span>
                        <div className="flex items-center gap-1 bg-background border border-border/60 rounded p-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => adjustBasketQuantity(item.product.id, -1)}
                            className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </Button>
                          <span className="font-bold text-foreground text-center min-w-[20px] text-xs">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => adjustBasketQuantity(item.product.id, 1)}
                            className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border/60">
                  <Button 
                    onClick={handleSubmitRequest} 
                    disabled={isSubmitting}
                    className="w-full text-xs h-9 gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {isSubmitting ? 'Submitting...' : `Submit Request (${totalBasketItemCount} items)`}
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Divider */}
        <div className="w-full h-[1px] sm:w-[1px] sm:h-5 bg-border/80 my-0.5 sm:my-auto" />

        {/* Support Popover with Integrated Direct Message Form */}
        <Popover open={isSupportOpen} onOpenChange={(open) => { setIsSupportOpen(open); if (open) setIsBasketOpen(false); }}>
          <PopoverTrigger asChild>
            <button 
              onClick={handleSupportClick}
              className="flex items-center justify-center gap-2 p-2.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-full hover:bg-accent transition-colors text-xs font-medium text-foreground w-full sm:w-auto"
            >
              <Headphones className="h-5 w-5 sm:h-4 sm:w-4 text-emerald-600" />
              <span className="hidden sm:inline">Support</span>
            </button>
          </PopoverTrigger>
          <PopoverContent 
            align="end" 
            sideOffset={14} 
            className="w-[320px] sm:w-[360px] p-4 shadow-2xl border-border bg-card text-card-foreground rounded-xl space-y-3 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Headphones className="h-4 w-4 text-emerald-600" /> Admin Support
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsSupportOpen(false)} className="h-6 w-6 text-muted-foreground">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Address & Head Office Info Box */}
            <div className="bg-muted/70 p-2.5 rounded-lg text-xs text-muted-foreground space-y-1.5 border border-border/40">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-[11px] leading-tight">
                  <strong className="text-foreground">Head Office:</strong> Ilesa Road, directly opposite OAUTHC Phase 1 in Ile-Ife, Osun State.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <p className="text-[11px]">+234 806 784 4732 (Lagos & Ife)</p>
              </div>
            </div>

            {/* Toggle Between Direct Message Form and Quick Contacts */}
            {showSupportForm ? (
              <form onSubmit={handleSendDirectMessage} className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground">Send Direct Message</span>
                  <button 
                    type="button" 
                    onClick={() => setShowSupportForm(false)} 
                    className="text-[10px] text-blue-600 underline"
                  >
                    Back to options
                  </button>
                </div>

                <Input 
                  placeholder="Your Name" 
                  value={supportFormData.name}
                  onChange={(e) => setSupportFormData({ ...supportFormData, name: e.target.value })}
                  required 
                  className="h-8 text-xs"
                />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  value={supportFormData.email}
                  onChange={(e) => setSupportFormData({ ...supportFormData, email: e.target.value })}
                  required 
                  className="h-8 text-xs"
                />
                <Input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={supportFormData.phone}
                  onChange={(e) => setSupportFormData({ ...supportFormData, phone: e.target.value })}
                  required 
                  className="h-8 text-xs"
                />
                <Textarea 
                  placeholder="How can we help?" 
                  value={supportFormData.message}
                  onChange={(e) => setSupportFormData({ ...supportFormData, message: e.target.value })}
                  required 
                  className="min-h-[80px] text-xs resize-none"
                />

                <Button 
                  type="submit" 
                  disabled={isSendingMessage} 
                  className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {isSendingMessage ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-2 pt-1">
                <Button 
                  onClick={() => setShowSupportForm(true)}
                  className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Direct Message
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-semibold">Or reach out via</span>
                  </div>
                </div>

                <a 
                  href="mailto:info@mail.depeeventures.com" 
                  className="flex items-center gap-2 text-xs p-2 rounded-md hover:bg-muted transition-colors border border-border/40"
                >
                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                  <span className="truncate">Email Admin</span>
                </a>
                <a 
                  href="tel:+2348067844732" 
                  className="flex items-center gap-2 text-xs p-2 rounded-md hover:bg-muted transition-colors border border-border/40"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Call Office</span>
                </a>
                <a 
                  href="https://wa.me/2348067844732" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs p-2 rounded-md hover:bg-muted transition-colors border border-border/40"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span>WhatsApp Office</span>
                </a>
              </div>
            )}
          </PopoverContent>
        </Popover>

      </div>
    </div>
  );
}