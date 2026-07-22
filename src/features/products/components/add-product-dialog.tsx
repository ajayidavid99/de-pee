// src/features/products/components/add-product-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2, UploadCloud } from 'lucide-react';
import { createProduct, uploadImageAction, type DBCategory } from '../server/actions';
import { toast } from 'sonner';

const productFormSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  parentCategoryId: z.string().min(1, 'Please select a main category'),
  subCategoryId: z.string().optional(),
  description: z.string().min(5, 'Provide a detailed description'),
  specification: z.string().min(3, 'Technical specification details are required'),
  imageFile: z.any().refine((files) => files?.[0] instanceof File, "An image file upload is required"),
  is_featured: z.boolean().default(false),
  is_hot_deal: z.boolean().default(false),
  is_premium: z.boolean().default(false),
});

type ProductFormInput = z.input<typeof productFormSchema>;
type ProductFormOutput = z.output<typeof productFormSchema>;

interface AddProductDialogProps {
  categories: DBCategory[];
}

export function AddProductDialog({ categories }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Pass <Input, Context, Output> to useForm to reconcile Zod default() field types
  const form = useForm<ProductFormInput, any, ProductFormOutput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      parentCategoryId: '',
      subCategoryId: '',
      description: '',
      specification: '',
      is_featured: false,
      is_hot_deal: false,
      is_premium: false,
    },
  });

  const selectedParentId = form.watch('parentCategoryId');
  
  const mainCategories = categories.filter((c) => c.parent_id === null);
  
  const availableSubCategories = categories.filter(
    (c) => c.parent_id === selectedParentId && selectedParentId !== ''
  );
  
  const hasSubCategories = availableSubCategories.length > 0;
  
  useEffect(() => {
    form.setValue('subCategoryId', '');
  }, [selectedParentId, form]);

  const onSubmit = async (values: ProductFormOutput) => {
    setIsPending(true);
    try {
      const imageFile = values.imageFile[0];
      const uploadData = new FormData();
      uploadData.append('file', imageFile);

      const uploadedImageUrl = await uploadImageAction(uploadData);

      await createProduct({
        name: values.name,
        description: values.description,
        specification: values.specification,
        image: uploadedImageUrl,
        categoryId: values.subCategoryId || values.parentCategoryId,
        is_featured: values.is_featured,
        is_hot_deal: values.is_hot_deal,
        is_premium: values.is_premium,
      });

      toast.success('Product added successfully!');
      setOpen(false);
      form.reset();
      setPreviewUrl(null);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 text-xs gap-1">
          <Plus className="h-3.5 w-3.5" /> New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Add New Medical Instrument</DialogTitle>
          <DialogDescription className="text-xs">
            Upload asset imagery and log category parameters.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Premium Nitrile Exam Gloves" {...field} className="h-9 text-xs" />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Main Category Allocation</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Assign a product family category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mainCategories.map((category) => (
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

            {hasSubCategories && (
              <FormField
                control={form.control}
                name="subCategoryId"
                render={({ field }) => (
                  <FormItem className="bg-muted/30 p-3 rounded-lg border border-dashed border-border/60">
                    <FormLabel className="text-xs font-semibold text-primary">Sub-category Required</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs bg-background">
                          <SelectValue placeholder="Select specific sub-category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSubCategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id} className="text-xs">
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange, ref, value, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-xs">Product Image Asset</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="flex flex-col items-center justify-center border border-dashed border-border/100 rounded-lg p-4 cursor-pointer hover:bg-muted/40 transition">
                          <UploadCloud className="h-5 w-5 text-muted-foreground mb-1" />
                          <span className="text-[11px] font-medium text-muted-foreground">Select file (JPEG, PNG, WEBP)</span>
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
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Technical Specifications</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ambidextrous, Beaded cuff, 100pcs per box" {...field} className="h-9 text-xs" />
                  </FormControl>
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
                  <FormControl>
                    <Textarea 
                      placeholder="Provide consumer overview description regarding quality testing or packaging metrics..." 
                      className="min-h-[80px] text-xs resize-none" 
                      {...field} 
                    />
                  </FormControl>
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
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} disabled={isPending} className="h-8 text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="h-8 text-xs gap-1">
                {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                Save Product
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}