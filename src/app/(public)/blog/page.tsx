// de-pee/src/app/(public)/blog/page.tsx
import BlogHub from '@/components/shared/blog-hub';

export const metadata = {
  title: 'Insights & Resources | De-Pee Medical',
  description: 'Read the latest clinical breakdowns, medical hardware management playbooks, and West African equipment procurement indexes.',
};

export default function BlogPage() {
  return <BlogHub />;
}