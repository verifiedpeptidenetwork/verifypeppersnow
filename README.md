# VPN — Verified Peptides Network

Community-funded, multi-vendor compound verification. Submit a vial, split the lab fee with
everyone who bought from the same vendor, and get a published Certificate of Analysis.

## Group testing rules

Every campaign follows the same rules, defined in [`lib/campaign-rules.ts`](./lib/campaign-rules.ts):

- **4 backers minimum** to lock in testing, **20 backers maximum** per group
- **48-hour funding window** from the moment the vial is submitted
- If the group hits 20 backers, it closes immediately and moves to testing
- If the window expires with 4+ backers, it closes and moves to testing anyway
- If the window expires under 4 backers, every hold is released and the campaign is cancelled
- All testing is performed by **Janoshik Analytical**

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Postgres, Auth, Storage) — see [`supabase/schema.sql`](./supabase/schema.sql)
- Stripe Checkout with manual-capture PaymentIntents (pre-authorize when someone pledges,
  capture only once a campaign closes — at the final, lower per-person price)
- Lucide React icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). **The app runs in full demo mode with zero
configuration** — `lib/mock-data.ts` backs the homepage, `/campaigns`, and `/registry` with a mix
of an open group, a group with only hours left on its window, and a full/closed group, and
`/api/vials` + `/api/pledges` respond without persisting anything, so you can click through the
whole flow immediately.

## Connecting real services

Copy `.env.example` to `.env.local` and fill in:

1. **Supabase** — create a project, then run [`supabase/schema.sql`](./supabase/schema.sql) in
   the SQL editor. It creates `vials`, `campaigns`, `pledges`, `test_results`, RLS policies, and
   a public `coa-pdfs` storage bucket. Once `NEXT_PUBLIC_SUPABASE_URL` /
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, every page in `lib/data.ts` automatically switches
   from mock data to live queries.
2. **Stripe** — add `STRIPE_SECRET_KEY` to enable real Checkout sessions from `/api/pledges`,
   and point a webhook at `/api/stripe/webhook` (event: `checkout.session.completed`) with
   `STRIPE_WEBHOOK_SECRET` set. The webhook records each pledge and, if that pledge fills the
   group to 20, immediately captures every hold at the final per-person price.
3. **The 48h window sweep** — Stripe webhooks only fire on payment events, not on a clock, so a
   *scheduled* job is what actually closes campaigns once their 48h window runs out (whether
   that means moving to testing or releasing holds on a failed group). [`vercel.json`](./vercel.json)
   already wires `/api/campaigns/close-expired` into Vercel Cron every 15 minutes; set
   `CRON_SECRET` in your env so only that cron can call it (Vercel sends it automatically as
   `Authorization: Bearer $CRON_SECRET`). Deploying elsewhere? Point any scheduler (Supabase
   `pg_cron`, GitHub Actions, etc.) at that same endpoint instead.

## Deploying to Cloudflare

This app is set up for Cloudflare Workers via the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare)
(`open-next.config.ts`, `wrangler.jsonc`, `custom-worker.ts`). There's no drag-and-drop "upload
these files" step for an app like this — dynamic API routes need a real build + deploy, done one
of two ways:

**Option A — connect your GitHub repo (recommended, still ends up in the dashboard)**

1. Push this repo to GitHub.
2. In [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** →
   **Import a repository**, pick this repo.
3. Build command: `npx opennextjs-cloudflare build` — Build output/entry: it will detect
   `wrangler.jsonc` automatically.
4. Add your env vars (Supabase, Stripe, `CRON_SECRET`) under the project's **Settings → Variables
   and Secrets** in the dashboard.
5. Every push to `main` auto-deploys, and the Worker shows up under **Workers & Pages** in your
   dashboard.

**Option B — deploy from your terminal (no GitHub needed)**

```bash
npx wrangler login   # opens a browser to authorize your Cloudflare account, one time
npm run cf:deploy     # builds + runs `wrangler deploy`
```

This pushes the Worker straight to your account — it then appears in
`dash.cloudflare.com → Workers & Pages` just the same as option A. Set secrets first with
`npx wrangler secret put STRIPE_SECRET_KEY` (repeat for each value in `.env.example`).

Either way, the cron trigger in `wrangler.jsonc` (`*/15 * * * *`) automatically wires up
`custom-worker.ts`'s `scheduled()` handler to call `/api/campaigns/close-expired` for you — no
separate scheduler needed on Cloudflare (unlike the Vercel path above).

## Project structure

- `app/` — routes: `/` (home), `/submit-vial`, `/campaigns`, `/registry`, `/sign-in`
- `app/api/vials`, `app/api/pledges`, `app/api/stripe/webhook`,
  `app/api/campaigns/close-expired` — route handlers
- `components/` — UI, most interactive pieces are client components
- `lib/data.ts` — Supabase-or-mock data layer used by every server component
- `lib/pricing.ts` — the group cost-scaling calculator
- `lib/campaign-rules.ts` — the 4/20/48h rules and campaign phase logic
- `lib/settle-campaign.ts` — shared capture/release logic used by the webhook and the cron sweep
- `supabase/schema.sql` — full DB schema + RLS + storage bucket
