const sceneOneParagraphs = [
  "Die kleine Tür lehnte schon an der Sockelleiste, als Mara sich auf die Knie ließ. Das Holz war billig, aus dem Bastelladen, zwei Euro neunzig. Das Scharnier war nur eine Prägung im Plastik. Sie drückte sie gegen die Leiste neben der Garderobe, dort, wo Henri am Morgen als Erstes hinsehen würde, wenn er barfuß aus seinem Zimmer kam. Die Dielen waren kalt durch den Stoff der Leggings. Im Rücken zog es von der Schulter bis unter das Schulterblatt, der gleiche Strang wie jeden Abend.",
  "Sie hatte nur die kleine Stehlampe an. Die Wohnung hörte sich anders an, wenn Henri schlief. Der Kühlschrank arbeitete. Die Heizung klackte einmal, dann war wieder Ruhe. Unter der Balkontür strich die Luft über die Dielen, und sie zog die Strickjacke enger.",
  "Der Klebestreifen löste sich schlecht von der Rolle. Sie biss ihn mit den Zähnen ab, wie immer, und schmeckte den Kleber. Zwei Streifen hinten an die Tür, einer oben, einer unten. Sie drückte sie fest. Ein Daumenabdruck blieb auf dem Lack. Sie wischte ihn mit dem Ärmel weg.",
  "Der Zettel lag auf dem Couchtisch, neben der Schachtel, in der sie die Wichtelsachen seit November sammelte. Drei Rollen Tesa, ein paar Schokoladentaler aus dem Adventskalender-Restbestand, ein Päckchen Miniatur-Bauklötze für einsneunundneunzig, Geschenkpapier in Streifen geschnitten. Sie hatte darüber im letzten Jahr noch mit Sabine am Telefon gelacht. Jetzt war es einfach Teil der Liste.",
  "Sie nahm den dünnen Stift. Lieber Henri, schrieb sie in der krakeligen Wichtelschrift, die sie sich angewöhnt hatte. Eckiger als ihre eigene, mit zu großen Os. Ich bin heute Nacht bei dir eingezogen. Mein Name ist Pip. Ich bin sehr klein und sehr leise. Sie hielt inne. Das P war zu rund. Sie setzte neu an. Ich freue mich darauf, dich kennenzulernen. Der Stift stockte an der letzten Silbe. Sie strich das Wort nicht durch. Sie schrieb weiter. Dein Pip.",
  "Das Mini-Päckchen wickelte sie aus Goldpapier. Darin ein Streichholzschächtelchen, in das sie zwei Schokotaler gelegt hatte und einen gefalteten Zettel, auf dem für später stand. Sie band Bastgarn herum, machte eine Schleife, zog sie wieder auf, machte sie neu. Die erste war schief gewesen. Henri würde es sehen. Er sah alles.",
  "Zwischen zwei Knoten bückte sie sich nach dem Playmobilmännchen unter dem Sessel. Sie legte es in den Korb auf dem Sideboard. Die Socke neben dem Heizkörper wanderte zur Wäsche im Flur. Sie faltete den Pullover zusammen, den Henri am Nachmittag über die Lehne geworfen hatte, roch für einen Moment an dem Stoff, legte ihn weg. Der Zettel vom Kindergarten lag noch auf dem Tisch. Bitte Gummistiefel kontrollieren. Sie schob ihn unter das Telefonbuch.",
  "Ihre Hand zitterte leicht, als sie den Stift zurück in die Schublade legte. Nicht viel. Nur so, wie er nach zu langen Tagen zitterte, wenn sie den Kaffee in die Tasse goss.",
  "In der Küche standen die Tassen vom Abend. Die große blaue mit dem Teerest, Henris Plastikbecher mit den Pinguinen, ihre eigene Tasse, in der der Kaffee vom Nachmittag kalt geworden war. Sie stellte ein Glas unter den Hahn, ließ Wasser laufen, bis es wirklich kalt war, und trank im Stehen. Der Schluck tat im Hals weh. Sie stellte das Glas zu den Tassen. Die Spüle roch nach nassem Schwamm.",
  "Sie dachte an das Brot für morgen. An Henris Jacke, deren Reißverschluss klemmte. An die Reha-Unterlagen von Tobias, die seit Freitag ungeöffnet auf dem Schuhschrank lagen. Sie ging zurück in den Flur.",
  "Auf den Knien richtete sie die Tür noch einmal aus. Gerade, dann ein halbes Grad nach rechts. Sie lehnte das Päckchen gegen die Leiste, genau mittig vor die Tür. Sie schob einen Schokotaler daneben. Sie nahm ihn wieder weg. Zu viel. Sie legte ihn zurück.",
  "Die Knie brannten. Sie blieb trotzdem hocken. Es war sehr still. Keine Tür ging. Kein Kind rief. Das Telefon leuchtete nicht. Sie zog die Schultern ein kleines Stück zurück, das Schulterblatt knackte, und sie blieb, wo sie war.",
  "Niemand wollte in diesem Moment etwas von ihr.",
  "Sie kniete trotzdem weiter. Ihre Hand strich den Klebestreifen am unteren Rand der Tür nach, obwohl er hielt. Sie zupfte eine winzige Faser aus dem Bastgarn. Sie rückte das Päckchen einen Millimeter nach links. Sie blieb noch einen Moment so sitzen.",
  "Sie stand auf, eine Hand an der Wand, die andere auf dem Knie. Der Rücken zog. Sie drückte die Faust in die Stelle unter dem Schulterblatt und atmete einmal tief durch die Nase.",
  "Im Bad putzte sie sich die Zähne im Dunkeln, nur das Licht aus dem Flur. Sie spuckte aus, spülte, wischte den Rand des Waschbeckens mit dem Handtuch, weil sie es nicht lassen konnte.",
  "Bevor sie ins Schlafzimmer ging, blieb sie im Flur stehen. Die kleine Tür saß an der Sockelleiste. Das Goldpapier fing das Licht der Stehlampe auf. In der Küche warteten die Tassen und der Pinguinbecher.",
  "Mara machte das Licht aus."
];

