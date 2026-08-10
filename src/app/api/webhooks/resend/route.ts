// src/app/api/webhooks/resend/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { resend } from '@/libs/email';
import { db } from '@/libs/db';

function parseSender(fromRaw: string): { name: string; email: string } {
  if (!fromRaw) {
    return { name: 'Unknown', email: '' };
  }

  const match = fromRaw.match(/(.*)<(.*)>/);
  if (match && match[1] && match[2]) {
    return {
      name: match[1].trim().replace(/^["']|["']$/g, ''),
      email: match[2].trim(),
    };
  }

  const parts = fromRaw.split('@');
  return { 
    name: parts[0] ? parts[0].trim() : fromRaw.trim(), 
    email: fromRaw.trim() 
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    
    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: 'Missing signature headers' }, { status: 400 });
    }

    const event = resend.webhooks.verify({
      payload,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET || '',
    });

    if (event.type === 'email.received') {
      const emailId = event.data.email_id;

      const { data: emailData, error } = await resend.emails.receiving.get(emailId);

      if (error || !emailData) {
        console.error('[WEBHOOK] Failed to retrieve email content:', error);
        return NextResponse.json({ error: 'Failed to fetch email content' }, { status: 500 });
      }

      const { name: fromName, email: fromEmail } = parseSender(emailData.from || '');
      const toEmail = Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to || '';

      await db.query(
        `INSERT INTO inbound_emails (id, from_email, from_name, to_email, subject, text_body, html_body, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         ON CONFLICT (id) DO NOTHING`,
        [
          emailData.id || emailId,
          fromEmail,
          fromName,
          toEmail,
          emailData.subject || '(No Subject)',
          emailData.text || '',
          emailData.html || '',
        ],
      );

      console.log(`[INBOUND] Saved message ${emailId} from ${fromEmail}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[WEBHOOK] Processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}