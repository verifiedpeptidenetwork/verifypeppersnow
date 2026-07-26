import { Mail } from "lucide-react";

export const metadata = {
  title: "Sign In | VPN",
};

export default function SignInPage() {
  return (
    <section className="mx-auto max-w-md px-4 py-20">
      <div className="vpn-panel p-8 text-center">
        <Mail size={32} className="mx-auto mb-3 text-neon-cyan" />
        <h1 className="font-display text-xl neon-text-pink">Sign In</h1>
        <p className="mt-3 text-sm text-foreground/60">
          Magic-link and OAuth sign-in (via Supabase Auth) plug in here once your Supabase
          project keys are set in <code className="text-neon-cyan">.env.local</code>.
        </p>
      </div>
    </section>
  );
}
