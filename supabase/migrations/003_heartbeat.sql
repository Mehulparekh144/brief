-- Live sessions refresh heartbeat_at every 15 s. A sweep closes active sessions that went silent
-- (server restart, crash), in any number of server processes.
alter table public.sessions add column heartbeat_at timestamptz not null default now();
create index sessions_active on public.sessions (status, heartbeat_at) where status = 'active';
