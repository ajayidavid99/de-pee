// src/features/blog/components/add-post-dialog.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, UploadCloud } from 'lucide-react';
import { createBlogPost, uploadBlogImageAction } from '@/features/blog/server/actions';
import { toast } from 'sonner';

export function AddPostDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryLabel: '',
    authorName: '',
    authorRole: '',
    readTime: '5 min read',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please upload an image banner.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload file to Vercel Blob
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      const uploadedImageUrl = await uploadBlogImageAction(uploadData);

      // 2. Submit blog post with hosted image url
      await createBlogPost({
        ...formData,
        image: uploadedImageUrl,
      });

      toast.success("Blog post published!");
      setOpen(false);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        categoryLabel: '',
        authorName: '',
        authorRole: '',
        readTime: '5 min read',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to publish post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 text-xs gap-1">
          <FileText className="h-3.5 w-3.5" /> Write Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Write Insights & Resources Entry</DialogTitle>
          <DialogDescription className="text-xs">
            Draft education notes or regional procurement announcements.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs">Article Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Mitigating Equipment Downtime in Intensive Units"
              required
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="categoryLabel" className="text-xs">Topic Category</Label>
            <Input
              id="categoryLabel"
              value={formData.categoryLabel}
              onChange={(e) => setFormData({ ...formData, categoryLabel: e.target.value })}
              placeholder="e.g., Procurement, Engineering, Infrastructure"
              required
              className="h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="authorName" className="text-xs">Author Name</Label>
              <Input
                id="authorName"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                placeholder="Dr. John Doe"
                required
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="authorRole" className="text-xs">Author Role / Designee</Label>
              <Input
                id="authorRole"
                value={formData.authorRole}
                onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                placeholder="Clinical Director"
                required
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Banner Image Asset</Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center border border-dashed border-border/100 rounded-lg p-4 cursor-pointer hover:bg-muted/40 transition">
                  <UploadCloud className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-[11px] font-medium text-muted-foreground">Select banner image</span>
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
                    required
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
            <Label htmlFor="excerpt" className="text-xs">Brief Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief summary sentence to display on search feeds."
              required
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-xs">Post Markdown / Prose Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Provide complete educational narrative content..."
              required
              rows={5}
              className="text-xs font-sans"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="h-8 text-xs font-bold">
              {loading ? 'Publishing...' : 'Publish Article'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}