
export interface Product {
  id: string;
  name: string;
  category: 'diagnostics' | 'surgical' | 'consumables';
  description: string;
  specification: string;
  image?: string;
}

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'diagnostics', name: 'Diagnostic Tools' },
  { id: 'surgical', name: 'Surgical Instruments' },
  { id: 'consumables', name: 'Hospital Consumables' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Digital Blood Pressure Monitor',
    category: 'diagnostics',
    description: 'Clinical grade precision automated reader with multi-user memory tracking.',
    specification: 'Oscillometric method, 0-299 mmHg range',
  },
  {
    id: 'prod-2',
    name: 'Ophthalmoscope Pro V1',
    category: 'diagnostics',
    description: 'High-illumination diagnostic tool for clear retinal examination.',
    specification: 'Halogen illumination, 28 diagnostic lenses',
  },
  {
    id: 'prod-3',
    name: 'Stainless Steel Surgical Forceps',
    category: 'surgical',
    description: 'Ergonomic, high-alloy durability engineered for surgical precision.',
    specification: 'Medical Grade Stainless Steel, 15cm length',
  },
  {
    id: 'prod-4',
    name: 'Premium Scalpel Blades #11',
    category: 'surgical',
    description: 'Sterile high carbon steel precision blades for surgical procedures.',
    specification: 'Pack of 100, Gamma sterilized',
  },
  {
    id: 'prod-5',
    name: 'Premium Nitrile Exam Gloves',
    category: 'consumables',
    description: 'Powder-free extra barrier protection with micro-textured fingertips.',
    specification: 'Ambidextrous, Beaded cuff, 100pcs per box',
  },
  {
    id: 'prod-6',
    name: 'Sterile Gauze Sponges 4x4',
    category: 'consumables',
    description: 'Highly absorbent pure cotton operational dressings.',
    specification: '8-ply, 100% cotton, 2pcs per peel pack',
  },
];