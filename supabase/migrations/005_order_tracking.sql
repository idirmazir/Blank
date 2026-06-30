-- Order tracking: handoffs, shipments, returns, QC, status history

alter table public.orders
  drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check
  check (status in ('pending', 'paid', 'factory_notified', 'factory_paid', 'shipped', 'delivered', 'returned', 'cancelled'));

create table public.order_factory_handoffs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  factory_id uuid not null references public.factories (id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending', 'notified', 'paid', 'confirmed', 'rejected')),
  payment_id text,
  payment_amount_cents integer,
  payment_currency text not null default 'aud',
  payment_status text,
  factory_reference text,
  notified_at timestamptz,
  paid_at timestamptz,
  confirmed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create table public.order_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  tracking_number text,
  carrier text,
  aftership_id text,
  status text not null default 'pending'
    check (status in ('pending', 'info_received', 'in_transit', 'out_for_delivery', 'delivered', 'delivery_failed', 'exception')),
  shipped_at timestamptz,
  delivered_at timestamptz,
  estimated_delivery timestamptz,
  created_at timestamptz not null default now()
);

create table public.order_returns (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  order_item_id uuid references public.order_items (id) on delete set null,
  reason text,
  status text not null default 'requested'
    check (status in ('requested', 'approved', 'rejected', 'shipped_to_factory', 'received_by_factory', 'refunded', 'closed')),
  return_tracking_number text,
  return_carrier text,
  refund_amount_cents integer,
  refund_id text,
  factory_reference text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.qc_records (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  factory_id uuid not null references public.factories (id) on delete restrict,
  qc_type text not null default 'pre_ship'
    check (qc_type in ('pre_ship', 'post_delivery', 'return_inspection')),
  status text not null default 'pending'
    check (status in ('pending', 'passed', 'failed', 'conditional')),
  inspector text,
  notes text,
  photos text[] default '{}',
  checklist jsonb default '{}',
  inspected_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  from_status text,
  to_status text not null,
  reason text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index order_factory_handoffs_order_id_idx on public.order_factory_handoffs (order_id);
create index order_factory_handoffs_factory_id_idx on public.order_factory_handoffs (factory_id);
create index order_shipments_order_id_idx on public.order_shipments (order_id);
create index order_shipments_tracking_number_idx on public.order_shipments (tracking_number);
create index order_returns_order_id_idx on public.order_returns (order_id);
create index qc_records_order_id_idx on public.qc_records (order_id);
create index qc_records_factory_id_idx on public.qc_records (factory_id);
create index order_status_history_order_id_idx on public.order_status_history (order_id);

alter table public.order_factory_handoffs enable row level security;
alter table public.order_shipments enable row level security;
alter table public.order_returns enable row level security;
alter table public.qc_records enable row level security;
alter table public.order_status_history enable row level security;

create policy "shipments_select_owner"
  on public.order_shipments for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_shipments.order_id and o.user_id = auth.uid()
  ));

create policy "returns_select_owner"
  on public.order_returns for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_returns.order_id and o.user_id = auth.uid()
  ));

create policy "handoffs_admin_all"
  on public.order_factory_handoffs for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "shipments_admin_manage"
  on public.order_shipments for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "returns_admin_all"
  on public.order_returns for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "qc_admin_all"
  on public.qc_records for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "history_admin_all"
  on public.order_status_history for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
