window.EMBER_STORY = {
  meta: {
    appTitle: "EMBER",
    appSubtitle: "Lies. Sieh. Entscheide.",
    storyTitle: "Der\u00A0Ring\u00A0im Erdreich",
    storyDescription:
      "Ein ungelöster Mord in den Karpaten. Ein Dorf, das unter der Last seiner eigenen Geschichte erstickt. Und ein Ermittler, der lernen muss, dass manche Wahrheiten besser vergraben geblieben wären.",
    tags: ["Psychothriller", "Noir", "Okkult"]
  },
  startSceneId: "scene1",
  scenes: [
    {
      id: "scene1",
      chapterKey: "chapter-1",
      chapter: "Kapitel I – Der Geruch von Erde",
      chapterCard: {
        eyebrow: "Kapitel I",
        title: "Der Geruch von Erde"
      },
      sceneTitle: "Das Büro",
      visual: "office",
      imageSrc: "./Der_Auftrag.png",
      imageAlt: "Jonas Falk im Halbdunkel seines Büros.",
      imagePosition: "center 0%",
      hideImageLabel: true,
      blocks: [
        {
          text: "Adrian Petrescu brachte den Oktober mit in das Zimmer. Er roch nach aufgewühlten Gräbern und dem bitteren Beigeschmack von billigem Tabak, der in nassem Tuch hängengeblieben war. Er mied den angebotenen Stuhl; er stand einfach da, den Mantel bis zum Kinn geschlossen, als wäre Höflichkeit eine Last, die er nicht mehr tragen konnte."
        },
        {
          text: "„Sie sagen, sie sei weggelaufen“, krächzte er. Seine Stimme klang wie Pergament, das zu lange in der Sonne gelegen hatte. „Aber Elena läuft nicht weg. Nicht ohne ihre Schuhe. Nicht ohne das Kind zu küssen.“"
        },
        {
          text: "Er schob ein zerknittertes Foto über den Schreibtisch. Eine Frau mit klugen Augen, die Jonas direkt anzusehen schienen. Daneben legte er ein Notizbuch, dessen Ecken so abgegriffen waren, dass sie sich nach innen rollten."
        },
        {
          text: "„Man fand sie am Waldrand. Die Polizei nennt es einen Unglücksfall. Aber unter ihren Fingernägeln klebte schwarze Asche. Und ihr Ehering... er wurde nicht gestohlen. Er wurde ersetzt.“"
        },
        {
          text: "Jonas Falk hasste das Schweigen von Dörfern. Es war kein friedliches Schweigen, sondern das angespannte Luftholen eines Tieres, das darauf wartet, dass der Fremde wieder verschwindet. Aber die Erwähnung der Asche weckte seinen Instinkt – jenen dunklen Teil in ihm, der wusste, dass echte Gewalt keine Spuren hinterlässt, sondern Narben."
        }
      ],
      choices: [
        {
          label: "„Zeigen Sie mir Elenas Aufzeichnungen.“",
          next: "scene2",
          set: { approach: "notes" }
        },
        {
          label: "„Was verschweigt die örtliche Polizei?“",
          next: "scene2",
          set: { approach: "police" }
        },
        {
          label: "„Warum kommen Sie erst jetzt zu mir?“",
          next: "scene2",
          set: { approach: "instinct" }
        }
      ]
    },
    {
      id: "scene2",
      chapterKey: "chapter-1",
      chapter: "Kapitel I – Das Tal der Schatten",
      chapterCard: {
        eyebrow: "Kapitel I",
        title: "Das Tal der Schatten"
      },
      sceneTitle: "Die Ankunft",
      visual: "village",
      imageSrc: "./Dorf_Vallachei.png",
      imageAlt: "Ein nebliges Dorf, eingekesselt von schwarzen Hügeln.",
      hideImageLabel: true,
      blocks: [
        {
          when: { approach: "notes" },
          text: "Jonas blätterte durch das Notizbuch. Die Schrift wurde zum Ende hin hastiger, fast schon verzweifelt. 'Drei Schritte. Pause. Drei Schritte. Pause. Er wartet nicht im Wald, er wartet im Wind.' Die Sätze ergaben keinen Sinn, aber die Angst, die aus den Buchstaben troff, war fast körperlich spürbar."
        },
        {
          when: { approach: "police" },
          text: "Die offizielle Akte war eine Beleidigung für jeden Ermittler. Keine Tatortfotos, keine Zeugenaussagen, nur ein knapper Bericht über 'Tod durch Unterkühlung'. Polizeichef Dobre hatte das Dokument mit der Gleichgültigkeit eines Mannes unterschrieben, der gewohnt war, dass niemand Fragen stellte."
        },
        {
          when: { approach: "instinct" },
          text: "Adrian Petrescu war kein guter Lügner, aber er war ein Mann, der von einem Geheimnis zerfressen wurde. Die schwarze Asche war kein Zufall – es war eine Signatur. In dieser Gegend gab es alte Feuer, die man besser nicht schürte."
        },
        {
          text: "Als Jonas das Dorf erreichte, fühlte es sich an, als würde die Landschaft ihn verschlucken. Die Hügel hingen tief über den Häusern, und der Nebel fraß das Licht der Mittagssonne. Die Kirche thronte über allem wie ein strenger Wächter, dessen Glockenturm sich leicht zur Seite neigte, als würde er dem Flüstern im Erdreich lauschen."
        },
        {
          text: "Polizeichef Dobre empfing ihn in einer Amtsstube, die nach kaltem Kaffee und Korruption roch. Er wirkte nicht feindselig, sondern lediglich gelangweilt – die gefährlichste Form von Widerstand. Hier würde niemand die Wahrheit sagen, solange die Lüge noch bequem war."
        }
      ],
      choices: [
        {
          label: "Die Akte im Revier genauer prüfen.",
          next: "scene3",
          set: { focus: "file" }
        },
        {
          label: "Das Haus der Toten untersuchen.",
          next: "scene3",
          set: { focus: "house" }
        }
      ]
    },
    {
      id: "scene3",
      chapterKey: "chapter-1",
      chapter: "Kapitel I – Reliquien des Schweigens",
      chapterCard: {
        eyebrow: "Kapitel I",
        title: "Reliquien des Schweigens"
      },
      sceneTitle: "Spurensuche",
      visual: "symbol",
      imageSrc: "./Das_zeichen.png",
      imageAlt: "Ein Tisch mit Beweisstücken im Halbschatten.",
      hideImageLabel: true,
      blocks: [
        {
          when: { focus: "file" },
          text: "Jonas stahl sich einen Moment mit der Akte. Zwischen den lieblosen Berichten fand er ein Detail, das Dobre übersehen hatte: Ein forensisches Diagramm der Wunde am Hals. Es war kein Schnitt. Es war ein Biss – aber nicht von einem Tier. Die Zähne waren zu gleichmäßig, zu... menschlich."
        },
        {
          when: { focus: "house" },
          text: "Im Haus der Petrescus schien die Zeit geronnen zu sein. In einer geheimen Nische hinter der Küchenverkleidung fand Jonas eine Sammlung alter Zeitungsberichte. Alle handelten von verschwundenen Frauen, alle im Abstand von genau sieben Jahren. Elena hatte ein Muster entdeckt, das älter war als das Dorf selbst."
        },
        {
          text: "Auf einem der vergilbten Blätter hatte sie ein Zeichen hinterlassen: Ein unvollendeter Kreis, in den drei Striche wie Splitter hineinragten. Es wirkte wie eine offene Wunde im Papier. 'Der Ring ist nicht der Schmuck', stand darunter in ihrer feinen Schrift. 'Der Ring ist die Fessel.'"
        },
        {
          text: "Adrian gestand schließlich mit gesenktem Kopf: Der Ring war ein Erbstück. Silber, besetzt mit einem Stein, so schwarz, dass er das Kerzenlicht zu verschlingen schien. Seine Großmutter hatte behauptet, der Ring gehöre jenem, der 'unter dem Berg' wacht. Elena hatte ihn nur eine Nacht lang getragen. Danach begannen die Schritte auf dem Dach."
        }
      ],
      choices: [
        {
          label: "Dem Pfad in den Wald folgen.",
          next: "scene4"
        },
        {
          label: "Adrian zur Wahrheit zwingen.",
          next: "scene4",
          set: { confrontedHusband: true }
        }
      ]
    },
    {
      id: "scene4",
      chapterKey: "chapter-2",
      chapter: "Kapitel II – Das Skelett der Kapelle",
      chapterCard: {
        eyebrow: "Kapitel II",
        title: "Das Skelett der Kapelle"
      },
      sceneTitle: "Die Kapelle",
      visual: "chapel",
      imageLabel: "Die Ruine im Wald bei Nacht.",
      blocks: [
        {
          when: { confrontedHusband: true },
          text: "Jonas packte Adrian am Revers und drückte ihn gegen die kalte Küchenwand. Der Mann brach zusammen wie ein Kartenhaus. 'Wir hatten keine Wahl!', schluchzte er. 'Dobre, der Pater... sie sagen, es bewahrt den Frieden. Ein Opfer alle sieben Jahre, damit der Rest von uns leben kann.' Jonas fühlte eine Kälte, die nichts mit dem Wetter zu tun hatte."
        },
        {
          unless: { confrontedHusband: true },
          text: "Die Dunkelheit im Wald war absolut. Die Bäume standen so dicht, dass die Luft zwischen ihnen zu stehen schien, schwer und modrig. Jonas folgte der Wegbeschreibung aus dem Notizbuch, während jeder Astbruch wie ein Pistolenschuss in der Stille hallte."
        },
        {
          text: "Die Kapelle war kaum mehr als ein Skelett aus Stein. Auf dem Altar, umgeben von Klumpen aus schwarzem Wachs, lag er: der Ring. Als Jonas ihn berührte, überflutete ihn eine Vision von entsetzlicher Klarheit. Er sah Elena, umringt von den Männern des Dorfes. Dobre war da. Pater Luca auch. Und abseits stand eine Gestalt im feinen Zwirn, deren Gesicht im Schatten blieb."
        },
        {
          text: "„Man gewöhnt sich an das Grauen, Herr Falk“, durchschnitt eine Stimme die Dunkelheit. Der Mann aus der Vision stand nun wirklich dort. Er wirkte fehl am Platz in diesem Verfall, zu sauber, zu ruhig. „Man nennt es Tradition, um nachts schlafen zu können. Ich bin nur der Verwalter dieser Notwendigkeit.“"
        }
      ],
      choices: [
        {
          label: "„Was wollen Sie von mir?“",
          next: "scene5",
          set: { darkPath: true }
        },
        {
          label: "„Ich werde Sie alle verhaften lassen.“",
          next: "scene5",
          set: { darkPath: false }
        }
      ]
    },
    {
      id: "scene5",
      chapterKey: "chapter-3",
      chapter: "Kapitel III – Die Anatomie der Lüge",
      chapterCard: {
        eyebrow: "Kapitel III",
        title: "Die Anatomie der Lüge"
      },
      sceneTitle: "Der Abgrund",
      visual: "chamber",
      imageLabel: "Die unterirdische Kammer.",
      blocks: [
        {
          when: { darkPath: true },
          text: "Jonas rannte nicht weg. Etwas in der ruhigen Logik des Fremden faszinierte ihn. In einer Welt voller Chaos wirkte dieses grausame System fast schon... ordentlich. Später, in der Kammer unter dem Fundament, begann er zu verstehen: Macht ist die einzige Wahrheit, die Bestand hat."
        },
        {
          when: { darkPath: false },
          text: "Jonas wich zurück, die Hand an der Waffe. Doch im Dorf gab es kein Gesetz mehr, das ihn schützen konnte. Als er wenig später gefesselt in der feuchten Dunkelheit unter der Kapelle erwachte, sah er in die Gesichter der Männer, die er für Nachbarn gehalten hatte. Sie wirkten nicht wie Mörder, sondern wie Beamte bei einer ungeliebten Pflicht."
        },
        {
          text: "Der Fremde trat ins Licht der Fackeln. „Elena Petrescu wollte den Kreis brechen, aber Kreise haben keinen Anfang und kein Ende. Sie sind die perfekte Form. Nehmen Sie den Ring, Jonas. Werden Sie das Auge, das sieht, was die anderen im Dorf ignorieren müssen. Oder werden Sie Teil des Erdreichs, so wie sie.“"
        }
      ],
      choices: [
        {
          label: "„Ich werde kein Teil Ihres Wahnsinns.“",
          next: "endingA"
        },
        {
          label: "„Zeigen Sie mir, wie tief das Loch geht.“",
          next: "endingB"
        }
      ]
    }
  ],
  endings: {
    endingA: {
      id: "endingA",
      title: "Ende A – Der zerbrochene Kreis",
      paragraphs: [
        "Jonas sah in die gähnende Leere des schwarzen Steins und spürte die Versuchung der absoluten Klarheit. Doch dann dachte er an Elenas lachende Augen auf dem Foto. Wenn das Böse eine Notwendigkeit war, dann war sein Widerstand die einzige Freiheit, die ihm blieb.",
        "Er nahm den Ring nicht. Stattdessen begann er zu lachen – ein trockenes, freudloses Geräusch. Er konfrontierte Pater Luca mit seiner Feigheit, bis der alte Mann vor Scham zu weinen begann. Die moralische Autorität des Fremden bröckelte, als Jonas die profane Wahrheit aussprach: Das hier war kein heiliges Opfer. Es war ein billiger Mord hinter einer Fassade aus Aberglauben.",
        "Der Bann brach. Nicht mit einem Knall, sondern mit einem Seufzen. Die Männer ließen die Waffen sinken. Dobre floh in die Nacht, während Pater Luca zum ersten Mal seit Jahrzehnten die Wahrheit sprach. Der Fremde verschwand im Schatten, als hätte er nie wirklich existiert.",
        "Monate später saß Jonas in seinem Büro. Das Dorf war nun ein Tatort der Staatsanwaltschaft, die Gräber wurden geöffnet. Er hatte den Fall gelöst, aber er schlief nie wieder ohne Licht. Er wusste jetzt, dass das Dunkle nicht im Wald wohnte, sondern in der Bequemlichkeit des Schweigens."
      ]
    },
    endingB: {
      id: "endingB",
      title: "Ende B – Das neue Auge",
      paragraphs: [
        "Jonas streckte die Hand aus. Der Ring fühlte sich warm an, fast wie pulsierende Haut. Als er ihn über den Finger schob, verstummte das Hämmern in seinem Kopf. Die Welt veränderte sich. Er sah nicht mehr nur Gesichter; er sah die Fäden der Schuld, die jeden Mann im Raum mit dem Erdreich verbanden.",
        "Er wusste nun, wo Dobre das Geld versteckt hatte, er kannte die geheimen Sünden des Paters und die feige Liebe Adrians. Es war keine Magie. Es war eine Hyper-Wahrnehmung, ein schreckliches Verständnis für die Mechanik der menschlichen Schwäche.",
        "Innerhalb einer Woche war das Dorf 'gesäubert'. Dobre gestand alles, Adrian wurde als Sündenbock präsentiert, und der Fall Elena Petrescu wurde mit klinischer Präzision geschlossen. Jonas Falk verließ das Tal als gefeierter Held, als der Mann, der das Unmögliche aufgeklärt hatte.",
        "Doch der Preis war hoch. Nachts, wenn es still wurde, hörte er das geduldige Atmen unter dem Asphalt der Stadt. Er fand jeden Vermissten, löste jedes Rätsel, doch er konnte nie wieder eine Hand schütteln, ohne den Verfall darunter zu spüren. Er war nun der Verwalter der Wahrheiten, die niemand hören wollte. Und der Ring saß so fest, als wäre er mit seinem Knochen verwachsen."
      ]
    }
  }
};
