import { readFile } from "node:fs/promises"
import path from "node:path"
import { syncStoryBookArtifacts } from "../lib/book-engine"
import { createUuid } from "../lib/id"
import {
  createDefaultAssistantContextSelection,
  createEmptyBookSceneCardDirectives,
  type BookOpenThread,
  type BookSceneCard,
  type StoryAct,
  type StoryDocument,
  type WorldBibleEntry
} from "../lib/story-schema"
import {
  createStudioStory,
  listStudioStories,
  loadStudioStory,
  saveStudioStory
} from "../lib/server/studio-story-service"

const PROJECT_TITLE = "Der Feind bin ich"
const REGIE_PATH = "Regie-2-Der-Feind-bin-ich.md"

type SceneSeed = {
  actTitle: string
  chapterTitle: string
  sceneTitle: string
  summary: string
  chapterGoal: string
  outline: string[]
  directives: ReturnType<typeof createEmptyBookSceneCardDirectives>
}

const SCENE_SEEDS: SceneSeed[] = [
  {
    actTitle: "Akt 1 – Die Schule der Einsamkeit",
    chapterTitle: "Kapitel 1 - Dritte Klasse",
    sceneTitle: "Szene 1 – Dritte Klasse",
    summary:
      "Der Erzähler wird im Immigrantenviertel verprügelt, weil andere Jungen ihn für einen Kurden halten. Zum ersten Mal spürt er, dass Zugehörigkeit in dieser Welt entzogen und verteilt wird.",
    chapterGoal:
      "Die Grundwunde etablieren: Gewalt, falsche Zuschreibung und frühe Einsamkeit als Ursprung seiner späteren Menschenlese.",
    outline: [
      "Schulhof im Viertel: Druck, Gerüche, Kinderlogik und Gruppendynamik sofort körperlich zeigen.",
      "Die Verwechslung mit politischer Fremdzuschreibung macht klar: Er gehört nirgends sauber dazu.",
      "Erhan sieht alles, schützt ihn aber nicht wirklich.",
      "Die Szene endet mit Nachhall statt Auflösung."
    ],
    directives: {
      ...createEmptyBookSceneCardDirectives(),
      pov: "Ich-Perspektive",
      location: "Schulhof im deutschen Immigrantenviertel",
      objective: "Die erste soziale Wunde konkret erfahrbar machen",
      dramaticBeat: "Er erkennt, dass selbst Nähe keinen Schutz garantiert",
      ending: "Offene Drohung und innere Verschiebung statt Trost"
    }
  },
  {
    actTitle: "Akt 1 – Die Schule der Einsamkeit",
    chapterTitle: "Kapitel 2 - Zuhause nach der Schule",
    sceneTitle: "Szene 2 – Zuhause nach der Schule",
    summary:
      "Nach der Prügelei kommt der Junge nach Hause. Die Familie funktioniert weiter, niemand fragt wirklich, und das Schweigen der Wohnung wird zur zweiten Gewalt.",
    chapterGoal:
      "Das familiäre Schweigen als Muster etablieren und Mutter, Vater, Geschwister und Wohnung erstmals konkret einführen.",
    outline: [
      "Treppenhaus und Wohnungstür mit Schmerz und Alltagsgeräuschen verknüpfen.",
      "Die Mutter registriert die Verletzung, fragt aber nicht nach.",
      "Der Esstisch läuft über Funktion, Fernseher und Routine.",
      "Im Zimmer begreift er: Zuhause ist keine Umkehr des Schulhofs, nur die leisere Form davon."
    ],
    directives: {
      ...createEmptyBookSceneCardDirectives(),
      pov: "Ich-Perspektive",
      location: "Wohnung der Familie im Viertel",
      objective: "Familiären Alltag und Schweigen als System zeigen",
      opening: "Mit dem Körpernachhall der Prügelei ins Treppenhaus einsteigen",
      dramaticBeat: "Niemand fragt, obwohl alle etwas sehen",
      ending: "Das Schweigen bleibt als neue Gewissheit im Körper"
    }
  },
  {
    actTitle: "Akt 1 – Die Schule der Einsamkeit",
    chapterTitle: "Kapitel 3 - Badewanne",
    sceneTitle: "Szene 3 – Den Vater aus der Badewanne heben",
    summary:
      "Der jugendliche Erzähler hilft dem krebskranken Vater aus der Badewanne. Scham, Fürsorge und körperliche Überforderung überlagern sich, ohne dass jemand ihm erklärt, wohin mit diesem Gefühl.",
    chapterGoal:
      "Die intime Last der Krankheit konkret machen und zeigen, wie Verantwortung zu früh auf den Sohn fällt.",
    outline: [
      "Enges Badezimmer, Krankheit im Material und Geruch spürbar machen.",
      "Das Heben aus der Wanne als körperliche Grenzerfahrung zeigen.",
      "Die Scham nicht erklären oder erlösen, sondern stehen lassen.",
      "Nach dem Helfen bleibt kein Gespräch, nur die stille Verlagerung einer Last."
    ],
    directives: {
      ...createEmptyBookSceneCardDirectives(),
      pov: "Ich-Perspektive",
      location: "Kleines Badezimmer der Familienwohnung",
      objective: "Krankheit und Scham als prägende Last verankern",
      coreAction: "Der Sohn hebt den Vater aus der Badewanne",
      dramaticBeat: "Die Scham entsteht nicht aus Abwehr, sondern aus Überforderung ohne Sprache",
      ending: "Er nimmt die Last mit ins eigene Zimmer"
    }
  },
  {
    actTitle: "Akt 2 – Die langen Jahre",
    chapterTitle: "Kapitel 4 - Ausbildung und Abbruch",
    sceneTitle: "Szene 4 – Erste Ausbildung, erster Zusammenbruch",
    summary:
      "Der Bruder organisiert ihm eine Ausbildung im Einzelhandel. Während der Vater stirbt und alles nach außen weiterlaufen soll, bricht der Erzähler die Ausbildung ab.",
    chapterGoal:
      "Zeigen, wie äußere Funktionsanforderung und innerer Zerfall zum ersten größeren Abbruch führen.",
    outline: [
      "Die Ausbildung als Versuch von Struktur und Normalität eröffnen.",
      "Der Todesdruck des Vaters läuft parallel dazu weiter.",
      "Freundlichkeitszwang und innere Leere kollidieren.",
      "Der Abbruch wirkt nicht rebellisch, sondern zwangsläufig."
    ],
    directives: {
      ...createEmptyBookSceneCardDirectives(),
      objective: "Den ersten erwachsenen Funktionsbruch zeigen",
      dramaticBeat: "Er merkt, dass er unter dieser Oberfläche nicht mehr tragen kann",
      ending: "Der Abbruch hinterlässt kein Gefühl von Freiheit"
    }
  },
  {
    actTitle: "Akt 2 – Die langen Jahre",
    chapterTitle: "Kapitel 5 - Spielhalle",
    sceneTitle: "Szene 5 – Das Auffangbecken",
    summary:
      "In der Spielhalle findet der Erzähler keinen Spaß, sondern Betäubung. Die Maschine fragt nicht, wie es ihm geht, und genau darin liegt die Sogkraft.",
    chapterGoal:
      "Die Sucht als stilles Ersatzsystem zeigen: kontrollierbar wirkend, aber innerlich verheerend.",
    outline: [
      "Das Viertel und die Halle als kognitive Einsamkeit unter Menschen zeigen.",
      "Nicht Gruppendruck, sondern innere Lücke treibt ihn zur Maschine.",
      "Die Maschine ersetzt Gespräch, Halt und Selbstbild.",
      "Die Szene muss begreifbar machen, warum die Sucht funktional wirkt."
    ],
    directives: {
      ...createEmptyBookSceneCardDirectives(),
      location: "Spielhalle im Viertel",
      objective: "Die Funktion der Sucht statt nur das Symptom zeigen",
      dramaticBeat: "Die Maschine wird zum einzigen Ort ohne Frage",
      ending: "Die kurzfristige Betäubung verschiebt den Absturz nur"
    }
  },
  {
    actTitle: "Akt 2 – Die langen Jahre",
    chapterTitle: "Kapitel 6 - Das vierte Auto",
    sceneTitle: "Szene 6 – Der Verkauf des Audi A3",
    summary:
      "Das vierte Auto muss verkauft werden, um Schulden zu begleichen. Statt nur Selbsthass bleibt eine kalte Wut auf das System zurück, das ihn so lange gefüttert hat.",
    chapterGoal:
      "Den materiellen Verlust als Wendepunkt markieren: aus diffusem Absturz wird gerichtete Wut.",
    outline: [
      "Auto und Verkauf als reale Fallhöhe zeigen.",
      "Nicht melodramatisch spielen, sondern präzise und nüchtern.",
      "Die Wut richtet sich gegen Automatenbauer, Politik und Mechanik der Sucht.",
      "Aus dem Verlust entsteht ein Schwur."
    ],
    directives: {
      ...createEmptyBookSceneCardDirectives(),
      objective: "Den Wendepunkt vom Verdrängen zum Schwur markieren",
      dramaticBeat: "Wut ersetzt für einen Moment Ohnmacht",
      ending: "Der Satz 'Diesem Hund gebe ich nie wieder einen Euro' muss als innere Kante stehen"
    }
  },
  {
    actTitle: "Akt 3 – Der Sieg",
    chapterTitle: "Kapitel 7 - Der erste Tag danach",
    sceneTitle: "Szene 7 – Erster Tag ohne Spielen",
    summary:
      "Nicht der Entschluss, sondern der erste gewöhnliche Tag ohne Rückfall wird zur eigentlichen Zäsur. Der Impuls ist da, aber er folgt ihm nicht.",
    chapterGoal:
      "Den Sieg klein, konkret und glaubwürdig zeigen: nicht heroisch, sondern als stilles Nicht-Mitgehen.",
    outline: [
      "Den Alltag ohne Pathos eröffnen.",
      "Der Impuls zum Spielen muss real und körperlich spürbar sein.",
      "Der eigentliche Akt ist das Nicht-Handeln.",
      "Aus dem kleinen Widerstand entsteht erstmals ein Sieg-Gefühl."
    ],
    directives: {
      ...createEmptyBookSceneCardDirectives(),
      objective: "Die erste echte Gegenbewegung gegen die Sucht sichtbar machen",
      dramaticBeat: "Der Verzicht fühlt sich wie ein Sieg über einen Feind an",
      ending: "Kein Triumph, aber ein harter, stiller Marker"
    }
  },
  {
    actTitle: "Akt 3 – Der Sieg",
    chapterTitle: "Kapitel 8 - Name für das Unbenannte",
    sceneTitle: "Szene 8 – Diagnose ohne Arztmoment",
    summary:
      "Die Angst bekommt einen Namen: Agoraphobie, soziale Phobie. Allein das Benennen nimmt dem Ungeheuren einen Teil seiner Macht.",
    chapterGoal:
      "Die Verschiebung von diffusem Leiden zu erkennbarer Struktur zeigen, ohne in Selbsthilfe-Sprache zu kippen.",
    outline: [
      "Die jahrelange Unsicherheit und Vermeidung konkret im Alltag verankern.",
      "Der Name der Angst kommt als Entlastung, nicht als Heilung.",
      "Werkzeuge wie Sonnenbrille, Kapuze und Wegeplanung als gelebte Anpassung zeigen.",
      "Die Erkenntnis muss sachlich und wirksam bleiben."
    ],
    directives: {
      ...createEmptyBookSceneCardDirectives(),
      objective: "Dem Unbenannten eine präzise Form geben",
      dramaticBeat: "Benennung bringt Erleichterung, aber keine Auflösung",
      ending: "Er kann sein Leiden erstmals richten statt nur ertragen"
    }
  },
  {
    actTitle: "Akt 3 – Der Sieg",
    chapterTitle: "Kapitel 9 - EMBER",
    sceneTitle: "Szene 9 – Struktur für andere bauen",
    summary:
      "Der Erzähler baut EMBER. Aus dem Zwang, Struktur von außen zu brauchen, wird die Fähigkeit, selbst Struktur für Geschichten und andere Menschen zu schaffen.",
    chapterGoal:
      "Das persönliche Finale an Arbeit, Glaube, Beziehung und Selbstverständnis anbinden, ohne es zu sauber zu schließen.",
    outline: [
      "Nicht als Startup-Glanz, sondern als innere Logik erzählen.",
      "EMBER steht für gebaute Ordnung gegen inneres Chaos.",
      "Die Beziehung und der Glaube sind Halt, aber nicht Kitschauflösung.",
      "Das Ende soll Sieg und Restoffenheit zugleich tragen."
    ],
    directives: {
      ...createEmptyBookSceneCardDirectives(),
      objective: "Die innere Entwicklung in eine konkrete Schöpfung überführen",
      dramaticBeat: "Der frühere Mangel wird zu einer Fähigkeit",
      ending: "Kein sauberes Happy End, sondern ein tragfähiger neuer Zustand"
    }
  }
]

