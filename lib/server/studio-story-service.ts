import { createFallbackDraftStageRuns, syncStoryBookArtifacts } from "@/lib/book-engine"
import {
  createDefaultBookBlueprint,
  createEmptyStoryDocument,
  createDefaultAssistantWorkspace,
  normalizeBookSceneCardDirectives,
  normalizeBookRuleList,
  normalizeAssistantWorkspace,
  type BookDraftJob,
  type BookDraftStageRun,
  type BookDraftStageRuns,
  type StoryDocument,
  type StoryLibraryEntry,
  type StoryVariable,
  type WorldBibleEntry
} from "@/lib/story-schema"
import { supabaseAdmin } from "@/lib/supabase/server"
import { createUuid } from "@/lib/id"

type Row = Record<string, any>

export async function listStudioStories() {
  const result = await supabaseAdmin
    .from("stories")
    .select("id, workspace_id, title, author_name, status, mode, created_at, updated_at")
    .order("updated_at", { ascending: false })

  assertNoError("stories list", result.error)

  return (result.data ?? []).map(mapStoryLibraryEntry)
}

export async function createStudioStory(workspaceId?: string | null) {
  const nextWorkspaceId = workspaceId ?? (await ensureBootstrapWorkspace()).id
  const nextStory = createEmptyStoryDocument(createUuid(), nextWorkspaceId, "Neues Projekt")

  await saveStudioStory(nextStory)

  const storyRow = await loadStoryRow(nextStory.id)

  if (!storyRow) {
    throw new Error(`Story ${nextStory.id} could not be reloaded after creation.`)
  }

  return {
    storyId: nextStory.id,
    summary: mapStoryLibraryEntry(storyRow)
  }
}

export async function deleteStudioStory(storyId: string) {
  const result = await supabaseAdmin.from("stories").delete().eq("id", storyId)
  assertNoError("stories delete", result.error)
}

