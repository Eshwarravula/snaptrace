-- PaperFix Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Experts table
CREATE TABLE IF NOT EXISTS experts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  firm TEXT,
  initials TEXT NOT NULL,
  experience TEXT NOT NULL,
  areas TEXT NOT NULL,
  fee_range TEXT NOT NULL,
  fee_label TEXT NOT NULL DEFAULT 'Based on complexity',
  categories TEXT[] NOT NULL DEFAULT '{}',
  specialties TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT true,
  proof_type TEXT,
  work_style TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'soon', 'urgent')),
  expert_id TEXT REFERENCES experts(id),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in-progress', 'completed')),
  user_paid NUMERIC NOT NULL DEFAULT 0,
  expert_paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id TEXT NOT NULL REFERENCES cases(id),
  user_amount NUMERIC NOT NULL DEFAULT 0,
  expert_amount NUMERIC NOT NULL DEFAULT 0,
  platform_cut NUMERIC NOT NULL DEFAULT 0,
  user_payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (user_payment_status IN ('pending', 'received', 'failed')),
  expert_payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (expert_payout_status IN ('pending', 'paid')),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cases_expert ON cases(expert_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_payments_case ON payments(case_id);

-- Seed: 10 verified experts
INSERT INTO experts (id, name, phone, firm, initials, experience, areas, fee_range, fee_label, categories, specialties, verified, proof_type, work_style) VALUES
  ('fayaz', 'Shaik Fayaz', '7997492910', NULL, 'SF', '3-5 years', 'Miryalaguda, Kodad, Hyderabad', '600 - 1,800', 'Based on complexity', ARRAY['legal_heir','birth_death','name_mismatch','pension','property','property_transfer','other'], ARRAY['Legal Heir','Succession','Name Correction','Late Registration'], true, NULL, 'Independent + Coordination'),
  ('shashank', 'Shashank Gingipalli', '7799801999', NULL, 'SG', '3-5 years', 'Kodad, Khammam', '600 - 1,800', 'Based on complexity', ARRAY['legal_heir','pension','property','property_transfer','other'], ARRAY['Pension','Land Records','Affidavits','EC Documents'], true, 'Visiting card', 'Consultancy'),
  ('fahad', 'Fahad', '9346795404', 'SA Online Services', 'FA', '3-5 years', 'Attapur, Bahadurpura, Hyderabad', '6,000 - 12,000', 'Consultation + service', ARRAY['meeseva','name_mismatch','birth_death','other'], ARRAY['MeeSeva','Ration Card','Birth Cert','Caste Cert','Income Cert'], true, 'Google Maps listing', 'Office setup'),
  ('harsh', 'Harsh Bhomia', '7036362066', 'APK Business Solutions', 'HB', '10+ years', 'Telangana, AP, Karnataka', '6,000 - 12,000', 'Milestone-based', ARRAY['gst','pension','legal_heir','other'], ARRAY['GST','Taxation','Business Finance','Licensing'], true, 'Google Maps + Visiting card', 'Independent'),
  ('dilip', 'Karika Dilip Kumar', '8977502034', 'Ekaiva Law Firm', 'DK', '5-10 years', 'All Telangana', '6,000 - 12,000', 'Based on complexity', ARRAY['legal_heir','property','property_transfer','pension','birth_death','other'], ARRAY['Civil Cases','Criminal','Matrimonial','Partition'], true, 'Visiting card', 'Independent'),
  ('bhanu', 'Bhanu Prakash', '8886458226', 'PRA Sum Online Services', 'BP', '3-5 years', 'Narapally, Hyderabad', '600 - 1,800', 'Based on complexity', ARRAY['birth_death','meeseva','name_mismatch','other'], ARRAY['Late Birth Reg','PAN','RTA Works','Online Services'], true, 'Google Maps listing', 'Office setup'),
  ('ravuri', 'Ravuri Veereshalingam', '9959430191', NULL, 'RV', '10+ years', 'Khammam', '600 - 1,800', 'Based on complexity', ARRAY['property','property_transfer','legal_heir','birth_death','other'], ARRAY['Property Tax','Mutation','Property Records'], true, NULL, 'Independent'),
  ('abhiram', 'V Abhiram Reddy', '9398962440', 'Venkateswara Agents', 'AR', '3-5 years', 'All Telangana', '600 - 1,800', 'Based on complexity', ARRAY['gst','other'], ARRAY['GST Notices','GST Compliance','Tax Compliance'], true, 'Office photo', 'CA / Tax office'),
  ('prabhu', 'Prabhu Charan', '8897373609', 'Vikasinchu Legal', 'PC', '3-5 years', 'Hyderabad', '12,000+', 'Fixed + complexity', ARRAY['legal_heir','property','property_transfer','pension','birth_death','other'], ARRAY['Legal Drafting','Civil','Labour Law','Family'], true, 'Google Maps + Office photo', 'Legal office'),
  ('raviteja', 'Raviteja Desharajula', '9542959452', NULL, 'RD', '5-10 years', 'Hyderabad, Secunderabad', '600 - 1,800', 'Based on complexity', ARRAY['birth_death','name_mismatch','legal_heir','other'], ARRAY['Late Birth/Death','Name Correction','Document Automation'], true, NULL, 'Independent')
ON CONFLICT (id) DO NOTHING;

-- Seed: demo cases
INSERT INTO cases (id, client_name, client_phone, city, category, category_label, description, urgency, expert_id, status, user_paid, expert_paid, created_at) VALUES
  ('PF-001', 'Ramesh Kumar', '9876543210', 'Kukatpally', 'legal_heir', 'Legal Heir & Succession', 'My father passed away 6 months ago. Property is in his name. Need to transfer to my mother and siblings. Have death certificate but no succession certificate yet.', 'soon', NULL, 'new', 0, false, '2026-04-07'),
  ('PF-002', 'Priya Reddy', '8765432109', 'Attapur', 'name_mismatch', 'Name / DOB Mismatch', 'My name in Aadhaar is Priya Reddy but in PAN it is P. Reddy and passport has Priya R. Need all corrected to match.', 'urgent', NULL, 'new', 0, false, '2026-04-07'),
  ('PF-003', 'Ahmed Khan', '7654321098', 'Secunderabad', 'pension', 'Pension Issues', 'Family pension not transferred after father death. Applied 3 months ago but no update from pension office.', 'normal', NULL, 'new', 0, false, '2026-04-06'),
  ('PF-004', 'Lakshmi Devi', '6543210987', 'Khammam', 'property', 'Property Records', 'Land record shows wrong survey number in Dharani. Tried to correct online but keeps getting rejected.', 'soon', 'ravuri', 'in-progress', 1800, false, '2026-04-04'),
  ('PF-005', 'Suresh Rao', '5432109876', 'Hyderabad', 'gst', 'GST & Tax', 'Got GST notice for FY 2023-24. Input tax credit mismatch. Need someone to handle the response.', 'urgent', 'harsh', 'assigned', 12000, false, '2026-04-05'),
  ('PF-006', 'Meena Kumari', '4321098765', 'Narapally', 'birth_death', 'Late Birth Registration', 'My son born in 2018 but birth was never registered. Need late registration with GHMC. Have hospital records.', 'normal', 'bhanu', 'completed', 1800, true, '2026-04-01')
ON CONFLICT (id) DO NOTHING;

-- Seed: payments for cases with payments
INSERT INTO payments (case_id, user_amount, expert_amount, platform_cut, user_payment_status, expert_payout_status) VALUES
  ('PF-004', 1800, 1500, 300, 'received', 'pending'),
  ('PF-005', 12000, 10000, 2000, 'received', 'pending'),
  ('PF-006', 1800, 1500, 300, 'received', 'paid')
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies: allow read for all, write for authenticated/service role
CREATE POLICY "Allow public read experts" ON experts FOR SELECT USING (true);
CREATE POLICY "Allow public read cases" ON cases FOR SELECT USING (true);
CREATE POLICY "Allow public insert cases" ON cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update cases" ON cases FOR UPDATE USING (true);
CREATE POLICY "Allow public read payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update payments" ON payments FOR UPDATE USING (true);
