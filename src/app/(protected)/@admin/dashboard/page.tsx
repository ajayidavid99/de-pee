// de-pee/src/app/(protected)/@admin/dashboard/page.tsx
import { PageHeader, PageLayout } from '@/components/shared/page-header';
import { requirePermission } from '@/features/auth/rbac/require';
import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ClipboardList, Stethoscope } from 'lucide-react';
import { AddProductDialog } from '@/features/products/components/add-product-dialog';
import { getProducts, getCategories } from '@/features/products/server/actions';

export default async function AdminDashboardPage() {
  // 1. Strict RBAC middleware assertion protection
  await requirePermission('dashboard.view:admin');
  const t = await getTranslations('dashboard.admin');

  // 2. Dual parallel data queries directly from Neon instance storage pools
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  // 3. Dynamic metric computations mapping over real row indicators
  const totalProducts = products.length;
  const totalCategories = categories.filter(c => c.parent_id === null).length;

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Constrained Responsive Header block layout */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4">
          <div className="min-w-0 flex-1">
            <PageHeader 
              title={t('title') || 'Medical Equipment Management'} 
              subtitle={t('description') || 'Control and update De-Pee internal catalogs across Lagos and Ife hubs.'} 
            />
          </div>
          <div className="shrink-0 w-full sm:w-auto">
            <AddProductDialog />
          </div>
        </div>

        {/* Live Metrics Monitoring Blocks */}
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
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Active Hub Branches</p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">2 (Lagos / Ife)</h3>
            </div>
          </Card>
        </div>

        {/* Live Real-time Inventory Data Grid */}
        <Card className="overflow-hidden border-border/80">
          <div className="p-4 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">Live Equipment Inventory</h3>
              <p className="text-[11px] text-muted-foreground">View and modify available consumables and technical machines.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {products.length === 0 ? (
              <div className="text-center py-12 border-t border-border/40 text-muted-foreground space-y-2">
                <Stethoscope className="h-8 w-8 mx-auto opacity-40 animate-pulse" />
                <p className="text-xs">No equipment records stored in Neon yet. Use the action button above to add entries.</p>
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
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted border border-border/40 shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback broken image placeholder
                              e.currentTarget.src = "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=100&q=80";
                            }}
                          />
                        </div>
                      </td>
                      <td className="p-3 font-bold text-foreground max-w-[180px] truncate">
                        {product.name}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center rounded-sm bg-blue-500/10 px-2 py-0.5 Jacks text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                          {product.category_name}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground max-w-[240px] truncate font-mono text-[11px]">
                        {product.specification}
                      </td>
                      <td className="p-3 text-right space-x-2 whitespace-nowrap">
                        <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[11px] px-2.5 text-destructive hover:bg-destructive/10">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}