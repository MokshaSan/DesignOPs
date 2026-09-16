-- Nestura demo users
-- 1. Open https://supabase.com/dashboard → your project → SQL Editor
-- 2. Paste this whole file → Run
-- 3. Check Authentication → Users
-- Password for every account: NesturaDemo!2026

create extension if not exists pgcrypto;

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
      uid,
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
