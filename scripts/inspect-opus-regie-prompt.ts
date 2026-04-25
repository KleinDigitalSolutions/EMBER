import { buildSceneContextPacket } from "../lib/book-engine"
import { buildAnthropicPromptInspection } from "../lib/server/book-job-service"
import { loadStudioStory } from "../lib/server/studio-story-service"

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const story = await loadStudioStory(options.storyId)
  const scene = findScene(story, options.sceneId, options.sceneTitle)

  if (!scene) {
    throw new Error("No matching scene found.")
  }

  const packet = buildSceneContextPacket(story, scene.id)

  if (!packet) {
    throw new Error(`Could not build SceneContextPacket for ${scene.id}.`)
  }

  const prompt = buildAnthropicPromptInspection(packet)
  const allPromptText = prompt.systemBlocks.map(function (block) {
    return block.text
  }).join("\n\n")
  const dynamicText = prompt.dynamicContextPrompt
  const beatPlanText = prompt.beatPlanPrompt
  const checks = [
    check("voicePack persisted", story.book.masterBrief.voicePack.length > 0, story.book.masterBrief.voicePack.length),
    check("proofLadder persisted", story.book.masterBrief.proofLadder.length > 0, story.book.masterBrief.proofLadder.length),
    check("worldBible persisted", story.worldBible.length > 0, story.worldBible.length),
    check("sceneCards persisted", story.book.memory.sceneCards.length > 0, story.book.memory.sceneCards.length),
    check("contextPacks persisted", story.book.memory.contextPacks.length > 0, story.book.memory.contextPacks.length),
    check("voicePack in Opus system blocks", allPromptText.includes("Voice pack"), countMatches(allPromptText, "Voice pack")),
    check("proofLadder in Opus system blocks", allPromptText.includes("Proof ladder"), countMatches(allPromptText, "Proof ladder")),
    check("worldBible primer in Opus system blocks", allPromptText.includes("World bible primer"), countMatches(allPromptText, "World bible primer")),
    check("scene dynamic context in Opus system blocks", allPromptText.includes("Scene-bound dynamic context"), countMatches(allPromptText, "Scene-bound dynamic context")),
    check("scene drive in packet", Boolean(packet.dynamicContext.sceneDrive), packet.dynamicContext.sceneDrive),
    check("POV knowledge boundary in packet", Boolean(packet.dynamicContext.povKnowledgeBoundary), packet.dynamicContext.povKnowledgeBoundary),
    check("relationship pressure in packet", Boolean(packet.dynamicContext.relationshipPressure), packet.dynamicContext.relationshipPressure),
    check("end-state hook in packet", Boolean(packet.dynamicContext.endStateHook), packet.dynamicContext.endStateHook),
    check("scene drive in Opus dynamic context", containsValue(dynamicText, packet.dynamicContext.sceneDrive), packet.dynamicContext.sceneDrive),
    check("POV knowledge boundary in Opus dynamic context", containsValue(dynamicText, packet.dynamicContext.povKnowledgeBoundary), packet.dynamicContext.povKnowledgeBoundary),
    check("relationship pressure in Opus dynamic context", containsValue(dynamicText, packet.dynamicContext.relationshipPressure), packet.dynamicContext.relationshipPressure),
    check("end-state hook in Opus dynamic context", containsValue(dynamicText, packet.dynamicContext.endStateHook), packet.dynamicContext.endStateHook),
    check("scene hard constraints in Opus prompt", packet.dynamicContext.sceneHardConstraints.every(function (constraint) {
      return allPromptText.includes(constraint) || beatPlanText.includes(constraint)
    }), packet.dynamicContext.sceneHardConstraints.length),
    check("cached stable prefix blocks present", prompt.systemBlocks.filter(function (block) {
      return Boolean(block.cacheControl)
    }).length >= 7, prompt.systemBlocks.filter(function (block) {
      return Boolean(block.cacheControl)
    }).length)
  ]

  const failedChecks = checks.filter(function (entry) {
    return !entry.ok
  })

  console.log(JSON.stringify({
    storyId: story.id,
    title: story.title,
    scene: {
      id: scene.id,
      title: scene.title
    },
    packet: {
      voicePackBlocks: packet.stablePrefix.voicePack.length,
      proofLadderBlocks: packet.stablePrefix.proofLadder.length,
      worldBiblePrimer: packet.stablePrefix.worldBiblePrimer.length,
      sceneHardConstraints: packet.dynamicContext.sceneHardConstraints.length,
      previousBeats: packet.dynamicContext.previousBeats.length,
      relevantCodex: packet.dynamicContext.relevantCodex.length,
      relevantCharacterStates: packet.dynamicContext.relevantCharacterStates.length,
      activeThreads: packet.dynamicContext.activeThreads.length
    },
    prompt: {
      systemBlocks: prompt.systemBlocks.length,
      cachedBlocks: prompt.systemBlocks.filter(function (block) {
        return Boolean(block.cacheControl)
      }).length,
      dynamicContextChars: dynamicText.length,
      beatPlanPromptChars: beatPlanText.length
    },
    checks,
    status: failedChecks.length ? "failed" : "passed"
  }, null, 2))

  if (failedChecks.length) {
    process.exitCode = 1
  }
}

function parseArgs(args: string[]) {
  const options = {
    storyId: null as string | null,
    sceneId: null as string | null,
    sceneTitle: "Gestern"
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === "--story-id" && args[index + 1]) {
      options.storyId = args[index + 1]
      index += 1
      continue
    }

    if (arg === "--scene-id" && args[index + 1]) {
      options.sceneId = args[index + 1]
      index += 1
      continue
    }

    if (arg === "--scene-title" && args[index + 1]) {
      options.sceneTitle = args[index + 1]
      index += 1
    }
  }

  return options
}

function findScene(
  story: Awaited<ReturnType<typeof loadStudioStory>>,
  sceneId: string | null,
  sceneTitle: string
) {
  const scenes = story.acts.flatMap(function (act) {
    return act.chapters.flatMap(function (chapter) {
      return chapter.scenes
    })
  })

  if (sceneId) {
    return scenes.find(function (scene) {
      return scene.id === sceneId
    }) ?? null
  }

  const normalizedTitle = normalizeText(sceneTitle)

  return scenes.find(function (scene) {
    return normalizeText(scene.title).includes(normalizedTitle)
  }) ?? scenes[0] ?? null
}

function check(name: string, ok: boolean, value: unknown) {
  return { name, ok, value }
}

function containsValue(text: string, value: string | null) {
  return Boolean(value && text.includes(value))
}

function countMatches(text: string, needle: string) {
  return text.split(needle).length - 1
}

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
}

main().catch(function (error) {
  if (error instanceof Error) {
    console.error(error.stack || error.message)
  } else {
    console.error(String(error))
  }
  process.exitCode = 1
})
