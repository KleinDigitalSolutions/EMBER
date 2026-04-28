alter table public.book_projects
add column if not exists object_ledger jsonb not null default '[]'::jsonb,
add column if not exists knowledge_ledger jsonb not null default '[]'::jsonb,
add column if not exists promise_ledger jsonb not null default '[]'::jsonb;

alter table public.book_draft_jobs
add column if not exists state_diff jsonb,
add column if not exists state_diff_status text not null default 'none';

alter table public.book_draft_jobs
drop constraint if exists book_draft_jobs_state_diff_status_check;

alter table public.book_draft_jobs
add constraint book_draft_jobs_state_diff_status_check
check (state_diff_status in ('none', 'pending', 'approved', 'rejected', 'approved_manual'));
