import { NextRequest, NextResponse } from "next/server";
import { getCampaignById } from "@/lib/data";
import { pricePerBackerCents, centsToDollars } from "@/lib/pricing";
import { isStripeConfigured, getStripe } from "@/lib/stripe";
import { getCampaignPhase, TESTING_LAB } from "@/lib/campaign-rules";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { campaign_id?: string; backer_email?: string };

  if (!body.campaign_id || !body.backer_email) {
    return NextResponse.json({ error: "Missing campaign or email." }, { status: 400 });
  }

  const campaign = await getCampaignById(body.campaign_id);
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
  }

  const backers = campaign.pledges.length;

  const { phase } = getCampaignPhase(
    campaign.created_at,
    backers,
    campaign.minimum_backers,
    campaign.max_backers,
    campaign.funding_window_hours
  );
  if (phase !== "open") {
    return NextResponse.json(
      { error: "This group is no longer accepting pledges — it's already moving to testing." },
      { status: 409 }
    );
  }

  const priceNow = pricePerBackerCents(campaign.funding_target_cents, backers + 1);

  if (!isStripeConfigured) {
    return NextResponse.json({
      ok: true,
      demo: true,
      message: `Demo mode: your card would be authorized for ${centsToDollars(priceNow)} (Stripe is not configured yet).`,
    });
  }

  const stripe = getStripe();
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: body.backer_email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: priceNow,
          product_data: {
            name: `${campaign.vial.compound_name} (${campaign.vial.dosage}) — ${campaign.vial.vendor_name} COA testing (${TESTING_LAB})`,
            description:
              "Pre-authorization hold. You are only charged the final per-person price once the group hits its minimum backer count within the 48h funding window.",
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      capture_method: "manual",
      metadata: { campaign_id: campaign.id },
    },
    metadata: { campaign_id: campaign.id, backer_email: body.backer_email },
    success_url: `${origin}/campaigns?pledged=1`,
    cancel_url: `${origin}/campaigns`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}
