-- Reports: bug, feature request, confusing, other. Debrief ratings stay in the same table (kind = 'rating').
alter table public.feedback add column kind text not null default 'note';
alter table public.feedback add column title text;
alter table public.feedback add column context jsonb;
alter table public.feedback add column status text not null default 'new'; -- new | triaged | done
update public.feedback set kind = 'rating' where rating is not null;
create index feedback_created on public.feedback (created_at desc);
