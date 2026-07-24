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

/**
 * Creates DB tables if they don't exist yet
 */
export async function ensureQuotesTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      reference_no TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      total_items INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quote_items (
      id TEXT PRIMARY KEY,
      quote_id TEXT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * Submit a Quote Request from basket items
 */
export async function submitQuoteRequest(items: QuoteItemPayload[], notes?: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to submit a quote request.');
  }

  if (!items || items.length === 0) {
    throw new Error('Basket is empty.');
  }

  await ensureQuotesTable();

  const quoteId = `quote_${crypto.randomUUID()}`;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const referenceNo = `REQ-${dateStr}-${randomSuffix}`;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // 1. Insert Quote Record
  await db.query(
    `INSERT INTO quotes (id, reference_no, user_id, status, total_items, notes)
     VALUES ($1, $2, $3, 'PENDING', $4, $5)`,
    [quoteId, referenceNo, user.id, totalItems, notes || null]
  );

  // 2. Insert Quote Items
  for (const item of items) {
    const itemId = `qitem_${crypto.randomUUID()}`;
    await db.query(
      `INSERT INTO quote_items (id, quote_id, product_id, quantity)
       VALUES ($1, $2, $3, $4)`,
      [itemId, quoteId, item.productId, item.quantity]
    );
  }

  revalidatePath('/dashboard');
  return { success: true, referenceNo, quoteId };
}

/**
 * Fetch Quote History for the authenticated user
 */
export async function getUserQuotes(): Promise<DBQuote[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  await ensureQuotesTable();

  try {
    const result = await db.query(
      `SELECT id, reference_no, user_id, status, total_items, notes, created_at
       FROM quotes
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [user.id]
    );

    return (result.rows || []).map((row: any) => ({
      id: String(row.id),
      reference_no: String(row.reference_no),
      user_id: String(row.user_id),
      status: row.status as DBQuote['status'],
      total_items: Number(row.total_items),
      notes: row.notes ? String(row.notes) : null,
      created_at: row.created_at ? (new Date(row.created_at).toISOString().split('T')[0] ?? '') : '',    }));
  } catch (error) {
    console.error('Failed to fetch user quotes:', error);
    return [];
  }
}