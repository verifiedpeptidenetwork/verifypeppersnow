import { getActiveCampaigns } from "@/lib/data";
import CampaignCard from "@/components/CampaignCard";
import { MIN_BACKERS, MAX_BACKERS, FUNDING_WINDOW_HOURS, TESTING_LAB } from "@/lib/campaign-rules";

export const metadata = {
  title: "Funding Campaigns | VPN",
};

export default async function CampaignsPage() {
  const campaigns = await getActiveCampaigns();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl sm:text-3xl">
          <span className="neon-text-pink">Funding</span> <span className="neon-text-cyan">Campaigns</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/60">
          Join an open group testing the same vendor and compound as your vial. Each group needs{" "}
          {MIN_BACKERS} backers minimum, caps at {MAX_BACKERS}, and has a {FUNDING_WINDOW_HOURS}
          -hour funding window before it closes and heads to {TESTING_LAB}.
        </p>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-center text-foreground/50">
          No active campaigns yet.{" "}
          <a href="/submit-vial" className="text-neon-cyan underline">
            Submit the first vial
          </a>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </section>
  );
}
