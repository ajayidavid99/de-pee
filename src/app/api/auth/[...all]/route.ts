// src/app/api/auth/[...all]/route.ts
import { auth } from '@/features/auth/lib/auth';

export async function POST(req: Request) {
  console.log('[DEBUG AUTH POST] URL:', req.url);

  // auth.handler natively parses req.url without needing Next.js route context
  const res = await auth.handler(req);

  console.log('[DEBUG AUTH POST] Status:', res.status);
  return res;
}

export async function GET(req: Request) {
  return auth.handler(req);
}