import {
  findSceneContext,
  getAllScenes,
  updateSceneInStory,
  type BookDraftJob,
  type DraftExtractionState,
  type StoryDocument,
  type StoryScene,
  type WorldBibleEntry
} from "@/lib/story-schema";

export type CanonLedgerEntry = {
  entryId: string;
  title: string;
  kind: WorldBibleEntry["kind"];
  summary: string;
  mentionCount: number;
  sceneIds: string[];
  importance: "high" | "medium" | "low";
};

type CanonImportance = CanonLedgerEntry["importance"];

export type TimelineBeat = {
  sceneId: string;
  sceneTitle: string;
  actTitle: string;
  chapterTitle: string;
  summary: string;
  excerpt: string;
  orderLabel: string;
};

export type OpenThread = {
  id: string;
  label: string;
  detail: string;
  sourceSceneId: string;
  sourceSceneTitle: string;
  status: "active" | "watch";
};

export type SceneContextPacket = {
  sceneId: string;
  stablePrefix: {
    premise: string;
    readerPromise: string;
    endingPromise: string;
    thematicCore: string;
    writerConstitution: string[];
  };
  dynamicContext: {
    actTitle: string;
    chapterTitle: string;
    sceneTitle: string;
    sceneSummary: string;
    sceneExcerpt: string;
    previousBeats: TimelineBeat[];
    nextBeat: TimelineBeat | null;
    relevantCodex: CanonLedgerEntry[];
    activeThreads: OpenThread[];
    variables: Array<{
      key: string;
      label: string;
      defaultValue: boolean | string | number;
    }>;
  };
  extractorTemplate: {
    new_canon_facts: string[];
    character_state_updates: string[];
    open_threads_created: string[];
    open_threads_resolved: string[];
    continuity_risks: string[];
    style_drift_notes: string[];
  };
};

export type BookDraftAudit = {
  acceptedJobs: number;
  pendingJobs: number;
  uncoveredSceneCount: number;
  continuityBlockers: string[];
  qualityWarnings: string[];
  marketWarnings: string[];
};

export type AmazonLaunchPackage = {
  titleLine: string;
  subtitle: string;
  seriesLine: string;
  penName: string;
  description: string;
  keywords: string[];
  categories: string[];
  audienceTags: string[];
  aiDisclosure: string;
  checklist: Array<{
    label: string;
    done: boolean;
  }>;
  readinessScore: number;
};

export function buildCanonLedger(story: StoryDocument): CanonLedgerEntry[] {
  const scenes = getAllScenes(story);

  return story.worldBible
    .map(function (entry) {
      const sceneIds = scenes
        .filter(function (scene) {
          return scoreEntryAgainstScene(entry, scene) > 0;
        })
        .map(function (scene) {
          return scene.id;
        });

      const mentionCount = sceneIds.length;

      return {
        entryId: entry.id,
        title: entry.title,
        kind: entry.kind,
        summary: entry.summary,
        mentionCount,
        sceneIds,
        importance: getCanonImportance(mentionCount)
      };
    })
    .sort(function (left, right) {
      return right.mentionCount - left.mentionCount || left.title.localeCompare(right.title);
    });
}

export function buildTimelineBeats(story: StoryDocument): TimelineBeat[] {
  return story.acts.flatMap(function (act, actIndex) {
    return act.chapters.flatMap(function (chapter, chapterIndex) {
      return chapter.scenes.map(function (scene, sceneIndex) {
        return {
          sceneId: scene.id,
          sceneTitle: scene.title,
          actTitle: act.title,
          chapterTitle: chapter.title,
          summary: scene.summary,
          excerpt: buildSceneExcerpt(scene),
          orderLabel: `A${actIndex + 1} · C${chapterIndex + 1} · S${sceneIndex + 1}`
        };
      });
    });
  });
}

