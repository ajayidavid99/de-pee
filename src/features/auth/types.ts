// src/features/auth/types.ts
import type { AuthPermission, UserRole } from './rbac/permissions';

export type { AuthPermission, UserRole } from './rbac/permissions';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  countryCode?: string;
  role: UserRole;
  permissions: AuthPermission[];
}