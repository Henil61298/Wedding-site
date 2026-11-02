create table if not exists public.allfunc_rsvps (
  id uuid primary key,
  name text not null check (char_length(btrim(name)) between 1 and 100),
  attending boolean not null,
  wishes text not null default '' check (char_length(wishes) <= 1000),
  updated_at timestamptz not null default now()
);

alter table public.allfunc_rsvps
  add column if not exists wishes text not null default ''
  check (char_length(wishes) <= 1000);

alter table public.allfunc_rsvps enable row level security;

revoke all on table public.allfunc_rsvps from public, anon, authenticated;
grant all on table public.allfunc_rsvps to service_role;