export function buildOpenThreads(story: StoryDocument): OpenThread[] {
  const allScenes = getAllScenes(story);
  const threads: OpenThread[] = [];

  allScenes.forEach(function (scene) {
    scene.choices.forEach(function (choice, choiceIndex) {
      const targetScene = allScenes.find(function (candidate) {
        return candidate.id === choice.toSceneId;
      });

      threads.push({
        id: `${scene.id}_choice_${choiceIndex + 1}`,
        label: choice.label || `Choice ${choiceIndex + 1}`,
        detail: targetScene
          ? `Fuehrt zu ${targetScene.title} und braucht spaeter eine klare Konsequenz.`
          : "Fuehrt aktuell auf kein bekanntes Ziel und ist damit ein offener Strukturpunkt.",
        sourceSceneId: scene.id,
        sourceSceneTitle: scene.title,
        status: targetScene && targetScene.wordCount > 0 ? "watch" : "active"
      });
    });

    if (looksLikeOpenQuestion(scene.summary)) {
      threads.push({
        id: `${scene.id}_summary_thread`,
        label: createThreadLabel(scene.summary, scene.title),
        detail: "Die Szenen-Zusammenfassung signalisiert einen offenen Konflikt oder eine unbezahlte Frage.",
        sourceSceneId: scene.id,
        sourceSceneTitle: scene.title,
        status: "active"
      });
    }
  });

  return dedupeThreads(threads);
}

export function buildSceneContextPacket(
  story: StoryDocument,
  sceneId: string
): SceneContextPacket | null {
  const sceneContext = findSceneContext(story, sceneId);

  if (!sceneContext) {
    return null;
  }

  const timeline = buildTimelineBeats(story);
  const sceneIndex = timeline.findIndex(function (beat) {
    return beat.sceneId === sceneId;
  });
  const currentBeat = timeline[sceneIndex];
  const canonLedger = buildCanonLedger(story);
  const activeThreads = buildOpenThreads(story).filter(function (thread) {
    return thread.sourceSceneId === sceneId || thread.status === "active";
  });

  return {
    sceneId,
    stablePrefix: {
      premise: story.book.masterBrief.premise,
      readerPromise: story.book.masterBrief.readerPromise,
      endingPromise: story.book.masterBrief.endingPromise,
      thematicCore: story.book.masterBrief.thematicCore,
      writerConstitution: story.book.writerConstitution
    },
    dynamicContext: {
      actTitle: sceneContext.act.title,
      chapterTitle: sceneContext.chapter.title,
      sceneTitle: sceneContext.scene.title,
      sceneSummary: sceneContext.scene.summary,
      sceneExcerpt: buildSceneExcerpt(sceneContext.scene),
      previousBeats: timeline.slice(Math.max(0, sceneIndex - 2), sceneIndex),
      nextBeat: timeline[sceneIndex + 1] ?? null,
      relevantCodex: rankRelevantCodexForScene(story, sceneId, canonLedger).slice(0, 4),
      activeThreads: activeThreads.slice(0, 4),
      variables: story.variables.map(function (variable) {
        return {
          key: variable.key,
          label: variable.label,
          defaultValue: variable.defaultValue
        };
      })
    },
    extractorTemplate: {
      new_canon_facts: [],
      character_state_updates: [],
      open_threads_created: [],
      open_threads_resolved: [],
      continuity_risks: [],
      style_drift_notes: []
    }
  };
}

export function getDraftJobsForScene(story: StoryDocument, sceneId: string) {
  return story.book.draftEngine.jobs
    .filter(function (job) {
      return job.sceneId === sceneId;
    })
    .sort(function (left, right) {
      return right.updatedAt.localeCompare(left.updatedAt);
    });
}

export function createLocalDraftJob(
  story: StoryDocument,
  sceneId: string
): { story: StoryDocument; job: BookDraftJob } | null {
  const packet = buildSceneContextPacket(story, sceneId);

  if (!packet) {
    return null;
  }

  const outline = buildOutlineSteps(packet);
  const draftText = buildDraftText(packet, story.book.draftEngine.targetSceneWordsMin);
  const extractedState = extractDraftState(packet, draftText);
  const rewriteNotes = buildRewriteNotes(packet, draftText, extractedState);
  const rewriteText = buildRewriteText(packet, draftText, rewriteNotes);
  const now = new Date().toISOString();

  const job: BookDraftJob = {
    id: createLocalId("draft_job"),
    sceneId,
    sceneTitle: packet.dynamicContext.sceneTitle,
    createdAt: now,
    updatedAt: now,
    status: "ready",
    outline,
    draftText,
    rewriteText,
    rewriteNotes,
    extractedState,
    contextSnapshot: {
      chapterTitle: packet.dynamicContext.chapterTitle,
      sceneSummary: packet.dynamicContext.sceneSummary,
      relevantCodexTitles: packet.dynamicContext.relevantCodex.map(function (entry) {
        return entry.title;
      }),
      activeThreadLabels: packet.dynamicContext.activeThreads.map(function (thread) {
        return thread.label;
      })
    }
  };

  return {
    story: upsertDraftJob(story, job),
    job
  };
}

