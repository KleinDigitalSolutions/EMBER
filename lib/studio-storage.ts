import type { StoryDocument } from "@/lib/story-schema";

export const STUDIO_DRAFT_STORAGE_VERSION = 1;

export type StudioDraftSnapshot = {
  version: number;
  savedAt: string;
  draftStory: StoryDocument;
  selectedSceneId: string;
  authorMode: string;
  viewMode: string;
};

export function getStudioDraftStorageKey(storyId: string) {
  return `ember-studio-draft-v${STUDIO_DRAFT_STORAGE_VERSION}:${storyId}`;
}

export function loadStudioDraft(storyId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getStudioDraftStorageKey(storyId));

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StudioDraftSnapshot>;

    if (
      parsed.version !== STUDIO_DRAFT_STORAGE_VERSION ||
      !parsed.draftStory ||
      typeof parsed.selectedSceneId !== "string" ||
      typeof parsed.authorMode !== "string" ||
      typeof parsed.viewMode !== "string" ||
      typeof parsed.savedAt !== "string"
    ) {
      return null;
    }

    return parsed as StudioDraftSnapshot;
  } catch {
    return null;
  }
}

export function saveStudioDraft(
  storyId: string,
  snapshot: Omit<StudioDraftSnapshot, "version" | "savedAt">
) {
  if (typeof window === "undefined") {
    return null;
  }

  const payload: StudioDraftSnapshot = {
    version: STUDIO_DRAFT_STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    ...snapshot
  };

  window.localStorage.setItem(
    getStudioDraftStorageKey(storyId),
    JSON.stringify(payload)
  );

  return payload;
}