export async function loadStudioStory(preferredStoryId?: string | null) {
  let storyRow = await loadStoryRow(preferredStoryId)

  if (!storyRow && preferredStoryId) {
    storyRow = await loadStoryRow(null)
  }

  if (!storyRow) {
    return ensureBootstrapStory()
  }

  const storyId = storyRow.id as string
  const workspaceId = storyRow.workspace_id as string

  const [
    actsResult,
    chaptersResult,
    scenesResult,
    blocksResult,
    variablesResult,
    choicesResult,
    choiceConditionsResult,
    choiceEffectsResult,
    worldBibleResult,
    bookProjectResult,
    writerRulesResult,
    canonFactsResult,
    characterStatesResult,
    characterStateSnapshotsResult,
    openThreadsResult,
    sceneCardsResult,
    contextPacksResult,
    draftJobsResult
  ] = await Promise.all([
    supabaseAdmin.from("acts").select("*").eq("story_id", storyId).order("sort_order"),
    supabaseAdmin.from("chapters").select("*").eq("story_id", storyId).order("sort_order"),
    supabaseAdmin.from("scenes").select("*").eq("story_id", storyId).order("sort_order"),
    supabaseAdmin.from("scene_blocks").select("*").eq("story_id", storyId).order("sort_order"),
    supabaseAdmin.from("story_variables").select("*").eq("story_id", storyId).order("created_at"),
    supabaseAdmin.from("choices").select("*").eq("story_id", storyId).order("sort_order"),
    supabaseAdmin.from("choice_conditions").select("*").eq("story_id", storyId).order("created_at"),
    supabaseAdmin.from("choice_effects").select("*").eq("story_id", storyId).order("created_at"),
    supabaseAdmin.from("world_bible_entries").select("*").eq("story_id", storyId).order("created_at"),
    supabaseAdmin.from("book_projects").select("*").eq("story_id", storyId).maybeSingle(),
    supabaseAdmin.from("book_writer_rules").select("*").eq("story_id", storyId).order("sort_order"),
    supabaseAdmin.from("book_canon_facts").select("*").eq("story_id", storyId).order("created_at"),
    supabaseAdmin
      .from("book_character_states")
      .select("*")
      .eq("story_id", storyId)
      .order("created_at"),
    supabaseAdmin
      .from("book_character_state_snapshots")
      .select("*")
      .eq("story_id", storyId)
      .order("sort_order"),
    supabaseAdmin.from("book_open_threads").select("*").eq("story_id", storyId).order("created_at"),
    supabaseAdmin.from("book_scene_cards").select("*").eq("story_id", storyId).order("created_at"),
    supabaseAdmin.from("book_context_packs").select("*").eq("story_id", storyId).order("created_at"),
    supabaseAdmin.from("book_draft_jobs").select("*").eq("story_id", storyId).order("updated_at", {
      ascending: false
    })
  ])

  assertNoError("acts", actsResult.error)
  assertNoError("chapters", chaptersResult.error)
  assertNoError("scenes", scenesResult.error)
  assertNoError("scene_blocks", blocksResult.error)
  assertNoError("story_variables", variablesResult.error)
  assertNoError("choices", choicesResult.error)
  assertNoError("choice_conditions", choiceConditionsResult.error)
  assertNoError("choice_effects", choiceEffectsResult.error)
  assertNoError("world_bible_entries", worldBibleResult.error)
  assertNoError("book_projects", bookProjectResult.error)
  assertNoError("book_writer_rules", writerRulesResult.error)
  assertNoError("book_canon_facts", canonFactsResult.error)
  assertNoError("book_character_states", characterStatesResult.error)
  assertNoError("book_character_state_snapshots", characterStateSnapshotsResult.error)
  assertNoError("book_open_threads", openThreadsResult.error)
  assertNoError("book_scene_cards", sceneCardsResult.error)
  assertNoError("book_context_packs", contextPacksResult.error)
  assertNoError("book_draft_jobs", draftJobsResult.error)

  const canonFacts = canonFactsResult.data ?? []
  const contextPacks = contextPacksResult.data ?? []

  const [
    canonSceneRefsRows,
    contextPackCanonFactRows,
    contextPackCharacterStateRows,
    contextPackThreadRows
  ] = await Promise.all([
    loadRowsByIds("book_canon_fact_scene_refs", "canon_fact_id", canonFacts.map(function (row) {
      return row.id
    })),
    loadRowsByIds(
      "book_context_pack_canon_facts",
      "context_pack_id",
      contextPacks.map(function (row) {
        return row.id
      })
    ),
    loadRowsByIds(
      "book_context_pack_character_states",
      "context_pack_id",
      contextPacks.map(function (row) {
        return row.id
      })
    ),
    loadRowsByIds(
      "book_context_pack_threads",
      "context_pack_id",
      contextPacks.map(function (row) {
        return row.id
      })
    )
  ])

  const sceneRows = scenesResult.data ?? []
  const chapterRows = chaptersResult.data ?? []
  const sceneMap = new Map<string, Row>(
    sceneRows.map(function (row) {
      return [row.id as string, row]
    })
  )
  const chapterMap = new Map<string, Row>(
    chapterRows.map(function (row) {
      return [row.id as string, row]
    })
  )
  const sceneCardMap = new Map<string, Row>(
    (sceneCardsResult.data ?? []).map(function (row) {
      return [row.scene_id as string, row]
    })
  )
  const canonFactMap = new Map<string, Row>(
    canonFacts.map(function (row) {
      return [row.id as string, row]
    })
  )
  const characterStateMap = new Map<string, Row>(
    (characterStatesResult.data ?? []).map(function (row) {
      return [row.id as string, row]
    })
  )
  const threadMap = new Map<string, Row>(
    (openThreadsResult.data ?? []).map(function (row) {
      return [row.id as string, row]
    })
  )

  const choiceConditionsByChoiceId = groupRows(choiceConditionsResult.data ?? [], "choice_id")
  const choiceEffectsByChoiceId = groupRows(choiceEffectsResult.data ?? [], "choice_id")
  const blocksBySceneId = groupRows(blocksResult.data ?? [], "scene_id")
  const choicesBySceneId = groupRows(choicesResult.data ?? [], "scene_id")
  const scenesByChapterId = groupRows(sceneRows, "chapter_id")
  const chaptersByActId = groupRows(chapterRows, "act_id")
  const canonSceneRefsByFactId = groupRows(canonSceneRefsRows, "canon_fact_id")
  const contextPackCanonFactsByPackId = groupRows(contextPackCanonFactRows, "context_pack_id")
  const contextPackCharacterStatesByPackId = groupRows(
    contextPackCharacterStateRows,
    "context_pack_id"
  )
  const contextPackThreadsByPackId = groupRows(contextPackThreadRows, "context_pack_id")
  const characterStateSnapshotsByStateId = groupRows(
    characterStateSnapshotsResult.data ?? [],
    "character_state_id"
  )

  const acts = (actsResult.data ?? []).map(function (actRow) {
    const chapters = (chaptersByActId.get(actRow.id as string) ?? []).map(function (chapterRow) {
      const scenes = (scenesByChapterId.get(chapterRow.id as string) ?? []).map(function (sceneRow) {
        const choices = (choicesBySceneId.get(sceneRow.id as string) ?? []).map(function (choiceRow) {
          return {
            id: choiceRow.id as string,
            label: (choiceRow.label as string) ?? "",
            toSceneId: (choiceRow.to_scene_id as string) ?? (sceneRow.id as string),
            conditions: (choiceConditionsByChoiceId.get(choiceRow.id as string) ?? []).map(
              function (conditionRow) {
                return {
                  variableKey: (conditionRow.variable_key as string) ?? "",
                  equals: normalizeStoryValue(conditionRow.equals_value)
                }
              }
            ),
            effects: (choiceEffectsByChoiceId.get(choiceRow.id as string) ?? []).map(function (
              effectRow
            ) {
              return {
                variableKey: (effectRow.variable_key as string) ?? "",
                setTo: normalizeStoryValue(effectRow.set_to_value)
              }
            })
          }
        })

        return {
          id: sceneRow.id as string,
          chapterId: sceneRow.chapter_id as string,
          title: (sceneRow.title as string) ?? "",
          order: toNumber(sceneRow.sort_order, 1),
          label: (sceneRow.label as string) ?? "",
          summary: (sceneRow.summary as string) ?? "",
          wordCount: toNumber(sceneRow.word_count, 0),
          blocks: (blocksBySceneId.get(sceneRow.id as string) ?? []).map(function (blockRow) {
            return {
              id: blockRow.id as string,
              kind: "paragraph" as const,
              text: (blockRow.content as string) ?? ""
            }
          }),
          choices
        }
      })

      return {
        id: chapterRow.id as string,
        actId: chapterRow.act_id as string,
        title: (chapterRow.title as string) ?? "",
        order: toNumber(chapterRow.sort_order, 1),
        scenes,
        wordCount: toNumber(chapterRow.word_count, 0)
      }
    })

    return {
      id: actRow.id as string,
      title: (actRow.title as string) ?? "",
      order: toNumber(actRow.sort_order, 1),
      chapters
    }
  })

  const fallbackBook = createDefaultBookBlueprint((storyRow.title as string) ?? "Untitled Book")
  const storyMeta = toRecord(storyRow.meta)
  const draftEngineMeta = toRecord(storyMeta.draftEngine)

  const bookProject = bookProjectResult.data
  const memoryLastSyncedAt =
    typeof bookProject?.memory_last_synced_at === "string" ? bookProject.memory_last_synced_at : null

  const book: StoryDocument["book"] = bookProject
    ? {
        priority:
          bookProject.priority === "secondary"
            ? ("secondary" as const)
            : ("primary" as const),
        activePhase: normalizeBookPhase(bookProject.active_phase),
        targetFormat: normalizeTargetFormat(bookProject.target_format),
        targetLengthWords: toNumber(bookProject.target_length_words, fallbackBook.targetLengthWords),
        masterBrief: normalizeMasterBrief(bookProject.master_brief, fallbackBook.masterBrief),
        marketBrief: normalizeMarketBrief(bookProject.market_brief, fallbackBook.marketBrief),
        writerConstitution:
          normalizeBookRuleList(
            (writerRulesResult.data ?? []).map(function (row) {
              return (row.rule_text as string) ?? ""
            }),
            fallbackBook.writerConstitution
          ),
        memory: {
          lastSyncedAt: memoryLastSyncedAt,
          canonLedger: canonFacts.map(function (row) {
            return {
              entryId: row.id as string,
              title: (row.title as string) ?? "",
              kind: normalizeCanonKind(row.kind),
              summary: (row.summary as string) ?? "",
              mentionCount: toNumber(row.mention_count, 0),
              sceneIds: (canonSceneRefsByFactId.get(row.id as string) ?? []).map(function (refRow) {
                return refRow.scene_id as string
              }),
              importance: normalizeImportance(row.importance),
              status: normalizeThreadStatus(row.status)
            }
          }),
          characterLedger: (characterStatesResult.data ?? []).map(function (row) {
            return {
              id: row.id as string,
              characterEntryId: (row.world_bible_entry_id as string) ?? "",
              characterName: (row.character_name as string) ?? "",
              currentState: (row.current_state as string) ?? "",
              innerShift: (row.inner_shift as string) ?? "",
              agenda: (row.agenda as string) ?? "",
              updatedFromSceneId: (row.updated_from_scene_id as string) ?? "",
              updatedAt: (row.state_updated_at as string) ?? row.updated_at ?? memoryLastSyncedAt ?? "",
              snapshots: (characterStateSnapshotsByStateId.get(row.id as string) ?? []).map(function (
                snapshotRow
              ) {
                return {
                  id: snapshotRow.id as string,
                  scope: normalizeCharacterStateSnapshotScope(snapshotRow.scope),
                  sortOrder: toNumber(snapshotRow.sort_order, 1),
                  sourceSceneId: (snapshotRow.source_scene_id as string) ?? null,
                  sourceChapterId: (snapshotRow.source_chapter_id as string) ?? null,
                  sourceLabel: (snapshotRow.source_label as string) ?? "",
                  currentState: (snapshotRow.current_state as string) ?? "",
                  innerShift: (snapshotRow.inner_shift as string) ?? "",
                  agenda: (snapshotRow.agenda as string) ?? "",
                  capturedAt:
                    (snapshotRow.captured_at as string) ??
                    (snapshotRow.updated_at as string) ??
                    memoryLastSyncedAt ??
                    ""
                }
              })
            }
          }),
          openThreads: (openThreadsResult.data ?? []).map(function (row) {
            const sourceScene = sceneMap.get((row.source_scene_id as string) ?? "")

            return {
              id: row.id as string,
              label: (row.label as string) ?? "",
              detail: (row.detail as string) ?? "",
              sourceSceneId: (row.source_scene_id as string) ?? "",
              sourceSceneTitle: (sourceScene?.title as string) ?? "",
              status: normalizeThreadStatus(row.status),
              priority: normalizeImportance(row.priority),
              payoffSceneId: (row.payoff_scene_id as string) ?? null
            }
          }),
          sceneCards: (sceneCardsResult.data ?? []).map(function (row) {
            return {
              sceneId: row.scene_id as string,
              sceneTitle: (row.scene_title as string) ?? "",
              actTitle: (row.act_title as string) ?? "",
              chapterTitle: (row.chapter_title as string) ?? "",
              summary: (row.summary as string) ?? "",
              excerpt: (row.excerpt as string) ?? "",
              orderLabel: (row.order_label as string) ?? "",
              chapterGoal: (row.chapter_goal as string) ?? "",
              directives: normalizeBookSceneCardDirectives(row.directives),
              outline: normalizeStringArray(row.outline)
            }
          }),
          contextPacks: contextPacks.map(function (row) {
            return {
              id: row.id as string,
              sceneId: row.scene_id as string,
              preparedAt: (row.prepared_at as string) ?? "",
              stablePrefixSignature: (row.stable_prefix_signature as string) ?? "",
              previousSceneIds: Array.isArray(row.previous_scene_ids) ? row.previous_scene_ids : [],
              nextSceneId: (row.next_scene_id as string) ?? null,
              relevantCanonEntryIds: (contextPackCanonFactsByPackId.get(row.id as string) ?? [])
                .map(function (linkRow) {
                  return canonFactMap.get(linkRow.canon_fact_id as string)?.id as string
                })
                .filter(Boolean),
              relevantCharacterStateIds: (
                contextPackCharacterStatesByPackId.get(row.id as string) ?? []
              )
                .map(function (linkRow) {
                  return characterStateMap.get(linkRow.character_state_id as string)?.id as string
                })
                .filter(Boolean),
              activeThreadIds: (contextPackThreadsByPackId.get(row.id as string) ?? [])
                .map(function (linkRow) {
                  return threadMap.get(linkRow.thread_id as string)?.id as string
                })
                .filter(Boolean)
            }
          }),
          continuityNotes: []
        },
        draftEngine: {
          mode: "local" as const,
          targetSceneWordsMin: toNumber(
            draftEngineMeta.targetSceneWordsMin,
            fallbackBook.draftEngine.targetSceneWordsMin
          ),
          targetSceneWordsMax: toNumber(
            draftEngineMeta.targetSceneWordsMax,
            fallbackBook.draftEngine.targetSceneWordsMax
          ),
          styleProfileVersion:
            typeof draftEngineMeta.styleProfileVersion === "string" &&
            draftEngineMeta.styleProfileVersion.trim()
              ? draftEngineMeta.styleProfileVersion
              : fallbackBook.draftEngine.styleProfileVersion,
          marketProfileVersion:
            typeof draftEngineMeta.marketProfileVersion === "string" &&
            draftEngineMeta.marketProfileVersion.trim()
              ? draftEngineMeta.marketProfileVersion
              : fallbackBook.draftEngine.marketProfileVersion,
          jobs: buildDraftJobs({
            rows: draftJobsResult.data ?? [],
            memoryLastSyncedAt,
            sceneMap,
            sceneCardMap,
            chapterMap,
            contextPackCanonFactsByPackId,
            contextPackCharacterStatesByPackId,
            contextPackThreadsByPackId,
            canonFactMap,
            characterStateMap,
            threadMap
          })
        },
        amazonOps: normalizeAmazonOps(bookProject.amazon_ops, fallbackBook.amazonOps)
      }
    : fallbackBook

  if (book.memory.continuityNotes.length === 0) {
    book.memory.continuityNotes = book.draftEngine.jobs
      .flatMap(function (job) {
        return job.extractedState.continuityRisks.map(function (risk) {
          return `${job.sceneTitle}: ${risk}`
        })
      })
      .slice(0, 12)
  }

  return syncStoryBookArtifacts({
    id: storyId,
    workspaceId,
    title: (storyRow.title as string) ?? "",
    authorName: (storyRow.author_name as string) ?? "",
    status: normalizeStoryStatus(storyRow.status),
    mode: normalizeStoryMode(storyRow.mode),
    meta: {
      genre: typeof storyMeta.genre === "string" ? storyMeta.genre : "",
      language: typeof storyMeta.language === "string" ? storyMeta.language : "",
      audience: typeof storyMeta.audience === "string" ? storyMeta.audience : ""
    },
    book,
    assistant: normalizeAssistantWorkspace(storyMeta.assistant),
    worldBible: (worldBibleResult.data ?? []).map(function (row) {
      return {
        id: row.id as string,
        title: (row.title as string) ?? "",
        kind: normalizeWorldBibleKind(row.kind),
        summary: (row.summary as string) ?? ""
      }
    }),
    variables: (variablesResult.data ?? []).map(function (row) {
      return {
        id: row.id as string,
        key: (row.key as string) ?? "",
        label: (row.label as string) ?? "",
        type: normalizeVariableType(row.value_type),
        defaultValue: normalizeStoryValue(row.default_value)
      }
    }),
    acts
  })
}

