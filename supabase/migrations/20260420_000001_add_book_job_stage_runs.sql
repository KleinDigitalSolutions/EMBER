alter table public.book_draft_jobs
add column if not exists stage_runs jsonb not null default '{}'::jsonb;