const sceneTwoParagraphs = [
  "Der Badboden zog ihr die Wärme aus den Fußsohlen, als sie nach dem Schlafanzug griff, der halb unter der Wanne lag. Henri saß auf dem Klodeckel und weinte ohne Ton, nur Schultern und Nase.",
  "\"Ich will nicht.\"",
  "\"Ich weiß.\" Sie zog ihm die Unterhose hoch, dann die Strumpfhose. Seine Beine waren steif. \"Arm.\"",
  "Er hob den Arm nicht. Sie hob ihn. Der Ärmel blieb am Ellenbogen hängen, sie zog ihn durch, Kopf durch den Kragen, andere Seite. Im Spiegel über dem Waschbecken sah sie sich kurz. Ungewaschenes Haar. Augen wie nach zu wenig Schlaf.",
  "\"Zähne.\"",
  "\"Ich will zu Hause bleiben.\"",
  "\"Zähne, Henri.\"",
  "Sie drückte ihm die Bürste in die Hand, gab Paste drauf, zählte im Kopf bis zwanzig, nahm ihm die Bürste wieder ab, spülte sie aus. In der Küche war der Wasserkocher schon wieder kalt. Sie stellte ihn noch einmal an, schnitt Brot, strich Butter, schnitt Gurke, packte alles in die Dose. Henri stand im Flur in Socken. Auf dem Schuhschrank lagen noch die Reha-Unterlagen von Tobias.",
  "\"Schuhe.\"",
  "\"Mein Bauch tut weh.\"",
  "\"Nach der Kita gucken wir.\" Sie kniete, zog ihm die Schuhe an, Klett links, Klett rechts. \"Jacke. Mütze. Komm.\"",
  "Der Toast lag in einem Küchentuch auf dem Beifahrersitz und kühlte ab. An der Kita löste sie Henris Finger einzeln vom Reißverschluss ihrer Jacke. Die Erzieherin lächelte, als sei alles normal. Mara lächelte zurück, als sei alles normal.",
  "Sie starrte auf ihre Jacke am Haken. Sie konnte sich nicht erinnern, sie aufgehängt zu haben. Erster Patient, kleiner Junge mit Sigmatismus, die Mutter sprach zu viel. Mara hörte zu, notierte, spielte, korrigierte, lobte. Zwischen Patient eins und Patient zwei ging sie in die Küche, goss sich Kaffee ein, nahm einen Schluck im Stehen, stellte die Tasse ab, weil Ines etwas fragte, und vergaß sie dort.",
  "Patient zwei, fünf Jahre, Mundmotorik. Patient drei, Nachbesprechung mit einer Mutter, die weinte, weil der Logopäde vor ihr nichts gebracht habe. Mara reichte ihr Taschentücher. Ihre Hand fand den Karton, als hätte sie das schon zu oft gemacht. Sie sagte ruhige Sätze. Patient vier fiel aus, dafür schob Ines ihr eine Akte in die Hand, Attestanfrage, Krankenkasse, eilig.",
  "Sie ging in die Küche zurück. Die Tasse stand noch da, der Kaffee war kalt. Sie trank ihn im Stehen aus, zwei Schluck, drei. Für einen Moment war da der Gedanke, ob Henri vielleicht doch krank war. Sie stellte die Tasse ab. Im Türrahmen rief jemand ihren Namen.",
  "Der Lagerraum roch nach Pappkarton und Desinfektionsmittel. Sie schloss die Tür hinter sich, lehnte sich mit dem Rücken dagegen, die Akte noch in der Hand. Dann fiel ihr der Kopf nach vorn. Es kam nicht viel. Zwei, drei Atemzüge, in denen das Gesicht heiß wurde. Sie presste die Handfläche auf den Mund.",
  "Schritte im Flur. Jemand ging an der Tür vorbei, Richtung Toilette. Sie richtete sich auf, wischte mit dem Handrücken unter den Augen entlang, einmal links, einmal rechts, strich sich die Haare hinter die Ohren. Die Akte war an der Ecke zerknittert, sie strich sie glatt.",
  "Als sie rausging, hielt sie die Akte so, als hätte sie sie gerade aus dem Regal geholt. Ines nickte ihr im Vorbeigehen zu. Mara nickte zurück.",
  "Henri stand allein an der Garderobe, Jacke halb an, als sie ankam. Die Erzieherin sagte, er habe heute wenig gegessen. Mara sagte Danke und zog ihm den Reißverschluss hoch.",
  "\"Wir müssen noch schnell einkaufen.\"",
  "\"Ich will nicht einkaufen.\"",
  "\"Ich weiß.\"",
  "Im Supermarkt klammerte er sich an die Stange des Einkaufswagens, Füße auf dem unteren Gitter, Gesicht an ihrem Ärmel. \"Guck mal, Mama.\" Er hielt eine kleine Packung Tiermüsliriegel hoch, die er aus dem Regal gezogen hatte. \"Guck mal, da sind Bären drauf.\"",
  "\"Schön. Leg zurück.\"",
  "\"Dürfen wir?\"",
  "\"Leg zurück, Henri.\"",
  "Er ließ den Riegel los, Finger für Finger, bis er das Metall des Regals berührte. Sie hakte die Liste im Kopf ab: Nudeln, Tomaten, Käse, Joghurt, Klopapier, Brot für morgen. Milch. Milch. An der Kasse fiel ihr ein, dass die Milch fehlte. Hinter ihr stand schon jemand mit vollem Wagen. Sie legte die Sachen aufs Band. Henri sah auf die Bären, dann auf sie. Sie nahm die Packung aus seiner Hand und legte sie mit aufs Band.",
  "Im Auto saß er still und aß einen der Riegel, während sie anfuhr.",
  "\"Guck mal.\" Er hielt das Papier hoch, bevor er es in die Türablage stopfte. \"Ich hab ihn ganz aufgegessen.\"",
  "\"Hab ich gesehen.\"",
  "Zuhause: Schuhe aus, Jacke weg, Hände waschen, Nudeln aufsetzen, Henri vor das Malbuch, Wäsche aus der Maschine in den Trockner, Tomatensauce aus dem Glas, Käse reiben, Tisch decken. Er aß drei Gabeln und sagte, der Bauch tue immer noch weh.",
  "\"Dann ins Bett.\"",
  "\"Aber ich will erst noch malen.\"",
  "\"Eine Seite.\"",
  "Er malte zwei. Sie ließ es durchgehen. \"Guck mal\", sagte er und drehte das Heft zu ihr. Ein Haus mit vier Fenstern, in jedem Fenster ein Kopf. Sie nickte, bevor sie hingesehen hatte, sah dann doch hin, nickte noch einmal.",
  "Zähne, Pipi, Schlafanzug, Kuscheltier, das richtige, nicht das andere. Sie las ihm drei Seiten aus dem Buch, das sie seit Wochen lasen, Hand auf seinem Rücken, und spürte, wie sein Atem langsamer wurde.",
  "\"Mama.\"",
  "\"Ja.\"",
  "\"Bleibst du da?\"",
  "\"Ich bleib noch kurz.\"",
  "Sie blieb, bis er schwer wurde.",
  "In der Küche stand der halb abgedeckte Tisch. Die Sauce war am Tellerrand eingetrocknet. Sie stellte den Teller in die Spüle, tat die restlichen Nudeln in eine Dose, wischte kurz, ließ den Rest. Auf dem Flur lagen Henris Socken. Sie hob sie auf, ließ sie auf die Waschmaschine fallen. Auf dem Schuhschrank lagen noch immer die Reha-Unterlagen.",
  "Dann fiel ihr ein, dass sie das Auto nicht abgeschlossen hatte.",
  "Sie zog die Jacke über den Pyjama, ging runter. Der Hof war leer, das Licht im Treppenhaus ging aus, bevor sie die Haustür erreichte. Sie setzte sich auf den Fahrersitz, um den Schlüssel in die Zündung zu stecken und wieder rauszuziehen, eine Gewohnheit, sie wusste nicht warum. Im Becherhalter stand die Kaffeetasse aus der Praxis, die sie heute Morgen nicht mitgenommen hatte, sondern gestern. Oder vorgestern. Der Rand war braun und trocken, und an einer Stelle hatte sich ein feiner Ring gebildet, wo die Flüssigkeit verdunstet war.",
  "Sie saß da und sah ihn an."
];

