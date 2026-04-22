import { readFile } from "node:fs/promises"
import path from "node:path"
import { createUuid } from "../lib/id"
import { supabaseAdmin } from "../lib/supabase/server"
import {
  createDefaultBookMasterBriefRuntime,
  createDefaultBookThreatModel,
  createDefaultBookWriterRulesRuntime,
  createDefaultBookBlueprint,
  createEmptyBookSceneCardDirectives,
  type BookCharacterState,
  type BookContextPack,
  type BookOpenThread,
  type BookSceneCard,
  type StoryAct,
  type StoryDocument,
  type WorldBibleEntry
} from "../lib/story-schema"
import { createStudioStory, loadStudioStory, saveStudioStory } from "../lib/server/studio-story-service"

type ParsedCharacter = {
  legacyId: string
  name: string
  role: string
  summary: string
  currentState: string
  innerShift: string
  agenda: string
  misreadRisk: BookCharacterState["misreadRisk"]
  draftControls: BookCharacterState["draftControls"]
  pressurePattern: BookCharacterState["pressurePattern"]
}

type ParsedThread = {
  legacyId: string
  detail: string
  status: string
  payoffAct: string | null
}

type ParsedCanonFact = {
  legacyId: string
  fact: string
  status: string
  category: StoryDocument["book"]["memory"]["canonLedger"][number]["category"]
  visibility: StoryDocument["book"]["memory"]["canonLedger"][number]["visibility"]
  enforcement: StoryDocument["book"]["memory"]["canonLedger"][number]["enforcement"]
}

type ParsedScene = {
  legacyId: string
  actKey: string
  actTitle: string
  chapterTitle: string
  sceneTitle: string
  orderLabel: string
  summary: string
  excerpt: string
  chapterGoal: string
  directives: ReturnType<typeof createEmptyBookSceneCardDirectives>
  outline: string[]
  sceneFunction: string[]
  readerQuestion: string
  evidenceDelta: BookSceneCard["evidenceDelta"]
  trustShift: string
  accessShift: string
  lockedFields: string[]
  opusTaskMode: BookSceneCard["opusTaskMode"]
  escalationLevel: number | null
  exitCondition: string
  overwriteRisk: string[]
  setupRefs: string[]
  rawText: string
}

type ParsedWriterSummary = {
  chapterTitle: string
  summary: string
  directorNote: string | null
}

type ParsedRegie = {
  title: string
  authorName: string
  genre: string
  targetLengthWords: number
  masterBrief: StoryDocument["book"]["masterBrief"]
  masterBriefRuntime: StoryDocument["book"]["masterBriefRuntime"]
  marketBrief: StoryDocument["book"]["marketBrief"]
  writerConstitution: string[]
  writerRulesRuntime: StoryDocument["book"]["writerRulesRuntime"]
  threatModel: StoryDocument["book"]["threatModel"]
  worldBibleEntries: WorldBibleEntry[]
  canonFacts: ParsedCanonFact[]
  characters: ParsedCharacter[]
  openThreads: ParsedThread[]
  scenes: ParsedScene[]
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const regiePath = path.resolve(process.cwd(), options.regiePath)
  const markdown = await readFile(regiePath, "utf8")
  const parsed = parseRegie(markdown, options.titleOverride, options.authorOverride)

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          regiePath,
          title: parsed.title,
          authorName: parsed.authorName,
          acts: Array.from(new Set(parsed.scenes.map(function (scene) {
            return scene.actTitle
          }))),
          scenes: parsed.scenes.length,
          canonFacts: parsed.canonFacts.length,
          characters: parsed.characters.length,
          openThreads: parsed.openThreads.length,
          worldBibleEntries: parsed.worldBibleEntries.length
        },
        null,
        2
      )
    )
    return
  }

  const created = await createStudioStory()
  const baseStory = await loadStudioStory(created.storyId)
  const story = buildStoryFromRegie(baseStory, parsed)
  await saveStudioStory(story)
  await overwriteBookMemory(story)
  const savedStory = await loadStudioStory(story.id)

  console.log(
    JSON.stringify(
      {
        storyId: savedStory.id,
        workspaceId: savedStory.workspaceId,
        title: savedStory.title,
        activePhase: savedStory.book.activePhase,
        acts: savedStory.acts.length,
        scenes: savedStory.acts.reduce(function (sum, act) {
          return (
            sum +
            act.chapters.reduce(function (chapterSum, chapter) {
              return chapterSum + chapter.scenes.length
            }, 0)
          )
        }, 0),
        worldBible: savedStory.worldBible.length,
        canonFacts: savedStory.book.memory.canonLedger.length,
        characterStates: savedStory.book.memory.characterLedger.length,
        openThreads: savedStory.book.memory.openThreads.length,
        sceneCards: savedStory.book.memory.sceneCards.length,
        contextPacks: savedStory.book.memory.contextPacks.length
      },
      null,
      2
    )
  )
}

