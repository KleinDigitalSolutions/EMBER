alter table public.book_scene_cards
add column if not exists outline jsonb not null default '[]'::jsonb;

create table if not exists public.book_character_state_snapshots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  character_state_id uuid not null references public.book_character_states (id) on delete cascade,
  scope text not null check (scope in ('baseline', 'scene', 'chapter')),
  sort_order integer not null default 1,
  source_scene_id uuid references public.scenes (id) on delete set null,
  source_chapter_id uuid references public.chapters (id) on delete set null,
  source_label text not null default '',
  current_state text not null,
  inner_shift text not null default '',
  agenda text not null default '',
  captured_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists book_character_state_snapshots_story_idx
on public.book_character_state_snapshots (story_id, character_state_id, sort_order, captured_at desc);

drop trigger if exists book_character_state_snapshots_set_updated_at on public.book_character_state_snapshots;
create trigger book_character_state_snapshots_set_updated_at
before update on public.book_character_state_snapshots
for each row execute function public.set_updated_at();

alter table public.book_character_state_snapshots enable row level security;

create policy "book_character_state_snapshots_read_members" on public.book_character_state_snapshots
for select using (public.can_read_workspace(workspace_id));

create policy "book_character_state_snapshots_write_editors" on public.book_character_state_snapshots
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));
