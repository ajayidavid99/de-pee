// src/app/api/auth/[...all]/route.ts
import { auth } from '@/features/auth/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// toNextJsHandler automatically parses Next.js proxy headers and normalizes the request
const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  console.log('[DEBUG AUTH POST] Request received at Next.js adapter');
  const res = await handler.POST(req);
  console.log('[DEBUG AUTH POST] Status:', res.status);
  return res;
}

export const GET = handler.GET;