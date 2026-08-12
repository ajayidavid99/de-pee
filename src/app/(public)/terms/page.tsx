// src/app/(public)/terms/page.tsx
import { PageHeader } from '@/components/shared/page-header';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
      <PageHeader title="Terms of Service" />
      <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
        <p><strong>Effective Date:</strong> [Insert Date]</p>
        <p>By registering for an account or making a purchase on De-Pee Ventures, you agree to abide by the following terms...</p>
        {/* Add your specific terms regarding product sales, quote requests, and liability here */}
      </div>
    </div>
  );
}