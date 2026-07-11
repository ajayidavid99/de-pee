// de-pee/src/features/products/data.ts

export interface Product {
  id: string;
  name: string;
  category: 
    | 'diagnostics' 
    | 'surgical' 
    | 'consumables' 
    | 'life-support' 
    | 'patient-monitoring' 
    | 'wound-care' 
    | 'respiratory' 
    | 'mobility';
  description: string;
  specification: string;
  image: string; // Made required to support the layout safely
}

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'diagnostics', name: 'Diagnostic Tools' },
  { id: 'surgical', name: 'Surgical Instruments' },
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
    description: 'Ergonomic, high-alloy durability engineered for surgical precision.',
    specification: 'Medical Grade Stainless Steel, 15cm length',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-4',
    name: 'Premium Scalpel Blades #11',
    category: 'surgical',
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
  {
    id: 'prod-6',
    name: 'Sterile Gauze Sponges 4x4',
    category: 'consumables',
    description: 'Highly absorbent pure cotton operational dressings.',
    specification: '8-ply, 100% cotton, 2pcs per peel pack',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-7',
    name: 'Automated External Defibrillator (AED)',
    category: 'life-support',
    description: 'Portable biphasic defibrillator with real-time CPR feedback and voice guidance.',
    specification: 'Biphasic Truncated Exponential waveform, IP55 rated',
    image: 'https://images.unsplash.com/photo-1606206591343-cc8853704688?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-8',
    name: 'Silicone Manual Resuscitator Bag',
    category: 'life-support',
    description: 'Autoclavable silicone AMBU bag with pressure-limiting valve for resuscitation.',
    specification: 'Adult size, 1500ml bag volume, 60cm H2O pop-off valve',
    image: 'https://images.unsplash.com/photo-1615461066830-63494ce3e485?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-9',
    name: 'Multi-Parameter Patient Monitor',
    category: 'patient-monitoring',
    description: 'Comprehensive vital signs monitor tracking ECG, SpO2, NIBP, TEMP, and Respiration.',
    specification: '12.1-inch TFT color display, rechargeable Li-ion battery',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-10',
    name: 'Fingertip Pulse Oximeter',
    category: 'patient-monitoring',
    description: 'Fast, accurate oxygen saturation and pulse rate monitoring for clinical check-ups.',
    specification: 'LED display, SpO2 range 70%-100%, Accuracy ±2%',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-11',
    name: 'Hydrocolloid Wound Dressing',
    category: 'wound-care',
    description: 'Advanced moisture-retentive, sterile dressings for chronic and acute wound management.',
    specification: '10cm x 10cm, Pack of 10 dressings, self-adhesive',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-12',
    name: 'Hypoallergenic Surgical Paper Tape',
    category: 'wound-care',
    description: 'Gentle, breathable medical adhesive tape for securing dressings and tubing.',
    specification: '2.5cm x 5m rolls, Box of 12 rolls, Latex-free',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-13',
    name: 'Medical Oxygen Concentrator',
    category: 'respiratory',
    description: 'High-purity continuous flow oxygen delivery system designed for clinical facility use.',
    specification: '1-5 L/min flow rate, 93% ±3% oxygen purity concentration',
    image: 'https://images.unsplash.com/photo-1615461066830-63494ce3e485?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-14',
    name: 'Heavy-Duty Compressor Nebulizer',
    category: 'respiratory',
    description: 'Efficient aerosol therapy delivery system for respiratory medication administration.',
    specification: 'Operating pressure 10-16 Psi, Particle size < 5 microns',
    image: 'https://images.unsplash.com/photo-1606206591343-cc8853704688?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-15',
    name: 'Hydraulic Emergency Patient Stretcher',
    category: 'mobility',
    description: 'Mobile transfer stretcher with dual hydraulic cylinders for elevation and trendelenburg adjustments.',
    specification: 'Steel frame, 200kg weight capacity, 150mm central locking casters',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-16',
    name: 'Four-Hook Stainless Steel IV Stand',
    category: 'mobility',
    description: 'Heavy-base intravenous drip pole with smooth-rolling swivel casters and height lock.',
    specification: 'Stainless steel construction, adjustable height 130cm - 210cm',
    image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=600&q=80',
  },
];