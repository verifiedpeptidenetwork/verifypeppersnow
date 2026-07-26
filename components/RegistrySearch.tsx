"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { TestResult } from "@/lib/types";
import CoaModal from "./CoaModal";

const inputClass =
  "w-full rounded-md border border-neon-cyan/25 bg-obsidian-light/80 px-3 py-2 text-sm placeholder:text-foreground/30 focus:border-neon-cyan focus:outline-none";

export default function RegistrySearch({
  results,
  initialQuery = "",
}: {
  results: TestResult[];
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [capColor, setCapColor] = useState("");
  const [collarColor, setCollarColor] = useState("");
  const [selected, setSelected] = useState<TestResult | null>(null);

  const capColors = useMemo(() => Array.from(new Set(results.map((r) => r.cap_color))).sort(), [results]);
  const collarColors = useMemo(
    () => Array.from(new Set(results.map((r) => r.collar_color))).sort(),
    [results]
  );

  const filtered = results.filter((r) => {
    const haystack = `${r.vendor_name} ${r.compound_name}`.toLowerCase();
    const matchesQuery = q.trim() ? haystack.includes(q.trim().toLowerCase()) : true;
    const matchesCap = capColor ? r.cap_color === capColor : true;
    const matchesCollar = collarColor ? r.collar_color === collarColor : true;
    return matchesQuery && matchesCap && matchesCollar;
  });

  return (
    <div>
      <div className="vpn-panel mb-6 grid grid-cols-1 gap-3 p-4 sm:grid-cols-4">
        <input
          className={`${inputClass} sm:col-span-2`}
          placeholder="Search vendor or compound..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={inputClass} value={capColor} onChange={(e) => setCapColor(e.target.value)}>
          <option value="">Any cap color</option>
          {capColors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className={inputClass}
          value={collarColor}
          onChange={(e) => setCollarColor(e.target.value)}
        >
          <option value="">Any collar color</option>
          {collarColors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-foreground/50">No results match those filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wide text-foreground/50 uppercase">
                <th className="px-3">Vendor</th>
                <th className="px-3">Compound</th>
                <th className="px-3">Cap / Collar</th>
                <th className="px-3">Purity</th>
                <th className="px-3">Status</th>
                <th className="px-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="vpn-panel">
                  <td className="rounded-l-lg px-3 py-3 text-foreground/80">{r.vendor_name}</td>
                  <td className="px-3 py-3 font-bold text-neon-cyan">{r.compound_name}</td>
                  <td className="px-3 py-3 text-foreground/60">
                    {r.cap_color} / {r.collar_color}
                  </td>
                  <td className="px-3 py-3">{r.purity_percent}%</td>
                  <td className="px-3 py-3">
                    {r.identity_match && !r.contaminants_detected ? (
                      <span className="inline-flex items-center gap-1 text-xs text-neon-cyan">
                        <CheckCircle2 size={14} /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-neon-pink">
                        <AlertTriangle size={14} /> Flagged
                      </span>
                    )}
                  </td>
                  <td className="rounded-r-lg px-3 py-3">
                    <button
                      onClick={() => setSelected(r)}
                      className="btn-outline-cyan inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs"
                    >
                      <FileText size={13} /> View COA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <CoaModal result={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
