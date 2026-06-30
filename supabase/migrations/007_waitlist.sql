-- Waitlist table for pre-launch signups

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text default 'landing',
  notified boolean not null default false,
  converted boolean not null default false,
  created_at timestamptz not null default now()
);

create index waitlist_email_idx on public.waitlist (email);
create index waitlist_created_at_idx on public.waitlist (created_at);

alter table public.waitlist enable row level security;

create policy "waitlist_anon_insert"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

create policy "waitlist_admin_select"
  on public.waitlist for select
  to authenticated
  using (public.is_admin());

create policy "waitlist_admin_update"
  on public.waitlist for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "waitlist_admin_delete"
  on public.waitlist for delete
  to authenticated
  using (public.is_admin());
