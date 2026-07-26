import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neon-pink/20 bg-obsidian-light/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center text-sm text-foreground/60">
        <div className="flex items-center gap-2 neon-text-cyan">
          <ShieldCheck size={18} />
          <span className="font-display tracking-wide">VERIFIED PEPTIDES NETWORK</span>
        </div>
        <p className="max-w-2xl text-xs text-foreground/40">
          Community-funded, third-party lab verification for research compounds. VPN does not
          sell, ship, or endorse any vendor. All results reflect the specific vial tested and are
          published for research and educational purposes only.
        </p>
        <p className="text-xs text-foreground/30">
          &copy; {new Date().getFullYear()} Verified Peptides Network.
        </p>
      </div>
    </footer>
  );
}
