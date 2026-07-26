export type CapColor =
  | "Blue"
  | "Red"
  | "Yellow"
  | "Green"
  | "Purple"
  | "Orange"
  | "Black"
  | "White"
  | "Grey";

export type CollarColor = CapColor;

export interface Vial {
  id: string;
  vendor_name: string;
  compound_name: string;
  dosage: string;
  cap_color: CapColor;
  collar_color: CollarColor;
  submitted_by: string | null;
  created_at: string;
}

export type CampaignStatus = "funding" | "funded" | "testing" | "completed" | "cancelled";

export interface Campaign {
  id: string;
  vial_id: string;
  vial: Vial;
  funding_target_cents: number;
  minimum_backers: number;
  max_backers: number;
  funding_window_hours: number;
  status: CampaignStatus;
  created_at: string;
  pledges: Pledge[];
}

export interface Pledge {
  id: string;
  campaign_id: string;
  backer_email: string;
  amount_cents: number;
  stripe_payment_intent_id: string | null;
  status: "authorized" | "captured" | "cancelled" | "failed";
  created_at: string;
}

export interface TestResult {
  id: string;
  campaign_id: string;
  vendor_name: string;
  compound_name: string;
  cap_color: CapColor;
  collar_color: CollarColor;
  purity_percent: number;
  identity_match: boolean;
  contaminants_detected: boolean;
  lab_name: string;
  coa_pdf_url: string;
  published_at: string;
}