function buildStoryFromRegie(baseStory: StoryDocument, parsed: ParsedRegie): StoryDocument {
  const now = new Date().toISOString()
  const blueprint = createDefaultBookBlueprint(parsed.title)
  const sceneIdByLegacyId = new Map<string, string>()

  const acts: StoryAct[] = []
  const actOrder = new Map<string, StoryAct>()

  parsed.scenes.forEach(function (parsedScene, sceneIndex) {
    let act = actOrder.get(parsedScene.actKey)

    if (!act) {
      act = {
        id: createUuid(),
        title: parsedScene.actTitle,
        order: acts.length + 1,
        chapters: []
      }
      acts.push(act)
      actOrder.set(parsedScene.actKey, act)
    }

    const chapterId = createUuid()
    const sceneId = createUuid()
    sceneIdByLegacyId.set(parsedScene.legacyId, sceneId)

    act.chapters.push({
      id: chapterId,
      actId: act.id,
      title: parsedScene.chapterTitle,
      order: act.chapters.length + 1,
      wordCount: 0,
      scenes: [
        {
          id: sceneId,
          chapterId,
          title: parsedScene.sceneTitle,
          order: 1,
          label: parsedScene.orderLabel || `SCENE_${sceneIndex + 1}`,
          summary: parsedScene.summary,
          wordCount: 0,
          blocks: [],
          choices: []
        }
      ]
    })
  })

  const firstSceneId = acts[0]?.chapters[0]?.scenes[0]?.id ?? createUuid()
  const sceneMetadata = parsed.scenes.map(function (scene) {
    const sceneId = sceneIdByLegacyId.get(scene.legacyId) ?? createUuid()
    const matchingAct = acts.find(function (act) {
      return act.title === scene.actTitle
    })
    const matchingChapter = matchingAct?.chapters.find(function (chapter) {
      return chapter.title === scene.chapterTitle
    })

    return {
      parsed: scene,
      sceneId,
      chapterId: matchingChapter?.id ?? createUuid()
    }
  })

  const worldBibleEntryByCharacterLegacyId = new Map<string, string>()
  const worldBible: WorldBibleEntry[] = parsed.worldBibleEntries.map(function (entry) {
    const nextEntry = {
      ...entry,
      id: createUuid()
    }

    const matchingCharacter = parsed.characters.find(function (character) {
      return character.name === entry.title && entry.kind === "character"
    })

    if (matchingCharacter) {
      worldBibleEntryByCharacterLegacyId.set(matchingCharacter.legacyId, nextEntry.id)
    }

    return nextEntry
  })

  const sceneRefsByCanonLegacyId = new Map<string, string[]>()
  const sceneRefsByThreadLegacyId = new Map<string, string[]>()

  sceneMetadata.forEach(function (entry) {
    entry.parsed.setupRefs.forEach(function (ref) {
      if (ref.startsWith("CF")) {
        const current = sceneRefsByCanonLegacyId.get(ref) ?? []
        current.push(entry.sceneId)
        sceneRefsByCanonLegacyId.set(ref, current)
      }

      if (ref.startsWith("OT")) {
        const current = sceneRefsByThreadLegacyId.get(ref) ?? []
        current.push(entry.sceneId)
        sceneRefsByThreadLegacyId.set(ref, current)
      }
    })
  })

  const canonIdByLegacyId = new Map<string, string>()
  const canonLedger = parsed.canonFacts.map(function (fact) {
    const entryId = createUuid()
    canonIdByLegacyId.set(fact.legacyId, entryId)

    const sceneIds = uniqueStrings(sceneRefsByCanonLegacyId.get(fact.legacyId) ?? [firstSceneId])
    return {
      entryId,
      title: deriveCanonTitle(fact.fact),
      kind: deriveCanonKind(fact.fact, parsed.characters),
      summary: fact.fact,
      mentionCount: sceneIds.length,
      sceneIds,
      importance: deriveCanonImportance(fact.status),
      status: deriveCanonStatus(fact.status),
      category: fact.category,
      visibility: fact.visibility,
      enforcement: fact.enforcement
    }
  })

  const characterStateIdByLegacyId = new Map<string, string>()
  const characterLedger: BookCharacterState[] = parsed.characters.map(function (character) {
    const id = createUuid()
    characterStateIdByLegacyId.set(character.legacyId, id)

    return {
      id,
      characterEntryId: worldBibleEntryByCharacterLegacyId.get(character.legacyId) ?? createUuid(),
      characterName: character.name,
      currentState: character.currentState,
      innerShift: character.innerShift,
      agenda: character.agenda,
      updatedFromSceneId: firstSceneId,
      updatedAt: now,
      misreadRisk: character.misreadRisk,
      draftControls: character.draftControls,
      pressurePattern: character.pressurePattern,
      snapshots: [
        {
          id: createUuid(),
          scope: "baseline",
          sortOrder: 0,
          sourceSceneId: null,
          sourceChapterId: null,
          sourceLabel: "Baseline",
          currentState: character.currentState,
          innerShift: character.innerShift,
          agenda: character.agenda,
          capturedAt: now
        }
      ]
    }
  })

  const sceneIdsByActTitle = new Map<string, string[]>()
  sceneMetadata.forEach(function (entry) {
    const current = sceneIdsByActTitle.get(entry.parsed.actTitle) ?? []
    current.push(entry.sceneId)
    sceneIdsByActTitle.set(entry.parsed.actTitle, current)
  })

  const openThreadIdByLegacyId = new Map<string, string>()
  const openThreads: BookOpenThread[] = parsed.openThreads.map(function (thread) {
    const id = createUuid()
    openThreadIdByLegacyId.set(thread.legacyId, id)

    const sourceSceneId = sceneRefsByThreadLegacyId.get(thread.legacyId)?.[0] ?? firstSceneId
    const sourceSceneTitle =
      sceneMetadata.find(function (entry) {
        return entry.sceneId === sourceSceneId
      })?.parsed.sceneTitle ?? sceneMetadata[0]?.parsed.sceneTitle ?? "Auftakt"

    return {
      id,
      label: clampText(thread.detail.replace(/\?$/, ""), 96),
      detail: thread.detail,
      sourceSceneId,
      sourceSceneTitle,
      status: thread.status === "offen" ? "active" : "watch",
      priority: deriveThreadPriority(thread.legacyId, thread.detail),
      payoffSceneId: resolvePayoffSceneId(thread.payoffAct, sceneIdsByActTitle)
    }
  })

  const sceneCards: BookSceneCard[] = sceneMetadata.map(function (entry) {
    return {
      sceneId: entry.sceneId,
      sceneTitle: entry.parsed.sceneTitle,
      actTitle: entry.parsed.actTitle,
      chapterTitle: entry.parsed.chapterTitle,
      summary: entry.parsed.summary,
      excerpt: entry.parsed.excerpt,
      orderLabel: entry.parsed.orderLabel,
      chapterGoal: entry.parsed.chapterGoal,
      directives: entry.parsed.directives,
      outline: entry.parsed.outline,
      sceneFunction: entry.parsed.sceneFunction,
      readerQuestion: entry.parsed.readerQuestion,
      evidenceDelta: entry.parsed.evidenceDelta,
      trustShift: entry.parsed.trustShift,
      accessShift: entry.parsed.accessShift,
      lockedFields: entry.parsed.lockedFields,
      opusTaskMode: entry.parsed.opusTaskMode,
      escalationLevel: entry.parsed.escalationLevel,
      exitCondition: entry.parsed.exitCondition,
      overwriteRisk: entry.parsed.overwriteRisk
    }
  })

  const contextPacks: BookContextPack[] = sceneMetadata.map(function (entry, index) {
    const setupCanonIds = entry.parsed.setupRefs
      .filter(function (ref) {
        return ref.startsWith("CF")
      })
      .map(function (ref) {
        return canonIdByLegacyId.get(ref) ?? null
      })
      .filter(function (id): id is string {
        return Boolean(id)
      })
    const setupThreadIds = entry.parsed.setupRefs
      .filter(function (ref) {
        return ref.startsWith("OT")
      })
      .map(function (ref) {
        return openThreadIdByLegacyId.get(ref) ?? null
      })
      .filter(function (id): id is string {
        return Boolean(id)
      })

    const relevantCharacterStateIds = pickRelevantCharacterStateIds(
      entry.parsed,
      characterLedger,
      characterStateIdByLegacyId
    )

    return {
      id: entry.sceneId,
      sceneId: entry.sceneId,
      preparedAt: now,
      stablePrefixSignature: `${baseStory.id}:${entry.sceneId}:${slugify(parsed.title)}`,
      previousSceneIds: sceneMetadata
        .slice(Math.max(0, index - 2), index)
        .map(function (previousEntry) {
          return previousEntry.sceneId
        }),
      nextSceneId: sceneMetadata[index + 1]?.sceneId ?? null,
      relevantCanonEntryIds: uniqueStrings(setupCanonIds).slice(0, 4),
      relevantCharacterStateIds: relevantCharacterStateIds.slice(0, 4),
      activeThreadIds: (setupThreadIds.length ? uniqueStrings(setupThreadIds) : openThreads
        .filter(function (thread) {
          return thread.status === "active"
        })
        .slice(0, 4)
        .map(function (thread) {
          return thread.id
        })),
      runtimeContext: {
        masterBriefRuntime: parsed.masterBriefRuntime,
        writerRulesRuntime: parsed.writerRulesRuntime,
        threatModel: parsed.threatModel,
        sceneCard: {
          sceneFunction: entry.parsed.sceneFunction,
          readerQuestion: entry.parsed.readerQuestion,
          evidenceDelta: entry.parsed.evidenceDelta,
          trustShift: entry.parsed.trustShift,
          accessShift: entry.parsed.accessShift,
          lockedFields: entry.parsed.lockedFields,
          escalationLevel: entry.parsed.escalationLevel,
          exitCondition: entry.parsed.exitCondition,
          overwriteRisk: entry.parsed.overwriteRisk
        },
        relevantCanonFacts: uniqueStrings(setupCanonIds)
          .map(function (canonFactId) {
            const fact = canonLedger.find(function (entry) {
              return entry.entryId === canonFactId
            })

            return fact
              ? {
                  entryId: fact.entryId,
                  title: fact.title,
                  category: fact.category,
                  visibility: fact.visibility,
                  enforcement: fact.enforcement
                }
              : null
          })
          .filter(function (
            fact
          ): fact is BookContextPack["runtimeContext"]["relevantCanonFacts"][number] {
            return Boolean(fact)
          }),
        relevantCharacters: relevantCharacterStateIds
          .slice(0, 4)
          .map(function (characterStateId) {
            const state = characterLedger.find(function (entry) {
              return entry.id === characterStateId
            })

            return state
              ? {
                  id: state.id,
                  characterName: state.characterName,
                  misreadRisk: state.misreadRisk,
                  draftControls: state.draftControls,
                  pressurePattern: state.pressurePattern
                }
              : null
          })
          .filter(function (
            state
          ): state is BookContextPack["runtimeContext"]["relevantCharacters"][number] {
            return Boolean(state)
          })
      }
    }
  })

  const nextBook = {
    ...blueprint,
    activePhase: "phase_2_memory" as const,
    targetLengthWords: parsed.targetLengthWords,
    masterBrief: parsed.masterBrief,
    masterBriefRuntime: parsed.masterBriefRuntime,
    marketBrief: parsed.marketBrief,
    writerConstitution: parsed.writerConstitution,
    writerRulesRuntime: parsed.writerRulesRuntime,
    threatModel: parsed.threatModel,
    memory: {
      lastSyncedAt: now,
      canonLedger,
      characterLedger,
      openThreads,
      sceneCards,
      contextPacks,
      continuityNotes: []
    },
    draftEngine: {
      ...blueprint.draftEngine,
      targetSceneWordsMin: 900,
      targetSceneWordsMax: 1700,
      jobs: []
    }
  }

  return {
    ...baseStory,
    title: parsed.title,
    authorName: parsed.authorName,
    meta: {
      ...baseStory.meta,
      genre: parsed.genre,
      language: "de",
      audience: "Adult"
    },
    worldBible,
    acts,
    book: nextBook
  }
}

