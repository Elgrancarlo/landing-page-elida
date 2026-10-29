-- Schema da tabela de leads da landing "Black Infinita" (Elida).
-- Rode no Supabase: Dashboard > SQL Editor > New query > cole e Run.

create table if not exists public.leads (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz,
  nome                   text,
  phone                  text,            -- como a pessoa digitou: (62) 98888-7777
  phone_e164             text unique,     -- normalizado: +5562988887777  (chave do upsert)
  email                  text,
  evento                 text,            -- lead | quiz_parcial | quiz
  score                  int,
  temperatura            text,            -- frio | morno | quente
  perguntas_respondidas  int,
  meta_90_dias           text,
  maior_trava            text,
  ja_investiu            text,
  decisao                text,
  intencao_live          text,
  utm_source             text,
  utm_medium             text,
  utm_campaign           text,
  utm_content            text,
  utm_term               text,
  utm_id                 text,
  fbclid                 text,
  url                    text,
  slug                   text
);

-- Garante o indice unico mesmo se a tabela ja existir sem ele.
create unique index if not exists leads_phone_e164_key on public.leads (phone_e164);

-- RLS ligado e SEM policies publicas: so a service_role (usada pelo /api/lead
-- no servidor) escreve e le. O navegador nunca toca na tabela direto.
alter table public.leads enable row level security;
