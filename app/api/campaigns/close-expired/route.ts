import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { captureCampaign, releaseCampaign } from "@/lib/settle-campaign";
import { getCampaignPhase } from "@/lib/campaign-rules";

/**
 * Scheduled sweep (wire this to Vercel Cron / Supabase pg_cron / GitHub
 * Actions, hitting it every few minutes) that closes out any campaign whose
 * 48h funding window has expired:
 *  - >= minimum_backers  -> capture every hold at the final price, move to testing
 *  - <  minimum_backers  -> release every hold, cancel the campaign
 *
 * Protect this route with CRON_SECRET (Vercel Cron automatically sends
 * `Authorization: Bearer $CRON_SECRET` and always calls via GET, so both
 * methods are supported here).
 */
export async function GET(request: NextRequest) {
  return handleSweep(request);
}

export async function POST(request: NextRequest) {
  return handleSweep(request);
}

async function handleSweep(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, skipped: "Supabase not configured." });
  }

  const supabase = createServiceClient();
  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("*, pledges(*)")
    .eq("status", "funding");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const stripe = isStripeConfigured ? getStripe() : null;
  const settled: { id: string; outcome: "funded" | "cancelled" }[] = [];

  for (const campaign of campaigns ?? []) {
    const { phase } = getCampaignPhase(
      campaign.created_at,
      campaign.pledges.length,
      campaign.minimum_backers,
      campaign.max_backers,
      campaign.funding_window_hours
    );

    if (phase === "advancing" && stripe) {
      await captureCampaign(supabase, stripe, campaign);
      settled.push({ id: campaign.id, outcome: "funded" });
    } else if (phase === "failed" && stripe) {
      await releaseCampaign(supabase, stripe, campaign);
      settled.push({ id: campaign.id, outcome: "cancelled" });
    }
  }

  return NextResponse.json({ ok: true, settled });
}
