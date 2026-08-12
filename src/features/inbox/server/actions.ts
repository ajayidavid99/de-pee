// src/features/inbox/server/actions.ts
'use server';

import { db } from '@/libs/db';
import { resend } from '@/libs/email';
import { revalidatePath } from 'next/cache';

export interface InboundEmail {
  id: string;
  from_email: string;
  from_name: string | null;
  to_email: string;
  subject: string | null;
  text_body: string | null;
  html_body: string | null;
  read_at: string | null;
  created_at: string;
}

export interface GetInboxParams {
  page?: number;
  pageSize?: number;
  search?: string;
  filter?: 'all' | 'unread' | 'read';
}

export async function getInboundEmails({
  page = 1,
  pageSize = 20,
  search = '',
  filter = 'all',
}: GetInboxParams = {}) {
  const offset = (page - 1) * pageSize;
  const params: unknown[] = [];
  const conditions: string[] = [];

  if (search.trim()) {
    params.push(`%${search.trim()}%`);
    conditions.push(
      `(subject ILIKE $${params.length} OR from_email ILIKE $${params.length} OR from_name ILIKE $${params.length})`,
    );
  }

  if (filter === 'unread') {
    conditions.push(`read_at IS NULL`);
  } else if (filter === 'read') {
    conditions.push(`read_at IS NOT NULL`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const listQuery = `
    SELECT id, from_email, from_name, to_email, subject, text_body, read_at, created_at
    FROM inbound_emails
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const countQuery = `SELECT COUNT(*)::int as total FROM inbound_emails ${whereClause}`;
  const unreadCountQuery = `SELECT COUNT(*)::int as unread FROM inbound_emails WHERE read_at IS NULL`;

  const [listRes, countRes, unreadRes] = await Promise.all([
    db.query<Omit<InboundEmail, 'html_body'>>(listQuery, [...params, pageSize, offset]),
    db.query<{ total: number }>(countQuery, params),
    db.query<{ unread: number }>(unreadCountQuery),
  ]);

  return {
    data: listRes.rows,
    total: countRes.rows[0]?.total || 0,
    unreadCount: unreadRes.rows[0]?.unread || 0,
    page,
    pageSize,
  };
}

export async function getInboundEmailById(id: string): Promise<InboundEmail | null> {
  const res = await db.query<InboundEmail>(
    `SELECT * FROM inbound_emails WHERE id = $1`,
    [id],
  );

  if (!res.rows[0]) return null;

  if (!res.rows[0].read_at) {
    await db.query(`UPDATE inbound_emails SET read_at = NOW() WHERE id = $1`, [id]);
    revalidatePath('/inbox');
  }

  return res.rows[0];
}

export async function toggleEmailReadStatus(id: string, isRead: boolean) {
  if (isRead) {
    await db.query(`UPDATE inbound_emails SET read_at = NOW() WHERE id = $1`, [id]);
  } else {
    await db.query(`UPDATE inbound_emails SET read_at = NULL WHERE id = $1`, [id]);
  }
  revalidatePath('/inbox');
}

export async function deleteInboundEmail(id: string) {
  await db.query(`DELETE FROM inbound_emails WHERE id = $1`, [id]);
  revalidatePath('/inbox');
}

export async function sendInboxReply(to: string, subject: string, htmlContent: string) {
  try {
    // Strip HTML tags for the plain text version to improve deliverability & avoid spam filters
    const plainTextContent = htmlContent.replace(/<[^>]*>?/gm, '');

    await resend.emails.send({
      from: 'De-Pee Support <info@mail.depeeventures.com>',
      to,
      subject,
      text: plainTextContent, // Plain text fallback
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to send reply:', error);
    throw new Error('Failed to send reply email');
  }
}

export async function submitDirectMessage(data: { name: string; email: string; phone: string; message: string }) {
  // Global Web Crypto API (supported natively in Node 19+ & Next.js Server Actions)
  const id = `msg_${crypto.randomUUID()}`;

  const htmlBody = `
    <div style="font-family: sans-serif;">
      <h3>New Direct Message</h3>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <hr />
      <p>${data.message.replace(/\n/g, '<br/>')}</p>
    </div>
  `;

  await db.query(
    `INSERT INTO inbound_emails 
    (id, from_email, from_name, to_email, subject, text_body, html_body) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      id,
      data.email,
      data.name,
      'info@mail.depeeventures.com',
      `Direct Message from ${data.name}`,
      data.message,
      htmlBody,
    ]
  );

  revalidatePath('/inbox');
}