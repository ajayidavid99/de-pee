// src/features/products/components/trend-toggles.tsx
'use client';

import { useTransition } from 'react';
import { toggleProductTrend } from '../server/actions';
import { toast } from 'sonner';

interface TrendTogglesProps {
  productId: string;
  isFeatured: boolean;
  isHotDeal: boolean;
  isPremium: boolean;
}

export function TrendToggles({ productId, isFeatured, isHotDeal, isPremium }: TrendTogglesProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (flag: 'is_featured' | 'is_hot_deal' | 'is_premium', currentValue: boolean) => {
    startTransition(async () => {
      const res = await toggleProductTrend(productId, flag, !currentValue);
      if (res?.success) {
        toast.success('Trend status updated');
      } else {
        toast.error('Failed to update status');
      }
    });
  };

  return (
    <div className={`flex items-center gap-3 text-[10px] ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Featured Toggle */}
      <label className="flex items-center gap-1 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={() => handleToggle('is_featured', isFeatured)}
          className="rounded border-border accent-amber-500"
        />
        <span className={isFeatured ? 'font-bold text-amber-500' : 'text-muted-foreground'}>
          Featured
        </span>
      </label>

      {/* Hot Deal Toggle */}
      <label className="flex items-center gap-1 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isHotDeal}
          onChange={() => handleToggle('is_hot_deal', isHotDeal)}
          className="rounded border-border accent-red-500"
        />
        <span className={isHotDeal ? 'font-bold text-red-500' : 'text-muted-foreground'}>
          Hot
        </span>
      </label>

      {/* Premium Toggle */}
      <label className="flex items-center gap-1 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isPremium}
          onChange={() => handleToggle('is_premium', isPremium)}
          className="rounded border-border accent-purple-500"
        />
        <span className={isPremium ? 'font-bold text-purple-500' : 'text-muted-foreground'}>
          Premium
        </span>
      </label>
    </div>
  );
}