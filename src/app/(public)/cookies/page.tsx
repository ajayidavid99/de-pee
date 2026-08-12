// src/app/(public)/cookies/page.tsx
import { PageHeader } from '@/components/shared/page-header';

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
      <PageHeader title="Cookie Policy" />
      <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
        <p><strong>Effective Date:</strong> [Insert Date]</p>
        <p>We use essential cookies to maintain secure sessions and keep you logged in. We may also use performance cookies to understand how our website is used. You can manage your cookie preferences through your browser settings.</p>
      </div>
    </div>
  );
}