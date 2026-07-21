// src/app/(protected)/@admin/dashboard/page.tsx
import { DashboardActions } from '@/components/shared/dashboard-actions';
import { PageHeader, PageLayout } from '@/components/shared/page-header';
import { requirePermission } from '@/features/auth/rbac/require';
import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Stethoscope, FileText } from 'lucide-react';
import { AddProductDialog } from '@/features/products/components/add-product-dialog';
import { AddCategoryDialog } from '@/features/products/components/add-category-dialog';
import { AddPostDialog } from '@/features/blog/components/add-post-dialog';
import { 
  deleteProduct, 
  deleteCategory, 
  getProducts, 
  getCategories, 
  type DBProduct, 
  type DBCategory 
} from '@/features/products/server/actions';
import { deleteBlogPost, getBlogPosts, type BlogPost } from '@/features/blog/server/actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await requirePermission('dashboard.view:admin');
  const t = await getTranslations('dashboard.admin');

  let products: DBProduct[] = [];
  let categories: DBCategory[] = [];
  let posts: BlogPost[] = [];

  const results = await Promise.allSettled([
    getProducts(),
    getCategories(),
    getBlogPosts(),
  ]);

  if (results[0].status === 'fulfilled') products = results[0].value || [];
  if (results[1].status === 'fulfilled') categories = results[1].value || [];
  if (results[2].status === 'fulfilled') posts = results[2].value || [];

  const totalProducts = products.length;
  const totalCategories = categories.filter(c => c && c.parent_id === null).length;
  const totalPosts = posts.length;

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
          <div className="min-w-0 flex-1">
            <PageHeader title={t('title')} subtitle={t('description')} />
          </div>
          <div className="shrink-0 flex flex-wrap gap-2">
            <AddCategoryDialog categories={categories} />
            <AddProductDialog categories={categories} />
            <AddPostDialog />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="p-4 flex items-center gap-4 border-border/60">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Catalog Items</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">{totalProducts}</h3>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4 border-border/60">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Active Main Categories</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">{totalCategories}</h3>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-4 border-border/60">
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Published Insights</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">{totalPosts}</h3>
            </div>
          </Card>
        </div>

        {/* Dynamic Admin Tabs */}
        <Tabs defaultValue="equipment" className="space-y-4">
          <TabsList className="bg-muted/60 p-1 border border-border/40 h-9">
            <TabsTrigger value="equipment" className="text-xs px-4 h-7">Equipment Portfolio</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs px-4 h-7">Category Hierarchy</TabsTrigger>
            <TabsTrigger value="blog" className="text-xs px-4 h-7">Article Workspace</TabsTrigger>
          </TabsList>

          {/* Equipment Tab */}
          <TabsContent value="equipment">
            <Card className="overflow-hidden border-border/80">
              <div className="p-4 border-b border-border/60 bg-muted/20">
                <h3 className="text-sm font-bold text-foreground">Live Equipment Inventory</h3>
                <p className="text-[11px] text-muted-foreground">View and modify active diagnostic devices and medical assets.</p>
              </div>

              <div className="overflow-x-auto">
                {products.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground space-y-2">
                    <Stethoscope className="h-8 w-8 mx-auto opacity-40" />
                    <p className="text-xs">No equipment records stored in database yet.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                        <th className="p-3 font-semibold">Image</th>
                        <th className="p-3 font-semibold">Product Name</th>
                        <th className="p-3 font-semibold">Allocated Category</th>
                        <th className="p-3 font-semibold">Technical Specifications</th>
                        <th className="p-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {products.map((product) => {
                        const fallbackImg = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=100&q=80";
                        const imageUrl = product.image && product.image.startsWith('http') ? product.image : fallbackImg;

                        return (
                          <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="h-10 w-10 rounded-md overflow-hidden bg-muted border border-border/40 shrink-0">
                                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="p-3 font-bold text-foreground max-w-[180px] truncate">{product.name}</td>
                            <td className="p-3">
                              <span className="inline-flex items-center rounded-sm bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                                {product.category_name}
                              </span>
                            </td>
                            <td className="p-3 text-muted-foreground max-w-[240px] truncate font-mono text-[11px]">
                              {product.specification || 'No technical specifications provided'}
                            </td>
                            <td className="p-3 text-right">
                              <DashboardActions id={product.id} onDelete={deleteProduct} rawItem={product} type="product" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* CATEGORY MANAGEMENT TAB */}
          <TabsContent value="categories">
            <Card className="overflow-hidden border-border/80">
              <div className="p-4 border-b border-border/60 bg-muted/20">
                <h3 className="text-sm font-bold text-foreground">Categories & Sub-Categories</h3>
                <p className="text-[11px] text-muted-foreground">Manage hierarchy, optional cover imagery, and dynamic classifications.</p>
              </div>

              <div className="overflow-x-auto">
                {categories.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground space-y-2">
                    <Layers className="h-8 w-8 mx-auto opacity-40" />
                    <p className="text-xs">No categories created yet.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                        <th className="p-3 font-semibold">Banner</th>
                        <th className="p-3 font-semibold">Category Name</th>
                        <th className="p-3 font-semibold">Type / Parent</th>
                        <th className="p-3 font-semibold">System Slug / ID</th>
                        <th className="p-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {categories.map((category) => {
                        const parent = categories.find((c) => c.id === category.parent_id);
                        const isSub = !!category.parent_id;

                        return (
                          <tr key={category.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="h-9 w-9 rounded-md overflow-hidden bg-muted border border-border/40 shrink-0">
                                {category.image ? (
                                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-muted-foreground font-mono uppercase bg-muted/60">
                                    No Img
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3 font-bold text-foreground max-w-[180px] truncate">
                              {category.name}
                            </td>
                            <td className="p-3">
                              {isSub ? (
                                <span className="inline-flex items-center rounded-sm bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                                  {parent?.name || 'Sub-category'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-sm bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                  Root Category
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-muted-foreground font-mono text-[11px]">
                              {category.id}
                            </td>
                            <td className="p-3 text-right">
                              <DashboardActions
                                id={category.id}
                                onDelete={deleteCategory}
                                rawItem={category}
                                categories={categories}
                                type="category"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card className="overflow-hidden border-border/80">
              <div className="p-4 border-b border-border/60 bg-muted/20">
                <h3 className="text-sm font-bold text-foreground">Live Insights Feed</h3>
                <p className="text-[11px] text-muted-foreground">Manage editorial clinical advice columns and hardware articles.</p>
              </div>

              <div className="overflow-x-auto">
                {posts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground space-y-2">
                    <FileText className="h-8 w-8 mx-auto opacity-40" />
                    <p className="text-xs">No articles published yet.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                        <th className="p-3 font-semibold">Image</th>
                        <th className="p-3 font-semibold">Article Title</th>
                        <th className="p-3 font-semibold">Topic Category</th>
                        <th className="p-3 font-semibold">Author Profile</th>
                        <th className="p-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {posts.map((post) => {
                        const fallbackImg = "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=100&q=80";
                        const imageUrl = post.image && post.image.startsWith('http') ? post.image : fallbackImg;

                        return (
                          <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="h-10 w-10 rounded-md overflow-hidden bg-muted border border-border/40 shrink-0">
                                <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="p-3 font-bold text-foreground max-w-[200px] truncate">{post.title}</td>
                            <td className="p-3">
                              <span className="inline-flex items-center rounded-sm bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                                {post.category_label}
                              </span>
                            </td>
                            <td className="p-3 text-muted-foreground font-medium text-[11px]">
                              {post.author_name} ({post.author_role})
                            </td>
                            <td className="p-3 text-right">
                              <DashboardActions id={post.id} onDelete={deleteBlogPost} rawItem={post} type="post" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}