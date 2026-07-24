import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageLayout } from '@/components/shared/page-header';
import { getQuoteDetails } from '@/features/quotes/server/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface QuoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

const statusBadgeMap = {
  PENDING: { label: 'Pending Admin Review', variant: 'secondary' as const },
  UNDER_REVIEW: { label: 'Processing by Procurement', variant: 'outline' as const },
  QUOTED: { label: 'Quote Ready', variant: 'default' as const },
  REJECTED: { label: 'Declined', variant: 'destructive' as const },
};

export default async function QuoteDetailsPage({ params }: QuoteDetailsPageProps) {
  const { id } = await params;
  const quote = await getQuoteDetails(id);

  if (!quote) {
    notFound();
  }

  const badge = statusBadgeMap[quote.status];

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
          <Badge variant={badge.variant} className="text-xs px-2.5 py-1 font-semibold">
            {badge.label}
          </Badge>
        </div>

        {/* Overview Banner */}
        <Card className="border-border/60">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <CardTitle className="text-lg font-bold font-mono">
                  {quote.reference_no}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Submitted on {quote.created_at} • {quote.total_items} item(s) requested
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Assigned to Lagos / Ife Procurement Desk</span>
              </div>
            </div>
          </CardHeader>

          {/* Requested Items List */}
          <CardContent className="pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-600" /> Itemized Equipment List
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