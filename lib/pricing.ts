/**
 * Dynamic cost-scaling group engine.
 * Splits the flat lab-testing fee evenly across current backers, with a
 * one-more-backer preview so the campaign card can show "join to drop the price".
 */
export function pricePerBackerCents(targetCents: number, backers: number): number {
  const effectiveBackers = Math.max(backers, 1);
  return Math.ceil(targetCents / effectiveBackers);
}

export function centsToDollars(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  });
}

export function fundingProgress(targetCents: number, raisedCents: number): number {
  if (targetCents <= 0) return 0;
  return Math.min(100, Math.round((raisedCents / targetCents) * 100));
}
