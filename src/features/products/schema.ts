// src/features/products/schemas.ts
import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  specification: z.string().min(1, 'Specification is required'),
  category_id: z.string().min(1, 'Category is required'),
  images: z
    .array(z.string().url('Must be a valid URL'))
    .min(1, 'At least one image is required'),
  is_featured: z.boolean().default(false),
  is_hot_deal: z.boolean().default(false),
  is_premium: z.boolean().default(false),
});

export interface DBProduct {
  id: string;
  name: string;
  description: string;
  specification: string;
  images: string[];
  image?: string; // Kept for backward compatibility
  category_id: string;
  category_name?: string;
  created_at?: string;
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