export async function saveStudioStory(story: StoryDocument) {
  const nextStory = syncStoryBookArtifacts(story)
  const ownerProfileId = await loadWorkspaceOwnerId(nextStory.workspaceId)
  const [
    existingWorldBibleCount,
    existingCharacterStateCount,
    existingWriterRuleCount,
    existingCanonFactCount,
    existingOpenThreadCount,
    existingSceneCardCount,
    existingContextPackCount,
    existingDraftJobCount
  ] = await Promise.all([
    countRowsByStoryId("world_bible_entries", nextStory.id),
    countRowsByStoryId("book_character_states", nextStory.id),
    countRowsByStoryId("book_writer_rules", nextStory.id),
    countRowsByStoryId("book_canon_facts", nextStory.id),
    countRowsByStoryId("book_open_threads", nextStory.id),
    countRowsByStoryId("book_scene_cards", nextStory.id),
    countRowsByStoryId("book_context_packs", nextStory.id),
    countRowsByStoryId("book_draft_jobs", nextStory.id)
  ])
  const preserveWorldBible =
    nextStory.worldBible.length === 0 && existingWorldBibleCount > 0
  const preserveDraftJobs =
    nextStory.book.draftEngine.jobs.length === 0 && existingDraftJobCount > 0
  const preserveWriterRules =
    nextStory.book.writerConstitution.length === 0 && existingWriterRuleCount > 0
  const preserveSceneCards =
    nextStory.book.memory.sceneCards.length === 0 && existingSceneCardCount > 0
  const preserveCanonFacts =
    existingCanonFactCount > 0 &&
    (nextStory.book.memory.canonLedger.length === 0 || preserveWorldBible || preserveDraftJobs)
  const preserveOpenThreads =
    existingOpenThreadCount > 0 &&
    (nextStory.book.memory.openThreads.length === 0 || preserveDraftJobs)
  const preserveCharacterLedger =
    existingCharacterStateCount > 0 &&
    (
      nextStory.book.memory.characterLedger.length === 0 ||
      preserveWorldBible ||
      preserveCanonFacts ||
      preserveOpenThreads ||
      preserveDraftJobs
    )
  const preserveContextPacks =
    existingContextPackCount > 0 &&
    (
      nextStory.book.memory.contextPacks.length === 0 ||
      preserveCanonFacts ||
      preserveCharacterLedger ||
      preserveOpenThreads ||
      preserveSceneCards
    )
  const meta = {
    ...nextStory.meta,
    assistant: nextStory.assistant,
    draftEngine: {
      targetSceneWordsMin: nextStory.book.draftEngine.targetSceneWordsMin,
      targetSceneWordsMax: nextStory.book.draftEngine.targetSceneWordsMax,
      styleProfileVersion: nextStory.book.draftEngine.styleProfileVersion,
      marketProfileVersion: nextStory.book.draftEngine.marketProfileVersion
    }
  }

  const storyStatus = denormalizeStoryStatus(nextStory.status)

  const storyUpsert = await supabaseAdmin.from("stories").upsert({
    id: nextStory.id,
    workspace_id: nextStory.workspaceId,
    title: nextStory.title || "Untitled Book",
    author_name: nextStory.authorName || "",
    status: storyStatus,
    mode: nextStory.mode || "book",
    meta,
    created_by: ownerProfileId,
    current_version_id: null
  })

  if (storyUpsert.error) {
    throw new Error(`Story Upsert: ${storyUpsert.error.message}`)
  }

  const bookProjectUpsert = await supabaseAdmin.from("book_projects").upsert({
    story_id: nextStory.id,
    workspace_id: nextStory.workspaceId,
    priority: nextStory.book.priority || "primary",
    active_phase: nextStory.book.activePhase || "phase_1_foundation",
    target_format: nextStory.book.targetFormat || "novel",
    target_length_words: nextStory.book.targetLengthWords || 70000,
    master_brief: nextStory.book.masterBrief,
    market_brief: nextStory.book.marketBrief,
    amazon_ops: nextStory.book.amazonOps,
    memory_last_synced_at: nextStory.book.memory.lastSyncedAt
  })

  if (bookProjectUpsert.error) {
    throw new Error(`Book Project Upsert: ${bookProjectUpsert.error.message}`)
  }

  await deleteStoryGraph(nextStory.id, {
    preserveWorldBible,
    preserveCharacterLedger,
    preserveWriterRules,
    preserveCanonFacts,
    preserveOpenThreads,
    preserveSceneCards,
    preserveContextPacks,
    preserveDraftJobs
  })

  const acts = nextStory.acts.map(function (act) {
    return {
      id: act.id,
      workspace_id: nextStory.workspaceId,
      story_id: nextStory.id,
      title: act.title,
      sort_order: act.order
    }
  })

  const chapters = nextStory.acts.flatMap(function (act) {
    return act.chapters.map(function (chapter) {
      return {
        id: chapter.id,
        workspace_id: nextStory.workspaceId,
        story_id: nextStory.id,
        act_id: act.id,
        title: chapter.title,
        sort_order: chapter.order,
        word_count: chapter.wordCount
      }
    })
  })

  const scenes = nextStory.acts.flatMap(function (act) {
    return act.chapters.flatMap(function (chapter) {
      return chapter.scenes.map(function (scene) {
        return {
          id: scene.id,
          workspace_id: nextStory.workspaceId,
          story_id: nextStory.id,
          chapter_id: chapter.id,
          title: scene.title,
          label: scene.label,
          summary: scene.summary,
          sort_order: scene.order,
          word_count: scene.wordCount
        }
      })
    })
  })

  const sceneBlocks = nextStory.acts.flatMap(function (act) {
    return act.chapters.flatMap(function (chapter) {
      return chapter.scenes.flatMap(function (scene) {
        return scene.blocks.map(function (block, index) {
          return {
            id: block.id,
            workspace_id: nextStory.workspaceId,
            story_id: nextStory.id,
            scene_id: scene.id,
            kind: block.kind,
            content: block.text,
            sort_order: index + 1
          }
        })
      })
    })
  })

  const storyVariables = nextStory.variables.map(function (variable) {
    return {
      id: variable.id,
      workspace_id: nextStory.workspaceId,
      story_id: nextStory.id,
      key: variable.key,
      label: variable.label,
      value_type: variable.type,
      default_value: variable.defaultValue
    }
  })

  const choices = nextStory.acts.flatMap(function (act) {
    return act.chapters.flatMap(function (chapter) {
      return chapter.scenes.flatMap(function (scene) {
        return scene.choices.map(function (choice, index) {
          return {
            id: choice.id,
            workspace_id: nextStory.workspaceId,
            story_id: nextStory.id,
            scene_id: scene.id,
            to_scene_id: choice.toSceneId,
            label: choice.label,
            sort_order: index + 1
          }
        })
      })
    })
  })

  const choiceConditions = nextStory.acts.flatMap(function (act) {
    return act.chapters.flatMap(function (chapter) {
      return chapter.scenes.flatMap(function (scene) {
        return scene.choices.flatMap(function (choice) {
          return choice.conditions.map(function (condition) {
            return {
              workspace_id: nextStory.workspaceId,
              story_id: nextStory.id,
              choice_id: choice.id,
              variable_key: condition.variableKey,
              equals_value: condition.equals
            }
          })
        })
      })
    })
  })

  const choiceEffects = nextStory.acts.flatMap(function (act) {
    return act.chapters.flatMap(function (chapter) {
      return chapter.scenes.flatMap(function (scene) {
        return scene.choices.flatMap(function (choice) {
          return choice.effects.map(function (effect) {
            return {
              workspace_id: nextStory.workspaceId,
              story_id: nextStory.id,
              choice_id: choice.id,
              variable_key: effect.variableKey,
              set_to_value: effect.setTo
            }
          })
        })
      })
    })
  })

  const worldBibleEntries = nextStory.worldBible.map(function (entry) {
    return {
      id: entry.id,
      workspace_id: nextStory.workspaceId,
      story_id: nextStory.id,
      title: entry.title,
      kind: entry.kind,
      summary: entry.summary
    }
  })

  const bookWriterRules = nextStory.book.writerConstitution.map(function (rule, index) {
    return {
      workspace_id: nextStory.workspaceId,
      story_id: nextStory.id,
      sort_order: index + 1,
      rule_text: rule
    }
  })

  const bookCanonFacts = nextStory.book.memory.canonLedger.map(function (fact) {
    return {
      id: fact.entryId,
      workspace_id: nextStory.workspaceId,
      story_id: nextStory.id,
      source_world_bible_entry_id: findWorldBibleSourceId(nextStory.worldBible, fact),
      title: fact.title,
      kind: fact.kind,
      summary: fact.summary,
      mention_count: fact.mentionCount,
      importance: fact.importance,
      status: fact.status
    }
  })

  const bookCanonFactSceneRefs = nextStory.book.memory.canonLedger.flatMap(function (fact) {
    return fact.sceneIds.map(function (sceneId) {
      return {
        canon_fact_id: fact.entryId,
        scene_id: sceneId
      }
    })
  })

  const bookCharacterStates = nextStory.book.memory.characterLedger.map(function (state) {
    return {
      id: state.id,
      workspace_id: nextStory.workspaceId,
      story_id: nextStory.id,
      world_bible_entry_id: state.characterEntryId || null,
      character_name: state.characterName,
      current_state: state.currentState,
      inner_shift: state.innerShift,
      agenda: state.agenda,
      updated_from_scene_id: state.updatedFromSceneId || null,
      state_updated_at: state.updatedAt
    }
  })

  const bookCharacterStateSnapshots = nextStory.book.memory.characterLedger.flatMap(function (state) {
    return state.snapshots.map(function (snapshot) {
      return {
        id: snapshot.id,
        workspace_id: nextStory.workspaceId,
        story_id: nextStory.id,
        character_state_id: state.id,
        scope: snapshot.scope,
        sort_order: snapshot.sortOrder,
        source_scene_id: snapshot.sourceSceneId,
        source_chapter_id: snapshot.sourceChapterId,
        source_label: snapshot.sourceLabel,
        current_state: snapshot.currentState,
        inner_shift: snapshot.innerShift,
        agenda: snapshot.agenda,
        captured_at: snapshot.capturedAt
      }
    })
  })

  const bookOpenThreads = nextStory.book.memory.openThreads.map(function (thread) {
    return {
      id: thread.id,
      workspace_id: nextStory.workspaceId,
      story_id: nextStory.id,
      label: thread.label,
      detail: thread.detail,
      source_scene_id: thread.sourceSceneId || null,
      status: thread.status,
      priority: thread.priority,
      payoff_scene_id: thread.payoffSceneId
    }
  })

  const bookSceneCards = nextStory.book.memory.sceneCards.map(function (sceneCard) {
    return {
      workspace_id: nextStory.workspaceId,
      story_id: nextStory.id,
      scene_id: sceneCard.sceneId,
      act_title: sceneCard.actTitle,
      chapter_title: sceneCard.chapterTitle,
      scene_title: sceneCard.sceneTitle,
      summary: sceneCard.summary,
      excerpt: sceneCard.excerpt,
      order_label: sceneCard.orderLabel,
      chapter_goal: sceneCard.chapterGoal,
      directives: sceneCard.directives,
      outline: sceneCard.outline
    }
  })

  const bookContextPacks = nextStory.book.memory.contextPacks.map(function (pack) {
    return {
      id: pack.id,
      workspace_id: nextStory.workspaceId,
      story_id: nextStory.id,
      scene_id: pack.sceneId,
      stable_prefix_signature: pack.stablePrefixSignature,
      previous_scene_ids: pack.previousSceneIds,
      next_scene_id: pack.nextSceneId,
      prepared_at: pack.preparedAt
    }
  })

  const bookContextPackCanonFacts = nextStory.book.memory.contextPacks.flatMap(function (pack) {
    return pack.relevantCanonEntryIds.map(function (canonFactId, index) {
      return {
        context_pack_id: pack.id,
        canon_fact_id: canonFactId,
        sort_order: index + 1
      }
    })
  })

  const bookContextPackCharacterStates = nextStory.book.memory.contextPacks.flatMap(function (pack) {
    return pack.relevantCharacterStateIds.map(function (characterStateId, index) {
      return {
        context_pack_id: pack.id,
        character_state_id: characterStateId,
        sort_order: index + 1
      }
    })
  })

  const bookContextPackThreads = nextStory.book.memory.contextPacks.flatMap(function (pack) {
    return pack.activeThreadIds.map(function (threadId, index) {
      return {
        context_pack_id: pack.id,
        thread_id: threadId,
        sort_order: index + 1
      }
    })
  })

  const bookDraftJobs = nextStory.book.draftEngine.jobs.map(function (job) {
    return {
      id: job.id,
      workspace_id: nextStory.workspaceId,
      story_id: nextStory.id,
      scene_id: job.sceneId,
      context_pack_id: job.contextSnapshot.contextPackId || null,
      provider: job.provider,
      mode: job.mode,
      model_name: job.modelName,
      status: job.status,
      outline: job.outline,
      draft_text: job.draftText,
      rewrite_text: job.rewriteText,
      rewrite_notes: job.rewriteNotes,
      extracted_state: job.extractedState,
      stage_runs: job.stages,
      accepted_at: job.acceptedAt
    }
  })

  await insertRows("acts", acts)
  await insertRows("chapters", chapters)
  await insertRows("scenes", scenes)
  await insertRows("scene_blocks", sceneBlocks)
  await insertRows("story_variables", storyVariables)
  await insertRows("choices", choices)
  await insertRows("choice_conditions", choiceConditions)
  await insertRows("choice_effects", choiceEffects)
  if (!preserveWorldBible && worldBibleEntries.length > 0) {
    await upsertRows("world_bible_entries", worldBibleEntries, "id")
  }
  if (!preserveWriterRules) {
    await insertRows("book_writer_rules", bookWriterRules)
  }
  if (!preserveCanonFacts) {
    await upsertRows("book_canon_facts", bookCanonFacts, "id")
    await insertRows("book_canon_fact_scene_refs", bookCanonFactSceneRefs)
  }
  if (!preserveCharacterLedger && bookCharacterStates.length > 0) {
    await upsertRows("book_character_states", bookCharacterStates, "id")
    await upsertRows("book_character_state_snapshots", bookCharacterStateSnapshots, "id")
  }
  if (!preserveOpenThreads) {
    await upsertRows("book_open_threads", bookOpenThreads, "id")
  }
  if (!preserveSceneCards) {
    await insertRows("book_scene_cards", bookSceneCards)
  }
  if (!preserveContextPacks) {
    await upsertRows("book_context_packs", bookContextPacks, "id")
    await insertRows("book_context_pack_canon_facts", bookContextPackCanonFacts)
    await insertRows("book_context_pack_character_states", bookContextPackCharacterStates)
    await insertRows("book_context_pack_threads", bookContextPackThreads)
  }
  if (!preserveDraftJobs) {
    await upsertRows("book_draft_jobs", bookDraftJobs, "id")
  }

  return nextStory
}

