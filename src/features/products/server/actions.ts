// de-pee/src/features/products/server/actions.ts
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
export async function getCategories() {
  try {
    const result = await db.query('SELECT id, name, parent_id FROM categories ORDER BY name ASC');
    return result.rows;
  } catch (error) {
    console.error('Failed to query categories from Neon:', error);
    return [];
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
  // 1. Role-Based Access Control Check
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized operational action.');
  }

  // 2. Form Input Sanity Validation
  if (!formData.name || !formData.categoryId || !formData.image) {
    throw new Error('Missing mandatory product definition strings.');
  }

  try {
    // 3. Execution payload run against serverless pool
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

    // 4. Invalidate Next.js cache layers so updates manifest automatically
    revalidatePath('/products');
    revalidatePath('/dashboard');
  } catch (error: any) {
    console.error('Neon catalog insertion failure:', error);
    throw new Error(error.message || 'Database transaction anomaly encountered.');
  }
}