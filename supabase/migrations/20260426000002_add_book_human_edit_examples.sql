create table public.book_human_edit_examples (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  scene_id uuid not null references public.scenes (id) on delete cascade,
  scene_title text not null default '',
  draft_job_id uuid not null references public.book_draft_jobs (id) on delete cascade,
  provider public.ai_provider not null,
  model_name text,
  category_lane text not null default '',
  source_text text not null default '',
  edited_text text not null default '',
  source_word_count integer not null default 0,
  edited_word_count integer not null default 0,
  diff_summary jsonb not null default '{}'::jsonb,
  edit_tags jsonb not null default '[]'::jsonb,
  learning_status text not null default 'included'
    check (learning_status in ('included', 'excluded', 'needs_review')),
  excluded_reason text,
  learning_weight numeric not null default 1.0,
  accepted_at timestamptz,
  captured_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (draft_job_id, accepted_at)
);

create index book_human_edit_examples_workspace_idx
on public.book_human_edit_examples (workspace_id, learning_status, updated_at desc);

create index book_human_edit_examples_story_scene_idx
on public.book_human_edit_examples (story_id, scene_id, captured_at desc);

create trigger book_human_edit_examples_set_updated_at
before update on public.book_human_edit_examples
for each row execute function public.set_updated_at();

alter table public.book_human_edit_examples enable row level security;

create policy "book_human_edit_examples_read_members" on public.book_human_edit_examples
for select using (public.can_read_workspace(workspace_id));

create policy "book_human_edit_examples_write_editors" on public.book_human_edit_examples
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));
