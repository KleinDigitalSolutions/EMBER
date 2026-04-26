do $$
begin
  if exists (
    select 1
    from pg_type
    where typnamespace = 'public'::regnamespace
      and typname = 'ai_provider_v2'
  ) then
    drop type public.ai_provider_v2;
  end if;

  update public.book_draft_jobs
  set provider = 'local'
  where provider::text not in ('openai', 'anthropic', 'local');

  update public.ai_runs
  set provider = 'local'
  where provider::text not in ('openai', 'anthropic', 'local');

  update public.book_quality_evals
  set provider = 'local'
  where provider::text not in ('openai', 'anthropic', 'local');

  create type public.ai_provider_v2 as enum ('openai', 'anthropic', 'local');

  alter table public.book_draft_jobs
    alter column provider type public.ai_provider_v2
    using provider::text::public.ai_provider_v2;

  alter table public.ai_runs
    alter column provider type public.ai_provider_v2
    using provider::text::public.ai_provider_v2;

  alter table public.book_quality_evals
    alter column provider type public.ai_provider_v2
    using provider::text::public.ai_provider_v2;

  alter type public.ai_provider rename to ai_provider_old;
  alter type public.ai_provider_v2 rename to ai_provider;
  drop type public.ai_provider_old;
end $$;
