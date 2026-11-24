-- Security review: the public (anon) key could read and write _migrations through the REST API.
alter table public._migrations enable row level security;
revoke all on public._migrations from anon, authenticated;
-- The sign-up trigger function is never called directly.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
