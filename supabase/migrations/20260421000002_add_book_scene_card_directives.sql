alter table public.book_scene_cards
add column if not exists directives jsonb not null default '{}'::jsonb;
