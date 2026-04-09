import { Expert } from "./types";

export const WHATSAPP_NUMBER = "7989175554";
export const MARKUP_PERCENT = 0.20;

export const CATEGORY_MAP: Record<string, { label: string; icon: string; description: string }> = {
  legal_heir: { label: "Legal Heir & Succession", icon: "📜", description: "Property transfer after death, succession certificates" },
  property: { label: "Property Records", icon: "🏠", description: "Land mismatch, Dharani, mutation, record correction" },
  pension: { label: "Pension Issues", icon: "👴", description: "Pension not coming, family pension, transfer" },
  name_mismatch: { label: "Name / DOB Mismatch", icon: "📝", description: "Name different across Aadhaar, PAN, passport" },
  birth_death: { label: "Late Birth / Death Reg.", icon: "📋", description: "Missed registration, court orders, GHMC" },
  gst: { label: "GST & Tax", icon: "💼", description: "GST notices, compliance, business registration" },
  meeseva: { label: "MeeSeva & Govt Services", icon: "🏛️", description: "Certificates, ration card, Aadhaar corrections" },
  property_transfer: { label: "Property Transfer", icon: "🔄", description: "Ownership transfer, inheritance registration" },
  other: { label: "Other", icon: "🔧", description: "Any other complex documentation issue" },
};

export const EXPERTS_DATA: Expert[] = [
  {
    id: "fayaz", name: "Shaik Fayaz", firm: null, initials: "SF",
    experience: "3-5 years", areas: "Miryalaguda, Kodad, Hyderabad",
    fee_range: "600 - 1,800", fee_label: "Based on complexity", phone: "7997492910",
    categories: ["legal_heir", "birth_death", "name_mismatch", "pension", "property", "property_transfer", "other"],
    specialties: ["Legal Heir", "Succession", "Name Correction", "Late Registration"],
    verified: true, proof_type: null, work_style: "Independent + Coordination"
  },
  {
    id: "shashank", name: "Shashank Gingipalli", firm: null, initials: "SG",
    experience: "3-5 years", areas: "Kodad, Khammam",
    fee_range: "600 - 1,800", fee_label: "Based on complexity", phone: "7799801999",
    categories: ["legal_heir", "pension", "property", "property_transfer", "other"],
    specialties: ["Pension", "Land Records", "Affidavits", "EC Documents"],
    verified: true, proof_type: "Visiting card", work_style: "Consultancy"
  },
  {
    id: "fahad", name: "Fahad", firm: "SA Online Services", initials: "FA",
    experience: "3-5 years", areas: "Attapur, Bahadurpura, Hyderabad",
    fee_range: "6,000 - 12,000", fee_label: "Consultation + service", phone: "9346795404",
    categories: ["meeseva", "name_mismatch", "birth_death", "other"],
    specialties: ["MeeSeva", "Ration Card", "Birth Cert", "Caste Cert", "Income Cert"],
    verified: true, proof_type: "Google Maps listing", work_style: "Office setup"
  },
  {
    id: "harsh", name: "Harsh Bhomia", firm: "APK Business Solutions", initials: "HB",
    experience: "10+ years", areas: "Telangana, AP, Karnataka",
    fee_range: "6,000 - 12,000", fee_label: "Milestone-based", phone: "7036362066",
    categories: ["gst", "pension", "legal_heir", "other"],
    specialties: ["GST", "Taxation", "Business Finance", "Licensing"],
    verified: true, proof_type: "Google Maps + Visiting card", work_style: "Independent"
  },
  {
    id: "dilip", name: "Karika Dilip Kumar", firm: "Ekaiva Law Firm", initials: "DK",
    experience: "5-10 years", areas: "All Telangana",
    fee_range: "6,000 - 12,000", fee_label: "Based on complexity", phone: "8977502034",
    categories: ["legal_heir", "property", "property_transfer", "pension", "birth_death", "other"],
    specialties: ["Civil Cases", "Criminal", "Matrimonial", "Partition"],
    verified: true, proof_type: "Visiting card", work_style: "Independent"
  },
  {
    id: "bhanu", name: "Bhanu Prakash", firm: "PRA Sum Online Services", initials: "BP",
    experience: "3-5 years", areas: "Narapally, Hyderabad",
    fee_range: "600 - 1,800", fee_label: "Based on complexity", phone: "8886458226",
    categories: ["birth_death", "meeseva", "name_mismatch", "other"],
    specialties: ["Late Birth Reg", "PAN", "RTA Works", "Online Services"],
    verified: true, proof_type: "Google Maps listing", work_style: "Office setup"
  },
  {
    id: "ravuri", name: "Ravuri Veereshalingam", firm: null, initials: "RV",
    experience: "10+ years", areas: "Khammam",
    fee_range: "600 - 1,800", fee_label: "Based on complexity", phone: "9959430191",
    categories: ["property", "property_transfer", "legal_heir", "birth_death", "other"],
    specialties: ["Property Tax", "Mutation", "Property Records"],
    verified: true, proof_type: null, work_style: "Independent"
  },
  {
    id: "abhiram", name: "V Abhiram Reddy", firm: "Venkateswara Agents", initials: "AR",
    experience: "3-5 years", areas: "All Telangana",
    fee_range: "600 - 1,800", fee_label: "Based on complexity", phone: "9398962440",
    categories: ["gst", "other"],
    specialties: ["GST Notices", "GST Compliance", "Tax Compliance"],
    verified: true, proof_type: "Office photo", work_style: "CA / Tax office"
  },
  {
    id: "prabhu", name: "Prabhu Charan", firm: "Vikasinchu Legal", initials: "PC",
    experience: "3-5 years", areas: "Hyderabad",
    fee_range: "12,000+", fee_label: "Fixed + complexity", phone: "8897373609",
    categories: ["legal_heir", "property", "property_transfer", "pension", "birth_death", "other"],
    specialties: ["Legal Drafting", "Civil", "Labour Law", "Family"],
    verified: true, proof_type: "Google Maps + Office photo", work_style: "Legal office"
  },
  {
    id: "raviteja", name: "Raviteja Desharajula", firm: null, initials: "RD",
    experience: "5-10 years", areas: "Hyderabad, Secunderabad",
    fee_range: "600 - 1,800", fee_label: "Based on complexity", phone: "9542959452",
    categories: ["birth_death", "name_mismatch", "legal_heir", "other"],
    specialties: ["Late Birth/Death", "Name Correction", "Document Automation"],
    verified: true, proof_type: null, work_style: "Independent"
  },
];

