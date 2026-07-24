import { PageHeader, PageLayout } from '@/components/shared/page-header';
import { requirePermission } from '@/features/auth/rbac/require';
import { getAllQuotesForAdmin } from '@/features/quotes/server/actions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UpdateQuoteDialog } from '@/features/quotes/components/update-quote-dialog';
import Link from 'next/link';
import { FileText, Eye } from 'lucide-react';

const statusBadgeMap = {
  PENDING: { label: 'Pending', variant: 'secondary' as const },
  UNDER_REVIEW: { label: 'Under Review', variant: 'outline' as const },
  QUOTED: { label: 'Quoted', variant: 'default' as const },
  REJECTED: { label: 'Declined', variant: 'destructive' as const },
};

export default async function AdminQuotesPage() {
  await requirePermission('dashboard.view:admin');
  const quotes = await getAllQuotesForAdmin();

  return (
    <PageLayout>
      <div className="space-y-6">
        <PageHeader
          title="Inquiry & Quotation Management"
          subtitle="Review client equipment requests, draft pricing timelines, and manage order statuses."
        />

        <Card className="overflow-hidden border-border/80">
          <div className="p-4 border-b border-border/60 bg-muted/20 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Active Quotation Requests</h3>
              <p className="text-[11px] text-muted-foreground">
                Showing {quotes.length} recorded request(s) submitted from catalog basket.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {quotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground space-y-2">
                <FileText className="h-8 w-8 mx-auto opacity-40" />
                <p className="text-xs">No quotation requests submitted yet.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                    <th className="p-3 font-semibold">Reference</th>
                    <th className="p-3 font-semibold">Client</th>
                    <th className="p-3 font-semibold">Items Requested</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Date</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {quotes.map((q) => {
                    const badge = statusBadgeMap[q.status];
                    return (
                      <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-mono font-bold text-foreground">
                          {q.reference_no}
                        </td>
                        <td className="p-3">
                          <p className="font-semibold">{q.user_name}</p>
                          <p className="text-[10px] text-muted-foreground">{q.user_email}</p>
                        </td>
                        <td className="p-3 font-semibold">{q.total_items} item(s)</td>
                        <td className="p-3">
                          <Badge variant={badge.variant} className="text-[10px] px-2 py-0.5">
                            {badge.label}
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{q.created_at}</td>
                        <td className="p-3 text-right flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild className="h-7 text-xs px-2 gap-1">
                            <Link href={`/quotes/${q.id}`}>
                              <Eye className="h-3 w-3" /> View
                            </Link>
                          </Button>
                          <UpdateQuoteDialog
                            quoteId={q.id}
                            currentStatus={q.status}
                            currentNotes={q.notes}
                          />
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