const sceneThreeParagraphs = [
  "Die Brotdose war innen noch feucht. Mara drehte sie um, hielt sie schräg gegen das Licht der Dunstabzugshaube und fuhr mit dem Geschirrtuch in die Ecken, in denen sich immer ein Rest Joghurt oder Apfelspucke hielt. Das Plastik roch nach Spülmittel und nach dem Salamibrot von heute Mittag. Morgen Käse. Den Zettel an der Kühlschranktür hatte sie schon umgedreht.",
  "In der Wohnung war es still auf eine Art, die sie als Arbeit kannte. Henri atmete im Zimmer nebenan hörbar tief. Die Heizung knackte. Auf dem Herd stand der halbvolle Topf vom Nudelwasser, den sie gleich ausleeren würde, gleich, sobald die Dose trocken war.",
  "Das Telefon vibrierte auf der Arbeitsplatte, bevor es klingelte. Sie sah den Namen, bevor sie den Ton hörte.",
  "Tobias.",
  "Mara legte das Geschirrtuch zur Seite, nicht die Brotdose. Die behielt sie in der Hand.",
  "\"Ja.\"",
  "\"Hey.\" Seine Stimme war klar. Nicht belegt, nicht zu hell. Nur Tobias. \"Ich hoffe, es ist nicht zu spät.\"",
  "\"Es geht.\"",
  "\"Ich bin noch hier. In der Klinik, meine ich. Noch zwei Wochen.\" Er machte eine kleine Pause, als sortiere er etwas. \"Ich darf abends telefonieren.\"",
  "\"Okay.\"",
  "Sie hörte im Hintergrund einen Flur, das Schließen einer Tür, weit weg eine Männerstimme. Dann wieder nur ihn. Er atmete einmal ein, wie jemand, der sich entschieden hat.",
  "\"Wie geht es ihm?\"",
  "Mara drehte die Brotdose in der Hand. Der Deckel lag neben der Spüle, rot, mit Kratzern vom Spülmaschinensieb.",
  "\"Gut. Er schläft.\"",
  "\"Gut.\" Er sagte es, als beruhige ihn das Wort. \"Und sonst? Was macht er gerade so?\"",
  "Sie überlegte, was eine ehrliche Antwort wäre und was eine, die ihm half. Es war nicht dasselbe.",
  "\"Er hat eine Wichteltür. An der Wand im Wohnzimmer. Er legt da morgens Sachen hin.\"",
  "\"Eine Wichteltür.\"",
  "\"Ja.\"",
  "\"Was legt er da hin?\"",
  "\"Heute einen Tannenzapfen. Gestern einen Radiergummi.\"",
  "Tobias lachte leise. Es war kein Schutzlachen. Es war wirklich ein Lachen, und für einen Moment stand er vor ihr, wie er früher im Flur gestanden hatte, Schlüssel in der Hand, Jacke noch an, und hatte über etwas gelacht, das Henri gesagt hatte.",
  "Sie stellte die Brotdose auf die Arbeitsplatte. Sie ließ sie nicht los.",
  "\"Mara.\"",
  "\"Ja.\"",
  "\"Ich weiß, dass ich viel verpasse.\"",
  "Sie sagte nichts.",
  "\"Ich meine\", er suchte, \"ich weiß, wie das klingt. Ich ruf an, ich frag, wie es ihm geht, und dann lege ich auf und bin trotzdem hier und nicht bei ihm.\"",
  "\"Tobias.\"",
  "\"Ich will das nur sagen. Dass ich das weiß.\"",
  "Sie sah auf ihre Hand am Rand der Dose. Der Nagelrand war trocken, rissig. Sie fuhr mit dem Daumen darüber.",
  "\"Er fragt manchmal nach dir.\"",
  "Das war ein Geschenk. Sie hörte, wie er es in Empfang nahm.",
  "\"Was sagt er?\"",
  "\"Er fragt, wo du bist. Ich sag ihm, du bist in einem Haus, wo sie dir helfen, gesund zu werden.\"",
  "\"Und das versteht er?\"",
  "\"Er ist sechs. Er versteht, was er braucht.\"",
  "Tobias war still. Nicht die Stille von vorhin. Eine andere. Sie hörte das Quietschen eines Stuhls, das Stocken seines Atems.",
  "\"Ich würde ihn gern anrufen\", sagte Tobias. \"Irgendwann. Wenn ich hier rauskomme. Nicht jetzt.\"",
  "\"Das können wir dann sehen.\"",
  "\"Ja.\"",
  "\"Tobias.\"",
  "Er kam ihr zuvor.",
  "\"Ich mache es wieder kaputt, oder?\"",
  "Der Kühlschrank sprang an. Sie spürte die Rückenmuskeln über dem Beckenkamm, die seit Dienstag nicht weicher geworden waren. Die Brotdose unter ihrer Hand war jetzt fast trocken.",
  "\"Wahrscheinlich. Ja.\"",
  "Er sagte nichts.",
  "\"Ich weiß es nicht, Tobias. Ich weiß nur, dass ich müde bin. Und dass ich nicht mehr so tun kann, als wäre ich mir bei dir sicher.\"",
  "\"Nein.\"",
  "\"Das ist nichts Böses. Das ist einfach nur wahr.\"",
  "\"Ich weiß.\"",
  "Sie hörte ihn einatmen, zweimal, als suche er einen Satz, der noch übrig war. Er fand keinen. Sie half ihm auch nicht.",
  "\"Ich lass dich dann\", sagte er. \"Es ist spät.\"",
  "\"Ja.\"",
  "\"Gib ihm einen Kuss von mir. Morgen früh. Wenn er es hören will.\"",
  "\"Mach ich.\"",
  "\"Mara.\" Er zögerte. \"Danke.\"",
  "Sie legte auf, bevor sie antworten musste.",
  "Die Küche war genauso hell wie vorher. Der Nudeltopf stand noch auf dem Herd. Das Geschirrtuch hatte sie irgendwann aus der Hand gelegt, ohne es zu merken, und wieder aufgenommen. Jetzt hing es halb über dem Rand des Spülbeckens, eine Ecke im Wasser, die andere auf der Arbeitsplatte. Die Brotdose stand offen, der rote Deckel daneben.",
  "Sie rührte sich nicht.",
  "Auf dem Display war das Gespräch zu einem Eintrag geworden, mit Uhrzeit und Dauer. Sieben Minuten. Es hatte sich länger angefühlt und kürzer zugleich. Sie drehte das Telefon mit dem Display nach unten, als würde das etwas verschließen.",
  "Im Kinderzimmer drehte Henri sich im Bett. Eine Matratze, die sie kannte. Ein kurzes Seufzen, dann wieder Atem.",
  "Mara sah die Brotdose an. Morgen Käse. Sie hatte eine Packung im Kühlschrank, die am Freitag ablief, das reichte. Der Tannenzapfen lag noch im Wohnzimmer vor der Tür, sie musste ihn vor dem Schlafen wegräumen und etwas dafür hinlegen, irgendwas, einen Bonbon, einen kleinen Knopf, sie hatte Knöpfe in der Schublade in der Diele.",
  "Sie dachte all das nebeneinander, in Reihenfolge, und rührte sich trotzdem nicht.",
  "Irgendwo zwischen Brotdose und Tannenzapfen war etwas, das nicht zur Reihenfolge gehörte, und das wartete darauf, benannt zu werden. Sie benannte es nicht. Sie wusste, wie er vor zwei Jahren im Flur gestanden hatte, am Morgen vor der ersten Einweisung, die Jacke schon an, die Tasche noch nicht, und wie er gesagt hatte, diesmal, Mara. Diesmal.",
  "Sie hatte ihm heute nicht genickt. Sie hatte wahrscheinlich gesagt. Das war nicht dasselbe, und sie wusste nicht, ob es besser war.",
  "Sie griff nach dem Geschirrtuch, um es gerade zu ziehen, und hielt dann nur die Ecke zwischen zwei Fingern. Der Stoff war an der nassen Seite kühl. Sie zog ihn nicht.",
  "Das Telefon lag umgedreht. Der Topf stand voll. Die Brotdose offen. Der rote Deckel daneben.",
  "Sie stand in der Mitte ihrer Küche und sah auf die eigenen Hände, als gehörten sie zu jemandem, der gleich etwas tun würde. Dann, irgendwann, klappte sie den Deckel auf die Brotdose. Sie drückte die Ecken fest. Sie stellte die Dose auf den Zettel am Kühlschrank, damit sie morgen früh nicht suchte.",
  "Das Geschirrtuch hing schief über dem Spülbecken. Sie ließ es hängen."
];

