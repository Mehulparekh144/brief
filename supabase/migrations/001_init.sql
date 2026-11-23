-- Brieflab schema v1. The server reads and writes with the secret key.
-- Browsers get no direct table access: RLS is on and there are no policies.

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  github_login text,
  avatar_url text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  challenge text not null,
  harness_version int not null,
  model text not null,
  status text not null default 'active', -- active | submitted | error
  tokens_in int not null default 0,
  tokens_cache_write int not null default 0,
  tokens_cache_read int not null default 0,
  tokens_out int not null default 0,
  tokens_total int not null default 0,
  cost_usd numeric(10, 6) not null default 0,
  model_calls int not null default 0,
  user_messages int not null default 0,
  tests_passed int,
  tests_total int,
  passed boolean,
  diff text,
  debrief jsonb,
  coach_cost_usd numeric(10, 6) not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);
create index sessions_user_started on public.sessions (user_id, started_at desc);
create index sessions_started on public.sessions (started_at);

create table public.events (
  session_id uuid not null references public.sessions (id) on delete cascade,
  seq int not null,
  kind text not null,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  primary key (session_id, seq)
);

create table public.feedback (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id) on delete set null,
  session_id uuid references public.sessions (id) on delete set null,
  rating int check (rating between 1 and 5),
  text text,
  page text,
  created_at timestamptz not null default now()
);

-- A profile row for every new sign-in. GitHub puts the login in user_name.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, github_login, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.events enable row level security;
alter table public.feedback enable row level security;
