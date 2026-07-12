// de-pee/src/features/products/data.ts

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string; // Optional property for nested categorization
  description: string;
  specification: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  subCategories?: { id: string; name: string }[];
}

export const PRODUCT_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Products' },
  { id: 'diagnostics', name: 'Diagnostic Tools' },
  { 
    id: 'surgical', 
    name: 'Surgical Instruments',
    subCategories: [
      { id: 'cutting-tools', name: 'Cutting Instruments' },
      { id: 'forceps-clamps', name: 'Forceps & Clamps' }
    ]
  },
  { id: 'consumables', name: 'Hospital Consumables' },
  { id: 'life-support', name: 'Life Support & Resuscitation' },
  { id: 'patient-monitoring', name: 'Patient Monitoring & Vitals' },
  { id: 'wound-care', name: 'Wound Care & Bandaging' },
  { id: 'respiratory', name: 'Respiratory & Oxygen Therapy' },
  { id: 'mobility', name: 'Mobility & Patient Transfer' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Digital Blood Pressure Monitor',
    category: 'diagnostics',
    description: 'Clinical grade precision automated reader with multi-user memory tracking.',
    specification: 'Oscillometric method, 0-299 mmHg range',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-2',
    name: 'Ophthalmoscope Pro V1',
    category: 'diagnostics',
    description: 'High-illumination diagnostic tool for clear retinal examination.',
    specification: 'Halogen illumination, 28 diagnostic lenses',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-3',
    name: 'Stainless Steel Surgical Forceps',
    category: 'surgical',
    subCategory: 'forceps-clamps',
    description: 'Ergonomic, high-alloy durability engineered for surgical precision.',
    specification: 'Medical Grade Stainless Steel, 15cm length',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-4',
    name: 'Premium Scalpel Blades #11',
    category: 'surgical',
    subCategory: 'cutting-tools',
    description: 'Sterile high carbon steel precision blades for surgical procedures.',
    specification: 'Pack of 100, Gamma sterilized',
    image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-5',
    name: 'Premium Nitrile Exam Gloves',
    category: 'consumables',
    description: 'Powder-free extra barrier protection with micro-textured fingertips.',
    specification: 'Ambidextrous, Beaded cuff, 100pcs per box',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
  },
];