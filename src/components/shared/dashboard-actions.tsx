// src/components/shared/dashboard-actions.tsx
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardActionsProps {
  id: string;
  onDelete: (id: string) => Promise<any>;
  itemName: string;
  type: 'product' | 'post';
}

export function DashboardActions({ id, onDelete, itemName, type }: DashboardActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await onDelete(id);
        toast.success(`${type === 'product' ? 'Product' : 'Article'} successfully purged.`);
        setIsOpen(false);
      } catch (err: any) {
        toast.error(err.message || 'Failed to complete deletion process.');
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-end space-x-2 whitespace-nowrap">
        <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5">
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-[11px] px-2.5 text-destructive hover:bg-destructive/10"
          onClick={() => setIsOpen(true)}
        >
          Delete
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Are you sure you want to delete <span className="font-bold text-foreground">"{itemName}"</span>? This will permanently remove the database record and purge its attached image asset from Vercel Blob storage.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="h-8 text-xs font-bold gap-1"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}