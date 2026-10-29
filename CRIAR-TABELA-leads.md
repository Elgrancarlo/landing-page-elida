create table if not exists public.leads (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz,
  nome                   text,
  phone                  text,
  phone_e164             text unique,
  email                  text,
  evento                 text,
  score                  int,
  temperatura            text,
  perguntas_respondidas  int,
  meta_90_dias           text,
  maior_trava            text,
  ja_investiu            text,
  decisao                text,
  intencao_live          text,
  utm_source text, utm_medium text, utm_campaign text,
  utm_content text, utm_term text, utm_id text, fbclid text,
  url text, slug text
);
create unique index if not exists leads_phone_e164_key on public.leads (phone_e164);
alter table public.leads enable row level security;
