// de-pee/src/components/shared/blog-hub.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_POSTS, type BlogPost } from '@/features/blog/data';
import { Calendar, Clock, ArrowRight, BookOpen, Flame } from 'lucide-react';
import Link from 'next/link';

export default function BlogHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Insights' },
    { id: 'procurement', label: 'Procurement' },
    { id: 'equipment', label: 'Equipment Guides' },
    { id: 'clinical', label: 'Clinical Operations' },
    { id: 'industry', label: 'Trends' },
  ];

  // Early safeguard check for empty state arrays
  if (!MOCK_POSTS || MOCK_POSTS.length === 0) {
    return (
      <div className="w-full text-center py-20 text-muted-foreground text-sm">
        No articles found. Check back later!
      </div>
    );
  }

// The trailing '!' explicitly tells TypeScript that this element is guaranteed to exist
const featuredPost = MOCK_POSTS.find((p) => p.featured) ?? MOCK_POSTS[0]!;
  
  const regularPosts = MOCK_POSTS.filter(p => 
    p.id !== featuredPost.id && (selectedCategory === 'all' || p.category === selectedCategory)
  );

  const trendingInsights = MOCK_POSTS.slice(0, 3);

  return (
    <div className="w-full bg-background pt-[var(--app-header-height)] pb-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-8">
        
        {/* Page Intent Header */}
        <div className="border-b border-border/60 pb-6 mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">Medical Insights & Resource Hub</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Clinical guidance, procurement optimization strategies, and biomedical updates compiled by our advisory network.
          </p>
        </div>

        {/* Master layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* LEFT & CENTER ZONE: Primary Content Feed */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* 1. Hero Spotlight Block (Only visible when filtering 'All') */}
            {selectedCategory === 'all' && (
              <div className="group relative rounded-2xl border border-border/80 overflow-hidden bg-card shadow-xs transition-all hover:shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-64 md:h-full min-h-[300px] relative overflow-hidden bg-muted">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-[1.02] duration-500"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-2 py-1 rounded-sm">
                        Spotlight Feature
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <span>{featuredPost.author.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featuredPost.readTime}</span>
                        </div>
                        
                        {/* Wrap this button with Link */}
                        <Link href={`/blog/${featuredPost.slug}`} className="inline-block">
                            <Button variant="ghost" size="sm" className="text-xs gap-1 h-8 px-2 pr-0 group-hover:text-primary">
                            Read Analysis <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        </Link>
                        </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Category Navigation System */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/40 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 3. Article Stream Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {regularPosts.map((post) => (
                <Card key={post.id} className="group p-4 flex flex-col justify-between border border-border/60 hover:border-border/100 transition-all bg-card overflow-hidden">
                <div className="space-y-3">
                    
                    <Link href={`/blog/${post.slug}`}>
                    <div className="w-full h-44 bg-muted rounded-xl overflow-hidden relative mb-1 cursor-pointer">
                        <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                        <span className="absolute top-3 left-3 text-[9px] font-bold tracking-wider uppercase bg-background/90 text-foreground px-2 py-0.5 rounded shadow-xs">
                        {post.categoryLabel}
                        </span>
                    </div>
                    </Link>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.publishedAt}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                    </div>

                    {/* Wrap the heading text so it's clickable */}
                    <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                    </h3>
                    </Link>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                    </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-foreground truncate max-w-[140px]">
                    {post.author.name}
                    </span>
                    
                    {/* Change the button element directly into a Next.js Link style */}
                    <Link 
                    href={`/blog/${post.slug}`} 
                    className="text-xs font-bold text-primary group-hover:underline transition-all"
                    >
                    Read Article →
                    </Link>
                </div>
                </Card>
              ))}
            </div>

          </div>

          {/* RIGHT ZONE: Sticky Secondary Sidebar Info */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-[calc(var(--app-header-height)+2rem)]">
            
            {/* Sidebar Box 1: Trending Insights Portfolio */}
            <div className="bg-muted/30 border border-border/80 rounded-2xl p-5">
              <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
                <Flame className="h-4 w-4 text-orange-500" />
                <h2 className="text-xs uppercase font-extrabold tracking-wider text-foreground">Trending Briefings</h2>
              </div>
              
              <div className="space-y-4">
                {trendingInsights.map((trend, index) => (
                  <div key={trend.id} className="group/item flex gap-3 items-start text-xs border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <span className="font-mono text-base font-bold text-muted-foreground/50 group-hover/item:text-primary transition-colors">
                      0{index + 1}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-primary font-bold">
                        {trend.categoryLabel}
                      </p>
                      <h4 className="font-semibold text-foreground leading-snug group-hover/item:text-primary transition-colors line-clamp-2">
                        {trend.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Box 2: Institutional Newsletter Sign-up */}
            <div className="border border-border/80 rounded-2xl p-5 bg-linear-to-b from-card to-muted/20 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Clinical Digests</h3>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Receive monthly breakdowns on healthcare procurement benchmarks, equipment maintenance intervals, and standard medical updates straight to your inbox.
              </p>
              <div className="space-y-2 pt-1">
                <input 
                  type="email" 
                  placeholder="hospital-email@domain.com" 
                  className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs focus:outline-hidden focus:ring-1 focus:ring-ring"
                />
                <Button size="sm" className="w-full text-[11px] h-8 font-medium">
                  Subscribe to Digest
                </Button>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}