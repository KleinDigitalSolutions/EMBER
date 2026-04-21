create table public.book_quality_evals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  scene_id uuid not null references public.scenes (id) on delete cascade,
  draft_job_id uuid references public.book_draft_jobs (id) on delete cascade,
  ai_run_id uuid references public.ai_runs (id) on delete set null,
  provider public.ai_provider not null,
  model_name text,
  evaluator_kind text not null default 'quality_eval',
  word_target_min integer not null,
  word_target_max integer not null,
  word_actual integer not null,
  hook_score integer not null default 0,
  tension_score integer not null default 0,
  dialogue_score integer not null default 0,
  specificity_score integer not null default 0,
  german_cleanliness_score integer not null default 0,
  continuity_score integer not null default 0,
  market_fit_score integer not null default 0,
  pov_discipline_score integer not null default 0,
  readability_score integer not null default 0,
  human_rating integer,
  issues jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index book_quality_evals_story_idx
on public.book_quality_evals (story_id, scene_id, created_at desc);

alter table public.book_quality_evals enable row level security;

create policy "book_quality_evals_read_members" on public.book_quality_evals
for select using (public.can_read_workspace(workspace_id));

create policy "book_quality_evals_write_editors" on public.book_quality_evals
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));
