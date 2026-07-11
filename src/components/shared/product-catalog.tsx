//de-pee/src/components/shared/product-catalog.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES, type Product } from '@/features/products/data';
import { ShoppingBag, FileText, CheckCircle, Package, Layers } from 'lucide-react';

export default function ProductCatalog() {
  const [activeTab, setActiveTab] = useState('all');
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [quoteCart, setQuoteCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleQuantityChange = (productId: string, val: string) => {
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
      <div className="mx-auto max-w-[1600px] px-4 lg:px-6 py-6">
        
        {/* Header Block */}
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Product Portfolio</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Select items from our certified diagnostics, surgical instruments, and consumables categories.
            Specify your required quantities below to build a quick quotation draft.
          </p>
        </div>

        {/* 3-COLUMN MASTER DASHBOARD CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
          
          {/* 1. LEFT SIDEBAR: Categories (Sticky desktop, Dropdown mobile) */}
          <aside className="lg:col-span-1 lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)] space-y-3">
            <div className="hidden lg:flex items-center gap-2 border-b border-border pb-3 mb-2">
              <Layers className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Categories</h2>
            </div>

            {/* Mobile Dropdown Control */}
            <div className="block lg:hidden w-full mb-2">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-hidden"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Desktop Navigation List */}
            <div className="hidden lg:flex flex-col gap-1 max-h-[70vh] overflow-y-auto pr-1">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-all truncate ${
                    activeTab === cat.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>

          {/* 2. CENTER PIECE: Catalog Items Grid (2 columns on mobile, 3 columns on desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="p-3 sm:p-4 border border-border/80 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-2">
                    {/* Visual Mock-up Image Window */}
                    <div className="w-full h-28 sm:h-36 relative bg-muted rounded-md overflow-hidden mb-2 border border-border/40">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        loading="lazy"
                      />
                    </div>

                    <span className="text-[9px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded-sm inline-block">
                      {product.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight line-clamp-1">{product.name}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                    <p className="text-[10px] text-muted-foreground/80 bg-muted/40 p-1.5 rounded border border-border/40 font-mono truncate">
                      {product.specification}
                    </p>
                  </div>

                  {/* Operational Pricing Block */}
                  <div className="mt-4 pt-3 border-t border-border/40 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">Qty:</label>
                      <Input
                        type="text"
                        placeholder="e.g. 50"
                        value={quantities[product.id] || ''}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="h-7 text-xs w-16 text-center px-1"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToQuote(product)}
                      disabled={!quantities[product.id]}
                      className="w-full text-[11px] h-7"
                    >
                      Add to Quote
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 3. RIGHT SIDEBAR: Live Quote Cart Drawer Summary */}
          <aside className="lg:col-span-1 bg-muted/30 border border-border/80 rounded-2xl p-4 lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)]">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Quote Draft</h2>
            </div>

            {formSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle className="h-7 w-7 text-green-500 mx-auto" />
                <h3 className="text-xs font-bold text-foreground">Received!</h3>
                <p className="text-[10px] text-muted-foreground leading-normal">Our team in Lagos or Ife will contact you shortly.</p>
                <Button size="sm" variant="outline" onClick={() => { setFormSubmitted(false); setQuoteCart([]); }} className="mt-2 text-[10px] h-7 w-full">New Quote</Button>
              </div>
            ) : quoteCart.length === 0 ? (
              <div className="text-center py-8 space-y-2 text-muted-foreground">
                <Package className="h-5 w-5 mx-auto opacity-40" />
                <p className="text-[11px]">No items selected yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
                  {quoteCart.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-start text-[11px] border-b border-border/40 pb-2">
                      <div className="min-w-0 pr-1">
                        <p className="font-semibold text-foreground truncate">{item.product.name}</p>
                        <p className="text-[9px] text-muted-foreground uppercase">{item.product.category}</p>
                      </div>
                      <span className="font-bold text-primary shrink-0 bg-primary/10 px-1.5 py-0.5 rounded text-[9px]">
                        {item.quantity} u
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <Button 
                    onClick={() => setFormSubmitted(true)} 
                    className="w-full text-xs h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText className="h-3 w-3" />
                    Submit Request
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