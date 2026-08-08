// src/app/api/auth/[...all]/route.ts
import { auth } from '@/features/auth/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  // 1. Log the exact URL and Origin Better Auth is seeing
  console.log('[DEBUG AUTH POST] URL:', req.url);
  console.log('[DEBUG AUTH POST] Origin:', req.headers.get('origin'));
  
  // 2. Pass to Better Auth
  const res = await handler.POST(req);
  
  // 3. Log what Better Auth decided to return
  console.log('[DEBUG AUTH POST] Status:', res.status);
  
  return res;
}

export const GET = handler.GET;