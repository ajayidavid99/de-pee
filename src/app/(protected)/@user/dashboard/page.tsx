// src/app/(protected)/@user/dashboard/page.tsx
import { PageLayout } from '@/components/shared/page-header';
import { requirePermission } from '@/features/auth/rbac/require';
import { getCurrentUser } from '@/features/auth/server/get-current-user';
import { getUserQuotes } from '@/features/quotes/server/actions';
import { UserDashboard, type QuoteSummary } from '@/features/dashboard/components/user-dashboard';

export default async function UserDashboardPage() {
  await requirePermission('dashboard.view:user');
  const currentUser = await getCurrentUser();

  // Fetch real quotes from Neon PostgreSQL
  const dbQuotes = await getUserQuotes();

  const formattedQuotes: QuoteSummary[] = dbQuotes.map((q) => ({
    id: q.id,
    referenceNo: q.reference_no,
    itemCount: q.total_items,
    status: q.status,
    createdAt: q.created_at,
  }));

  const stats = {
    totalRequests: formattedQuotes.length,
    pendingQuotes: formattedQuotes.filter(
      (q) => q.status === 'PENDING' || q.status === 'UNDER_REVIEW'
    ).length,
    completedQuotes: formattedQuotes.filter((q) => q.status === 'QUOTED').length,
  };

  return (
    <PageLayout>
      <UserDashboard
        userName={currentUser?.name || 'Partner'}
        quotes={formattedQuotes}
        stats={stats}
      />
    </PageLayout>
  );
}