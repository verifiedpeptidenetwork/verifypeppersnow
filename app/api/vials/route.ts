import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, createServiceClient } from "@/lib/supabase/server";

interface SubmitVialBody {
  vendor_name: string;
  compound_name: string;
  dosage: string;
  cap_color: string;
  collar_color: string;
  funding_target_dollars: number;
  submitted_by: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<SubmitVialBody>;

  if (
    !body.vendor_name?.trim() ||
    !body.compound_name?.trim() ||
    !body.dosage?.trim() ||
    !body.cap_color ||
    !body.collar_color ||
    !body.submitted_by?.trim() ||
    !body.funding_target_dollars ||
    body.funding_target_dollars < 50
  ) {
    return NextResponse.json({ error: "Please fill out every field." }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    // Demo mode: accept the submission without persisting it.
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createServiceClient();

  const { data: vial, error: vialError } = await supabase
    .from("vials")
    .insert({
      vendor_name: body.vendor_name.trim(),
      compound_name: body.compound_name.trim(),
      dosage: body.dosage.trim(),
      cap_color: body.cap_color,
      collar_color: body.collar_color,
      submitted_by: body.submitted_by.trim(),
    })
    .select()
    .single();

  if (vialError || !vial) {
    return NextResponse.json({ error: vialError?.message ?? "Failed to save vial." }, { status: 500 });
  }

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .insert({
      vial_id: vial.id,
      funding_target_cents: Math.round(body.funding_target_dollars * 100),
      // minimum_backers (4), max_backers (20), funding_window_hours (48) all
      // come from the column defaults in supabase/schema.sql.
      status: "funding",
    })
    .select()
    .single();

  if (campaignError || !campaign) {
    return NextResponse.json(
      { error: campaignError?.message ?? "Failed to create campaign." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, campaign });
}
