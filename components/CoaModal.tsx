"use client";

import { X, CheckCircle2, AlertTriangle, FlaskConical } from "lucide-react";
import { TestResult } from "@/lib/types";

export default function CoaModal({
  result,
  onClose,
}: {
  result: TestResult;
  onClose: () => void;
}) {
  const hasRealPdf = Boolean(result.coa_pdf_url);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="vpn-panel max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs tracking-wide text-foreground/50 uppercase">
              {result.vendor_name}
            </p>
            <h3 className="font-display text-xl text-neon-cyan">
              {result.compound_name}
            </h3>
            <p className="mt-1 text-xs text-foreground/50">
              Cap: {result.cap_color} &middot; Collar: {result.collar_color}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border border-white/10 p-1.5 text-foreground/60 hover:text-neon-pink"
          >
            <X size={18} />
          </button>
        </div>

        {hasRealPdf ? (
          <iframe src={result.coa_pdf_url} className="h-[60vh] w-full rounded-lg border border-white/10" />
        ) : (
          <div className="rounded-lg border border-neon-cyan/20 bg-black/30 p-6">
            <div className="mb-4 flex items-center gap-2 text-neon-pink">
              <FlaskConical size={18} />
              <span className="font-display text-sm tracking-wide">Certificate of Analysis</span>
            </div>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-foreground/50 uppercase">Purity</dt>
                <dd className="font-display text-2xl neon-text-cyan">{result.purity_percent}%</dd>
              </div>
              <div>
                <dt className="text-xs text-foreground/50 uppercase">Lab</dt>
                <dd className="text-sm">{result.lab_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-foreground/50 uppercase">Identity Match</dt>
                <dd className="flex items-center gap-1 text-sm">
                  {result.identity_match ? (
                    <>
                      <CheckCircle2 size={16} className="text-neon-cyan" /> Confirmed
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} className="text-neon-pink" /> Mismatch
                    </>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-foreground/50 uppercase">Contaminant Check</dt>
                <dd className="flex items-center gap-1 text-sm">
                  {result.contaminants_detected ? (
                    <>
                      <AlertTriangle size={16} className="text-neon-pink" /> Detected
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} className="text-neon-cyan" /> Clean
                    </>
                  )}
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-xs text-foreground/40">
              Published {new Date(result.published_at).toLocaleDateString()}. The full lab PDF
              will render here automatically once it&apos;s uploaded to storage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
