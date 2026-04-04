window.EMBER_STORY = {
  meta: {
    appTitle: "EMBER",
    appSubtitle: "Lies. Sieh. Entscheide.",
    storyTitle: "Der Ring im Erdreich",
    storyDescription:
      "Eine ermordete Ehefrau. Ein Dorf, das schweigt. Ein Ermittler, der in einem gewöhnlichen Fall etwas entdeckt, das nicht in die Welt passen dürfte.",
    tags: ["Mystery", "Okkult", "Detective"]
  },
  startSceneId: "scene1",
  scenes: [
    {
      id: "scene1",
      chapterKey: "chapter-1",
      chapter: "Kapitel I – Der Auftrag",
      chapterCard: {
        eyebrow: "Kapitel I",
        title: "Der Auftrag"
      },
      sceneTitle: "Der Auftrag",
      visual: "office",
      imageSrc: "./Der_Auftrag.png",
      imageAlt: "Jonas Falk sitzt in einem warm beleuchteten Büro und liest Unterlagen am Schreibtisch.",
      imagePosition: "center 0%",
      hideImageLabel: true,
      blocks: [
        {
          text: "Als Adrian Petrescu an diesem verregneten Mittwochabend Jonas Falks Büro betrat, roch er nach nasser Erde und kaltem Rauch. Er setzte sich nicht. Er stand einfach vor dem Schreibtisch, den Mantel noch geschlossen, als hätte er Angst, bei zu viel Bewegung auseinanderzufallen."
        },
        {
          text: "„Meine Frau wurde vor drei Wochen ermordet“, sagte er. „Und die Polizei behandelt es wie eine schlechte Angewohnheit des Wetters.“"
        },
        {
          text: "Adrian zog ein Foto aus der Innentasche und legte es auf den Tisch. Eine Frau Anfang dreißig, dunkle Haare, ruhiger Blick. Neben das Foto legte er ein abgegriffenes Notizbuch."
        },
        {
          text: "„Sie wurde am Waldrand gefunden. Nicht beraubt. Nicht zufällig. Ihre Tasche war da. Ihre Kette auch. Nur ihr Ehering fehlte. Und unter ihren Fingernägeln war schwarze Asche.“"
        },
        {
          text: "Jonas mochte keine Dörfer und noch weniger Gerüchte. Aber an dem Satz mit der Asche blieb sein Blick hängen. Nicht, weil er an Geister glaubte. Sondern weil echte Gewalt sich oft hinter genau solchen lächerlich klingenden Details versteckte."
        }
      ],
      choices: [
        {
          label: "Zeigen Sie mir Elenas Notizen",
          next: "scene2",
          set: {
            approach: "notes"
          }
        },
        {
          label: "Was hat die Polizei übersehen?",
          next: "scene2",
          set: {
            approach: "police"
          }
        },
        {
          label: "Warum glauben Sie, dass mehr dahintersteckt?",
          next: "scene2",
          set: {
            approach: "instinct"
          }
        }
      ]
    },
    {
      id: "scene2",
      chapterKey: "chapter-1",
      chapter: "Kapitel I – Das Dorf",
      chapterCard: {
        eyebrow: "Kapitel I",
        title: "Das Dorf"
      },
      sceneTitle: "Das Dorf",
      visual: "village",
      imageSrc: "./Dorf_Vallachei.png",
      imageAlt: "Ein nebliges Dorf unter dunklen Hügeln, darüber eine beleuchtete Kirche auf einem Hang.",
      hideImageLabel: true,
      blocks: [
        {
          when: {
            approach: "notes"
          },
          text: "Jonas blätterte zuerst durch Elenas Notizbuch. Die Schrift wurde von Seite zu Seite unruhiger. Jemand war letzte Nacht wieder hinter dem Haus. Drei Schritte. Pause. Drei Schritte. Pause. Im Wald gibt es eine Kapelle, die auf keiner Karte steht."
        },
        {
          when: {
            approach: "police"
          },
          text: "Jonas verlangte zuerst die Akte. Polizeichef Dobre warf ihm eine Mappe auf den Tisch, die viel zu dünn war für eine ermordete Frau. Jonas hatte Akten zu toten Katzen gesehen, die dicker waren als das hier."
        },
        {
          when: {
            approach: "instinct"
          },
          text: "Jonas glaubte Adrian zunächst nicht. Aber schwarze Asche unter den Fingernägeln einer Toten war kein Detail, das aus einem gewöhnlichen Eifersuchtsdrama fiel. Es roch nach Vertuschung, nicht nach Zufall."
        },
        {
          text: "Am nächsten Mittag erreichte er das Dorf südlich von Târgoviște. Der Ort lag zwischen dunklen Hügeln und Birkenwäldern, in denen der Nebel selbst am Mittag hing. Hunde bellten, sobald Jonas langsam genug fuhr. Die Kirche stand auf einer Anhöhe, weiß gekalkt, mit einem Glockenturm, der schief wirkte, als höre er zu."
        },
        {
          text: "Polizeichef Dobre empfing ihn nicht unfreundlich, sondern schlechter: gelangweilt. Er wirkte nicht wie ein Mann, der Hilfe wollte, sondern wie einer, der Kontrolle behalten wollte."
        },
        {
          text: "Jonas hatte im Dorf sofort das Gefühl, dass ihm niemand freiwillig die Wahrheit geben würde. Er musste entscheiden, wo er den Faden zuerst aufnahm: in Dobres Akte oder im Haus der Petrescus."
        }
      ],
      choices: [
        {
          label: "Ich will die Akte sehen",
          next: "scene3",
          set: {
            focus: "file"
          }
        },
        {
          label: "Ich will Elenas Haus sehen",
          next: "scene3",
          set: {
            focus: "house"
          }
        }
      ]
    },
    {
      id: "scene3",
      chapterKey: "chapter-1",
      chapter: "Kapitel I – Das Zeichen",
      chapterCard: {
        eyebrow: "Kapitel I",
        title: "Das Zeichen"
      },
      sceneTitle: "Das Zeichen",
      visual: "symbol",
      imageSrc: "./Das_zeichen.png",
      imageAlt: "Ein dunkler Küchentisch mit Notizbuch, eingeritztem Zeichen, Lampe und verstreuten Gegenständen.",
      hideImageLabel: true,
      blocks: [
        {
          when: {
            focus: "file"
          },
          text: "Jonas ließ sich die Akte geben. Sie war viel zu dünn für eine ermordete Frau. Die Fotos zeigten keine Raserei, sondern etwas Präzises: eine tiefe dunkle Wunde am Hals, schwarze Asche auf feuchtem Boden und einen Kreis, der nie geschlossen wurde. Dobre nannte alles Erde, Ruß, Jäger, irgendetwas Belangloses."
        },
        {
          when: {
            focus: "house"
          },
          text: "Im Haus der Petrescus roch es nach getrocknetem Lavendel und kaltem Kaffee. Alles wirkte, als hätte jemand mitten im Satz aufgehört zu leben. Im Arbeitszimmer hinter einem losen Brett im Regal fand Jonas eine Mappe mit Zeitungsausschnitten. Verschwundene Frauen. Tote Frauen. Fast alle verheiratet. Fast alle aus Familien, die seit Generationen im Tal lebten. Immer im Abstand vieler Jahre. Immer im Herbst."
        },
        {
          text: "Auf einem der Ausschnitte hatte Elena mit Bleistift ein kleines Zeichen gemalt: ein Kreis, in den von außen drei kurze Striche hineinragten. Dasselbe Zeichen war in die Rückseite ihres Notizbuchs eingeritzt."
        },
        {
          text: "Als Jonas Adrian darauf ansprach, sagte der endlich leise: „Mein Vater kannte das Zeichen.“ Dann kam die Geschichte vom alten Ring. Silber. Schwarzer Stein. Eine Großmutter, die sagte, die erste Frau, die ihn in einem bestimmten Herbst trägt, gehöre nicht mehr nur ihrem Mann."
        },
        {
          text: "Elena hatte den Ring im August in einer Schatulle gefunden und getragen. Zwei Wochen später hörte sie nachts Schritte hinter dem Haus, im Stall, auf dem Dach. Im letzten Eintrag notierte sie keine Erklärung, nur eine Wegbeschreibung: „Am trockenen Brunnen links. Zwischen den Birken mit den weißen Kreuzen hindurch. Wenn man die Glocke hört, obwohl kein Wind geht, ist man nah.“"
        }
      ],
      choices: [
        {
          label: "In der Nacht in den Wald gehen",
          next: "scene4"
        },
        {
          label: "Erst Adrian zur Rede stellen",
          next: "scene4",
          set: {
            confrontedHusband: true
          }
        }
      ]
    },
    {
      id: "scene4",
      chapterKey: "chapter-2",
      chapter: "Kapitel II – Die Kapelle",
      chapterCard: {
        eyebrow: "Kapitel II",
        title: "Die Kapelle"
      },
      sceneTitle: "Die Kapelle",
      visual: "chapel",
      imageLabel: "Verfallene Kapelle im Wald, nasser Stein, Kerzen, schwarzer Ring auf einem Altar",
      blocks: [
        {
          when: {
            confrontedHusband: true
          },
          text: "Bevor Jonas in den Wald ging, stellte er Adrian in der Küche zur Rede. Adrian wurde bleich wie Kalk und brach fast unter dem Gewicht seiner eigenen Feigheit zusammen. Er behauptete, er habe geglaubt, man wolle Elena nur einschüchtern. Kein Mord. Nur Ritual und Dorfgehorsam. Jonas glaubte ihm nichts und nahm gerade deshalb jedes Wort mit."
        },
        {
          unless: {
            confrontedHusband: true
          },
          text: "Jonas ging allein in den Wald. Adrians Schweigen fuhr mit ihm, als säße es auf dem Beifahrersitz und atmete mit."
        },
        {
          text: "Es war fast dunkel, als er die Lichtung fand. Dort stand tatsächlich eine Kapelle, oder das, was davon übrig war: zwei geborstene Mauern, ein halb eingestürztes Dach, ein steinerner Altar, überzogen von Moos und schwarzem Wachs."
        },
        {
          text: "Auf dem Altar lag ein Ring. Silber. Schwarzer Stein. Als Jonas ihn berührte, sah er Elena auf den Knien, das Haar nass im Gesicht, Männer aus dem Dorf im Kreis um sie herum: Dobre, Pater Luca, zwei weitere Gestalten in Mänteln. Etwas abseits Adrian. Und hinter dem Altar ein Mann, zu ordentlich für diesen Ort, im dunklen Anzug, mit feuchter Erde an den Hosenbeinen."
        },
        {
          text: "Die Vision riss ab. Der Mann stand nun wirklich vor ihm. Nicht wie ein Geist. Wirklich. „Sie kamen zu spät für die Frau“, sagte er ruhig. „Aber noch rechtzeitig für die Wahrheit.“"
        },
        {
          text: "Jonas fragte, ob er Elena getötet habe. Der Mann verneinte es ohne Hast. „Ich töte nicht. Ich nehme an, was man mir bringt. Diese Männer hier unten tun seit langer Zeit so, als müssten sie. Das beruhigt ihr Gewissen.“ Dann schob er den Ring langsam über den Stein. „Wenn Sie bleiben, zeige ich Ihnen alles.“"
        }
      ],
      choices: [
        {
          label: "Das Angebot anhören",
          next: "scene5",
          set: {
            darkPath: true
          }
        },
        {
          label: "Zurückweichen und den Ring liegen lassen",
          next: "scene5",
          set: {
            darkPath: false
          }
        }
      ]
    },
    {
      id: "scene5",
      chapterKey: "chapter-3",
      chapter: "Kapitel III – Das Angebot",
      chapterCard: {
        eyebrow: "Kapitel III",
        title: "Das Angebot"
      },
      sceneTitle: "Das Angebot",
      visual: "chamber",
      imageLabel: "Unterirdische Kammer, Kerzenlicht, schwarzes Wasser, bleiche Gestalt",
      blocks: [
        {
          when: {
            darkPath: true
          },
          text: "Jonas rannte nicht. Der Satz des Mannes blieb ihm im Kopf, während er zurück zum Auto ging, vor dem Haus der Petrescus parkte und fünf Minuten lang die Hände nicht vom Lenkrad nahm. Später, tief unter der Kapelle, nannte die Gestalt keine Namen, keine Hölle, keinen Gott. Nur Preis und Nutzen."
        },
        {
          when: {
            darkPath: false
          },
          text: "Jonas wich in der Kapelle zurück und ließ den Ring liegen. Doch die Wirklichkeit wurde dadurch nicht kleiner. Er fuhr ins Dorf, sprach mit Adrian und dem Priester und spürte zum ersten Mal echte Angst: nicht vor einem Mann, sondern vor etwas, das die Welt still und falsch machte."
        },
        {
          when: {
            approach: "notes"
          },
          text: "Aus Elenas Notizbuch hing ihm jetzt vor allem eine Zeile nach: „Es ist nicht der Wald, der mich ansieht. Es ist etwas darunter.“"
        },
        {
          when: {
            approach: "police"
          },
          text: "Jonas dachte an Dobres viel zu dünne Mappe. Sogar in dieser beleidigend schmalen Akte hatte mehr Wahrheit gelegen, als der Polizeichef bereit gewesen war zuzugeben."
        },
        {
          when: {
            approach: "instinct"
          },
          text: "Jonas hasste, dass sein erster Instinkt recht behalten hatte. Echte Gewalt tarnt sich gern als Dorfgeschichte, bis jemand genau hinsieht."
        },
        {
          text: "Adrian gestand schließlich, dass Dobre das Dorf zusammenhielt und Pater Luca segnete, was niemand segnen sollte. Die Leute glaubten, unter dem Hügel schlafe etwas, das Hunger, Krankheit und Unglück fernhielt, solange man ihm gehorchte. Elena hatte alte Kirchenbücher, Vermisstenanzeigen und Geburtsregister gelesen. Sie wollte den Kreis brechen."
        },
        {
          text: "Noch in derselben Nacht kamen sie. Nicht heimlich, sondern mit der trägen Selbstverständlichkeit von Männern, die ihr Dorf für ihren privaten Besitz hielten. Als Jonas wieder zu sich kam, lag er in einer unterirdischen Kammer unter der Kapelle. Schwarzes Wasser sickerte aus dem Stein. In Nischen brannten Kerzen. Adrian kniete gefesselt, Pater Luca stand bleich daneben, Dobre hielt eine Pistole."
        },
        {
          text: "Und vorne, dort wo die Kammer tiefer wurde, stand wieder der Mann aus der Kapelle. „Sie haben die Mechanik gesehen“, sagte er. „Gesetz, Kirche, Ehe, Angst. Alles Zahnräder. Nehmen Sie den Ring, und ich zeige Ihnen jede Lüge in diesem Tal. Lehnen Sie ab, und Sie sterben als ein weiterer Mann, der die Wahrheit sah und zu schwach war, mit ihr zu leben.“"
        }
      ],
      choices: [
        {
          label: "Ich lehne ab. Es muss etwas Höheres geben als das hier.",
          next: "endingA"
        },
        {
          label: "Ich nehme den Ring. Wahrheit ist mehr wert als Unschuld.",
          next: "endingB"
        }
      ]
    }
  ],
  endings: {
    endingA: {
      id: "endingA",
      title: "Ende A – Der Glaube",
      paragraphs: [
        "Jonas sah den Ring an. Dann Dobre. Dann Adrian. Dann den Priester, der die Augen nicht mehr hob. Er dachte an Elenas letzte Zeile: Wenn es wirklich etwas Dunkles gibt, dann kann Dunkelheit nicht das Erste gewesen sein.",
        "Jonas nahm den Ring nicht. Stattdessen griff er nach dem kleinen Holzkreuz am Gürtel von Pater Luca. Er sprach kein großes schönes Gebet, nur das alte Vaterunser, stockend und halb vergessen, so wie seine Großmutter es ihm beigebracht hatte. Kein Zauberspruch. Eher eine Weigerung, irgendeinen Handel einzugehen.",
        "Beim zweiten Satz begann Pater Luca mitzusprechen. Beim dritten fiel Adrian weinend ein. Dobre schrie sie an, hob die Pistole, und doch wich das, was unter dem Hügel wartete, zum ersten Mal zurück. Der schwarze Stein sprang. Die Kälte brach.",
        "Später wurden Gräber geöffnet, Namen genannt, Register aus Kellern geholt. Dobre verschwand nicht heldenhaft, sondern elend. Pater Luca legte sein Amt nieder und redete zum ersten Mal offen. Adrian sagte alles aus, auch gegen sich selbst.",
        "Monate danach blieb Jonas vor einer kleinen Kirche in der Stadt stehen. Er trat ein, setzte sich in die letzte Bank und sagte nichts. Er glaubte nicht, weil er Trost gefunden hatte. Er glaubte, weil er gesehen hatte, dass das Böse real war und dass es nicht das Einzige war, was antwortete."
      ]
    },
    endingB: {
      id: "endingB",
      title: "Ende B – Der Komplize",
      paragraphs: [
        "Jonas sah den Ring an. Dann Dobre. Dann den Priester. Dann Adrian, der vor ihm kniete wie ein zerbrochener Zeuge. Sein ganzes Leben lang hatte er an Systeme geglaubt, die am Ende immer denselben Fehler hatten: Sie waren von Menschen gemacht. Nur das hier war grausam, verdorben und ehrlich.",
        "Jonas streckte die Hand aus und nahm den Ring. Er war warm, wie Haut. Mehr brauchte es nicht. Keine Flammen, keine billige Theaterhölle. Nur ein Einverständnis. Etwas öffnete sich in seinem Kopf wie eine zweite Pupille. Mit einem Schlag wusste er Dinge, die niemand gesagt hatte: Dobres Ruhe beim Töten, Lucas Feigheit, Adrians Liebe, die sich als Vorsicht verkleidet hatte.",
        "Noch vor Morgengrauen hatte Dobre alles gestanden. Nicht vor Gericht. Vor Jonas. Pater Luca führte sie zu Büchern, Namen und Orten. Adrian unterschrieb, was Jonas ihm hinlegte, und ging am Ende freiwillig den Hügel hinauf, als wäre seine Schuld schwerer als seine Angst.",
        "Offiziell galt Elena Petrescus Fall später als aufgeklärt: ein Netz aus Korruption, Gewalt und Schweigen. Es war nicht einmal gelogen. Nur unvollständig. Jonas verließ das Tal mit einer sauberen Akte, einer geschlossenen Wunde und einem Ring, den er nie mehr abnahm.",
        "Danach wurden seine Fälle berühmt. Er fand Vermisste schneller als jede Behörde, erkannte halbe Wahrheiten in Gesichtern und spürte Häuser an, die etwas verbargen. Nachts aber hörte er unter Beton, Kellern und Straßen ein geduldiges altes Warten. Wahrheit, hatte er gelernt, war nie kostenlos."
      ]
    }
  }
};
