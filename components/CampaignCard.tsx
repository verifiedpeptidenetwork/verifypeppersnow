"use client";

import { useEffect, useState } from "react";
import { Campaign } from "@/lib/types";
import { pricePerBackerCents, centsToDollars, fundingProgress } from "@/lib/pricing";
import { getCampaignPhase, formatTimeRemaining, TESTING_LAB } from "@/lib/campaign-rules";
import { Loader2, Users, Clock, FlaskConical } from "lucide-react";

const PREVIEW_MILESTONES = [4, 10, 20];

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [previewBackers, setPreviewBackers] = useState(
    Math.max(campaign.pledges.length, campaign.minimum_backers)
  );
  const [pledging, setPledging] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Keep the countdown live without a full page refresh.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const currentBackers = campaign.pledges.length;
  const currentPrice = pricePerBackerCents(campaign.funding_target_cents, currentBackers);
  const previewPrice = pricePerBackerCents(campaign.funding_target_cents, previewBackers);
  const progress = fundingProgress(campaign.minimum_backers, currentBackers);
  const { phase, msRemaining } = getCampaignPhase(
    campaign.created_at,
    currentBackers,
    campaign.minimum_backers,
    campaign.max_backers,
    campaign.funding_window_hours
  );
  void now; // triggers the re-render tick above so msRemaining stays fresh

  const pledgeDisabled = phase !== "open";

  async function handlePledge(e: React.FormEvent) {
    e.preventDefault();
    setPledging(true);
    setMessage(null);
    try {
      const res = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaign.id, backer_email: email }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not start your pledge.");
      if (body.url) {
        window.location.href = body.url;
      } else {
        setMessage(body.message ?? "Pledge authorized!");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPledging(false);
    }
  }

  return (
    <div className="vpn-panel flex flex-col gap-4 p-5">
      <div>
        <p className="text-xs tracking-wide text-foreground/50 uppercase">
          Vendor: {campaign.vial.vendor_name}
        </p>
        <h3 className="font-display text-lg text-neon-cyan">
          {campaign.vial.compound_name} &middot; {campaign.vial.dosage}
        </h3>
        <p className="mt-1 text-xs text-foreground/50">
          Cap: {campaign.vial.cap_color} &middot; Collar: {campaign.vial.collar_color}
        </p>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-foreground/60">
          <span className="inline-flex items-center gap-1">
            <Users size={12} /> {currentBackers}/{campaign.max_backers} backers
          </span>
          <span>Min {campaign.minimum_backers} to fund</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-black/30">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs ${
          phase === "open"
            ? "border-neon-cyan/25 text-neon-cyan/90"
            : phase === "failed"
              ? "border-neon-pink/40 text-neon-pink"
              : "border-neon-pink/25 text-foreground/70"
        }`}
      >
        {phase === "open" && (
          <>
            <Clock size={14} /> {formatTimeRemaining(msRemaining)} left in the 48h funding window
          </>
        )}
        {phase === "full" && (
          <>
            <FlaskConical size={14} /> Group full ({campaign.max_backers}) — heading to{" "}
            {TESTING_LAB}
          </>
        )}
        {phase === "advancing" && (
          <>
            <FlaskConical size={14} /> Window closed with enough backers — heading to{" "}
            {TESTING_LAB}
          </>
        )}
        {phase === "failed" && (
          <>
            <Clock size={14} /> Window closed under {campaign.minimum_backers} backers — pledges
            released
          </>
        )}
      </div>

      <div className="rounded-lg border border-white/10 bg-black/20 p-3">
        <p className="font-display text-2xl neon-text-pink">
          {centsToDollars(currentPrice)}
          <span className="text-xs text-foreground/50">/person right now</span>
        </p>

        <div className="mt-3">
          <p className="mb-1 text-xs text-foreground/50">Preview: price if group grows to</p>
          <div className="flex flex-wrap gap-2">
            {PREVIEW_MILESTONES.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPreviewBackers(n)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  previewBackers === n
                    ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                    : "border-white/15 text-foreground/50"
                }`}
              >
                {n} backers
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            {previewBackers} backers ={" "}
            <span className="font-bold text-neon-cyan">{centsToDollars(previewPrice)}</span>/person
          </p>
        </div>
      </div>

      <form onSubmit={handlePledge} className="flex flex-col gap-2 sm:flex-row">
        <input
          required
          disabled={pledgeDisabled}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-full border border-neon-cyan/25 bg-obsidian-light/80 px-4 py-2 text-sm placeholder:text-foreground/30 focus:border-neon-cyan focus:outline-none disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={pledging || pledgeDisabled}
          className="btn-neon-pink flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm whitespace-nowrap disabled:opacity-40"
        >
          {pledging && <Loader2 className="animate-spin" size={14} />}
          {pledgeDisabled ? "Group Closed" : "Pledge to Fund"}
        </button>
      </form>
      {message && <p className="text-xs text-neon-cyan">{message}</p>}
      <p className="text-[0.65rem] text-foreground/35">
        Your card is authorized, not charged. You&apos;ll only be billed the final per-person
        price once the group is tested by {TESTING_LAB}.
      </p>
    </div>
  );
}