async function loadStoryRow(preferredStoryId?: string | null) {
  const query = supabaseAdmin
    .from("stories")
    .select("id, workspace_id, title, author_name, status, mode, meta")

  const result = preferredStoryId
    ? await query.eq("id", preferredStoryId).maybeSingle()
    : await query.order("updated_at", { ascending: false }).limit(1).maybeSingle()

  if (result.error) {
    throw new Error(result.error.message)
  }

  return result.data
}

async function loadWorkspaceOwnerId(workspaceId: string) {
  const result = await supabaseAdmin
    .from("workspaces")
    .select("owner_user_id")
    .eq("id", workspaceId)
    .maybeSingle()

  if (result.error) {
    throw new Error(result.error.message)
  }

  const ownerUserId = result.data?.owner_user_id

  if (typeof ownerUserId !== "string" || !ownerUserId) {
    throw new Error(`Workspace ${workspaceId} has no owner_user_id.`)
  }

  return ownerUserId
}

async function ensureBootstrapStory() {
  const workspace = await ensureBootstrapWorkspace()
  const bootstrapStory = buildBootstrapStory(workspace.id)

  return saveStudioStory(bootstrapStory)
}

async function ensureBootstrapWorkspace() {
  const existingWorkspaceResult = await supabaseAdmin
    .from("workspaces")
    .select("id, owner_user_id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (existingWorkspaceResult.error) {
    throw new Error(existingWorkspaceResult.error.message)
  }

  if (existingWorkspaceResult.data) {
    return {
      id: existingWorkspaceResult.data.id as string,
      ownerUserId: existingWorkspaceResult.data.owner_user_id as string
    }
  }

  const ownerUserId = await ensureBootstrapOwnerUserId()
  const workspaceId = createUuid()

  const insertWorkspaceResult = await supabaseAdmin.from("workspaces").insert({
    id: workspaceId,
    slug: "ember-studio",
    name: "EMBER Studio",
    owner_user_id: ownerUserId
  })

  assertNoError("workspaces bootstrap insert", insertWorkspaceResult.error)

  return {
    id: workspaceId,
    ownerUserId
  }
}