export const DEMO_CASES = [
  { id: "PF-001", client_name: "Ramesh Kumar", client_phone: "9876543210", city: "Kukatpally", category: "legal_heir", category_label: "Legal Heir & Succession", description: "My father passed away 6 months ago. Property is in his name. Need to transfer to my mother and siblings. Have death certificate but no succession certificate yet.", expert_id: null, status: "new" as const, urgency: "soon" as const, user_paid: 0, expert_paid: false, created_at: "2026-04-07" },
  { id: "PF-002", client_name: "Priya Reddy", client_phone: "8765432109", city: "Attapur", category: "name_mismatch", category_label: "Name / DOB Mismatch", description: "My name in Aadhaar is Priya Reddy but in PAN it is P. Reddy and passport has Priya R. Need all corrected to match.", expert_id: null, status: "new" as const, urgency: "urgent" as const, user_paid: 0, expert_paid: false, created_at: "2026-04-07" },
  { id: "PF-003", client_name: "Ahmed Khan", client_phone: "7654321098", city: "Secunderabad", category: "pension", category_label: "Pension Issues", description: "Family pension not transferred after father death. Applied 3 months ago but no update from pension office.", expert_id: null, status: "new" as const, urgency: "normal" as const, user_paid: 0, expert_paid: false, created_at: "2026-04-06" },
  { id: "PF-004", client_name: "Lakshmi Devi", client_phone: "6543210987", city: "Khammam", category: "property", category_label: "Property Records", description: "Land record shows wrong survey number in Dharani. Tried to correct online but keeps getting rejected.", expert_id: "ravuri", status: "in-progress" as const, urgency: "soon" as const, user_paid: 1800, expert_paid: false, created_at: "2026-04-04" },
  { id: "PF-005", client_name: "Suresh Rao", client_phone: "5432109876", city: "Hyderabad", category: "gst", category_label: "GST & Tax", description: "Got GST notice for FY 2023-24. Input tax credit mismatch. Need someone to handle the response.", expert_id: "harsh", status: "assigned" as const, urgency: "urgent" as const, user_paid: 12000, expert_paid: false, created_at: "2026-04-05" },
  { id: "PF-006", client_name: "Meena Kumari", client_phone: "4321098765", city: "Narapally", category: "birth_death", category_label: "Late Birth Registration", description: "My son born in 2018 but birth was never registered. Need late registration with GHMC. Have hospital records.", expert_id: "bhanu", status: "completed" as const, urgency: "normal" as const, user_paid: 1800, expert_paid: true, created_at: "2026-04-01" },
];
