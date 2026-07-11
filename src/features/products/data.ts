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
  image?: string;
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
  // 1. Life Support & Resuscitation
  {
    id: 'prod-7',
    name: 'Automated External Defibrillator (AED)',
    category: 'life-support',
    description: 'Portable biphasic defibrillator with real-time CPR feedback and voice guidance.',
    specification: 'Biphasic Truncated Exponential waveform, IP55 rated',
  },
  {
    id: 'prod-8',
    name: 'Silicone Manual Resuscitator Bag',
    category: 'life-support',
    description: 'Autoclavable silicone AMBU bag with pressure-limiting valve for resuscitation.',
    specification: 'Adult size, 1500ml bag volume, 60cm H2O pop-off valve',
  },
  // 2. Patient Monitoring & Vitals
  {
    id: 'prod-9',
    name: 'Multi-Parameter Patient Monitor',
    category: 'patient-monitoring',
    description: 'Comprehensive vital signs monitor tracking ECG, SpO2, NIBP, TEMP, and Respiration.',
    specification: '12.1-inch TFT color display, rechargeable Li-ion battery',
  },
  {
    id: 'prod-10',
    name: 'Fingertip Pulse Oximeter',
    category: 'patient-monitoring',
    description: 'Fast, accurate oxygen saturation and pulse rate monitoring for clinical check-ups.',
    specification: 'LED display, SpO2 range 70%-100%, Accuracy ±2%',
  },
  // 3. Wound Care & Bandaging
  {
    id: 'prod-11',
    name: 'Hydrocolloid Wound Dressing',
    category: 'wound-care',
    description: 'Advanced moisture-retentive, sterile dressings for chronic and acute wound management.',
    specification: '10cm x 10cm, Pack of 10 dressings, self-adhesive',
  },
  {
    id: 'prod-12',
    name: 'Hypoallergenic Surgical Paper Tape',
    category: 'wound-care',
    description: 'Gentle, breathable medical adhesive tape for securing dressings and tubing.',
    specification: '2.5cm x 5m rolls, Box of 12 rolls, Latex-free',
  },
  // 4. Respiratory & Oxygen Therapy
  {
    id: 'prod-13',
    name: 'Medical Oxygen Concentrator',
    category: 'respiratory',
    description: 'High-purity continuous flow oxygen delivery system designed for clinical facility use.',
    specification: '1-5 L/min flow rate, 93% ±3% oxygen purity concentration',
  },
  {
    id: 'prod-14',
    name: 'Heavy-Duty Compressor Nebulizer',
    category: 'respiratory',
    description: 'Efficient aerosol therapy delivery system for respiratory medication administration.',
    specification: 'Operating pressure 10-16 Psi, Particle size < 5 microns',
  },
  // 5. Mobility & Patient Transfer
  {
    id: 'prod-15',
    name: 'Hydraulic Emergency Patient Stretcher',
    category: 'mobility',
    description: 'Mobile transfer stretcher with dual hydraulic cylinders for elevation and trendelenburg adjustments.',
    specification: 'Steel frame, 200kg weight capacity, 150mm central locking casters',
  },
  {
    id: 'prod-16',
    name: 'Four-Hook Stainless Steel IV Stand',
    category: 'mobility',
    description: 'Heavy-base intravenous drip pole with smooth-rolling swivel casters and height lock.',
    specification: 'Stainless steel construction, adjustable height 130cm - 210cm',
  },
];