async function ensureBootstrapOwnerUserId() {
  const bootstrapEmail = "studio@ember.local"
  const usersResult = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 200
  })

  if (usersResult.error) {
    throw new Error(usersResult.error.message)
  }

  const existingUser = usersResult.data.users.find(function (user) {
    return user.email === bootstrapEmail
  })

  const user =
    existingUser ??
    (
      await supabaseAdmin.auth.admin.createUser({
        email: bootstrapEmail,
        password: createUuid(),
        email_confirm: true,
        user_metadata: {
          display_name: "EMBER Studio"
        }
      })
    ).data.user

  if (!user?.id) {
    throw new Error("Bootstrap owner user could not be created.")
  }

  const profileUpsert = await supabaseAdmin.from("profiles").upsert({
    id: user.id,
    display_name: "EMBER Studio",
    avatar_url: ""
  })

  assertNoError("profiles bootstrap upsert", profileUpsert.error)

  return user.id
}

function buildBootstrapStory(workspaceId: string): StoryDocument {
  const storyId = createUuid()
  const actId = createUuid()
  const chapterId = createUuid()
  const sceneOneId = createUuid()
  const sceneTwoId = createUuid()
  const jonasId = createUuid()
  const elenaId = createUuid()
  const ringId = createUuid()
  const focusVarId = createUuid()
  const aloneVarId = createUuid()

  return {
    id: storyId,
    workspaceId,
    title: "New Novel",
    authorName: "Özgür Azap",
    status: "draft",
    mode: "book",
    meta: {
      genre: "Psychothriller",
      language: "de",
      audience: "Adult"
    },
    book: {
      ...createDefaultBookBlueprint("New Novel"),
      activePhase: "phase_5_market",
      masterBrief: {
        ...createDefaultBookBlueprint("New Novel").masterBrief,
        premise:
          "Ein Ermittler zieht einen scheinbar lokalen Vermisstenfall auf und öffnet dabei eine soziale Druckkammer, die ihn selbst verschiebt.",
        readerPromise:
          "Ein psychologischer Ermittlungsroman mit klarer Spannung, eskalierendem Dorfdruck und lesbarem kommerziellem Zug.",
        endingPromise:
          "Der Fall löst sich nicht nur im Außen, sondern zwingt Jonas in einen Rollenwechsel mit Kosten.",
        thematicCore:
          "Kontrolle kippt in Mitschuld, sobald Ordnung wichtiger wird als Wahrheit."
      },
      marketBrief: {
        ...createDefaultBookBlueprint("New Novel").marketBrief,
        amazonGoal:
          "Ein sauber paketierbarer Genretitel, der als erster Band oder Standalone verkauft werden kann.",
        categoryLane: "Psychothriller / Dorfgeheimnis / Ermittler mit moralischer Reibung",
        hook:
          "Ein Ermittler sucht eine verschwundene Frau und merkt zu spät, dass das Dorf nicht lügt, sondern gemeinsam redigiert.",
        seriesPotential:
          "Jonas Falk kann weitere Fälle mit strukturgetriebenem Blick tragen, sofern jeder Fall einen anderen sozialen Mechanismus öffnet.",
        coverDirection:
          "Nebel, Dorfkante, reduzierte Symbolik statt generischer Crime-Collage."
      },
      amazonOps: {
        penName: "Özgür Azap",
        subtitle: "Ein Dorf, ein Notizbuch, ein Ermittler ohne sicheren Boden",
        seriesName: "Jonas-Falk-Fälle",
        volumeNumber: "1",
        description:
          "Als eine Frau verschwindet, glaubt Ermittler Jonas Falk an einen lokalen Fall. Doch je tiefer er in das Dorf eindringt, desto deutlicher wird: Hier wird nicht gelogen, hier wird kollektiv redigiert.",
        keywords: ["psychothriller", "dorfgeheimnis", "ermittler", "spannung", "notizbuch"],
        categories: ["Psychothriller", "Kriminalroman", "Mystery-Thriller"],
        audienceTags: ["adult", "dark", "german-market"],
        aiDisclosure: "assisted",
        launchChecklist: {
          manuscriptReady: false,
          coverReady: false,
          blurbReady: true,
          keywordsReady: true,
          categoriesReady: true,
          aiDisclosureReady: true
        }
      }
    },
    assistant: createDefaultAssistantWorkspace(),
    worldBible: [
      {
        id: jonasId,
        title: "Jonas Falk",
        kind: "character",
        summary: "Ermittler, der Struktur schneller erkennt als Pathos."
      },
      {
        id: elenaId,
        title: "Elena Petrescu",
        kind: "character",
        summary: "Abwesende Figur, deren Notizbuch das ganze Dorf unter Druck setzt."
      },
      {
        id: ringId,
        title: "Der Ring",
        kind: "object",
        summary: "Objekt, Fessel und Rollenübergang statt bloßer Hinweis."
      }
    ],
    variables: [
      {
        id: focusVarId,
        key: "focus",
        label: "Investigative focus",
        type: "enum",
        defaultValue: "none"
      },
      {
        id: aloneVarId,
        key: "aloneInForest",
        label: "Jonas enters forest alone",
        type: "boolean",
        defaultValue: true
      }
    ],
    acts: [
      {
        id: actId,
        title: "Act 1",
        order: 1,
        chapters: [
          {
            id: chapterId,
            actId,
            title: "Chapter 1",
            order: 1,
            wordCount: 0,
            scenes: [
              {
                id: sceneOneId,
                chapterId,
                title: "Scene 1",
                order: 1,
                label: "Opening",
                summary:
                  "Als Adrian Petrescu an diesem verregneten Mittwochabend Jonas Falks Büro betrat, kam nicht nur ein Fall herein.",
                wordCount: 0,
                blocks: [
                  {
                    id: createUuid(),
                    kind: "paragraph",
                    text:
                      "Adrian bringt den Oktober mit ins Zimmer. Jonas erkennt, dass dieser Besuch mehr nach Struktur als nach Trauer riecht."
                  }
                ],
                choices: [
                  {
                    id: createUuid(),
                    label: "Das Notizbuch aufschlagen",
                    toSceneId: sceneTwoId,
                    conditions: [],
                    effects: []
                  }
                ]
              },
              {
                id: sceneTwoId,
                chapterId,
                title: "Scene 2",
                order: 2,
                label: "Escalation",
                summary: "Das Notizbuch zeigt, dass das Dorf keine Geheimnisse versteckt, sondern Versionen verwaltet.",
                wordCount: 0,
                blocks: [
                  {
                    id: createUuid(),
                    kind: "paragraph",
                    text: ""
                  }
                ],
                choices: []
              }
            ]
          }
        ]
      }
    ]
  }
}

