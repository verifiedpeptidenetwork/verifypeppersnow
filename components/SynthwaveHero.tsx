import Link from "next/link";
import { ShieldCheck, FlaskConical } from "lucide-react";
import { TESTING_LAB } from "@/lib/campaign-rules";

export default function SynthwaveHero() {
  return (
    <section className="relative overflow-hidden border-b border-neon-pink/20">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a0a2e 0%, #2e0a3d 35%, #4a0e3d 60%, #0a0812 100%)",
        }}
      />
      {/* synthwave sun */}
      <div
        className="absolute left-1/2 top-10 h-56 w-56 -translate-x-1/2 rounded-full sm:h-72 sm:w-72"
        style={{
          background: "linear-gradient(180deg, #ffdf7e 0%, #ff2a8d 55%, #7a1256 100%)",
          boxShadow: "0 0 90px rgba(255, 42, 141, 0.55)",
        }}
      />
      {/* horizon grid */}
      <div
        className="absolute bottom-0 left-0 h-40 w-full opacity-60 [mask-image:linear-gradient(180deg,transparent,black)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-cyan/40 bg-obsidian/60 px-4 py-1 text-xs tracking-widest text-neon-cyan uppercase">
          <ShieldCheck size={14} /> Pre-Pay Protected &middot; Tested by {TESTING_LAB}
        </div>
        <h1 className="font-display text-3xl leading-tight sm:text-5xl">
          <span className="neon-text-pink">Multi-Vendor Compound Verification</span>
        </h1>
        <h2 className="mt-2 font-display text-xl leading-tight text-foreground/90 sm:text-3xl">
          <span className="neon-text-cyan">Community-Powered Crowd-Funding</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm text-foreground/70 sm:text-base">
          Submit your vial, split the lab fee with people who bought the same thing, and get a
          real Certificate of Analysis — published for everyone to see.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/submit-vial" className="btn-neon-pink rounded-full px-6 py-3 text-sm">
            <span className="inline-flex items-center gap-2">
              <FlaskConical size={16} /> Submit Your Vial
            </span>
          </Link>
          <Link href="/campaigns" className="btn-outline-cyan rounded-full px-6 py-3 text-sm">
            View Active Campaigns
          </Link>
        </div>
      </div>
    </section>
  );
}