export function upsertDraftJob(story: StoryDocument, job: BookDraftJob): StoryDocument {
  return {
    ...story,
    book: {
      ...story.book,
      activePhase: "phase_3_drafting",
      draftEngine: {
        ...story.book.draftEngine,
        jobs: [job].concat(
          story.book.draftEngine.jobs.filter(function (currentJob) {
            return currentJob.sceneId !== job.sceneId;
          })
        )
      }
    }
  };
}

export function acceptDraftJobToScene(
  story: StoryDocument,
  jobId: string
): { story: StoryDocument; sceneId: string } | null {
  const job = story.book.draftEngine.jobs.find(function (candidate) {
    return candidate.id === jobId;
  });

  if (!job) {
    return null;
  }

  const nextStory = updateSceneInStory(story, job.sceneId, function (scene) {
    const paragraphs = splitIntoParagraphs(job.rewriteText);

    return {
      ...scene,
      summary: deriveSceneSummary(job),
      blocks: paragraphs.map(function (paragraph, index) {
        return {
          id: `${scene.id}_draft_block_${index + 1}`,
          kind: "paragraph",
          text: paragraph
        };
      })
    };
  });

  return {
    story: {
      ...nextStory,
      book: {
        ...nextStory.book,
        draftEngine: {
          ...nextStory.book.draftEngine,
          jobs: nextStory.book.draftEngine.jobs.map(function (currentJob) {
            if (currentJob.id !== jobId) {
              return currentJob;
            }

            return {
              ...currentJob,
              status: "accepted",
              updatedAt: new Date().toISOString()
            };
          })
        }
      }
    },
    sceneId: job.sceneId
  };
}

export function analyzeBookDraftReadiness(story: StoryDocument): BookDraftAudit {
  const scenes = getAllScenes(story);
  const jobs = story.book.draftEngine.jobs;
  const acceptedJobs = jobs.filter(function (job) {
    return job.status === "accepted";
  });
  const pendingJobs = jobs.length - acceptedJobs.length;
  const continuityBlockers: string[] = [];
  const qualityWarnings: string[] = [];
  const marketWarnings: string[] = [];

  const uncoveredSceneCount = scenes.filter(function (scene) {
    return !jobs.some(function (job) {
      return job.sceneId === scene.id;
    });
  }).length;

  if (!story.book.masterBrief.readerPromise) {
    qualityWarnings.push("Reader Promise fehlt; Stil- und Spannungssteuerung bleiben unscharf.");
  }

  if (!story.book.marketBrief.hook) {
    marketWarnings.push("Commercial Hook fehlt; Amazon-Paketierung ist damit noch weich.");
  }

  if (!story.book.marketBrief.categoryLane) {
    marketWarnings.push("Category Lane ist leer; Positionierung fuer den ersten Titel fehlt.");
  }

  if (!acceptedJobs.length) {
    continuityBlockers.push("Noch kein Draft-Job wurde in eine Szene uebernommen.");
  }

  if (uncoveredSceneCount) {
    continuityBlockers.push(
      `${uncoveredSceneCount} Szene(n) haben noch keinen Draft-Job und bleiben ausserhalb der Pipeline.`
    );
  }

  jobs.forEach(function (job) {
    if (job.extractedState.continuityRisks.length) {
      continuityBlockers.push(
        `${job.sceneTitle}: ${job.extractedState.continuityRisks.join(" ")}`
      );
    }

    if (job.extractedState.styleDriftNotes.length) {
      qualityWarnings.push(
        `${job.sceneTitle}: ${job.extractedState.styleDriftNotes.join(" ")}`
      );
    }
  });

  return {
    acceptedJobs: acceptedJobs.length,
    pendingJobs,
    uncoveredSceneCount,
    continuityBlockers: dedupeStrings(continuityBlockers),
    qualityWarnings: dedupeStrings(qualityWarnings),
    marketWarnings: dedupeStrings(marketWarnings)
  };
}

