import Link from "next/link";

const sceneOneParagraphs = [
  "Um 16:18 Uhr hatte Eva elf Minuten zwischen dem Call mit der Kanzlei Hoffmann und dem internen Review. Sie wusste es, weil sie immer wusste, wie viel Zeit zwischen zwei Dingen lag. Sie trank einen Schluck aus der Flasche neben der Tastatur, öffnete mit dem Daumen die Kita-App und scrollte, ohne darüber nachzudenken. Das war Routine. Montag der Zettel für die Ausflugswoche, Mittwoch die Obstliste, donnerstags manchmal ein Foto vom Morgenkreis.",
  "Heute stand ganz oben ein Eintrag, den sie zuerst nicht zuordnete.",
  "*Mila Berger – abgeholt: 15:42 Uhr – durch: Eva Berger (Mutter) – Datum: gestern.*",
  "Eva las es zweimal. Sie las es ein drittes Mal. Dann lachte sie kurz, einsilbig, und schüttelte den Kopf in Richtung ihres leeren Büros.",
  "Gestern war Montag gewesen. Montag war Simons Tag. Montag holte Simon Mila ab, brachte sie zu sich, gab ihr Pasta mit zu viel Butter und schickte um halb acht ein Foto, auf dem Mila in seinem Bademantel schwamm. Eva hatte das Foto. Sie hatte es sich gestern Abend zweimal angesehen, weil Mila darin so zufrieden ausgesehen hatte, dass Eva es einen Moment lang gebraucht hatte, um nicht eifersüchtig zu sein auf diese Zufriedenheit.",
  "Sie war nicht in der Kita gewesen. Nicht um 15:42 Uhr. Nicht um irgendeine Uhrzeit.",
  "App-Fehler, dachte sie. Verspätetes Sync, ein doppelt abgelegter Datensatz, ein automatisches Vorausfüllen aus dem letzten Freitag. Solche Dinge passierten. Sie hatte in Projekten schon schlimmere Daten-Geister gesehen und immer war am Ende jemand da gewesen, der einfach das falsche Feld angeklickt hatte.",
  "Sie wählte die Nummer der Kita.",
  "„Sonnengarten, Loewen.“",
  "„Petra, Eva Berger. Entschuldigen Sie die Störung. In der App ist gerade ein Eintrag aufgetaucht, der nicht stimmt. Es steht drin, ich hätte Mila gestern abgeholt, um 15:42 Uhr. Das ist nicht so. Gestern war Simons Tag. Können Sie das bitte rausnehmen?“",
  "Am anderen Ende wurde es nicht still im Sinne von Unsicherheit, sondern still im Sinne von jemandem, der auf einen Bildschirm schaut.",
  "„Frau Berger, einen Moment.“",
  "Eva hörte Tastatur, ein Kind, das im Hintergrund nach Pflastern fragte, Petras ruhige Antwort nach rechts. Dann kam Petra wieder.",
  "„Der Eintrag ist korrekt dokumentiert. 15:42 Uhr, Abholung durch Sie. Es gibt eine Unterschrift auf der Liste.“",
  "„Das kann nicht sein.“",
  "„Der Vorgang steht bei uns im System und auf Papier. Möchten Sie kurz vorbeikommen?“",
  "Petra sagte es wie immer. Freundlich, geordnet, ohne jede Beunruhigung. Kein *vielleicht*. Kein *wir prüfen das noch einmal*. Sie sagte es wie jemand, der eine Rechnung bestätigt.",
  "„Ich komme jetzt.“",
  "Eva legte auf, ohne sich zu verabschieden. Sie stand auf, nahm den Mantel vom Haken, schrieb Marianne zwei Zeilen, dass sie das Review verschieben müsse, Familie, kurz. Sie schickte die Nachricht, bevor sie nachdachte, ob *Familie* das richtige Wort war für etwas, das sie nicht benennen konnte.",
  "Im Auto merkte sie, dass ihre Hände zu trocken waren. Sie fuhr zu schnell den Ring hinunter, bremste an der Ampel am Krankenhaus, und während sie wartete, ging sie die Nachrichten von gestern durch. Simons Foto, 19:33 Uhr. Ihre Antwort, 19:35, zwei Herzen, ein *gute Nacht ihr zwei*. Der Kalendereintrag: *Mila bei Simon*. Keine Lücke, kein Loch. Sie wusste, wo sie gestern um 15:42 Uhr gewesen war. Im Konferenzraum zwei, Quartalsgespräch, sechs Personen, ein Glas Wasser vor sich, das sie nicht angerührt hatte. Sie hätte es auf der Stelle beweisen können.",
  "Der Gedanke *ich kann das beweisen* beruhigte sie für ungefähr zwei Sekunden. Dann wurde ihr klar, dass sie etwas beweisen musste, was sie nicht getan hatte. Das war kein angenehmer Platz.",
  "Die Kita lag am Ende einer Wohnstraße, hinter einer niedrigen Hecke, das Schild aus Holz, der Eingang mit dem bunten Klingelschild, das Mila vor zwei Jahren mit ausgesucht hatte. Eva parkte halb auf dem Bordstein, stieg aus, klingelte. Der Summer ging.",
  "Petra stand schon im Flur. Sie hatte die Brille auf der Nase, die sie nur aufsetzte, wenn sie am Bildschirm las. Im Arm eine Kladde.",
  "„Frau Berger.“",
  "„Zeigen Sie es mir.“",
  "Petra nickte, ohne sich zu rechtfertigen, und führte sie ins Büro neben der Garderobe. Auf dem Schreibtisch lag die Abholliste aufgeschlagen. Montag. Eva sah ihren Namen sofort, zweimal. *Eva Berger*, einmal gedruckt in der Zeile, einmal daneben unterschrieben. Die Unterschrift war nicht exakt ihre. Aber sie war auch nicht exakt nicht ihre. Der Bogen im E, die Art, wie das g nach unten hing, die kleine Rechtsneigung am Schluss. Jemand, der ihre Unterschrift schon öfter gesehen hatte. Jemand, der sich die Zeit genommen hatte, sie zu sehen.",
  "„Das bin ich nicht.“",
  "Petra sagte nichts. Sie drehte den Monitor zu Eva.",
  "„Wir haben die Kamera am Eingang. Sie wissen das. Ich habe eben den Ausschnitt zurückgesucht, damit Sie es sehen. 15:41, 15:42.“",
  "Sie klickte. Das Bild stand still. Es war keine Bewegung darauf. Es war eine Frau im Flur, halb zur Kamera gedreht, den Arm nach Mila ausgestreckt, die aus der Garderobe kam. Die Frau trug einen dunkelblauen Wollmantel, mittig gegürtet, zwei schmale Knöpfe am Bund. Eva kannte diesen Mantel. Sie kannte ihn sehr genau. Sie hatte ihn heute Morgen am Haken im Flur hängen sehen, bevor sie den anderen, den grauen, genommen hatte, weil es regnete.",
  "Die Haare der Frau waren zurückgebunden wie Evas. Die Haltung war Evas Haltung, dieses leichte Durchdrücken im Kreuz, das sie sich abgewöhnen wollte und nie abgewöhnte. Der Kopf war genau so weit gesenkt, wie Eva ihn senkte, wenn sie Mila ansah, nicht ganz auf Augenhöhe, ein bisschen zu hoch, weil Eva nie richtig lernte, sich zu Kindern hinunterzubeugen.",
  "„Das bin –“, sagte Eva, und es kam halb raus, bevor sie es stoppen konnte.",
  "Sie starrte das Bild an. Eine Sekunde. Zwei.",
  "Sie erkannte sich.",
  "Dann, wie jemand, der in kaltes Wasser greift, erkannte sie sich nicht mehr. Der Mund war anders. Der Mund war zu schmal. Oder vielleicht war er nicht zu schmal, sondern nur nicht lächelnd, und sie kannte ihr eigenes Gesicht hauptsächlich aus Momenten, in denen sie sich im Spiegel zum Lächeln zwang, bevor sie das Haus verließ. Das Bild war unscharf, stand still, und ihr eigenes Gesicht war plötzlich nicht mehr etwas, das sie von innen kannte, sondern etwas, das sie auf einem Monitor überprüfen musste.",
  "„Frau Berger.“ Petras Stimme war nicht unfreundlich. „Das sind Sie doch.“",
  "Es war keine Frage. Es war eine Feststellung, bei der man höflich Raum für Zustimmung ließ.",
  "Eva öffnete den Mund und schloss ihn wieder. Sie versuchte, etwas Praktisches zu sagen, etwas, das die Situation wieder in verhandelbare Form brachte. *Wo ist Mila jetzt.* Das wäre die richtige Frage gewesen. Aber Mila war natürlich da, hinten im Gruppenraum, sie hörte sogar ihre Stimme durch die Tür, ein *Nein, das war meins*, empört, gesund, sechs Jahre alt. Mila war nicht das Problem.",
  "Im Flur lachte ein Kind. Draußen fuhr ein Auto an. In der Tasche vibrierte die App mit einer Erinnerung an das Meeting, das sie nicht mehr halten würde.",
  "„Wer hat sie denn abgeholt?“, fragte Eva endlich, und es war keine gute Frage, weil Petra die Antwort schon gegeben hatte und nur geduldig wiederholen würde, was auf dem Papier stand.",
  "„Sie, Frau Berger.“ Petra sagte es nicht vorwurfsvoll. Sie sagte es so, wie man jemandem, der offensichtlich einen schlechten Tag hat, den Weg zum Ausgang erklärt. „Mila ist dann heute morgen wieder ganz normal gebracht worden. Von Herrn Berger. Es war alles unauffällig. Deshalb habe ich ja nicht eher nachgefragt.“",
  "Eva nickte. Sie nickte, weil ihr Körper etwas tun musste. Ihre Hand lag auf dem Schreibtisch neben der Kladde, und sie sah, dass ihre Finger zitterten, nicht viel, aber sichtbar, und sie zog die Hand zurück, bevor Petra es auch sehen konnte.",
  "„Ich möchte die Aufnahme haben“, sagte sie. „Den Ausschnitt. Und eine Kopie der Liste.“",
  "Petra zögerte, eine halbe Sekunde, in der Eva genau wusste, was sie dachte. *Warum braucht eine Mutter einen Beweis dafür, dass sie ihr eigenes Kind abgeholt hat.* Dann nickte Petra professionell.",
  "„Das klären wir. Ich spreche kurz mit der Leitung.“",
  "Sie ging. Die Tür fiel leise hinter ihr zu. Eva blieb mit dem Standbild allein.",
  "Sie trat näher an den Monitor heran. Sie sah sich die Frau an. Den Mantel. Die Hand. Die Hand war nicht ihre Hand. Die Hand war nah genug, dass Eva es hätte wissen müssen, aber der Winkel war falsch, der Ring am falschen Finger, oder kein Ring, sie konnte es nicht erkennen.",
  "Sie wusste zwei Dinge gleichzeitig, und beide stimmten nicht zusammen.",
  "Sie war gestern nicht hier gewesen.",
  "Und auf dem Bildschirm stand sie im Flur und streckte den Arm nach ihrer Tochter aus.",
  "Hinter der Tür, im Gruppenraum, rief Mila etwas, das wie *meine* klang, und Eva stellte fest, dass sie die Luft anhielt, als würde das Kind durch diese eine Silbe bestätigen, wem es gehörte."
];

