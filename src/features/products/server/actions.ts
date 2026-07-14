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
    const query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.specification,
        p.image,
        p.category_id,
        c.name as category_name,
        c.parent_id as parent_category_id
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
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
    return result.rows;
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