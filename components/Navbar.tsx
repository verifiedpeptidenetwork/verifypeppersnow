"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

const TABS = [
  { label: "Home", href: "/" },
  { label: "Submit Vial", href: "/submit-vial" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Registry", href: "/registry" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Vault", href: "/campaigns" },
  { label: "Sign In", href: "/sign-in" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/registry?q=${encodeURIComponent(query.trim())}` : "/registry");
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neon-pink/20 bg-obsidian/95 backdrop-blur">
      <div className="flex items-center gap-4 px-3 py-2 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/vpn-logo.png"
            alt="Verified Peptides Network"
            width={44}
            height={44}
            className="rounded-full ring-2 ring-neon-pink/60"
            priority
          />
          <span className="hidden font-display text-sm leading-tight sm:block">
            <span className="block neon-text-cyan">VERIFIED PEPTIDES</span>
            <span className="block text-[0.65rem] tracking-widest text-neon-pink/80">
              NETWORK &middot; VERIFY PEPTIDES NOW
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden flex-1 items-stretch justify-end gap-1 lg:flex">
          {TABS.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className="gold-tab flex items-center px-4 py-2 text-xs tracking-wide uppercase"
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <button
          className="ml-auto rounded-md border border-neon-pink/40 p-2 text-neon-pink lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="border-t border-white/5 px-3 py-2 sm:px-6">
        <form onSubmit={handleSearch} className="relative mx-auto max-w-2xl">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-neon-cyan/70" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search vendor, compound, cap color..."
            className="w-full rounded-full border border-neon-cyan/30 bg-obsidian-light/80 py-2 pr-4 pl-9 text-sm text-foreground placeholder:text-foreground/40 focus:border-neon-cyan focus:outline-none"
          />
        </form>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-2 border-t border-white/5 px-3 py-3 lg:hidden">
          {TABS.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={() => setMobileOpen(false)}
              className="gold-tab px-4 py-2 text-center text-xs tracking-wide uppercase"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
