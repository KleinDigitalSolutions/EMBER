#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env.local}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Env file not found: $ENV_FILE" >&2
  exit 1
fi

cd "$ROOT_DIR"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ "$#" -gt 0 ]]; then
  TARGET_ENVIRONMENTS=("$@")
else
  TARGET_ENVIRONMENTS=(production development)
fi

PREVIEW_GIT_BRANCH="${PREVIEW_GIT_BRANCH:-}"
ENV_NAMES=(
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  OPENAI_API_KEY
  OPENAI_BOOK_MODEL
  ANTHROPIC_API_KEY
  ANTHROPIC_BOOK_MODEL
  ANTHROPIC_CONTINUITY_MODEL
)

for target in "${TARGET_ENVIRONMENTS[@]}"; do
  if [[ "$target" == "preview" && -z "$PREVIEW_GIT_BRANCH" ]]; then
    echo "Skipping preview target: set PREVIEW_GIT_BRANCH to sync preview envs."
    continue
  fi

  echo "Syncing Vercel env target: $target"

  for env_name in "${ENV_NAMES[@]}"; do
    env_value="${!env_name-}"

    if [[ -z "${env_value}" ]]; then
      echo "  - skip ${env_name} (empty)"
      continue
    fi

    echo "  - push ${env_name}"
    if [[ "$target" == "preview" ]]; then
      npx vercel env add "$env_name" "$target" "$PREVIEW_GIT_BRANCH" --force --yes --sensitive --value "$env_value" >/dev/null
    else
      npx vercel env add "$env_name" "$target" --force --yes --sensitive --value "$env_value" >/dev/null
    fi
  done
done

echo "Vercel env sync complete."
