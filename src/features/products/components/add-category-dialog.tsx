// src/features/products/components/add-category-dialog.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderPlus, Loader2, UploadCloud } from 'lucide-react';
import { createCategory, uploadImageAction, type DBCategory } from '../server/actions';
import { toast } from 'sonner';

// Optional image upload validation schema
const categoryFormSchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  parentId: z.string().optional(),
  imageFile: z.any().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface AddCategoryDialogProps {
  categories: DBCategory[];
}

export function AddCategoryDialog({ categories }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      parentId: '',
    },
  });

  // Only allow assigning sub-categories to root parent categories
  const parentCategories = categories.filter((c) => c.parent_id === null);

  async function onSubmit(values: CategoryFormValues) {
    setIsPending(true);
    try {
      let imageUrl: string | null = null;

      // Handle optional category image upload
      if (values.imageFile && values.imageFile[0] instanceof File) {
        const uploadData = new FormData();
        uploadData.append('file', values.imageFile[0]);
        imageUrl = await uploadImageAction(uploadData);
      }

      await createCategory({
        name: values.name,
        parentId: values.parentId === 'none' ? null : values.parentId || null,
        image: imageUrl,
      });

      toast.success('Category saved successfully');
      form.reset();
      setPreviewUrl(null);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto text-xs gap-2 h-9">
          <FolderPlus className="h-4 w-4" />
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Create Dynamic Category</DialogTitle>
          <DialogDescription className="text-xs">
            Add root categories or sub-categories without modifying static files.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Cutting Instruments" {...field} className="h-9 text-xs" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Parent Category (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Leave empty for root category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none" className="text-xs text-muted-foreground">
                        None (Make root)
                      </SelectItem>
                      {parentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-xs">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Optional Banner/Background Image */}
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, ref, value, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-xs">Category Image / Banner (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="flex flex-col items-center justify-center border border-dashed border-border/80 rounded-lg p-3 cursor-pointer hover:bg-muted/40 transition">
                          <UploadCloud className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="text-[10px] font-medium text-muted-foreground">
                            Upload card background
                          </span>
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
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="h-8 text-xs gap-1">
                {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Save Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}