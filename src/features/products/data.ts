// de-pee/src/features/products/data.ts

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string; // Newly added to isolate child sub-groups
  description: string;
  specification: string;
  image: string;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  subCategories?: SubCategory[];
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'all', name: 'All Products' },
  { 
    id: 'diagnostics', 
    name: 'Diagnostic Tools',
    subCategories: [
      { id: 'electronic-monitors', name: 'Electronic Monitors' },
      { id: 'optical-instruments', name: 'Optical Instruments' }
    ]
  },
  { 
    id: 'surgical', 
    name: 'Surgical Instruments',
    subCategories: [
      { id: 'cutting', name: 'Cutting Instruments' },
      { id: 'holding', name: 'Holding & Forceps' }
    ]
  },
  { 
    id: 'consumables', 
    name: 'Hospital Consumables',
    subCategories: [
      { id: 'apparel', name: 'Medical Apparel' },
      { id: 'dressings', name: 'Wound Dressings' }
    ]
  },
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
    subCategory: 'electronic-monitors', // Map to child sub-groups
    description: 'Clinical grade precision automated reader with multi-user memory tracking.',
    specification: 'Oscillometric method, 0-299 mmHg range',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-2',
    name: 'Ophthalmoscope Pro V1',
    category: 'diagnostics',
    subCategory: 'optical-instruments',
    description: 'High-illumination diagnostic tool for clear retinal examination.',
    specification: 'Halogen illumination, 28 diagnostic lenses',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-3',
    name: 'Stainless Steel Surgical Forceps',
    category: 'surgical',
    subCategory: 'holding',
    description: 'Ergonomic, high-alloy durability engineered for surgical precision.',
    specification: 'Medical Grade Stainless Steel, 15cm length',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-4',
    name: 'Premium Scalpel Blades #11',
    category: 'surgical',
    subCategory: 'cutting',
    description: 'Sterile high carbon steel precision blades for surgical procedures.',
    specification: 'Pack of 100, Gamma sterilized',
    image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-5',
    name: 'Premium Nitrile Exam Gloves',
    category: 'consumables',
    subCategory: 'apparel',
    description: 'Powder-free extra barrier protection with micro-textured fingertips.',
    specification: 'Ambidextrous, Beaded cuff, 100pcs per box',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-6',
    name: 'Sterile Gauze Sponges 4x4',
    category: 'consumables',
    subCategory: 'dressings',
    description: 'Highly absorbent pure cotton operational dressings.',
    specification: '8-ply, 100% cotton, 2pcs per peel pack',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
  },
  // Remaining base entries stay clean...
  {
    id: 'prod-7',
    name: 'Automated External Defibrillator (AED)',
    category: 'life-support',
    description: 'Portable biphasic defibrillator with real-time CPR feedback and voice guidance.',
    specification: 'Biphasic Truncated Exponential waveform, IP55 rated',
    image: 'https://images.unsplash.com/photo-1606206591343-cc8853704688?auto=format&fit=crop&w=600&q=80',
  },
];