async function main() {
  const existing = (await listStudioStories()).find(function (story) {
    return normalizeText(story.title) === normalizeText(PROJECT_TITLE)
  })

  if (existing) {
    console.log(
      JSON.stringify(
        {
          status: "exists",
          storyId: existing.id,
          workspaceId: existing.workspaceId,
          title: existing.title
        },
        null,
        2
      )
    )
    return
  }

  const regieMarkdown = await readFile(path.resolve(process.cwd(), REGIE_PATH), "utf8")
  const created = await createStudioStory()
  const baseStory = await loadStudioStory(created.storyId)
  const seededStory = buildSeededStory(baseStory, regieMarkdown)
  const syncedStory = syncStoryBookArtifacts(seededStory)

  await saveStudioStory(syncedStory)

  const savedStory = await loadStudioStory(syncedStory.id)
  const totalScenes = savedStory.acts.reduce(function (sum, act) {
    return (
      sum +
      act.chapters.reduce(function (chapterSum, chapter) {
        return chapterSum + chapter.scenes.length
      }, 0)
    )
  }, 0)

  console.log(
    JSON.stringify(
      {
        status: "created",
        storyId: savedStory.id,
        workspaceId: savedStory.workspaceId,
        title: savedStory.title,
        activePhase: savedStory.book.activePhase,
        acts: savedStory.acts.length,
        scenes: totalScenes,
        worldBible: savedStory.worldBible.length,
        sceneCards: savedStory.book.memory.sceneCards.length,
        contextPacks: savedStory.book.memory.contextPacks.length
      },
      null,
      2
    )
  )
}

