//de-pee/src/features/products/components/add-product-dialog.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../data';
import { createProduct } from '../server/actions';
import { toast } from 'sonner';

const productFormSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  categoryId: z.string().min(1, 'Please select a valid category'),
  description: z.string().min(5, 'Provide a detailed description'),
  specification: z.string().min(3, 'Technical specification details are required'),
  image: z.string().url('Please provide a valid image URL'),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      specification: '',
      image: '',
    },
  });

  async function onSubmit(values: ProductFormValues) {
    setIsPending(true);
    try {
      await createProduct(values);
      toast.success('Equipment added to inventory successfully');
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to populate inventory');
    } finally {
      setIsPending(false);
    }
  }

  // Filter out the meta "all" tab variant from option definitions
  const formCategories = PRODUCT_CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto text-xs gap-2 h-9 shadow-xs">
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Add Equipment Catalog Entry</DialogTitle>
          <DialogDescription className="text-xs">
            Populate details directly to the central Neon storage schema tracking De-Pee inventory layers.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Category Allocation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Assign a product family category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formCategories.map((category) => (
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

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Image URL Reference</FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/..." {...field} className="h-9 text-xs" />
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
