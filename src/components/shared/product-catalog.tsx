// de-pee/src/components/shared/product-catalog.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES, type Product } from '@/features/products/data';
import { ShoppingBag, FileText, CheckCircle, Package, Layers, Info, ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function ProductCatalog() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ surgical: true });
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [quoteCart, setQuoteCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleQuantityChange = (productId: string, val: string) => {
    if (val === '' || /^\d+$/.test(val)) {
      setQuantities((prev) => ({ ...prev, [productId]: val }));
    }
  };

  const toggleExpand = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering full category change when using the chevron toggle arrow
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const selectCategory = (catId: string) => {
    setActiveTab(catId);
    setActiveSubTab(null);
    setIsMobileMenuOpen(false);
  };

  const selectSubCategory = (catId: string, subCatId: string) => {
    setActiveTab(catId);
    setActiveSubTab(subCatId);
    setIsMobileMenuOpen(false);
  };

  const addToQuote = (product: Product) => {
    const qtyStr = quantities[product.id] === '' ? '0' : (quantities[product.id] || '1');
    const qtyNum = parseInt(qtyStr, 10) || 1;
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

  // Hierarchy filter implementation
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    if (activeTab === 'all') return true;
    if (activeSubTab) return product.subCategory === activeSubTab;
    return product.category === activeTab;
  });

  const getActiveLabel = () => {
    if (activeTab === 'all') return 'All Products';
    const mainCat = PRODUCT_CATEGORIES.find(c => c.id === activeTab);
    if (!mainCat) return 'Select Category';
    if (activeSubTab) {
      const subCat = mainCat.subCategories?.find(s => s.id === activeSubTab);
      return `${mainCat.name} › ${subCat?.name}`;
    }
    return mainCat.name;
  };

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
          
          {/* 1. LEFT SIDEBAR: Categories */}
          <aside className="lg:col-span-1 lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)] space-y-3">
            <div className="hidden lg:flex items-center gap-2 border-b border-border pb-3 mb-2">
              <Layers className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground">Categories</h2>
            </div>

            {/* Mobile Popover UI Selector */}
            <div className="block lg:hidden w-full mb-2">
              <Popover open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between h-11 text-xs px-3 font-medium">
                    <span className="flex items-center gap-2 truncate">
                      <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {getActiveLabel()}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] p-2 max-h-[75vh] overflow-y-auto" align="start">
                  <div className="flex flex-col gap-1">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="space-y-1">
                        <div 
                          onClick={() => selectCategory(cat.id)}
                          className={`flex items-center justify-between w-full text-left px-3 py-2.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                            activeTab === cat.id && !activeSubTab
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {cat.subCategories && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0 hover:bg-transparent"
                              onClick={(e) => toggleExpand(cat.id, e)}
                            >
                              {expandedCategories[cat.id] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                            </Button>
                          )}
                        </div>

                        {cat.subCategories && expandedCategories[cat.id] && (
                          <div className="pl-4 pr-1 flex flex-col gap-1 border-l border-border/60 ml-3">
                            {cat.subCategories.map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => selectSubCategory(cat.id, sub.id)}
                                className={`w-full text-left px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                                  activeSubTab === sub.id
                                    ? 'bg-secondary text-secondary-foreground font-bold'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Desktop Navigation Tree List */}
            <div className="hidden lg:flex flex-col gap-1 max-h-[70vh] overflow-y-auto pr-1">
              {PRODUCT_CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex flex-col w-full">
                  <div
                    onClick={() => selectCategory(cat.id)}
                    className={`group flex items-center justify-between w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      activeTab === cat.id && !activeSubTab
                        ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {cat.subCategories && (
                      <span 
                        onClick={(e) => toggleExpand(cat.id, e)}
                        className="p-0.5 rounded-md hover:bg-foreground/10 text-muted-foreground transition-colors group-hover:text-inherit"
                      >
                        {expandedCategories[cat.id] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </span>
                    )}
                  </div>

                  {/* Desktop Sub-categories Render Block */}
                  {cat.subCategories && expandedCategories[cat.id] && (
                    <div className="flex flex-col border-l border-border/80 ml-3.5 pl-2 mt-1 gap-0.5">
                      {cat.subCategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => selectSubCategory(cat.id, sub.id)}
                          className={`w-full text-left px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all truncate ${
                            activeSubTab === sub.id
                              ? 'bg-muted text-foreground font-semibold border-r-2 border-primary rounded-r-none'
                              : 'text-muted-foreground/90 hover:bg-muted/40 hover:text-foreground'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* 2. CENTER PIECE: Catalog Items Grid */}
          <div className="lg:col-span-4 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-xl space-y-2">
                <Package className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">No equipment fits this selection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="p-3 sm:p-4 border border-border/80 flex flex-col justify-between overflow-hidden">
                    <div className="space-y-2">
                      <Link href={`/products/${product.id}`}>
                        <div className="w-full h-28 sm:h-36 relative bg-muted rounded-md overflow-hidden mb-2 border border-border/40 cursor-pointer">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                            loading="lazy"
                          />
                        </div>
                      </Link>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded-sm inline-block">
                          {product.category}
                        </span>
                        {product.subCategory && (
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider bg-muted px-2 py-0.5 rounded-sm inline-block">
                            {product.subCategory.replace('-', ' ')}
                          </span>
                        )}
                      </div>
                      
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight line-clamp-1 hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
                      </Link>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                      <p className="text-[10px] text-muted-foreground/80 bg-muted/40 p-1.5 rounded border border-border/40 font-mono truncate">
                        {product.specification}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">Qty:</label>
                        <Input
                          type="text"
                          placeholder="1"
                          value={quantities[product.id] === undefined ? '1' : quantities[product.id]}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          className="h-7 text-xs w-16 text-center px-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        <Button
                          size="sm"
                          onClick={() => addToQuote(product)}
                          className="w-full text-[11px] h-7"
                        >
                          Add to Quote
                        </Button>
                        
                        <Link href={`/products/${product.id}`} className="w-full">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-[11px] h-7 gap-1"
                          >
                            <Info className="h-3 w-3" />
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* 3. RIGHT SIDEBAR: Live Quote Cart */}
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