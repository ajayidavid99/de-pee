// de-pee/src/app/(protected)/@admin/dashboard/page.tsx

import { PageHeader, PageLayout } from '@/components/shared/page-header';
import { requirePermission } from '@/features/auth/rbac/require';
import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ClipboardList, Stethoscope } from 'lucide-react';
import { AddProductDialog } from '@/features/products/components/add-product-dialog';

// Temporarily import mocks until database queries are fully mapped
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES } from '@/features/products/data';

export default async function AdminDashboardPage() {
  await requirePermission('dashboard.view:admin');
  const t = await getTranslations('dashboard.admin');

  const totalProducts = MOCK_PRODUCTS.length;
  const totalCategories = PRODUCT_CATEGORIES.filter(c => c.id !== 'all').length;

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Dynamic Context Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader 
            title={t('title') || 'Medical Equipment Management'} 
            subtitle={t('description') || 'Control and update De-Pee internal catalogs across Lagos and Ife hubs.'} 
          />
          {/* Replaced static button with interactive modal trigger layout */}
          <AddProductDialog />
        </div>

        {/* Dynamic Metric Grid */}
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
              <p className="text-xs font-medium text-muted-foreground">Active Categories</p>
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

        {/* Inventory Table Area */}
        <Card className="overflow-hidden border-border/80">
          <div className="p-4 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">Live Equipment Inventory</h3>
              <p className="text-[11px] text-muted-foreground">View and modify available consumables and technical machines.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                  <th className="p-3 font-semibold">Image</th>
                  <th className="p-3 font-semibold">Product Name</th>
                  <th className="p-3 font-semibold">Primary Group</th>
                  <th className="p-3 font-semibold">Technical Specifications</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {MOCK_PRODUCTS.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted border border-border/40 shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-3 font-bold text-foreground max-w-[180px] truncate">
                      {product.name}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-sm bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                        {product.category}
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
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}