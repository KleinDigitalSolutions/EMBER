alter table public.book_projects
add column if not exists master_brief_runtime jsonb not null default '{}'::jsonb,
add column if not exists writer_rules_runtime jsonb not null default '{}'::jsonb,
add column if not exists threat_model jsonb not null default '{}'::jsonb;

alter table public.book_canon_facts
add column if not exists pipeline_meta jsonb not null default '{}'::jsonb;

alter table public.book_character_states
add column if not exists pipeline_meta jsonb not null default '{}'::jsonb;

alter table public.book_scene_cards
add column if not exists pipeline_meta jsonb not null default '{}'::jsonb;

alter table public.book_context_packs
add column if not exists runtime_context jsonb not null default '{}'::jsonb;
