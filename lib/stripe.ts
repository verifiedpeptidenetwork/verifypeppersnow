import Stripe from "stripe";

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

let stripeSingleton: Stripe | null = null;

/** Manual-capture Stripe client: pledges authorize a hold, capture only fires once a campaign hits its minimum backers. */
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeSingleton;
}
