-- ==========================================
-- 1. DROP EXISTING TABLES TO RESET SCHEMA
-- ==========================================
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;

-- ==========================================
-- 2. CREATE SCHEMAS
-- ==========================================

-- Categories Table (Includes new image field and parent_id for nesting)
CREATE TABLE categories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    parent_id VARCHAR(255) REFERENCES categories(id) ON DELETE SET NULL
);

-- Products Table (Supports explicit prod_ string IDs)
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    specification TEXT NOT NULL,
    image TEXT NOT NULL,
    category_id VARCHAR(255) REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE blog_posts (
    id VARCHAR(255) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category_label VARCHAR(100) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    read_time VARCHAR(50) NOT NULL,
    published_at VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. SEED CATEGORIES (Primary & Nested Sub-Categories)
-- ==========================================

-- Primary Main Categories
INSERT INTO categories (id, name, image, parent_id) VALUES 
('diagnostics', 'Diagnostic Systems & Imaging', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80', NULL),
('maternal-care', 'Maternal & Neonatal Health', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80', NULL),
('surgical-theatre', 'Surgical & Operating Theatre', 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80', NULL),
('cold-chain-power', 'Cold-Chain & Power Solutions', 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80', NULL),
('consumables-ppe', 'Clinical Consumables & PPE', 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80', NULL);

-- Sub-Categories (Nested)
INSERT INTO categories (id, name, image, parent_id) VALUES 
-- Under Diagnostics
('ultrasound', 'Ultrasound & Sonography Systems', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80', 'diagnostics'),
('cardiac-monitors', 'ECG & Vital Sign Monitors', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80', 'diagnostics'),

-- Under Maternal Care
('infant-care', 'Incubators & Radiant Warmers', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80', 'maternal-care'),
('fetal-monitoring', 'Fetal Doppler & CTG Monitors', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80', 'maternal-care'),

-- Under Surgical Theatre
('stainless-instruments', 'Autoclavable Surgical Instruments', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80', 'surgical-theatre'),
('anaesthesia-suction', 'Suction Machines & Anaesthesia', 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80', 'surgical-theatre'),

-- Under Cold-Chain & Power
('solar-refrigerators', 'Solar Vaccine & Blood Bank Fridges', 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80', 'cold-chain-power'),
('medical-ups', 'Medical-Grade Online UPS & Surge', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', 'cold-chain-power'),

-- Under Consumables & PPE
('wound-care-sterile', 'Sterile Syringes & Wound Care', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', 'consumables-ppe'),
('protective-wear', 'Nitrile Gloves & Surgical Drapes', 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80', 'consumables-ppe');

-- ==========================================
-- 4. SEED PRODUCTS (Targeting African/Nigerian Healthcare Operations)
-- ==========================================

INSERT INTO products (id, name, description, specification, image, category_id) VALUES 
(
    'prod_a1111111-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Chison ECO3 Expert Portable Ultrasound Unit',
    'Compact, ultra-durable black and white Doppler ultrasound machine designed specifically for mobile clinics, rural health post outreaches, and maternity centers across regional centers like Lagos, Ife, and Ibadan.',
    'Display: 12-inch LED anti-glare screen\nTransducer Ports: 2 Active ports\nBattery: Built-in rechargeable Lithium-Ion (2.5 hours continuous execution)\nWeight: 6.5 kg\nProbes Supported: Convex, Linear, Transvaginal',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    'ultrasound'
),
(
    'prod_b2222222-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Bistos BT-350 LCD Fetal Monitor (CTG)',
    'Advanced cardiotocograph machine used for non-invasive monitoring of fetal heart rate and maternal uterine contractions during labor in busy obstetrics wards.',
    'Screen: 7-inch wide TFT color display\nStorage: Up to 45 hours of patient memory data\nPrinter: In-built thermal printer with continuous auto-feed paper\nProbes: Dual Doppler probes for twin monitoring capability',
    'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=600&q=80',
    'fetal-monitoring'
),
(
    'prod_c3333333-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Heavy-Duty Double-Jar Electric Suction Machine (20L/min)',
    'High-vacuum, high-flow mobile clinical aspiration pump ideal for surgical operating theatres and emergency wards prone to continuous surgical procedures.',
    'Capacity: Dual 2500ml glass collection jars with overfill prevention valves\nMax Vacuum: ≥ 0.09 MPa\nPump Rate: ≥ 20 Liters/min\nPower Input: AC 220V/50Hz (Stabilized)',
    'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80',
    'anaesthesia-suction'
),
(
    'prod_d4444444-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Bicod Solar-Direct Drive Vaccine Refrigerator (60L)',
    'Off-grid zero-battery solar direct-drive ice-lined refrigerator certified for preserving temperature-sensitive vaccines and blood bags in tropical climates.',
    'Gross Volume: 60 Liters\nTemperature Range: +2°C to +8°C at 43°C Ambient\nPower Source: Direct Solar Panel Array Connection (No batteries required)\nHoldover Time: > 72 Hours during prolonged power failure',
    'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80',
    'solar-refrigerators'
),
(
    'prod_e5555555-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Major Laparotomy & Abdominal Surgical Set (48-Piece)',
    'Hospital-grade, anti-glare finished stainless steel surgical instrument pack tailored for general abdominal procedures, appendectomies, and C-sections.',
    'Grade: AISI 316L Autoclavable Surgical Stainless Steel\nAutoclave Limit: Up to 134°C\nIncludes: Mayo Scissors, Crile Forceps, Scalpel Handles (#3, #4), Tissue Clamps, Stainless Tray',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    'stainless-instruments'
),
(
    'prod_f6666666-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'High-Tactile Powder-Free Nitrile Examination Gloves (Box of 100)',
    'Heavy-duty puncture-resistant nitrile gloves providing maximum protection for clinical diagnostics, emergency treatment, and laboratory sampling.',
    'Material: 100% Synthetic Medical-Grade Nitrile\nColor: Medical Blue\nSizes: Small, Medium, Large, XL\nCertification: ISO 13485, CE Medical Class I',
    'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80',
    'protective-wear'
),
(
    'prod_g7777777-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '3KVA Pure Sine Wave Online Medical UPS System',
    'Double-conversion medical isolation UPS designed to clean unstable utility grid power and provide instant battery backup for sensitive diagnostic machinery.',
    'Capacity: 3000VA / 2700W\nInput Voltage Range: 110V - 300V AC (Wide grid tolerance)\nOutput Waveform: Pure Sine Wave (<2% THD)\nTransfer Time: 0 ms (Zero interruption)',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    'medical-ups'
);

-- ==========================================
-- 5. SEED BLOG POSTS
-- ==========================================

INSERT INTO blog_posts (id, slug, title, excerpt, content, category_label, author_name, author_role, image, read_time, published_at) VALUES
(
    'post_9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c',
    'optimizing-clinical-supply-infrastructure-west-africa',
    'Optimizing Clinical Supply Infrastructure in West Africa',
    'An analytical guide exploring how modern hospitals in Lagos, Ife, and regional zones restructure procurement pipelines to prevent sudden critical asset downtime.',
    'In the current healthcare environment, facilities across regional ecosystems face mounting clinical pressures. Achieving standard delivery excellence hinges on consistent infrastructure dependability, asset tracking integrity, and protective supply layer reserves.\n\n### 1. Structural Resource Planning\nWhen optimizing institutional operational frameworks, management units must differentiate between immediate operational consumables and longer lifecycle capital equipment acquisitions. Relying strictly on ad-hoc purchases introduces extreme procurement vulnerabilities, especially given modern supply line variations.\n\n### 2. Mitigating Equipment Down-Time\nWhether managing localized point-of-care diagnostics or highly responsive biphasic life support machinery, calibration schedules protect clinical safety margins. Engineering documentation tracking indicates structured preventative intervals drop acute facility emergencies significantly.',
    'Procurement Strategy',
    'Dr. Amina Yusuf',
    'Senior Healthcare Consultant',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    '5 min read',
    'July 12, 2026'
),
(
    'post_f891b2c4-87d3-4e4b-97e3-0d6168fe213c',
    'preventative-maintenance-medical-hardware-nigeria',
    'Preventative Maintenance of Medical Hardware in Tropical Climates',
    'A diagnostic deep-dive into protecting sensitive clinical imaging gear from humidity, dust storms, and localized electrical grid instabilities.',
    'Ensuring constant uptime for medical diagnostic machinery throughout West Africa requires shifting from reactive repairs to structural preventative maintenance. High relative humidity and fine atmospheric dust (particularly during Harmattan cycles) directly threaten delicate circuit boards and optical transducers.\n\n### Key Risk Factors\n1. **Dust Accumulation:** Microfine particulates act as thermal insulators on power supply boards, leading to system overheat and premature hardware shutdown.\n2. **Voltage Fluctuation:** Intermittent grid drops degrade solid-state memory drives inside modern diagnostic computers.\n\n### Core Maintenance Actions\n* **Environmental Sealing:** Always operate imaging systems in closed, climate-controlled environments with active dehumidification modules.\n* **Double-Tier Isolation:** Use online Double-Conversion Uninterruptible Power Supplies (UPS) to clean raw current before it reaches sensitive medical hardware.',
    'Clinical Engineering',
    'Dr. Samuel Okonjo',
    'Chief Medical Logistics Engineer',
    'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
    '5 min read',
    'March 15, 2026'
);

-- Trend flags to products table
ALTER TABLE products 
  ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN is_hot_deal BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN is_premium BOOLEAN NOT NULL DEFAULT FALSE;

  -- Main enquiry record
CREATE TABLE IF NOT EXISTS enquiries (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL, -- Nullable for guest checkout
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  organization VARCHAR(255),
  message TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, in_progress, quoted, fulfilled, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Items inside each enquiry
CREATE TABLE IF NOT EXISTS enquiry_items (
  id VARCHAR(64) PRIMARY KEY,
  enquiry_id VARCHAR(64) NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  reference_no TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  total_items INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create quote_items table
CREATE TABLE IF NOT EXISTS quote_items (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);