// src/features/auth/server/get-current-user.ts
import 'server-only';

import { env } from '@/libs/env';
import { headers } from 'next/headers';
import { auth } from '../lib/auth';
import { getPermissionsForRole, getRoleFromEmail } from '../rbac/roles';
import type { AuthUser } from '../types';

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.email) return null;
    
    const user = session.user as any; // Type cast for custom BetterAuth fields
    const role = getRoleFromEmail(user.email, env.AUTH_ADMIN_EMAILS);

    return {
      id: user.id ?? user.email,
      email: user.email,
      name: user.name || '',
      phone: user.phone || '',
      countryCode: user.countryCode || '+234',
      role,
      permissions: getPermissionsForRole(role),
    };
  } catch {
    return null;
  }
}