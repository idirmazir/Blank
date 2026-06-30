-- Blank storefront: factories table + product columns

create table public.factories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  email text,
  phone text,
  wechat_id text,
  country text not null default 'China',
  payment_method text not null default 'wise'
    check (payment_method in ('wise', 'stripe_connect', 'paypal', 'wire', 'alipay')),
  payment_details jsonb not null default '{}',
  shipping_origin_address jsonb not null default '{}',
  qc_requirements jsonb not null default '{}',
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.products
  add column factory_id uuid references public.factories (id) on delete set null;

alter table public.products
  add column factory_cost_cents integer not null default 0 check (factory_cost_cents >= 0);

alter table public.products
  add column lead_time_days integer not null default 7;

alter table public.factories enable row level security;

create policy "factories_admin_manage"
  on public.factories for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create index products_factory_id_idx on public.products (factory_id);