const sceneFourParagraphs = [
  "Der späte Nachmittag hing grau über dem Parkplatz, als Mara die Haustür mit dem Ellenbogen aufdrückte. In der rechten Hand zwei Stofftaschen, in der linken eine Papiertüte mit dem Kuchen, den Sabine ihr noch mitgegeben hatte, dazu der Autoschlüssel zwischen zwei Fingern. Henri hing an ihrem Mantelsaum.",
  "\"Mama, guck mal, ich hab das Blatt noch.\"",
  "\"Ja, Schatz.\"",
  "\"Guck mal richtig.\"",
  "\"Gleich, Henri. Halt mal kurz die Tüte hier, die kleine.\"",
  "Er ließ den Mantel los und nahm die Papiertüte, zu breit für seine Hände. Die Henkel der Stofftaschen schnitten in ihre Handflächen. Milch, zwei Flaschen Wasser, Kartoffeln, der Käse. Der linke Henkel rutschte. Sie zog die Schulter hoch, um ihn zu halten.",
  "\"Mara, warte mal.\"",
  "Sabine kam die drei Stufen herunter, eine Strickjacke über den Schultern, in Hausschuhen. Hinter ihr, einen halben Schritt versetzt, ein Mann in einem dunklen Pullover, die Hände in den Jackentaschen.",
  "\"Du bist ja losgestürmt, als würde es brennen\", sagte Sabine. \"Das ist Cem. Der ist übers Wochenende hier. Ich hab dir doch von ihm erzählt, wir haben uns über eine App kennengelernt.\"",
  "\"Hi\", sagte Cem.",
  "\"Hallo.\" Mara nickte, beide Hände voll, und hoffte, dass das als Gruß reichte.",
  "Henri zog an ihrem Mantel. \"Guck mal, das Blatt, da sind so Streifen drin.\"",
  "\"Gleich, Henri.\"",
  "Sabine beugte sich zu ihm herunter. \"Hast du Oma Sabine ein Blatt mitgebracht?\"",
  "\"Nein, ich hab’s für Mama.\"",
  "\"Ach so.\" Sabine lachte kurz. Mara versuchte, den rutschenden Henkel neu zu fassen, ohne den Kuchen schief zu kippen. Sie sah, wie Cem den Blick auf die Taschen legte, nicht auf ihr Gesicht.",
  "Er trat einen Schritt nach vorn und streckte die Hand aus.",
  "\"Darf ich?\"",
  "Es war keine Frage, die eine Antwort brauchte. Bevor Mara überlegen konnte, ob sie ablehnen wollte, hatte er die beiden schweren Taschen schon an den Henkeln, ruhig, als nehme er sich sein eigenes Gepäck. Er trat einen halben Schritt zurück. Keine Geste dazu. Kein Lächeln, das etwas bedeuten sollte.",
  "\"Welches Auto?\"",
  "\"Der blaue, der zweite da hinten.\"",
  "\"Okay.\"",
  "Er ging voraus. Sabine schob die Strickjacke höher.",
  "\"Cem bleibt bis Sonntag. Wir müssen uns echt mal wieder richtig sehen, Mara, nicht immer nur im Vorbeigehen.\"",
  "\"Ja. Ich ruf dich an.\"",
  "\"Das sagst du immer.\"",
  "\"Ich weiß.\"",
  "Sabine drückte sie kurz an der Schulter, über den Mantel, und blieb auf der Treppe stehen. Mara folgte Cem mit der Papiertüte und Henri an der Hand. Der Junge hielt das Blatt jetzt hoch, als laufe er an einer Fahnenstange entlang.",
  "\"Guck mal, Mama. Die Streifen sehen aus wie Finger.\"",
  "\"Ja, sehe ich.\"",
  "\"Richtig?\"",
  "\"Richtig.\"",
  "Ihre rechte Hand war leer. Nur der Schlüssel, die Tüte, Henris kleine feuchte Hand. Die linke Hand war leer. Sie bemerkte es daran, dass ihre Finger sich zum ersten Mal seit dem Supermarkt langsam öffneten, ohne dass sie es entschied. Der Weg bis zum Auto waren vielleicht zwanzig Meter. Sie ging sie anders.",
  "Die Schultern saßen tiefer. Der rechte Oberarm brannte noch von der Kassenschlange. Aber der Griff, mit dem sie normalerweise die Taschen hielt, bis sie beim Auto ankam, dieser Griff war aus.",
  "Cem stellte die beiden Taschen am Kofferraum ab, ohne nachzusehen, ob sie schon da war. Er trat zurück, zwei Schritte, Hände wieder in den Jackentaschen.",
  "\"Danke\", sagte Mara.",
  "\"Klar.\"",
  "Sie stellte die Papiertüte oben auf eine der Taschen. Henri zog an ihrem Arm.",
  "\"Guck mal, da ist noch so ein Blatt, das gleiche.\"",
  "\"Henri, ich muss das einladen, bleib beim Auto.\"",
  "\"Aber guck mal schnell.\"",
  "\"Gleich.\"",
  "Sie hob die erste Tasche in den Kofferraum. Der Henkel streifte ihre Handfläche, und da sah sie die beiden roten Streifen, quer über die Ballen, dort, wo das Gewicht gelegen hatte. Die zweite Tasche. Die Papiertüte in die Mulde neben dem Reserverad. Kuchen nicht umkippen.",
  "Cem stand einen Meter entfernt, sah zu Henri, der das neue Blatt zwischen zwei Finger klemmte.",
  "\"Schönes Blatt\", sagte Cem.",
  "\"Ja\", sagte Henri. \"Das ist für Mama.\"",
  "\"Ah.\"",
  "Mehr nicht. Er wartete nicht, dass Henri weiter erzählte, und drängte ihn nicht.",
  "Mara klappte den Kofferraum zu. \"Nochmal danke.\"",
  "\"Passt schon.\"",
  "Sie schob Henri in den Kindersitz, schnallte ihn an. Sein Anorak war zu dick, der Gurt saß zu hoch, sie zog ihn zurecht. Als sie den Kopf wieder hob, war Cem schon auf halbem Weg zu Sabine zurück. Sabine winkte von der Treppe. Mara winkte kurz zurück, ohne zu sehen, ob es ankam, und stieg ein.",
  "Im Auto roch es nach feuchter Jacke und dem Bananenrest, den Henri heute Morgen im Getränkehalter liegengelassen hatte. Sie startete, fuhr aus der Parklücke, hielt am Ausfahrtsschild, setzte den Blinker. Henri erzählte hinten von den Streifen im Blatt, dann von einem Käfer in der Kita, dann wieder vom Blatt.",
  "\"Mama, guck mal im Spiegel.\"",
  "\"Ich fahre, Henri.\"",
  "\"Nur kurz.\"",
  "Sie sah im Rückspiegel das Blatt, das er an die Scheibe hielt. \"Schön.\"",
  "\"Richtig schön?\"",
  "\"Richtig schön.\"",
  "An der Ampel öffnete und schloss sie die Hand am Lenkrad. Die linke. Die Streifen brannten noch leicht, aber es war nur noch Haut, kein Gewicht mehr. Sie legte die Finger wieder um das Lenkrad, gleichmäßig verteilt, und fuhr weiter.",
  "Zu Hause stellte sie die Taschen in der Küche ab, eine nach der anderen, und blieb einen Moment stehen, die Hände auf der Arbeitsplatte. Draußen wurde es früh dunkel. Henri zog im Flur die Schuhe aus, einer fiel um, er ließ ihn liegen. Sie hörte ihn in sein Zimmer gehen.",
  "Sie drehte die Handflächen nach oben. Die roten Streifen lagen quer über den Ballen, an der linken Hand deutlicher als an der rechten. Sie rieb kurz darüber mit dem Daumen. Schon blasser, als sie gedacht hatte.",
  "Ihre Schultern brannten weniger.",
  "Sie hob die Milch aus der Tasche und stellte sie in den Kühlschrank."
];

