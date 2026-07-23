// src/app/(protected)/@user/dashboard/page.tsx
import { PageLayout } from '@/components/shared/page-header';
import { requirePermission } from '@/features/auth/rbac/require';
import { getCurrentUser } from '@/features/auth/server/get-current-user';
import { UserDashboard, type QuoteSummary } from '@/features/dashboard/components/user-dashboard';

export default async function UserDashboardPage() {
  await requirePermission('dashboard.view:user');
  const currentUser = await getCurrentUser();

  // Mock data or query DB table for user's quotes
  // e.g., const userQuotes = await db.select().from(quotes).where(eq(quotes.userId, currentUser.id))
  const sampleQuotes: QuoteSummary[] = [
    {
      id: '1',
      referenceNo: 'REQ-2026-001',
      itemCount: 3,
      status: 'UNDER_REVIEW',
      createdAt: '2026-07-20',
    },
    {
      id: '2',
      referenceNo: 'REQ-2026-002',
      itemCount: 1,
      status: 'QUOTED',
      createdAt: '2026-07-15',
    },
  ];

  const stats = {
    totalRequests: sampleQuotes.length,
    pendingQuotes: sampleQuotes.filter((q) => q.status === 'PENDING' || q.status === 'UNDER_REVIEW').length,
    completedQuotes: sampleQuotes.filter((q) => q.status === 'QUOTED').length,
  };

  return (
    <PageLayout>
      <UserDashboard
        userName={currentUser?.name || ''}
        quotes={sampleQuotes}
        stats={stats}
      />
    </PageLayout>
  );
}