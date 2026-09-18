create extension if not exists pgcrypto;

create table if not exists public.beta_testers (
  id uuid primary key default gen_random_uuid(),
  tester_code text unique not null,
  access_token text unique not null,
  name text not null,
  country text not null,
  contact_method text not null check (contact_method in ('telegram','whatsapp','email','x')),
  contact_value text not null,
  device_model text not null,
  android_version text not null,
  focus text not null check (focus in ('playback','downloads','search','ui','compatibility','general')),
  source text,
  notes text,
  consented_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.beta_reports (
  id uuid primary key default gen_random_uuid(),
  report_code text unique not null,
  tester_id uuid not null references public.beta_testers(id) on delete cascade,
  category text not null,
  app_version text not null,
  description text not null,
  attachment_path text,
  device_model text,
  android_version text,
  status text not null default 'new' check (status in ('new','reviewing','fixed','closed')),
  created_at timestamptz not null default now()
);

alter table public.beta_testers enable row level security;
alter table public.beta_reports enable row level security;

insert into storage.buckets (id, name, public, file_size_limit)
values ('beta-reports', 'beta-reports', false, 15728640)
on conflict (id) do update
set public = false, file_size_limit = 15728640;

create index if not exists beta_testers_created_at_idx on public.beta_testers(created_at desc);
create index if not exists beta_reports_created_at_idx on public.beta_reports(created_at desc);
create index if not exists beta_reports_tester_id_idx on public.beta_reports(tester_id);
