'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateQuoteStatus } from '../server/actions';
import { toast } from 'sonner';
import { Edit3 } from 'lucide-react';

interface UpdateQuoteDialogProps {
  quoteId: string;
  currentStatus: 'PENDING' | 'UNDER_REVIEW' | 'QUOTED' | 'REJECTED';
  currentNotes?: string | null;
}

export function UpdateQuoteDialog({ quoteId, currentStatus, currentNotes }: UpdateQuoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes || '');
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateQuoteStatus(quoteId, status, notes);
      if (res.success) {
        toast.success('Quote status updated successfully');
        setOpen(false);
      } else {
        toast.error('Failed to update quote');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
          <Edit3 className="h-3 w-3" /> Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Manage Quote Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Quote Status</label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as any)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending Review</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review (Procurement)</SelectItem>
                <SelectItem value="QUOTED">Quote Ready / Completed</SelectItem>
                <SelectItem value="REJECTED">Declined / Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Admin Pricing Notes / Timeline</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter pricing details, lead times, or remarks for client..."
              className="text-xs min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            {isPending ? 'Saving...' : 'Update Quotation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}