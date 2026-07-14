// src/features/products/components/add-post-dialog.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus } from 'lucide-react';
import { createBlogPost } from '@/features/blog/server/actions';

export function AddPostDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categoryLabel: '',
    authorName: '',
    authorRole: '',
    image: '',
    readTime: '5 min read',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBlogPost(formData);
      setOpen(false);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        categoryLabel: '',
        authorName: '',
        authorRole: '',
        image: '',
        readTime: '5 min read',
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs font-bold gap-1">
          <Plus className="h-3 w-3" /> New Blog Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold flex items-center gap-1.5">
            <FileText className="h-4 w-4" /> Create Blog Article
          </DialogTitle>
          <DialogDescription className="text-xs">
            Publish educational procurement logs or strategic clinical guides.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
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

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="image" className="text-xs">Cover Banner URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://unsplash.com/..."
                required
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="readTime" className="text-xs">Est. Read Time</Label>
              <Input
                id="readTime"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="5 min read"
                required
                className="h-8 text-xs"
              />
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