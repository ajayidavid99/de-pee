// src/app/(public)/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getBlogPosts } from '@/features/blog/server/actions';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  
  if (!post) return {};
  
  return {
    title: `${post.title} | De-Pee Medical Insights`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="w-full bg-background pt-[var(--app-header-height)] pb-20">
      <div className="mx-auto max-w-3xl px-4 lg:px-6 py-8">
        
        {/* Back Navigation Action */}
        <div className="mb-6">
          <Link href="/blog" passHref>
            <Button variant="ghost" size="sm" className="text-xs gap-1.5 pl-0 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Insights Hub
            </Button>
          </Link>
        </div>

        {/* Article Meta Header */}
        <header className="space-y-4 mb-8">
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-2 py-1 rounded-sm inline-block">
            {post.category_label}
          </span>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight font-sans">
            {post.title}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed italic border-l-2 border-primary/40 pl-4">
            {post.excerpt}
          </p>

          <div className="pt-4 border-y border-border/60 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center border border-border">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{post.author_name}</p>
                <p className="text-[10px] text-muted-foreground/80">{post.author_role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.published_at}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.read_time}</span>
            </div>
          </div>
        </header>

        {/* Featured Banner Image */}
        <div className="w-full h-64 sm:h-96 bg-muted rounded-2xl overflow-hidden border border-border/80 mb-10 shadow-xs">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </div>

        {/* Article Core Content Body */}
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground leading-relaxed space-y-6 whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Content Footer / Trust Banner */}
        <footer className="mt-12 pt-6 border-t border-border/60">
          <div className="bg-muted/30 border border-border/60 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-foreground">Verified Medical Information Notice</h4>
              <p className="text-[11px] text-muted-foreground leading-normal">
                This advisory catalog analysis is compiled for educational procurement guidance. Clinical teams must cross-verify exact hardware layouts with manufacturer installation manuals before deployment.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </article>
  );
}