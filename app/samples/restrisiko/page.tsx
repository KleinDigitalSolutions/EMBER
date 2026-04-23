import Link from "next/link";

const sceneOneParagraphs = [
  "Der Beschluss lag ganz oben auf dem Stapel. Kopie, drei geheftete Seiten, das Deckblatt gelocht wie immer, wenn Rauschs Büro die Post vorbereitet hatte. Fehr las nur die erste Zeile. In der Unterbringungssache Elias Cord.",
  "Er legte die Hand flach auf das Papier, als müsste er es festhalten. Draußen, hinter dem Kanzleifenster, zog jemand einen Rollkoffer über das Kopfsteinpflaster, und das Geräusch kam verzögert an, als wäre das Glas dicker als gestern. Fehr rückte den Stapel gerade. Dann noch einmal. Er merkte es beim zweiten Mal und ließ die Hand sinken.",
  "Er blieb an seinem Schreibtisch stehen, ohne sich zu setzen. Auf dem Flur klapperte Frau Ulrich mit der Kaffeedose. Der Kalender zeigte Dienstag, 07:40 Uhr, und unter dem Datumsfeld klebte noch der gelbe Zettel mit Lenas Zahnarzttermin, den er vor zwei Wochen versprochen hatte zu übernehmen. Er hatte ihn nicht übernommen. Er zog den Zettel ab, legte ihn in die obere Schublade und schob sie zu, bevor er das Deckblatt umschlug.",
  "Externes Sachverständigengutachten. Legalprognose gemäß § 67d StGB. Frage nach unbegleiteten Lockerungen. Fehr las den Paragrafen, als stünde er zum ersten Mal darin. Er las die Besetzung der Kammer. Er las den Namen darunter noch einmal. Cord, Elias, geboren 1966. Achtzehn Jahre. Fünf Taten. Eine Nummer, unter der das Land in den Neunzigern aufgehört hatte, bei Fernsehbildern wegzuschauen.",
  "Er bemerkte, dass er den Atem seit einer halben Minute flacher führte. Er bemerkte es, weil er den Kaffee, den Frau Ulrich vor einer Stunde gebracht hatte, jetzt kalt im Glas sah und ihn trotzdem nicht anfasste. Der Name war keine Überraschung. Rausch hatte vor vier Tagen eine Mail geschrieben, zwei Zeilen: Wäre ein Mandat denkbar? Details folgen schriftlich. Er hatte ja geantwortet, ohne zu fragen, worum es ging. Er hatte es damals für Routine gehalten. Er hielt es auch jetzt dafür, solange er den Satz innerlich wiederholte.",
  "Das Telefon klingelte, bevor er die zweite Seite erreicht hatte.",
  "Rausch ließ ihm keine Anlaufzeit. Anhörung in elf Tagen. Presse und Ministerium saßen dem Verfahren im Nacken. Fehr sollte kein schönes Gutachten schreiben, sondern eines, das jede Zeile trägt. Er sagte zu, bevor die Akte ganz gelesen war, und merkte es erst, als der Hörer schon wieder in seiner Hand lag.",
  "Im Vorzimmer sagte er Frau Ulrich, sie müsse die Termine verschieben. Dann fuhr er los. Auf der A4 sortierte er den Fall in fachliche Arbeitsschritte, bis sich zwischen den Formulierungen ein älterer Satz dazwischenschob, einer aus einem Gutachten von 2011, den er nie ganz losgeworden war. Er dachte den Namen nicht aus. Er erkannte nur, dass der alte Fall schon im Auto mitfuhr.",
  "Vor der Klinik war die Luft kalt und stumpf zugleich. Nasser Kies, Wärmeschächte, der Geruch von Chlorreiniger hinter der Schleuse. Fehr gab Ausweis, Schlüssel, Telefon ab und ließ sich durch den zweiten Metalldetektor winken, weil die Akteklammer piepte. Der Flur war länger, als er ihn erinnerte. Ein Pfleger nickte, ohne stehenzubleiben. Die Neonröhre über der Brandschutztür flackerte im Takt seiner Schritte, oder er bildete es sich ein.",
  "Im Aufzug war er allein. Edelstahl, Sicherheitsglas, der gemauerte Schacht dahinter. Im Spiegel stand ein Mann mit grauem Sakko, Besucherchip am Revers und einer Akte, die fester unter dem Arm klemmte, als nötig war. Fehr sah das Gesicht an und dachte nicht an Cord. Er dachte an den alten Satz, den er damals nicht gestrichen hatte. Der Aufzug ruckte und fuhr nach oben."
];

