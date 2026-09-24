-- SURMAT platform schema.
-- Mirrors the typed content in /content (sectors, materials, applications,
-- exhibitors) so the site can move from files to CMS-driven data without
-- changing components. Localised fields are jsonb: {"en": "...", "fr": "...", "ar": "..."}.

create table editions (
  id text primary key check (id in ('dz', 'sn')),
  country char(2) not null,
  name jsonb not null,
  city jsonb not null,
  venue jsonb,
  dates jsonb,
  starts_on date,
  target_exhibitors text,
  target_visitors text,
  primary_locale text not null default 'fr',
  registration_url text,
  exhibition_url text,
  contact_email text
);

create table sectors (
  id text primary key,
  hall char(1) not null,
  sort int not null,
  name jsonb not null,
  short jsonb not null,
  description jsonb not null,
  pitch jsonb not null,
  cta_label jsonb not null,
  accent text not null
);

create table materials (
  slug text primary key,
  sector_id text not null references sectors(id),
  name jsonb not null,
  summary jsonb not null,
  finishes text[] not null default '{}',
  formats text[] not null default '{}',
  spec text,
  keywords text[] not null default '{}',
  texture_kind text,            -- procedural fallback
  hero_image_path text,         -- storage path of real photography, when available
  published boolean not null default true
);

create table applications (
  id text primary key,
  name jsonb not null,
  sub jsonb not null,
  scene jsonb not null,
  description jsonb not null,
  light text not null default '#f3d7a8'
);

create table material_applications (
  material_slug text references materials(slug) on delete cascade,
  application_id text references applications(id) on delete cascade,
  primary key (material_slug, application_id)
);

-- Which material sits on which surface of an application scene (and the alternatives offered).
create table application_surfaces (
  application_id text references applications(id) on delete cascade,
  surface text not null check (surface in ('floor', 'wall', 'feature', 'ceiling', 'counter')),
  material_slug text not null references materials(slug),
  is_default boolean not null default false,
  sort int not null default 0,
  primary key (application_id, surface, material_slug)
);

create table exhibitors (
  slug text primary key,
  name text not null,
  country char(2) not null,
  blurb jsonb not null,
  founded int,
  website text,
  logo_path text,
  is_sample boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table exhibitor_editions (
  exhibitor_slug text references exhibitors(slug) on delete cascade,
  edition_id text references editions(id),
  stand text,
  primary key (exhibitor_slug, edition_id)
);

create table exhibitor_materials (
  exhibitor_slug text references exhibitors(slug) on delete cascade,
  material_slug text references materials(slug) on delete cascade,
  primary key (exhibitor_slug, material_slug)
);

create table products (
  id uuid primary key default gen_random_uuid(),
  exhibitor_slug text not null references exhibitors(slug) on delete cascade,
  material_slug text not null references materials(slug),
  name jsonb not null,
  finish text,
  format text,
  color text,
  technical jsonb,
  datasheet_path text,
  bim_path text,
  image_path text,
  published boolean not null default false
);

-- Exhibitor applications and visitor registrations (written by /api/leads with the service role).
create table leads (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('exhibitor', 'visitor')),
  edition text not null references editions(id),
  locale text,
  email text not null,
  name text,
  company text,
  phone text,
  country text,
  consent boolean not null default false,
  payload jsonb not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
create index leads_edition_type_idx on leads (edition, type, created_at desc);

-- First-party funnel analytics (written by /api/events).
create table events (
  id bigint generated always as identity primary key,
  event text not null,
  edition text,
  locale text,
  path text,
  props jsonb,
  created_at timestamptz not null default now()
);
create index events_event_created_idx on events (event, created_at desc);

-- Commercial intelligence: which materials drive exhibit intent.
create view material_interest as
select
  props->>'material' as material_slug,
  edition,
  count(*) filter (where event = 'material_view') as views,
  count(*) filter (where event = 'material_expand') as expands,
  count(*) filter (where event = 'exhibit_cta_click') as exhibit_clicks
from events
where props ? 'material'
group by 1, 2;

-- Row-level security: public content is readable; leads and events are service-role only.
alter table editions enable row level security;
alter table sectors enable row level security;
alter table materials enable row level security;
alter table applications enable row level security;
alter table material_applications enable row level security;
alter table application_surfaces enable row level security;
alter table exhibitors enable row level security;
alter table exhibitor_editions enable row level security;
alter table exhibitor_materials enable row level security;
alter table products enable row level security;
alter table leads enable row level security;
alter table events enable row level security;

create policy "public read" on editions for select using (true);
create policy "public read" on sectors for select using (true);
create policy "public read" on materials for select using (published);
create policy "public read" on applications for select using (true);
create policy "public read" on material_applications for select using (true);
create policy "public read" on application_surfaces for select using (true);
create policy "public read" on exhibitors for select using (published);
create policy "public read" on exhibitor_editions for select using (true);
create policy "public read" on exhibitor_materials for select using (true);
create policy "public read" on products for select using (published);
-- No policies on leads/events: only the service role (server) can read or write them.
