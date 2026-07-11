// de-pee/src/features/blog/data.ts

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'clinical' | 'equipment' | 'procurement' | 'industry';
  categoryLabel: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  image: string;
  featured?: boolean;
}

export const MOCK_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Optimizing Medical Equipment Procurement Budgets for Nigerian Hospitals',
    slug: 'optimizing-medical-equipment-procurement',
    category: 'procurement',
    categoryLabel: 'Hospital Procurement',
    excerpt: 'Navigating fluctuating supply chains and equipment maintenance contracts requires a deliberate, strategic acquisition playbook.',
    content: '',
    publishedAt: 'July 10, 2026',
    readTime: '6 min read',
    author: { name: 'Dr. Femi Adebayo', role: 'Clinical Operations Consultant' },
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'post-2',
    title: 'The Essential Guide to Maintaining Biphasic AED Systems in High-Traffic Facilities',
    slug: 'maintaining-biphasic-aed-systems',
    category: 'equipment',
    categoryLabel: 'Equipment Guide',
    excerpt: 'Regular calibration and battery diagnostics save lives. Learn the critical parameters for keeping life-support devices field-ready.',
    content: '',
    publishedAt: 'July 05, 2026',
    readTime: '4 min read',
    author: { name: 'Engr. Chidi Okafor', role: 'Biomedical Engineer' },
    image: 'https://images.unsplash.com/photo-1606206591343-cc8853704688?auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: 'post-3',
    title: 'Sterile Barrier Upgrades: Best Practices in Modern Operating Theatres',
    slug: 'sterile-barrier-upgrades-operating-theatres',
    category: 'clinical',
    categoryLabel: 'Clinical Practice',
    excerpt: 'From micro-textured nitrile exam variables to high-ply absorption dressings, managing standard surgical contamination layers.',
    content: '',
    publishedAt: 'June 28, 2026',
    readTime: '5 min read',
    author: { name: 'Matron Nike Awosika', role: 'Theatre Nursing Lead' },
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: 'post-4',
    title: 'Telemetry & Remote Patient Monitoring: Expanding Rural Care Networks',
    slug: 'telemetry-remote-patient-monitoring',
    category: 'industry',
    categoryLabel: 'Healthcare Trends',
    excerpt: 'How modern multi-parameter vital systems are helping decentralize standard diagnostic readings from metropolitan hubs.',
    content: '',
    publishedAt: 'June 15, 2026',
    readTime: '7 min read',
    author: { name: 'Dr. Amara Eke', role: 'Health Informatics Director' },
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80',
    featured: false
  }
];