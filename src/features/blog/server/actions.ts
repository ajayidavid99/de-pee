// src/features/blog/server/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/features/auth/server/get-current-user';
import { db } from '@/libs/db';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category_label: string;
  author_name: string;
  author_role: string;
  image: string;
  read_time: string;
  published_at: string;
  created_at?: string;
}

/**
 * Fetches all blog posts from the Postgres database
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const result = await db.query(
      'SELECT * FROM blog_posts ORDER BY created_at DESC'
    );
    return (result.rows || []).map((row: any) => ({
      id: String(row.id),
      slug: String(row.slug),
      title: String(row.title),
      excerpt: String(row.excerpt),
      content: String(row.content),
      category_label: String(row.category_label),
      author_name: String(row.author_name),
      author_role: String(row.author_role),
      image: String(row.image),
      read_time: String(row.read_time),
      published_at: String(row.published_at),
    }));
  } catch (error) {
    console.error('Failed to query blog posts:', error);
    return [];
  }
}

/**
 * Creates a new blog post
 */
export async function createBlogPost(formData: {
  title: string;
  excerpt: string;
  content: string;
  categoryLabel: string;
  authorName: string;
  authorRole: string;
  image: string;
  readTime: string;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized operational action.');
  }

  if (!formData.title || !formData.content || !formData.image) {
    throw new Error('Missing mandatory blog entry fields.');
  }

  // Generate slug from title
  const slug = formData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

//Standard, environment-agnostic generation:
const uniqueId = `post_${globalThis.crypto ? globalThis.crypto.randomUUID() : Math.random().toString(36).substring(2, 15)}`;

  const publishedAt = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  try {
    await db.query(
      `INSERT INTO blog_posts (id, slug, title, excerpt, content, category_label, author_name, author_role, image, read_time, published_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        uniqueId,
        slug,
        formData.title,
        formData.excerpt,
        formData.content,
        formData.categoryLabel,
        formData.authorName,
        formData.authorRole,
        formData.image,
        formData.readTime,
        publishedAt,
      ]
    );

    revalidatePath('/blog');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to insert blog post:', error);
    throw new Error(error.message || 'Database transaction error.');
  }
}