// src/app/(protected)/@admin/quotes/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageLayout } from '@/components/shared/page-header';
import { getQuoteDetails } from '@/features/quotes/server/actions';
import { requirePermission } from '@/features/auth/rbac/require';
import { UpdateQuoteDialog } from '@/features/quotes/components/update-quote-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Clock, FileText, AlertCircle } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

const statusBadgeMap = {
  PENDING: { label: 'Pending Review', variant: 'secondary' as const },
  UNDER_REVIEW: { label: 'In Review', variant: 'outline' as const },
  QUOTED: { label: 'Quoted', variant: 'default' as const },
  REJECTED: { label: 'Declined', variant: 'destructive' as const },
};

export default async function AdminQuoteDetailsPage({ params }: Props) {
  await requirePermission('dashboard.view:admin');
  const { id } = await params;

  if (!id) notFound();

  const quote = await getQuoteDetails(id);

  if (!quote) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
          <AlertCircle className="h-8 w-8 mx-auto text-amber-500" />
          <h1 className="text-xl font-bold">Quote Request Not Found</h1>
          <p className="text-xs text-muted-foreground">
            Quote <code className="font-mono bg-muted px-1 py-0.5 rounded">{id}</code> could not be retrieved.
          </p>
          <Button asChild size="sm">
            <Link href="/admin/quotes">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Admin Quotes
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const badge = statusBadgeMap[quote.status] || { label: quote.status, variant: 'secondary' as const };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/admin/quotes">
              <ArrowLeft className="h-4 w-4" /> Back to Admin Quotes
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant={badge.variant} className="text-xs px-2.5 py-1 font-semibold">
              {badge.label}
            </Badge>
            <UpdateQuoteDialog
              quoteId={quote.id}
              currentStatus={quote.status}
              currentNotes={quote.notes}
            />
          </div>
        </div>

        <Card className="border-border/60">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <CardTitle className="text-lg font-bold font-mono">
                  {quote.reference_no}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Submitted on {quote.created_at} • {quote.total_items} item(s)
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Procurement Review Active</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-600" /> Requested Line Items
            </h3>

            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead>Equipment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quote.items.map((item) => (
                  <TableRow key={item.id} className="text-xs">
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-3">
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="h-8 w-8 rounded object-cover border"
                          />
                        )}
                        <span>{item.product_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.category_name}</TableCell>
                    <TableCell className="text-right font-bold">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}