function buildSeededStory(baseStory: StoryDocument, regieMarkdown: string) {
  const nextStory: StoryDocument = {
    ...baseStory,
    title: PROJECT_TITLE,
    authorName: "",
    meta: {
      ...baseStory.meta,
      genre: "Autofiction / Entwicklungsroman / Memoir"
    }
  }

  nextStory.book = {
    ...nextStory.book,
    activePhase: "phase_1_foundation",
    targetFormat: "novel",
    targetLengthWords: 85000,
    masterBrief: {
      premise:
        "Ein Mann, der gelernt hat, alleine zu überleben, lernt langsam, nicht mehr alleine sein zu müssen.",
      readerPromise:
        "Der Leser blickt hinter die funktionierende Oberfläche eines Mannes und versteht, welchen stillen Schmerz Menschen in sich tragen können.",
      endingPromise:
        "Der Protagonist rettet sich nicht durch äußere Erlösung, sondern durch Erkenntnis, Wut, Glauben, Zeit und die Fähigkeit, Nähe auszuhalten.",
      thematicCore:
        "Wir sehen nicht, welchen Schmerz der Mensch neben uns trägt. Wer nie gefragt wurde, lernt zu funktionieren und Menschen zu lesen, aber nicht, sich selbst sicher in der Welt zu halten.",
      storyArchitecture: [
        "Akt 1: Kindheit, Zugehörigkeitswunde und Krankheit des Vaters",
        "Akt 2: Ausbildung, Arbeit, Sucht, Beziehung und materieller Absturz",
        "Akt 3: Suchtausstieg, Benennung der Angst, Glaube, Beziehung und Aufbau von EMBER"
      ]
    },
    marketBrief: {
      amazonGoal: "Autofiction/Memoir mit klarer literarischer Zugänglichkeit und emotionaler Marktschärfe",
      categoryLane: "Autofiction / Entwicklungsroman / Memoir",
      hook: "Ein Mann liest Menschen so präzise, weil niemand je gelernt hat, seinen eigenen Schmerz mit ihm zu tragen.",
      seriesPotential: "Nein, als in sich geschlossener Lebensbogen gedacht",
      coverDirection: "Nüchtern, urban, verletzlich. Kein Pathos, keine Selbsthilfe-Anmutung.",
      publishingGuardrails: [
        "Kein sentimentaler Ton",
        "Konkrete sinnliche Details vor abstrakter Erklärung",
        "Keine Auflösung von außen",
        "Scham und Ambivalenz dürfen stehen bleiben"
      ]
    },
    writerConstitution: [
      "Ich-Perspektive oder sehr nahe dritte Person",
      "Kein sentimentaler Ton. Nüchtern, präzise, ehrlich.",
      "Konkrete sinnliche Details sind stärker als abstrakte Emotionen.",
      "Keine Auflösung von außen. Der Protagonist rettet sich selbst.",
      "Die Scham darf stehen bleiben. Sie muss nicht sauber erklärt werden.",
      "Menschen und Milieus nicht dekorativ, sondern funktional und beobachtet schreiben."
    ]
  }

  const seededStructure = buildStoryStructure()
  nextStory.acts = seededStructure.acts
  nextStory.book.memory = {
    ...nextStory.book.memory,
    sceneCards: seededStructure.sceneCards,
    openThreads: seededStructure.openThreads
  }
  nextStory.worldBible = buildWorldBible()
  nextStory.assistant = {
    ...nextStory.assistant,
    threads: [
      {
        id: createUuid(),
        title: "Regiebrief Import",
        summary: "Projektseed aus Regie-2-Der-Feind-bin-ich.md",
        context: createDefaultAssistantContextSelection("project"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      }
    ],
    artifacts: []
  }

  const threadId = nextStory.assistant.threads[0]?.id ?? createUuid()
  nextStory.assistant.artifacts = [
    {
      id: createUuid(),
      threadId,
      sourceMessageId: null,
      title: "Regiebrief – Der Feind bin ich",
      kind: "regie",
      format: "markdown",
      summary: "Originale Projektregie als Referenzartefakt",
      content: regieMarkdown,
      context: createDefaultAssistantContextSelection("project"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  return nextStory
}

function buildStoryStructure() {
  const acts: StoryAct[] = []
  const sceneCards: BookSceneCard[] = []
  const sceneIdsByTitle = new Map<string, string>()
  let sceneIndex = 0

  SCENE_SEEDS.forEach(function (seed) {
    let act = acts.find(function (entry) {
      return entry.title === seed.actTitle
    })

    if (!act) {
      act = {
        id: createUuid(),
        title: seed.actTitle,
        order: acts.length + 1,
        chapters: []
      }
      acts.push(act)
    }

    const chapterId = createUuid()
    const sceneId = createUuid()
    const chapterOrder = act.chapters.length + 1

    act.chapters.push({
      id: chapterId,
      actId: act.id,
      title: seed.chapterTitle,
      order: chapterOrder,
      wordCount: 0,
      scenes: [
        {
          id: sceneId,
          chapterId,
          title: seed.sceneTitle,
          order: 1,
          label: `SCENE_${sceneIndex + 1}`,
          summary: seed.summary,
          wordCount: 0,
          blocks: [],
          choices: []
        }
      ]
    })

    sceneCards.push({
      sceneId,
      sceneTitle: seed.sceneTitle,
      actTitle: seed.actTitle,
      chapterTitle: seed.chapterTitle,
      summary: seed.summary,
      excerpt: seed.summary,
      orderLabel: `SCENE_${sceneIndex + 1}`,
      chapterGoal: seed.chapterGoal,
      directives: seed.directives,
      outline: seed.outline
    })

    sceneIdsByTitle.set(seed.sceneTitle, sceneId)
    sceneIndex += 1
  })

  const openThreads: BookOpenThread[] = [
    {
      id: createUuid(),
      label: "Zugehörigkeit",
      detail: "Der Erzähler bleibt zwischen Herkunft, Umfeld und sozialer Lesbarkeit ohne stabiles Zugehörigkeitsgefühl.",
      sourceSceneId: sceneIdsByTitle.get("Szene 1 – Dritte Klasse") ?? "",
      sourceSceneTitle: "Szene 1 – Dritte Klasse",
      status: "active",
      priority: "high",
      payoffSceneId: null
    },
    {
      id: createUuid(),
      label: "Tragen ohne Frage",
      detail: "Die Familie funktioniert über Routinen, aber fragt den Jungen nicht, was er innerlich trägt.",
      sourceSceneId: sceneIdsByTitle.get("Szene 2 – Zuhause nach der Schule") ?? "",
      sourceSceneTitle: "Szene 2 – Zuhause nach der Schule",
      status: "active",
      priority: "high",
      payoffSceneId: null
    },
    {
      id: createUuid(),
      label: "Scham ohne Sprache",
      detail: "Die Pflege des Vaters prägt eine Scham, die nicht besprochen und nicht aufgelöst wird.",
      sourceSceneId: sceneIdsByTitle.get("Szene 3 – Den Vater aus der Badewanne heben") ?? "",
      sourceSceneTitle: "Szene 3 – Den Vater aus der Badewanne heben",
      status: "active",
      priority: "high",
      payoffSceneId: null
    },
    {
      id: createUuid(),
      label: "Sucht als Auffangbecken",
      detail: "Die Spielhalle wird zum funktionalen Ersatz für Halt, Gespräch und Selbstregulation.",
      sourceSceneId: sceneIdsByTitle.get("Szene 5 – Das Auffangbecken") ?? "",
      sourceSceneTitle: "Szene 5 – Das Auffangbecken",
      status: "active",
      priority: "high",
      payoffSceneId: null
    },
    {
      id: createUuid(),
      label: "Aus Einsamkeit wird Struktur",
      detail: "Die offene Frage lautet, ob aus Schmerz und Notwendigkeit eine tragfähige Fähigkeit entstehen kann.",
      sourceSceneId: sceneIdsByTitle.get("Szene 7 – Erster Tag ohne Spielen") ?? "",
      sourceSceneTitle: "Szene 7 – Erster Tag ohne Spielen",
      status: "active",
      priority: "medium",
      payoffSceneId: sceneIdsByTitle.get("Szene 9 – Struktur für andere bauen") ?? null
    }
  ]

  return {
    acts,
    sceneCards,
    openThreads
  }
}

function buildWorldBible(): WorldBibleEntry[] {
  return [
    {
      id: createUuid(),
      title: "Erzähler",
      kind: "character",
      summary:
        "Türkischer Alevit aus Kars, aufgewachsen im deutschen Immigrantenviertel. Kann Menschen präzise lesen, fühlt sich selbst aber nirgends sicher."
    },
    {
      id: createUuid(),
      title: "Vater",
      kind: "character",
      summary:
        "Erkrankt an Lungenkrebs und wird über Jahre zur stillen Mitte der familiären Belastung. Seine Krankheit zwingt den Sohn früh in eine Erwachsenenrolle."
    },
    {
      id: createUuid(),
      title: "Mutter",
      kind: "character",
      summary:
        "Leidet mit, organisiert den Alltag weiter und hält die Familie über Funktion zusammen, ohne den Schmerz offen zu besprechen."
    },
    {
      id: createUuid(),
      title: "Bruder",
      kind: "character",
      summary:
        "Organisiert später die erste Ausbildung, flieht aber früh aus dem Elternhaus und steht für eine andere Form des Überlebens."
    },
    {
      id: createUuid(),
      title: "Schwester",
      kind: "character",
      summary:
        "Schließt sich in den Familienjahren eher ab und gehört zum gemeinsamen, aber still getrennten Leiden."
    },
    {
      id: createUuid(),
      title: "Erhan",
      kind: "character",
      summary:
        "Bester Freund der Kindheit, zugleich Nähe und Kränkung. Sieht die Gewalt, schützt den Erzähler aber nicht wirklich."
    },
    {
      id: createUuid(),
      title: "Immigrantenviertel",
      kind: "location",
      summary:
        "Ein deutsches Viertel, in dem Zugehörigkeit dauernd verhandelt wird. Herkunft, Blick der anderen und soziale Härte prägen jede Alltagsszene."
    },
    {
      id: createUuid(),
      title: "Spielhalle",
      kind: "location",
      summary:
        "Ort der Betäubung. Kein Gemeinschaftsraum, sondern ein funktionales Auffangbecken für Einsamkeit und Kontrollverlust."
    },
    {
      id: createUuid(),
      title: "Einsamkeit",
      kind: "theme",
      summary:
        "Die zentrale innere Formation des Romans: getragen, weil niemand fragt, und später in Wahrnehmung und Struktur verwandelt."
    },
    {
      id: createUuid(),
      title: "EMBER",
      kind: "object",
      summary:
        "Die gebaute Struktur am Ende des Bogens. Ausdruck dafür, dass aus Mangel und Notwendigkeit eine produktive Form entstehen kann."
    }
  ]
}

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

main().catch(function (error) {
  if (error instanceof Error) {
    console.error(error.stack || error.message)
  } else {
    console.error(String(error))
  }
  process.exitCode = 1
})
