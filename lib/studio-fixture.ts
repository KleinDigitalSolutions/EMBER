import { createDefaultBookBlueprint, defineStory } from "@/lib/story-schema";

export const studioStory = defineStory({
  id: "story_ring_im_erdreich",
  workspaceId: "local_workspace",
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
        "Ein Ermittler zieht einen scheinbar lokalen Vermisstenfall auf und oeffnet dabei eine soziale Druckkammer, die ihn selbst verschiebt.",
      readerPromise:
        "Ein psychologischer Ermittlungsroman mit klarer Spannung, eskalierendem Dorfdruck und lesbarem kommerziellem Zug.",
      endingPromise:
        "Der Fall loest sich nicht nur im Aussen, sondern zwingt Jonas in einen Rollenwechsel mit Kosten.",
      thematicCore:
        "Kontrolle kippt in Mitschuld, sobald Ordnung wichtiger wird als Wahrheit."
    },
    marketBrief: {
      ...createDefaultBookBlueprint("New Novel").marketBrief,
      amazonGoal:
        "Ein sauber paketierbarer Genretitel, der als erster Band oder Standalone verkauft werden kann.",
      categoryLane: "Psychothriller / Dorfgeheimnis / Ermittler mit moralischer Reibung",
      hook:
        "Ein Ermittler sucht eine verschwundene Frau und merkt zu spaet, dass das Dorf nicht luegt, sondern gemeinsam redigiert.",
      seriesPotential:
        "Jonas Falk kann weitere Faelle mit strukturgetriebenem Blick tragen, sofern jeder Fall einen anderen sozialen Mechanismus oeffnet.",
      coverDirection:
        "Nebel, Dorfkante, reduzierte Symbolik statt generischer Crime-Collage."
    },
    amazonOps: {
      penName: "Oezguer Azap",
      subtitle: "Ein Dorf, ein Notizbuch, ein Ermittler ohne sicheren Boden",
      seriesName: "Jonas-Falk-Faelle",
      volumeNumber: "1",
      description:
        "Als eine Frau verschwindet, glaubt Ermittler Jonas Falk an einen lokalen Fall. Doch je tiefer er in das Dorf eindringt, desto deutlicher wird: Hier wird nicht gelogen, hier wird kollektiv redigiert. Ein psychologischer Spannungsroman ueber Kontrolle, Mitschuld und die Kosten von Ordnung.",
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
  worldBible: [
    {
      id: "wb_jonas",
      title: "Jonas Falk",
      kind: "character",
      summary: "Ermittler, der Struktur schneller erkennt als Pathos."
    },
    {
      id: "wb_elena",
      title: "Elena Petrescu",
      kind: "character",
      summary: "Abwesende Figur, deren Notizbuch das ganze Dorf unter Druck setzt."
    },
    {
      id: "wb_ring",
      title: "Der Ring",
      kind: "object",
      summary: "Objekt, Fessel und Rollenübergang statt bloßer Hinweis."
    }
  ],
  variables: [
    {
      id: "var_focus",
      key: "focus",
      label: "Investigative focus",
      type: "enum",
      defaultValue: "none"
    },
    {
      id: "var_alone",
      key: "aloneInForest",
      label: "Jonas enters forest alone",
      type: "boolean",
      defaultValue: true
    }
  ],
  acts: [
    {
      id: "act_1",
      title: "Act 1",
      order: 1,
      chapters: [
        {
          id: "chapter_1",
          actId: "act_1",
          title: "Chapter 1",
          order: 1,
          wordCount: 156,
          scenes: [
            {
              id: "scene_1",
              chapterId: "chapter_1",
              title: "Scene 1",
              order: 1,
              label: "Label",
              summary:
                "Als Adrian Petrescu an diesem verregneten Mittwochabend Jonas Falks Büro betrat, kam nicht nur ein Fall herein.",
              wordCount: 156,
              blocks: [
                {
                  id: "scene_1_block_1",
                  kind: "paragraph",
                  text:
                    "Adrian bringt den Oktober mit ins Zimmer. Jonas erkennt, dass dieser Besuch mehr nach Struktur als nach Trauer riecht."
                }
              ],
              choices: [
                {
                  id: "choice_1",
                  label: "Das Notizbuch aufschlagen",
                  toSceneId: "scene_2",
                  conditions: [],
                  effects: []
                }
              ]
            },
            {
              id: "scene_2",
              chapterId: "chapter_1",
              title: "Scene 2",
              order: 2,
              label: "Label",
              summary: "Add summary...",
              wordCount: 0,
              blocks: [
                {
                  id: "scene_2_block_1",
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
});
