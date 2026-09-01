-- Run this once in the Supabase Dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: every statement is guarded with "if not exists" / "or replace".

create extension if not exists pgcrypto;

-- One wallet per account, private to that account.
create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance numeric not null default 5000,
  updated_at timestamptz not null default now()
);

-- One row per verification run, private to the account that ran it.
create table if not exists public.verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type text not null check (type in ('identity', 'phone', 'business', 'credit_score')),
  document_type text,
  reference text not null,
  customer_name text,
  status text not null check (status in ('match', 'no_match', 'pending')),
  cost numeric not null,
  result jsonb,
  created_at timestamptz not null default now()
);

-- Widen the type constraint for projects created before the Credit Score
-- module existed (safe/no-op if the table was just created above already).
alter table public.verifications drop constraint if exists verifications_type_check;
alter table public.verifications add constraint verifications_type_check
  check (type in ('identity', 'phone', 'business', 'credit_score'));

create index if not exists verifications_user_id_created_at_idx
  on public.verifications (user_id, created_at desc);

-- Give every new account a starting wallet, and a row in the shared profiles
-- table, automatically.
--
-- NOTE: this project's `profiles` table pre-dates Nexus KYC and belongs to a
-- different, unrelated product sharing this same Supabase project. If that
-- product already had its own `handle_new_user`/`on_auth_user_created`
-- function or trigger, the earlier version of this script (which did not
-- touch `profiles`) would have replaced it with a version that only created
-- a wallet row -- meaning that other product's sign-ups may have silently
-- stopped getting a profiles row too. This version restores profile
-- creation (now including Nexus KYC accounts), but if the other product
-- expects different columns/values here, this needs reconciling with it.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.wallets (user_id) values (new.id);

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'Administrator'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: give any existing account that's missing a profiles row one,
-- without touching rows that already exist (safe to re-run).
insert into public.profiles (id, email, full_name, role)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'full_name', u.email), 'Administrator'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- Row Level Security: an account can only ever see/change its own rows.
alter table public.wallets enable row level security;
alter table public.verifications enable row level security;

drop policy if exists "wallets_select_own" on public.wallets;
create policy "wallets_select_own" on public.wallets
  for select using (auth.uid() = user_id);

drop policy if exists "wallets_update_own" on public.wallets;
create policy "wallets_update_own" on public.wallets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "verifications_select_own" on public.verifications;
create policy "verifications_select_own" on public.verifications
  for select using (auth.uid() = user_id);

drop policy if exists "verifications_insert_own" on public.verifications;
create policy "verifications_insert_own" on public.verifications
  for insert with check (auth.uid() = user_id);
