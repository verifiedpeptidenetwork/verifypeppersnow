import { FlaskConical, Users, TrendingDown, FileCheck2 } from "lucide-react";
import { MIN_BACKERS, MAX_BACKERS, FUNDING_WINDOW_HOURS, TESTING_LAB } from "@/lib/campaign-rules";

const STEPS = [
  {
    icon: FlaskConical,
    title: "1. Submit Your Vial",
    body: "Tell us where you bought your vial and what compound it is. Just the vendor name — no contact details needed.",
  },
  {
    icon: Users,
    title: "2. Launch a Community Group",
    body: `Your vial creates a group project so other people who bought from that same vendor can join you. It needs just ${MIN_BACKERS} people and stays open to new backers for ${FUNDING_WINDOW_HOURS} hours.`,
  },
  {
    icon: TrendingDown,
    title: "3. Cost Drops as People Join",
    body: `Split the bill! The more community members who chip in — up to ${MAX_BACKERS} per group — the cheaper it gets for everyone.`,
  },
  {
    icon: FileCheck2,
    title: "4. Get Accredited Lab Results",
    body: `Your card is held safely until the group closes. ${TESTING_LAB} tests the sample and public results are published.`,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-10 text-center">
        <h2 className="font-display text-2xl sm:text-3xl">
          <span className="neon-text-pink">How Adding Your Vial</span>{" "}
          <span className="neon-text-cyan">Works</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-foreground/60">
          No technical know-how needed. Four simple steps get a vial from your shelf to a
          published lab report — {MIN_BACKERS} testers minimum, {MAX_BACKERS} max, within a{" "}
          {FUNDING_WINDOW_HOURS}-hour window.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => (
          <div key={step.title} className="vpn-panel flex flex-col items-start gap-3 p-5">
            <div className="rounded-lg bg-neon-pink/10 p-2.5 text-neon-pink">
              <step.icon size={26} />
            </div>
            <h3 className="font-display text-sm tracking-wide text-foreground">{step.title}</h3>
            <p className="text-sm leading-relaxed text-foreground/60">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
