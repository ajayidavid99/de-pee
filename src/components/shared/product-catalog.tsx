// src/components/shared/product-catalog.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DBProduct } from '@/features/products/server/actions';
import { 
  Package, 
  Layers, 
  Info, 
  ChevronDown, 
  ChevronRight, 
  SlidersHorizontal 
} from 'lucide-react';
import Link from 'next/link';

interface ProductCatalogProps {
  initialProducts: DBProduct[];
  initialCategories: Array<{ id: string; name: string; parent_id: string | null }>;
}

interface CartItem {
  product: DBProduct;
  quantity: number;
}

export default function ProductCatalog({ initialProducts, initialCategories }: ProductCatalogProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [quoteCart, setQuoteCart] = useState<CartItem[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('depee_quote_basket');
    if (savedCart) {
      try {
        setQuoteCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse quote basket data:', e);
      }
    }
  }, []);

  const mainCategories = initialCategories.filter((c) => c.parent_id === null);
  
  const getSubCategories = (parentId: string) => 
    initialCategories.filter((c) => c.parent_id === parentId);

  const filteredProducts = initialProducts.filter((product) => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === 'all') return true;
    if (activeSubTab) return product.category_id === activeSubTab;
    
    const associatedChildIds = getSubCategories(activeTab).map((c) => c.id);
    return product.category_id === activeTab || associatedChildIds.includes(product.category_id);
  });

  const handleQuantityInputChange = (productId: string, val: string) => {
    if (val === '' || /^\d+$/.test(val)) {
      setQuantities((prev) => ({ ...prev, [productId]: val }));
    }
  };

  const addToQuote = (product: DBProduct) => {
    const qty = parseInt(quantities[product.id] || '1', 10);
    if (isNaN(qty) || qty <= 0) return;

    const existing = quoteCart.find((item) => item.product.id === product.id);
    let newCart: CartItem[];
    
    if (existing) {
      newCart = quoteCart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
      );
    } else {
      newCart = [...quoteCart, { product, quantity: qty }];
    }

    setQuoteCart(newCart);
    localStorage.setItem('depee_quote_basket', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated')); // Triggers sync in FloatingQuoteBasket

    setQuantities((prev) => ({ ...prev, [product.id]: '' }));
  };

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setActiveSubTab(null);
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground pt-[var(--app-header-height)] pb-16 relative">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-6">
        
        {/* Search & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-border/40 pb-4">
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight">Medical Equipment Portfolio</h1>
            <p className="text-xs text-muted-foreground">Premium healthcare materials and diagnostic platforms for Lagos & Ife centers.</p>
          </div>
          <div className="flex w-full sm:w-auto gap-2 items-center">
            <Input 
              placeholder="Search catalog items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 max-w-[240px] text-xs"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs md:hidden gap-1.5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
            </Button>
          </div>
        </div>

        {/* Dynamic 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* Navigation Sidebar */}
          <div className={`md:block space-y-2 ${isMobileMenuOpen ? 'block bg-muted/30 p-3 rounded-lg border' : 'hidden'}`}>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-2 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" /> Department Families
            </h3>
            
            <Button
              variant={activeTab === 'all' ? 'default' : 'ghost'}
              size="sm"
              className="w-full justify-start text-xs h-8 font-medium"
              onClick={() => handleTabSelect('all')}
            >
              <Package className="mr-2 h-3.5 w-3.5 opacity-70" />
              All Portfolio Items
            </Button>

            {mainCategories.map((category) => {
              const subCats = getSubCategories(category.id);
              const hasSubs = subCats.length > 0;
              const isCurrentParent = activeTab === category.id;

              return (
                <div key={category.id} className="space-y-0.5">
                  <div className="flex items-center w-full">
                    <Button
                      variant={isCurrentParent && !activeSubTab ? 'default' : 'ghost'}
                      size="sm"
                      className="flex-1 justify-start text-xs h-8 font-medium text-left truncate"
                      onClick={() => handleTabSelect(category.id)}
                    >
                      <span className="truncate">{category.name}</span>
                    </Button>
                    {hasSubs && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground shrink-0"
                        onClick={() => toggleCategoryExpand(category.id)}
                      >
                        {expandedCategories[category.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>

                  {hasSubs && expandedCategories[category.id] && (
                    <div className="pl-4 border-l border-border/60 ml-2 space-y-0.5 mt-0.5">
                      {subCats.map((sub) => (
                        <Button
                          key={sub.id}
                          variant={activeSubTab === sub.id ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start text-[11px] h-7 text-muted-foreground hover:text-foreground font-normal truncate"
                          onClick={() => {
                            setActiveTab(category.id);
                            setActiveSubTab(sub.id);
                          }}
                        >
                          {sub.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Product Cards Grid */}
          <div className="md:col-span-3 space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-muted/10 text-muted-foreground space-y-2">
                <Package className="h-8 w-8 mx-auto opacity-40" />
                <p className="text-xs">No matching medical items are logged in this family line.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="flex flex-col justify-between overflow-hidden border-border/60 hover:shadow-sm transition-shadow">
                    <div>
                      <div className="h-36 bg-muted relative border-b border-border/40 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-background/90 text-foreground text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border border-border/40">
                          {product.category_name}
                        </span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <h3 className="text-xs font-bold text-foreground line-clamp-1">{product.name}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 min-h-[32px] leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 pt-0 space-y-2 border-t border-border/30 mt-2 bg-muted/10">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center border border-border rounded-md bg-background overflow-hidden h-7 max-w-[75px]">
                          <Input
                            type="text"
                            placeholder="1"
                            value={quantities[product.id] ?? ''}
                            onChange={(e) => handleQuantityInputChange(product.id, e.target.value)}
                            className="h-full border-0 focus-visible:ring-0 text-center text-xs p-0 w-full font-bold"
                          />
                        </div>
                        <Button onClick={() => addToQuote(product)} size="sm" className="h-7 text-[10px] px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold flex-1">
                          Add to Request
                        </Button>
                      </div>
                      <Link href={`/products/${product.id}`} passHref>
                        <Button variant="ghost" className="w-full text-[10px] h-6 text-muted-foreground hover:text-foreground gap-1 p-0">
                          <Info className="h-3 w-3" /> Technical Specifications
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}