const sceneTwoParagraphs = [
  "Der Gesprächsraum in Hohenhort roch nach Chlorreiniger und kaltem Kaffee. Fehr setzte die Aktenmappe auf die Tischkante, richtete sie parallel zur Kante aus, legte den Protokollblock daneben. Zwei Stühle, ein Tisch, ein vergittertes Fenster, das auf eine Betonmauer zeigte. Die Leuchtstoffröhre an der Decke summte in einer Frequenz, die nach zwanzig Minuten Kopfschmerzen machte. Er kannte solche Räume. Er hatte in solchen Räumen schon Dinge geschrieben, die er später korrigieren musste.",
  "Prüfhypothese für heute: Baseline. Affektmodulation unter Standardfragen. Einsichtssprache versus Einsicht. Steuerungsfähigkeit unter einer gezielten Irritation in der zweiten Hälfte. Er hatte die Reihenfolge im Kopf, bevor er den Kugelschreiber klickte.",
  "Cord wurde ohne Fesseln hereingeführt. Grauer Pullover, saubere Hose, die Hände locker an den Seiten. Er blieb an der Tür stehen, bis der Pfleger mit einer kleinen Geste das Betreten freigab. Erst dann kam er zum Tisch, zog den Stuhl zurück, wartete.",
  "„Herr Cord. Setzen Sie sich bitte.\"",
  "„Danke.\" Er setzte sich, bevor Fehr es tat. Eine Sekunde früher, als es höflich gewesen wäre. „Soll ich die Hände auf den Tisch legen?\"",
  "„Wie es für Sie angenehm ist.\"",
  "„Für mich ist beides angenehm.\" Cord legte die Hände in den Schoß. „Ich dachte, es wäre für Sie angenehmer.\"",
  "Fehr klickte den Kugelschreiber zurück. „Mein Name ist Dr. Fehr. Ich bin vom Gericht als externer Gutachter beauftragt. Sie wissen, worum es geht.\"",
  "„Unbegleitete Lockerungen. Prüfung der Legalprognose. Anhörung in elf Tagen.\" Cord sagte das, als lese er es von einem Zettel ab, den nur er sah. „Ich bin vorbereitet.\"",
  "„Gut. Dann fange ich mit einigen allgemeinen Fragen an. Tagesstruktur. Wann stehen Sie auf?\"",
  "„06:00 Uhr. Frühstück um 06:30 Uhr. Arbeit in der Buchbinderei ab 08:00 Uhr. Mittagessen 12:00 Uhr. Gruppentherapie dienstags und donnerstags, 14:00 Uhr. Einzelgespräche bei Dr. Mende mittwochs um 10:00 Uhr. Sport montags und freitags. Zurück auf Station 18:00 Uhr. Licht aus 22:00 Uhr.\"",
  "„Und heute?\"",
  "„Heute ist Dienstag. Heute ist die Gruppe ausgefallen, weil Sie da sind.\"",
  "Fehr notierte. „Medikation?\"",
  "„Sertralin, ohne Abweichung, morgens. Seit elf Jahren unverändert. Nebenwirkungen keine, die ich nicht einordnen könnte.\"",
  "„Einordnen in welchem Sinn?\"",
  "Cord lächelte knapp, kein Zähnezeigen, nur eine Bewegung am Mundwinkel. „Das ist eine bessere Frage als die vorherige.\" Er hob den Blick. „Sie fragen nach Routine, um zu sehen, ob ich mechanisch antworte oder ob ich abschweife. Mechanisch deutet auf Anpassung ohne innere Beteiligung. Abschweifen deutet auf mangelnde Strukturierung oder auf Ablenkungsversuche. Ich vermute, Sie hätten lieber etwas dazwischen.\"",
  "Fehr legte den Stift quer auf den Block. Er ließ seine Stimme flach.",
  "„Sie haben das hier offenbar schon öfter gemacht.\"",
  "„Ich habe achtzehn Jahre Zeit gehabt, zuzuhören. Dr. Mende ist gründlich. Ihre Vorgänger waren es auch. Ich beantworte Ihre Fragen, Herr Dr. Fehr. Ich beantworte sie nur nicht so, als wäre es die erste Runde.\"",
  "„Dann erzählen Sie mir etwas, das nicht in der Akte steht. Was denken Sie, wenn Sie an die fünf Frauen denken?\"",
  "Einen Moment lang war nur das Summen der Röhre zu hören. Cord sah auf seine Hände, nicht weg, nicht schauspielerisch. Er sah sie an, als prüfe er, ob sie noch zu ihm gehörten.",
  "„Sie fragen mich nicht, was ich fühle. Sie fragen, was ich denke.\"",
  "„Ja.\"",
  "„Das ist eine bewusste Entscheidung. Sie wollen prüfen, ob ich zwischen Affekt und Kognition unterscheiden kann. Ob ich mir eine Einsichtssprache angeeignet habe, die nur auswendig gelernt klingt. Oder ob ich in der Lage bin, eine Tat, die ich begangen habe, als Handlung zu betrachten, die einer Frau widerfahren ist, und nicht als Ereignis, das mich in eine Klinik gebracht hat.\" Er hob den Kopf. „Soll ich jetzt antworten?\"",
  "„Bitte.\"",
  "„Ich denke an jede einzelne. Nicht jeden Tag, das wäre gelogen. Aber oft genug, dass ich mich daran gewöhnt habe, daran zu denken, ohne mich zu entlasten.\" Pause. „Ich weiß, wie das klingt. Es klingt wie die Antwort, die man geben soll. Ich kann sie Ihnen auch anders sagen. Ich werde sie aber nicht anders sagen, weil sie so stimmt.\"",
  "Fehr schrieb drei Zeilen. Er schrieb langsamer, als er wollte. Er strich das Wort konform durch und ersetzte es nicht.",
  "Zweite Hälfte. Steuerungsprobe.",
  "„Herr Cord, wenn Sie morgen unbegleitet das Gelände verlassen dürften, wohin würden Sie gehen?\"",
  "„In eine Bibliothek.\"",
  "„Warum?\"",
  "„Weil dort nichts passiert, was ich nicht kontrollieren kann.\"",
  "„Ist Kontrolle wichtig für Sie?\"",
  "„Für Sie auch, Herr Dr. Fehr.\"",
  "Fehr hob den Blick. Cord sah ihn nicht provokant an. Er sah ihn an, wie ein Kollege einen Kollegen ansieht, der gerade einen kleinen Fehler gemacht hat und noch nicht weiß, dass er ihn gemacht hat.",
  "„Wir sprechen über Sie.\"",
  "„Wir sprechen über Risikoeinschätzung. Da sitzen immer zwei im Raum.\"",
  "Fehr ließ eine Sekunde verstreichen. Dann zwei. Er hätte die Frage zurückgeben können, mit dem Standardsatz, den er seit Jahren benutzte. Er tat es nicht. Er spürte, dass er es nicht tat, und setzte den Stift wieder an, ohne etwas zu schreiben.",
  "„Herr Cord, ich stelle Ihnen jetzt eine Frage, bei der die Antwort weniger zählt als das, was davor passiert. Stellen Sie sich die zweite Frau vor, Name in der Akte. Sie liegt auf dem Boden. Sie lebt noch. Was tun Sie in den folgenden neunzig Sekunden?\"",
  "Cord atmete ein, hielt die Luft an, atmete aus. Sauber, zählbar, ohne Vorführcharakter.",
  "„Ich beantworte das nicht, ohne Sie vorher darauf hinzuweisen, dass die Frage so konstruiert ist, dass jede konkrete Antwort mich belastet und jede vage Antwort Sie bestätigt. Ich sage es nicht, um auszuweichen. Ich sage es, damit Sie wissen, dass ich es weiß.\" Er machte eine kleine Pause. „In den folgenden neunzig Sekunden habe ich weitergemacht. Ich werde das nicht ausschmücken. Ich werde Ihnen auch nicht erklären, was in mir vorging, weil ich es nicht mehr rekonstruieren kann, ohne zu lügen.\"",
  "Fehr schrieb: Keine affektive Dekompensation. Keine Ausweichstruktur. Meta-Markierung der Fragelogik vor inhaltlicher Antwort. Seine Handschrift wurde kleiner.",
  "„Darf ich Sie etwas fragen, Herr Dr. Fehr?\" Cords Stimme blieb gleich leise. „Werden Sie immer dann besonders streng, wenn ein Name aus der Vergangenheit mit im Raum sitzt?\"",
  "Die Leuchtstoffröhre summte weiter. Fehr spürte den Druck hinter den Augen, den er seit dem Morgen ignoriert hatte.",
  "„Welcher Name?\"",
  "„Das müssen Sie wissen, nicht ich.\"",
  "Fehr hielt den Stift ruhig. Er wartete die drei Sekunden ab, die er sich in Ausbildungen antrainiert hatte, um nicht zu schnell zu antworten. Dann schloss er die Akte. Die Bewegung war zu ruhig, um spontan zu sein, und er wusste, dass Cord das sah.",
  "„Wir machen für heute Schluss. Danke, Herr Cord.\"",
  "„Danke, Herr Dr. Fehr.\" Cord stand auf, als der Pfleger an der Tür klopfte. An der Schwelle drehte er sich nicht um.",
  "Der Nebenraum war kleiner, fensterlos, ein Tisch, ein Stuhl, eine Neonröhre, die die gleiche Frequenz hatte wie die im Gesprächsraum. Fehr setzte sich, legte den Protokollblock flach, zog die Kappe vom Stift.",
  "Er schrieb das Datum. Er schrieb die Uhrzeit. Er schrieb: Proband kooperativ, orientiert, keine Auffälligkeiten in Affektlage oder Psychomotorik. Antwortverhalten strukturiert, metareflexiv. Hohe Reflexionsleistung, möglicherweise strategisch.",
  "Er las den Satz noch einmal. Er setzte kein Fragezeichen hinter strategisch. Er setzte auch keinen Punkt, der ihn beruhigt hätte. Der Punkt saß da wie ein Platzhalter.",
  "Er blieb sitzen. Er legte die Hand flach auf den Block und merkte, dass sie trocken war und kalt. Unter der Hand, auf der Seite davor, stand in seiner eigenen Schrift der Standardsatz, den er bei Probanden mit hoher kognitiver Funktion routinemäßig einsetzte: Kontrolle ist wichtig für Sie?",
  "Er zog die Hand nicht weg.",
  "Er schlug den Block zu und ließ die Hand darauf liegen."
];

