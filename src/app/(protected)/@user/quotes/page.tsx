// src/app/(protected)/@user/quotes/page.tsx
import Link from 'next/link';
import { PageHeader, PageLayout } from '@/components/shared/page-header';
import { requirePermission } from '@/features/auth/rbac/require';
import { getUserQuotes } from '@/features/quotes/server/actions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, ShoppingBag } from 'lucide-react';

const statusBadgeMap = {
  PENDING: { label: 'Pending Review', variant: 'secondary' as const },
  UNDER_REVIEW: { label: 'In Review', variant: 'outline' as const },
  QUOTED: { label: 'Quote Ready', variant: 'default' as const },
  REJECTED: { label: 'Declined', variant: 'destructive' as const },
};

export default async function UserQuotesPage() {
  await requirePermission('dashboard.view:user');
  const quotes = await getUserQuotes();

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="My Quotation Requests"
            subtitle="Track processing statuses and inspect equipment quotes."
          />
          <Button asChild size="sm">
            <Link href="/products">
              <ShoppingBag className="h-4 w-4 mr-2" /> Request New Quote
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden border-border/80">
          <div className="p-4 border-b border-border/60 bg-muted/20">
            <h3 className="text-sm font-bold">Request History</h3>
          </div>

          <div className="overflow-x-auto">
            {quotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground space-y-3">
                <FileText className="h-8 w-8 mx-auto opacity-40" />
                <p className="text-xs">You haven't submitted any quote requests yet.</p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/products">Browse Catalog</Link>
                </Button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                    <th className="p-3">Reference</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date Submitted</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {quotes.map((q) => {
                    const badge = statusBadgeMap[q.status] || { label: q.status, variant: 'secondary' as const };
                    return (
                      <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono font-bold">{q.reference_no}</td>
                        <td className="p-3">{q.total_items} item(s)</td>
                        <td className="p-3">
                          <Badge variant={badge.variant} className="text-[10px]">
                            {badge.label}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{q.created_at}</td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1">
                            <Link href={`/quotes/${q.id}`}>
                              <Eye className="h-3 w-3" /> Details
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}