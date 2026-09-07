-- PukaMoney Tracker: installment purchases for future credit-card bills
-- Paste this into Supabase SQL Editor and click Run.

create table if not exists public.credit_card_purchases (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  total_amount numeric(12,2) not null check (total_amount >= 0),
  installment_amount numeric(12,2) not null check (installment_amount >= 0),
  total_installments integer not null default 1 check (total_installments > 0),
  installments_paid integer not null default 0
    check (installments_paid >= 0 and installments_paid <= total_installments),
  first_due_date date not null,
  created_at timestamptz not null default now()
);

alter table public.credit_card_purchases enable row level security;

-- This app currently has no authentication and uses a single private workspace.
-- The policy allows the existing app to read and manage this table.
create policy "Allow all access to credit card purchases"
  on public.credit_card_purchases
  for all
  using (true)
  with check (true);

-- Optional: add a dedicated current card balance to the existing account row.
alter table public.accounts
  add column if not exists credit_card_balance numeric(12,2) not null default 0;

alter table public.accounts
  add column if not exists pyg_bank_2 numeric(14,0) not null default 0;

comment on table public.credit_card_purchases is
  'Purchases made with the Nubank credit card, including future installment bills.';
