import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { captureCampaign } from "@/lib/settle-campaign";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const stripe = getStripe();
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const campaignId = session.metadata?.campaign_id;
  const backerEmail = session.metadata?.backer_email ?? session.customer_email;

  if (!campaignId || !isSupabaseConfigured) {
    return NextResponse.json({ received: true });
  }

  const supabase = createServiceClient();

  await supabase.from("pledges").insert({
    campaign_id: campaignId,
    backer_email: backerEmail,
    amount_cents: session.amount_total,
    stripe_payment_intent_id: session.payment_intent as string,
    status: "authorized",
  });

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*, pledges(*)")
    .eq("id", campaignId)
    .single();

  // Groups can keep growing (and the price keep dropping) right up to
  // max_backers or the 48h window — so this only settles the "group filled
  // up completely" case. The time-based case (window expired with enough
  // backers, or not) is handled by the scheduled sweep at
  // app/api/campaigns/close-expired, since Stripe webhooks are event-driven
  // and can't fire on a clock by themselves.
  if (campaign && campaign.status === "funding" && campaign.pledges.length >= campaign.max_backers) {
    await captureCampaign(supabase, stripe, campaign);
  }

  return NextResponse.json({ received: true });
}