const sceneFiveParagraphs = [
  "Das Laken war kalt dort, wo es nass war, und warm dort, wo Henri noch darauf gelegen hatte. Mara zog es an den Ecken vom Bett, erst oben links, dann rechts, dann hinüber zur Matratzenseite, die schon eingezogen hatte. Der Geruch kam hoch, bevor sie Luft holen konnte. Sie atmete durch den Mund weiter.",
  "Henri stand in der Tür, in der Schlafanzughose, die noch trocken war, den Oberkörper nackt. Er hielt sich am Türrahmen fest.",
  "\"Guck mal\", sagte er, \"ich bin schon aus dem Bett.\"",
  "\"Ich seh dich.\" Sie rollte das Laken nach innen ein, damit nichts tropfte. \"Geh bitte aufs Klo und dann trockene Sachen aus der zweiten Schublade.\"",
  "\"Die blauen?\"",
  "\"Die blauen sind okay.\"",
  "Sie trug das Bündel mit ausgestreckten Armen durch den Flur. Die Maschine war noch halb voll von gestern. Sie drückte das Laken nach, schloss die Klappe, stellte sechzig ein. Der Bezug musste warten. Ihr Rücken zog beim Bücken.",
  "Im Bad war Henri schon fertig, die Hände noch feucht. Sie rieb sie mit dem Handtuch trocken, Finger für Finger. Er ließ sich das machen.",
  "Der Anruf aus der Kita kam gegen elf, zwischen zwei Terminen. Frau Peters klang so, wie sie immer klang, wenn sie nicht wollte, dass man es dramatisch nahm.",
  "\"Er hat viel geweint heute. Wir haben alles probiert. Vielleicht wäre es besser, wenn er heute früher zu Hause ist.\"",
  "\"Ich komme\", sagte Mara.",
  "Sie legte auf und rief Frau Albers an, Viertel nach zwei, Stimmtraining. Dann Herrn Kowalski, Viertel vor vier. Beide waren freundlich. Beide fragten nicht, warum. Sie schrieb \"KITA krank\" in den Kalender, obwohl er nicht krank war. Es war die Vokabel, die alle verstanden.",
  "Auf der Fahrt rechnete sie nicht nach. Nicht die Stunden, nicht die Kasse, nicht den Dienstag nächste Woche. Sie fuhr und hielt an der Ampel, und die Scheibenwischer gingen auf der ersten Stufe.",
  "Im Flur der Kita hing sein Rucksack schon am Haken. Er stand daneben, die Jacke halb zu, eine Hand in Frau Peters' Hand. Als er Mara sah, ließ er los und ging drei Schritte und blieb dann stehen, als hätte er vergessen, wohin. Sie ging den Rest.",
  "\"Komm\", sagte sie.",
  "Er drückte das Gesicht in ihre Jacke, unter die Reißverschlusslasche, und hielt sich am Stoff fest. Er sagte nichts. Sie nickte Frau Peters zu. Frau Peters nickte zurück.",
  "Im Treppenhaus wurde er schwerer an ihrem Arm. Sie hielt kurz an auf dem Absatz.",
  "\"Ich hab einen Turm gemacht\", sagte er dann, in den Jackenstoff.",
  "\"Ja?\"",
  "\"Er ist umgefallen. Aber dann hab ich wieder einen gemacht.\"",
  "\"Das ist gut.\"",
  "\"Der zweite war besser.\"",
  "\"Glaub ich dir.\"",
  "Sie gingen weiter. Auf der Straße zog sie ihm die Mütze übers Ohr, das immer wieder freikam.",
  "Beim Vorbeigehen sah sie die Wichteltür an der Sockelleiste. Das Päckchen davor stand noch da.",
  "Zu Hause zog sie ihm die Schuhe aus, bevor er nach dem Reißverschluss fragen konnte. Er stand da und ließ es geschehen. Dann ging er zum Sofa und legte sich hin, längs, den Kopf auf das Kissen, das nach ihr roch.",
  "\"Ich hab Hunger.\"",
  "Sie machte ein Brot mit Frischkäse und schnitt die Rinde ab, obwohl er die Rinde normalerweise aß. Heute nicht. Heute mit abgeschnittener Rinde. Er aß die Hälfte und legte den Rest auf den Teller am Boden.",
  "\"Kannst du herkommen?\"",
  "Sie kam. Sie setzte sich, und er legte sich halb über sie, Kopf auf ihre Schulter, ein Bein über ihren Oberschenkel. Sein Haar roch nach Kita, nach dem Flur dort, nach Tempera. Sie zog ihm die Socken gerade.",
  "\"Guck mal\", sagte er und hob den Finger zur Lampe. \"Da ist eine Spinne.\"",
  "Es war eine Fluse.",
  "\"Machst du sie weg?\"",
  "\"Später.\"",
  "\"Okay.\"",
  "Er erzählte von einem Jungen namens Emil und dessen Auto und dann wieder vom Turm, diesmal anders herum. Mitten im Satz wurde er leiser. Der Satz brach ab bei: \"und dann ist er ...\" Sie wartete auf das, was kommen sollte. Es kam nicht. Sein Mund blieb halb offen.",
  "Sie schaltete den Fernseher nicht an. Sie legte den Kopf nicht zurück. Ihre Hand lag auf seinem Rücken, zwischen den Schulterblättern, da, wo er dünn war.",
  "In der Küche klingelte das Telefon. Viermal. Mailbox. Nach dem Band eine Männerstimme, die sie nicht zuordnen konnte, kurz. Dann war es still.",
  "Ihr Arm unter seinem Kopf fing an zu kribbeln. Erst an der Hand, dann im Ellbogen, dann im Oberarm. Sie verschob nichts. Sie atmete flach, damit er nicht aufwachte von ihrer Brust.",
  "Draußen wurde es grau, dann dunkler. Im Fenster lag schon das Küchenlicht, das sie hatte brennen lassen. Der Teller stand noch am Boden. Die abgeschnittene Rinde daneben.",
  "Sie dachte an das Laken, das gleich fertig war. An den Trockner, den sie eigentlich nicht mehr aufmachen wollte vor dem Essen. An morgen früh, aber nur bis zum Wecker.",
  "Er murmelte etwas im Schlaf, eine Silbe, keine ganze. Seine Hand bewegte sich kurz in ihrem Pulloverstoff und wurde wieder locker.",
  "Ihre Schulter fing an zu brennen unter seinem Gewicht. Das Bein, das er über ihren Oberschenkel gelegt hatte, war warm und schwer. Sie rückte den Kopf an der Lehne einen Millimeter zur Seite. Mehr nicht. Das Telefon begann wieder zu klingeln. Viermal, zählte sie mit. Dann Mailbox. Diesmal keine Stimme. Nur ein paar Sekunden Atemgeräusch, oder Leitung, sie konnte es nicht unterscheiden.",
  "Sie sah auf den Scheitel, der an ihrer Halsbeuge lag. Eine Strähne war nass vor Schweiß an der Schläfe, da, wo das Kissen an seine Wange drückte. Sie wischte nichts weg.",
  "Als sie ihn schließlich hochnahm, war ihr Arm bis zur Schulter ohne Gefühl. Sie stand vorsichtig auf, legte das Kissen unter seinen Kopf, zog die Decke über ihn. Sie blieb einen Moment gebückt, bis der Rücken sich sortierte. Dann kam das Kribbeln zurück, in kleinen Stichen, vom Ellbogen nach unten.",
  "In der Küche war das Licht zu hell. Sie schaltete es nicht aus. Auf dem Display standen zwei Anrufe von derselben Nummer. Kein Name.",
  "Sie drückte auf die Mailbox. Erst ihr eigenes Band. Dann die Männerstimme vom ersten Mal, leise und nah, als stünde der Mund direkt am Telefon. \"Mara? Ich versuch's später noch mal.\" Mehr nicht.",
  "Sie hörte die Nachricht zu Ende, ohne das Telefon ans Ohr zu nehmen. Danach stand sie einen Moment reglos da, das Telefon in der Hand. Im Bad schlug die nasse Wäsche gegen die Trommel. Der Kühlschrank summte. Irgendwo in den Rohren sackte Wasser ab.",
  "Auf ihrem Pullover, an der Schulter, war ein feuchter Abdruck. Rund, von seiner Wange.",
  "Als das Telefon wieder zu klingeln begann, drehte sie es um und ließ es klingeln."
];

