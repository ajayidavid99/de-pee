// de-pee/src/features/auth/rbac/roles.ts 
import { env } from '@/libs/env';
import type { AuthPermission, UserRole } from './permissions';

const ROLE_PERMISSIONS = {
  user: ['dashboard.view:user'],
  admin: ['dashboard.view:user', 'dashboard.view:admin'],
} as const satisfies Record<UserRole, readonly AuthPermission[]>;

export function getPermissionsForRole(role: UserRole): AuthPermission[] {
  return [...ROLE_PERMISSIONS[role]];
}

export function getRoleFromEmail(
  email: string | null | undefined,
  adminEmails: readonly string[],
): UserRole {
  if (!email) return 'user';
  const normalized = email.toLowerCase();
  if (adminEmails.includes(normalized)) return 'admin';
  return 'user';
}
