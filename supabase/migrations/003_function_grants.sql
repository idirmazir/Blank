-- Tighten RPC execute grants (security advisor)

revoke execute on function public.decrement_product_stock(uuid, integer)
  from public, anon, authenticated;

grant execute on function public.decrement_product_stock(uuid, integer)
  to service_role;

revoke execute on function public.is_admin() from public, anon;

grant execute on function public.is_admin() to authenticated;
