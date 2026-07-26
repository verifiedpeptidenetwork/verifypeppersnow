import Link from "next/link";
import { Users, Coins, Search, ShieldCheck, ArrowRight } from "lucide-react";
import { Campaign } from "@/lib/types";
import { pricePerBackerCents, centsToDollars } from "@/lib/pricing";
import { MIN_BACKERS, TESTING_LAB } from "@/lib/campaign-rules";

export default function FeatureOverview({ campaigns }: { campaigns: Campaign[] }) {
  const topCampaigns = campaigns.slice(0, 3);

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-10 lg:grid-cols-4">
      <div className="vpn-panel p-5">
        <div className="mb-3 flex items-center gap-2 text-neon-pink">
          <Users size={18} />
          <h3 className="font-display text-sm tracking-wide">Group Testing Engine</h3>
        </div>
        <p className="mb-4 text-sm text-foreground/60">
          Create vial requests, search by condition or compound, and join an open group already
          in progress.
        </p>
        <Link
          href="/submit-vial"
          className="inline-flex items-center gap-1 text-xs font-bold tracking-wide text-neon-pink uppercase"
        >
          Create Vial Request <ArrowRight size={14} />
        </Link>
      </div>

      <div className="vpn-panel p-5 lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-neon-pink">
            <Coins size={18} />
            <h3 className="font-display text-sm tracking-wide">Funding Campaigns</h3>
          </div>
          <Link href="/campaigns" className="text-xs text-neon-cyan hover:underline">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {topCampaigns.map((c) => {
            const backers = c.pledges.length;
            const perPerson = pricePerBackerCents(c.funding_target_cents, backers);
            return (
              <div key={c.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-xs text-foreground/50">Vendor: {c.vial.vendor_name}</p>
                <p className="text-sm font-bold text-neon-cyan">
                  {c.vial.compound_name} &middot; {c.vial.dosage}
                </p>
                <p className="mt-1 text-xs text-foreground/60">
                  Target {centsToDollars(c.funding_target_cents)} &middot; {backers} pledged
                </p>
                <p className="text-lg font-display text-neon-pink">
                  {centsToDollars(perPerson)}
                  <span className="text-xs text-foreground/50">/person</span>
                </p>
                <Link
                  href="/campaigns"
                  className="btn-neon-pink mt-2 block rounded-full py-1.5 text-center text-xs"
                >
                  Pledge to Fund
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="vpn-panel p-5">
        <div className="mb-3 flex items-center gap-2 text-neon-cyan">
          <ShieldCheck size={18} />
          <h3 className="font-display text-sm tracking-wide">Pre-Pay Protection</h3>
        </div>
        <p className="mb-4 text-sm text-foreground/60">
          Cards are pre-authorized, not charged. You&apos;re only billed the final per-person
          price once a group closes — full at 20 backers, or its 48h window ending with{" "}
          {MIN_BACKERS}+ pledged — and {TESTING_LAB} starts testing.
        </p>
        <Link
          href="/registry"
          className="inline-flex items-center gap-1 text-xs font-bold tracking-wide text-neon-cyan uppercase"
        >
          <Search size={14} /> Search Public Registry
        </Link>
      </div>
    </section>
  );
}
