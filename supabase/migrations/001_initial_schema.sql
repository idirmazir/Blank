-- Blank storefront: core schema, RLS, stock helper

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'aud',
  category text not null default '',
  image_urls text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'cancelled')),
  total_cents integer not null check (total_cents >= 0),
  stripe_session_id text unique,
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price_cents integer not null check (price_cents >= 0),
  unique (order_id, product_id)
);

create index products_slug_idx on public.products (slug);
create index products_active_idx on public.products (active);
create index products_category_idx on public.products (category);
create index orders_user_id_idx on public.orders (user_id);
create index orders_stripe_session_id_idx on public.orders (stripe_session_id);
create index orders_email_idx on public.orders (email);
create index order_items_order_id_idx on public.order_items (order_id);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

create policy "products_select_active"
  on public.products
  for select
  to anon, authenticated
  using (active = true);

create policy "products_admin_manage"
  on public.products
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "orders_select_owner"
  on public.orders
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "order_items_select_owner"
  on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.user_id = auth.uid()
    )
  );

create or replace function public.decrement_product_stock(
  p_product_id uuid,
  p_quantity integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_stock integer;
begin
  if p_quantity <= 0 then
    raise exception 'Quantity must be positive';
  end if;

  select stock
  into current_stock
  from public.products
  where id = p_product_id
  for update;

  if not found then
    raise exception 'Product not found: %', p_product_id;
  end if;

  if current_stock < p_quantity then
    raise exception 'Insufficient stock for product %', p_product_id;
  end if;

  update public.products
  set stock = stock - p_quantity
  where id = p_product_id;
end;
$$;

revoke all on function public.decrement_product_stock(uuid, integer) from public;
grant execute on function public.decrement_product_stock(uuid, integer) to service_role;
