import { isSupabaseConfigured, createClient } from "@/lib/supabase/server";
import { MOCK_CAMPAIGNS, MOCK_TEST_RESULTS } from "@/lib/mock-data";
import { Campaign, TestResult } from "@/lib/types";

// submitted_by is intentionally excluded here — it's private contact info,
// never returned by the public campaign/registry feeds.
const VIAL_PUBLIC_COLUMNS =
  "id, vendor_name, compound_name, dosage, cap_color, collar_color, created_at";

export async function getActiveCampaigns(): Promise<Campaign[]> {
  if (!isSupabaseConfigured) {
    return MOCK_CAMPAIGNS;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select(`*, vial:vials(${VIAL_PUBLIC_COLUMNS}), pledges(*)`)
    .in("status", ["funding", "funded"])
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("getActiveCampaigns failed, falling back to demo data:", error?.message);
    return MOCK_CAMPAIGNS;
  }

  return data as unknown as Campaign[];
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  if (!isSupabaseConfigured) {
    return MOCK_CAMPAIGNS.find((c) => c.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select(`*, vial:vials(${VIAL_PUBLIC_COLUMNS}), pledges(*)`)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as unknown as Campaign;
}

export async function getTestResults(): Promise<TestResult[]> {
  if (!isSupabaseConfigured) {
    return MOCK_TEST_RESULTS;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("test_results")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !data) {
    console.error("getTestResults failed, falling back to demo data:", error?.message);
    return MOCK_TEST_RESULTS;
  }

  return data as unknown as TestResult[];
}
