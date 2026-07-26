import SubmitVialForm from "@/components/SubmitVialForm";

export const metadata = {
  title: "Submit Your Vial | VPN",
};

export default function SubmitVialPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-14">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl sm:text-3xl">
          <span className="neon-text-pink">Submit</span> <span className="neon-text-cyan">Your Vial</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-foreground/60">
          Tell us the vendor and the compound. No contact info is published — just the details
          the community needs to recognize a matching vial.
        </p>
      </div>
      <SubmitVialForm />
    </section>
  );
}