async function deleteStoryGraph(
  storyId: string,
  options?: {
    preserveWorldBible?: boolean
    preserveCharacterLedger?: boolean
    preserveWriterRules?: boolean
    preserveCanonFacts?: boolean
    preserveOpenThreads?: boolean
    preserveSceneCards?: boolean
    preserveContextPacks?: boolean
    preserveDraftJobs?: boolean
  }
) {
  if (!options?.preserveDraftJobs) {
    await deleteRows("book_draft_jobs", storyId)
  }
  if (!options?.preserveContextPacks) {
    await deleteRows("book_context_packs", storyId)
  }
  if (!options?.preserveSceneCards) {
    await deleteRows("book_scene_cards", storyId)
  }
  if (!options?.preserveOpenThreads) {
    await deleteRows("book_open_threads", storyId)
  }
  if (!options?.preserveCharacterLedger) {
    await deleteRows("book_character_state_snapshots", storyId)
    await deleteRows("book_character_states", storyId)
  }
  if (!options?.preserveCanonFacts) {
    await deleteRows("book_canon_facts", storyId)
  }
  if (!options?.preserveWriterRules) {
    await deleteRows("book_writer_rules", storyId)
  }
  if (!options?.preserveWorldBible) {
    await deleteRows("world_bible_entries", storyId)
  }
  await deleteRows("story_variables", storyId)
  await deleteRows("acts", storyId)
}

async function deleteRows(table: string, storyId: string) {
  const result = await supabaseAdmin.from(table).delete().eq("story_id", storyId)
  assertNoError(`${table} delete`, result.error)
}

async function insertRows(table: string, rows: Row[]) {
  if (!rows.length) {
    return
  }

  const result = await supabaseAdmin.from(table).insert(rows)
  assertNoError(`${table} insert`, result.error)
}

async function upsertRows(table: string, rows: Row[], onConflict: string) {
  if (!rows.length) {
    return
  }

  const result = await supabaseAdmin.from(table).upsert(rows, {
    onConflict
  })
  assertNoError(`${table} upsert`, result.error)
}

async function countRowsByStoryId(table: string, storyId: string) {
  const result = await supabaseAdmin
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("story_id", storyId)

  assertNoError(`${table} count`, result.error)

  return result.count ?? 0
}

async function loadRowsByIds(table: string, column: string, ids: string[]) {
  if (!ids.length) {
    return []
  }

  const result = await supabaseAdmin.from(table).select("*").in(column, ids)
  assertNoError(table, result.error)
  return result.data ?? []
}

