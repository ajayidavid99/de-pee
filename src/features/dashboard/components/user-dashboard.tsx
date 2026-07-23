// src/features/dashboard/components/user-dashboard.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export interface QuoteSummary {
  id: string;
  referenceNo: string;
  itemCount: number;
  status: 'PENDING' | 'UNDER_REVIEW' | 'QUOTED' | 'REJECTED';
  createdAt: string;
  totalEstimatedAmount?: number | null;
}

interface UserDashboardProps {
  userName: string;
  quotes: QuoteSummary[];
  stats: {
    totalRequests: number;
    pendingQuotes: number;
    completedQuotes: number;
  };
}

const statusBadgeMap: Record<
  QuoteSummary['status'],
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  UNDER_REVIEW: { label: 'Under Review', variant: 'outline' },
  QUOTED: { label: 'Ready', variant: 'default' },
  REJECTED: { label: 'Declined', variant: 'destructive' },
};

export function UserDashboard({ userName, quotes, stats }: UserDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Welcome back, {userName || 'Partner'} 👋
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Track your medical equipment quote requests and recent inquiries.
          </p>
        </div>
        <Button asChild size="sm" className="h-9 gap-1.5 text-xs font-semibold">
          <Link href="/products">
            <Plus className="h-4 w-4" /> Request New Quote
          </Link>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Total Inquiries
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Lifetime requests submitted
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              In Review / Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
              Awaiting pricing feedback
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Quotes Ready
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedQuotes}</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              Available for view/download
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quote History Table */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Recent Quote Requests</CardTitle>
            <CardDescription className="text-xs">
              Overview of your most recent equipment price requests.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs h-8 gap-1">
            <Link href="/quotes">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-xs font-semibold">No quotes requested yet</p>
              <p className="text-[11px] text-muted-foreground mb-4">
                Browse medical catalog products to add items to your quote list.
              </p>
              <Button size="sm" variant="outline" asChild className="h-8 text-xs">
                <Link href="/products">Browse Equipment</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead>Reference</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((q) => {
                  const badge = statusBadgeMap[q.status];
                  return (
                    <TableRow key={q.id} className="text-xs">
                      <TableCell className="font-mono font-medium">{q.referenceNo}</TableCell>
                      <TableCell>{q.itemCount} items</TableCell>
                      <TableCell>
                        <Badge variant={badge.variant} className="text-[10px] px-2 py-0.5">
                          {badge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{q.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="h-7 text-xs px-2">
                          <Link href={`/quotes/${q.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}