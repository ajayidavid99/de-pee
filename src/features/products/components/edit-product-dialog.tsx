// src/features/products/components/edit-product-dialog.tsx
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
import { Loader2, UploadCloud, X } from 'lucide-react';
import { updateProductAction, uploadImageAction, type DBProduct } from '../server/actions';
import { toast } from 'sonner';

const editProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(5, 'Provide a detailed description'),
  specification: z.string().min(3, 'Technical specifications are required'),
  is_featured: z.boolean().default(false),
  is_hot_deal: z.boolean().default(false),
  is_premium: z.boolean().default(false),
});

type EditProductInput = z.input<typeof editProductSchema>;
type EditProductOutput = z.output<typeof editProductSchema>;

interface EditProductDialogProps {
  product: DBProduct; 
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function EditProductDialog({ product, open, setOpen }: EditProductDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>(
    product?.images || (product?.image ? [product.image] : [])
  );

  const form = useForm<EditProductInput, any, EditProductOutput>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      specification: product?.specification || '',
      is_featured: product?.is_featured ?? false,
      is_hot_deal: product?.is_hot_deal ?? false,
      is_premium: product?.is_premium ?? false,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || '',
        description: product.description || '',
        specification: product.specification || '',
        is_featured: product.is_featured ?? false,
        is_hot_deal: product.is_hot_deal ?? false,
        is_premium: product.is_premium ?? false,
      });
      setImages(product.images || (product.image ? [product.image] : []));
    }
  }, [product, form]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    setIsUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const uploadData = new FormData();
          uploadData.append('file', file);
          return await uploadImageAction(uploadData);
        })
      );

      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) added successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async (values: EditProductOutput) => {
    if (images.length === 0) {
      toast.error('Please include at least one product image.');
      return;
    }

    setIsPending(true);
    try {
      await updateProductAction(product.id, {
        name: values.name,
        description: values.description,
        specification: values.specification,
        images: images,
        is_featured: values.is_featured,
        is_hot_deal: values.is_hot_deal,
        is_premium: values.is_premium,
      });

      toast.success('Product updated successfully!');
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

            {/* Multiple Images Edit Field */}
            <div className="space-y-2">
              <FormLabel className="text-xs">Product Image Assets</FormLabel>
              <label className="flex flex-col items-center justify-center border border-dashed border-border/100 rounded-lg p-4 cursor-pointer hover:bg-muted/40 transition">
                <UploadCloud className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-[11px] font-medium text-muted-foreground">
                  {isUploading ? 'Uploading assets...' : 'Add more images (JPEG, PNG, WEBP)'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isUploading}
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              {/* Thumbnail Gallery Preview Grid */}
              {images.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap max-h-40 overflow-y-auto p-1 border rounded-md">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative w-16 h-16 border rounded-md overflow-hidden group shrink-0">
                      <img src={url} alt={`Preview ${idx + 1}`} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-0.5 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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

            <div className="p-3 bg-muted/40 border rounded-lg space-y-2">
              <span className="text-xs font-semibold block text-muted-foreground">Catalog Highlights & Badges</span>
              <div className="flex items-center justify-between gap-2 text-xs">
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(field.value)}
                        onChange={field.onChange}
                        className="rounded border-border accent-amber-500"
                      />
                      <span className={field.value ? "font-semibold text-amber-600" : ""}>Featured</span>
                    </label>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_hot_deal"
                  render={({ field }) => (
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(field.value)}
                        onChange={field.onChange}
                        className="rounded border-border accent-red-500"
                      />
                      <span className={field.value ? "font-semibold text-red-600" : ""}>Hot Deal</span>
                    </label>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_premium"
                  render={({ field }) => (
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(field.value)}
                        onChange={field.onChange}
                        className="rounded border-border accent-purple-500"
                      />
                      <span className={field.value ? "font-semibold text-purple-600" : ""}>Premium</span>
                    </label>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} disabled={isPending || isUploading} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending || isUploading} className="h-8 text-xs gap-1">
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