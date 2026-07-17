// src/features/products/server/actions.ts
'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/features/auth/server/get-current-user';
import { db } from '@/libs/db';


export interface DBProduct {
  id: string;
  name: string;
  description: string;
  specification: string;
  image: string;
  category_id: string;
  category_name: string;
  parent_category_id: string | null;
}

export interface DBCategory {
  id: string;
  name: string;
  parent_id: string | null;
}

export async function uploadImageAction(formData: FormData): Promise<string> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized operational action.');
  }

  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  // Upload to Vercel Blob with public access and random suffix to avoid collisions
  const blob = await put(`products/${file.name}`, file, {
    access: 'public',
  });

  return blob.url;
}

export async function getProducts(): Promise<DBProduct[]> {
  try {
    const result = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.specification,
        p.image,
        p.category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    
    return (result.rows || []).map((row: any) => ({
      id: String(row.id || ''),
      name: String(row.name || ''),
      description: String(row.description || ''),
      specification: String(row.specification || ''),
      image: String(row.image || ''),
      category_id: String(row.category_id || ''),
      category_name: String(row.category_name || 'Unassigned'),
      parent_category_id: row.parent_category_id ? String(row.parent_category_id) : null,
    }));
  } catch (error) {
    console.error("Failed to query products from Neon:", error);
    return [];
  }
}

/**
 * Fetches all categories and sub-categories to populate layout selectors and filters
 */
export async function getCategories(): Promise<DBCategory[]> {
  try {
    const result = await db.query('SELECT id, name, parent_id FROM categories ORDER BY name ASC');
    return (result.rows || []).map((row: any) => ({
      id: String(row.id || ''),
      name: String(row.name || ''),
      parent_id: row.parent_id ? String(row.parent_id) : null,
    }));
  } catch (error) {
    console.error('Failed to query categories from Neon:', error);
    return [];
  }
}

/**
 * Creates a new category or sub-category dynamically
 */
export async function createCategory(formData: { name: string; parentId?: string | null }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  if (!formData.name) {
    throw new Error('Category name is required.');
  }

  const id = formData.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  try {
    await db.query(
      `INSERT INTO categories (id, name, parent_id) VALUES ($1, $2, $3)`,
      [id, formData.name, formData.parentId || null]
    );

    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to create category:', error);
    throw new Error(error.message || 'Database error occurred.');
  }
}

/**
 * Commits a validated medical instrument entry into storage using the "prod_" prefixed ID standard
 */
export async function createProduct(formData: {
  name: string;
  description: string;
  specification: string;
  image: string;
  categoryId: string;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized operational action.');
  }

  if (!formData.name || !formData.categoryId || !formData.image) {
    throw new Error('Missing mandatory product definition fields.');
  }

  // Generate an industry-standard prefixed ID (e.g., prod_8f1a23...)
  const crypto = require('crypto');
  const uniqueId = `prod_${crypto.randomUUID()}`;

  try {
    await db.query(
      `INSERT INTO products (id, name, description, specification, image, category_id) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        uniqueId,
        formData.name,
        formData.description,
        formData.specification,
        formData.image,
        formData.categoryId,
      ],
    );

    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Neon catalog insertion failure:', error);
    throw new Error(error.message || 'Database transaction anomaly encountered.');
  }
}