async function overwriteBookMemory(story: StoryDocument) {
  const sceneIds = story.acts.flatMap(function (act) {
    return act.chapters.flatMap(function (chapter) {
      return chapter.scenes.map(function (scene) {
        return scene.id
      })
    })
  })

  await deleteByStoryId("book_character_state_snapshots", story.id)
  await deleteByStoryId("book_character_states", story.id)
  await deleteByStoryId("book_open_threads", story.id)
  await deleteByStoryId("book_scene_cards", story.id)
  await deleteByStoryId("book_canon_facts", story.id)

  if (sceneIds.length) {
    await deleteByColumnValues("book_canon_fact_scene_refs", "scene_id", sceneIds)
    await deleteByColumnValues("book_context_pack_threads", "context_pack_id", sceneIds)
    await deleteByColumnValues("book_context_pack_character_states", "context_pack_id", sceneIds)
    await deleteByColumnValues("book_context_pack_canon_facts", "context_pack_id", sceneIds)
  }

  await deleteByStoryId("book_context_packs", story.id)

  await upsertRows(
    "book_canon_facts",
    story.book.memory.canonLedger.map(function (fact) {
      return {
        id: fact.entryId,
        workspace_id: story.workspaceId,
        story_id: story.id,
        source_world_bible_entry_id: findWorldBibleSourceId(story.worldBible, fact),
        title: fact.title,
        kind: fact.kind,
        summary: fact.summary,
        mention_count: fact.mentionCount,
        importance: fact.importance,
        status: fact.status,
        pipeline_meta: {
          category: fact.category,
          visibility: fact.visibility,
          enforcement: fact.enforcement
        }
      }
    }),
    "id"
  )

  await insertRows(
    "book_canon_fact_scene_refs",
    story.book.memory.canonLedger.flatMap(function (fact) {
      return fact.sceneIds.map(function (sceneId) {
        return {
          canon_fact_id: fact.entryId,
          scene_id: sceneId
        }
      })
    })
  )

  await upsertRows(
    "book_character_states",
    story.book.memory.characterLedger.map(function (state) {
      return {
        id: state.id,
        workspace_id: story.workspaceId,
        story_id: story.id,
        world_bible_entry_id: state.characterEntryId || null,
        character_name: state.characterName,
        current_state: state.currentState,
        inner_shift: state.innerShift,
        agenda: state.agenda,
        updated_from_scene_id: state.updatedFromSceneId || null,
        state_updated_at: state.updatedAt,
        pipeline_meta: {
          misreadRisk: state.misreadRisk,
          draftControls: state.draftControls,
          pressurePattern: state.pressurePattern
        }
      }
    }),
    "id"
  )

  await upsertRows(
    "book_character_state_snapshots",
    story.book.memory.characterLedger.flatMap(function (state) {
      return state.snapshots.map(function (snapshot) {
        return {
          id: snapshot.id,
          workspace_id: story.workspaceId,
          story_id: story.id,
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
    }),
    "id"
  )

  await upsertRows(
    "book_open_threads",
    story.book.memory.openThreads.map(function (thread) {
      return {
        id: thread.id,
        workspace_id: story.workspaceId,
        story_id: story.id,
        label: thread.label,
        detail: thread.detail,
        source_scene_id: thread.sourceSceneId || null,
        status: thread.status,
        priority: thread.priority,
        payoff_scene_id: thread.payoffSceneId
      }
    }),
    "id"
  )

  await insertRows(
    "book_scene_cards",
    story.book.memory.sceneCards.map(function (sceneCard) {
      return {
        workspace_id: story.workspaceId,
        story_id: story.id,
        scene_id: sceneCard.sceneId,
        act_title: sceneCard.actTitle,
        chapter_title: sceneCard.chapterTitle,
        scene_title: sceneCard.sceneTitle,
        summary: sceneCard.summary,
        excerpt: sceneCard.excerpt,
        order_label: sceneCard.orderLabel,
        chapter_goal: sceneCard.chapterGoal,
        directives: sceneCard.directives,
        outline: sceneCard.outline,
        pipeline_meta: {
          sceneFunction: sceneCard.sceneFunction,
          readerQuestion: sceneCard.readerQuestion,
          evidenceDelta: sceneCard.evidenceDelta,
          trustShift: sceneCard.trustShift,
          accessShift: sceneCard.accessShift,
          lockedFields: sceneCard.lockedFields,
          opusTaskMode: sceneCard.opusTaskMode,
          escalationLevel: sceneCard.escalationLevel,
          exitCondition: sceneCard.exitCondition,
          overwriteRisk: sceneCard.overwriteRisk
        }
      }
    })
  )

  await upsertRows(
    "book_context_packs",
    story.book.memory.contextPacks.map(function (pack) {
      return {
        id: pack.id,
        workspace_id: story.workspaceId,
        story_id: story.id,
        scene_id: pack.sceneId,
        stable_prefix_signature: pack.stablePrefixSignature,
        previous_scene_ids: pack.previousSceneIds,
        next_scene_id: pack.nextSceneId,
        prepared_at: pack.preparedAt,
        runtime_context: pack.runtimeContext
      }
    }),
    "id"
  )

  await insertRows(
    "book_context_pack_canon_facts",
    story.book.memory.contextPacks.flatMap(function (pack) {
      return pack.relevantCanonEntryIds.map(function (canonFactId, index) {
        return {
          context_pack_id: pack.id,
          canon_fact_id: canonFactId,
          sort_order: index + 1
        }
      })
    })
  )

  await insertRows(
    "book_context_pack_character_states",
    story.book.memory.contextPacks.flatMap(function (pack) {
      return pack.relevantCharacterStateIds.map(function (characterStateId, index) {
        return {
          context_pack_id: pack.id,
          character_state_id: characterStateId,
          sort_order: index + 1
        }
      })
    })
  )

  await insertRows(
    "book_context_pack_threads",
    story.book.memory.contextPacks.flatMap(function (pack) {
      return pack.activeThreadIds.map(function (threadId, index) {
        return {
          context_pack_id: pack.id,
          thread_id: threadId,
          sort_order: index + 1
        }
      })
    })
  )

  const bookProjectUpdate = await supabaseAdmin
    .from("book_projects")
    .update({
      memory_last_synced_at: story.book.memory.lastSyncedAt,
      master_brief_runtime: story.book.masterBriefRuntime,
      writer_rules_runtime: story.book.writerRulesRuntime,
      threat_model: story.book.threatModel
    })
    .eq("story_id", story.id)

  if (bookProjectUpdate.error) {
    throw new Error(`book_projects update: ${bookProjectUpdate.error.message}`)
  }
}

function parseRegie(
  markdown: string,
  titleOverride?: string | null,
  authorOverride?: string | null
): ParsedRegie {
  const productionMarkdown = markdown.split(/\nWo noch Stolpersteine liegen koennten|\nWo noch Stolpersteine liegen könnten/)[0]
  const headerTitle = matchSingle(productionMarkdown, /^# EMBER Story Document — „(.+?)[”"]/m)
  const authorName = authorOverride || matchSingle(productionMarkdown, /^> Autor: (.+)$/m) || ""
  const masterBriefRows = parseMarkdownTable(getTopLevelSection(productionMarkdown, "MASTER BRIEF"))
  const masterBriefRuntime = parseMasterBriefRuntime(
    getOptionalTopLevelSection(productionMarkdown, "MASTER BRIEF RUNTIME")
  )
  const marketBriefSection = getTopLevelSection(productionMarkdown, "MARKET BRIEF")
  const marketBriefRows = parseMarkdownTable(marketBriefSection)
  const writerSection = getTopLevelSection(productionMarkdown, "WRITER CONSTITUTION")
  const writerRulesRuntime = parseWriterRulesRuntime(
    getOptionalTopLevelSection(productionMarkdown, "WRITER RULES RUNTIME")
  )
  const threatModel = parseThreatModel(
    getOptionalTopLevelSection(productionMarkdown, "THREAT MODEL")
  )
  const worldBibleSection = getTopLevelSection(productionMarkdown, "WORLD BIBLE")
  const writerSummariesSection = getOptionalTopLevelSection(
    productionMarkdown,
    "WRITER-SUMMARIES — KAPITEL 1 BIS 12"
  )
  const canonFacts = parseJsonBlock<{
    canon_facts: Array<{
      id: string
      fact: string
      status: string
      category?: StoryDocument["book"]["memory"]["canonLedger"][number]["category"]
      visibility?: StoryDocument["book"]["memory"]["canonLedger"][number]["visibility"]
      enforcement?: StoryDocument["book"]["memory"]["canonLedger"][number]["enforcement"]
    }>
  }>(
    getTopLevelSection(productionMarkdown, "CANON FACTS (Initial — Stand: vor Kapitel 1)")
  ).canon_facts.map(function (fact) {
    return {
      legacyId: fact.id,
      fact: fact.fact,
      status: fact.status,
      category: normalizeCanonCategory(fact.category),
      visibility: normalizeCanonVisibility(fact.visibility),
      enforcement: normalizeCanonEnforcement(fact.enforcement)
    }
  })
  const characters = parseCharacters(getTopLevelSection(productionMarkdown, "CHARACTER STATE LEDGER"))
  const openThreads = parseJsonBlock<{ open_threads: Array<{ id: string; thread: string; status: string; payoff_act?: string }> }>(
    getTopLevelSection(productionMarkdown, "OPEN THREADS (Initial)")
  ).open_threads.map(function (thread) {
    return {
      legacyId: thread.id,
      detail: thread.thread,
      status: thread.status,
      payoffAct: thread.payoff_act ?? null
    }
  })
  const writerSummaries = parseWriterSummaries(writerSummariesSection)
  const scenes = parseScenes(productionMarkdown, writerSummaries)
  const defaultBook = createDefaultBookBlueprint(titleOverride || masterBriefRows["Arbeitstitel"] || headerTitle || "Neues Projekt")
  const title = titleOverride || masterBriefRows["Arbeitstitel"] || headerTitle || "Neues Projekt"
  const genre = masterBriefRows["Genre"] || ""
  const targetLengthWords = parseTargetWordCount(masterBriefRows["Ziel-Wortanzahl"]) || defaultBook.targetLengthWords
  const premise = getFirstTableValue(masterBriefRows, ["Prämisse", "Praemisse"])
  const thematicCore = getFirstTableValue(masterBriefRows, ["Thematischer Kern"])

  return {
    title,
    authorName,
    genre,
    targetLengthWords,
    masterBrief: {
      ...defaultBook.masterBrief,
      premise,
      readerPromise: masterBriefRows["Reader Promise"] || "",
      endingPromise: masterBriefRows["Ending Promise"] || "",
      thematicCore
    },
    masterBriefRuntime: {
      ...createDefaultBookMasterBriefRuntime(),
      premise: masterBriefRuntime.premise || premise,
      readerPromise: masterBriefRuntime.readerPromise || masterBriefRows["Reader Promise"] || "",
      endingPromise: masterBriefRuntime.endingPromise || masterBriefRows["Ending Promise"] || "",
      thematicCore: masterBriefRuntime.thematicCore || thematicCore,
      povRule: masterBriefRuntime.povRule || masterBriefRows["POV-Strategie"] || "",
      antagonistRule: masterBriefRuntime.antagonistRule
    },
    marketBrief: {
      ...defaultBook.marketBrief,
      amazonGoal: marketBriefRows["Amazon Goal"] || "",
      categoryLane: marketBriefRows["Category Lane"] || "",
      hook: marketBriefRows["Commercial Hook"] || "",
      seriesPotential: marketBriefRows["Serienpotenzial"] || "",
      coverDirection: marketBriefRows["Cover-Richtung"] || "",
      publishingGuardrails: uniqueStrings(
        defaultBook.marketBrief.publishingGuardrails.concat(parseBulletLines(marketBriefSection))
      )
    },
    writerConstitution: parseBulletLines(writerSection),
    writerRulesRuntime,
    threatModel,
    worldBibleEntries: buildWorldBibleEntries(worldBibleSection, characters, thematicCore),
    canonFacts,
    characters,
    openThreads,
    scenes
  }
}

function getFirstTableValue(
  rows: Record<string, string>,
  keys: string[]
) {
  for (const key of keys) {
    const value = rows[key]
    if (typeof value === "string" && value.trim()) {
      return value
    }
  }

  return ""
}

function parseMasterBriefRuntime(section: string): StoryDocument["book"]["masterBriefRuntime"] {
  const record = parseYamlFenceBlock(section)

  return {
    ...createDefaultBookMasterBriefRuntime(),
    premise: typeof record.premise === "string" ? record.premise : "",
    readerPromise: typeof record.reader_promise === "string" ? record.reader_promise : "",
    endingPromise: typeof record.ending_promise === "string" ? record.ending_promise : "",
    thematicCore: typeof record.thematic_core === "string" ? record.thematic_core : "",
    povRule: typeof record.pov_rule === "string" ? record.pov_rule : "",
    antagonistRule: typeof record.antagonist_rule === "string" ? record.antagonist_rule : ""
  }
}

function parseWriterRulesRuntime(section: string): StoryDocument["book"]["writerRulesRuntime"] {
  const record = parseYamlFenceBlock(section)

  return {
    ...createDefaultBookWriterRulesRuntime(),
    globalStyle: normalizeStringArrayLoose(record.global_style),
    sceneMechanics: normalizeStringArrayLoose(record.scene_mechanics),
    hardBans: normalizeStringArrayLoose(record.hard_bans)
  }
}

function parseThreatModel(section: string): StoryDocument["book"]["threatModel"] {
  const record = parseYamlFenceBlock(section)

  return {
    ...createDefaultBookThreatModel(),
    antagonist: typeof record.antagonist === "string" ? record.antagonist : "",
    objective: typeof record.objective === "string" ? record.objective : "",
    operatingSystems: normalizeStringArrayLoose(record.operating_systems),
    escalationLogic: normalizeStringArrayLoose(record.escalation_logic),
    forbiddenCapabilities: normalizeStringArrayLoose(record.forbidden_capabilities),
    truthUnderHook: normalizeStringArrayLoose(record.truth_under_hook)
  }
}

function parseCharacters(section: string): ParsedCharacter[] {
  const matches = Array.from(
    section.matchAll(/### .+?\n```json\n([\s\S]*?)\n```/g)
  )

  return matches.map(function (match) {
    const record = JSON.parse(match[1]) as Record<string, any>
    const initialState = record.initial_state && typeof record.initial_state === "object" ? record.initial_state : null
    const role = typeof record.role === "string" ? record.role : typeof record.funktion === "string" ? record.funktion : ""
    const summaryParts = [
      typeof record.background === "string" ? record.background : "",
      typeof record.kern === "string" ? record.kern : "",
      typeof record.funktion_im_buch === "string" ? record.funktion_im_buch : "",
      typeof record.was_unklar_bleibt === "string" ? record.was_unklar_bleibt : ""
    ].filter(Boolean)
    const currentStateParts = initialState
      ? Object.values(initialState).filter(function (value) {
          return typeof value === "string" && value.trim().length > 0
        })
      : []
    const firstArcState = Array.isArray(record.arc) && record.arc[0] && typeof record.arc[0].state === "string"
      ? record.arc[0].state
      : ""

    return {
      legacyId: typeof record.character_id === "string" ? record.character_id : createUuid(),
      name: typeof record.name === "string" ? record.name : "Unbenannte Figur",
      role,
      summary: clampText(summaryParts.join(" "), 260),
      currentState: clampText(
        (currentStateParts as string[]).join(" ") || firstArcState || summaryParts[0] || role || "Noch keine explizite Charaktergrundlage.",
        240
      ),
      innerShift: clampText(
        getNestedString(record, ["wunde", "was_es_heute_macht"]) ||
          firstArcState ||
          "Noch keine explizite innere Verschiebung formuliert.",
        240
      ),
      agenda: clampText(
        String(
          getNestedString(record, ["wunde", "arc_abschluss"]) ||
            (typeof record.kern === "string" ? record.kern : "") ||
            (typeof record.funktion === "string" ? record.funktion : "") ||
            role ||
            "Noch keine explizite Agenda."
        ),
        240
      ),
      misreadRisk: {
        byInstitutions: getNestedString(record, ["misread_risk", "by_institutions"]) || "",
        byOtherCharacters: getNestedString(record, ["misread_risk", "by_other_characters"]) || "",
        byReaderEarly: getNestedString(record, ["misread_risk", "by_reader_early"]) || ""
      },
      draftControls: {
        mustShow: getNestedStringArray(record, ["draft_controls", "must_show"]),
        mustAvoid: getNestedStringArray(record, ["draft_controls", "must_avoid"])
      },
      pressurePattern: record.pressure_pattern && typeof record.pressure_pattern === "object"
        ? {
            underStressDoes: getNestedStringArray(record, ["pressure_pattern", "under_stress_does"]),
            underStressShouldNotDo: getNestedStringArray(record, ["pressure_pattern", "under_stress_should_not_do"])
          }
        : null
    }
  })
}

function parseScenes(markdown: string, writerSummaries: ParsedWriterSummary[]): ParsedScene[] {
  const lines = markdown.split(/\r?\n/)
  const scenes: ParsedScene[] = []
  const writerSummaryByChapterTitle = new Map(
    writerSummaries.map(function (entry) {
      return [normalizeText(entry.chapterTitle), entry]
    })
  )
  let currentActKey = ""
  let currentActTitle = ""

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    if (line.startsWith("### ACT ")) {
      currentActKey = line.replace(/^###\s*/, "").trim()
      currentActTitle = extractQuotedTitle(line) || currentActKey
      continue
    }

    if (!line.startsWith("#### ")) {
      continue
    }

    const rawChapterHeading = line.replace(/^####\s*/, "").trim()
    const chapterTitle = normalizeChapterTitle(rawChapterHeading)
    let blockStart = -1

    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (lines[cursor].trim() === "```") {
        blockStart = cursor + 1
        break
      }

      if (lines[cursor].startsWith("#### ") || lines[cursor].startsWith("### ") || lines[cursor].startsWith("## ")) {
        break
      }
    }

    if (blockStart === -1) {
      continue
    }

    let blockEnd = blockStart
    while (blockEnd < lines.length && lines[blockEnd].trim() !== "```") {
      blockEnd += 1
    }

    const parsedBlock = parseSceneCardBlock(lines.slice(blockStart, blockEnd))
    const goal = parsedBlock.directives.objective || chapterTitle
    const coreAction = parsedBlock.directives.coreAction || parsedBlock.directives.dramaticBeat || goal
    const writerSummary = writerSummaryByChapterTitle.get(normalizeText(chapterTitle))
    const summary = writerSummary?.summary?.trim()
      ? clampText(writerSummary.summary.trim(), 1200)
      : clampText(`${goal} ${coreAction}`.trim(), 220)
    const excerpt = clampText(coreAction, 220)

    scenes.push({
      legacyId: parsedBlock.legacyId,
      actKey: currentActKey || "ACT 1",
      actTitle: currentActTitle || "Act",
      chapterTitle,
      sceneTitle: chapterTitle,
      orderLabel: parsedBlock.legacyId,
      summary,
      excerpt,
      chapterGoal: goal,
      directives: parsedBlock.directives,
      outline: buildOutlineLines(parsedBlock.directives, parsedBlock.custom),
      sceneFunction: parsedBlock.sceneFunction,
      readerQuestion: parsedBlock.readerQuestion,
      evidenceDelta: parsedBlock.evidenceDelta,
      trustShift: parsedBlock.trustShift,
      accessShift: parsedBlock.accessShift,
      lockedFields: parsedBlock.lockedFields,
      opusTaskMode: parsedBlock.opusTaskMode,
      escalationLevel: parsedBlock.escalationLevel,
      exitCondition: parsedBlock.exitCondition,
      overwriteRisk: parsedBlock.overwriteRisk,
      setupRefs: parsedBlock.setupRefs,
      rawText: lines.slice(index, blockEnd + 1).join("\n")
    })

    index = blockEnd
  }

  return scenes
}

function parseSceneCardBlock(lines: string[]) {
  const directives = createEmptyBookSceneCardDirectives()
  const custom: Array<{ key: string; value: string }> = []
  const record = parseIndentedYamlObject(
    lines.filter(function (line) {
      return line.trim() !== "Scene Card"
    })
  )
  let legacyId = typeof record.id === "string" ? record.id : createUuid()
  let setupRefs = normalizeCommaList(record.setup)

  Object.entries(record).forEach(function ([rawKey, rawValue]) {
    const normalized = normalizeKey(rawKey)
    const value = stringifyYamlScalar(rawValue)

    if (!value && !Array.isArray(rawValue)) {
      return
    }

    if (normalized === "id") {
      legacyId = value || legacyId
      return
    }

    if (
      normalized === "scene_function" ||
      normalized === "reader_question" ||
      normalized === "evidence_delta" ||
      normalized === "trust_shift" ||
      normalized === "access_shift" ||
      normalized === "locked_fields" ||
      normalized === "opus_task_mode" ||
      normalized === "escalation_level" ||
      normalized === "exit_condition" ||
      normalized === "overwrite_risk"
    ) {
      return
    }

    if (normalized === "setup") {
      setupRefs = normalizeCommaList(rawValue)
      if (value) {
        custom.push({ key: "setup", value })
      }
      return
    }

    if (normalized === "pov") {
      directives.pov = value
      return
    }

    if (normalized === "ort" || normalized === "location") {
      directives.location = value
      return
    }

    if (normalized === "uhrzeit" || normalized === "time_anchor" || normalized === "timeanchor") {
      directives.timeAnchor = value
      return
    }

    if (normalized === "ziel" || normalized === "objective") {
      directives.objective = value
      return
    }

    if (normalized === "opening" || normalized === "einstieg") {
      directives.opening = value
      return
    }

    if (normalized === "core_action" || normalized === "coreaction" || normalized === "kern_aktion") {
      directives.coreAction = value
      return
    }

    if (normalized === "dramatic_beat" || normalized === "dramaticbeat" || normalized === "beat") {
      directives.dramaticBeat = value
      return
    }

    if (normalized === "ending" || normalized === "ende") {
      directives.ending = value
      return
    }

    if (normalized === "letzter_satz" || normalized === "closing_line" || normalized === "closingline") {
      directives.closingLine = value
      return
    }

    if (Array.isArray(rawValue)) {
      rawValue.forEach(function (entry) {
        const item = stringifyYamlScalar(entry)
        if (item) {
          custom.push({ key: rawKey, value: item })
        }
      })
      return
    }

    if (value) {
      custom.push({ key: rawKey, value })
    }
  })

  directives.custom = custom

  return {
    legacyId,
    directives,
    custom,
    setupRefs,
    sceneFunction: normalizeStringArrayLoose(record.scene_function),
    readerQuestion: typeof record.reader_question === "string" ? record.reader_question : "",
    evidenceDelta: {
      before: getObjectString(record.evidence_delta, "before"),
      after: getObjectString(record.evidence_delta, "after")
    },
    trustShift: typeof record.trust_shift === "string" ? record.trust_shift : "",
    accessShift: typeof record.access_shift === "string" ? record.access_shift : "",
    lockedFields: normalizeStringArrayLoose(record.locked_fields),
    opusTaskMode: {
      planning: getObjectString(record.opus_task_mode, "planning"),
      draft: getObjectString(record.opus_task_mode, "draft"),
      rewrite: getObjectString(record.opus_task_mode, "rewrite"),
      expand: getObjectString(record.opus_task_mode, "expand")
    },
    escalationLevel: normalizeNullableInteger(record.escalation_level),
    exitCondition: typeof record.exit_condition === "string" ? record.exit_condition : "",
    overwriteRisk: normalizeStringArrayLoose(record.overwrite_risk)
  }
}

function parseWriterSummaries(section: string): ParsedWriterSummary[] {
  if (!section.trim()) {
    return []
  }

  const lines = section.split(/\r?\n/)
  const summaries: ParsedWriterSummary[] = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim()

    if (!line.startsWith("### ")) {
      continue
    }

    const chapterTitle = normalizeChapterTitle(line.replace(/^###\s*/, "").trim())
    let summary = ""
    let directorNote: string | null = null

    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const current = lines[cursor].trim()

      if (current.startsWith("### ")) {
        index = cursor - 1
        break
      }

      if (current === "**Writer Summary**") {
        const collected: string[] = []

        for (let summaryCursor = cursor + 1; summaryCursor < lines.length; summaryCursor += 1) {
          const summaryLine = lines[summaryCursor].trim()

          if (
            summaryLine === "**Director Note**" ||
            summaryLine.startsWith("### ")
          ) {
            cursor = summaryCursor - 1
            break
          }

          if (summaryLine) {
            collected.push(summaryLine)
          }

          if (summaryCursor === lines.length - 1) {
            cursor = summaryCursor
          }
        }

        summary = collected.join(" ").trim()
        continue
      }

      if (current === "**Director Note**") {
        const collected: string[] = []

        for (let noteCursor = cursor + 1; noteCursor < lines.length; noteCursor += 1) {
          const noteLine = lines[noteCursor].trim()

          if (noteLine.startsWith("### ")) {
            index = noteCursor - 1
            break
          }

          if (noteLine) {
            collected.push(noteLine)
          }

          if (noteCursor === lines.length - 1) {
            index = noteCursor
          }
        }

        directorNote = collected.join(" ").trim() || null
        break
      }

      if (cursor === lines.length - 1) {
        index = cursor
      }
    }

    if (summary) {
      summaries.push({
        chapterTitle,
        summary,
        directorNote
      })
    }
  }

  return summaries
}

function buildWorldBibleEntries(
  worldBibleSection: string,
  characters: ParsedCharacter[],
  thematicCore: string
): WorldBibleEntry[] {
  const entries: WorldBibleEntry[] = characters.map(function (character) {
    return {
      id: createUuid(),
      title: character.name,
      kind: "character",
      summary: clampText([character.role, character.summary].filter(Boolean).join(" — "), 260)
    }
  })

  const locationEntries: Array<{ title: string; summary: string }> = []

  if (worldBibleSection.includes("Rheinstadt")) {
    locationEntries.push({
      title: "Rheinstadt",
      summary: "Fiktive deutsche Grossstadt der Gegenwart; institutionell kalt, politisch aufmerksam, ohne Gothic-Ueberhoehung."
    })
  }

  if (worldBibleSection.includes("Hohenhort")) {
    locationEntries.push({
      title: "Forensische Klinik Hohenhort",
      summary: "Hochsicherheitsabteilung fuer schwere Gewalt- und Sexualdelikte; funktionaler Gespraechsraum, Protokolldruck und institutionelle Eigeninteressen."
    })
  }

  const objectEntries: Array<{ title: string; summary: string }> = [
    {
      title: "Prognosegutachten",
      summary: "Externes forensisches Gutachten mit hohem Einfluss auf eine Lockerungsentscheidung und maximale Fallhoehe fuer Fehr."
    },
    {
      title: "Unbegleitete Lockerung",
      summary: "Konkrete Verfahrensfrage des Romans: nicht Freiheit, sondern die erste externe Lockerungsstufe mit maximaler institutioneller Sprengkraft."
    }
  ]

  const themeEntries: Array<{ title: string; summary: string }> = thematicCore
    ? [
        {
          title: "Objektivitaet und Schuld",
          summary: clampText(thematicCore, 260)
        }
      ]
    : []

  return dedupeWorldBible(entries
    .concat(
      locationEntries.map(function (entry) {
        return { id: createUuid(), title: entry.title, kind: "location" as const, summary: entry.summary }
      })
    )
    .concat(
      objectEntries.map(function (entry) {
        return { id: createUuid(), title: entry.title, kind: "object" as const, summary: entry.summary }
      })
    )
    .concat(
      themeEntries.map(function (entry) {
        return { id: createUuid(), title: entry.title, kind: "theme" as const, summary: entry.summary }
      })
    ))
}

function buildOutlineLines(
  directives: ReturnType<typeof createEmptyBookSceneCardDirectives>,
  custom: Array<{ key: string; value: string }>
) {
  const lines = [
    directives.pov ? `pov: ${directives.pov}` : null,
    directives.location ? `ort: ${directives.location}` : null,
    directives.timeAnchor ? `uhrzeit: ${directives.timeAnchor}` : null,
    directives.objective ? `ziel: ${directives.objective}` : null,
    directives.opening ? `einstieg: ${directives.opening}` : null,
    directives.coreAction ? `kern_aktion: ${directives.coreAction}` : null,
    directives.dramaticBeat ? `beat: ${directives.dramaticBeat}` : null,
    directives.ending ? `ende: ${directives.ending}` : null,
    directives.closingLine ? `letzter_satz: ${directives.closingLine}` : null
  ].filter(function (line): line is string {
    return Boolean(line)
  })

  return lines.concat(
    custom
      .filter(function (entry) {
        return entry.key.toLowerCase() !== "setup"
      })
      .map(function (entry) {
        return `${entry.key}: ${entry.value}`
      })
  )
}

function pickRelevantCharacterStateIds(
  scene: ParsedScene,
  characterLedger: BookCharacterState[],
  characterStateIdByLegacyId: Map<string, string>
) {
  const raw = normalizeText(scene.rawText)
  const names = characterLedger.filter(function (entry) {
    return raw.includes(normalizeText(entry.characterName))
  }).map(function (entry) {
    return entry.id
  })

  const povMatch = Array.from(characterStateIdByLegacyId.entries()).find(function ([legacyId]) {
    return scene.directives.pov && normalizeText(scene.directives.pov).includes(normalizeText(legacyId))
  })?.[1]

  const relevantIds: string[] = []

  if (povMatch) {
    relevantIds.push(povMatch)
  }

  relevantIds.push.apply(relevantIds, names)

  return uniqueStrings(relevantIds)
}

function parseYamlFenceBlock(section: string) {
  if (!section.trim()) {
    return {}
  }

  const match = section.match(/```ya?ml\n([\s\S]*?)\n```/)

  if (!match) {
    return {}
  }

  return parseIndentedYamlObject(match[1].split(/\r?\n/))
}

function parseIndentedYamlObject(lines: string[]) {
  const filtered = lines
    .map(function (line) {
      return line.replace(/\t/g, "  ")
    })
    .filter(function (line) {
      return Boolean(line.trim())
    })

  if (!filtered.length) {
    return {}
  }

  const minIndent = filtered.reduce(function (lowest, line) {
    const indent = countIndent(line)
    return lowest === null || indent < lowest ? indent : lowest
  }, null as number | null) ?? 0

  return parseYamlObjectAtIndent(filtered, 0, minIndent).value
}

function parseYamlObjectAtIndent(lines: string[], startIndex: number, indent: number): {
  value: Record<string, unknown>
  nextIndex: number
} {
  const value: Record<string, unknown> = {}
  let index = startIndex

  while (index < lines.length) {
    const line = lines[index]
    const currentIndent = countIndent(line)

    if (currentIndent < indent) {
      break
    }

    if (currentIndent > indent) {
      index += 1
      continue
    }

    const trimmed = line.trim()

    if (trimmed.startsWith("- ")) {
      break
    }

    const separatorIndex = trimmed.indexOf(":")

    if (separatorIndex === -1) {
      index += 1
      continue
    }

    const rawKey = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()

    if (rawValue) {
      value[rawKey] = parseYamlScalar(rawValue)
      index += 1
      continue
    }

    const nextIndex = findNextMeaningfulLine(lines, index + 1)

    if (nextIndex === -1) {
      value[rawKey] = ""
      index += 1
      continue
    }

    const nextIndent = countIndent(lines[nextIndex])

    if (nextIndent <= currentIndent) {
      value[rawKey] = ""
      index += 1
      continue
    }

    if (lines[nextIndex].trim().startsWith("- ")) {
      const parsedArray = parseYamlArrayAtIndent(lines, nextIndex, nextIndent)
      value[rawKey] = parsedArray.value
      index = parsedArray.nextIndex
      continue
    }

    const parsedObject = parseYamlObjectAtIndent(lines, nextIndex, nextIndent)
    value[rawKey] = parsedObject.value
    index = parsedObject.nextIndex
  }

  return { value, nextIndex: index }
}

function parseYamlArrayAtIndent(lines: string[], startIndex: number, indent: number): {
  value: unknown[]
  nextIndex: number
} {
  const value: unknown[] = []
  let index = startIndex

  while (index < lines.length) {
    const line = lines[index]
    const currentIndent = countIndent(line)

    if (currentIndent < indent) {
      break
    }

    if (currentIndent !== indent || !line.trim().startsWith("- ")) {
      index += 1
      continue
    }

    value.push(parseYamlScalar(line.trim().replace(/^- /, "").trim()))
    index += 1
  }

  return { value, nextIndex: index }
}

function findNextMeaningfulLine(lines: string[], startIndex: number) {
  for (let index = startIndex; index < lines.length; index += 1) {
    if (lines[index].trim()) {
      return index
    }
  }

  return -1
}

function countIndent(line: string) {
  const match = line.match(/^ */)
  return match ? match[0].length : 0
}

function parseYamlScalar(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ""
  }

  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }

  if (/^-?\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10)
  }

  return trimmed
}

function stringifyYamlScalar(value: unknown) {
  if (typeof value === "string") {
    return value.trim()
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  return ""
}

function normalizeStringArrayLoose(value: unknown) {
  return Array.isArray(value)
    ? value
        .map(function (entry) {
          return stringifyYamlScalar(entry)
        })
        .filter(Boolean)
    : []
}

function normalizeCommaList(value: unknown) {
  if (Array.isArray(value)) {
    return normalizeStringArrayLoose(value)
  }

  if (typeof value !== "string") {
    return []
  }

  return value
    .split(",")
    .map(function (entry) {
      return entry.trim()
    })
    .filter(Boolean)
}

function getObjectString(value: unknown, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return ""
  }

  const record = value as Record<string, unknown>
  return typeof record[key] === "string" ? record[key] : ""
}

function normalizeNullableInteger(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : null
}

function normalizeCanonCategory(value: unknown): StoryDocument["book"]["memory"]["canonLedger"][number]["category"] {
  if (
    value === "family" ||
    value === "institution" ||
    value === "access" ||
    value === "routine" ||
    value === "threat" ||
    value === "history" ||
    value === "subtext"
  ) {
    return value
  }

  return "subtext"
}

function normalizeCanonVisibility(value: unknown): StoryDocument["book"]["memory"]["canonLedger"][number]["visibility"] {
  if (value === "reader_known" || value === "reader_hidden" || value === "subtext") {
    return value
  }

  return "reader_known"
}

function normalizeCanonEnforcement(value: unknown): StoryDocument["book"]["memory"]["canonLedger"][number]["enforcement"] {
  if (value === "hard" || value === "soft") {
    return value
  }

  return "soft"
}

function parseMarkdownTable(section: string) {
  return section
    .split(/\r?\n/)
    .filter(function (line) {
      return line.startsWith("| **")
    })
    .reduce(function (rows, line) {
      const cells = line
        .split("|")
        .map(function (cell) {
          return cell.trim()
        })
        .filter(Boolean)

      if (cells.length < 2) {
        return rows
      }

      rows[cells[0].replace(/\*\*/g, "")] = cells[1]
      return rows
    }, {} as Record<string, string>)
}

function getTopLevelSection(markdown: string, heading: string) {
  const marker = `## ${heading}`
  const startIndex = markdown.indexOf(marker)

  if (startIndex === -1) {
    throw new Error(`Abschnitt nicht gefunden: ${heading}`)
  }

  const afterHeadingIndex = startIndex + marker.length
  const nextHeadingIndex = markdown.indexOf("\n## ", afterHeadingIndex)
  const rawSection =
    nextHeadingIndex === -1
      ? markdown.slice(afterHeadingIndex)
      : markdown.slice(afterHeadingIndex, nextHeadingIndex)

  return rawSection.trim()
}

function getOptionalTopLevelSection(markdown: string, heading: string) {
  const marker = `## ${heading}`
  const startIndex = markdown.indexOf(marker)

  if (startIndex === -1) {
    return ""
  }

  const afterHeadingIndex = startIndex + marker.length
  const nextHeadingIndex = markdown.indexOf("\n## ", afterHeadingIndex)
  const rawSection =
    nextHeadingIndex === -1
      ? markdown.slice(afterHeadingIndex)
      : markdown.slice(afterHeadingIndex, nextHeadingIndex)

  return rawSection.trim()
}

function parseJsonBlock<T>(section: string): T {
  const match = section.match(/```json\n([\s\S]*?)\n```/)

  if (!match) {
    throw new Error("JSON-Block nicht gefunden.")
  }

  return JSON.parse(match[1]) as T
}

function parseBulletLines(section: string) {
  return section
    .split(/\r?\n/)
    .map(function (line) {
      return line.trim()
    })
    .filter(function (line) {
      return line.startsWith("- ")
    })
    .map(function (line) {
      return line.replace(/^- /, "").trim()
    })
}

function deriveCanonTitle(fact: string) {
  const doctorMatch = fact.match(/^Dr\.\s+[^,.;]+/)

  if (doctorMatch?.[0]) {
    return clampText(doctorMatch[0].trim(), 96)
  }

  const commaMatch = fact.match(/^[^,.;]+/)

  if (commaMatch?.[0]) {
    return clampText(commaMatch[0].trim(), 96)
  }

  return clampText(fact.trim(), 96)
}

function deriveCanonKind(fact: string, characters: ParsedCharacter[]): StoryDocument["book"]["memory"]["canonLedger"][number]["kind"] {
  const normalizedFact = normalizeText(fact)

  if (characters.some(function (character) {
    return normalizedFact.includes(normalizeText(character.name))
  })) {
    return "character"
  }

  if (
    normalizedFact.includes("klinik") ||
    normalizedFact.includes("rheinstadt") ||
    normalizedFact.includes("gespraechsraum")
  ) {
    return "location"
  }

  if (
    normalizedFact.includes("gutachten") ||
    normalizedFact.includes("anhoerung") ||
    normalizedFact.includes("lockerung")
  ) {
    return "object"
  }

  return "theme"
}

function deriveCanonImportance(status: string): "high" | "medium" | "low" {
  const normalized = normalizeText(status)

  if (normalized.includes("wunde") || normalized.includes("countdown") || normalized.includes("kern")) {
    return "high"
  }

  if (normalized.includes("subtext")) {
    return "medium"
  }

  return "medium"
}

function deriveCanonStatus(status: string): "active" | "watch" | "resolved" {
  const normalized = normalizeText(status)

  if (normalized.includes("subtext")) {
    return "watch"
  }

  return "active"
}

function deriveThreadPriority(legacyId: string, detail: string): "high" | "medium" | "low" {
  if (legacyId === "OT001" || legacyId === "OT003") {
    return "high"
  }

  if (normalizeText(detail).includes("verfahren") || normalizeText(detail).includes("gutachter")) {
    return "high"
  }

  return "medium"
}

function resolvePayoffSceneId(payoffAct: string | null, sceneIdsByActTitle: Map<string, string[]>) {
  if (!payoffAct) {
    return null
  }

  const normalized = normalizeText(payoffAct)
  const actNumberMatch = normalized.match(/act[_\s]?([0-9]+)/)

  if (!actNumberMatch) {
    return null
  }

  const expectedActPrefix = `act ${actNumberMatch[1]}`
  const matchingEntry = Array.from(sceneIdsByActTitle.entries()).find(function ([actTitle]) {
    return normalizeText(actTitle).includes(expectedActPrefix)
  })

  return matchingEntry?.[1]?.[matchingEntry[1].length - 1] ?? null
}

function parseTargetWordCount(value?: string | null) {
  if (!value) {
    return null
  }

  const matches = value.match(/[0-9.]+/g)

  if (!matches || matches.length === 0) {
    return null
  }

  const numbers = matches
    .map(function (match) {
      return Number(match.replace(/\./g, ""))
    })
    .filter(function (number) {
      return Number.isFinite(number) && number > 0
    })

  if (!numbers.length) {
    return null
  }

  if (numbers.length === 1) {
    return numbers[0]
  }

  return Math.round((numbers[0] + numbers[numbers.length - 1]) / 2)
}

function normalizeChapterTitle(rawHeading: string) {
  return extractQuotedTitle(rawHeading) || rawHeading.replace(/^Kapitel\s+\d+:\s*/, "").replace(/^Epilog:\s*/, "").trim()
}

function extractQuotedTitle(value: string) {
  const match = value.match(/„(.+?)[”"]/)
  return match?.[1]?.trim() ?? null
}

function normalizeKey(value: string) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function dedupeWorldBible(entries: WorldBibleEntry[]) {
  const seen = new Set<string>()

  return entries.filter(function (entry) {
    const key = `${entry.kind}:${normalizeText(entry.title)}`

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

async function deleteByStoryId(table: string, storyId: string) {
  const result = await supabaseAdmin.from(table).delete().eq("story_id", storyId)

  if (result.error) {
    throw new Error(`${table} delete: ${result.error.message}`)
  }
}

async function deleteByColumnValues(table: string, column: string, values: string[]) {
  if (!values.length) {
    return
  }

  const result = await supabaseAdmin.from(table).delete().in(column, values)

  if (result.error) {
    throw new Error(`${table} delete: ${result.error.message}`)
  }
}

async function insertRows(table: string, rows: Array<Record<string, unknown>>) {
  if (!rows.length) {
    return
  }

  const result = await supabaseAdmin.from(table).insert(rows)

  if (result.error) {
    throw new Error(`${table} insert: ${result.error.message}`)
  }
}

async function upsertRows(table: string, rows: Array<Record<string, unknown>>, onConflict: string) {
  if (!rows.length) {
    return
  }

  const result = await supabaseAdmin.from(table).upsert(rows, {
    onConflict
  })

  if (result.error) {
    throw new Error(`${table} upsert: ${result.error.message}`)
  }
}

function findWorldBibleSourceId(
  worldBible: WorldBibleEntry[],
  fact: StoryDocument["book"]["memory"]["canonLedger"][number]
) {
  return (
    worldBible.find(function (entry) {
      return entry.id === fact.entryId || entry.title === fact.title
    })?.id ?? null
  )
}

function clampText(value: string, maxLength: number) {
  const compact = value.replace(/\s+/g, " ").trim()

  if (compact.length <= maxLength) {
    return compact
  }

  return `${compact.slice(0, maxLength - 1).trim()}…`
}

function matchSingle(value: string, pattern: RegExp) {
  return value.match(pattern)?.[1]?.trim() ?? null
}

function getNestedString(record: Record<string, any>, pathSegments: string[]) {
  let current: any = record

  for (const segment of pathSegments) {
    if (!current || typeof current !== "object") {
      return ""
    }

    current = current[segment]
  }

  return typeof current === "string" ? current : ""
}

function getNestedStringArray(record: Record<string, any>, pathSegments: string[]) {
  let current: any = record

  for (const segment of pathSegments) {
    if (!current || typeof current !== "object") {
      return []
    }

    current = current[segment]
  }

  return Array.isArray(current)
    ? current.filter(function (entry): entry is string {
        return typeof entry === "string" && entry.trim().length > 0
      })
    : []
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function slugify(value: string) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function parseArgs(args: string[]) {
  const options = {
    regiePath: "Regie-Der-Analytiker-wird-zum-Spiegel.md",
    titleOverride: null as string | null,
    authorOverride: null as string | null,
    dryRun: false
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === "--regie" && args[index + 1]) {
      options.regiePath = args[index + 1]
      index += 1
      continue
    }

    if (arg === "--title" && args[index + 1]) {
      options.titleOverride = args[index + 1]
      index += 1
      continue
    }

    if (arg === "--author" && args[index + 1]) {
      options.authorOverride = args[index + 1]
      index += 1
      continue
    }

    if (arg === "--dry-run") {
      options.dryRun = true
    }
  }

  return options
}

main().catch(function (error) {
  if (error instanceof Error) {
    console.error(error.stack || error.message)
  } else {
    console.error(String(error))
  }
  process.exitCode = 1
})
