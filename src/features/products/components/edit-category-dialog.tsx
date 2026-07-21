// src/features/products/components/edit-category-dialog.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UploadCloud } from 'lucide-react';
import { updateCategory, uploadImageAction, type DBCategory } from '../server/actions';
import { toast } from 'sonner';

const editCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  parentId: z.string().optional(),
  imageFile: z.any().optional(),
});

// ✅ Correct
type EditCategoryValues = z.infer<typeof editCategorySchema>;

interface EditCategoryDialogProps {
  category: DBCategory;
  categories: DBCategory[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function EditCategoryDialog({ category, categories, open, setOpen }: EditCategoryDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(category.image || null);

  const form = useForm<EditCategoryValues>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category.name || '',
      parentId: category.parent_id || 'none',
    },
  });

  // Filter possible parents (excluding itself to avoid circular parenting)
  const parentCategories = categories.filter((c) => c.parent_id === null && c.id !== category.id);

  const onSubmit = async (values: EditCategoryValues) => {
    setIsPending(true);
    try {
      let finalImageUrl = category.image || null;

      if (values.imageFile && values.imageFile[0]) {
        const uploadData = new FormData();
        uploadData.append('file', values.imageFile[0]);
        finalImageUrl = await uploadImageAction(uploadData);
      }

      await updateCategory(category.id, {
        name: values.name,
        parentId: values.parentId === 'none' ? null : values.parentId,
        image: finalImageUrl,
      });

      toast.success('Category updated successfully!');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update category.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Edit Category</DialogTitle>
          <DialogDescription className="text-xs">Update category name, parent hierarchy, or visual banner asset.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Category Name</FormLabel>
                  <FormControl><Input {...field} className="h-9 text-xs" /></FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Parent Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Root Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none" className="text-xs text-muted-foreground">None (Root Category)</SelectItem>
                      {parentCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-xs">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, ref, value, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-xs">Category Banner / Image (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="flex flex-col items-center justify-center border border-dashed border-border/100 rounded-lg p-3 cursor-pointer hover:bg-muted/40 transition">
                          <UploadCloud className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="text-[10px] font-medium text-muted-foreground">Replace Image</span>
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
                        <div className="h-14 w-14 border rounded-lg overflow-hidden shrink-0 bg-muted">
                          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} disabled={isPending} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="h-8 text-xs gap-1">
                {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}