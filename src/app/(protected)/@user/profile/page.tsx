// src/app/(protected)/@user/profile/page.tsx
import { PageHeader, PageLayout } from '@/components/shared/page-header';
import { requirePermission } from '@/features/auth/rbac/require';
import { getCurrentUser } from '@/features/auth/server/get-current-user';
import { ProfileForm } from '@/features/auth/components/profile-form';

export default async function UserProfilePage() {
  await requirePermission('dashboard.view:user');
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Account Settings" 
          subtitle="Manage your personal information, email preferences, and password security." 
        />
        <ProfileForm 
          user={{
            id: currentUser.id,
            name: currentUser.name || '',
            email: currentUser.email || '',
            role: currentUser.role,
          }} 
        />
      </div>
    </PageLayout>
  );
}