export function buildAmazonLaunchPackage(story: StoryDocument): AmazonLaunchPackage {
  const ops = story.book.amazonOps;
  const titleLine = [story.title, ops.subtitle].filter(Boolean).join(": ");
  const checklist = [
    { label: "Manuskript", done: ops.launchChecklist.manuscriptReady },
    { label: "Cover", done: ops.launchChecklist.coverReady },
    { label: "Blurb", done: ops.launchChecklist.blurbReady },
    { label: "Keywords", done: ops.launchChecklist.keywordsReady },
    { label: "Kategorien", done: ops.launchChecklist.categoriesReady },
    { label: "AI Disclosure", done: ops.launchChecklist.aiDisclosureReady }
  ];
  const readinessScore = Math.round(
    (checklist.filter(function (item) {
      return item.done;
    }).length /
      checklist.length) *
      100
  );

  return {
    titleLine,
    subtitle: ops.subtitle,
    seriesLine: ops.seriesName
      ? `${ops.seriesName}${ops.volumeNumber ? ` · Band ${ops.volumeNumber}` : ""}`
      : "",
    penName: ops.penName || story.authorName,
    description: ops.description || buildFallbackDescription(story),
    keywords: ops.keywords,
    categories: ops.categories,
    audienceTags: ops.audienceTags,
    aiDisclosure: formatAiDisclosure(ops.aiDisclosure),
    checklist,
    readinessScore
  };
}

function rankRelevantCodexForScene(
  story: StoryDocument,
  sceneId: string,
  ledger: CanonLedgerEntry[]
) {
  const timeline = buildTimelineBeats(story);
  const sceneIndex = timeline.findIndex(function (beat) {
    return beat.sceneId === sceneId;
  });
  const currentBeat = timeline[sceneIndex];
  const previousBeat = timeline[sceneIndex - 1] ?? null;
  const nextBeat = timeline[sceneIndex + 1] ?? null;

  return ledger
    .map(function (entry) {
      let score = 0;

      if (currentBeat && entry.sceneIds.includes(currentBeat.sceneId)) {
        score += 5;
      }

      if (previousBeat && entry.sceneIds.includes(previousBeat.sceneId)) {
        score += 2;
      }

      if (nextBeat && entry.sceneIds.includes(nextBeat.sceneId)) {
        score += 1;
      }

      if (entry.kind === "character") {
        score += 1;
      }

      return {
        entry,
        score
      };
    })
    .sort(function (left, right) {
      return right.score - left.score || right.entry.mentionCount - left.entry.mentionCount;
    })
    .filter(function (item) {
      return item.score > 0;
    })
    .map(function (item) {
      return item.entry;
    });
}

function buildOutlineSteps(packet: SceneContextPacket) {
  const steps = [
    `Oeffnung: ${packet.dynamicContext.sceneTitle} mit Fokus auf ${packet.dynamicContext.sceneSummary || "den unmittelbaren Konflikt"}.`,
    `Druck aufbauen: ${packet.dynamicContext.activeThreads[0]?.label || "eine offene Frage"} konkretisieren.`,
    `Wendung: ${packet.dynamicContext.relevantCodex[0]?.title || "der Kernkonflikt"} neu rahmen.`,
    `Nachhall: in ${packet.dynamicContext.nextBeat?.sceneTitle || "den naechsten Plot-Schritt"} ueberleiten.`
  ];

  return steps.filter(Boolean);
}

function buildDraftText(packet: SceneContextPacket, targetWordsMin: number) {
  const lead = packet.dynamicContext.relevantCodex[0];
  const thread = packet.dynamicContext.activeThreads[0];
  const previousBeat =
    packet.dynamicContext.previousBeats[packet.dynamicContext.previousBeats.length - 1] ?? null;
  const nextBeat = packet.dynamicContext.nextBeat;
  const targetWords = Math.max(320, Math.min(targetWordsMin, 1200));

  const paragraphs = [
    [
      packet.dynamicContext.sceneTitle,
      packet.dynamicContext.sceneSummary || packet.stablePrefix.premise,
      lead
        ? `${lead.title} liegt als relevanter Kanon offen im Raum: ${lead.summary}`
        : "Die Szene muss den Konflikt aus der Praemisse unmittelbar spueren lassen."
    ].join(" "),
    [
      previousBeat
        ? `Direkt davor stand ${previousBeat.sceneTitle}: ${previousBeat.summary || previousBeat.excerpt}`
        : "Es gibt keinen langen Rueckblick; die Szene steigt schnell in die aktuelle Lage ein.",
      thread
        ? `Der offene Thread lautet im Kern: ${thread.label}. ${thread.detail}`
        : "Der Druck kommt aus der aktuellen Situation und nicht aus abstrakter Erklaerung.",
      "Die Figuren reagieren konkret, nicht essayistisch."
    ].join(" "),
    [
      packet.stablePrefix.readerPromise || "Der Leser erwartet einen spannungsgetragenen, klaren Vorwaertszug.",
      packet.stablePrefix.thematicCore
        ? `Unter der Aktion arbeitet das Thema: ${packet.stablePrefix.thematicCore}.`
        : "Die Szene soll bereits eine lesbare emotionale Verschiebung erzeugen.",
      nextBeat
        ? `Am Ende muss genug Zug in Richtung ${nextBeat.sceneTitle} bleiben.`
        : "Das Ende muss wie ein bewusst gesetzter Nachhall wirken."
    ].join(" ")
  ];

  const text = paragraphs.join("\n\n");

  return padDraftToTarget(text, targetWords);
}