const sceneThreeParagraphs = [
  "Der Kurier klingelte um kurz nach 19:00 Uhr. Fehr hatte die Schuhe schon ausgezogen, stand in Socken im Flur und sah durch den Spion einen Mann in dunkler Jacke, der ein DIN-A4-Kuvert vor die Brust hielt wie einen Ausweis. Kein Paketbote. Keine Uniform, die etwas bewarb. Nur die feste Haltung eines Menschen, der nicht klingelt, sondern zustellt.",
  "„Dr. Hannes Fehr?\"",
  "„Ja.\"",
  "„Persönliche Übergabe. Bitte Ausweis.\"",
  "Fehr holte den Personalausweis aus der Garderobenschale und hielt ihn in das Licht der Flurlampe. Der Kurier verglich, nickte, drehte das Klemmbrett. Unterschrift, Uhrzeit, Datum. Fehr setzte den Strich knapp, wie immer. Der Kurier riss die Durchschrift ab, gab ihm den Umschlag, sagte „Schönen Abend“ und war weg, bevor Fehr die Tür ganz geschlossen hatte.",
  "Der Umschlag war schwer. Büttenähnliches Papier, beige, mit Prägedruck einer Kanzlei, deren Name ihm nichts sagte und gleichzeitig alles. Er trug ihn in die Küche und legte ihn auf den Tisch, neben die halb geschnittene Paprika und die leere Kante des Schneidebretts. Lea war noch im Bad. Er hörte das Wasser, das sehr regelmäßig lief, wie es nur läuft, wenn jemand zuhört.",
  "Er hätte warten können. Er wartete nicht.",
  "Das Begleitschreiben lag obenauf, zweifach gefaltet, mit dem Schatten einer Büroklammer, die nicht mehr da war. Die Sätze waren glatt geschliffen. Man begrüße die Bestellung eines externen Gutachters. Man lege Wert auf maximale Neutralität. Man gehe davon aus, dass etwaige frühere berufliche Berührungspunkte des Gutachters mit vergleichbaren Fallkonstellationen die gebotene Unbefangenheit nicht berührten. Drei Absätze, keiner überflüssig, keiner angreifbar. Unter der Unterschrift ein zweiter, kürzerer Hinweis: „In der Anlage finden Sie zu Ihrer Orientierung eine Kopie aus Ihrem Gutachten vom 14.06.2006, Az. bekannt.“",
  "Fehr blätterte.",
  "Seite drei seines alten Gutachtens. Er erkannte die eigene Syntax, bevor er den Text las. Zwei Sätze in der Mitte waren mit einem gelben Textmarker unterstrichen, einmal, sauber, offenbar mit dem Lineal, denn der Strich lief gerade durch. Eine relevante Eskalationsdynamik ist unter den gegenwärtigen Bedingungen nicht zu erwarten. Die diagnostizierten narzisstischen Anteile wirken regulierend im Sinne einer Außenorientierung.",
  "Er las es zweimal. Er spürte das Blut nicht steigen, er spürte es sinken. Eine kleine, kühle Bewegung im Brustraum, die er seit Jahren nicht mehr ernst genommen hatte.",
  "„Papa?\"",
  "Lea stand in der Küchentür, die Haare noch feucht, ein Handtuch über der Schulter. Er legte das Blatt um, automatisch, mit der bedruckten Seite nach unten.",
  "„Ich mach das fertig“, sagte er und nahm die Paprika.",
  "Sie setzten sich gegen halb acht. Er hatte Nudeln aufgesetzt, sie die Tomatensauce. Eine Routine, die sie sich einmal ausgehandelt hatten und an die sie sich hielten, auch wenn sie beide wussten, dass sie nichts mehr aushandelten.",
  "„Wie war's?\"",
  "„Lang.\"",
  "„Bei Rausch?\"",
  "„Nein. Da war ich gestern. Heute nur Lesen.\"",
  "Sie nickte, wickelte Nudeln auf die Gabel, sah ihn nicht an. Er fragte nach der Uni, sie antwortete knapp. Ein Referat, ein Seminar, eine Dozentin, die sie mochte. Er hörte zu, wie er in Sitzungen zuhörte, registrierte Pausen, registrierte, dass sie schneller aß als sonst. Der Umschlag lag zwei Handbreit hinter ihrem Teller, die bedruckte Seite nach unten.",
  "„Der Neue im dritten Stock“, sagte er irgendwann, um die Stille zu füllen, „der mit dem Hund.“",
  "„Was ist mit ihm?\"",
  "„Der spricht niemanden an, aber er beobachtet alles. Treppenhaus, Hof, Briefkasten. Das ist ein Risikoprofil, das man nicht unterschätzen sollte.“",
  "Er merkte es selbst, während er es sagte. Er korrigierte nicht.",
  "Lea legte die Gabel ab. Sie legte sie nicht ärgerlich ab, sondern präzise, parallel zum Tellerrand.",
  "„Seit wann ersetzt Beschreibung bei dir Verantwortung?\"",
  "„Das war nur –“",
  "„Nein. Das war nicht nur. Du hast gerade einen Nachbarn in eine Kategorie gesteckt, weil er dich grüßt oder nicht grüßt.“",
  "„Ich habe ihn beobachtet.“",
  "„Du hast ihn verwaltet.“",
  "Er hielt ihren Blick, so lange es ging. Dann sah er auf den Teller. Die Sauce stand schon auf dem Rand fest.",
  "„Das ist mein Beruf, Lea.“",
  "„Das ist deine Angewohnheit.“",
  "Sie sagte es ohne Schärfe. Sie sagte es, wie man jemandem sagt, dass er beim Sprechen auf sein Knie tippt, ohne es zu wissen.",
  "„Ich mach den Tisch“, sagte sie und stand auf.",
  "Er ließ sie. Das Wasser lief, Geschirr klapperte, der Kühlschrank ging auf und zu. Er hörte jede Bewegung, als würde sie ihm etwas diktieren, das er nicht mitschrieb. Einmal fiel ein Löffel, einmal seufzte sie leise, einmal sagte sie halblaut etwas zu sich selbst, das er nicht verstand und auch nicht verstehen sollte.",
  "Er blieb sitzen, bis sie fertig war.",
  "„Ich geh ins Bett lesen“, sagte sie.",
  "„Schlaf gut.“",
  "„Du auch.“",
  "Sie nahm das Buch aus dem Wohnzimmer mit. Die Wohnzimmertür ließ sie angelehnt, nicht zu.",
  "Fehr räumte das letzte Glas selbst, wischte die Arbeitsplatte ab, zweimal, obwohl einmal gereicht hätte. Dann setzte er sich wieder an den Küchentisch, unter das Neonlicht der Deckenleuchte, das hier oben nicht passte und an dem er nie etwas geändert hatte.",
  "Er las den Anwaltsbrief noch einmal. Dann die markierten Sätze. Dann die Anlagen, die darunter lagen: Auszüge aus Cords Vollzugsakte, Vermerke, Therapieverlauf, eine Liste der im Verfahren damals vernommenen Zeugen. Die Liste war zu ordentlich, um zufällig zu sein. Drei Namen waren eingerückt. Keine Markierung, keine Fettung, kein Sternchen. Nur die Einrückung, zwei Zeichen weiter nach rechts als die übrigen.",
  "Einer davon war Weidmann.",
  "Fehr hatte den Namen achtzehn Jahre nicht laut gesagt. Er hatte ihn in seinem damaligen Gutachten in einem Halbsatz erwähnt und in keinem Satz danach. Weidmann war der, auf den er hätte hören müssen. Weidmann war der, dessen Einschätzung er im Rahmen der Befundintegration als anekdotisch eingeordnet hatte. Das Wort stand noch in der Akte. Er wusste, auf welcher Seite.",
  "Er stand auf, holte sein Arbeitsnotizbuch aus dem Flur, setzte sich zurück. Sitzung 2. Prüfhypothese, Teststrategie, Zielbegriffe. Unter Sondierung/Provokation hatte er heute Mittag noch nichts eingetragen. Das Feld war bewusst offen geblieben, für den Moment, in dem ihm nach dem zweiten Durchgang der Tonbandmitschrift von Sitzung 1 etwas einfallen würde.",
  "Er schrieb:",
  "Weidmann einführen. Ohne Kontext. Reaktion auf Namensnennung messen: Latenz, Blick, Körperhaltung, Wortwahl. Hypothese: Cord wird den Namen zuordnen und den Versuch unternehmen, ihn zu entwerten. Sekundärhypothese: Cord kennt Vernehmungsakte und wird das offen zeigen.",
  "Er las den Eintrag. Er war zufrieden mit der Formulierung. Sie klang wie eine Frage, die aus Sitzung 1 entstanden sein konnte. Aus Cords Verhalten. Aus einer professionellen Anschlussüberlegung, die jeder erfahrene Gutachter nach einer Baseline-Sitzung anstellen würde.",
  "Sie war es nicht.",
  "Er wusste es, während er den Stift weglegte. Er wusste auch, dass er es nirgends notieren würde. Im Vorbereitungsblatt gab es kein Feld für die Frage, woher ein Impuls stammte. Es gab nur das Feld für den Impuls selbst.",
  "Er schlug das Notizbuch zu, legte es auf das Dossier, darauf den Anwaltsbrief, zuoberst, die Unterschrift nach oben. Die Reihenfolge stimmte. Wenn Lea morgen früh durch die Küche ging, würde sie nur Papier sehen.",
  "Aus dem Wohnzimmer kam kein Laut mehr. Er stand auf, ging zur Tür, sah hinein. Lea war nicht dort. Er hatte vergessen, dass sie ins Bett gegangen war. Das Buch lag aufgeschlagen auf dem Sofa, Seite nach unten, die Leselampe brannte. Er machte das Licht aus und zog die Tür leise zu.",
  "In der Küche blieb er noch einmal am Tisch stehen.",
  "Er zog den Anwaltsbrief herunter, das Notizbuch herunter, schlug das Dossier auf der Seite mit seinem eigenen alten Satz wieder auf und drehte das Blatt so, dass der gelbe Strich zu ihm zeigte.",
  "Er legte die Hand flach darauf.",
  "Das Papier unter der Hand war kühl, glatt, reagierte nicht. Er zog die Hand nicht weg. Er ließ sie liegen, bis der Raum um ihn herum nur noch aus dem leisen Brummen der Deckenleuchte und dem Ticken der Uhr über der Tür bestand, und dann noch ein paar Sekunden länger, bis er sicher war, dass er nichts anderes tun würde als das, was er bereits entschieden hatte.",
  "Dann nahm er die Hand weg, schloss das Dossier und löschte das Licht."
];

