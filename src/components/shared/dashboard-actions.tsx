// src/components/shared/dashboard-actions.tsx
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Import Edit dialog implementations
import { EditProductDialog } from '@/features/products/components/edit-product-dialog';
import { EditPostDialog } from '@/features/blog/components/edit-post-dialog';

interface DashboardActionsProps {
  id: string;
  onDelete: (id: string) => Promise<any>;
  rawItem: any; // Full entity block object injected from the DB iterator
  type: 'product' | 'post';
}

export function DashboardActions({ id, onDelete, rawItem, type }: DashboardActionsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await onDelete(id);
        toast.success(`${type === 'product' ? 'Product' : 'Article'} successfully purged.`);
        setIsDeleteOpen(false);
      } catch (err: any) {
        toast.error(err.message || 'Failed to complete deletion process.');
      }
    });
  };

  const itemName = type === 'product' ? rawItem.name : rawItem.title;

  return (
    <>
      <div className="flex items-center justify-end space-x-2 whitespace-nowrap">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-[11px] px-2.5"
          onClick={() => setIsEditOpen(true)}
        >
          Edit
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-[11px] px-2.5 text-destructive hover:bg-destructive/10"
          onClick={() => setIsDeleteOpen(true)}
        >
          Delete
        </Button>
      </div>

      {/* CONDITIONAL RENDER FOR EDIT OVERLAYS */}
      {type === 'product' && isEditOpen && (
        <EditProductDialog product={rawItem} open={isEditOpen} setOpen={setIsEditOpen} />
      )}
      {type === 'post' && isEditOpen && (
        <EditPostDialog post={rawItem} open={isEditOpen} setOpen={setIsEditOpen} />
      )}

      {/* CONFIRMATION DELETION DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
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
              onClick={() => setIsDeleteOpen(false)}
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