function buildDraftJobs(params: {
  rows: Row[]
  memoryLastSyncedAt: string | null
  sceneMap: Map<string, Row>
  sceneCardMap: Map<string, Row>
  chapterMap: Map<string, Row>
  contextPackCanonFactsByPackId: Map<string, Row[]>
  contextPackCharacterStatesByPackId: Map<string, Row[]>
  contextPackThreadsByPackId: Map<string, Row[]>
  canonFactMap: Map<string, Row>
  characterStateMap: Map<string, Row>
  threadMap: Map<string, Row>
}) {
  return params.rows.map(function (row): BookDraftJob {
    const sceneId = row.scene_id as string
    const sceneRow = params.sceneMap.get(sceneId)
    const sceneCard = params.sceneCardMap.get(sceneId)
    const chapterRow = sceneRow ? params.chapterMap.get(sceneRow.chapter_id as string) : null
    const contextPackId = (row.context_pack_id as string) ?? sceneId
    const provider = normalizeProvider(row.provider)
    const modelName = typeof row.model_name === "string" ? row.model_name : null
    const updatedAt = (row.updated_at as string) ?? ""
    const rewriteNotes = normalizeStringArray(row.rewrite_notes)
    const extractedState = normalizeExtractedState(row.extracted_state)

    return {
      id: row.id as string,
      sceneId,
      sceneTitle: (sceneRow?.title as string) ?? (sceneCard?.scene_title as string) ?? "",
      createdAt: (row.created_at as string) ?? "",
      updatedAt,
      provider,
      mode: row.mode === "remote" ? "remote" : "local_fallback",
      modelName,
      status: row.status === "accepted" ? "accepted" : "ready",
      acceptedAt: typeof row.accepted_at === "string" ? row.accepted_at : null,
      outline: normalizeStringArray(row.outline),
      draftText: (row.draft_text as string) ?? "",
      rewriteText: (row.rewrite_text as string) ?? "",
      rewriteNotes,
      extractedState,
      stages: normalizeStageRuns(row.stage_runs, {
        provider,
        modelName,
        updatedAt,
        rewriteNotes,
        extractedState
      }),
      contextSnapshot: {
        contextPackId,
        memorySyncedAt: params.memoryLastSyncedAt,
        chapterTitle: (sceneCard?.chapter_title as string) ?? (chapterRow?.title as string) ?? "",
        sceneSummary: (sceneRow?.summary as string) ?? (sceneCard?.summary as string) ?? "",
        relevantCodexTitles: (params.contextPackCanonFactsByPackId.get(contextPackId) ?? [])
          .map(function (linkRow) {
            return params.canonFactMap.get(linkRow.canon_fact_id as string)?.title as string
          })
          .filter(Boolean),
        relevantCharacterNames: (
          params.contextPackCharacterStatesByPackId.get(contextPackId) ?? []
        )
          .map(function (linkRow) {
            return params.characterStateMap.get(linkRow.character_state_id as string)
              ?.character_name as string
          })
          .filter(Boolean),
        activeThreadLabels: (params.contextPackThreadsByPackId.get(contextPackId) ?? [])
          .map(function (linkRow) {
            return params.threadMap.get(linkRow.thread_id as string)?.label as string
          })
          .filter(Boolean)
      }
    }
  })
}

function findWorldBibleSourceId(worldBible: WorldBibleEntry[], fact: StoryDocument["book"]["memory"]["canonLedger"][number]) {
  return (
    worldBible.find(function (entry) {
      return entry.id === fact.entryId || entry.title === fact.title
    })?.id ?? null
  )
}

function groupRows(rows: Row[], key: string) {
  const grouped = new Map<string, Row[]>()

  rows.forEach(function (row) {
    const groupKey = row[key]

    if (typeof groupKey !== "string") {
      return
    }

    const currentRows = grouped.get(groupKey) ?? []
    currentRows.push(row)
    grouped.set(groupKey, currentRows)
  })

  return grouped
}

function mapStoryLibraryEntry(row: Row): StoryLibraryEntry {
  return {
    id: row.id as string,
    workspaceId: row.workspace_id as string,
    title: (row.title as string) ?? "",
    authorName: (row.author_name as string) ?? "",
    status: normalizeStoryStatus(row.status),
    mode: normalizeStoryMode(row.mode),
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? ""
  }
}

function normalizeStoryStatus(value: unknown): StoryDocument["status"] {
  if (value === "playtest") {
    return "playtest"
  }

  if (value === "submitted" || value === "in_review" || value === "approved" || value === "archived") {
    return "submitted"
  }

  return "draft"
}

function normalizeStoryMode(value: unknown): StoryDocument["mode"] {
  return value === "branching" ? "branching" : "book"
}

function denormalizeStoryStatus(value: StoryDocument["status"]) {
  if (value === "playtest") {
    return "playtest"
  }

  if (value === "submitted") {
    return "submitted"
  }

  return "draft"
}

function normalizeBookPhase(value: unknown): StoryDocument["book"]["activePhase"] {
  if (
    value === "phase_1_foundation" ||
    value === "phase_2_memory" ||
    value === "phase_3_drafting" ||
    value === "phase_4_continuity" ||
    value === "phase_5_market"
  ) {
    return value
  }

  return "phase_1_foundation"
}

function normalizeTargetFormat(value: unknown): StoryDocument["book"]["targetFormat"] {
  if (value === "novella" || value === "novel" || value === "series") {
    return value
  }

  return "novel"
}

function normalizeMasterBrief(
  value: unknown,
  fallback: StoryDocument["book"]["masterBrief"]
) {
  const record = toRecord(value)

  return {
    premise: typeof record.premise === "string" ? record.premise : fallback.premise,
    readerPromise:
      typeof record.readerPromise === "string" ? record.readerPromise : fallback.readerPromise,
    endingPromise:
      typeof record.endingPromise === "string" ? record.endingPromise : fallback.endingPromise,
    thematicCore:
      typeof record.thematicCore === "string" ? record.thematicCore : fallback.thematicCore,
    storyArchitecture: normalizeBookRuleList(record.storyArchitecture, fallback.storyArchitecture)
  }
}

function normalizeMarketBrief(
  value: unknown,
  fallback: StoryDocument["book"]["marketBrief"]
) {
  const record = toRecord(value)

  return {
    amazonGoal: typeof record.amazonGoal === "string" ? record.amazonGoal : fallback.amazonGoal,
    categoryLane:
      typeof record.categoryLane === "string" ? record.categoryLane : fallback.categoryLane,
    hook: typeof record.hook === "string" ? record.hook : fallback.hook,
    seriesPotential:
      typeof record.seriesPotential === "string"
        ? record.seriesPotential
        : fallback.seriesPotential,
    coverDirection:
      typeof record.coverDirection === "string"
        ? record.coverDirection
        : fallback.coverDirection,
    publishingGuardrails: normalizeBookRuleList(
      record.publishingGuardrails,
      fallback.publishingGuardrails
    )
  }
}