const sceneTwoParagraphs = [
  "Das Leitungsbüro roch nach kaltem Kaffee und dem Klebstoff der Kinderplakate an den Wänden. Petra Wendt schloss die Tür, nicht hart, nur bestimmt, und deutete auf den Stuhl vor dem Schreibtisch. Sechzehn Uhr zweiundvierzig stand auf der kleinen Digitaluhr neben dem Monitor. Eva registrierte die Zahl, weil sie in diesem Moment jedes Detail registrierte, als könnte eine einzelne Beobachtung das Ganze zurück in Ordnung bringen.",
  "„Setz dich, Eva. Ich zeig dir alles, was wir haben.\"",
  "Petra war keine Frau, die man beschuldigen konnte, ohne danach selbst klein auszusehen. Sie trug denselben olivgrünen Cardigan wie immer, die Lesebrille an der Kordel, und sie sprach so, wie sie mit Müttern sprach, die zu spät kamen: freundlich, langsam, ohne Vorwurf. Genau das machte es schlimmer. Eva hätte Feindseligkeit leichter zersetzt als diese ruhige Verwaltungshöflichkeit, die keine Angriffsfläche bot.",
  "Der Laptop klappte auf, der Lüfter summte. Petra drehte den Bildschirm zu Eva, öffnete einen Ordner, klickte. Ein Standbild. Die Kameraperspektive über der Eingangstür, schräg von oben, Fischaugenverzerrung an den Rändern.",
  "„Das ist gestern, fünfzehn Uhr einundvierzig.\"",
  "Petra drückte Play.",
  "Eva sah sich selbst aus der Tür kommen. So fühlte es sich in der ersten Sekunde an. Dunkler Wollmantel, den Eva seit drei Wintern trug. Die Kapuze halb hoch, weil es geregnet hatte. Die Frau bewegte sich, wie Eva sich bewegte, wenn sie in Eile war: Schultern leicht eingezogen, rechte Hand in der Manteltasche, linke an Milas Handgelenk. Mila trottete neben ihr, den Kopf unten.",
  "„Das bin ich nicht.\" Eva hörte, wie ihre Stimme zu schnell kam. Sie zwang sie langsamer. „Das ist jemand, der ungefähr so groß ist wie ich. Mit einem ähnlichen Mantel. Mehr nicht.\"",
  "Petra sagte nichts. Sie ließ das Video laufen.",
  "Die Frau blieb an der Garderobentür stehen, beugte sich zu Mila runter, richtete ihr etwas am Kragen. Es war die Bewegung einer Mutter, nicht die einer Frau, die ein fremdes Kind abholt. Eva versuchte, den Gesichtsausschnitt zu finden. Die Kapuze, der Winkel, die Auflösung, alles arbeitete gegen eine klare Identifikation. Ein Profil, ein Stück Wange, die Andeutung eines Mundes. Nichts, worauf man zeigen und sagen konnte: das ist sie nicht.",
  "„Spul vor\", sagte Eva. „Zum Ausgang. Da muss sie in die Kamera schauen.\"",
  "„Das tut sie nicht.\" Petras Stimme war sanft. „Sie hat die Kapuze die ganze Zeit halb oben.\"",
  "„Eben. Wer macht das, wenn er nichts zu verbergen hat.\"",
  "„Eva.\" Petra lehnte sich zurück. „Gestern hat es in Strömen geregnet. Alle hatten die Kapuzen auf.\"",
  "Das Video lief weiter. Die Frau richtete sich auf, nahm Milas Rucksack, und dann sah Eva es. In der rechten Hand, jetzt aus der Tasche gezogen, hielt die Frau einen gelben Trinkbecher. Milas Trinkbecher. Die Delle an der Seite, die seit dem Sommer dort war, als Mila ihn aus dem Kinderwagen geworfen hatte. Eva hatte diesen Becher gestern früh selbst gespült und in Milas Tasche gesteckt.",
  "Sie spürte, wie ihr etwas in den Magen rutschte. Nicht Angst. Etwas Kälteres.",
  "„Das ist Milas Becher.\"",
  "„Ja.\"",
  "„Den hat sie ihr nicht irgendwo gekauft. Den hat sie aus ihrer Tasche genommen.\"",
  "„Das habe ich auch gesehen.\" Petra machte eine Pause. „Oder das Kind hat ihn ihr gegeben. Kinder tun das, wenn sie jemandem vertrauen.\"",
  "Eva öffnete den Mund und schloss ihn wieder. Jede Antwort, die ihr einfiel, klang in ihrem Kopf schon nervös, bevor sie draußen war.",
  "Petra klickte auf ein zweites Fenster. Ein eingescanntes Blatt erschien, das Abholformular, das die Kita bei unregelmäßigen Zeiten verwendete. Oben das Datum, darunter Milas Name, die Uhrzeit, fünfzehn Uhr einundvierzig, und unten eine Unterschrift.",
  "Eva beugte sich vor.",
  "Es war ihre Unterschrift. Nicht genau. Der Schwung am E war zu flach, das abschließende r zu offen. Aber sie war nah genug, dass Eva verstand, warum niemand nachgefragt hatte. Sie selbst hätte diese Unterschrift in Eile unterzeichnet und nicht gemerkt, dass jemand anderes sie nachgezogen hatte.",
  "„Das ist nicht meine Hand.\"",
  "„Sie ist deiner sehr ähnlich.\"",
  "„Sie ist nicht meine.\"",
  "Petra nickte, als hätte sie diesen Satz erwartet. Sie sagte nicht, dass sie Eva glaubte. Sie sagte nichts dagegen. Sie ließ den Satz nur im Raum stehen, und dadurch wurde er dünner, als Eva es sich geleistet hätte.",
  "„Anja hat sie gegengezeichnet\", sagte Petra. „Sie hatte keinen Grund, misstrauisch zu sein. Mila hat die Frau nicht als fremd behandelt. Sie hat ihre Jacke geholt, ihre Schuhe angezogen, ist mitgegangen.\"",
  "„Mila ist sechs. Mila geht mit jedem mit, der freundlich lächelt.\"",
  "„Das stimmt nicht, Eva. Mila geht nicht mit jedem mit.\"",
  "Es war der erste Satz, in dem Petra eine Grenze zog, und sie zog sie sehr leise.",
  "Eva versuchte zu atmen. „Und die Jacke\", sagte sie, „die rote mit dem Reh. Die ist heute morgen nicht im Schrank gewesen.\"",
  "„Nein. Die ist gestern mit Mila gegangen. Sie hing heute früh auch nicht im Garderobenfach.\" Petra sah sie an. „Wir haben nachgesehen, als du angerufen hast.\"",
  "Eva dachte an Milas Garderobenhaken. Sie hatte heute früh den Haken gesehen. Sie hatte die Jacke nicht gesucht, weil Mila eine andere anhatte, die dünne mit den Sternen, weil es milder war. Sie hatte nicht registriert, dass die rote fehlte. Sie hatte es nicht registriert, weil sie es nicht registrieren musste, weil gestern ein normaler Tag gewesen war, an dem sie Mila nicht abgeholt hatte, weil ihr Termin erst um siebzehn Uhr geendet hatte, und deshalb –",
  "Sie merkte, dass sie den Gedanken nicht laut aussprach. Jeder Satz, der mit „weil\" anfing, würde jetzt nach Rechtfertigung klingen. Und jede Rechtfertigung bestätigte, dass sie etwas zu rechtfertigen hatte.",
  "Petra schloss den Laptop nicht. Sie ließ ihn offen stehen, mit dem Standbild der Frau und dem Becher, als sei das jetzt der Hintergrund jedes weiteren Gesprächs.",
  "„Eva, ich muss dich etwas fragen, und ich stelle die Frage nicht, um dich zu verletzen.\" Sie atmete einmal durch. „Ruf Simon an. Heute Abend. Sag ihm, was passiert ist, bevor wir es tun müssen.\"",
  "„Ihr wollt ihn anrufen.\"",
  "„Wir müssen es melden, wenn wir einen Vorgang nicht erklären können. Das weißt du.\" Petra hob leicht die Hand, als wolle sie jede Schärfe aus dem Raum nehmen. „Ich gebe dir den Abend. Ich gebe ihn dir, weil ich dich kenne und weil ich Mila kenne. Aber morgen früh, wenn du nicht mit ihm gesprochen hast, rufe ich an.\"",
  "Es war keine Drohung. Eva wünschte, es wäre eine gewesen. Eine Drohung hätte sie kontern können. Das hier war etwas anderes: ein letzter Weg, den Petra ihr offenließ, und das Angebot selbst war der Beweis, dass Petra sie auf dem Weg in etwas sah, was Kita-Leiterinnen sonst erst am Ende eines anderen Gesprächs aussprachen.",
  "Eva hörte ihr Handy vibrieren. Sie sah nicht hin. Sie sah Petra an, und Petra sah zurück, ruhig, nicht unfreundlich, und das war das Schlimmste. Wäre Petra kalt gewesen, hätte Eva eine Front gehabt, gegen die sie sich lehnen konnte. So lehnte sie gegen Luft.",
  "„Ich war nicht hier, Petra.\"",
  "„Ich weiß, was du sagst.\"",
  "„Das ist nicht dasselbe, wie mir zu glauben.\"",
  "„Nein.\" Petra nickte, als sei das ein Satz, den sie selbst gesucht hätte. „Das ist es nicht.\"",
  "Eva stand auf, zu früh, zu abrupt. Der Stuhl rutschte einen halben Zentimeter zurück. Sie registrierte das Geräusch, wie sie vorhin die Uhr registriert hatte. Ihr Körper war seit einer halben Stunde schneller als ihr Kopf, und sie wusste, dass genau das sie teuer zu stehen kommen würde, wenn sie nicht gleich stehen blieb.",
  "Sie setzte sich wieder.",
  "„Gib mir bis morgen früh.\"",
  "„Das habe ich gerade.\"",
  "Dann blickte Eva doch auf das Display. Eine Nachricht von Nora. *Bei dir alles okay? Du wolltest doch um fünf bei mir sein.*",
  "Eva las den Satz zweimal. Sie hatte Nora heute nichts von fünf Uhr gesagt. Sie hatte heute überhaupt nichts mit Nora abgesprochen. Sie steckte das Handy langsam zurück in die Tasche, als könnte sie durch die Bewegung den Satz wieder aus der Welt schieben, und wusste, während sie es tat, dass das nicht ging.",
  "Petra sah sie an, wartend, höflich, mit dem ruhigen Abstand einer Frau, die gelernt hatte, Müttern Zeit zu lassen, bevor sie das Nötige taten.",
  "„Ich rufe Simon an\", sagte Eva. Ihre Stimme klang fremd in ihren eigenen Ohren. „Heute Abend.\"",
  "„Danke.\" Petra klappte den Laptop jetzt doch zu, sanft, als sei darin etwas Zerbrechliches. „Fahr vorsichtig.\"",
  "Eva ging zur Tür. Die Uhr neben dem Monitor zeigte sechzehn Uhr siebenundfünfzig. In fünfzehn Minuten war alles, was sie sich unter ihrem Leben vorgestellt hatte, kleiner geworden, und das Einzige, was in ihrer Manteltasche schwerer wog als vorher, war ein Telefon, auf dem eine Nachricht lag, die sie sich nicht erklären konnte."
];

