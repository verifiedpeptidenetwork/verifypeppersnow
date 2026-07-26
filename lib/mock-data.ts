import { Campaign, TestResult } from "./types";
import { MIN_BACKERS, MAX_BACKERS, FUNDING_WINDOW_HOURS } from "./campaign-rules";

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

/**
 * Demo fixtures used when Supabase env vars are not configured, so the app
 * is fully browsable out of the box. Real data replaces this the moment
 * NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
 *
 * Timestamps are relative to "now" (not hardcoded dates) so the 48h funding
 * window demo always shows a mix of open / almost-closed / full campaigns.
 */
export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    vial_id: "v1",
    vial: {
      id: "v1",
      vendor_name: "ElitePeps",
      compound_name: "BPC-157",
      dosage: "10mg",
      cap_color: "Blue",
      collar_color: "White",
      submitted_by: null,
      created_at: hoursAgo(20),
    },
    funding_target_cents: 30000,
    minimum_backers: MIN_BACKERS,
    max_backers: MAX_BACKERS,
    funding_window_hours: FUNDING_WINDOW_HOURS,
    status: "funding",
    created_at: hoursAgo(20),
    pledges: Array.from({ length: 5 }).map((_, i) => ({
      id: `p1-${i}`,
      campaign_id: "c1",
      backer_email: `backer${i}@example.com`,
      amount_cents: 6000,
      stripe_payment_intent_id: null,
      status: "authorized" as const,
      created_at: hoursAgo(19),
    })),
  },
  {
    id: "c2",
    vial_id: "v2",
    vial: {
      id: "v2",
      vendor_name: "ElitePeps",
      compound_name: "BPC-157",
      dosage: "10mg",
      cap_color: "Red",
      collar_color: "Black",
      submitted_by: null,
      created_at: hoursAgo(44),
    },
    funding_target_cents: 30000,
    minimum_backers: MIN_BACKERS,
    max_backers: MAX_BACKERS,
    funding_window_hours: FUNDING_WINDOW_HOURS,
    status: "funding",
    created_at: hoursAgo(44),
    pledges: Array.from({ length: 10 }).map((_, i) => ({
      id: `p2-${i}`,
      campaign_id: "c2",
      backer_email: `backer${i}@example.com`,
      amount_cents: 3000,
      stripe_payment_intent_id: null,
      status: "authorized" as const,
      created_at: hoursAgo(40),
    })),
  },
  {
    id: "c3",
    vial_id: "v3",
    vial: {
      id: "v3",
      vendor_name: "ElitePeps",
      compound_name: "BPC-157",
      dosage: "10mg",
      cap_color: "Yellow",
      collar_color: "Grey",
      submitted_by: null,
      created_at: hoursAgo(30),
    },
    funding_target_cents: 30000,
    minimum_backers: MIN_BACKERS,
    max_backers: MAX_BACKERS,
    funding_window_hours: FUNDING_WINDOW_HOURS,
    status: "funded",
    created_at: hoursAgo(30),
    pledges: Array.from({ length: 20 }).map((_, i) => ({
      id: `p3-${i}`,
      campaign_id: "c3",
      backer_email: `backer${i}@example.com`,
      amount_cents: 1500,
      stripe_payment_intent_id: null,
      status: "authorized" as const,
      created_at: hoursAgo(28),
    })),
  },
];

export const MOCK_TEST_RESULTS: TestResult[] = [
  {
    id: "t1",
    campaign_id: "c0",
    vendor_name: "ElitePeps",
    compound_name: "BPC-157",
    cap_color: "Blue",
    collar_color: "White",
    purity_percent: 99.2,
    identity_match: true,
    contaminants_detected: false,
    lab_name: "Janoshik Analytical",
    coa_pdf_url: "",
    published_at: "2026-06-01T00:00:00Z",
  },
  {
    id: "t2",
    campaign_id: "c0b",
    vendor_name: "ElitePeps",
    compound_name: "BPC-157",
    cap_color: "Red",
    collar_color: "Black",
    purity_percent: 98.7,
    identity_match: true,
    contaminants_detected: false,
    lab_name: "Janoshik Analytical",
    coa_pdf_url: "",
    published_at: "2026-06-08T00:00:00Z",
  },
  {
    id: "t3",
    campaign_id: "c0c",
    vendor_name: "Noor Labs",
    compound_name: "GHK-Cu",
    cap_color: "Green",
    collar_color: "Silver" as TestResult["cap_color"],
    purity_percent: 97.9,
    identity_match: true,
    contaminants_detected: false,
    lab_name: "Janoshik Analytical",
    coa_pdf_url: "",
    published_at: "2026-05-22T00:00:00Z",
  },
  {
    id: "t4",
    campaign_id: "c0d",
    vendor_name: "Stab Labs",
    compound_name: "Retatrutide",
    cap_color: "Purple",
    collar_color: "Purple",
    purity_percent: 96.4,
    identity_match: false,
    contaminants_detected: true,
    lab_name: "Janoshik Analytical",
    coa_pdf_url: "",
    published_at: "2026-05-30T00:00:00Z",
  },
];
