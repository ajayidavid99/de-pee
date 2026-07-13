// src/features/products/server/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/features/auth/server/get-current-user';
// Import your Neon database connection client instance here
// import { db } from '@/libs/db'; 

export async function getProducts() {
  // Query to select all products joining category information
  // const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
  // return result.rows;
}

export async function createProduct(formData: {
  name: string;
  description: string;
  specification: string;
  image: string;
  categoryId: string;
}) {
  // 1. RBAC Check to ensure only admins can mutate data
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  // 2. Insert execution logic
  /*
  await db.query(
    `INSERT INTO products (name, description, specification, image, category_id) 
     VALUES ($1, $2, $3, $4, $5)`,
    [formData.name, formData.description, formData.specification, formData.image, formData.categoryId]
  );
  */

  // 3. Purge Next.js router cache to show newly added product instantly
  revalidatePath('/products');
  revalidatePath('/dashboard');
}