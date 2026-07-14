// src/app/(public)/blog/page.tsx
import BlogHub from '@/components/shared/blog-hub';
import { getBlogPosts } from '@/features/blog/server/actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Insights & Resources | De-Pee Medical',
  description: 'Read the latest clinical breakdowns, medical hardware management playbooks, and West African equipment procurement indexes.',
};

export default async function BlogPage() {
  // Query dynamic database articles
  const livePosts = await getBlogPosts();

  // Pass dynamic records directly to your visual Hub rendering layout
  return <BlogHub initialPosts={livePosts} />;
}