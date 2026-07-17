'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UploadCloud } from 'lucide-react';
import { updateBlogPostAction, uploadBlogImageAction } from '@/features/blog/server/actions';
import { toast } from 'sonner';

interface EditPostDialogProps {
  post: any;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function EditPostDialog({ post, open, setOpen }: EditPostDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(post.image || null);

  const [formData, setFormData] = useState({
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    categoryLabel: post.category_label || '',
    authorName: post.author_name || '',
    authorRole: post.author_role || '',
    readTime: post.read_time || '5 min read',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = post.image;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        finalImageUrl = await uploadBlogImageAction(uploadData);
      }

      await updateBlogPostAction(post.id, {
        ...formData,
        image: finalImageUrl,
      });

      toast.success("Insights entry updated!");
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save data changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Edit Advisory Entry</DialogTitle>
          <DialogDescription className="text-xs">Modify the raw properties or documentation copy below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Article Title</Label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="h-8 text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Topic Category</Label>
            <Input value={formData.categoryLabel} onChange={(e) => setFormData({ ...formData, categoryLabel: e.target.value })} required className="h-8 text-xs" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Author Name</Label>
              <Input value={formData.authorName} onChange={(e) => setFormData({ ...formData, authorName: e.target.value })} required className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Author Role</Label>
              <Input value={formData.authorRole} onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })} required className="h-8 text-xs" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Banner Image Asset</Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center border border-dashed border-border/100 rounded-lg p-4 cursor-pointer hover:bg-muted/40 transition">
                  <UploadCloud className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-[11px] font-medium text-muted-foreground">Replace Banner Asset</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files[0]) {
                        setSelectedFile(files[0]);
                        setPreviewUrl(URL.createObjectURL(files[0]));
                      }
                    }}
                  />
                </label>
              </div>
              {previewUrl && (
                <div className="h-16 w-16 border rounded-lg overflow-hidden shrink-0 bg-muted">
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Brief Excerpt</Label>
            <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} required rows={2} className="text-xs resize-none" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Content Body</Label>
            <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows={5} className="text-xs" />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)} className="h-8 text-xs">Cancel</Button>
            <Button type="submit" size="sm" disabled={loading} className="h-8 text-xs font-bold">
              {loading && <Loader2 className="h-3 w-3 animate-spin mr-1" />} Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}