const sceneFourParagraphs = [
  "Sitzung 2 — 09:30 Uhr",
  "Der Gesprächsraum war über Nacht nicht gelüftet worden. Der Chlorreiniger vom Bodenwischen hing noch unter der Deckenplatte, vermischt mit der trockenen, warmen Luft der Neonröhre, die leicht summte. Fehr legte den Aktendeckel auf die Tischmitte, drehte ihn nicht zu sich, sondern ließ ihn in gleicher Distanz zu beiden Stühlen liegen. Er prüfte das Aufnahmegerät. Rote Diode. Datum, Uhrzeit, Raumnummer. Die Stuhllehne drückte zwischen die Schulterblätter, zu gerade, zu hoch.",
  "Er hatte sich die Prüfhypothese am Morgen im Auto auf einen Zettel geschrieben und den Zettel an der Schranke wieder weggeworfen. Cord spricht auswendig. Die Reihenfolge seiner Sätze ist das Kontrollinstrument, nicht ihr Inhalt. Heute wird ein fremder Name die Reihenfolge stören. Der Name war Weidmann. Aus einem Fehlfall, den außerhalb zweier Behördenakten niemand kennen sollte. Fehr hatte ihn in keinem der heute mitgebrachten Unterlagen stehen.",
  "Cord wurde um 09:30 Uhr hereingeführt. Keine Handfesseln, nur der weiche Gang der Langzeituntergebrachten auf Linoleum, Hausschlappen, keine Hast. Er setzte sich, rückte den Stuhl nicht. Die Hände flach auf den Oberschenkeln, wie gestern, wie in den Protokollen der letzten acht Jahre.",
  "„Guten Morgen, Herr Cord.\"",
  "„Guten Morgen, Herr Doktor Fehr.\"",
  "„Ich würde gern an die gestrige Sitzung anschließen. Wir hatten bei Ihrer Tagesstruktur aufgehört. Schlaf, Medikation, Arbeitsbereich. Hat sich daran seit gestern etwas verändert?\"",
  "„Nein.\"",
  "„Keine Auffälligkeiten beim Stationsdienst, keine Schlafunterbrechungen?\"",
  "„Nein.\"",
  "Fehr notierte. Er ließ eine Pause, die nicht lang genug war, um unhöflich zu wirken, aber lang genug, um Cords Atmung hörbar zu machen. Gleichmäßig. Nasenatmung. Vier, vier.",
  "„Ich möchte zwischendurch etwas aus den Stationsakten klären.\" Er blätterte, ohne etwas zu suchen. „Der Pflegedienstleiter hat notiert, dass ein Mitpatient, ein Herr Weidmann, im Herbst einen Konflikt mit Ihnen hatte.\"",
  "Er sprach den Namen im selben Tonfall wie den Wochentag. Er sah nicht auf.",
  "Cord antwortete nicht.",
  "Fehr hob den Blick. Cord saß wie vorher. Der Blick auf eine Stelle zwischen Fehrs Schlüsselbein und dem oberen Rand der Aktendeckelkante. Sein Gesicht bewegte sich nicht. Kein Blinzeln. Eine Sekunde, vielleicht anderthalb. Dann, sehr leicht, eine Bewegung im rechten Mundwinkel. Keine Regung des Erkennens. Eher das Registrieren, dass etwas ins Wasser gefallen war, ohne die Richtung der Ringe zu beachten.",
  "„Ich habe dazu keine Wahrnehmung\", sagte Cord.",
  "„Das ist in Ordnung. Die Notiz ist ohnehin knapp.\" Fehr blätterte weiter. Er spürte, dass er zu schnell blätterte. „Für mich ist eher relevant, wie Sie solche Situationen heute im Vergleich zu früher regulieren. Ob Sie, anders gesagt, in einer Reizsituation Strategien einsetzen, die Sie in der Therapie erarbeitet haben. Das wäre ein Marker, an dem sich die Frage einer Lockerung fachlich festmachen ließe, und zwar einer ersten, kontrollierten Lockerung, im Sinne der Stufenlogik.\"",
  "Er hörte den Satz, während er noch im Satz war. Zu lang. Zu viel „fachlich“. Das Wort „einer“ angehängt wie eine Korrektur, die keiner verlangt hatte, und danach noch die Stufenlogik, die hier niemand zur Sprache gebracht hatte.",
  "Cord sah ihn jetzt an.",
  "„Ich kann Strategien benennen\", sagte er. „Stimuluskontrolle. Distanz. Verzögerung. Wenn Sie das hören wollen.\"",
  "„Ich möchte, dass Sie beschreiben, nicht aufzählen.\"",
  "„Dann beschreibe ich. Ich stehe auf, gehe zum Fenster, zähle bis zwanzig, gehe zurück. Ich spreche den Pfleger an, wenn es länger dauert. Ich melde mich zur Einzelstunde, wenn es häufiger vorkommt. Das ist, was ich tue.\"",
  "„Und in welcher Frequenz kommt das vor?\"",
  "„Selten.\"",
  "„Selten ist kein Wert.\"",
  "„Dreimal in den letzten zwölf Monaten. Dokumentiert.\"",
  "Fehr schrieb. Seine Hand war ruhig. Seine Sätze nicht. Er merkte, dass er nach der nächsten Frage griff wie nach einem Haltegriff in einem Bus, der zu scharf bremst.",
  "„Sie wissen, dass ich Ihre Akte nicht vollständig neu bewerte. Ich schließe an Vorbefunde an, ich gleiche ab, ich prüfe, ob die damaligen Einschätzungen heute noch tragen. Das ist das Mandat. Ich sage Ihnen das, damit Sie einordnen können, warum ich bestimmte Fragen wiederhole, obwohl sie schon mehrfach gestellt worden sind. Es geht nicht darum, frühere Kolleginnen und Kollegen zu korrigieren. Es geht darum, dass eine Prognose nur so weit trägt, wie sie selbst neu verantwortet wird.\"",
  "Er hatte nicht vorgehabt, das zu sagen. Der Satz lag nun offen auf dem Tisch, wie ein Gegenstand, den er aus seiner eigenen Tasche gezogen hatte, ohne sich daran zu erinnern, ihn eingepackt zu haben.",
  "Cord nickte langsam. Er hielt die Pause. Er atmete einmal tiefer ein als vorher, nicht lauter, nur tiefer. Dann lehnte er sich eine Daumenbreite zurück.",
  "„Sie prüfen mich\", sagte er, „als hätte jemand anderes Ihre Unterschrift getragen.\"",
  "Fehr hielt den Stift über dem Blatt. Er notierte nicht. Er notierte auch nicht, dass er nicht notierte.",
  "Die Neonröhre summte. Draußen, im Flur, zog jemand einen Wagen mit Frühstücksgeschirr vorbei. Räder über Fugen. Glas auf Metall. Der Chlorgeruch hatte sich oben am Fenster gesammelt. Fehr spürte ihn hinten am Gaumen, trocken, leicht metallisch. Seine Augen brannten. Er zählte die Sekunden, bis er sprach. Er wollte nicht zu schnell sprechen, und er wollte nicht zu lange schweigen. Jedes Maß wäre eine Antwort gewesen.",
  "„Bleiben wir bei der Tagesstruktur\", sagte er. Seine Stimme war wieder kürzer. „Heute Nachmittag. Arbeitsbereich. Wie sieht der vor?\"",
  "„Wäscherei, 14:00 bis 16:00 Uhr. Danach Einzelstunde bei Frau Kröger, 16:30 Uhr.\"",
  "„Welche Maschine?\"",
  "„Mangel zwei.\"",
  "„Gleicher Bereich wie letzte Woche?\"",
  "„Ja.\"",
  "„Gleicher Partner?\"",
  "„Ja.\"",
  "„Danke.\"",
  "„Bitte.\"",
  "Fehr sah auf die Uhr über der Tür. 10:04 Uhr. Er hatte für die Sitzung fünfundvierzig Minuten angesetzt. Er würde sie nicht abbrechen. Er würde sie führen bis zum regulären Ende.",
  "„Haben Sie Fragen zum weiteren Vorgehen?\"",
  "„Nein.\"",
  "„Wünsche, was die Sitzungsdichte betrifft?\"",
  "„Ich richte mich nach Ihrem Zeitplan.\"",
  "„Das ist kein Wunsch.\"",
  "„Das ist die richtige Antwort.\"",
  "Fehr legte den Stift flach neben das Blatt. Er ließ die Hand einen Moment darauf liegen.",
  "„Dann hören wir hier auf.\"",
  "Cord stand nicht sofort auf. Er wartete, bis Fehr das Aufnahmegerät angehalten hatte. Dann erst schob er den Stuhl, nicht laut, und ließ sich vom Pfleger abholen, der vor der Tür gewartet hatte, ohne anzuklopfen.",
  "Fehr blieb sitzen. Er hörte die Schritte den Flur hinunter, den kurzen Gruß, das Klicken der Stationstür. Er schrieb das Protokoll zu Ende. Abschlusszeit. Verlauf unauffällig. Kooperationsverhalten formal gegeben. Sprachliches Niveau stabil. Keine Auffälligkeiten im Reaktionsspektrum bezüglich eingeführter Kontrollstimuli. Er schrieb den letzten Satz so, wie er ihn seit achtzehn Jahren schrieb, mit derselben Wortwahl, die in seinen Vorgutachten stand, und unterzeichnete auf der vorgesehenen Linie.",
  "Er schloss die Akte. Er blieb noch sitzen. Die Neonröhre summte unverändert. Irgendwo zwei Türen weiter lachte jemand kurz, einsilbig, und hörte wieder auf.",
  "Dann, erst dann, zog er aus der Innentasche seines Sakkos ein kleines, schwarz gebundenes Heft. Nicht dienstlich. Kein Aufdruck. Ein Bleistift im Gummizug. Er schlug eine leere Seite auf. Er schrieb nicht viel. Er schrieb in kleinen, schrägen Buchstaben, die er von seinen eigenen Akten her nicht kannte, die nicht zu seiner Handschrift passten, die eher aus der Zeit vor den Akten stammten, als er Skizzen in Seminarblöcke gemacht hatte.",
  "Er führt nicht. Er folgt.",
  "Er sah den Satz an. Er strich ihn nicht durch. Er setzte auch keinen Punkt dahinter, der nicht schon da gewesen wäre. Er schloss das Heft, führte es zurück in die Innentasche, prüfte mit dem Daumen, ob der Stoff sauber über den Rand fiel, und stand auf.",
  "Der Stuhl ihm gegenüber war leer. Auf der Sitzfläche lag ein feiner, heller Abdruck, wo Cords Handrücken aufgelegen hatte, Staub aus der Wäscherei vermutlich, oder nichts, oder das Licht. Fehr sah einen Moment darauf. Dann nahm er die Akte.",
  "Auf dem Flur, Richtung Pförtnerloge, ging ihm auf, dass er den Namen Weidmann in keiner Zeile des Dienstprotokolls vermerkt hatte. Er blieb kurz stehen, die Hand schon an der Innentasche, und ging weiter."
];

