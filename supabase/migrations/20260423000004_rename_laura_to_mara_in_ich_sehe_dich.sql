create or replace function public.replace_ich_sehe_dich_laura(input_text text)
returns text
language sql
immutable
as $$
  select replace(input_text, 'Laura', 'Mara');
$$;

create or replace function public.replace_ich_sehe_dich_laura(input_json jsonb)
returns jsonb
language sql
immutable
as $$
  select public.replace_ich_sehe_dich_laura(input_json::text)::jsonb;
$$;

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.stories
set
  meta = public.replace_ich_sehe_dich_laura(meta),
  updated_at = timezone('utc', now())
where id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.story_versions
set snapshot = public.replace_ich_sehe_dich_laura(snapshot)
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.acts
set title = public.replace_ich_sehe_dich_laura(title)
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.chapters
set title = public.replace_ich_sehe_dich_laura(title)
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.scenes
set
  title = public.replace_ich_sehe_dich_laura(title),
  label = public.replace_ich_sehe_dich_laura(label),
  summary = public.replace_ich_sehe_dich_laura(summary),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.scene_blocks
set
  content = public.replace_ich_sehe_dich_laura(content),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.world_bible_entries
set
  title = public.replace_ich_sehe_dich_laura(title),
  summary = public.replace_ich_sehe_dich_laura(summary),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.book_projects
set
  master_brief = public.replace_ich_sehe_dich_laura(master_brief),
  market_brief = public.replace_ich_sehe_dich_laura(market_brief),
  amazon_ops = public.replace_ich_sehe_dich_laura(amazon_ops),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.book_writer_rules
set
  rule_text = public.replace_ich_sehe_dich_laura(rule_text),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.book_canon_facts
set
  title = public.replace_ich_sehe_dich_laura(title),
  summary = public.replace_ich_sehe_dich_laura(summary),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.book_character_states
set
  character_name = public.replace_ich_sehe_dich_laura(character_name),
  current_state = public.replace_ich_sehe_dich_laura(current_state),
  inner_shift = public.replace_ich_sehe_dich_laura(inner_shift),
  agenda = public.replace_ich_sehe_dich_laura(agenda),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.book_open_threads
set
  label = public.replace_ich_sehe_dich_laura(label),
  detail = public.replace_ich_sehe_dich_laura(detail),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.book_scene_cards
set
  act_title = public.replace_ich_sehe_dich_laura(act_title),
  chapter_title = public.replace_ich_sehe_dich_laura(chapter_title),
  scene_title = public.replace_ich_sehe_dich_laura(scene_title),
  summary = public.replace_ich_sehe_dich_laura(summary),
  excerpt = public.replace_ich_sehe_dich_laura(excerpt),
  order_label = public.replace_ich_sehe_dich_laura(order_label),
  chapter_goal = public.replace_ich_sehe_dich_laura(chapter_goal),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.book_draft_jobs
set
  outline = public.replace_ich_sehe_dich_laura(outline),
  draft_text = public.replace_ich_sehe_dich_laura(draft_text),
  rewrite_text = public.replace_ich_sehe_dich_laura(rewrite_text),
  rewrite_notes = public.replace_ich_sehe_dich_laura(rewrite_notes),
  extracted_state = public.replace_ich_sehe_dich_laura(extracted_state),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.ai_runs
set
  request_payload = public.replace_ich_sehe_dich_laura(request_payload),
  response_payload = public.replace_ich_sehe_dich_laura(response_payload),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

with target_story as (
  select id
  from public.stories
  where title = 'Ich sehe dich'
)
update public.ai_patches
set
  patch_payload = public.replace_ich_sehe_dich_laura(patch_payload),
  reviewer_notes = public.replace_ich_sehe_dich_laura(reviewer_notes),
  updated_at = timezone('utc', now())
where story_id in (select id from target_story);

drop function public.replace_ich_sehe_dich_laura(text);
drop function public.replace_ich_sehe_dich_laura(jsonb);
