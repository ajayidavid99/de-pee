'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES, type Product } from '@/features/products/data';
import { ShoppingBag, FileText, CheckCircle, Package } from 'lucide-react';

export default function ProductCatalog() {
  const [activeTab, setActiveTab] = useState('all');
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [quoteCart, setQuoteCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleQuantityChange = (productId: string, val: string) => {
    // Only allow positive numbers or empty strings
    if (val === '' || /^\d+$/.test(val)) {
      setQuantities((prev) => ({ ...prev, [productId]: val }));
    }
  };

  const addToQuote = (product: Product) => {
    const qtyNum = parseInt(quantities[product.id] || '0', 10);
    if (qtyNum <= 0) return;

    setQuoteCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: qtyNum } : item
        );
      }
      return [...prev, { product, quantity: qtyNum }];
    });
  };

  const filteredProducts = activeTab === 'all'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <div className="w-full bg-background pt-[var(--app-header-height)] pb-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-6">
        
        {/* Header Block */}
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Product Portfolio</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Select items from our certified diagnostics, surgical instruments, and consumables categories. 
            Specify your required quantities below to build a quick quotation draft.
          </p>
        </div>

        {/* 2-Column Working Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* LEFT: Categories and Catalog items */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Horizontal Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/60 scrollbar-none">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
                    activeTab === cat.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/40 text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Product Item Cards Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="p-5 border border-border/80 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded-sm">
                      {product.category}
                    </span>
                    <h3 className="text-base font-bold text-foreground leading-snug">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                    <p className="text-[11px] text-muted-foreground/80 bg-muted/40 p-2 rounded border border-border/40 font-mono">
                      Spec: {product.specification}
                    </p>
                  </div>

                  {/* Pricing is Hidden - Custom Quote Input Section as requested */}
                  <div className="mt-5 pt-4 border-t border-border/40 flex flex-col gap-3">[cite: 8]
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Qty Needed:</label>[cite: 8]
                      <Input
                        type="text"
                        placeholder="e.g. 50"
                        value={quantities[product.id] || ''}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="h-8 text-xs w-24 text-center"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToQuote(product)}
                      disabled={!quantities[product.id]}
                      className="w-full text-xs h-8"
                    >
                      Add to Quote Request[cite: 8]
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

          </div>

          {/* RIGHT: Live Quote Cart Drawer Summary */}
          <aside className="lg:col-span-1 bg-muted/30 border border-border/80 rounded-2xl p-5 lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)]">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Quote Draft Summary</h2>
            </div>

            {formSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                <h3 className="text-xs font-bold text-foreground">Request Received!</h3>
                <p className="text-[11px] text-muted-foreground">Our team in Lagos or Ife will compile pricing benchmarks and contact you shortly.[cite: 8]</p>
                <Button size="sm" variant="outline" onClick={() => { setFormSubmitted(false); setQuoteCart([]); }} className="mt-2 text-[10px] h-7">New Quote</Button>
              </div>
            ) : quoteCart.length === 0 ? (
              <div className="text-center py-8 space-y-2 text-muted-foreground">
                <Package className="h-6 w-6 mx-auto opacity-40" />
                <p className="text-xs">No items selected yet. Set a quantity to build your package request.[cite: 8]</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                  {quoteCart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-start text-xs border-b border-border/40 pb-2">
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-foreground truncate">{item.product.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{item.product.category}</p>
                      </div>
                      <span className="font-bold text-primary shrink-0 bg-primary/10 px-2 py-0.5 rounded text-[10px]">
                        {item.quantity} units
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={() => setFormSubmitted(true)} 
                    className="w-full text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Submit Full Quote Request[cite: 8]
                  </Button>
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
    </div>
  );
}