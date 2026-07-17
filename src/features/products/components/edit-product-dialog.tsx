'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Loader2, UploadCloud } from 'lucide-react';
import { uploadImageAction, type DBProduct } from '../server/actions';
import { db } from '@/libs/db';
import { revalidatePath } from 'next/cache';
import { toast } from 'sonner';

// Server action wrapper for updating (Put this directly inside your server action file or run it inline securely)
import { getCurrentUser } from '@/features/auth/server/get-current-user';

export async function updateProductAction(id: string, data: { name: string; description: string; specification: string; image: string }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');
  
  // Dynamic import or layout to execute inside client file boundary cleanly
  const { db } = require('@/libs/db');
  const { revalidatePath } = require('next/cache');
  
  await db.query(
    `UPDATE products SET name = $1, description = $2, specification = $3, image = $4 WHERE id = $5`,
    [data.name, data.description, data.specification, data.image, id]
  );
  revalidatePath('/products');
  revalidatePath('/dashboard');
}

const editProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(5, 'Provide a detailed description'),
  specification: z.string().min(3, 'Technical specifications are required'),
  imageFile: z.any().optional(),
});

type EditProductValues = z.infer<typeof editProductSchema>;

interface EditProductDialogProps {
  product: any; 
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function EditProductDialog({ product, open, setOpen }: EditProductDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product.image || null);

  const form = useForm<EditProductValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name || '',
      description: product.description || '',
      specification: product.specification || '',
    },
  });

  const onSubmit = async (values: EditProductValues) => {
    setIsPending(true);
    try {
      let finalImageUrl = product.image;

      // Only re-upload if a replacement file was staged
      if (values.imageFile && values.imageFile[0]) {
        const uploadData = new FormData();
        uploadData.append('file', values.imageFile[0]);
        finalImageUrl = await uploadImageAction(uploadData);
      }

      // Execute execution payload modification pass-through
      await updateProductAction(product.id, {
        name: values.name,
        description: values.description,
        specification: values.specification,
        image: finalImageUrl,
      });

      toast.success('Product portfolio item saved successfully!');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong editing database item.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Edit Product Parameters</DialogTitle>
          <DialogDescription className="text-xs">Update asset information parameters live.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Product Name</FormLabel>
                  <FormControl><Input {...field} className="h-9 text-xs" /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, ref, value, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-xs">Replace Product Image Asset (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="flex flex-col items-center justify-center border border-dashed border-border/100 rounded-lg p-4 cursor-pointer hover:bg-muted/40 transition">
                          <UploadCloud className="h-5 w-5 text-muted-foreground mb-1" />
                          <span className="text-[11px] font-medium text-muted-foreground">Select file to replace</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={ref}
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files[0]) {
                                onChange(files);
                                setPreviewUrl(URL.createObjectURL(files[0]));
                              }
                            }}
                            {...field}
                          />
                        </label>
                      </div>
                      {previewUrl && (
                        <div className="h-16 w-16 border rounded-lg overflow-hidden shrink-0 bg-muted">
                          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Technical Specifications</FormLabel>
                  <FormControl><Input {...field} className="h-9 text-xs" /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Catalog Description</FormLabel>
                  <FormControl><Textarea className="min-h-[80px] text-xs resize-none" {...field} /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} disabled={isPending} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="h-8 text-xs gap-1">
                {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Apply Updates
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}