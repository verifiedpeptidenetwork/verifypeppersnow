import Stripe from "stripe";
import { pricePerBackerCents } from "./pricing";

interface PledgeRow {
  id: string;
  stripe_payment_intent_id: string | null;
}

interface CampaignRow {
  id: string;
  funding_target_cents: number;
  pledges: PledgeRow[];
}

/**
 * Captures every pledge's payment hold at the final (lowest) per-person
 * price and marks the campaign funded. Called either the instant a campaign
 * hits max_backers, or by the scheduled sweep once its 48h window expires
 * with at least minimum_backers pledged (see app/api/campaigns/close-expired).
 */
export async function captureCampaign(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  stripe: Stripe,
  campaign: CampaignRow
) {
  const finalPrice = pricePerBackerCents(campaign.funding_target_cents, campaign.pledges.length);

  await Promise.all(
    campaign.pledges.map(async (pledge) => {
      if (!pledge.stripe_payment_intent_id) return;
      try {
        await stripe.paymentIntents.capture(pledge.stripe_payment_intent_id, {
          amount_to_capture: finalPrice,
        });
        await supabase.from("pledges").update({ status: "captured" }).eq("id", pledge.id);
      } catch (err) {
        console.error(`Failed to capture pledge ${pledge.id}:`, err);
      }
    })
  );

  await supabase.from("campaigns").update({ status: "funded" }).eq("id", campaign.id);
}

/**
 * Releases every pledge hold and marks the campaign cancelled. Called by the
 * scheduled sweep once a campaign's 48h window expires under minimum_backers.
 */
export async function releaseCampaign(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  stripe: Stripe,
  campaign: CampaignRow
) {
  await Promise.all(
    campaign.pledges.map(async (pledge) => {
      if (!pledge.stripe_payment_intent_id) return;
      try {
        await stripe.paymentIntents.cancel(pledge.stripe_payment_intent_id);
        await supabase.from("pledges").update({ status: "cancelled" }).eq("id", pledge.id);
      } catch (err) {
        console.error(`Failed to release pledge ${pledge.id}:`, err);
      }
    })
  );

  await supabase.from("campaigns").update({ status: "cancelled" }).eq("id", campaign.id);
}