export default function IchSeheDichSamplePage() {
  return (
    <main className="reader-shell sample-reader">
      <header className="reader-topbar sample-reader__topbar">
        <div>
          <p className="reader-eyebrow">EMBER Leseprobe</p>
          <h1>Ich sehe dich</h1>
          <p>Die Szenen 1 bis 5 sind live. Die Leseprobe wird fortlaufend ergänzt.</p>
        </div>
      </header>

      <article className="sample-reader__article">
        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szenen 1–5</p>
          <h2>Die Wichteltür</h2>
          <p>
            Mara baut nachts die kleine Tür für Henri auf. Am nächsten Tag läuft alles
            weiter. Dann ruft Tobias an. Die Leseprobe zeigt Liebe, Erschöpfung und die
            Arbeit, die niemand sieht.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneOneParagraphs.map(function (paragraph, index) {
            return <p key={`scene-1-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 2</p>
          <h2>Der nächste Tag</h2>
          <p>
            Zwischen Bad, Kita, Praxis, Supermarkt und Abendroutine hält Mara alles in
            Bewegung, bis am Ende nur noch eine vergessene Tasse im Auto übrig bleibt.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneTwoParagraphs.map(function (paragraph, index) {
            return <p key={`scene-2-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 3</p>
          <h2>Der Anruf</h2>
          <p>
            Abends in der Küche spricht Mara mit Tobias aus der Klinik. Nichts eskaliert,
            aber nach sieben Minuten steht alles wieder offen im Raum.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneThreeParagraphs.map(function (paragraph, index) {
            return <p key={`scene-3-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 4</p>
          <h2>Der Parkplatz</h2>
          <p>
            Nach einem Besuch bei Sabine trägt Mara den Einkauf zum Auto. Cem hilft, ohne
            mehr daraus zu machen, und genau darin liegt die Entlastung.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneFourParagraphs.map(function (paragraph, index) {
            return <p key={`scene-4-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 5</p>
          <h2>Früher nach Hause</h2>
          <p>
            Henri hält den Kitatag nicht durch. Zuhause schläft er auf Mara ein, während
            zwei unbeantwortete Anrufe wie eine leise Drohung im Hintergrund bleiben.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneFiveParagraphs.map(function (paragraph, index) {
            return <p key={`scene-5-${index}`}>{paragraph}</p>;
          })}
        </section>

        <section className="sample-reader__divider">
          <h3>Fortsetzung folgt</h3>
          <p>
            Die Leseprobe endet hier vorerst. Im EMBER Studio wird die nächste Szene
            weiterentwickelt.
          </p>
        </section>
      </article>
    </main>
  );
}
