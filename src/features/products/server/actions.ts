// src/features/products/server/actions.ts
'use server';

import { put, del } from '@vercel/blob';
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
  category_name?: string;
  created_at?: string;
  // Trend Management Flags
  is_featured?: boolean;
  is_hot_deal?: boolean;
  is_premium?: boolean;
}

export interface DBCategory {
  id: string;
  name: string;
  parent_id: string | null;
  image?: string | null;
}

export async function toggleProductTrend(
  productId: string,
  flag: 'is_featured' | 'is_hot_deal' | 'is_premium',
  value: boolean
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized operational action.');
  }

  try {
    await db.query(
      `UPDATE products SET ${flag} = $1 WHERE id = $2`,
      [value, productId]
    );

    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to update product trend flag:', error);
    return { success: false, error: 'Database update failed' };
  }
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
        p.is_featured,
        p.is_hot_deal,
        p.is_premium,
        p.created_at,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC NULLS LAST, p.id DESC
    `);
    
    return (result.rows || []).map((row: any) => ({
      id: String(row.id || ''),
      name: String(row.name || ''),
      description: String(row.description || ''),
      specification: String(row.specification || ''),
      image: String(row.image || ''),
      category_id: String(row.category_id || ''),
      category_name: String(row.category_name || 'Unassigned'),
      is_featured: Boolean(row.is_featured),
      is_hot_deal: Boolean(row.is_hot_deal),
      is_premium: Boolean(row.is_premium),
      created_at: row.created_at ? String(row.created_at) : undefined,
    }));
  } catch (error) {
    console.error("Failed to query products from Neon:", error);
    return [];
  }
}

export async function getCategories(): Promise<DBCategory[]> {
  try {
    const result = await db.query('SELECT id, name, parent_id, image FROM categories ORDER BY name ASC');
    return (result.rows || []).map((row: any) => ({
      id: String(row.id || ''),
      name: String(row.name || ''),
      parent_id: row.parent_id ? String(row.parent_id) : null,
      image: row.image ? String(row.image) : null,
    }));
  } catch (error) {
    console.error('Failed to query categories from Neon:', error);
    return [];
  }
}

export async function createCategory(formData: { name: string; parentId?: string | null; image?: string | null }) {
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
      `INSERT INTO categories (id, name, parent_id, image) VALUES ($1, $2, $3, $4)`,
      [id, formData.name, formData.parentId || null, formData.image || null]
    );

    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to create category:', error);
    throw new Error(error.message || 'Database error occurred.');
  }
}

export async function updateCategory(
  id: string,
  data: { name: string; parentId?: string | null; image?: string | null }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  await db.query(
    `UPDATE categories SET name = $1, parent_id = $2, image = $3 WHERE id = $4`,
    [data.name, data.parentId || null, data.image || null, id]
  );

  revalidatePath('/products');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const check = await db.query('SELECT id FROM products WHERE category_id = $1 LIMIT 1', [id]);
  if (check.rows.length > 0) {
    throw new Error('Cannot delete category because active products are assigned to it.');
  }

  await db.query('DELETE FROM categories WHERE id = $1', [id]);

  revalidatePath('/products');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function createProduct(formData: {
  name: string;
  description: string;
  specification: string;
  image: string;
  categoryId: string;
  is_featured?: boolean;
  is_hot_deal?: boolean;
  is_premium?: boolean;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized operational action.');
  }

  if (!formData.name || !formData.categoryId || !formData.image) {
    throw new Error('Missing mandatory product definition fields.');
  }

  const crypto = require('crypto');
  const uniqueId = `prod_${crypto.randomUUID()}`;

  try {
    await db.query(
      `INSERT INTO products (id, name, description, specification, image, category_id, is_featured, is_hot_deal, is_premium) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        uniqueId,
        formData.name,
        formData.description,
        formData.specification,
        formData.image,
        formData.categoryId,
        formData.is_featured ?? false,
        formData.is_hot_deal ?? false,
        formData.is_premium ?? false,
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

export async function deleteProduct(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized operational action.');
  }

  try {
    const productResult = await db.query('SELECT image FROM products WHERE id = $1', [id]);
    const product = productResult.rows[0];

    if (product && product.image) {
      try {
        await del(product.image);        
      } catch (error) {
        console.error('Failed to delete product image asset:', error);
      }
    }

    await db.query('DELETE FROM products WHERE id = $1', [id]);

    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete product and asset:', error);
    throw new Error(error.message || 'Error occurred during deletion.');
  }
}

export async function updateProductAction(
  id: string, 
  data: { 
    name: string; 
    description: string; 
    specification: string; 
    image: string;
    is_featured?: boolean;
    is_hot_deal?: boolean;
    is_premium?: boolean;
  }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  
  await db.query(
    `UPDATE products 
     SET name = $1, description = $2, specification = $3, image = $4, is_featured = $5, is_hot_deal = $6, is_premium = $7 
     WHERE id = $8`,
    [
      data.name, 
      data.description, 
      data.specification, 
      data.image, 
      data.is_featured ?? false, 
      data.is_hot_deal ?? false, 
      data.is_premium ?? false, 
      id
    ]
  );
  
  revalidatePath('/products');
  revalidatePath('/dashboard');
  return { success: true };
}