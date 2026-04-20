alter table public.book_scene_cards
add column if not exists outline jsonb not null default '[]'::jsonb;
