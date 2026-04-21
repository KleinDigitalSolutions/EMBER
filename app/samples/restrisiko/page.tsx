import Link from "next/link";

const sceneOneParagraphs = [
  "Der Beschluss lag ganz oben auf dem Stapel. Kopie, drei geheftete Seiten, das Deckblatt gelocht wie immer, wenn Rauschs Büro die Post vorbereitet hatte. Fehr las nur die erste Zeile. In der Unterbringungssache Elias Cord.",
  "Er legte die Hand flach auf das Papier, als müsste er es festhalten. Draußen, hinter dem Kanzleifenster, zog jemand einen Rollkoffer über das Kopfsteinpflaster, und das Geräusch kam verzögert an, als wäre das Glas dicker als gestern. Fehr rückte den Stapel gerade. Dann noch einmal. Er merkte es beim zweiten Mal und ließ die Hand sinken.",
  "Er blieb an seinem Schreibtisch stehen, ohne sich zu setzen. Auf dem Flur klapperte Frau Ulrich mit der Kaffeedose. Der Kalender zeigte Dienstag, 07:40 Uhr, und unter dem Datumsfeld klebte noch der gelbe Zettel mit Lenas Zahnarzttermin, den er vor zwei Wochen versprochen hatte zu übernehmen. Er hatte ihn nicht übernommen. Er zog den Zettel ab, legte ihn in die obere Schublade und schob sie zu, bevor er das Deckblatt umschlug.",
  "Externes Sachverständigengutachten. Legalprognose gemäß § 67d StGB. Frage nach unbegleiteten Lockerungen. Fehr las den Paragrafen, als stünde er zum ersten Mal darin. Er las die Besetzung der Kammer. Er las den Namen darunter noch einmal. Cord, Elias, geboren 1966. Achtzehn Jahre. Fünf Taten. Eine Nummer, unter der das Land in den Neunzigern aufgehört hatte, bei Fernsehbildern wegzuschauen.",
  "Er bemerkte, dass er den Atem seit einer halben Minute flacher führte. Er bemerkte es, weil er den Kaffee, den Frau Ulrich vor einer Stunde gebracht hatte, jetzt kalt im Glas sah und ihn trotzdem nicht anfasste. Der Name war keine Überraschung. Rausch hatte vor vier Tagen eine Mail geschrieben, zwei Zeilen, Wäre ein Mandat denkbar, Details folgen schriftlich. Er hatte ja geantwortet, ohne zu fragen, worum es ging. Er hatte es damals für Routine gehalten. Er hielt es auch jetzt dafür, solange er den Satz innen wiederholte.",
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
  "„Sechs Uhr. Frühstück um halb sieben. Arbeit in der Buchbinderei ab acht. Mittagessen zwölf. Gruppentherapie dienstags und donnerstags, vierzehn Uhr. Einzelgespräche bei Dr. Mende mittwochs um zehn. Sport montags und freitags. Zurück auf Station achtzehn Uhr. Licht aus zweiundzwanzig Uhr.\"",
  "„Und heute?\"",
  "„Heute ist Dienstag. Heute ist die Gruppe ausgefallen, weil Sie da sind.\"",
  "Fehr notierte. „Medikation?\"",
  "„Sertralin, fünfzig, morgens. Seit elf Jahren unverändert. Nebenwirkungen keine, die ich nicht einordnen könnte.\"",
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
  "„Herr Cord, ich stelle Ihnen jetzt eine Frage, bei der die Antwort weniger zählt als das, was davor passiert. Stellen Sie sich die zweite Frau vor, Name in der Akte. Sie liegt auf dem Boden. Sie leben noch. Was tun Sie in den folgenden neunzig Sekunden?\"",
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

export default function RestrisikoSamplePage() {
  return (
    <main className="reader-shell sample-reader">
      <header className="reader-topbar sample-reader__topbar">
        <div>
          <p className="reader-eyebrow">EMBER Leseprobe</p>
          <h1>Restrisiko</h1>
          <p>Szene 1 & 2 sind live. Die Leseprobe wird fortlaufend ergänzt.</p>
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

        <section className="sample-reader__divider">
          <p className="reader-eyebrow">Fortsetzung folgt</p>
          <h3>Szene 3</h3>
          <p>
            Die Leseprobe endet hier vorerst. Im EMBER Studio kannst du den 
            weiteren Verlauf der Geschichte gestalten.
          </p>
        </section>
      </article>
    </main>
  );
}