function extractDraftState(
  packet: SceneContextPacket,
  draftText: string
): DraftExtractionState {
  const canonFacts = packet.dynamicContext.relevantCodex.map(function (entry) {
    return `${entry.title}: ${entry.summary || "Relevanter Kanon fuer diese Szene."}`;
  });

  return {
    newCanonFacts: canonFacts.slice(0, 2),
    characterStateUpdates: packet.dynamicContext.relevantCodex
      .filter(function (entry) {
        return entry.kind === "character";
      })
      .map(function (entry) {
        return `${entry.title} verlaesst die Szene nicht unveraendert; der innere Druck steigt.`;
      })
      .slice(0, 2),
    openThreadsCreated: packet.dynamicContext.activeThreads
      .filter(function (thread) {
        return thread.status === "active";
      })
      .map(function (thread) {
        return thread.label;
      })
      .slice(0, 2),
    openThreadsResolved: [],
    continuityRisks: detectContinuityRisks(packet, draftText),
    styleDriftNotes: detectStyleDrift(packet, draftText)
  };
}

function buildRewriteNotes(
  packet: SceneContextPacket,
  draftText: string,
  extractedState: DraftExtractionState
) {
  const notes = [
    "Oeffnung frueher auf Handlung und Druck setzen.",
    "Exposition knapper halten und in die Wahrnehmung der Szene einbetten."
  ];

  if (packet.dynamicContext.activeThreads.length) {
    notes.push(`Den Thread "${packet.dynamicContext.activeThreads[0].label}" klarer zuspitzen.`);
  }

  if (extractedState.continuityRisks.length) {
    notes.push("Kanon-Bezuege expliziter verankern, damit der Continuity-Pass weniger Warnungen sieht.");
  }

  if (countApproxWords(draftText) < packet.dynamicContext.variables.length + 220) {
    notes.push("Der Draft ist sehr knapp; die emotionale Konsequenz sollte etwas dichter werden.");
  }

  return notes.slice(0, 4);
}

function buildRewriteText(
  packet: SceneContextPacket,
  draftText: string,
  rewriteNotes: string[]
) {
  const codexTail = packet.dynamicContext.relevantCodex
    .slice(0, 2)
    .map(function (entry) {
      return `${entry.title} bleibt dabei nicht Dekor, sondern aktive Reibungsflaeche.`;
    })
    .join(" ");

  const ending = packet.dynamicContext.nextBeat
    ? `Die Szene endet so, dass ${packet.dynamicContext.nextBeat.sceneTitle} logisch und mit Zug folgen kann.`
    : "Die Szene endet auf einem Nachhall, nicht auf einer neutralen Ausblendung.";

  return [
    draftText,
    "",
    `Rewrite-Fokus: ${rewriteNotes.join(" ")}`,
    codexTail,
    ending
  ]
    .filter(Boolean)
    .join("\n\n");
}

function scoreEntryAgainstScene(entry: WorldBibleEntry, scene: StoryScene) {
  const haystack = normalizeText(
    [scene.title, scene.label, scene.summary]
      .concat(
        scene.blocks.map(function (block) {
          return block.text;
        })
      )
      .join(" ")
  );
  const tokens = entry.title
    .toLowerCase()
    .split(/\s+/)
    .filter(function (token) {
      return token.length >= 3;
    });

  if (!tokens.length) {
    return 0;
  }

  return tokens.reduce(function (score, token) {
    return haystack.includes(normalizeText(token)) ? score + 1 : score;
  }, 0);
}

