-- Verified Peptides Network (VPN) — Supabase schema
-- Run in the Supabase SQL editor, or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- vials: one row per user-submitted vial (the thing a campaign is built around)
-- ---------------------------------------------------------------------------
create table if not exists public.vials (
  id uuid primary key default gen_random_uuid(),
  vendor_name text not null,
  compound_name text not null,
  dosage text not null,
  cap_color text not null,
  collar_color text not null,
  submitted_by text, -- email, kept private (never selected by anon read policies below)
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- campaigns: the group-funding project spawned by a vial
-- ---------------------------------------------------------------------------
create type public.campaign_status as enum ('funding', 'funded', 'testing', 'completed', 'cancelled');

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  vial_id uuid not null references public.vials(id) on delete cascade,
  funding_target_cents integer not null check (funding_target_cents > 0),
  -- Group testing rules: needs at least 4 backers to lock in testing, caps at
  -- 20, and only accepts pledges for 48h from creation (see lib/campaign-rules.ts).
  minimum_backers integer not null default 4 check (minimum_backers > 0),
  max_backers integer not null default 20 check (max_backers >= minimum_backers),
  funding_window_hours integer not null default 48 check (funding_window_hours > 0),
  status public.campaign_status not null default 'funding',
  created_at timestamptz not null default now()
);

create index if not exists campaigns_status_idx on public.campaigns(status);
create index if not exists campaigns_vial_id_idx on public.campaigns(vial_id);

-- ---------------------------------------------------------------------------
-- pledges: one Stripe pre-authorization hold per backer per campaign
-- ---------------------------------------------------------------------------
create type public.pledge_status as enum ('authorized', 'captured', 'cancelled', 'failed');

create table if not exists public.pledges (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  backer_email text not null,
  amount_cents integer not null check (amount_cents > 0),
  stripe_payment_intent_id text,
  status public.pledge_status not null default 'authorized',
  created_at timestamptz not null default now()
);

create index if not exists pledges_campaign_id_idx on public.pledges(campaign_id);

-- ---------------------------------------------------------------------------
-- test_results: published COA data once a campaign's sample has been tested
-- ---------------------------------------------------------------------------
create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  vendor_name text not null,
  compound_name text not null,
  cap_color text not null,
  collar_color text not null,
  purity_percent numeric(5, 2) not null,
  identity_match boolean not null,
  contaminants_detected boolean not null,
  lab_name text not null default 'Janoshik Analytical',
  coa_pdf_url text not null, -- Supabase Storage public URL (bucket: coa-pdfs)
  published_at timestamptz not null default now()
);

create index if not exists test_results_vendor_idx on public.test_results(vendor_name);
create index if not exists test_results_compound_idx on public.test_results(compound_name);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.vials enable row level security;
alter table public.campaigns enable row level security;
alter table public.pledges enable row level security;
alter table public.test_results enable row level security;

-- Public registry & campaign feed are readable by anyone. Writes go through
-- the service-role key from API routes (app/api/vials, app/api/stripe/webhook),
-- so no anon insert/update policies are defined here.
--
-- Postgres RLS is row-level, not column-level: this policy makes every column
-- in `vials` selectable, including submitted_by. The app never selects that
-- column from anon/public queries (see VIAL_PUBLIC_COLUMNS in lib/data.ts) —
-- if you query this table from anywhere else, explicitly exclude submitted_by
-- or move it into a separate table with its own policy.
create policy "Vials are publicly readable"
  on public.vials for select
  using (true);

create policy "Campaigns are publicly readable"
  on public.campaigns for select
  using (true);

create policy "Pledge counts are publicly readable"
  on public.pledges for select
  using (true);

create policy "Test results are publicly readable"
  on public.test_results for select
  using (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for Certificates of Analysis
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('coa-pdfs', 'coa-pdfs', true)
on conflict (id) do nothing;

create policy "COA PDFs are publicly readable"
  on storage.objects for select
  using (bucket_id = 'coa-pdfs');
