-- Nestura: demo users + every product table
-- Supabase → SQL Editor → paste this whole file → Run
-- Password for every account: NesturaDemo!2026

create extension if not exists pgcrypto;

create table if not exists public.visitor_requests (
  id text primary key,
  name text not null,
  contact text,
  type text not null default 'guest',
  unit_id text not null,
  host_name text,
  destination text,
  purpose text,
  requested_for text not null,
  window_start text not null,
  window_end text not null,
  risk_level text not null default 'low',
  risk_reason text not null default '',
  status text not null default 'pending',
  pass_code text not null,
  created_at timestamptz not null default now()
);

alter table public.visitor_requests add column if not exists host_name text;
alter table public.visitor_requests add column if not exists destination text;
alter table public.visitor_requests add column if not exists purpose text;

create table if not exists public.app_records (
  collection text not null,
  id text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

alter table public.visitor_requests enable row level security;
alter table public.app_records enable row level security;

drop policy if exists "visitors_insert" on public.visitor_requests;
create policy "visitors_insert" on public.visitor_requests for insert to anon, authenticated with check (true);
drop policy if exists "visitors_select" on public.visitor_requests;
create policy "visitors_select" on public.visitor_requests for select to anon, authenticated using (true);
drop policy if exists "visitors_update" on public.visitor_requests;
create policy "visitors_update" on public.visitor_requests for update to anon, authenticated using (true) with check (true);

drop policy if exists "records_all" on public.app_records;
create policy "records_all" on public.app_records for all to anon, authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.visitor_requests to anon, authenticated;
grant select, insert, update, delete on public.app_records to anon, authenticated;

do $$
declare
  rec record;
  uid uuid;
begin
  for rec in
    select * from (values
      ('john.owner@example.com',       'John Perera',        'resident',  'owner',    false),
      ('resident@example.com',         'Alex Perera',        'resident',  'occupier', false),
      ('sarah.tenant@example.com',     'Sarah Fernando',     'resident',  'tenant',   false),
      ('david.household@example.com',  'David Perera',       'resident',  'occupier', false),
      ('operator@example.com',         'Maya Jayawardena',   'operator',  null,       true),
      ('developer@example.com',        'Arjun Keells',       'developer', null,       false),
      ('visitor@example.com',          'Priya Silva',        'visitor',   null,       false)
    ) as t(email, full_name, role, tier, cctv)
  loop
    if exists (select 1 from auth.users where email = rec.email) then
      continue;
    end if;

    uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      uid,
      'authenticated',
      'authenticated',
      rec.email,
      crypt('NesturaDemo!2026', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'name', rec.full_name,
        'role', rec.role,
        'tier', rec.tier,
        'cctv', rec.cctv
      ),
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(),
      uid,
      jsonb_build_object('sub', uid::text, 'email', rec.email, 'email_verified', true),
      'email',
      rec.email,
      now(),
      now(),
      now()
    );
  end loop;
end $$;
