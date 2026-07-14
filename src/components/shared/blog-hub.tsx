// src/components/shared/blog-hub.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, ArrowRight, BookOpen, Search } from 'lucide-react';
import type { BlogPost } from '@/features/blog/server/actions';

interface BlogHubProps {
  initialPosts?: BlogPost[]; // Mark as optional so both static fallback and server-side fetching work!
}

export default function BlogHub({ initialPosts = [] }: BlogHubProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts based on user search input
  const filteredPosts = initialPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category_label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-background pt-[var(--app-header-height)] pb-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Insights & Resources
          </h1>
          <p className="text-sm text-muted-foreground">
            Read the latest clinical breakdowns, medical hardware management playbooks, and West African equipment procurement indexes.
          </p>
          
          {/* Search bar */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-muted/40"
            />
          </div>
        </div>

        {/* Grid Layout */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto opacity-40 mb-2" />
            <p className="text-xs">No articles matching your search criteria were found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group overflow-hidden flex flex-col border-border/60 hover:border-border transition duration-200">
                <div className="relative h-48 w-full bg-muted overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <span className="absolute top-3 left-3 text-[9px] uppercase font-bold bg-background/95 text-foreground px-2 py-0.5 rounded shadow-xs">
                    {post.category_label}
                  </span>
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.published_at}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.read_time}</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-border/40">
                    <span className="text-[10px] font-medium text-muted-foreground">By {post.author_name}</span>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline">
                      Read more <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}