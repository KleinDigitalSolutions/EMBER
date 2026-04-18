# Supabase Backbone

This folder contains the first production-grade database backbone for EMBER.

## Scope

The initial migration models:

- workspaces and membership roles
- stories, acts, chapters, scenes, blocks, choices, and variables
- story versions and world bible entries
- book-specific artifacts such as canon facts, character states, open threads, scene cards, and context packs
- draft jobs, AI runs, AI patches, playtest sessions, submissions, and review records

## Design Notes

- `workspace_id` is present on high-churn child tables on purpose.
  This keeps RLS policies simple, explicit, and performant.
- Book memory artifacts are stored as first-class tables rather than one opaque JSON column.
  This matches the product architecture: the database is the memory system, not the chat session.
- The schema is designed for Supabase Postgres and assumes `auth.users` exists.

## Next Steps

- Apply the migration to a real Supabase project.
- Generate typed database bindings for the app layer.
- Replace local-only storage flows with server persistence and version snapshots.
- Add background job execution and audit logging on top of the `ai_runs` and `book_draft_jobs` tables.