function buildSceneExcerpt(scene: StoryScene) {
  const text = scene.blocks
    .map(function (block) {
      return block.text.trim();
    })
    .filter(Boolean)
    .join(" ");

  return clampText(text || scene.summary, 220);
}

function deriveSceneSummary(job: BookDraftJob) {
  return clampText(
    job.contextSnapshot.sceneSummary ||
      job.outline[0] ||
      `${job.sceneTitle} wird ueber den lokalen Draft-Job neu ausgerichtet.`,
    180
  );
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function clampText(value: string, maxLength: number) {
  const compact = value.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 1).trim()}…`;
}

function looksLikeOpenQuestion(value: string) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return false;
  }

  return /(\?|warum|wieso|wer |wie |weshalb|verschwunden|geheim|notizbuch|ring|auftrag)/.test(
    normalized
  );
}

function createThreadLabel(summary: string, fallbackTitle: string) {
  const cleaned = clampText(summary, 72);

  if (cleaned) {
    return cleaned;
  }

  return `Offene Frage aus ${fallbackTitle}`;
}

function dedupeThreads(threads: OpenThread[]) {
  const seen = new Set<string>();

  return threads.filter(function (thread) {
    const key = `${thread.sourceSceneId}:${thread.label.toLowerCase()}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function getCanonImportance(mentionCount: number): CanonImportance {
  if (mentionCount >= 2) {
    return "high";
  }

  if (mentionCount === 1) {
    return "medium";
  }

  return "low";
}

function detectContinuityRisks(packet: SceneContextPacket, draftText: string) {
  const risks: string[] = [];

  if (!packet.dynamicContext.relevantCodex.length) {
    risks.push("Keine Codex-Anker im Kontext; der Draft koennte zu frei driften.");
  }

  if (countApproxWords(draftText) < 220) {
    risks.push("Der Draft ist fuer eine tragende Szene sehr knapp und koennte nur Skelettniveau haben.");
  }

  if (!packet.dynamicContext.activeThreads.length) {
    risks.push("Es gibt keinen klaren offenen Thread fuer die Szene; Konsequenzfluss pruefen.");
  }

  return risks;
}

function detectStyleDrift(packet: SceneContextPacket, draftText: string) {
  const notes: string[] = [];

  if (draftText.includes("Die Figuren reagieren konkret, nicht essayistisch.")) {
    notes.push("Der lokale Draft enthaelt noch Metasprache und braucht spaetere Modell-Politur.");
  }

  if (!packet.stablePrefix.readerPromise) {
    notes.push("Reader Promise ist leer; Stilsteuerung bleibt dadurch allgemein.");
  }

  return notes;
}

function padDraftToTarget(value: string, targetWords: number) {
  const buffer = [
    "Jeder Absatz bleibt funktional und versucht zugleich, atmosphaerische Reibung zu tragen.",
    "Der Text ist noch kein fertiger Romanstil, aber ein belastbarer Rohzug fuer spaetere Modell- und Human-Paesse.",
    "Konflikt, Wahrnehmung und Konsequenz werden enger zusammengedraengt als in einer reinen Outline."
  ];

  let nextValue = value;
  let bufferIndex = 0;

  while (countApproxWords(nextValue) < targetWords && bufferIndex < buffer.length) {
    nextValue = `${nextValue}\n\n${buffer[bufferIndex]}`;
    bufferIndex += 1;
  }

  return nextValue;
}

function countApproxWords(value: string) {
  const matches = value.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

function splitIntoParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map(function (paragraph) {
      return paragraph.trim();
    })
    .filter(Boolean);
}

function createLocalId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values));
}

function buildFallbackDescription(story: StoryDocument) {
  const premise = story.book.masterBrief.premise || story.book.marketBrief.hook;
  const promise = story.book.masterBrief.readerPromise;

  return [premise, promise].filter(Boolean).join(" ");
}

function formatAiDisclosure(value: StoryDocument["book"]["amazonOps"]["aiDisclosure"]) {
  if (value === "generated") {
    return "AI-generated content";
  }

  if (value === "human_led") {
    return "Human-led project";
  }

  return "AI-assisted content";
}