function normalizeAmazonOps(
  value: unknown,
  fallback: StoryDocument["book"]["amazonOps"]
) {
  const record = toRecord(value)
  const launchChecklist = toRecord(record.launchChecklist)

  return {
    penName: typeof record.penName === "string" ? record.penName : fallback.penName,
    subtitle: typeof record.subtitle === "string" ? record.subtitle : fallback.subtitle,
    seriesName: typeof record.seriesName === "string" ? record.seriesName : fallback.seriesName,
    volumeNumber:
      typeof record.volumeNumber === "string" ? record.volumeNumber : fallback.volumeNumber,
    description:
      typeof record.description === "string" ? record.description : fallback.description,
    keywords: normalizeStringArray(record.keywords),
    categories: normalizeStringArray(record.categories),
    audienceTags: normalizeStringArray(record.audienceTags),
    aiDisclosure:
      record.aiDisclosure === "generated" ||
      record.aiDisclosure === "assisted" ||
      record.aiDisclosure === "human_led"
        ? record.aiDisclosure
        : fallback.aiDisclosure,
    launchChecklist: {
      manuscriptReady:
        typeof launchChecklist.manuscriptReady === "boolean"
          ? launchChecklist.manuscriptReady
          : fallback.launchChecklist.manuscriptReady,
      coverReady:
        typeof launchChecklist.coverReady === "boolean"
          ? launchChecklist.coverReady
          : fallback.launchChecklist.coverReady,
      blurbReady:
        typeof launchChecklist.blurbReady === "boolean"
          ? launchChecklist.blurbReady
          : fallback.launchChecklist.blurbReady,
      keywordsReady:
        typeof launchChecklist.keywordsReady === "boolean"
          ? launchChecklist.keywordsReady
          : fallback.launchChecklist.keywordsReady,
      categoriesReady:
        typeof launchChecklist.categoriesReady === "boolean"
          ? launchChecklist.categoriesReady
          : fallback.launchChecklist.categoriesReady,
      aiDisclosureReady:
        typeof launchChecklist.aiDisclosureReady === "boolean"
          ? launchChecklist.aiDisclosureReady
          : fallback.launchChecklist.aiDisclosureReady
    }
  }
}

function normalizeWorldBibleKind(value: unknown): WorldBibleEntry["kind"] {
  if (value === "character" || value === "location" || value === "object" || value === "theme") {
    return value
  }

  return "theme"
}

function normalizeCanonKind(value: unknown) {
  if (
    value === "character" ||
    value === "location" ||
    value === "object" ||
    value === "theme" ||
    value === "scene_fact" ||
    value === "foreshadowing"
  ) {
    return value
  }

  return "scene_fact"
}

function normalizeVariableType(value: unknown): StoryVariable["type"] {
  if (value === "boolean" || value === "enum" || value === "number") {
    return value
  }

  return "enum"
}

function normalizeImportance(value: unknown): StoryDocument["book"]["memory"]["canonLedger"][number]["importance"] {
  if (value === "high" || value === "medium" || value === "low") {
    return value
  }

  return "low"
}

function normalizeThreadStatus(value: unknown): StoryDocument["book"]["memory"]["openThreads"][number]["status"] {
  if (value === "active" || value === "watch" || value === "resolved") {
    return value
  }

  return "watch"
}

function normalizeCharacterStateSnapshotScope(
  value: unknown
): StoryDocument["book"]["memory"]["characterLedger"][number]["snapshots"][number]["scope"] {
  if (value === "baseline" || value === "scene" || value === "chapter") {
    return value
  }

  return "scene"
}

function normalizeProvider(value: unknown): BookDraftJob["provider"] {
  if (value === "openai" || value === "anthropic" || value === "gemini" || value === "local") {
    return value
  }

  return "local"
}

function normalizeExtractedState(value: unknown): BookDraftJob["extractedState"] {
  const record = toRecord(value)

  return {
    newCanonFacts: normalizeStringArray(record.newCanonFacts),
    characterStateUpdates: normalizeStringArray(record.characterStateUpdates),
    openThreadsCreated: normalizeStringArray(record.openThreadsCreated),
    openThreadsResolved: normalizeStringArray(record.openThreadsResolved),
    foreshadowingAdded: normalizeStringArray(record.foreshadowingAdded),
    continuityRisks: normalizeStringArray(record.continuityRisks),
    styleDriftNotes: normalizeStringArray(record.styleDriftNotes)
  }
}

function normalizeStageRuns(
  value: unknown,
  fallback: {
    provider: BookDraftJob["provider"]
    modelName: string | null
    updatedAt: string
    rewriteNotes: string[]
    extractedState: BookDraftJob["extractedState"]
  }
): BookDraftStageRuns {
  const record = toRecord(value)
  const fallbackRuns = createFallbackDraftStageRuns({
    provider: fallback.provider,
    modelName: fallback.modelName,
    updatedAt: fallback.updatedAt
  })

  fallbackRuns.continuity.notes =
    fallback.extractedState.continuityRisks.concat(fallback.extractedState.styleDriftNotes).length > 0
      ? fallback.extractedState.continuityRisks.concat(fallback.extractedState.styleDriftNotes)
      : fallbackRuns.continuity.notes
  fallbackRuns.rewrite.notes = fallback.rewriteNotes.length > 0
    ? fallback.rewriteNotes
    : fallbackRuns.rewrite.notes

  return {
    context: normalizeStageRun(record.context, fallbackRuns.context),
    beat_plan: normalizeStageRun(record.beat_plan ?? record.outline, fallbackRuns.beat_plan),
    draft: normalizeStageRun(record.draft, fallbackRuns.draft),
    rewrite: normalizeStageRun(record.rewrite, fallbackRuns.rewrite),
    length_control: normalizeStageRun(record.length_control, fallbackRuns.length_control),
    extract: normalizeStageRun(record.extract, fallbackRuns.extract),
    continuity: normalizeStageRun(record.continuity, fallbackRuns.continuity),
    quality_eval: normalizeStageRun(record.quality_eval, fallbackRuns.quality_eval)
  }
}

function normalizeStageRun(value: unknown, fallback: BookDraftStageRun): BookDraftStageRun {
  const record = toRecord(value)

  return {
    status:
      record.status === "failed" || record.status === "skipped" || record.status === "completed"
        ? record.status
        : fallback.status,
    provider: normalizeProvider(record.provider ?? fallback.provider),
    modelName: typeof record.modelName === "string" ? record.modelName : fallback.modelName,
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : fallback.updatedAt,
    attemptCount: toNumber(record.attemptCount, fallback.attemptCount),
    repairCount: toNumber(record.repairCount, fallback.repairCount),
    durationMs: normalizeIntegerOrNull(record.durationMs, fallback.durationMs),
    inputTokens: normalizeIntegerOrNull(record.inputTokens, fallback.inputTokens),
    outputTokens: normalizeIntegerOrNull(record.outputTokens, fallback.outputTokens),
    costCents: normalizeIntegerOrNull(record.costCents, fallback.costCents),
    stopReason: typeof record.stopReason === "string" ? record.stopReason : fallback.stopReason,
    targetWordsMin: normalizeIntegerOrNull(record.targetWordsMin, fallback.targetWordsMin),
    targetWordsMax: normalizeIntegerOrNull(record.targetWordsMax, fallback.targetWordsMax),
    actualWords: normalizeIntegerOrNull(record.actualWords, fallback.actualWords),
    qualityScore:
      typeof record.qualityScore === "number" && Number.isFinite(record.qualityScore)
        ? record.qualityScore
        : fallback.qualityScore,
    qualityIssues:
      normalizeStringArray(record.qualityIssues).length > 0
        ? normalizeStringArray(record.qualityIssues)
        : fallback.qualityIssues,
    notes: normalizeStringArray(record.notes).length > 0 ? normalizeStringArray(record.notes) : fallback.notes
  }
}

function normalizeIntegerOrNull(value: unknown, fallback: number | null) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value)
  }

  return fallback
}

function normalizeStoryValue(value: unknown): boolean | string | number {
  if (typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    return value
  }

  return ""
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter(function (entry): entry is string {
        return typeof entry === "string"
      })
    : []
}

function toRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Row) : {}
}

function toNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function assertNoError(scope: string, error: { message: string } | null) {
  if (error) {
    throw new Error(`${scope}: ${error.message}`)
  }
}
