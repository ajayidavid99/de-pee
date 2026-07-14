// src/features/products/server/actions.ts
'use server';

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

/**
 * Fetches all products with joined category definitions directly from Neon
 */

export async function getProducts(): Promise<DBProduct[]> {
  try {
    // We use LEFT JOIN so products with orphaned or missing categories still return rather than breaking the query
    const query = `
      SELECT 
        p.id,
        COALESCE(p.name, 'Unnamed Product') as name,
        COALESCE(p.description, '') as description,
        COALESCE(p.specification, '') as specification,
        COALESCE(p.image, '') as image,
        COALESCE(p.category_id, '') as category_id,
        COALESCE(c.name, 'Unassigned') as category_name,
        c.parent_id as parent_category_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(query);
    
    // Explicitly sanitize database output to prevent Next.js serialization bugs
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
    console.error('Failed to query products from Neon:', error);
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

  // Sluggify the name to generate a clean ID (e.g. "Surgical Equipment" -> "surgical-equipment")
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
 * Commits a validated medical instrument entry into storage after validating permissions
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
    throw new Error('Missing mandatory product definition strings.');
  }

  try {
    await db.query(
      `INSERT INTO products (name, description, specification, image, category_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        formData.name,
        formData.description,
        formData.specification,
        formData.image,
        formData.categoryId,
      ],
    );

    revalidatePath('/products');
    revalidatePath('/dashboard');
  } catch (error: any) {
    console.error('Neon catalog insertion failure:', error);
    throw new Error(error.message || 'Database transaction anomaly encountered.');
  }
}