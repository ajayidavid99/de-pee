// src/app/(protected)/@admin/profile/page.tsx
import { PageHeader, PageLayout } from '@/components/shared/page-header';
import { requirePermission } from '@/features/auth/rbac/require';
import { getCurrentUser } from '@/features/auth/server/get-current-user';
import { ProfileForm } from '@/features/auth/components/profile-form';

export default async function AdminProfilePage() {
  await requirePermission('dashboard.view:admin');
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Admin Profile" 
          subtitle="Manage administrative credentials and security settings." 
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