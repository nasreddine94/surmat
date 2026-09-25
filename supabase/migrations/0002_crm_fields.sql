-- CRM fields and lead types from the website PRD (§55), exhibitor lifecycle (§70).

-- Leads: all PRD lead types, common CRM fields and first-touch attribution.
alter table leads drop constraint if exists leads_type_check;
alter table leads add constraint leads_type_check
  check (type in ('visitor', 'exhibitor', 'buyer', 'partner', 'media', 'speaker', 'other'));

alter table leads
  add column if not exists job_title text,
  add column if not exists sector text,
  add column if not exists source text,
  add column if not exists campaign text,
  add column if not exists landing_page text,
  add column if not exists utm jsonb;

create index if not exists leads_campaign_idx on leads (campaign, created_at desc);

-- Exhibitors: only confirmed / published exhibitors may ever be shown publicly.
alter table exhibitors
  add column if not exists status text not null default 'lead'
  check (status in ('lead', 'prospect', 'negotiation', 'contracted', 'confirmed', 'published', 'archived'));

drop policy if exists "public read" on exhibitors;
create policy "public read" on exhibitors for select using (published and status in ('confirmed', 'published'));