export default function RestrisikoSamplePage() {
  return (
    <main className="reader-shell sample-reader">
      <header className="reader-topbar sample-reader__topbar">
        <div>
          <p className="reader-eyebrow">EMBER Leseprobe</p>
          <h1>Restrisiko</h1>
          <p>Szenen 1 bis 4 sind live. Die Leseprobe wird fortlaufend ergänzt.</p>
        </div>
        <div className="reader-actions">
          <Link href="/" className="landing-button">
            Store öffnen
          </Link>
          <Link href="/studio" className="landing-button">
            Zurück ins Studio
          </Link>
        </div>
      </header>

      <article className="sample-reader__article">
        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 1</p>
          <h2>Die Unterschrift</h2>
          <p>
            Forensischer Druck, institutionelle Kälte und die alte Fehlprognose im
            Rücken: Fehr nimmt den Cord-Fall an und merkt schon auf dem Weg in die Klinik,
            dass der Auftrag nicht neutral bleiben wird.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneOneParagraphs.map(function (paragraph, i) {
            return <p key={`s1-p-${i}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 2</p>
          <h2>Sitzung 1 — 10:05 Uhr</h2>
          <p>
            Das erste Aufeinandertreffen in Hohenhort. Elias Cord zeigt eine 
            beängstigende Reflexionsgabe, die Fehrs professionelle Distanz 
            vom ersten Moment an untergräbt.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneTwoParagraphs.map(function (paragraph, i) {
            return <p key={`s2-p-${i}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 3</p>
          <h2>Die Anwalts-Akte</h2>
          <p>
            Der Druck von außen wird konkret: Ein Anwalts-Dossier konfrontiert 
            Fehr mit seinen eigenen Fehlern der Vergangenheit – und seine Tochter 
            Lea stellt die alles entscheidende Frage nach der Verantwortung.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneThreeParagraphs.map(function (paragraph, i) {
            return <p key={`s3-p-${i}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 4</p>
          <h2>Sitzung 2 — Der Weidmann-Stimulus</h2>
          <p>
            Fehr versucht, Cord mit dem Namen „Weidmann“ aus der Reserve zu locken. 
            Doch Cord reagiert mit einer Stille, die Fehr mehr über seine eigene 
            Unterschrift verrät, als ihm lieb ist.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneFourParagraphs.map(function (paragraph, i) {
            return <p key={`s4-p-${i}`}>{paragraph}</p>;
          })}
        </section>

        <section className="sample-reader__divider">
          <p className="reader-eyebrow">Fortsetzung folgt</p>
          <h3>Szene 5</h3>
          <p>
            Die Leseprobe endet hier vorerst. Im EMBER Studio kannst du den 
            weiteren Verlauf der Geschichte gestalten.
          </p>
        </section>
      </article>
    </main>
  );
}
