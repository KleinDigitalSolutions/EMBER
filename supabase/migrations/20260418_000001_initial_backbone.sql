create extension if not exists pgcrypto;

create type public.workspace_role as enum ('owner', 'editor', 'reviewer');
create type public.story_status as enum ('draft', 'playtest', 'submitted', 'in_review', 'approved', 'archived');
create type public.story_mode as enum ('branching', 'book');
create type public.book_priority as enum ('primary', 'secondary');
create type public.book_phase as enum (
  'phase_1_foundation',
  'phase_2_memory',
  'phase_3_drafting',
  'phase_4_continuity',
  'phase_5_market'
);
create type public.book_target_format as enum ('novella', 'novel', 'series');
create type public.book_job_status as enum ('ready', 'accepted', 'rejected', 'failed');
create type public.book_thread_status as enum ('active', 'watch', 'resolved');
create type public.book_importance as enum ('high', 'medium', 'low');
create type public.ai_provider as enum ('openai', 'anthropic', 'local');
create type public.ai_run_kind as enum ('draft', 'extract', 'continuity', 'rewrite', 'review', 'patch');
create type public.ai_patch_status as enum ('proposed', 'accepted', 'rejected');
create type public.submission_status as enum (
  'draft',
  'submitted',
  'in_review',
  'changes_requested',
  'approved',
  'scheduled',
  'published',
  'archived'
);
create type public.review_level as enum ('info', 'warning', 'error');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  owner_user_id uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.workspace_role not null,
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (workspace_id, user_id)
);

create or replace function public.can_read_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members workspace_member
    where workspace_member.workspace_id = target_workspace_id
      and workspace_member.user_id = auth.uid()
  );
$$;

create or replace function public.can_edit_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members workspace_member
    where workspace_member.workspace_id = target_workspace_id
      and workspace_member.user_id = auth.uid()
      and workspace_member.role in ('owner', 'editor')
  );
$$;

create or replace function public.can_manage_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members workspace_member
    where workspace_member.workspace_id = target_workspace_id
      and workspace_member.user_id = auth.uid()
      and workspace_member.role = 'owner'
  );
$$;

create or replace function public.can_review_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members workspace_member
    where workspace_member.workspace_id = target_workspace_id
      and workspace_member.user_id = auth.uid()
      and workspace_member.role in ('owner', 'reviewer')
  );
$$;

create or replace function public.handle_workspace_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new.id, new.owner_user_id, 'owner')
  on conflict (workspace_id, user_id) do nothing;

  return new;
end;
$$;

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  title text not null,
  author_name text not null,
  status public.story_status not null default 'draft',
  mode public.story_mode not null default 'branching',
  meta jsonb not null default '{}'::jsonb,
  current_version_id uuid,
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.story_versions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  version_label text not null,
  summary text,
  snapshot jsonb not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.stories
  add constraint stories_current_version_fk
  foreign key (current_version_id) references public.story_versions (id) on delete set null;

create table public.acts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  title text not null,
  sort_order integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (story_id, sort_order)
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  act_id uuid not null references public.acts (id) on delete cascade,
  title text not null,
  sort_order integer not null,
  word_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (act_id, sort_order)
);

create table public.scenes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  title text not null,
  label text not null default '',
  summary text not null default '',
  sort_order integer not null,
  word_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (chapter_id, sort_order)
);

create table public.scene_blocks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  scene_id uuid not null references public.scenes (id) on delete cascade,
  kind text not null default 'paragraph',
  content text not null default '',
  sort_order integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (scene_id, sort_order)
);

create table public.story_variables (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  key text not null,
  label text not null,
  value_type text not null,
  default_value jsonb not null default 'null'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (story_id, key)
);

