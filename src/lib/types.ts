export interface Expert {
  id: string;
  name: string;
  phone: string;
  firm: string | null;
  initials: string;
  experience: string;
  areas: string;
  fee_range: string;
  fee_label: string;
  categories: string[];
  specialties: string[];
  verified: boolean;
  proof_type: string | null;
  work_style: string;
}

export interface Case {
  id: string;
  client_name: string;
  client_phone: string;
  city: string;
  category: string;
  category_label: string;
  description: string;
  urgency: "normal" | "soon" | "urgent";
  expert_id: string | null;
  status: "new" | "assigned" | "in-progress" | "completed";
  user_paid: number;
  expert_paid: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  case_id: string;
  user_amount: number;
  expert_amount: number;
  platform_cut: number;
  user_payment_status: "pending" | "received" | "failed";
  expert_payout_status: "pending" | "paid";
}