export default function DieFalscheAbholungSamplePage() {
  return (
    <main className="reader-shell sample-reader">
      <header className="reader-topbar sample-reader__topbar">
        <div>
          <p className="reader-eyebrow">EMBER Leseprobe</p>
          <h1>Die falsche Abholung</h1>
          <p>Szenen 1 bis 2 sind live. Die Leseprobe wird fortlaufend ergänzt.</p>
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
          <h2>Gestern</h2>
          <p>
            Eine verspätete Meldung in der Kita-App kippt Evas Alltag in wenigen Minuten
            aus der Bahn: Laut System hat sie ihre Tochter am Vortag selbst abgeholt.
            App, Liste und Kamera sprechen gegen sie, obwohl sie sicher weiß, nie dort
            gewesen zu sein.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneOneParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s1-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 2</p>
          <h2>Das Bild</h2>
          <p>
            Petra zeigt Eva die Videoaufnahme, die Unterschrift und den gelben Becher
            in der falschen Hand. Was wie ein App-Fehler begann, kippt endgültig in
            ein dokumentiertes Glaubwürdigkeitsproblem.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneTwoParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s2-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <section className="sample-reader__divider">
          <p className="reader-eyebrow">Fortsetzung folgt</p>
          <h3>Szene 3</h3>
          <p>
            Die Leseprobe endet hier vorerst. Im EMBER Studio kannst du den weiteren
            Verlauf der Geschichte entwickeln.
          </p>
        </section>
      </article>
    </main>
  );
}
