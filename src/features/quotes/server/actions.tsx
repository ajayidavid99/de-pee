// src/features/quotes/server/actions.ts
'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/features/auth/server/get-current-user';
import { db } from '@/libs/db';

export interface QuoteItemPayload {
  productId: string;
  quantity: number;
}

export interface DBQuote {
  id: string;
  reference_no: string;
  user_id: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'QUOTED' | 'REJECTED';
  total_items: number;
  notes?: string | null;
  created_at: string;
}

export interface DBQuoteDetail extends DBQuote {
  items: Array<{
    id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    category_name: string;
    quantity: number;
  }>;
}

export interface AdminQuoteSummary extends DBQuote {
  user_name?: string;
  user_email?: string;
}

export async function submitQuoteRequest(items: QuoteItemPayload[], notes?: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to submit a quote request.');
  }

  if (!items || items.length === 0) {
    throw new Error('Basket is empty.');
  }

  const quoteId = `quote_${crypto.randomUUID()}`;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const referenceNo = `REQ-${dateStr}-${randomSuffix}`;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  await db.query(
    `INSERT INTO quotes (id, reference_no, user_id, status, total_items, notes)
     VALUES ($1, $2, $3, 'PENDING', $4, $5)`,
    [quoteId, referenceNo, String(user.id), totalItems, notes || null]
  );

  for (const item of items) {
    const itemId = `qitem_${crypto.randomUUID()}`;
    await db.query(
      `INSERT INTO quote_items (id, quote_id, product_id, quantity)
       VALUES ($1, $2, $3, $4)`,
      [itemId, quoteId, String(item.productId), item.quantity]
    );
  }

  revalidatePath('/dashboard');
  revalidatePath('/admin/quotes');
  return { success: true, referenceNo, quoteId };
}

export async function getUserQuotes(): Promise<DBQuote[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const result = await db.query(
      `SELECT id, reference_no, user_id, status, total_items, notes, created_at
       FROM quotes
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [String(user.id)]
    );

    return (result.rows || []).map((row: any) => ({
      id: String(row.id),
      reference_no: String(row.reference_no),
      user_id: String(row.user_id),
      status: row.status as DBQuote['status'],
      total_items: Number(row.total_items),
      notes: row.notes ? String(row.notes) : null,
      created_at: row.created_at
        ? (new Date(row.created_at).toISOString().split('T')[0] ?? '')
        : '',
    }));
  } catch (error) {
    console.error('Failed to fetch user quotes:', error);
    return [];
  }
}

export async function getQuoteDetails(quoteId: string): Promise<DBQuoteDetail | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const isAdmin = user.role === 'admin';
    const quoteRes = await db.query(
      `SELECT id, reference_no, user_id, status, total_items, notes, created_at
       FROM quotes
       WHERE id = $1 AND (user_id = $2 OR $3 = true)`,
      [quoteId, String(user.id), isAdmin]
    );

    if (!quoteRes.rows || quoteRes.rows.length === 0) return null;
    const q = quoteRes.rows[0];

    const itemsRes = await db.query(
      `SELECT 
         qi.id,
         qi.product_id,
         qi.quantity,
         p.name as product_name,
         p.image as product_image,
         c.name as category_name
       FROM quote_items qi
       LEFT JOIN products p ON qi.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE qi.quote_id = $1`,
      [quoteId]
    );

    return {
      id: String(q.id),
      reference_no: String(q.reference_no),
      user_id: String(q.user_id),
      status: q.status as DBQuote['status'],
      total_items: Number(q.total_items),
      notes: q.notes ? String(q.notes) : null,
      created_at: q.created_at ? new Date(q.created_at).toLocaleDateString() : '',
      items: (itemsRes.rows || []).map((row: any) => ({
        id: String(row.id),
        product_id: String(row.product_id),
        product_name: String(row.product_name || 'Equipment Item'),
        product_image: String(row.product_image || ''),
        category_name: String(row.category_name || 'General'),
        quantity: Number(row.quantity),
      })),
    };
  } catch (error) {
    console.error('Failed to get quote details:', error);
    return null;
  }
}

/**
 * Fetch all quote requests across all users for Admin
 */
export async function getAllQuotesForAdmin(): Promise<AdminQuoteSummary[]> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const result = await db.query(`
      SELECT 
        q.id,
        q.reference_no,
        q.user_id,
        q.status,
        q.total_items,
        q.notes,
        q.created_at,
        COALESCE(u.name, 'Client') as user_name,
        COALESCE(u.email, 'Client Email') as user_email
      FROM quotes q
      LEFT JOIN "user" u ON q.user_id = u.id
      ORDER BY q.created_at DESC
    `);

    return (result.rows || []).map((row: any) => ({
      id: String(row.id),
      reference_no: String(row.reference_no),
      user_id: String(row.user_id),
      status: row.status as DBQuote['status'],
      total_items: Number(row.total_items),
      notes: row.notes ? String(row.notes) : null,
      created_at: row.created_at ? new Date(row.created_at).toLocaleDateString() : '',
      user_name: String(row.user_name),
      user_email: String(row.user_email),
    }));
  } catch (error) {
    console.error('Failed to query admin quotes:', error);
    return [];
  }
}

export async function updateQuoteStatus(
  quoteId: string,
  status: 'PENDING' | 'UNDER_REVIEW' | 'QUOTED' | 'REJECTED',
  notes?: string
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    await db.query(
      `UPDATE quotes SET status = $1, notes = $2 WHERE id = $3`,
      [status, notes || null, quoteId]
    );

    revalidatePath('/admin/quotes');
    revalidatePath('/dashboard');
    revalidatePath(`/quotes/${quoteId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update quote status:', error);
    return { success: false, error: 'Failed to update quote status.' };
  }
}