import { getTestResults } from "@/lib/data";
import RegistrySearch from "@/components/RegistrySearch";

export const metadata = {
  title: "Public COA Registry | VPN",
};

export default async function RegistryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [results, params] = await Promise.all([getTestResults(), searchParams]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl sm:text-3xl">
          <span className="neon-text-pink">Public</span>{" "}
          <span className="neon-text-cyan">COA Registry</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/60">
          Every published lab result, searchable by vendor, compound, cap color, and collar
          color.
        </p>
      </div>

      <RegistrySearch results={results} initialQuery={params.q ?? ""} />
    </section>
  );
}
