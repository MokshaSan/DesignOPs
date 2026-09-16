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
alter table public.visitor_requests add column if not exists access_enabled boolean default false;
alter table public.visitor_requests add column if not exists door_unlocked boolean default false;
alter table public.visitor_requests alter column access_enabled set default false;

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

-- Live app collections (JSON rows). The web app also upserts demo data on first load.
create table if not exists public.profiles (
  id text primary key,
  email text unique not null,
  name text not null,
  role text not null,
  resident_tier text,
  unit_id text,
  created_at timestamptz not null default now()
);

insert into public.profiles (id, email, name, role, resident_tier, unit_id) values
  ('owner', 'john.owner@example.com', 'John Perera', 'resident', 'owner', '12A'),
  ('occupier', 'resident@example.com', 'Alex Perera', 'resident', 'occupier', '12A'),
  ('tenant', 'sarah.tenant@example.com', 'Sarah Fernando', 'resident', 'tenant', '12A'),
  ('household', 'david.household@example.com', 'David Perera', 'resident', 'occupier', '12A'),
  ('operator', 'operator@example.com', 'Maya Jayawardena', 'operator', null, 'Tower A'),
  ('developer', 'developer@example.com', 'Arjun Keells', 'developer', null, 'Portfolio'),
  ('visitor', 'visitor@example.com', 'Priya Silva', 'visitor', null, '12A')
on conflict (id) do nothing;

alter table public.profiles enable row level security;
drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read" on public.profiles for select to anon, authenticated using (true);
grant select on public.profiles to anon, authenticated;

insert into public.app_records (collection, id, payload) values
  ('service_requests', 'sr1', '{"id":"sr1","unitId":"12A","residentName":"John Perera","kind":"cleaning","requestedAt":"Today, 09:15","scheduledFor":"Today, 2:00 PM","notes":"Standard clean of 2BR unit.","status":"pending"}'::jsonb),
  ('service_requests', 'sr2', '{"id":"sr2","unitId":"8F","residentName":"Amara Silva","kind":"maintenance","requestedAt":"Today, 08:40","scheduledFor":"Tomorrow, 10:00 AM","notes":"AC not cooling below 26°C.","status":"pending"}'::jsonb),
  ('service_tickets', 't-m1', '{"id":"t-m1","kind":"maintenance","category":"Plumbing","title":"Kitchen mixer dripping","detail":"Cold tap drips overnight.","unitId":"12A","residentName":"John Perera","createdAt":"Yesterday","status":"in-progress","priority":"medium"}'::jsonb),
  ('invoices', 'inv-1', '{"id":"inv-1","period":"September 2026","amount":185000,"currency":"LKR","dueDate":"2026-09-30","status":"due","unitId":"12A","residentName":"John Perera"}'::jsonb)
on conflict (collection, id) do nothing;

do $$
begin
  alter publication supabase_realtime add table public.app_records;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
