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
    // KAPITEL I
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
          text: "Adrian Petrescu brachte den Oktober mit in das Zimmer. Er roch nach aufgewühltem Erdreich und dem bitteren Nachhall von billigem Tabak – dem Tabak, den man sich kauft, wenn man aufgehört hat, an die Zukunft zu denken. Er lehnte die Tür hinter sich so leise ins Schloss, als hätte er Angst, irgendetwas zu wecken."
        },
        {
          text: "Jonas Falk beobachtete ihn vom Schreibtisch aus. Er kannte diesen Typ Mann: die Art, die nicht kam, um Hilfe zu bitten, sondern weil sie nirgendwo mehr hingehen konnte. Die Finger bewegten sich unablässig – nicht aus Nervosität, sondern aus dem mechanischen Reflex des Verzweifelten, der nicht weiß, wohin mit seinen Händen, wenn sie nichts mehr halten."
        },
        {
          text: "„Sie sagen, sie sei weggelaufen.“ Seine Stimme klang wie das Knirschen von Eis, das zu lange getragen hat. „Aber Elena läuft nicht weg. Nicht ohne ihre Schuhe. Nicht ohne das Kind zu küssen.“ Er schob ein Foto über den Schreibtisch – nicht mit dem Eifer eines Mannes, der Beweise präsentiert, sondern mit der Erschöpfung eines Mannes, der dasselbe Bild schon hundert Mal gezeigt hatte und jedes Mal dieselbe Gleichgültigkeit erntete."
        },
        {
          text: "Die Frau auf dem Foto hatte kluge Augen. Nicht schön im landläufigen Sinne, sondern mit jener Schärfe, die Menschen entwickeln, die gelernt haben, schneller zu denken als die Welt um sie herum. Neben dem Foto lag ein Notizbuch, dessen Einband so abgegriffen war, dass er sich an den Rändern nach innen rollte – wie die Seiten eines Buches, das zu oft im Regen gelegen hat."
        },
        {
          text: "„Man fand sie am Waldrand.“ Adrian sprach jetzt leiser, als würden die Worte ihn etwas kosten. „Die Polizei nennt es einen Unglücksfall. Unterkühlung. Aber unter ihren Fingernägeln klebte schwarze Asche – keine natürliche, kein Holz, keine Kohle. Etwas anderes. Und ihr Ehering...“ Er hielt inne. „Er wurde nicht gestohlen. Er wurde ersetzt. Ein anderer Ring, fast identisch. Aber nicht der, den ich ihr gegeben habe. Ich erkenne diesen Ring. Er riecht falsch.“"
        },
        {
          text: "Es war die Erwähnung der Asche, die Jonas aus seiner professionellen Distanz riss. Nicht der Schmerz des Mannes – Schmerz kannte er zur Genüge. Aber schwarze Asche unter den Nägeln einer Toten, und ein Ring, der ausgetauscht worden war wie eine Komponente in einer Maschine: Das war keine Tat aus Leidenschaft. Das war Ritual. Das war Verwaltung."
        },
        {
          text: "Er nahm das Notizbuch."
        }
      ],
      choices: [
        {
          label: "Das Notizbuch aufschlagen →",
          next: "scene2"
        }
      ]
    },
    {
      id: "scene2",
      chapterKey: "chapter-1",
      chapter: "Kapitel I – Was sie wusste",
      chapterCard: {
        eyebrow: "Kapitel I",
        title: "Was sie wusste"
      },
      sceneTitle: "Das Notizbuch",
      visual: "office",
      imageSrc: "./Der_Auftrag.png",
      imageAlt: "Das aufgeschlagene Notizbuch auf Jonas' Schreibtisch.",
      imagePosition: "center 0%",
      hideImageLabel: true,
      blocks: [
        {
          text: "Jonas las das Notizbuch in derselben Nacht, in der er es erhalten hatte. Er las es von vorne nach hinten und dann noch einmal von hinten nach vorne, weil er das Gefühl nicht loswurde, dass die Bedeutung irgendwo zwischen den Zeilen versteckt lag – in den Lücken zwischen dem, was Elena aufgeschrieben hatte, und dem, was sie nicht mehr zu Papier gebracht hatte."
        },
        {
          text: "Die frühen Einträge waren nüchtern, fast journalistisch. Jahreszahlen. Namen. Ein Muster, das sie aus alten Gemeindeprotokollen destilliert hatte: 1961. 1968. 1975. 1982. 1989. 1996. 2003. 2010. Immer sieben Jahre. Immer eine Frau aus dem Dorf. Immer ein offizieller Befund, der nach nichts roch. Nach dem Eintrag für 2003 hatte sie mit blasserer Tinte hinzugefügt: 'Dobre war damals noch Assistent.'"
        },
        {
          text: "Zur Mitte des Hefts wurde die Handschrift anders. Größer. Die Buchstaben nicht mehr gleichmäßig, sondern drängend, als hätte die Hand nicht mehr mit dem Kopf Schritt halten können. Sie beschrieb Träume – oder was sie Träume nannte – von einem Mann ohne Gesicht, der im Wald stand und wartete. Nicht drohend. Geduldig. 'Als würde er wissen, dass ich früher oder später komme', schrieb sie. 'Nicht weil ich muss. Weil die Frage mich frisst.'"
        },
        {
          text: "Die letzten zwanzig Seiten waren schwerer zu lesen. Nicht wegen der Schrift – die war überraschend ruhig –, sondern wegen dessen, was sie enthielten. Elena hatte begonnen, die Logik des Systems zu verstehen, das sie untersuchte. Sie nannte es nicht Mord. Sie nannte es 'Pflege'. Als würde das Dorf ein Wesen pflegen, das unter ihm lebte und das man mit regelmäßigen Abgaben bei Laune halten musste."
        },
        {
          text: "'Der Ring ist nicht der Schmuck', stand auf der vorletzten Seite. 'Der Ring ist die Fessel. Wer ihn trägt, gehört dem Kreis. Wer dem Kreis gehört, zahlt den Preis.' Und darunter, fast unleserlich: 'Drei Schritte. Pause. Drei Schritte. Pause. Er ist nicht im Wald. Er ist im Warten selbst.'"
        },
        {
          text: "Jonas klappte das Heft zu. Draußen war es vier Uhr morgens, und der Regen, der gegen das Fenster schlug, klang auf einmal wie ein gleichmäßiger, geduldiger Rhythmus. Drei Schritte. Pause. Er schlief in dieser Nacht nicht mehr."
        }
      ],
      choices: [
        {
          label: "Nach Vallachei fahren →",
          next: "scene3"
        }
      ]
    },

    // KAPITEL II
    {
      id: "scene3",
      chapterKey: "chapter-2",
      chapter: "Kapitel II – Das Tal der Schatten",
      chapterCard: {
        eyebrow: "Kapitel II",
        title: "Das Tal der Schatten"
      },
      sceneTitle: "Die Ankunft",
      visual: "village",
      imageSrc: "./Dorf_Vallachei.png",
      imageAlt: "Ein nebliges Dorf, eingekesselt von schwarzen Hügeln.",
      hideImageLabel: true,
      blocks: [
        {
          text: "Vallachei lag in einem Talkessel, aus dem der Nebel nie ganz wich. Jonas sah das Dorf zuerst als Abdruck – Dächer, die aus der Suppe der frühen Morgenstunden ragten wie die Rücken von Tieren, die sich ducken. Die Straße, die hineinführte, war so schmal, dass der Wagen die Äste an den Seiten streifte, und Jonas hatte das irrationale Gefühl, dass die Bäume sich hinter ihm schlossen."
        },
        {
          text: "Er hatte in seiner Karriere viele Dörfer gesehen. Dörfer, die Fremde misstrauisch beäugten. Dörfer, die ihre Schuld hinter Gastfreundschaft versteckten. Aber Vallachei war anders: Hier gab es kein Theater. Die Menschen, denen er begegnete – ein alter Mann vor der Schmiede, zwei Frauen mit Einkaufstaschen, ein Kind, das in einer Pfütze kniete –, sahen ihn an und schauten dann weg. Nicht feindselig. Resigniert. So, wie man wegschaut, wenn man weiß, dass das, was kommt, ohnehin nicht aufzuhalten ist."
        },
        {
          text: "Polizeichef Dobre empfing ihn in einem Büro, das so eingerichtet war, dass man darin keine Zeit verschwenden sollte. Ein Schreibtisch. Zwei Stühle. Ein Fenster, das auf eine graue Mauer ging. Dobre selbst war ein großer Mann mit einem kleinen Blick – die Art von Augen, die gelernt hatten, alles zu sehen und nichts zu registrieren. Er bot Jonas keine Hand. Er bot ihm einen Stuhl an und legte dann die Akte auf den Tisch, so wie man jemandem etwas hinwirft, das man loswerden will."
        },
        {
          text: "„Unterkühlung“, sagte er, bevor Jonas eine Frage stellen konnte. „Der Winter kam früh. Sie kannte den Wald nicht gut genug. Das ist alles, was es ist.“ Er lehnte sich zurück und verschränkte die Arme, und Jonas erkannte die Geste: die eines Mannes, der eine Geschichte so oft erzählt hat, dass er sie selbst für wahr hält."
        },
        {
          text: "Jonas ließ Dobre reden. Er beobachtete stattdessen das Büro. Die Uhr an der Wand war drei Minuten vor. Das Aktenregal hatte eine Schublade, die nicht ganz geschlossen war. Auf Dobres linker Manschette – ein fast unsichtbarer Fleck, dunkel und kreisförmig, wie von etwas, das auf Stoff getrocknet war. Kleiner als eine Münze. Schwarz wie Asche."
        }
      ],
      choices: [
        {
          label: "Die Akte im Revier unter die Lupe nehmen.",
          next: "scene4",
          set: { focus: "file" }
        },
        {
          label: "Das Haus der Petrescus inspizieren.",
          next: "scene4",
          set: { focus: "house" }
        },
        {
          label: "Pater Luca im Pfarrhaus aufsuchen.",
          next: "scene4",
          set: { focus: "priest" }
        }
      ]
    },
    {
      id: "scene4",
      chapterKey: "chapter-2",
      chapter: "Kapitel II – Spuren im Schweigen",
      chapterCard: {
        eyebrow: "Kapitel II",
        title: "Spuren im Schweigen"
      },
      sceneTitle: "Die Entdeckung",
      visual: "symbol",
      imageSrc: "./Das_zeichen.png",
      imageAlt: "Ein Tisch mit Beweisstücken im Halbschatten.",
      hideImageLabel: true,
      blocks: [
        {
          when: { focus: "file" },
          text: "Die Akte war ein Meisterwerk an Auslassung. Keine Tatortfotos, obwohl das Protokoll ihre Existenz erwähnte. Keine Aussagen der namentlich zitierten Zeugen. Nur ein knapper, technischer Bericht – und ein forensisches Diagramm, das Dobre übersehen hatte. Jonas fand es zwischen zwei unscheinbaren Seiten, leicht verschoben, als wäre es versehentlich dort hingeraten: eine Skizze der Verletzungen am Hals. Das war kein Tier. Die Abdrücke waren zu gleichmäßig, zu bewusst gesetzt. Keine Zähne, die schlüpfen oder rutschen. Nur Druck. Präzise, kalkulierte, menschliche Kraft."
        },
        {
          when: { focus: "house" },
          text: "Im Haus der Petrescus hatte die Zeit eine andere Konsistenz – zäh, wie Honig, der stockt. Alles war so, wie Elena es verlassen hatte: eine halbfertige Tasse auf dem Tresen, eine Jacke über dem Stuhl, als wäre sie nur kurz nach draußen gegangen. Hinter der Küchenverkleidung – lose Bretter, die man nur fand, wenn man sie suchte – lag Elenas eigentliches Archiv. Zeitungsausschnitte, chronologisch geordnet, mit Annotationen in ihrer präzisen Handschrift. Sieben Frauen, sieben Jahre auseinander, sieben offizielle Erklärungen, alle unterschiedlich, alle unbefriedigend. Auf der letzten Seite hatte sie geschrieben: 'Das Muster ist älter als das Dorf. Das Dorf ist das Muster.'"
        },
        {
          when: { focus: "priest" },
          text: "Pater Luca war ein kleiner Mann mit großen Händen – Arbeiterhände, die nicht zu der Zartheit seines übrigen Auftretens passten. Er empfing Jonas im Pfarrhaus bei Kaffee, den er zu heiß einschenkte, und begann sofort zu reden, bevor Jonas überhaupt fragte. Zu viel, zu schnell: der Unfall, die arme Familie, Gottes unerforschliche Wege. Aber als Jonas das Notizbuch auf den Tisch legte – beiläufig, als wäre es ihm gleichgültig –, verstummte der Pater mitten im Satz. Er erholte sich in weniger als einer Sekunde. Aber in dieser Sekunde sah Jonas, was darunter lag. Nicht Schuld. Erleichterung. Die eines Mannes, der zu lange auf die richtige Frage gewartet hat."
        },
        {
          text: "Was auch immer Jonas gefunden hatte – die Akte, das Archiv, die Reaktion des Paters –, es wies in dieselbe Richtung. Nicht auf eine Person, nicht auf ein Motiv im herkömmlichen Sinne, sondern auf eine Struktur. Eine Abmachung. Das Dorf hatte einen Preis für sich selbst festgesetzt, und dieser Preis wurde seit Jahrzehnten bezahlt. Elena hatte den Preis nicht zahlen wollen. Und so war sie selbst zur Münze geworden."
        },
        {
          text: "Am Abend saß Jonas allein in dem kleinen Zimmer, das er im einzigen Gasthaus des Dorfes gemietet hatte. Das Fenster war beschlagen. Draußen brannte keine einzige Lampe. In Vallachei schien die Nacht vollständiger zu sein als anderswo – schwärzer, dichter, als hätte sie eine eigene Schwerkraft. Er dachte an Elena Petrescu und ihr Notizbuch, und er dachte daran, dass sie gewusst hatte, was sie tat, als sie die Frage stellte. Dass der Mut, den das kostet, eine eigene Form von Irrsinn ist."
        }
      ],
      choices: [
        {
          label: "Adrian Petrescu konfrontieren →",
          next: "scene5"
        }
      ]
    },
    {
      id: "scene5",
      chapterKey: "chapter-2",
      chapter: "Kapitel II – Was der Ehemann weiß",
      chapterCard: {
        eyebrow: "Kapitel II",
        title: "Was der Ehemann weiß"
      },
      sceneTitle: "Das Geständnis",
      visual: "village",
      imageSrc: "./Dorf_Vallachei.png",
      imageAlt: "Ein einsames Haus mit Licht im Fenster bei Nacht.",
      hideImageLabel: true,
      blocks: [
        {
          text: "Jonas fand Adrian Petrescu in der Küche seines Hauses, über einer Flasche Schnaps, die er nicht trank, sondern nur festhielt. Als Jonas eintrat – die Tür war unversperrt –, hob Adrian den Blick nicht. Er sagte nur: „Ich wusste, dass Sie kommen.“"
        },
        {
          text: "Es dauerte lange, bis Adrian anfing zu reden. Jonas ließ ihn. Er kannte die Mechanik des Wartens: Schweigen ist kein leerer Raum, es ist Druck. Und Adrian Petrescu war ein Mann, der schon so lange unter Druck stand, dass er bei der kleinsten Öffnung zusammenbrechen würde. Er brauchte nur den Anlass."
        },
        {
          text: "„Der Ring kam von meiner Großmutter“, begann Adrian schließlich. „Silber. Mit einem Stein, schwarz wie Kohle – aber nicht Kohle. Tiefer. Ich habe nie gerne darüber nachgedacht, woher er stammt. Sie sagte, er gehöre 'dem, der wartet'. Sie sagte, man trägt ihn nicht länger als eine Nacht, und danach legt man ihn zurück. Elena...“ Er schluckte. „Elena hatte ihn eine Nacht lang. Aus Neugier. Weil sie das Muster gefunden hatte und verstehen wollte. Danach begannen die Schritte auf dem Dach.“ Er hielt inne. „Drei Schritte. Pause. Drei Schritte.“"
        },
        {
          text: "Jonas fragte: „Was wussten Sie über die anderen Frauen?“ Und da brach etwas in dem Mann. Kein dramatisches Schluchzen – eher wie das langsame Entleeren eines Behälters, der zu lange zu viel gehalten hatte. Er redete. Über Dobre und den Pater und die Männer, die er für Nachbarn gehalten hatte. Über die Sitzungen, die man nicht so nannte. Über die Überzeugung – oder das, was man sich einredet, bis es Überzeugung wird –, dass es notwendig sei. Dass das Tal sonst stirbt. Dass der Berg zurücknimmt, was er gegeben hat."
        },
        {
          text: "„Und Sie haben mitgemacht“, sagte Jonas. Es war keine Frage."
        },
        {
          text: "Adrian sah ihn an. In seinem Blick lag kein Bitten um Verständnis. Nur eine leere, präzise Traurigkeit. „Ich habe nicht widersprochen. Das ist dasselbe, nicht wahr?“"
        },
        {
          text: "Jonas antwortete nicht. Er legte Elenas Notizbuch auf den Küchentisch – nicht als Anklage, sondern als Zeugnis. Als würde er das Heft dorthin zurückbringen, wo es hingehörte. Dann stand er auf und ging zur Tür. Der Wald würde nicht auf ihn warten."
        }
      ],
      choices: [
        {
          label: "Allein in den Wald gehen.",
          next: "scene6",
          set: { aloneInForest: true }
        },
        {
          label: "Adrian zwingen mitzukommen.",
          next: "scene6",
          set: { aloneInForest: false }
        }
      ]
    },

    // KAPITEL III
    {
      id: "scene6",
      chapterKey: "chapter-3",
      chapter: "Kapitel III – Das Skelett der Kapelle",
      chapterCard: {
        eyebrow: "Kapitel III",
        title: "Das Skelett der Kapelle"
      },
      sceneTitle: "Der Wald",
      visual: "chapel",
      imageLabel: "Der Pfad in die Dunkelheit.",
      blocks: [
        {
          when: { aloneInForest: true },
          text: "Jonas folgte dem Pfad, den Elena in ihrem Notizbuch beschrieben hatte: an der gespaltenen Buche links abbiegen, dann immer der Senke entlang, bis der Boden aufhört, Laub zu tragen und anfängt, nach etwas zu riechen, das lange unter sich selbst gelegen hat. Er hatte seine Dienstwaffe und eine Taschenlampe, deren Lichtkegel im Nebel kaum fünf Meter reichte. Das war keine Angst, die er spürte. Es war Konzentration – die besondere Schärfe, die eintritt, wenn man aufhört, sich um das Nachher zu sorgen."
        },
        {
          unless: { aloneInForest: true },
          text: "Adrian Petrescu folgte Jonas in den Wald mit der Haltung eines Mannes, der zur Hinrichtung schritt – nicht seiner eigenen, aber einer, bei der er Zeuge sein musste. Er sprach nicht. Jonas ließ ihn nicht sprechen. Zweimal blieb Adrian stehen, als hätte er vergessen, wie man geht; zweimal berührte Jonas seinen Arm – keine Geste der Ermutigung, sondern des Weiterführens. Wie man ein Kind führt, das weiß, was es erwartet, und genau deshalb nicht mehr vorwärtsgehen kann."
        },
        {
          text: "Der Wald war anders bei Nacht als bei Tag – nicht dunkler, das war zu erwarten gewesen, sondern stiller. Eine Stille, die nicht wie Abwesenheit klang, sondern wie Anwesenheit: als würden die Bäume atmen, langsam und gleichmäßig, und als würde man selbst mit jedem Schritt lauter."
        },
        {
          text: "Die Kapelle war kaum mehr als ein Skelett aus Stein, das der Wald bereits halb verdaut hatte. Efeu hatte die Mauern so vollständig überwachsen, dass sie organisch wirkten – als wären die Steine gewachsen, nicht gehauen. Das Dach fehlte. Der Himmel, schwarz und wolkenverhangen, war das neue Gewölbe. Auf dem Altar, umgeben von Klumpen erstarrten schwarzen Wachses, lag er."
        },
        {
          text: "Der Ring. Jonas erkannte ihn sofort, obwohl er ihn noch nie gesehen hatte. Er war kleiner, als er erwartet hatte. Unscheinbarer. Silber, das kein Licht mehr reflektierte, und ein Stein, so tief schwarz, dass er wirkte wie ein Loch im Material – wie eine Stelle, an der die Wirklichkeit zu dünn geworden war."
        },
        {
          text: "Er berührte ihn. Und in dem Moment, in dem seine Finger den Stein berührten, sah er Elena. Das Dorf. Die Männer im Kreis. Dobre. Den Pater. Und am Rand, fast außerhalb des Bildes, eine Gestalt in ordentlichem Zwirn, die aussah wie jemand, der ein Protokoll führt. Die Vision dauerte keine Sekunde. Sie hinterließ die Klarheit von etwas, das nicht vergessen werden kann."
        }
      ],
      choices: [
        {
          label: "In der Kapelle warten →",
          next: "scene7"
        }
      ]
    },
    {
      id: "scene7",
      chapterKey: "chapter-3",
      chapter: "Kapitel III – Der Verwalter",
      chapterCard: {
        eyebrow: "Kapitel III",
        title: "Der Verwalter"
      },
      sceneTitle: "Das Angebot",
      visual: "chamber",
      imageLabel: "Die unterirdische Kammer.",
      blocks: [
        {
          unless: { aloneInForest: true },
          text: "Adrian sah den Ring auf dem Altar und wich zurück, bis sein Rücken gegen das Mauerwerk stieß. „Das ist er“, sagte er, mehr zu sich selbst als zu Jonas. „Das ist derselbe, den Elena getragen hat.“ Seine Stimme hatte einen Klang angenommen, den Jonas nicht kannte: nicht Angst, sondern Erkenntnis. Die schlimmste Form."
        },
        {
          text: "Die Stimme kam von hinter ihm – ruhig, gut artikuliert, ohne die geringste Anspannung. „Man gewöhnt sich an das Grauen, Herr Falk. Das ist das erste, was man lernt.“"
        },
        {
          text: "Der Mann, der aus dem Schatten des eingestürzten Seiteneingangs trat, wirkte vollkommen fehl am Platz in diesem Verfall. Guter Mantel. Gepflegte Hände. Das Gesicht eines Menschen, der gut schläft. Er sah Jonas an mit dem entspannten Blick von jemandem, der weiß, dass er nicht überrascht werden kann – weil er bereits alles weiß, was zu wissen ist."
        },
        {
          text: "„Elena Petrescu war eine kluge Frau“, sagte er. „Zu klug, um zu schweigen. Nicht klug genug, um zu verstehen, dass Schweigen hier keine Feigheit ist, sondern Architektur. Das System, das sie untersuchte, ist nicht bösartig. Es ist funktional. Es sorgt dafür, dass das Tal lebt. Dass die Ernte kommt. Dass die Männer nach Hause zurückkehren. Das Dorf hat einen Preis, und der Preis ist die einzige Wahrheit, um die es nicht herumgeht.“"
        },
        {
          text: "Jonas beobachtete den Mann und sagte nichts. Er suchte nach Nervosität, nach dem kleinsten Zeichen von Unsicherheit. Er fand nichts. Das war beunruhigender als jede Drohung."
        },
        {
          text: "„Ich bin nur der Verwalter“, fuhr der Mann fort. Er trat an den Altar und betrachtete den Ring mit einer Zuneigung, die fast zärtlich wirkte. „Nicht der Erfinder. Nicht der Gläubige. Nur der Mann, der dafür sorgt, dass das Räderwerk nicht stockt. Alle sieben Jahre braucht es jemanden, der die Last der Wahrheit trägt, damit alle anderen die Freiheit haben, sie zu ignorieren. Elena wollte diesen Kreis zerbrechen. Sie hat stattdessen bewiesen, dass er unzerbrechlich ist.“ Er wandte sich Jonas zu. „Und jetzt sind Sie hier. Das ist kein Zufall, Herr Falk. Menschen wie Sie finden solche Orte nicht trotz ihrer Instinkte, sondern wegen ihnen.“"
        },
        {
          text: "Er hob den Ring vom Altar. Hielt ihn Jonas hin. „Werden Sie das Auge, das sieht, was andere übersehen müssen. Nehmen Sie den Ring. Werden Sie der Mann, der das Unaussprechliche verwaltet, damit die Welt ihrer Bequemlichkeit nachgehen kann.“ Er ließ eine Pause entstehen, präzise wie ein Atemzug. „Oder werden Sie Teil des Erdreichs. So wie sie.“"
        }
      ],
      choices: [
        {
          label: "„Ich werde kein Teil Ihres Systems.“",
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
        "Jonas sah den Ring in der Hand des Mannes und spürte die Versuchung – nicht der Macht, sondern der Klarheit. Das war das eigentliche Angebot: nicht Kontrolle, sondern das Ende der Ambiguität. Eine Welt, in der alles seinen Preis hat und der Preis immer bekannt ist. Er verstand, warum das verlockend war. Er verstand es so gut, dass es ihn erschreckte.",
        "Er nahm den Ring nicht. Stattdessen tat er etwas, das er selbst nicht erwartet hatte: Er lachte. Ein kurzes, trockenes Geräusch, ohne Freude. „Das ist kein System“, sagte er. „Das ist eine Geschichte, die Feiglinge sich erzählen, damit sie nachts schlafen können.“ Er wandte sich Pater Luca zu – der irgendwann im Schatten aufgetaucht war, still wie ein schlechtes Gewissen –, und sprach ihn so ruhig an, dass es schlimmer war als ein Schrei: „Sie wissen, dass das hier Mord ist. Sie haben es immer gewusst.“",
        "Der alte Mann begann zu weinen. Nicht dramatisch – das leise, beschämte Weinen eines Menschen, dem eine Last abgenommen wird, die er zu lange getragen hat. Die Autorität des Fremden, die so selbstverständlich gewirkt hatte wie die Schwerkraft, bröckelte in dem Moment, in dem der erste Mann im Raum aufgehört hatte, sie für gegeben zu nehmen. Dobre floh in die Dunkelheit. Der Fremde verschwand in den Schatten des Waldes, lautlos, wie etwas, das nie wirklich körperlich gewesen war.",
        "Monate später saß Jonas in seinem Büro in der Stadt. Die Staatsanwaltschaft hatte die Gräber geöffnet; der Prozess würde Jahre dauern. Er hatte den Fall gelöst, und er schlief seitdem schlecht – nicht aus Schuldgefühlen, sondern aus einer hartnäckigeren Erkenntnis: Das Dunkle wohnte nicht im Wald. Es wohnte in der Bequemlichkeit des Schweigens, im stillen Nicken, im Nicht-Fragen. Es wohnte in jedem Raum, in dem jemand gewusst hatte, was vor sich ging, und beschlossen hatte, dass es einfacher war, nichts zu sagen. Er ließ das Licht jetzt immer brennen. Nicht aus Angst. Als Erinnerung."
      ]
    },

    endingB: {
      id: "endingB",
      title: "Ende B – Das neue Auge",
      paragraphs: [
        "Jonas streckte die Hand aus. Er sagte sich, dass es Methode war – dass man ein System nur von innen verstehen kann, dass die Wahrheit manchmal einen Preis hat, den man bereit sein muss zu zahlen. Er sagte sich viele Dinge in den zwei Sekunden, in denen er die Hand ausstreckte. Dann schloss sich der Ring um seinen Finger, und er hörte auf, Dinge zu sich selbst zu sagen.",
        "Die Welt veränderte sich nicht dramatisch. Kein Leuchten, kein Schmerz. Nur eine langsame, unaufhaltsame Verschiebung der Wahrnehmung – wie wenn man in einem schlecht beleuchteten Raum wartet, bis die Augen sich gewöhnt haben, und plötzlich sieht man alles: die Risse im Putz, die Flecken auf dem Boden, die Schatten hinter den Schatten. Jonas sah die Männer im Raum und er sah ihre Schuld, präzise und dreidimensional, wie Objekte, die man anfassen kann. Er sah, wo Dobre das Geld versteckt hatte. Er kannte die Sünden des Paters. Er verstand die Feigheit Adrians mit einer Vollständigkeit, die jede Empathie unmöglich machte.",
        "Der Fall wurde gelöst. Jonas Falk verließ Vallachei als gefeierten Mann – nicht als Ermittler, der aufgedeckt hatte, was dort geschah, sondern als jemand, der es so verpackt hatte, dass die richtigen Leute schuldig wurden und das Fundament des Systems intakt blieb. Er wusste das. Er handelte trotzdem so. Das war das Erste, das ihn hätte warnen sollen.",
        "In der Stadt wartete der gewohnte Alltag. Er löste Fälle mit einer Leichtigkeit, die seine Kollegen bewunderten. Er fand jeden Vermissten, durchschaute jede Lüge, sah durch jede Fassade. Und mit jedem Fall wurde der Ring fester. Nicht physisch – er saß wie er immer gesessen hatte. Aber nachts, wenn er eine Hand schüttelte oder eine Umarmung empfing, spürte er den Verfall darunter: die kleinen Feigheiten, die geheimen Beschämungen, den langsamen moralischen Zerfall, den Menschen ihr ganzes Leben vor sich selbst verbergen. Er konnte nicht mehr anders sehen. Er wusste nicht mehr, wie Unwissenheit sich anfühlt. Und der Fremde aus der Kapelle – er tauchte nie wieder auf. Er musste auch nicht. Der neue Verwalter war bereits bestellt."
      ]
    }
  }
};
