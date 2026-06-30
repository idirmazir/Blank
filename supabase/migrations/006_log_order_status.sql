-- Helper: log status change + update order status atomically
create or replace function public.log_order_status(
  p_order_id uuid,
  p_to_status text,
  p_reason text default null,
  p_metadata jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_status text;
begin
  select status into v_current_status from public.orders where id = p_order_id;

  insert into public.order_status_history (order_id, from_status, to_status, reason, metadata)
  values (p_order_id, v_current_status, p_to_status, p_reason, p_metadata);

  update public.orders set status = p_to_status where id = p_order_id;
end;
$$;

revoke all on function public.log_order_status(uuid, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.log_order_status(uuid, text, text, jsonb) to service_role;