create table public.choices (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  scene_id uuid not null references public.scenes (id) on delete cascade,
  to_scene_id uuid references public.scenes (id) on delete set null,
  label text not null,
  sort_order integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.choice_conditions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  choice_id uuid not null references public.choices (id) on delete cascade,
  variable_key text not null,
  equals_value jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.choice_effects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  choice_id uuid not null references public.choices (id) on delete cascade,
  variable_key text not null,
  set_to_value jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.world_bible_entries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  title text not null,
  kind text not null,
  summary text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.book_projects (
  story_id uuid primary key references public.stories (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  priority public.book_priority not null default 'secondary',
  active_phase public.book_phase not null default 'phase_1_foundation',
  target_format public.book_target_format not null default 'novel',
  target_length_words integer not null default 70000,
  master_brief jsonb not null default '{}'::jsonb,
  market_brief jsonb not null default '{}'::jsonb,
  amazon_ops jsonb not null default '{}'::jsonb,
  memory_last_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.book_writer_rules (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  sort_order integer not null,
  rule_text text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (story_id, sort_order)
);

create table public.book_canon_facts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  source_world_bible_entry_id uuid references public.world_bible_entries (id) on delete set null,
  title text not null,
  kind text not null,
  summary text not null,
  mention_count integer not null default 0,
  importance public.book_importance not null default 'low',
  status public.book_thread_status not null default 'watch',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.book_canon_fact_scene_refs (
  canon_fact_id uuid not null references public.book_canon_facts (id) on delete cascade,
  scene_id uuid not null references public.scenes (id) on delete cascade,
  primary key (canon_fact_id, scene_id)
);

create table public.book_character_states (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  world_bible_entry_id uuid references public.world_bible_entries (id) on delete set null,
  character_name text not null,
  current_state text not null,
  inner_shift text not null default '',
  agenda text not null default '',
  updated_from_scene_id uuid references public.scenes (id) on delete set null,
  state_updated_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.book_open_threads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  label text not null,
  detail text not null,
  source_scene_id uuid references public.scenes (id) on delete set null,
  status public.book_thread_status not null default 'active',
  priority public.book_importance not null default 'medium',
  payoff_scene_id uuid references public.scenes (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.book_scene_cards (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  scene_id uuid not null unique references public.scenes (id) on delete cascade,
  act_title text not null,
  chapter_title text not null,
  scene_title text not null,
  summary text not null default '',
  excerpt text not null default '',
  order_label text not null,
  chapter_goal text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.book_context_packs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  scene_id uuid not null references public.scenes (id) on delete cascade,
  stable_prefix_signature text not null,
  previous_scene_ids uuid[] not null default '{}'::uuid[],
  next_scene_id uuid references public.scenes (id) on delete set null,
  prepared_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (story_id, scene_id)
);

create table public.book_context_pack_canon_facts (
  context_pack_id uuid not null references public.book_context_packs (id) on delete cascade,
  canon_fact_id uuid not null references public.book_canon_facts (id) on delete cascade,
  sort_order integer not null default 1,
  primary key (context_pack_id, canon_fact_id)
);

create table public.book_context_pack_character_states (
  context_pack_id uuid not null references public.book_context_packs (id) on delete cascade,
  character_state_id uuid not null references public.book_character_states (id) on delete cascade,
  sort_order integer not null default 1,
  primary key (context_pack_id, character_state_id)
);

create table public.book_context_pack_threads (
  context_pack_id uuid not null references public.book_context_packs (id) on delete cascade,
  thread_id uuid not null references public.book_open_threads (id) on delete cascade,
  sort_order integer not null default 1,
  primary key (context_pack_id, thread_id)
);

create table public.book_draft_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.book_projects (story_id) on delete cascade,
  scene_id uuid not null references public.scenes (id) on delete cascade,
  context_pack_id uuid references public.book_context_packs (id) on delete set null,
  provider public.ai_provider not null,
  mode text not null default 'remote',
  model_name text,
  status public.book_job_status not null default 'ready',
  outline jsonb not null default '[]'::jsonb,
  draft_text text not null default '',
  rewrite_text text not null default '',
  rewrite_notes jsonb not null default '[]'::jsonb,
  extracted_state jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid references public.stories (id) on delete cascade,
  scene_id uuid references public.scenes (id) on delete set null,
  kind public.ai_run_kind not null,
  provider public.ai_provider not null,
  model_name text,
  status text not null default 'queued',
  prompt_fingerprint text,
  context_pack_id uuid references public.book_context_packs (id) on delete set null,
  request_payload jsonb not null default '{}'::jsonb,
  response_payload jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.ai_patches (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  scene_id uuid references public.scenes (id) on delete set null,
  ai_run_id uuid references public.ai_runs (id) on delete set null,
  patch_type text not null,
  status public.ai_patch_status not null default 'proposed',
  patch_payload jsonb not null default '{}'::jsonb,
  reviewer_notes text,
  created_by uuid references public.profiles (id) on delete set null,
  reviewed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.playtest_sessions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  reader_user_id uuid references public.profiles (id) on delete set null,
  session_state jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  story_id uuid not null references public.stories (id) on delete cascade,
  submitted_by uuid references public.profiles (id) on delete set null,
  status public.submission_status not null default 'draft',
  submission_payload jsonb not null default '{}'::jsonb,
  reviewer_summary text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.submission_reviews (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  submission_id uuid not null references public.submissions (id) on delete cascade,
  reviewer_user_id uuid references public.profiles (id) on delete set null,
  level public.review_level not null default 'info',
  title text not null,
  detail text not null,
  action_label text,
  action_target text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index stories_workspace_idx on public.stories (workspace_id, status);
create index story_versions_story_idx on public.story_versions (story_id, created_at desc);
create index acts_story_idx on public.acts (story_id, sort_order);
create index chapters_story_idx on public.chapters (story_id, act_id, sort_order);
create index scenes_story_idx on public.scenes (story_id, chapter_id, sort_order);
create index world_bible_entries_story_idx on public.world_bible_entries (story_id, kind);
create index book_canon_facts_story_idx on public.book_canon_facts (story_id, status, importance);
create index book_character_states_story_idx on public.book_character_states (story_id, updated_at desc);
create index book_open_threads_story_idx on public.book_open_threads (story_id, status, priority);
create index book_context_packs_story_idx on public.book_context_packs (story_id, scene_id);
create index book_draft_jobs_story_idx on public.book_draft_jobs (story_id, scene_id, status, updated_at desc);
create index ai_runs_story_idx on public.ai_runs (story_id, kind, created_at desc);
create index ai_patches_story_idx on public.ai_patches (story_id, status, created_at desc);
create index submissions_story_idx on public.submissions (story_id, status, created_at desc);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger workspaces_set_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

create trigger workspaces_after_insert_membership
after insert on public.workspaces
for each row execute function public.handle_workspace_created();

create trigger workspace_members_set_updated_at
before update on public.workspace_members
for each row execute function public.set_updated_at();

create trigger stories_set_updated_at
before update on public.stories
for each row execute function public.set_updated_at();

create trigger acts_set_updated_at
before update on public.acts
for each row execute function public.set_updated_at();

create trigger chapters_set_updated_at
before update on public.chapters
for each row execute function public.set_updated_at();

create trigger scenes_set_updated_at
before update on public.scenes
for each row execute function public.set_updated_at();

create trigger scene_blocks_set_updated_at
before update on public.scene_blocks
for each row execute function public.set_updated_at();

create trigger story_variables_set_updated_at
before update on public.story_variables
for each row execute function public.set_updated_at();

create trigger choices_set_updated_at
before update on public.choices
for each row execute function public.set_updated_at();

create trigger world_bible_entries_set_updated_at
before update on public.world_bible_entries
for each row execute function public.set_updated_at();

create trigger book_projects_set_updated_at
before update on public.book_projects
for each row execute function public.set_updated_at();

create trigger book_writer_rules_set_updated_at
before update on public.book_writer_rules
for each row execute function public.set_updated_at();

create trigger book_canon_facts_set_updated_at
before update on public.book_canon_facts
for each row execute function public.set_updated_at();

create trigger book_character_states_set_updated_at
before update on public.book_character_states
for each row execute function public.set_updated_at();

create trigger book_open_threads_set_updated_at
before update on public.book_open_threads
for each row execute function public.set_updated_at();

create trigger book_scene_cards_set_updated_at
before update on public.book_scene_cards
for each row execute function public.set_updated_at();

create trigger book_context_packs_set_updated_at
before update on public.book_context_packs
for each row execute function public.set_updated_at();

create trigger book_draft_jobs_set_updated_at
before update on public.book_draft_jobs
for each row execute function public.set_updated_at();

create trigger ai_runs_set_updated_at
before update on public.ai_runs
for each row execute function public.set_updated_at();

create trigger ai_patches_set_updated_at
before update on public.ai_patches
for each row execute function public.set_updated_at();

create trigger playtest_sessions_set_updated_at
before update on public.playtest_sessions
for each row execute function public.set_updated_at();

create trigger submissions_set_updated_at
before update on public.submissions
for each row execute function public.set_updated_at();

create trigger submission_reviews_set_updated_at
before update on public.submission_reviews
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.stories enable row level security;
alter table public.story_versions enable row level security;
alter table public.acts enable row level security;
alter table public.chapters enable row level security;
alter table public.scenes enable row level security;
alter table public.scene_blocks enable row level security;
alter table public.story_variables enable row level security;
alter table public.choices enable row level security;
alter table public.choice_conditions enable row level security;
alter table public.choice_effects enable row level security;
alter table public.world_bible_entries enable row level security;
alter table public.book_projects enable row level security;
alter table public.book_writer_rules enable row level security;
alter table public.book_canon_facts enable row level security;
alter table public.book_canon_fact_scene_refs enable row level security;
alter table public.book_character_states enable row level security;
alter table public.book_open_threads enable row level security;
alter table public.book_scene_cards enable row level security;
alter table public.book_context_packs enable row level security;
alter table public.book_context_pack_canon_facts enable row level security;
alter table public.book_context_pack_character_states enable row level security;
alter table public.book_context_pack_threads enable row level security;
alter table public.book_draft_jobs enable row level security;
alter table public.ai_runs enable row level security;
alter table public.ai_patches enable row level security;
alter table public.playtest_sessions enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_reviews enable row level security;

create policy "profiles_select_self" on public.profiles
for select using (id = auth.uid());
create policy "profiles_update_self" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_insert_self" on public.profiles
for insert with check (id = auth.uid());

create policy "workspaces_read_members" on public.workspaces
for select using (public.can_read_workspace(id));
create policy "workspaces_insert_owner" on public.workspaces
for insert with check (owner_user_id = auth.uid());
create policy "workspaces_update_owner" on public.workspaces
for update using (public.can_manage_workspace(id))
with check (public.can_manage_workspace(id));
create policy "workspaces_delete_owner" on public.workspaces
for delete using (public.can_manage_workspace(id));

create policy "workspace_members_read_members" on public.workspace_members
for select using (public.can_read_workspace(workspace_id));
create policy "workspace_members_manage_owner" on public.workspace_members
for all using (public.can_manage_workspace(workspace_id))
with check (public.can_manage_workspace(workspace_id));

create policy "stories_read_members" on public.stories
for select using (public.can_read_workspace(workspace_id));
create policy "stories_write_editors" on public.stories
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "story_versions_read_members" on public.story_versions
for select using (public.can_read_workspace(workspace_id));
create policy "story_versions_write_editors" on public.story_versions
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "acts_read_members" on public.acts
for select using (public.can_read_workspace(workspace_id));
create policy "acts_write_editors" on public.acts
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "chapters_read_members" on public.chapters
for select using (public.can_read_workspace(workspace_id));
create policy "chapters_write_editors" on public.chapters
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "scenes_read_members" on public.scenes
for select using (public.can_read_workspace(workspace_id));
create policy "scenes_write_editors" on public.scenes
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "scene_blocks_read_members" on public.scene_blocks
for select using (public.can_read_workspace(workspace_id));
create policy "scene_blocks_write_editors" on public.scene_blocks
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "story_variables_read_members" on public.story_variables
for select using (public.can_read_workspace(workspace_id));
create policy "story_variables_write_editors" on public.story_variables
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "choices_read_members" on public.choices
for select using (public.can_read_workspace(workspace_id));
create policy "choices_write_editors" on public.choices
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "choice_conditions_read_members" on public.choice_conditions
for select using (public.can_read_workspace(workspace_id));
create policy "choice_conditions_write_editors" on public.choice_conditions
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "choice_effects_read_members" on public.choice_effects
for select using (public.can_read_workspace(workspace_id));
create policy "choice_effects_write_editors" on public.choice_effects
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "world_bible_entries_read_members" on public.world_bible_entries
for select using (public.can_read_workspace(workspace_id));
create policy "world_bible_entries_write_editors" on public.world_bible_entries
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "book_projects_read_members" on public.book_projects
for select using (public.can_read_workspace(workspace_id));
create policy "book_projects_write_editors" on public.book_projects
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "book_writer_rules_read_members" on public.book_writer_rules
for select using (public.can_read_workspace(workspace_id));
create policy "book_writer_rules_write_editors" on public.book_writer_rules
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "book_canon_facts_read_members" on public.book_canon_facts
for select using (public.can_read_workspace(workspace_id));
create policy "book_canon_facts_write_editors" on public.book_canon_facts
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "book_canon_fact_scene_refs_read_members" on public.book_canon_fact_scene_refs
for select using (
  exists (
    select 1
    from public.book_canon_facts canon_fact
    where canon_fact.id = canon_fact_id
      and public.can_read_workspace(canon_fact.workspace_id)
  )
);
create policy "book_canon_fact_scene_refs_write_editors" on public.book_canon_fact_scene_refs
for all using (
  exists (
    select 1
    from public.book_canon_facts canon_fact
    where canon_fact.id = canon_fact_id
      and public.can_edit_workspace(canon_fact.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.book_canon_facts canon_fact
    where canon_fact.id = canon_fact_id
      and public.can_edit_workspace(canon_fact.workspace_id)
  )
);

create policy "book_character_states_read_members" on public.book_character_states
for select using (public.can_read_workspace(workspace_id));
create policy "book_character_states_write_editors" on public.book_character_states
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "book_open_threads_read_members" on public.book_open_threads
for select using (public.can_read_workspace(workspace_id));
create policy "book_open_threads_write_editors" on public.book_open_threads
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "book_scene_cards_read_members" on public.book_scene_cards
for select using (public.can_read_workspace(workspace_id));
create policy "book_scene_cards_write_editors" on public.book_scene_cards
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "book_context_packs_read_members" on public.book_context_packs
for select using (public.can_read_workspace(workspace_id));
create policy "book_context_packs_write_editors" on public.book_context_packs
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "book_context_pack_canon_facts_read_members" on public.book_context_pack_canon_facts
for select using (
  exists (
    select 1
    from public.book_context_packs context_pack
    where context_pack.id = context_pack_id
      and public.can_read_workspace(context_pack.workspace_id)
  )
);
create policy "book_context_pack_canon_facts_write_editors" on public.book_context_pack_canon_facts
for all using (
  exists (
    select 1
    from public.book_context_packs context_pack
    where context_pack.id = context_pack_id
      and public.can_edit_workspace(context_pack.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.book_context_packs context_pack
    where context_pack.id = context_pack_id
      and public.can_edit_workspace(context_pack.workspace_id)
  )
);

create policy "book_context_pack_character_states_read_members" on public.book_context_pack_character_states
for select using (
  exists (
    select 1
    from public.book_context_packs context_pack
    where context_pack.id = context_pack_id
      and public.can_read_workspace(context_pack.workspace_id)
  )
);
create policy "book_context_pack_character_states_write_editors" on public.book_context_pack_character_states
for all using (
  exists (
    select 1
    from public.book_context_packs context_pack
    where context_pack.id = context_pack_id
      and public.can_edit_workspace(context_pack.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.book_context_packs context_pack
    where context_pack.id = context_pack_id
      and public.can_edit_workspace(context_pack.workspace_id)
  )
);

create policy "book_context_pack_threads_read_members" on public.book_context_pack_threads
for select using (
  exists (
    select 1
    from public.book_context_packs context_pack
    where context_pack.id = context_pack_id
      and public.can_read_workspace(context_pack.workspace_id)
  )
);
create policy "book_context_pack_threads_write_editors" on public.book_context_pack_threads
for all using (
  exists (
    select 1
    from public.book_context_packs context_pack
    where context_pack.id = context_pack_id
      and public.can_edit_workspace(context_pack.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.book_context_packs context_pack
    where context_pack.id = context_pack_id
      and public.can_edit_workspace(context_pack.workspace_id)
  )
);

create policy "book_draft_jobs_read_members" on public.book_draft_jobs
for select using (public.can_read_workspace(workspace_id));
create policy "book_draft_jobs_write_editors" on public.book_draft_jobs
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "ai_runs_read_members" on public.ai_runs
for select using (public.can_read_workspace(workspace_id));
create policy "ai_runs_write_editors" on public.ai_runs
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "ai_patches_read_members" on public.ai_patches
for select using (public.can_read_workspace(workspace_id));
create policy "ai_patches_write_editors" on public.ai_patches
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "playtest_sessions_read_members" on public.playtest_sessions
for select using (public.can_read_workspace(workspace_id));
create policy "playtest_sessions_write_editors" on public.playtest_sessions
for all using (public.can_edit_workspace(workspace_id))
with check (public.can_edit_workspace(workspace_id));

create policy "submissions_read_members" on public.submissions
for select using (public.can_read_workspace(workspace_id));
create policy "submissions_write_editors" on public.submissions
for insert with check (public.can_edit_workspace(workspace_id));
create policy "submissions_update_editors_reviewers" on public.submissions
for update using (
  public.can_edit_workspace(workspace_id) or public.can_review_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id) or public.can_review_workspace(workspace_id)
);

create policy "submission_reviews_read_members" on public.submission_reviews
for select using (
  exists (
    select 1
    from public.submissions submission
    where submission.id = submission_id
      and public.can_read_workspace(submission.workspace_id)
  )
);
create policy "submission_reviews_write_reviewers" on public.submission_reviews
for all using (
  exists (
    select 1
    from public.submissions submission
    where submission.id = submission_id
      and public.can_review_workspace(submission.workspace_id)
  )
)
with check (
  exists (
    select 1
    from public.submissions submission
    where submission.id = submission_id
      and public.can_review_workspace(submission.workspace_id)
  )
);
