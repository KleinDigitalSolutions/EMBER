alter table public.book_draft_jobs
add column if not exists literary_friction_text text,
add column if not exists literary_friction_notes jsonb not null default '[]'::jsonb,
add column if not exists literary_friction_report jsonb;
