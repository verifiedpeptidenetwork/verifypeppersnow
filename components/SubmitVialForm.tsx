"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { MIN_BACKERS, MAX_BACKERS, FUNDING_WINDOW_HOURS, TESTING_LAB } from "@/lib/campaign-rules";

const COLORS = [
  "Blue",
  "Red",
  "Yellow",
  "Green",
  "Purple",
  "Orange",
  "Black",
  "White",
  "Grey",
  "Silver",
  "Clear",
];

const inputClass =
  "w-full rounded-md border border-neon-cyan/25 bg-obsidian-light/80 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-neon-cyan focus:outline-none";
const labelClass = "mb-1 block text-xs font-bold tracking-wide text-neon-cyan/90 uppercase";

export default function SubmitVialForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    vendor_name: "",
    compound_name: "",
    dosage: "",
    cap_color: COLORS[0],
    collar_color: COLORS[0],
    funding_target_dollars: 300,
    submitted_by: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/vials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not submit your vial. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/campaigns"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="vpn-panel flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 size={40} className="text-neon-cyan" />
        <h3 className="font-display text-lg neon-text-cyan">Vial Submitted!</h3>
        <p className="text-sm text-foreground/60">
          Your group project is live. Taking you to Campaigns...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="vpn-panel space-y-5 p-6 sm:p-8">
      <div>
        <label className={labelClass}>Vendor Name</label>
        <input
          required
          className={inputClass}
          placeholder="e.g. ElitePeps"
          value={form.vendor_name}
          onChange={(e) => update("vendor_name", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Compound Name</label>
          <input
            required
            className={inputClass}
            placeholder="e.g. BPC-157"
            value={form.compound_name}
            onChange={(e) => update("compound_name", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Dosage</label>
          <input
            required
            className={inputClass}
            placeholder="e.g. 10mg"
            value={form.dosage}
            onChange={(e) => update("dosage", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Cap Color</label>
          <select
            className={inputClass}
            value={form.cap_color}
            onChange={(e) => update("cap_color", e.target.value)}
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Collar Color</label>
          <select
            className={inputClass}
            value={form.collar_color}
            onChange={(e) => update("collar_color", e.target.value)}
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Funding Target (lab testing fee)</label>
        <div className="relative">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-foreground/40">$</span>
          <input
            required
            type="number"
            min={50}
            step={10}
            className={`${inputClass} pl-6`}
            value={form.funding_target_dollars}
            onChange={(e) => update("funding_target_dollars", Number(e.target.value))}
          />
        </div>
        <p className="mt-1 text-xs text-foreground/40">
          Default is $300 — the typical {TESTING_LAB} COA fee. Needs {MIN_BACKERS} backers within{" "}
          {FUNDING_WINDOW_HOURS}h to lock in testing (caps at {MAX_BACKERS}).
        </p>
      </div>

      <div>
        <label className={labelClass}>Your Email (private — used only for updates)</label>
        <input
          required
          type="email"
          className={inputClass}
          placeholder="you@example.com"
          value={form.submitted_by}
          onChange={(e) => update("submitted_by", e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-neon-pink">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-neon-pink flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm disabled:opacity-60"
      >
        {submitting && <Loader2 className="animate-spin" size={16} />}
        {submitting ? "Submitting..." : "Launch Community Group"}
      </button>
    </form>
  );
}
