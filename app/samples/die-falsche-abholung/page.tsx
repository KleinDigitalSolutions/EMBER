import Link from "next/link";

const sceneOneParagraphs = [
  "Um 16:18 Uhr hatte Eva elf Minuten zwischen dem Gespräch mit der Kanzlei Hoffmann und der internen Besprechung. Sie trank einen Schluck aus der Flasche auf dem Schreibtisch, schob die Kopfhörer in den Nacken und tippte im Vorbeigehen auf die Kita-App. Grüner Status. Mila abgeholt. Dann, eine Zeile tiefer, ein nachsynchronisiertes Ereignis von gestern, grau hinterlegt, mit dem kleinen Wolkensymbol für verspäteten Abgleich.",
  "*Abholung Mila Berger, 15:42 Uhr, durch Eva Berger.*",
  "Sie lachte kurz, einmal, ohne Ton. Ein App-Fehler. Irgendein Serverabgleich, der zwei Tage durcheinanderwarf. Gestern war Simons Tag gewesen, das wusste sie so sicher wie ihren eigenen Kalender. Mittwoch. Übergabe vierzehn Uhr, Simon holt, Eva arbeitet bis neunzehn und ruft danach zum Gutenachtgespräch an. Sie hatte um 19:04 Uhr mit Mila telefoniert, das Protokoll lag in ihrem Anrufverlauf, Simon hat zwischendurch etwas über Nudeln gesagt.",
  "Eva wischte den Bildschirm nach unten, ließ ihn neu laden. Der Eintrag blieb. Sie tippte auf die Zeile, bekam die Detailansicht, eine kleine Signaturvorschau, einen Haken, einen Zeitstempel, ihre Unterschrift, stilisiert, aber in der Form, die sie seit Jahren in diese App kritzelte.",
  "Sie rief nicht Simon an. Sie rief die Kita an.",
  "„Sonnengarten, Löwen.\"",
  "„Frau Löwen, Eva Berger. Es gibt einen Abgleichfehler in Ihrer App. Gestern steht bei mir ein Abholeintrag von mir um fünfzehn Uhr zweiundvierzig. Das kann nicht stimmen, Mila war bei ihrem Vater.\"",
  "Am anderen Ende blieb es einen Moment still. Kein überraschtes Einatmen, kein Blätterrascheln. Nur die gleichmäßige Ruhe von Petra Löwen.",
  "„Frau Berger, der Eintrag ist bei uns nicht grau. Der ist bei uns regulär gebucht.\"",
  "„Das ist unmöglich.\"",
  "„Ich sehe hier Ihre Unterschrift und den Haken von meiner Kollegin Frau Weiss. Vielleicht ist es besser, Sie kommen kurz vorbei, dann gehen wir das zusammen durch.\"",
  "„Frau Löwen, ich war gestern in Frankfurt. Ich war gestern nicht in Ihrem Haus.\"",
  "„Dann klären wir das, wenn Sie da sind. Haben Sie jetzt Zeit?\"",
  "Eva sah auf den Kalender. Die interne Besprechung begann in sieben Minuten. Sie schrieb Anita eine Zeile, *muss raus, Kita, bitte übernimm*, griff Mantel und Schlüssel und war unten an der Schranke, bevor der Aufzug wieder oben angekommen war.",
  "Im Auto ging sie den Mittwoch durch. Um neun die Präsentation. Um elf der Zug. Um vierzehn Uhr zehn Ankunft Frankfurt, Taxi, Vier-Augen mit Grau. Um sechzehn Uhr zwanzig Rückzug ins Hotel. Sie hat um 15:42 Uhr nicht an einer Kita gestanden, die vierhundertzwanzig Kilometer entfernt lag. Sie hat um 15:42 Uhr in einem Konferenzraum im siebten Stock Zahlen verteidigt. Es gab Zeugen. Es gab ihre BahnCard-Abrechnung. Es gab Fotos vom Hotelschlüssel, die sie Mila am Abend geschickt hatte.",
  "Sie fuhr zu schnell. Sie wusste es und bremste nicht.",
  "An einer roten Ampel sagte sie laut in den leeren Beifahrerraum: „Das ist ein Datenbankfehler.\" Sie umfasste das Lenkrad fester, bis die Knöchel weiß wurden.",
  "Der Sonnengarten lag in einer ruhigen Seitenstraße hinter der alten Brauerei, ein umgebauter Altbau mit einem sauber gefegten Vorhof und einem Holztor, das um halb vier noch offen stand und um Viertel vor fünf verschlossen war. Eva stellte den Wagen halb auf den Bordstein, ließ den Warnblinker laufen und ging zwei Stufen auf einmal.",
  "„Frau Berger.\" Petra Löwen stand schon im Eingang, nicht hinter dem Tresen. Sie trug den dunkelgrünen Wollpullover, den Mila immer mit „Tannenbaumpulli\" kommentierte, und hielt ein Tablet in der Hand, flach gegen die Brust wie eine Speisekarte. „Kommen Sie mit ins Büro.\"",
  "Das Büro war ein langer Raum mit zwei Schreibtischen, einem Sideboard voller Ordner und einer Fotowand, auf der jedes Kind einmal lachte. Petra schob die Tür hinter Eva zu, was sie sonst nicht tat.",
  "„Ich weiß, dass Sie das aufregt\", sagte Petra, „und ich will Ihnen nicht zu nahe treten. Aber ich muss Ihnen zeigen, was wir haben, bevor wir darüber reden, was nicht sein kann.\"",
  "Sie legte das Tablet auf den Tisch, drehte es so, dass Eva direkt darauf sah, und tippte einmal.",
  "Der Eintrag vom Vortag.",
  "*15:42 Uhr. Abholung Mila Berger. Abholende Person: Eva Berger, Mutter. Eingetragen durch: S. Weiss. Bestätigt durch Unterschrift.*",
  "Darunter das kleine Unterschriftsfeld. Eva sah den Zug von unten nach oben, den kurzen Schlenker am zweiten *e*, den harten Abstrich beim *g*. Es war keine Kopie. Es sah aus wie frisch gezogen, mit dem stumpfen Stift aus der Holzschale am Tresen.",
  "„Das ist nicht meine Unterschrift\", sagte Eva. Ihre Stimme klang schmaler, als sie sein wollte.",
  "„Das ist die Unterschrift, die bei uns als Ihre hinterlegt ist.\"",
  "„Dann ist das, was bei Ihnen hinterlegt ist, falsch.\"",
  "Petra nickte nicht. Sie schüttelte auch nicht den Kopf. Sie hielt die Hände ruhig neben dem Tablet.",
  "„Frau Löwen, ich war gestern nicht in der Stadt. Ich war in einer Besprechung in Frankfurt, ich kann Ihnen den ICE-Beleg zeigen, ich kann Ihnen Kollegen nennen, ich habe abends mit Mila telefoniert, während sie bei Simon war. Simon hat sie abgeholt.\"",
  "„Nach unserem Protokoll nicht.\"",
  "„Haben Sie Simon gefragt?\"",
  "„Wir rufen immer den Elternteil an, bei dem laut Plan das Kind nicht abgeholt werden sollte. Gestern war das auch Herr Berger. Er hat uns heute Morgen zurückgerufen.\" Petra machte eine kleine Pause. „Er hat gesagt, Mila sei ganz normal bei Ihnen.\"",
  "Eva spürte, wie sich etwas in ihrem Nacken zusammenschob. Ihre Hand lag neben dem Tablet, und sie hob sie nicht. Sie sagte: „Ich will die Kamera sehen.\"",
  "„Deshalb habe ich Sie hergebeten.\"",
  "Petra führte sie einen Gang weiter, in einen kleinen fensterlosen Raum, in dem ein Monitor stand und ein Rechner, der leise summte. An der Wand ein Putzplan, ein Feuerlöscher, ein Stapel sauber gefalteter Wechselhosen in einem offenen Karton. Auf dem Monitor war ein Standbild eingefroren: die Eingangstür von innen, der Garderobenbereich, die Reihe mit den Haken, an denen die kleinen Regenjacken hingen. Im Vordergrund eine Frau, halb abgewandt, die Hand auf Milas Schulter. Mila in ihrer gelben Mütze. Die Mütze saß schief, so wie Mila sie aufsetzte, wenn es schnell gehen sollte.",
  "Die Frau trug einen dunkelblauen Wollmantel, Kaschmirmischung, Gürtel hinten mit Schlaufe, der Schnitt vom letzten Winter bei Hoss, innen eine Stelle am Ärmel, an der Eva einmal Kaffee verschüttet hatte. Die Haare lagen in derselben Länge auf dem Mantelkragen. Die Schulter hatte den leichten Fall nach links, den Eva an sich selbst auf Fotos zuerst sah, bevor sie etwas anderes sah.",
  "Eva hörte sich selbst ausatmen.",
  "Sie dachte, bevor sie es dachte: *Das bin ich.*",
  "Sie trat einen halben Schritt näher an den Monitor. Die Frau auf dem Bild beugte sich zu Mila herunter, in der Geste, die Eva hundertmal am Tag machte, wenn sie Mila etwas am Reißverschluss richtete. Derselbe Bogen im Rücken. Dieselbe Hand auf derselben Schulter.",
  "Petra sagte hinter ihr etwas, einen Satz über das Abspielen, über weitere Kameras, über einen zweiten Winkel. Eva hörte die Worte als Geräusch.",
  "„Spielen Sie ab\", sagte sie.",
  "„Einen Moment, ich muss mich an diesem Rechner anmelden. Frau Weiss hat das Bild bis hierhin für mich vorgezogen.\" Petra setzte sich auf den Stuhl, tippte ein Passwort, und das Bild zuckte einmal, als löse sich die Standbildanzeige und warte auf den nächsten Befehl.",
  "Eva wandte den Blick nicht vom Monitor. Sie sah, wie ihre eigene Hand auf Milas Schulter lag. Sie sah, wie die Finger dieser Hand sich um den Stoff der gelben Mütze legten, als wollten sie sie geraderücken. Sie sah ihren Mantel, ihre Haare, ihre Geste.",
  "„Frau Löwen\", sagte sie leise, „wann haben Sie heute mit meinem Mann telefoniert?\"",
  "„Gegen halb neun.\"",
  "„Von welcher Nummer?\"",
  "Petra sah auf. Zum ersten Mal in diesem Gespräch zögerte sie.",
  "„Von der Nummer, die bei uns als seine hinterlegt ist.\"",
  "Eva legte die Fingerspitzen auf den Rand des Tisches, an dem der Monitor stand. Das Holz war kühl und real. Sie hielt sich an diesem Kühlen fest, während auf dem Bildschirm eine Frau, die sie war und nicht war, sich aufrichtete und Milas Hand nahm, um mit ihr aus dem Bild zu gehen."
];

const sceneTwoParagraphs = [
  "Das Leitungsbüro roch nach kaltem Kaffee und dem Klebstoff der Kinderplakate an den Wänden. Petra Löwen schloss die Tür, nicht hart, nur bestimmt, und deutete auf den Stuhl vor dem Schreibtisch. Sechzehn Uhr zweiundvierzig auf der Wanduhr. Der Sekundenzeiger lief gleichmäßig weiter, als gäbe es nichts zu klären.",
  "Eva blieb stehen.",
  "\"Zeigen Sie es mir bitte.\"",
  "\"Setz dich erst, Eva.\"",
  "\"Ich möchte es sehen.\"",
  "Petra nickte, ohne die Augenbrauen zu heben, und drehte den Bildschirm so, dass Eva mitverfolgen konnte. Eva legte die Tasche ab, die Hände flach auf die Tischkante. In ihrem Kopf hatte sie den Satz schon fertig: Das bin ich nicht, und ich kann es Ihnen zeigen.",
  "Das Bild lief an. Der Gang vor der Garderobe, Weitwinkel, leicht körnig, die Farben eine Spur zu warm. Eine Frau in einem dunkelgrünen Mantel kam durch die Glastür, blieb kurz stehen, zog den Schal enger. Eva sah den Schnitt des Mantels. Sie hatte so einen Mantel. Halb Berlin hatte so einen Mantel.",
  "\"Das ist nicht mein Gang\", sagte sie.",
  "\"Wie meinst du das?\"",
  "\"Ich gehe anders. Schneller. Ich trete anders auf.\"",
  "Petra hielt das Bild nicht an, ließ es laufen. Die Frau bewegte sich unauffällig, weder hastig noch gebremst, so wie jemand, der wusste, wo die Haken hingen. Sie drehte das Gesicht von der Kamera weg, die Schulter hoch, das Kinn gesenkt. Die Haare in einem lockeren Zopf, so wie Eva sie trug, wenn sie morgens keine Zeit mehr hatte.",
  "\"Sie zeigt das Gesicht nicht\", sagte Eva.",
  "\"Nein.\"",
  "\"Dann kann niemand sagen, dass ich das bin.\"",
  "\"Niemand hat das gesagt, Eva.\"",
  "Petra sprach leise. Es gab keine Anklage im Raum, nur Ton, Bild und eine Frau am Schreibtisch, die die Hände ruhig faltete.",
  "Die Aufnahme wechselte. Garderobenbereich, näher dran. Die Frau bückte sich vor Milas Haken. Eva kannte den Haken, drittes Fach von links, roter Punkt, Affe als Symbol darunter. Die Frau griff Milas Wechseljacke, faltete sie zweimal, so wie Eva sie faltete, legte sie in den Beutel. Griff nach dem Turnbeutel. Griff nach dem Trinkbecher.",
  "Eva hörte sich einatmen.",
  "Der Becher war gelb. Milas Becher. Mit dem Sprung im Deckel oben rechts, den Eva seit Wochen ersetzen wollte und immer wieder vergaß. Die Frau nahm ihn, als gehörte er zu ihr, schraubte kurz nach, stellte ihn in den Seitenbeutel. Keine Suche, kein Zögern.",
  "\"Halten Sie das an\", sagte Eva.",
  "Petra drückte die Leertaste.",
  "\"Den Becher kennt niemand, der nicht regelmäßig bei uns in der Wohnung ist.\"",
  "\"Ich verstehe.\"",
  "\"Nein.\" Eva hörte selbst, wie scharf das klang. \"Sie verstehen es gerade nicht. Das ist kein Becher aus dem Kita-Regal. Der steht bei uns auf dem Küchentresen. Wer auch immer da vorne läuft, war in meiner Wohnung, oder jemand hat ihr gesagt, welcher Becher zu Mila gehört.\"",
  "\"Oder du warst es.\"",
  "Der Satz kam so ruhig, dass Eva einen Moment brauchte, um zu merken, dass er gefallen war. Petra tippte mit dem Finger neben das angehaltene Bild, nicht darauf.",
  "Dann schob sie die Liste herüber.",
  "Abholliste, gestern, 15:42 Uhr. Name in Druckbuchstaben: Mila Berger. Daneben eine Unterschrift. Eva beugte sich vor. Das E lief zu weit nach unten, das B hatte oben eine Schleife, die sie selten so zog, aber manchmal schon. Der Druck der Linie war ihrer ähnlich. Wer ihre Unterschrift zwanzigmal auf Einverständmiserklärungen, Ausflugszetteln und Notfallbögen gesehen hatte, konnte sie so hinbekommen.",
  "\"Das ist nicht meine Unterschrift\", sagte Eva.",
  "\"Sie sieht ihr sehr ähnlich.\"",
  "\"Ähnlich reicht nicht.\"",
  "\"Für uns im Alltag schon, Eva. Wir vergleichen nicht graphologisch. Wir sehen, dass die Mutter kommt, dass das Kind die Mutter erkennt, dass die Mutter unterschreibt. Das ist die Grundlage, auf der wir alle hier arbeiten.\"",
  "\"Mila hat sie erkannt?\"",
  "Petra zögerte zum ersten Mal. Nur einen Atemzug.",
  "\"Mila ist mitgegangen.\"",
  "Eva öffnete den Mund und schloss ihn wieder. Mila ging nicht mit Fremden mit. Mila ging mit Menschen mit, die sie oft genug gesehen hatte.",
  "\"Ich möchte das Video noch einmal sehen. Die Stelle an der Tür.\"",
  "Petra spulte zurück. Eva sah sich selbst beim Hinsehen zu, sah, wie ihre Finger auf dem Tisch flach werden wollten und stattdessen zuckten. Der Mantel. Die Statur. Die Art, den Zopf über die Schulter zu werfen. Der Moment, in dem die Frau Milas Hand nahm, ohne sich zu bücken, weil Mila ihr die Hand schon entgegenstreckte.",
  "\"Das bin ich nicht\", sagte Eva, leiser.",
  "\"Ich höre dich.\"",
  "\"Sie glauben mir nicht.\"",
  "\"Ich habe nicht gesagt, dass ich dir nicht glaube. Ich habe dir gezeigt, was wir haben. Das hier\" – Petra legte die Hand neben die Liste, nicht darauf – \"ist das, was wir einem Elternteil vorlegen müssten, wenn jemand fragt. Und es ist das, was wir dir zeigen, bevor jemand fragt.\"",
  "\"Wer soll fragen?\"",
  "Petra sah sie ruhig an.",
  "\"Ich möchte, dass du Simon informierst, bevor wir es müssen.\"",
  "Im selben Moment vibrierte Evas Handy auf dem Tisch. Sie hatte es nicht bewusst dorthin gelegt. Der Bildschirm hellte sich auf, ein Banner zog sich über das Display, oben, lesbar für beide, ob man wollte oder nicht.",
  "*Nora: Alles okay bei euch? Hab Mila heute Mittag im Hof gehört, war kurz unsicher, ob ich rüberkomme. Melde dich.*",
  "Eva legte die Hand auf das Telefon, ein Reflex, das Banner verschwinden zu lassen. Petra sah weg, so höflich, dass es schlimmer war, als hätte sie hingestarrt."
];

const sceneThreeParagraphs = [
  "„Ich rufe Simon an\", sagte Eva. „Heute noch.\" Petra nickte, und Eva nahm das Telefon vom Tisch. Im Flur blieb ihr Blick an Milas Haken hängen, dann an dem gelben Becher, der gleichzeitig auf ihrem Küchentresen und in der falschen Hand gewesen war. Draußen tippte sie Simons Namen an. Er nahm nicht ab. Sie setzte sich ins Auto und wählte noch einmal.",
  "„Eva.\"",
  "„Bei Mila ist alles gut.\" Sie hörte sich zu ruhig sagen und korrigierte. „Sie ist drin, sie spielt. Aber in der App steht, ich hätte sie gestern abgeholt.\"",
  "Stille. Kein Einatmen, kein Ach was. Simon sortierte.",
  "„Um wie viel Uhr?\"",
  "„Fünfzehn Uhr zweiundvierzig.\"",
  "„Und du warst wo?\"",
  "„Im Büro. Bis halb sechs. Das kann ich belegen.\"",
  "„Hast du das schon.\"",
  "„Noch nicht. Ich fahre gleich hin.\"",
  "Sie hörte ihn den Laptop aufklappen, dieses kleine, trockene Geräusch, das sie acht Monate nicht mehr gehört hatte.",
  "„Eva, was haben die dir gezeigt.\"",
  "„Ein Video. Eine Unterschrift. Petra war sehr freundlich.\"",
  "„Freundlich ist das schlechteste Zeichen.\"",
  "Sie schluckte. „Ich weiß.\"",
  "„Schick mir alles, was du hast. Foto vom App-Screen, Foto von der Unterschriftsliste, wenn sie dich eine machen lassen. Uhrzeit, wer dabei war. Auch wenn es nichts wird, brauchst du es chronologisch.\"",
  "„Ich hab angefangen.\"",
  "„Gut.\" Eine Pause. „Eva. Du klingst nicht durcheinander. Das ist wichtig. Bleib so.\"",
  "Das rutschte an ihr herunter wie eine Note. Sie war nicht durcheinander. Sie war präzise und saß auf einem Parkplatz, auf dem sie gestern nicht gewesen war.",
  "„Ich hol sie in zwanzig Minuten rein,\" sagte sie. „Dann sind wir zu Hause.\"",
  "„Ich komme heute Abend vorbei.\"",
  "„Simon —\"",
  "„Nicht wegen dir. Ich will sie sehen.\"",
  "„Okay.\" Bevor sie es durchgedacht hatte. Bevor sie wusste, ob okay hieß, dass er ihr half, oder dass er ab jetzt jede Abholung gegenprüfen würde, die sie machte.",
  "„Um sieben?\"",
  "„Um sieben.\"",
  "„Eva.\" Er wartete. „Fahr nicht allein durch, wenn dir irgendwas komisch ist. Ruf mich an, egal wie spät.\"",
  "Sie legte auf und hielt das Telefon noch eine Sekunde ans Ohr. Durch die Windschutzscheibe ging eine Mutter mit zwei Kindern zum Zebrastreifen, der jüngere auf den Armen, der ältere mit einem Turnbeutel, der über den Asphalt schleifte. Ein Alltag, der funktionierte, weil er nicht überprüft wurde.",
  "Das Telefon vibrierte in ihrer Hand.",
  "Nora.",
  "Sie hätte nicht rangehen müssen. Sie ging ran.",
  "„Eva, Liebes, ich hab nur kurz — bist du gerade bei der Kita?\"",
  "„Ja. Woher —\"",
  "„Ich bin eben am Hof vorbei, dein Parkplatz war leer. Ich hab gedacht, um die Zeit bist du sonst längst daheim.\"",
  "Die Ruhe in Noras Stimme war wie warmes Wasser. Evas Schultern sanken, bevor sie sich dafür entschieden hatte.",
  "„Es gibt ein Problem mit der App.\"",
  "„Was für ein Problem.\"",
  "„Die behaupten, ich hätte Mila gestern schon abgeholt.\"",
  "„Oh Eva.\"",
  "„Sie haben Video.\"",
  "„Das ist ja absurd. Hör zu, ich mach dir Tee, ich nehm die Wäsche aus dem Hof, ich hol nachher Brot mit, damit du nicht nochmal raus musst. Ich bin einfach da, wenn du kommst, ja?\"",
  "„Das musst du nicht —\"",
  "„Ich weiß. Ich will.\" Ein kurzes Lachen, das nicht unpassend war, nur schnell. „Eva. Dass jemand behauptet, du hättest Mila gestern schon abgeholt, wo du doch im Büro warst, das ist nicht dein Problem, das ist deren Problem. Das kriegen wir sortiert.\"",
  "Eva hielt das Telefon fester.",
  "Sie ging die letzten zehn Sekunden durch. Problem mit der App. Gestern. Video. Nein. Sie hatte nicht gesagt, dass sie im Büro gewesen war. Sie war sicher.",
  "Sie war sicher.",
  "„Eva?\"",
  "„Ja. Ich — ja. Ich komm jetzt los.\"",
  "„Fahr vorsichtig. Ich bin da.\"",
  "Sie legte auf und saß mit dem Telefon auf dem Oberschenkel. Die Scheibe beschlug von innen. Sie kurbelte das Fenster einen Spalt auf.",
  "Zwei Hilfen. Simon, der Papier wollte. Nora, die eine Tasse wollte.",
  "Sie stieg aus, ging rein, holte Mila, wechselte an der Garderobe drei ruhige Sätze mit einer jungen Erzieherin, die nicht Bescheid wusste, schnallte Mila an, beantwortete die Frage nach dem Puzzle am Nachmittag und hörte sich selbst zu. Ihre Stimme war in Ordnung. Auf dem Heimweg wurde die Ampel an der Moltkestraße zweimal rot, wie immer. Der Asphalt war feucht. Mila summte etwas, das kein Lied war.",
  "An jeder Kreuzung sortierte Eva leiser, als sie dachte. Heute gibt sie nichts aus der Hand, was sie nicht selbst angefasst hat. Keine Jacke, die jemand anderes faltet. Keinen Becher, den jemand anderes spült. Keine Liste, die jemand anderes abhakt.",
  "Im Hof stand Noras Auto. Im Fenster oben, bei Nora, brannte Licht.",
  "Eva trug Mila nicht, Mila lief. Im Treppenhaus roch es nach dem Bohnerwachs, das der Hausmeister am Dienstag benutzte. Dienstag war gestern.",
  "Oben schloss sie auf, stellte die Kita-Tasche ab und kniete sich hin, um Milas Schuhe zu öffnen, obwohl Mila das längst selbst konnte. Sie brauchte die Bewegung.",
  "„Mama, mein Gummi ist weg.\"",
  "„Welcher?\"",
  "„Der mit der Erdbeere.\"",
  "Eva sah den Zopf an. Das Gummi saß. Ein blaues, schmales.",
  "„Der sitzt doch.\"",
  "„Nicht der. Der andere.\"",
  "„Welcher andere.\"",
  "Mila zuckte mit den Schultern und ging in die Küche.",
  "Eva öffnete die Kita-Tasche und suchte die kleine Seitentasche ab, in die sie morgens immer das Wechselgummi steckte, weil Mila unter Tags eines verlor. Keines drin. Sie ging zur Garderobe. Milas Fach unten, Jacke, Matschhose, die Wechselschuhe auf dem Boden, und im Stofffach über dem Haken, wo die kleinen Dinge lagen, der Haargummi mit der Erdbeere.",
  "Und daneben noch einer.",
  "Schmal, dunkelrot, ein Zopfband, das sie kannte, weil sie es vor drei Monaten einmal gekauft und dann nicht mehr gefunden hatte. Sie hatte gestern früh beim Packen in dieses Fach gegriffen. Sie wusste, was drin gewesen war. Ein Gummi. Eines.",
  "Sie hob das rote Band hoch und hielt es gegen das Licht des Flurs. Es roch schwach nach einem Weichspüler, den sie nicht benutzte.",
  "In der Küche lief Wasser. Mila sang jetzt doch ein Lied.",
  "Unten im Hof schlug eine Autotür. Schritte auf dem Kies, ruhig, bekannt, ohne Eile.",
  "Eva ließ das Band in ihre Handfläche fallen und schloss die Finger darum."
];

const sceneFourParagraphs = [
  "Auf dem Küchentisch lagen Dinge, die sonst nicht nebeneinander lagen: das Handy mit offener Kita-App, der Papierkalender, die schwarze Kladde mit den Wochenplänen, zwei Ausdrucke, schief übereinandergelegt. Mila schlief seit einer halben Stunde. Durch die angelehnte Zimmertür kam ihr Atem, klein und gleichmäßig, und jedes Mal, wenn Eva ihn hörte, dachte sie für einen Moment, dass noch alles an seinem Platz war.",
  "Sie zog den Kalender heran. Mittwoch: Besprechung bis siebzehn Uhr, danach Einkauf, Mila sechzehn Uhr fünfzehn. Ihre Schrift, ihr Kugelschreiber, kein gestrichener Eintrag, kein Pfeil, keine hastige Korrektur. Daneben auf dem Display: Abholung bestätigt, sechzehn Uhr zwölf, Unterschrift Eva Berger. Drei Minuten. In der Kita nichts. In ihrem Kopf ein Riss.",
  "Sie wischte durch die Historie. Montag, Dienstag, Mittwoch. Alles sauber. Immer dieselbe Art Eintrag, dieselbe Form, dieselbe Selbstverständlichkeit. Nichts daran sah nach Fehler aus. Gerade das war das Problem.",
  "Dann stand sie auf und holte den grünen Ordner aus dem Schrank, Kita-Unterlagen seit Milas Aufnahme. Das Plastik am Rücken war unten schon weiß geworden vom Anfassen. Sie blätterte durch Impfpass-Kopie, Beitragsbescheid, Eingewöhnungsnotiz, alte Elternbriefe, bis hinten in einer Klarsichthülle die Reserve-Notfallliste lag.",
  "Sie zog das Blatt langsam heraus.",
  "Oben ihr eigener Name, dann Simon. Darunter, handschriftlich ergänzt, in ihrem blauen Kuli: Nora Seidel, Hofnachbarin, jederzeit erreichbar. Noras alte Festnetznummer. Daneben ihre Unterschrift, klein und schnell, mit der zu weit gezogenen Schleife am E, die sie nur machte, wenn sie im Stehen schrieb.",
  "Eva hielt das Blatt einen Moment zu lange fest. Sie hatte Nora gestrichen. Daran erinnerte sie sich nicht als Vorsatz, sondern als erledigte Bewegung. Letztes Jahr, nach der Trennung, hatte sie alle Listen neu machen wollen. App, Papier, alles. In ihrem Kopf war das geschehen. Das Blatt in ihrer Hand sagte etwas anderes.",
  "Eva drehte es um. Rückseite leer. Sie suchte nach einem Stempel, einem Ungültig-Vermerk, irgendetwas, das zeigte, dass dieses Exemplar überholt war. Nichts. Nur ein kleiner Knick in der oberen Ecke, als hätte es jemand eingesteckt und wieder zurückgelegt.",
  "Sie legte das Blatt neben die App. Zwei Listen, zwei Wahrheiten. Auf dem Display stand oben, in der aktuellen Fassung, nur Eva und Simon. Auf Papier stand Nora immer noch, mit ihrer eigenen Hand eingetragen, mit ihrer eigenen Unterschrift beglaubigt. Eine davon war das, was die Kita im Notfall in die Hand nahm. Eva wusste nicht mehr, welche.",
  "Unten klingelte es kurz am Hoftor. Dann Schritte auf dem Kopfsteinpflaster, die sie ohne hinzusehen erkannt hätte.",
  "Sie trat ans Küchenfenster. Nora stand im Innenhof, mit einem Topf in beiden Händen, den Griff des Deckels mit einem Küchenhandtuch gesichert. Sie sah hoch, lächelte, hob den Topf ein Stück, eine Frage ohne Worte.",
  "Eva ging runter.",
  "„Hab zu viel gekocht\", sagte Nora. „Karottensuppe. Mila mag die doch. Nimmst du mir einen Teil ab.\"",
  "Es war keine Frage. Eva nahm den Topf. Er war noch warm.",
  "„Du bist ein Schatz.\"",
  "„Ach was.\" Nora schob die Hände in die Ärmel ihrer Strickjacke. „Wie geht's ihr? Heute Nachmittag war sie doch so aufgedreht, da kriegt sie abends schwer Ruhe.\"",
  "Eva stand mit dem Topf zwischen den Händen, als hätte jemand ihr ein Tablett mit Gläsern gereicht, das sie nicht absetzen konnte.",
  "„Sie schläft.\"",
  "„Gut.\" Nora nickte. „Sie hatte ja diese kleine Stelle am Knie, auf der hellgrauen Strumpfhose. Von der Rutsche, nehme ich an.\"",
  "Eva lächelte. Ein halber Zug der Mundwinkel, bevor der Satz unten ankam.",
  "Die hellgraue Strumpfhose hatte sie Mila heute Morgen angezogen. Mila war heute nicht draußen gewesen. Mila war heute überhaupt nicht aus der Wohnung gekommen, weil Eva sie nach dem Anruf aus der Kita nicht aus den Augen gelassen hatte. Nora hatte Mila nicht gesehen. Nora konnte das Knie nicht gesehen haben.",
  "„Ich schau nachher nach der Stelle\", sagte Eva. Ihre Stimme lief eine Sekunde nach, als käme sie aus einem anderen Raum.",
  "„Mach das.\" Nora legte ihr kurz die Hand auf den Unterarm, eine alte Geste, die Eva vor zwei Wochen noch gern gehabt hätte. „Und ruf an, wenn irgendwas ist. Egal wann.\"",
  "„Mach ich.\"",
  "Nora wartete einen Moment zu lang. Sie sah an Eva vorbei, die Hauswand hoch, zum Küchenfenster, dann wieder zurück. „Und iss was. Du bist ganz schmal im Gesicht heute.\"",
  "„Ja.\"",
  "„Versprich mir.\"",
  "„Ja.\"",
  "Nora drehte sich und ging zu ihrer Tür auf der anderen Hofseite. Eva blieb stehen, bis sie dort drüben das Licht angehen sah. Dann noch eine Sekunde. Dann noch eine.",
  "Oben in der Wohnung stellte sie den Topf auf dem Herd ab, ohne den Deckel abzunehmen. Der Flur lag halb dunkel, nur die Lampe über dem Schuhregal brannte. Sie zog die Wohnungstür hinter sich zu, mit dem kleinen Zug, bis der Riegel einrastete, und legte die Kette vor. Sie legte nie die Kette vor.",
  "Sie drehte sich um.",
  "An den Haken im Flur, dem unteren, auf Kinderhöhe, hing Milas Ersatzjacke. Die blaue mit dem ausgefransten Reißverschluss, die seit Wochen in der Kita im Fach lag, falls die andere nass würde. Sie hing am rechten Haken, nicht am mittleren, den Mila sonst benutzte. Am rechten, weil Eva morgens den mittleren für ihren eigenen Schal brauchte. Das war eine stille Abmachung zwischen ihr und einer Dreijährigen, die immer dort hinlangte, wo die Mutter gerade nicht war.",
  "Das wusste niemand außer ihr.",
  "Eva stand mit der Hand noch am Türknauf und rührte sich nicht. Aus der Wohnung kam Milas Atem, gleichmäßig, unversehrt. Aus dem Hof kam nichts. Aus dem Flur kam der schwache Geruch nach Karottensuppe, der sich an der Tür vorbeigeschoben haben musste, als sie zugezogen hatte.",
  "Sie streckte langsam die Hand aus und berührte den Stoff der Jacke. Kühl. Nicht frisch von draußen, nicht warm aus einem Auto. Irgendwo zwischendurch gewesen. Auf einem Tisch gelegen. Über einer Stuhllehne gehangen. An einem anderen Haken, bevor sie an diesen gekommen war.",
  "Eva ließ die Jacke hängen. Sie rührte sie nicht an, außer mit den Fingerspitzen, als könnte sie etwas verwischen, wenn sie mehr nähme. Sie ging zurück in die Küche, zum Kalender, zur Reserveliste, zur App. Sie setzte sich nicht. Sie blieb vor dem Tisch stehen und sah auf ihre eigene Unterschrift von vor zwei Jahren, und auf ihre Unterschrift von gestern um sechzehn Uhr zwölf, und versuchte, den Unterschied zu finden, der ihr gehören würde.",
  "Im Flur, hinter ihr, hing die Jacke am falschen richtigen Haken."
];

const sceneFiveParagraphs = [
  "Das Büro von Petra Löwen roch nach Kaffee und dem Papierstaub, der sich in jedem Aktenschrank sammelt, der älter als fünf Jahre ist. Eva setzte sich, ohne die Jacke auszuziehen, und legte die Hände flach auf die Knie. Auf dem Fensterbrett stand eine Orchidee, deren unterste Blüte braun geworden war. Jemand hatte sie trotzdem nicht weggeschnitten.",
  "\"Ich wollte heute etwas Schriftliches\", sagte sie. \"Damit klar ist, wer Mila abholen darf. Nur ich. Und Simon.\"",
  "Petra nickte, langsam, wie jemand, der schon weiß, was er gleich antworten wird. Sie zog eine dünne, bereits vorbereitete Mappe aus der Schublade.",
  "\"Das haben wir uns auch überlegt, Frau Berger. Nach gestern.\"",
  "Nach gestern. Nicht nach ihrer Frage. Nach gestern.",
  "\"Wir führen ab sofort ein Codewort ein\", sagte Petra und drehte das Blatt so, dass Eva mitlesen konnte. \"Sie legen es fest, Sie geben es ausschließlich an Personen, die tatsächlich abholen sollen. Zusätzlich bitten wir bei jeder Abholung, die nicht Sie persönlich sind, um einen Lichtbildausweis. Und wir rufen Sie in jedem Zweifelsfall an, bevor wir das Kind übergeben.\"",
  "\"Gut.\"",
  "\"Die Liste der abholberechtigten Personen wird neu aufgesetzt. Schriftlich. Von Ihnen unterschrieben, heute.\"",
  "\"Gut.\"",
  "\"Und wenn jemand die Liste ändern möchte, auch Sie selbst, muss das hier passieren, in diesem Büro, im Beisein von mir oder meiner Stellvertretung.\"",
  "Eva öffnete den Mund und schloss ihn wieder. Es klang vernünftig. Es klang nach dem, was sie hatte haben wollen. Sie griff nach dem Stift.",
  "\"Welches Codewort möchten Sie?\"",
  "\"Marillenknödel.\"",
  "Petra sah kurz auf. Milas Lieblingsessen bei der Oma. Etwas, das Simon nicht mochte und Nora nie vor ihr ausgesprochen hatte. Eva hielt es fest, weil sie es festhalten wollte.",
  "\"In Ordnung.\" Petra notierte es in einer eigenen Spalte, deckte das Blatt beim Schreiben mit der Hand ab. \"Das bleibt bei mir im Tresor. Niemand in der Gruppe bekommt es zu sehen.\"",
  "Dann legte sie eine zweite Mappe daneben. Älter. Der Rand der Klarsichthülle schon weich.",
  "\"Bevor ich Sie unterschreiben lasse, möchte ich das hier mit Ihnen durchgehen.\"",
  "Sie zog ein Blatt heraus. Eva erkannte es, bevor sie es gelesen hatte. Die alte Vollmacht, damals ausgefüllt in der ersten Kita-Woche, als alles neu war und Simon sich noch nicht entschieden hatte, ob er aus der Wohnung auszieht oder nicht. Oben ihr Name. Unten ihre Unterschrift, runder als heute, in blauer Tinte.",
  "\"Das ist Ihre Handschrift?\"",
  "\"Ja.\"",
  "\"Gut.\" Petra tippte mit dem Stift neben den zweiten Eintrag in der Spalte für zusätzliche Berechtigte. \"Warum steht Frau Seidel hier?\"",
  "Eva sah auf den Namen. Nora Seidel, Hofnachbarin. Ihre eigene, damalige Formulierung. Der Haken bei „in Ausnahmefällen“, von ihr selbst gesetzt, die Telefonnummer in ihrer Schrift. Daneben, in einem anderen Kugelschreiber, blasser, ein kleines Datum, an das Eva sich nicht erinnerte. Vielleicht ein Zusatz bei einer späteren Aktualisierung. Vielleicht nicht.",
  "\"Weil sie damals.\" Eva hielt inne. \"Weil ich damals niemanden hatte, der kurzfristig einspringen konnte. Simon hat viel gearbeitet, meine Mutter wohnt zwei Stunden weg, und Nora war.\"",
  "\"Nebenan.\"",
  "\"Ja.\"",
  "\"Soll sie dort stehen bleiben?\"",
  "Die Frage war sachlich. Kein Unterton. Petra schaute Eva an, als gehe es um eine ganz normale Aktualisierung, wie bei jeder Familie, deren Verhältnisse sich verschieben.",
  "Wenn sie jetzt sagte streichen, musste sie eine Frau als Gefahr benennen, die gestern noch Suppe gebracht hatte. Petra würde es notieren. Unter Datum, Uhrzeit, Evas Namen.",
  "\"Lassen Sie es vorerst so\", sagte Eva. \"Ich melde mich, wenn ich es ändern möchte.\"",
  "Petra nickte, ohne etwas zu bewerten. Sie setzte einen kleinen Haken an den Rand, nicht neben Noras Namen, sondern neben Evas Satz.",
  "\"Ich notiere nur, dass wir heute darüber gesprochen haben.\"",
  "\"Ja.\"",
  "\"Ohne Inhalt.\"",
  "\"Ja.\"",
  "Petra drehte das neue Blatt herum. \"Dann bitte hier, hier und hier.\"",
  "Eva unterschrieb. Dreimal. Ihre heutige Unterschrift, knapper, schneller, daneben die alte, runde von damals auf dem zweiten Blatt.",
  "\"Eine Kopie für Sie.\" Petra schob ihr ein Blatt über den Tisch. \"Falls Sie etwas klarstellen möchten, rufen Sie mich direkt an, nicht das Gruppenhandy.\"",
  "\"Danke.\"",
  "\"Frau Berger.\" Petra hielt die Mappe noch kurz, bevor sie sie schloss. \"Wir machen das jetzt formal, weil es für alle sicherer ist. Auch für Sie. Verstehen Sie das bitte nicht als.\"",
  "Sie suchte ein Wort.",
  "\"Als was?\"",
  "\"Als Misstrauen.\"",
  "\"Nein\", sagte Eva. \"Natürlich nicht.\"",
  "Eva stand auf. Petra stand auch auf, reichte ihr die Hand. Der Händedruck war fest und kurz, freundlich und geschäftsmäßig.",
  "Im Flur kam ihr der Geruch der Gruppe entgegen, Apfel und feuchte Wolle. Durch die offene Tür sah sie Mila am niedrigen Tisch, den Kopf über ein Blatt gebeugt, die Zunge zwischen den Zähnen. Sie hob nicht den Blick. Eva blieb nicht stehen. Die Kopie der Vereinbarung raschelte in ihrer Hand.",
  "An der Garderobe hing Milas Anorak am Haken, der Ärmel halb in den Haken des Nachbarkindes gerutscht. Eva zog ihn nicht zurecht. Die Kopie in ihrer Hand war leicht, aber sie machte selbst diese kleine Bewegung plötzlich zu etwas, das nicht mehr selbstverständlich war.",
  "Draußen schlug ihr die Luft kalt ins Gesicht. Sie atmete einmal tief ein und ging die drei Stufen hinunter zum Gehweg.",
  "Auf der anderen Straßenseite, schräg gegenüber der Einfahrt, stand Nora.",
  "Sie stand nicht auffällig. Sie stand, wie man steht, wenn man gerade aus der Bäckerei kommt und kurz in der Tasche etwas sucht. Dunkler Mantel, die Haare zurückgesteckt. Sie sah Eva nicht. Oder sie sah sie und tat, als sähe sie sie nicht.",
  "In ihrer Hand hielt sie etwas aus buntem Tonpapier, an den Rändern gezackt, eine Schere hatte es in die Form eines Sterns gebracht, in der Mitte ein Streifen Transparentpapier, gelb. Eva kannte diese Sterne. Sie klebten seit letzter Woche hinter den Gruppenfenstern, jedes Kind hatte einen gemacht, Milas war der mit dem gelben Transparentpapier gewesen, weil sie das rote zuerst zerrissen hatte und dann geweint hatte und dann das gelbe bekommen hatte.",
  "Nora schob den Stern in ihre Handtasche, drückte den Verschluss zu und ging weiter, Richtung Straßenbahn.",
  "Eva blieb auf der Stufe stehen. Das Papier gab an den Rändern nach."
];

const sceneSixParagraphs = [
  "Die Praxis meldete sich beim dritten Klingeln. Eva stand am Küchentisch, die Hand auf Milas Vorsorgeheft, und zwang ihre Stimme in die alltägliche Lage, die man am Telefon erwartet.",
  "„Berger, guten Tag. Ich wollte den Termin für Mila morgen bestätigen.\"",
  "„Einen Moment.\" Tastenklicken. „Frau Berger, der Termin wurde doch verschoben. Auf Donnerstag, elf Uhr.\"",
  "„Verschoben.\"",
  "„Sie haben gestern angerufen. Kurz nach vierzehn Uhr, glaube ich. Soll ich nachsehen?\"",
  "„Ja. Bitte.\"",
  "Das Klicken wurde länger. Im Hintergrund hustete ein Kind, eine zweite Stimme rief Nummern auf. Eva sah auf ihren eigenen Kalender, auf den Eintrag Mittwoch, zehn Uhr, in ihrer Handschrift, zweimal unterstrichen.",
  "„Vierzehn Uhr sieben. Donnerstag, elf. Frau Dr. Keller hat das so übernommen.\"",
  "„Wer hat angerufen?\"",
  "„Sie.\"",
  "„Ich war gestern um vierzehn Uhr im Büro.\"",
  "Die Sprechstundenhilfe machte eine kleine Pause, in der kein Ärger lag, nur die Geduld, die man am Empfang lernt. „Soll ich den Termin wieder auf morgen legen?\"",
  "„Warten Sie.\" Eva atmete durch. „Das Folgerezept für den Inhalator. Liegt das bei Ihnen?\"",
  "„Das wurde gestern abgeholt.\"",
  "„Von wem?\"",
  "„Moment.\" Wieder Klicken. „Da ist ein Kürzel. EB. Sie haben selbst abgezeichnet, steht hier.\"",
  "„Ich habe nichts abgezeichnet.\"",
  "„Frau Berger.\" Der Ton wurde vorsichtig, nicht unfreundlich. „Ich kann Ihnen die Ausgabe gerne zeigen, wenn Sie vorbeikommen.\"",
  "Eva legte auf, bevor sie höflich sein musste.",
  "Sie war schon im Mantel, bevor sie wusste, wohin. Am Ende ging sie in den Supermarkt an der Ecke, weil Milchpackungen sich ins Regal stellen ließen, ohne dass jemand dazu eine Unterschrift brauchte.",
  "An der Kasse zog sie die Karte durch, bevor die Kassiererin die letzte Ziffer eingetippt hatte. Die Frau sah kurz auf.",
  "„Na, heute ohne die Kleine?\"",
  "„Ja.\"",
  "„Hat sie sich wieder beruhigt?\"",
  "Eva hielt die Karte in der Hand.",
  "„Wie bitte?\"",
  "„Gestern, an der Süßigkeitenkasse.\" Die Kassiererin lachte, nicht spöttisch, eher kollegial unter Müttern. „Die Jacke mit den Sternen, der Zopf ganz schief. Ich dachte, jetzt kippt sie gleich mit der Kasse um.\"",
  "„Gestern.\"",
  "„So gegen halb fünf. Sie haben ihr zwei Riegel versprochen und dann doch nur einen gekauft. Standardtrick.\" Sie zwinkerte. „Soll ich die Tüte selber packen?\"",
  "„Nein. Danke.\"",
  "Eva packte die Milch, den Joghurt, das Brot. Die Sterne waren auf Milas Winterjacke. Der Zopf war Evas Zopf.",
  "Auf der Straße rief sie Simon an.",
  "„Ich brauche dich kurz.\" Ihre Stimme ging zu schnell. Sie hörte es selbst. „Ruf du in der Praxis an. Sag, du bist Milas Vater, du willst den Termin bestätigen. Nur das.\"",
  "„Eva.\"",
  "„Bitte. Nicht reden. Anrufen.\"",
  "Er schwieg eine Sekunde zu lang, und dann, anders als sonst, sagte er nichts Abwiegelndes.",
  "„Ich rufe zurück.\"",
  "Sie ging die vier Straßen nach Hause zu Fuß. Die Tüte schlug gegen ihr Bein. Am Hauseingang blieb sie stehen. Neun Minuten. Sie sah auf die Anzeige, als sein Name kam.",
  "„Der Termin ist verschoben\", sagte Simon. „Auf Donnerstag, elf.\"",
  "„Ja.\"",
  "„Die Frau am Empfang sagt, du hättest gestern angerufen.\"",
  "„Ich war im Büro, Simon. Ich war in der Besprechung mit Kranz bis fünfzehn Uhr, du kannst ihn anrufen, wenn du willst.\"",
  "„Und das Rezept?\"",
  "„Abgeholt. Mit meinem Kürzel.\"",
  "Er atmete aus. Nicht genervt. Nachdenklich.",
  "„Eva.\"",
  "„Nein.\"",
  "„Ich habe das noch nicht gesagt.\"",
  "„Ich höre es.\"",
  "„Ich frage dich das einmal\", sagte Simon. „Und ich frage es nicht, weil ich es will.\"",
  "„Frag.\"",
  "„Bist du sicher, dass du dich nicht täuschst?\"",
  "Sie hörte, wie er die Frage einpackte, während er sie stellte. Wie er versuchte, ihr Platz zu lassen.",
  "„Ich bin sicher.\"",
  "„Eva, der Termin ist verschoben. Jemand am Telefon war es. Das Rezept ist abgeholt, mit deinem Kürzel. Die Kita hat ein Video. Ich will nur —\"",
  "„Ich weiß, was du willst.\"",
  "„Ich will, dass Mila morgen einen Arzt sieht, wenn sie einen braucht. Ich will wissen, ob du gestern vielleicht —\"",
  "„Vielleicht was, Simon.\"",
  "Er sagte es nicht. Er musste es nicht sagen. Das Wort stand zwischen ihnen, ohne dass einer von beiden es aussprach, und es war das erste Mal in diesem Gespräch, dass er leiser wurde statt lauter.",
  "„Ich hole Mila heute nicht ab\", sagte er dann. „Du hast sie bis Freitag. Das bleibt so. Ich frage nur.\"",
  "„Du fragst.\"",
  "„Ja.\"",
  "Eva stellte die Tüte ab. Die Milch kippte auf die Seite. Sie ließ sie liegen.",
  "„Dann frag zu Ende.\"",
  "„Ich habe gefragt.\"",
  "Sie legte auf, bevor sie etwas sagte, das er später zitieren könnte."
];

const sceneSevenParagraphs = [
  `Das Festnetz klingelte, als sie die Milch noch nicht wieder in den Kühlschrank gestellt hatte. Die Praxis wollte nach Simons Rückruf wissen, ob der Termin nun Donnerstag bleiben solle. Eva zwang die Helferin, in der Akte zu notieren, dass die Verschiebung nicht von ihr gekommen war. Danach legte sie Inhalator, Kalender und den Bon nebeneinander auf den Küchentisch, schrieb das Datum auf ein leeres Blatt und fuhr zu Simon, bevor die Tinte ganz trocken war.`,
  `Eva drückte zweimal, obwohl sie wusste, dass einmal reichte. Die Tür ging auf, bevor der Summer ganz verstummt war.`,
  `Simon stand im Flur, die Ärmel hochgeschlagen, ein Geschirrtuch über der Schulter. Hinter ihm roch es nach angebratenen Zwiebeln und warmem Öl.`,
  `„Komm rein."`,
  `Sie zog die Schuhe nicht aus. Im Korridor standen Milas Gummistiefel unter der Garderobe, daneben lag ihre Mütze verkehrt herum auf der Bank.`,
  `„Wo ist sie?"`,
  `„Unten. Spielplatz. Mit Frieda und ihrer Mutter." Er sah sie einen Moment an. „Reden wir kurz, bevor du runtergehst."`,
  `Sie blieb an der Küchentür stehen.`,
  `Auf der Arbeitsplatte lag ein Brett mit halbierten Trauben, daneben eine kleine blaue Trinkflasche, die Eva nicht kannte. Simon schob das Brett zur Seite und trocknete sich die Hände am Tuch.`,
  `„Also."`,
  `„Ich brauche nicht, dass du mich beruhigst", sagte Eva. „Ich brauche, dass du zuhörst."`,
  `„Ich höre zu."`,
  `Sie legte das Handy auf die Platte, aber ohne es ihm hinzuschieben. „Die Kita. Die Praxis. Der Supermarkt. Es sind jedes Mal Kleinigkeiten. Für sich nichts. Zusammen ist es zu viel."`,
  `Simon nickte nicht. Er sah auf das Display, dann wieder sie an.`,
  `„Ich weiß."`,
  `„Nein." Eva hörte ihre eigene Stimme und nahm sie sofort zurück. „Du weißt, dass etwas nicht stimmt. Das ist nicht dasselbe."`,
  `Er zog einen Stuhl mit dem Fuß zurück, setzte sich aber nicht. „Ich sage nicht, dass du dich irrst."`,
  `„Aber du glaubst mir auch nicht einfach so."`,
  `„Ich glaube, dass da etwas schief läuft." Er legte das Tuch auf die Lehne. „Und ich glaube auch, dass Mila davon gerade möglichst wenig merken sollte."`,
  `Stabilität. Er sagte das Wort nicht, aber es lag zwischen ihnen auf der Küchenplatte, zwischen dem Handy und den Trauben.`,
  `Eva sah auf die blaue Trinkflasche. Unter dem Deckel klebte ein kleiner Punktaufkleber aus der Kita, blass vom Spülen.`,
  `„Die ist neu?"`,
  `„Nora hat sie gestern mitgebracht. Für alle Fälle, hat sie gesagt."`,
  `Eva legte die Finger an den Flaschenhals und ließ sie gleich wieder los.`,
  `„Gehen wir runter", sagte Simon.`,
  `Der Spielplatz lag hinter dem Haus, zwischen Fahrradständern und zwei niedrigen Mauern. Die Sonne stand schräg über den Dächern, der Sand unter der Rutsche war dunkel vom Vortag. Mila hockte am Klettergerüst neben einem Mädchen mit roter Mütze und schob mit einem Stock eine Spur durch den Kies.`,
  `Eva setzte sich auf die Bank. Simon blieb erst stehen, die Hände in den Hosentaschen, den Blick bei Mila.`,
  `Sie sah Mila klettern, wieder herunterrutschen, den Kopf heben. Noch bevor Eva sich umdrehte, wusste sie, dass jemand auf den Hof gekommen war.`,
  `Nora trug einen dunklen Mantel und hielt einen Kaffeebecher in der Hand. In der anderen trug sie eine kleine Papiertüte vom Bäcker. Sie blieb am Zaun stehen, nicht nah genug, um dazuzugehören, nicht weit genug, um zufällig zu sein.`,
  `„Nora!", rief Mila, hell und ohne Überraschung.`,
  `Nora hob die Hand. „Na du."`,
  `Mila lief zwei Schritte auf sie zu, blieb dann stehen, als fiele ihr auf halbem Weg wieder etwas ein, und drehte sich zurück zur Rutsche. Nora lachte kurz und blieb, wo sie war.`,
  `„Entschuldigt", sagte sie. „Ich wollte nur kurz hoch und hab sie gesehen." Sie hob die Tüte ein wenig an. „Brötchen."`,
  `„Schon gut", sagte Simon.`,
  `Eva sagte nichts. Sie sah auf die Tüte, auf den Becher, auf Noras freie Hand, die ruhig am Mantel lag.`,
  `„Alles okay bei euch?", fragte Nora leise.`,
  `Eva hob den Blick.`,
  `„Wir reden nur gerade", sagte Simon, noch immer ruhig. „Nichts Dramatisches."`,
  `Nora nickte sofort. „Klar. Ich wollte wirklich nicht stören."`,
  `Sie ging einen halben Schritt zurück, blieb aber noch am Zaun stehen. Als Mila vom Gerüst herunterrief, hob Nora nur kurz die Hand, ein kleines Zeichen aus der Entfernung. Mila grinste und kletterte weiter.`,
  `Eva sah auf ihre Hände. Die Bank war warm von der Sonne. Neben ihrem Schuh lag ein pinker Haargummi im Sand, halb eingedrückt, mit einem kleinen Stoffstern daran.`,
  `Simon setzte sich neben sie. Nicht nah.`,
  `„Ich will dir nichts wegnehmen", sagte er leise.`,
  `Sie sagte nichts.`,
  `„Aber bis wir wissen, was das ist, hole ich sie diese Woche ab."`,
  `Jetzt drehte sie den Kopf.`,
  `„Nur für ein paar Tage", sagte er. „Damit wenigstens eine Sache fest ist. Du kannst sie sehen, wann du willst. Ich meine nicht dich. Ich meine das ganze Drumherum."`,
  `„Und wenn genau das der Punkt ist?"`,
  `„Dann ist es für ein paar Tage trotzdem klarer als alles andere gerade."`,
  `Er legte kurz die Hand auf ihren Unterarm. Nicht fest. Mehr Markierung als Trost.`,
  `Am Zaun sagte Nora: „Ich geh dann weiter."`,
  `Simon stand auf und rief Mila zur Schaukel. Sie kam sofort angelaufen, den Stock noch in der Hand.`,
  `„Tschüss, Nora", rief sie über die Schulter.`,
  `„Tschüss, Maus." Nora sagte es leicht, fast beiläufig.`,
  `Eva nickte, weil sie mit der Stimme nicht sicher gewesen wäre.`,
  `Nora ging zur Öffnung des Hofs. Die Brötchentüte schlug ihr gegen das Bein. Vor dem Tor drehte sie sich noch einmal um, nicht zu Eva, sondern zu Mila, die schon auf der Schaukel saß. Dann ging sie weiter.`,
  `Eva bückte sich und hob den Haargummi aus dem Sand. Sie kannte den Stern. Nora nähte solche Sterne an Kindergummis, wenn sie an langen Nachmittagen „mit den Händen beschäftigt sein musste", wie sie es nannte.`,
  `Der Stoff war noch warm.`,
  `Sie hielt den Gummi in der Faust, während Simon Mila anschob. Einmal. Noch einmal. Nicht hoch. Nur gleichmäßig.`,
  `„Höher!", rief Mila.`,
  `„Gleich", sagte Simon.`,
  `Eva steckte den Gummi in die Jackentasche. Auf der Bank neben ihr lag feiner Kaffeefleckensand, dort, wo Noras Becher eben kurz gestanden hatte.`
];

const sceneEightParagraphs = [
  `Kathrin saß schon, als Eva das Café betrat, zwei Tassen auf dem kleinen Tisch, die Hände um die ihre gelegt, als wäre sie kalt geworden beim Warten. Sie hatte sich nicht viel verändert. Derselbe gerade Pony, derselbe Blick, der einen abmaß, bevor er einen begrüßte.`,
  `"Setz dich."`,
  `Eva setzte sich. Draußen schob der Abend graue Schlieren über die Scheibe.`,
  `"Ich kann dir nichts zeigen", sagte Kathrin, bevor Eva den Mantel aufgeknöpft hatte. "Das weißt du."`,
  `"Ich will nichts sehen. Ich will wissen, ob ich mir etwas einbilde."`,
  `Kathrin rührte in ihrer Tasse, obwohl nichts mehr darin zu rühren war. "Du hast den Namen am Telefon gesagt. Ich habe aufgelegt und eine halbe Stunde im Treppenhaus gestanden. Das sollte dir reichen."`,
  `"Es reicht mir nicht."`,
  `"Eva."`,
  `"Bitte."`,
  `Kathrin sah auf ihre Hände. "Es gab einmal eine Situation. Kein Verfahren, keine Akte mit Stempeln. Eine andere Mutter. Sorgekonflikt. Beide Seiten haben Material vorgelegt."`,
  `"Und?"`,
  `"Und gar nichts. Es ist ausgegangen, wie solche Dinge ausgehen, wenn eine Seite Listen führt und die andere weint."`,
  `"Welche Seite war sie?"`,
  `Kathrin hob den Blick, kurz, fast ungehalten. "Das habe ich nicht gesagt."`,
  `"Du musst es nicht sagen."`,
  `Zwei Frauen am Nebentisch lachten über etwas auf einem Bildschirm. Kathrin wartete, bis das Lachen vorbei war.`,
  `"Bei ihr wirkte immer alles sauberer als auf der anderen Seite." Sie sagte es ohne Gewicht, als ob sie eine Beobachtung aus einem Seminar weitergäbe. "Das ist alles, Eva. Das ist wirklich alles."`,
  `Eva griff nach ihrer Tasse, um etwas in der Hand zu haben.`,
  `"Sie ist meine Notfallkontaktperson."`,
  `Kathrin sah sie an, dann weg. "Dann streich sie raus."`,
  `"Mit welcher Begründung?"`,
  `"Mit irgendeiner. Telefonnummer geändert. Neuer Arbeitgeber. Du bist erwachsen, du findest einen Satz."`,
  `Sie blieben nicht lange. Kathrin legte ihren Anteil auf den Tisch, bevor die Kellnerin kam, und berührte Evas Schulter im Vorbeigehen nicht.`,
  `Draußen regnete es inzwischen, fein, mehr Feuchtigkeit als Fall. Eva stellte sich unter das Vordach eines geschlossenen Blumenladens und zog das Handy heraus. Sie tippte Begriffe, die sie vorher nicht ausgesprochen hatte. Sorgekonflikt, Beratungsstelle, Verein, Jahr. Ergänzte Noras Nachnamen, löschte ihn wieder, schrieb ihn neu.`,
  `Foreneinträge, mehrere Jahre alt. Eine Mutter, die von einer anderen Frau schreibt, ohne Namen. Zu ruhig, zu vorbereitet, zu viel Papier. Jemand antwortet, das klinge nach Projektion. Der Faden bricht ab.`,
  `Eva scrollte. Ein Vereinsfoto, Gruppenbild vor einem Flachbau. Zweite Reihe, halb verdeckt von einer Frau mit hellem Schal, ein Gesicht, das sie auch mit Maske erkannt hätte. Nora stand nicht in der Mitte und nicht am Rand. Sie hielt ein Klemmbrett. Die Bildunterschrift nannte sie nicht.`,
  `Eva speicherte den Screenshot und ging weiter.`,
  `Die Dienststelle lag zwei Straßen weiter, Licht hinter Milchglas. Der Beamte am Tresen war jung, freundlich, geduldig auf eine Art, die Eva nicht half.`,
  `"Haben Sie einen konkreten Vorfall, den Sie anzeigen möchten?"`,
  `"Ich habe einen Eintrag in einer Kita-App, der behauptet, ich hätte mein Kind gestern abgeholt, obwohl ich es nicht war. Ich habe eine Videoaufnahme, auf der jemand zu sehen ist, der aussieht wie ich. Ich habe eine Nachbarin, die seit Jahren in meiner Notfallliste steht."`,
  `Er nickte, während er tippte. "Und Sie vermuten, dass diese Nachbarin die Abholung vorgenommen hat."`,
  `"Ich vermute, dass sie mehr tut als das."`,
  `"Haben Sie Beweise für etwas, das über den Abholvorgang hinausgeht?"`,
  `"Einzelne Dinge. In Summe."`,
  `"Listen Sie sie mir auf."`,
  `Sie listete. Er hörte zu, fragte zurück. Wann genau. In welcher Reihenfolge. Wer hat den Eintrag gesehen, wer hat ihn gegengezeichnet, gibt es eine schriftliche Vollmacht, wurde diese Vollmacht jemals widerrufen, wann und wie. Höflich, routiniert, ohne Ungeduld.`,
  `Bei der dritten Rückfrage verstand Eva, dass er nicht ihr zuhörte, sondern einem Formular.`,
  `"Ich kann Ihnen eine Gefährdungsanzeige empfehlen", sagte er. "Damit wäre aktenkundig, dass Sie sich gemeldet haben. Ohne konkreten Straftatvorwurf passiert darüber hinaus erst einmal wenig."`,
  `"Und mit Vorwurf?"`,
  `"Mit Vorwurf brauchen wir etwas, das über Ihren Eindruck hinausgeht."`,
  `Sie nickte. Sie ließ sich nichts aufschreiben.`,
  `"Möchten Sie die Empfehlung schriftlich?"`,
  `"Später vielleicht."`,
  `"Die Kollegin vom Sozialdienst hat dienstags Sprechstunde, falls Sie das Gespräch suchen wollen, bevor Sie eine Anzeige erwägen."`,
  `"Danke."`,
  `Er reichte ihr eine Karte mit einer Nummer, die sie nicht anrufen würde. An der Tür drehte sie sich noch einmal um. Er hatte die Zeile auf seinem Bildschirm schon geschlossen.`,
  `Auf der Straße lief sie schneller, als es der Regen verlangte. Die Tasche klopfte gegen ihre Hüfte.`,
  `Sie bog in ihre Straße ein. Die Fenster oben waren dunkel, wie sie sie verlassen hatte. Im Hausflur roch es nach dem Bodenreiniger, den die Hausmeisterin freitags benutzte. Eva schloss auf, hängte den Mantel an den Haken, streifte die Schuhe ab. Die Wohnung roch nach Morgen, nach dem Kaffee, den sie vor zwölf Stunden aufgesetzt hatte.`,
  `Sie ging in die Küche, um Wasser aufzusetzen.`,
  `Auf der Ablage neben der Spüle stand Milas rosa Brotdose. Gespült. Der Deckel lag daneben, nach oben geöffnet, sauber abgetrocknet.`,
  `Eva blieb stehen.`,
  `Sie hatte die Brotdose am Morgen nicht benutzt. Mila war seit dem Morgen bei Simon. Die Dose war mit den anderen Sachen mitgegangen, in der kleinen Tasche mit dem Pandaaufnäher, Eva hatte selbst zugezogen.`,
  `In der Spüle lag kein Schwamm am üblichen Rand. Er lag feucht in der Ecke, als hätte ihn jemand anders abgelegt, der nicht wusste, wohin er gehörte. Neben der Dose ein einzelner Wassertropfen, noch nicht verdunstet.`,
  `Auf dem Tisch lag ihr Schlüsselbund vom Morgen. Der Ersatzschlüssel, den sie sonst neben der Kaffeedose verwahrte, hing nicht am Haken. Sie konnte sich nicht erinnern, wann sie zuletzt nachgesehen hatte.`,
  `Die Dose. Rosa, mit den abgestoßenen Kanten, die Mila in der Kita an der Heizung aufgeschlagen hatte. Eva kannte jeden Kratzer.`,
  `Der Kühlschrank brummte an. Eva zog das Handy aus der Manteltasche und tippte Simons Namen. Der Anruf baute sich auf.`,
  `Sie sah die Dose nicht aus den Augen, während es klingelte.`
];

const sceneNineParagraphs = [
  `Das Schlüsselbrett hing neben der Garderobe, fünf Haken, beschriftet in Evas eigener Schrift. Wohnung, Briefkasten, Keller, Fahrrad, Ersatz. Am Haken Ersatz hing nichts. Sie starrte auf den leeren Messingstift, als könnte er sich nachträglich füllen, wenn sie nur lange genug hinsah.`,
  `Sie zog die Notfallmappe aus dem unteren Fach des Sideboards. Grauer Karton, Gummiband, innen Klarsichthüllen. Krankenkassenkarte, Impfpass Kopie, Kinderarzt, Vollmacht Simon, Telefonliste. Sie blätterte langsam. Die Übergabeliste aus den Trennungswochen, die sie damals in zweifacher Ausführung angelegt hatte, steckte nur noch einmal darin. Der Durchschlag fehlte. Sie blätterte rückwärts, dann vorwärts, dann rückwärts, als ob Papier aus Gewohnheit wieder auftauchen würde.`,
  `In den Trennungswochen war Nora jeden Morgen dagewesen. Sie hatte Mila übernommen, während Eva zu Terminen musste, die sie heute nicht mehr einzeln benennen konnte. Nora hatte den Ersatzschlüssel gehabt, offiziell, auf drei Wochen angesetzt, mit Datum auf einem Zettel in dieser Mappe. Der Zettel war noch da. Der Schlüssel war zurückgegeben worden, damals, an einem Samstag, mit Kaffee und einem kleinen Lachen darüber, wie überorganisiert Eva sei.`,
  `Sie legte die Mappe auf den Tisch und ging zurück zum Haken. Ersatz. Leer seit der Rückgabe, immer leer. Sie hatte das nie hinterfragt, weil sie sich eingeredet hatte, den Schlüssel in den Keller gelegt zu haben, in das Säckchen, das sie für solche Fälle beschriftet hatte.`,
  `Sie zog die Jacke an.`,
  `Das Treppenhaus war still. Die Automatik klickte, als sie das Licht drückte, und warf einen gelben Streifen bis zur Kellertür. Im Keller roch es nach kühlem Beton und alter Pappe. Ihre Umzugskisten standen in der hintersten Reihe, beschriftet mit Filzstift. Küche, Bad, Mila 1, Mila 2, Papiere, Sonstiges. Sie zog Sonstiges nach vorn, hob den Deckel. Bücher, ein Kabelknäuel, eine Keksdose aus Blech. Sie öffnete die Dose.`,
  `Das Säckchen lag obenauf. Baumwollstoff, hellblau, mit schwarzem Edding beschriftet. Ersatz Wohnung. Sie kannte ihre eigene Schrift. Sie kannte auch den Knoten, mit dem sie Beutel schloss, immer linksherum, zwei Schlaufen, eine kleine Schleife. Der Knoten vor ihr saß rechtsherum. Die Schleife fehlte.`,
  `Sie zog den Knoten auf. Der Schlüssel lag drin. Kalt, Zackenseite nach oben. Er sah aus wie ihrer. Er war ihrer.`,
  `Sie drehte das Säckchen in der Hand. Die Beschriftung war an zwei Stellen nachgezogen, das E und das W dicker als der Rest, ein anderer Schwarzton, leicht blauer. Jemand hatte den Schriftzug aufgefrischt, damit er wirkte wie vorher.`,
  `Sie setzte sich auf die Kiste. Eine Minute lang tat sie nichts. Über ihr, eine Etage höher, lief eine Heizung an und wieder aus. Das Licht im Kellergang klickte sich selbst aus. Sie blieb im Halbdunkel sitzen, den Schlüssel in der Hand, das Säckchen auf dem Knie, und zählte rückwärts die Samstage. Der Samstag mit dem Kaffee. Der Samstag danach, an dem Nora Milas Kindergartenrucksack zurückgebracht hatte, den sie bei sich vergessen hatten. Der Samstag, an dem sie zu dritt im Hof gesessen hatten und Nora gesagt hatte, sie gehe kurz hoch, Wasser holen, weil bei ihr oben die Leitung besser schmecke. Eva hatte ihr damals den Schlüssel in die Hand gedrückt, ohne nachzudenken, und ihn zurückbekommen, als Nora mit der Karaffe kam. Zwischen der Karaffe und der Hand war ein Raum gewesen. Ein paar Minuten. Mehr nicht.`,
  `Sie stand auf. Sie schloss die Kiste, schob sie zurück, drückte das Licht neu. Dann ging sie nach oben.`,
  `An der Wohnungstür blieb sie kurz stehen. Sie drückte die Klinke, probierte den Schlüssel. Er ging leicht, wie immer. Kein Klemmen. Kein Widerstand. Nichts, was man einem Laien hätte erklären können.`,
  `Sie setzte sich an den Küchentisch und tippte auf dem Handy. Schlüsseldienst Notdienst. Die erste Nummer meldete sich nach dem dritten Klingeln. Sie nannte die Adresse, sie sagte, Zylinderwechsel, heute noch. Der Mann am anderen Ende fragte nicht viel.`,
  `Vierzig Minuten später klingelte es. Der Monteur war ein ruhiger Mensch Mitte fünfzig, Stirnlampe um den Hals, Werkzeugkoffer, Blaumann. Er sah kurz auf ihre Tür, dann auf sie.`,
  `„Klemmt er?"`,
  `„Nein", sagte Eva. „Ich will einen neuen."`,
  `Er nickte, als ob das eine der häufigeren Antworten sei. Er schraubte, maß, holte einen neuen Zylinder aus dem Koffer, setzte ihn ein. Jede Bewegung war klein und geübt. Er reichte ihr drei Schlüssel auf einem Drahtring.`,
  `„Drei reichen?"`,
  `„Drei reichen."`,
  `Sie schloss zweimal ab, schloss auf, schloss wieder ab. Das Geräusch war sauber, klickend, neu. Sie bezahlte in bar, weil er das lieber hatte, und quittierte auf einem kleinen Formular mit Durchschlag. Sie hielt ihren Durchschlag einen Moment in der Hand, bevor sie ihn in die Mappe schob.`,
  `Der Monteur packte sein Werkzeug zusammen. Sie hörte die Reißverschlüsse, das leise metallische Fallen der Schraubenzieher in ihre Fächer.`,
  `Nora hatte Milas Frühstück gekannt. Nora hatte gewusst, wo die Bettwäsche lag. Nora hatte gewusst, in welcher Schublade das Fieberthermometer steckte, in welcher der Ersatzbauchnabel für die Puppe, in welcher die kleinen Pflaster mit Sternen. Sie hatte gewusst, dass Eva morgens vor dem Duschen die Kaffeemaschine startete, damit der Kaffee beim Rauskommen fertig war. Sie hatte gewusst, dass Mila am Dienstag zum Turnen die rote Leggings trug, weil die blaue in der Wäsche war. Sie hatte gewusst, dass Eva die Haustür manchmal eine halbe Minute offen ließ, wenn sie die Mülltonne vorholte. Sie hatte gewusst, welche Stufe im Treppenhaus knarrte und welche nicht.`,
  `Der neue Zylinder hielt das alles draußen. Der neue Zylinder hielt nichts davon zurück.`,
  `Der Monteur zog den Koffer vom Boden hoch. Auf dem Treppenabsatz fiel eine Tür ins Schloss, leise, eine halbe Etage tiefer. Dann Schritte. Nackte Füße auf Steinstufen machen ein bestimmtes Geräusch, flach und warm.`,
  `Nora stand im Flur, zwei Stufen unterhalb, eine Hand am Geländer. Sie trug eine graue Strickjacke über einem T-Shirt, Pyjamahose, keine Schuhe. Ihr Haar war hinten eingedrückt vom Kissen.`,
  `„Oh", sagte sie und lächelte. „Du auch?"`,
  `Eva antwortete nicht.`,
  `Nora machte eine kleine Geste in Richtung der Tür, des Monteurs, der gerade den Koffer umhängte.`,
  `„Bei mir klemmt er seit drei Tagen. Erst morgens, dann abends auch. Ich wollte erst abwarten, ob sich das gibt, aber irgendwann hat man keine Lust mehr, jedes Mal zu drücken." Sie sah den Monteur an, freundlich, wie man fremde Handwerker anschaut. „Machen Sie auch Nachbarschaftsrabatt?"`,
  `Der Monteur lächelte höflich, nicht mit.`,
  `Nora wandte sich wieder Eva zu. Ihr Blick war warm und besorgt, genau richtig dosiert.`,
  `„Bei dir auch? Seit Tagen?"`,
  `Eva stand im Rahmen ihrer eigenen Tür. Hinter ihr der neue Zylinder. Auf der Kommode die Mappe mit dem Durchschlag. In der Hosentasche das Säckchen mit dem alten Schlüssel, den Knoten falsch herum.`,
  `„Ja", sagte sie. „Seit Tagen."`,
  `Nora nickte, als hätte sie es geahnt.`,
  `„Altes Haus", sagte sie. „Irgendwann ist alles gleichzeitig dran."`,
  `Sie blieb stehen, die Hand am Geländer, barfuß, und wartete.`
];

const sceneTenParagraphs = [
  `Der Raum roch nach dem Apfelsaft, den die Kinder tagsüber getrunken hatten, und nach dem Bodenreiniger, der danach gekommen war. Eva zog sich einen der Erwachsenenstühle heran, die in einem unregelmäßigen Kreis um den Teppich standen, und setzte sich so, dass sie weder allein noch mittendrin saß. Frau Kehler, einen Platz weiter, rückte ihre Tasche auf den Schoß und lächelte kurz, ohne die Schultern zu drehen. Der Stuhl zwischen ihnen blieb leer. Niemand kommentierte es.`,
  `„Schön, dass alle da sind", sagte Petra und klatschte einmal in die Hände, wie sie es auch bei den Kindern tat. „Wir machen es kurz heute, versprochen."`,
  `Eva legte das Handy mit dem Display nach unten auf ihren Oberschenkel. Sie nickte, als Petra die Schließtage im Dezember ansprach, nickte bei der Bitte um neue Hausschuhe in Größe 29 bis 32, nickte bei der Frage nach einem Vertreter für den Sommerfestausschuss. Zwei Väter lachten über einen Witz, den sie nicht mitbekommen hatte. Frau Kehler schrieb etwas in ein kleines Heft. Der Stift kratzte leise.`,
  `Eine Mutter gegenüber, die Eva nur vom Sehen kannte, suchte ihren Blick und ließ ihn wieder los, bevor er richtig angekommen war.`,
  `„Und dann", sagte Petra und tippte mit dem Filzstift an die Tafel hinter sich, „haben wir in vierzehn Tagen unseren ersten richtigen Waldtag für die Vorschulgruppe. Das ist neu in dem Format. Wir gehen früh los, wir bleiben bis zum späten Mittag draußen. Bitte denken Sie an feste Schuhe und vor allem an eine regenfeste Hose. Gummistiefel sind gut, reichen aber nicht, wenn es wirklich durchnässt."`,
  `Auf Evas Oberschenkel vibrierte das Handy.`,
  `Sie ließ es liegen. Petra erklärte den Sammelort, die Uhrzeit, die Telefonkette für den Fall eines Sturms. Ein Vater fragte nach dem Rucksackgewicht. Eine Mutter wollte wissen, ob Lunchpakete gestellt würden. Petra antwortete ruhig, methodisch, punktweise. Hinter ihr stand in blauer Kreide **Waldtag** an der Tafel, und darunter, frisch geschrieben, *regenfest!* mit Ausrufezeichen.`,
  `Eva drehte das Handy um.`,
  `*Hey, ich hab dir zufällig schon eine regenfeste Hose für Mila mitgebracht. Größe stimmt, hab ich letzte Woche anprobiert. Liegt bereit, wenn du sie brauchst. N.*`,
  `Der Zeitstempel stand bei 19:42.`,
  `Eva las die Nachricht zweimal. Beim zweiten Mal hatte Petra hinten den Satz neu begonnen. Beim dritten Mal zitterte die Hand nicht mehr, mit der sie das Handy hielt.`,
  `„Frau Berger?" Petra sah zu ihr herüber, freundlich, als hätte sie gerade eine Frage gestellt. „Bekommen wir Sie für den Sammelpunkt um acht?"`,
  `„Ja", sagte Eva. „Ja, acht geht."`,
  `Ihre Stimme klang normal. Das half nicht.`,
  `Sie schrieb nichts zurück. Sie schaltete den Bildschirm aus und sah zu Petra, die jetzt über das Schuhregal im Flur sprach, das umgebaut werden sollte, damit die Vorschulkinder ihre Sachen selbst erreichten. Eva hörte die Worte. Sie hörte nicht zu.`,
  `Vierzehn Tage. Petra hatte gerade gesagt, der Waldtag sei in vierzehn Tagen. Die Nachricht war eine Minute später gekommen. Letzte Woche, stand darin. Letzte Woche hatte Nora eine regenfeste Hose in Milas Größe anprobiert, für einen Tag, von dem die Eltern heute zum ersten Mal hörten.`,
  `Neben ihr raschelte Frau Kehler mit ihrem Mantel, legte ihn sich über die Knie, strich ihn glatt. Eva sah den Stoff und den Faltenwurf und versuchte, den Blick dort zu halten.`,
  `„Fragen?" sagte Petra. „Sonst lassen wir Sie gehen."`,
  `Ein paar höfliche Fragen noch, Stühle schoben, Taschen raschelten. Eva stand auf, strich ihren Mantel glatt, der noch über der Lehne hing, und ging zu Frau Kehler, weil sie irgendwohin gehen musste, um nicht als Erste nach draußen zu treten.`,
  `„Schön, dass Sie da waren", sagte Frau Kehler.`,
  `„Mila freut sich auf den Waldtag", sagte Eva, obwohl Mila noch nichts davon wusste.`,
  `„Ja." Frau Kehler lächelte. „Und? Übernimmt Nora morgen wieder die Abholung, oder kommen Sie selbst?"`,
  `Eva brauchte einen Moment.`,
  `„Ich komme selbst."`,
  `„Ach so." Frau Kehler nickte zu schnell. „Dann habe ich das missverstanden. Sie macht das ja oft so schön."`,
  `„Ja", sagte Eva, „das tut sie."`,
  `Sie ging, bevor Frau Kehler noch etwas sagen konnte. Im Flur hingen die Jacken an den kleinen Haken, und an Milas Haken hing eine dünne Strickjacke, hellgrau, mit Holzknöpfen, die Eva nicht gekauft hatte. Sie blieb kurz davor stehen, ließ die Jacke hängen, ging weiter.`,
  `Draußen war die Luft kühler, als Eva erwartet hatte. Zwei Mütter unterhielten sich neben dem Tor, sie verstummten, als Eva vorbeikam, und nahmen das Gespräch einen Satz zu spät wieder auf. Eva ging zu Fuß, obwohl sie mit dem Fahrrad gekommen war. Das Rad konnte sie morgen holen. Sie brauchte den Weg.`,
  `In der Jackentasche lag das Handy schwer. Zweimal hob sie die Hand, zweimal ließ sie sie wieder sinken. Sie wusste nicht, was sie Nora schreiben sollte, ohne ihr den Waldtag zu bestätigen. Sie wusste auch nicht, was sie schreiben sollte, ohne ihn zu bestätigen.`,
  `An der Haustür suchte sie den Schlüssel. Der neue Zylinder saß noch stramm, sie musste zweimal ansetzen. Im Treppenhaus roch es nach dem Essen, das die Nachbarn von oben gekocht hatten, etwas mit Zwiebeln, etwas Warmes. Ihre Wohnungstür lag im Halbdunkel des Zwischengeschosses, weil der Bewegungsmelder sich immer erst zündete, wenn man schon fast davor stand.`,
  `Das Licht ging an.`,
  `Vor der Tür, auf der Fußmatte, genau in der Mitte, lag ein gefaltetes Bündel. Dunkelgrün, mit hellen Nähten. Eine Kinderregenhose in Milas Größe, einmal längs, einmal quer gelegt, die Träger ordentlich darübergeschlagen. Kein Zettel. Keine Tüte. Nichts, was sich im Treppenhaus verhakt hatte.`,
  `Eva blieb stehen, die Schlüssel in der Hand.`,
  `Im Hof unten fiel eine Tür ins Schloss. Irgendwo klapperte jemand mit einem Mülldeckel. Eva bückte sich nicht sofort. Sie sah auf die Hose, auf die saubere, symmetrische Faltung, auf den schmalen Schmutzstreifen, den der Stoff an der rechten Kante abbekommen hatte, weil er mit der Kante die Matte berührte.`,
  `Sie zog das Handy aus der Manteltasche. Die Nachricht von Nora stand noch offen. 19:42.`,
  `Eva machte ein Foto von der Hose, wie sie lag. Eins von oben, eins schräg. Sie fotografierte die Matte, den Türrahmen, den leeren Briefkastenschlitz, die Treppenstufen nach oben und nach unten. Dann erst hob sie die Hose auf, trug sie mit den Fingerspitzen in die Wohnung, legte sie auf den Küchentisch, ohne sie auseinanderzufalten.`,
  `Auf dem Etikett innen stand in Filzstift, in einer ruhigen, leicht nach links geneigten Schrift: **Mila B.**`,
  `Eva setzte sich nicht. Sie stand am Tisch, die Hände flach auf der Arbeitsplatte daneben, und sah die Hose an, bis das Licht im Treppenhaus draußen wieder ausging.`,
  `Dann nahm sie das Handy, öffnete den Chat, schrieb *Danke* und löschte es wieder. Sie schrieb *Woher wusstest du das mit dem Wald* und löschte es auch. Am Ende legte sie das Telefon mit dem Display nach unten neben die Hose, holte sich ein Glas Wasser, trank es nicht aus und stellte es neben die Spüle.`,
  `Im Kalender an der Kühlschranktür war der morgige Tag leer. Sie nahm den Stift, der am Magneten hing, und schrieb in das Feld von morgen, in Großbuchstaben, *ICH HOLE MILA*, und setzte einen Punkt darunter, der zu fest geriet und einen kleinen Krater in das Papier drückte.`,
  `Dann erst faltete sie die Hose auseinander.`,
  `Sie war trocken, gebügelt, das Etikett innen glatt. An der linken Kniekehle, in einer Naht, steckte ein einzelnes helles Haar. Nicht Noras Farbe. Mila.`
];

const sceneElevenParagraphs = [
  `Eva setzte die Kopfhörer auf und stellte das Handy mittig auf den Küchentisch, als wäre es etwas, das man in Abstand halten musste. Die Teetasse daneben war längst kalt. Sie öffnete die Voicemailbox und scrollte bis ans Ende, dorthin, wo die ältesten Aufnahmen standen. März, Februar, Januar. Noch weiter. Noch vor Simons Auszug.`,
  `Sie begann von unten.`,
  `Die ersten drei Nachrichten waren harmlos. Mila hatte Fieber, sie sagte der Kita ab. Ein Elterngespräch verschoben. Ein Geburtstagsgeschenk besprochen. Eva hörte ihre eigene Stimme, flach, ein bisschen müde, mit dem Sprachduktus einer Frau, die zwischen zwei Terminen telefonierte.`,
  `Dann eine, die sie nicht mehr im Kopf hatte. Eine Sprachnachricht an Nora, vor fünf Monaten. Im Hintergrund Mila, die sang. Evas Stimme sagte: „Du, kannst du das kurz an die Ursula weitergeben, ich bin heute nicht am Zaun. Sag einfach, Mila kommt morgen wieder, danke dir."`,
  `Sie spulte zurück. Spielte es noch einmal ab.`,
  `„Sag einfach, Mila kommt morgen wieder, danke dir."`,
  `Ihre Finger schlossen sich enger um das Handy. Sie legte es auf den Tisch. Nora war damals reingekommen, hatte Mila einen Apfel mitgebracht, und irgendwann zwischen Apfel und Jacke hatte sie gesagt, sie gehe eh nachher am Zaun vorbei. Eva hatte nur gemurmelt, und Nora hatte gelacht. Sag's nochmal kurz, dann leite ich es weiter.`,
  `Sie öffnete die Galerie.`,
  `Hofvideos. Mila auf dem Bobbycar, Mila mit Kreide, Mila beim Seifenblasenmachen. Eva scrollte und hörte nur den Ton mit. Kinderstimmen, Autos von der Straße, das Klingen der Hoftür. In einem Clip sagte sie aus dem Off: „Mila, wir müssen in zehn Minuten los zur Kita." Ein paar Clips weiter, eine andere Situation, anderer Pullover, anderes Wetter: „Ich hol dich heute um drei, okay?" Und noch einmal, Wochen später, am Sandkasten, im Hintergrund Noras ruhiges Lachen: „Dann ist gut, danke. Ich sag morgen Bescheid."`,
  `Eva blieb am Standbild hängen. Noras Hand am Rand des Bildes, das Handy in der anderen. Aufnahme an. Immer Aufnahme an, wenn es lustig war, wenn Mila etwas Süßes sagte, wenn die Sonne gut stand.`,
  `Sie suchte weiter. Sechster Hofclip, vorletzter Sommer. Mila im Pool, Plastikblau, der Rasen hinter dem Paketkasten. Noras Stimme, nah am Mikro, fast vertraulich: „Sag's nochmal kurz, dann leite ich es weiter." Und Evas eigene Stimme, fröhlich, mit dem Tonfall einer Frau, die nebenbei telefonierte: „Ich hab Mila schon, alles gut, danke."`,
  `Eva drückte Pause. Drückte wieder Play.`,
  `„Ich hab Mila schon, alles gut, danke."`,
  `Sie stand auf, zog die Kopfhörer heraus, ließ sie baumeln. Die Kühlschrankpumpe lief. Sie griff nach der Strickjacke über der Stuhllehne und ging runter.`,
  `Der Innenhof lag in diesem fahlen Licht, das die Bewegungsmelder nur gaben, wenn jemand durchging. Eva setzte sich auf die Bank am Fliederstrauch, dort, wo Nora meistens gesessen hatte. Von hier aus sah man die Fenster ihrer Wohnung, den Paketkasten, die Einfahrt.`,
  `Sie spielte den Clip noch einmal ab, jetzt ohne Kopfhörer, über den Lautsprecher, leise. Die Aufnahme klang im Hof anders als in der Küche. Der Hall zwischen den Backsteinmauern, das leichte Rauschen der Straße dahinter, das entfernte Klacken eines Rolladens zwei Stockwerke höher. Genau so hatten ihre Sätze geklungen, als sie sie aussprach. Genau so würden sie klingen, wenn jemand sie durchs Telefon hörte.`,
  `Eva hielt das Handy auf Kniehöhe, wie es Nora gehalten hatte. Sie sah sich selbst dort sitzen, an einem der warmen Tage, mit einer Selterflasche und dem Blick in Milas Richtung. Nora mit der Kamera-App offen. Nora, die sagt: Sag's nochmal kurz.`,
  `Sie sagte's nochmal kurz. Immer.`,
  `Sie ging die Nachrichten im Kopf durch, die sie Nora über die Monate geschickt hatte. Dutzende. Vielleicht hundert. Absagen, Zusagen, kleine Abstimmungen, kurze Formeln, immer derselbe Tonfall, weil man mit Nora nicht groß erklärte. Nora erledigte. Nora leitete weiter. Nora war der Puffer zwischen Eva und einer Welt, die zu viele Zeitfenster wollte.`,
  `Sie spulte in der Liste hoch, blieb an einer Nachricht von Ende April hängen. „Nora, du Liebe, Mila ist schon bei mir, alles gut, danke." Mitte Juni: „Ich hab Mila schon, alles gut, danke dir." Anfang September: „Mila hab ich, alles gut, danke."`,
  `Dreimal fast dasselbe. Einmal im Hof gesprochen, mit Hall. Einmal vom Spielplatz, mit Wind. Einmal aus dem Auto, mit Motor im Hintergrund. Immer der gleiche kurze Schluss, weil Eva so sprach, weil es ihre Formel war, ohne dass sie je daran gedacht hätte, sie zu variieren.`,
  `Sie ging nach oben. Im Flur zog sie die Schuhe nicht aus. Sie öffnete die Kita-App, Abholprotokoll vom Vortag. Sie kannte es inzwischen auswendig, las es trotzdem noch einmal, Zeile für Zeile. Unten, in der Spalte, die die Erzieherinnen für besondere Bemerkungen nutzten, stand Ursulas Formulierung, in die App getippt:`,
  `Mutter telefonisch: Ich hab Mila schon, alles gut, danke. Keine Rückfrage nötig.`,
  `Eva legte das Handy flach auf die Tischplatte. Sie zog die Sprachnachricht aus dem Pool-Sommer wieder hoch und spielte sie ab. Dann las sie Ursulas Zeile noch einmal. Dann spielte sie die Aufnahme ab. Dann las sie.`,
  `Wort für Wort dieselbe Formel. Dieselbe Reihenfolge. Derselbe kleine, lakonische Schluss, das danke am Ende, das Eva so oft sagte, dass sie es nie als ihres bemerkt hatte.`,
  `Sie öffnete die Datei, markierte sie, lud sie in die Cloud. Dann lud sie sie noch einmal in einen zweiten Ordner, den sie eigens dafür anlegte. Sie nannte ihn nicht Beweise. Sie nannte ihn gar nicht, ließ das Feld leer.`,
  `Sie dachte an Ursula am Zaun, an ihr vorsichtiges Lächeln bei der Übergabe, an die Art, wie sie Mutter telefonisch notiert hatte. Nicht Frau Berger telefonisch. Mutter. Als wäre das Wort die Bestätigung. Ursula hatte eine Stimme gehört, die sie kannte. Hall vom Hof, das kurze Rauschen einer Straße, drei Wörter, die sie hundertmal gehört hatte, weil Eva sie hundertmal so sagte. Sie hatte nicht geprüft. Warum sollte sie. Es klang nach Eva.`,
  `Im Kinderzimmer lag Mila quer. Ein Arm über dem Stoffhasen, der andere aus der Decke. Ihr Atem ging ruhig, in dem gleichmäßigen, leicht pfeifenden Rhythmus, den Eva seit Jahren einschätzen konnte, ohne hinzusehen.`,
  `Eva setzte sich auf den Teppich, den Rücken ans Bett. Sie legte das Handy mit dem Display nach unten auf den Boden neben sich. Draußen ging jemand durch den Hof. Der Bewegungsmelder sprang an, warf für zwei Sekunden Licht an die Zimmerdecke, ging wieder aus.`,
  `Sie lauschte, bis die Schritte verklungen waren, und sah auf Milas Hand.`
];

const sceneTwelveParagraphs = [
  `Der Anruf kam um sieben Uhr zweiundzwanzig, als Eva den Kaffee noch nicht aufgegossen hatte. Simons Name auf dem Display, nicht Nachricht, sondern Anruf, und das allein hieß, dass er etwas besprechen wollte, bevor er es tat.`,
  `„Eva, hör mal." Seine Stimme hatte diesen Ton, den sie kannte, sachlich, leicht vorbereitet, als hätte er zwei Sätze schon im Kopf geordnet. „Nora hat mich gestern Abend angerufen."`,
  `Sie stellte die Kanne zurück auf die Platte.`,
  `„Sie hat einen Vorschlag gemacht. Ich finde ihn vernünftig, deshalb rufe ich an, bevor irgendwas läuft."`,
  `„Was für einen Vorschlag."`,
  `„Solange die Sache mit der Kita nicht geklärt ist, hat sie angeboten, bei Engpässen einzuspringen. Nur Bring- und Holwege. Wenn es bei dir mal knapp wird mit dem Projekt oder bei mir mit der Schicht, ruft man sie an, sie geht kurz rüber."`,
  `Eva legte die Hand flach auf die Arbeitsplatte.`,
  `„Simon."`,
  `„Ich weiß, wie das klingt."`,
  `„Du weißt nicht, wie das klingt."`,
  `„Eva." Eine kleine Pause. „Sie ist der eingetragene Notfallkontakt. Sie wohnt im selben Hof. Sie hat Mila seit drei Jahren ab und zu mitgenommen. Das ist nichts Neues."`,
  `„Das ist jetzt neu."`,
  `„Warum?"`,
  `Sie atmete einmal durch die Nase. Jedes Wort, das sie jetzt sagte, würde in seinem Kopf unter „überreagiert" abgelegt werden, wenn sie nicht aufpasste.`,
  `„Weil die Sache mit der Abholung nicht geklärt ist. Weil ich gerade versuche zu verstehen, wie jemand, der nicht ich war, dort unterschrieben hat. Und weil wir bis dahin nicht ausgerechnet die Person formalisieren, die…`,
  `„Die was, Eva."`,
  `„Die in der Nähe war. Immer."`,
  `Er schwieg zwei Sekunden. Dann: „Du sagst, Nora hat damit etwas zu tun?"`,
  `„Ich sage, ich weiß es nicht. Und solange ich es nicht weiß, kann ich ihr keine Abholrechte geben."`,
  `„Es sind keine Rechte. Es ist ein Angebot."`,
  `„Wenn es einmal läuft, ist es eine Routine."`,
  `Wieder das kurze Schweigen, in dem er überlegte, wie er sie beruhigen sollte, ohne ihr recht zu geben.`,
  `„Hör zu. Ich habe ihr gesagt, dass sie Mila nirgends allein übernimmt, ohne dass einer von uns das direkt bestätigt hat. Nicht per Nachricht. Direkt. Anruf, Stimme, ja. Dann ist das sauber."`,
  `Er klang zufrieden mit diesem Satz. Sie hörte es an der Art, wie er danach Luft holte.`,
  `„Simon."`,
  `„Das ist doch genau das, was du willst. Klarheit darüber, wann sie wo ist."`,
  `„Das ist keine Klarheit. Das ist eine Tür, die du halb offen lässt."`,
  `„Eva, bitte." Jetzt der andere Ton, der, den er beim Paartherapeuten gelernt hatte. „Ich mache das nicht gegen dich. Ich versuche, dass Mila einen normalen Dienstag hat, während wir das hier sortieren. Sie kann nicht auf unsere Krise warten."`,
  `Sie nahm das Telefon und ging durch die Küchentür in den Hof.`,
  `Der Morgen war kühl, das Pflaster feucht, die Mülltonnen standen schon an der Einfahrt. Bei Nora brannte kein Licht. Eva stellte sich mit dem Rücken zur Hofmauer, sodass sie die Fenster der gegenüberliegenden Wohnungen im Blick hatte.`,
  `„Und was sagst du Petra?", fragte sie.`,
  `„Was soll ich Petra sagen."`,
  `„Wenn in der Kita jemand fragt, wer Mila heute holt."`,
  `„Normalerweise du. An meinen Tagen ich. Bei Engpass Nora, nach Anruf."`,
  `„Du hast das schon gesagt."`,
  `„Nein." Eine Pause. „Nora meinte, es wäre gut, wenn die Kita weiß, dass sie im Zweifel verfügbar ist. Damit es nicht wieder dieses Durcheinander gibt."`,
  `Eva schloss kurz die Augen.`,
  `„Simon. Hör dich selbst an."`,
  `„Was."`,
  `„Du planst gerade die nächste Woche um sie herum."`,
  `„Ich plane um Mila herum."`,
  `Sie ließ das stehen. Jeder weitere Satz würde sie kleiner machen.`,
  `Im Hintergrund bei ihm klapperte etwas, eine Schranktür, dann Milas Stimme, zu weit weg für Worte, nur der Tonfall, fragend, erwartungsvoll.`,
  `„Sie ist schon wach", sagte er, schon weicher. „Willst du sie kurz?"`,
  `„Ja."`,
  `Sie hörte, wie er den Hörer weitergab, die kleine Anstrengung, bis Mila das Telefon ans Ohr bekam, das Rauschen an ihrer Wange.`,
  `„Mama?"`,
  `„Hallo, Spatz."`,
  `„Papa macht Grießbrei."`,
  `„Das ist gut."`,
  `„Mama." Eine kurze Pause, in der Mila offensichtlich etwas sortierte. „Ist heute Nora-Montag?"`,
  `Eva hielt die Luft an.`,
  `„Was?"`,
  `„Nora-Montag. Wenn du arbeitest lang. Dann holt Nora. Ist heute wieder so?"`,
  `„Heute ist Dienstag, Spatz."`,
  `„Ich weiß." Mila klang geduldig, als erklärte sie einer langsamen Erwachsenen den Kalender. „Aber kommt das wieder. Das Nora-Montag."`,
  `Im Hof bewegte sich etwas hinter Noras Küchenfenster. Nur der Schatten eines Vorhangs, der sich legte.`,
  `„Wer hat das so genannt", fragte Eva, so ruhig sie konnte.`,
  `„Nora. Damit ich weiß, wann."`,
  `„Und an welchen Montagen war das."`,
  `„Weiß nicht. Wenn du lang arbeitest."`,
  `Eva hörte Simon im Hintergrund etwas sagen, freundlich, Richtung Mila, etwas mit Löffel und Tisch.`,
  `„Spatz, gib Papa nochmal."`,
  `„Tschüss Mama."`,
  `„Tschüss."`,
  `Das Rascheln, dann Simons Stimme, wieder nah.`,
  `„Alles gut?"`,
  `„Simon. Was ist Nora-Montag."`,
  `Ein Moment, in dem er wirklich überlegte.`,
  `„Das weiß ich nicht."`,
  `„Mila sagt, Nora holt sie manchmal, wenn ich lang arbeite."`,
  `„Eva, das kann nicht oft sein. Das wüsste ich."`,
  `„Sie nennt es so, als wäre es ein Wort."`,
  `„Kinder nennen alles irgendwie."`,
  `„Nein."`,
  `Sie hörte, wie er sich setzte. Das leise Ächzen seines Küchenstuhls, das sie immer noch erkannte.`,
  `„Ich frag sie später nochmal", sagte er. „In Ruhe."`,
  `„Frag sie nicht. Ich mache das."`,
  `„Okay."`,
  `Stille. Nora sah sie immer noch nicht, aber das Fenster war jetzt einen Spalt offen, und vorhin war es zu gewesen.`,
  `„Simon. Kein Einspringen. Nicht diese Woche. Nicht bevor ich mit Petra fertig bin."`,
  `„Eva…`,
  `„Kein Einspringen. Sag ihr das heute."`,
  `Er atmete aus. „Ich sage ihr, dass wir vorerst bei der alten Regelung bleiben."`,
  `„Sag es klar."`,
  `„Ich sage es."`,
  `„Simon."`,
  `„Ja."`,
  `„Nicht per Nachricht."`,
  `Eine kleine Pause.`,
  `„Anruf, Stimme, ja", sagte er, und sie hörte, dass ihm erst in diesem Moment auffiel, dass er sich seinen eigenen Satz von vorhin zurückgeben ließ.`,
  `Sie legte auf, bevor er das Gespräch selbst beenden konnte.`,
  `Auf dem Pflaster vor ihren Füßen lag ein einzelnes Lindenblatt, noch grün, an den Rändern braun. Sie hob es nicht auf. Oben klappte Noras Fenster leise zu.`,
  `In der Küche piepste die Kaffeemaschine, die sie nie eingeschaltet hatte.`,
  `Eva ging hinein, zog den Stecker, wickelte das Kabel um den Sockel und stellte das Gerät auf die Anrichte neben der Spüle. Dann holte sie ein Blatt aus dem Drucker und schrieb mit der Hand, weil die Hand sich nicht so leicht überschreiben ließ wie eine App.`,
  `Dienstag. Sieben Uhr achtundzwanzig.`,
  `Darunter: Simon schlägt vor, dass Nora bei Engpässen Bring- und Holwege übernimmt. Ich lehne ab. Er sagt zu, diese Woche bei der alten Regelung zu bleiben und es Nora heute direkt zu sagen.`,
  `Darunter, in einer zweiten Zeile, kleiner: Mila nennt Montage mit Nora „Nora-Montag". Stand mir nicht bekannt.`,
  `Sie sah auf das Wort, das sie nicht gekannt hatte, und unterstrich es einmal.`
];

const sceneThirteenParagraphs = [
  `Milas Zimmer bei Simon roch nach dem neuen Weichspüler, den Eva nicht ausgesucht hatte. Auf dem Bett lag die Dienstagstasche, der blaue Stoffrucksack mit dem Bärenanhänger, zugeschnürt, die Kordeln in einer ordentlichen Schleife.`,
  `„Ist alles drin", sagte Simon aus dem Flur. Er lehnte im Türrahmen, ein Geschirrtuch über der Schulter. „Brotdose, Wechselsachen, Turnbeutel. Ich hab's heute Nachmittag gemacht."`,
  `„Ich schau trotzdem."`,
  `„Eva."`,
  `Sie setzte sich auf die Bettkante und zog die Schleife auf. Simon blieb noch einen Moment stehen, dann hörte sie ihn in der Küche mit dem Wasserhahn hantieren.`,
  `Sie kippte die Tasche nicht aus. Sie holte einzeln heraus, was darin war, und legte es neben sich auf die Decke, in der Reihenfolge, in der sie es selbst gepackt hätte. Ganz oben der dünne Regenanorak, gefaltet mit den Ärmeln nach innen. Darunter die Brotdose, die grüne mit dem Klickverschluss, auf dem Deckel das weiße Pflaster mit „Mila B., Gr. 1" in ihrer eigenen Druckschrift, das sie vor Wochen aufgeklebt hatte. Sie zog den Deckel ab. Apfelschnitze, bereits mit Zitrone benetzt. Ein halbes Dinkelbrötchen, Butter, Käse. Gurkensticks. Keine Tomate, weil Mila seit dem Sommer keine Tomaten mehr im Brot aß.`,
  `Eva legte den Deckel zurück.`,
  `Darunter die Trinkflasche, gefüllt, fingerbreit unter dem Rand. Ein Paar Ersatzsocken, die grauen mit dem roten Punkt an der Ferse, gerollt, nicht zusammengelegt. Sie rollte Socken immer. Ein kleines Etui mit drei Pflasterstreifen, zwei Kinderpflaster mit Sternen, ein neutrales. Zwei plus eins, weil sich Mila in der Gruppe manchmal mit einem anderen Kind teilte und dann eins zu wenig übrig war.`,
  `In der Seitentasche das Päckchen Papiertaschentücher. Im Reißverschlussfach der Sporthosen-Beutel für Donnerstag, schon vorbereitet.`,
  `Jedes Teil, das sie herausgezogen hatte, lag genau dort, wo sie es hingelegt hätte. Nicht ungefähr. Exakt.`,
  `„Und?", rief Simon aus der Küche. „Fehlt was?"`,
  `„Nein."`,
  `Sie griff noch einmal in die Haupttasche, tastete am Boden. Papier. Ein gefaltetes Stück, kariert, aus einem Küchenblock. Sie faltete es auf.`,
  `*Di: Turnbtl Do nicht vergessen. Apfel m. Zitr. Socken grau. Pfl. 2+1. Wenn Regen: Gummis extra. Kuscheli nur wenn nötig.*`,
  `Ihre Handschrift. Die eckigen Ds, die sie als Kind geübt hatte. Die Abkürzungen, die sie seit Jahren auf Einkaufszettel schrieb. Pfl. 2+1 war ein Kürzel, das sie nur für sich selbst benutzte. Sie hatte es niemandem erklärt.`,
  `Sie las den Zettel zweimal. Beim dritten Mal blieb sie am vorletzten Wort hängen.`,
  `*Kuscheli.*`,
  `Sie sagte Kuscheltier. Mila sagte Kuscheltier. Simon sagte, wenn überhaupt, der Bär. Niemand in diesem Haushalt sagte Kuscheli.`,
  `Nora sagte Kuscheli. Nora sagte es seit Mila zwei war, mit diesem weichen i am Ende, das alles klein machte. Nora sagte Pulli, Jäckchen, Füßchen, und sie sagte Kuscheli, wenn sie nach Mila im Hof rief und das Stofftier vom Sandkastenrand mitnehmen sollte.`,
  `Eva legte den Zettel flach auf ihr Knie.`,
  `„Simon."`,
  `Er kam barfuß durch den Flur, das Geschirrtuch jetzt in der Hand. „Was."`,
  `Sie reichte ihm den Zettel, ohne etwas zu sagen.`,
  `Er las. Hob die Augenbrauen. „Ja. Das ist doch deine Schrift."`,
  `„Ich habe den nicht geschrieben."`,
  `Er las noch einmal. Sein Blick ging das Papier entlang wie eine Einkaufsliste, die man abhakt. „Das ist deine Schrift, Eva. Das sind deine Abkürzungen. Pfl. 2+1. Wer soll das sonst schreiben."`,
  `„Lies das vorletzte Wort."`,
  `„Kuscheli." Er zuckte die Schultern. „Ja."`,
  `„Ich sage das nie."`,
  `Er sah sie an. Nicht böse. Geduldig.`,
  `„Vielleicht hast du's mal geschrieben, weil Mila das so sagt."`,
  `„Mila sagt Kuscheltier."`,
  `„Eva." Er gab ihr den Zettel zurück. „Das ist ein Zettel. Im Rucksack. Mit deiner Schrift. Mit allem, was du eh machst." Er strich sich mit der Hand über den Nacken. „Ich weiß nicht, ob das wirklich reicht, um den Abend damit zu füllen."`,
  `„Ich habe die Tasche nicht gepackt."`,
  `„Ich hab sie gepackt. Heute Nachmittag. Ich hab die Sachen reingetan, die im Schrank lagen. Vielleicht lag der Zettel schon in der Seitentasche von letzter Woche."`,
  `„Die Äpfel sind mit Zitrone."`,
  `„Ja, das mache ich jetzt auch so. Hast du mir gezeigt." Er sah auf die aufgereihten Dinge neben ihr. „Eva. Es ist alles da. Es ist alles richtig. Kannst du das nicht einfach als Entlastung nehmen."`,
  `Sie faltete den Zettel wieder zusammen, entlang der ursprünglichen Kanten. Steckte ihn zurück in das Innenfach, aus dem sie ihn geholt hatte. Legte die Socken zurück, die Pflaster, die Flasche, die Brotdose, den Anorak. In ihrer Reihenfolge. In seiner Reihenfolge. Sie konnte die beiden nicht mehr voneinander trennen.`,
  `Sie zog die Kordeln fest und knotete die Schleife.`,
  `„Ich nehm sie mit."`,
  `„Warum."`,
  `„Ich pack morgen früh neu."`,
  `Er öffnete den Mund, schloss ihn wieder. „Okay."`,
  `Sie hängte sich den Rucksack über eine Schulter. Mila schlief im Nebenzimmer, das Nachtlicht warf einen gelben Streifen auf den Flurboden. Eva ging an der Tür vorbei, ohne sie zu öffnen. An der Wohnungstür drehte sie sich nicht um. Simon sagte nichts, also sagte sie auch nichts.`,
  `Im Treppenhaus roch es nach dem Putzmittel der Hausmeisterin. Der Bewegungsmelder sprang an, als sie auf den ersten Absatz trat. Oben stand Simon noch im Türrahmen, sie hörte es an der Art, wie seine Tür nicht zufiel. Sie ging weiter, Stufe für Stufe, den Rucksack vor dem Bauch, eine Hand am Geländer.`,
  `Auf dem zweiten Absatz hörte sie seine Tür ins Schloss gehen. Leise. Höflich. Die Tür von jemandem, der zurück zu seinem Geschirrtuch ging, zum Wasserhahn, zu dem Abend, den er sich vorgestellt hatte, bevor sie geklingelt hatte. Die Tür von jemandem, der mit einer vernünftigen Frau geredet hatte und mit einer, die aus einem Wort auf einem Zettel einen Abend machte.`,
  `Auf der letzten Stufe hielt sie kurz an. Der Rucksack war leicht. Sie hatte ihn unten schon wieder genauso gepackt wie Nora.`
];

const sceneFourteenParagraphs = [
  `Eva schob den Brotkorb, die Wachsmalstifte und Milas halb ausgemalten Regenbogen an den Tischrand. Der Apfelrest ging in den Müll, das klebrige Messer in die Spüle. Sie wischte die Platte zweimal, einmal feucht, einmal trocken, bis das Holz wieder matt wurde.`,
  `Dann der Laptop. Daneben ein Stapel unbeschriebenes Papier, den sie seit Wochen nicht angerührt hatte. Vier Stifte aus Milas Mäppchen: rot, gelb, grün, blau. Block, Lineal, die Kita-App auf dem Handy, offen auf dem Benachrichtigungsverlauf. Draußen kein Geräusch mehr, nur der Kühlschrank, der sich alle paar Minuten räusperte. Im Nebenzimmer atmete Mila flach durch den leicht offenen Türspalt, ein Rhythmus, an dem Eva sich seit sechs Jahren die Uhrzeit ersetzte.`,
  `Sie öffnete ein leeres Dokument. Fünf Spalten. Uhrzeit. Ort. Objekt. Nachricht. Zeuge. Was sie morgen auf Petras Schreibtisch legte, sollte aussehen wie ein Projektplan, nicht wie der Brief einer aufgelösten Mutter.`,
  `Erster Eintrag, oben.`,
  `Mittwoch, 15:42. Kita. App-Vermerk „bereits abgeholt durch berechtigte Person, Unterschrift vorhanden". Nachricht an Simon 15:47. Zeugin: Frau Kessler, Erzieherin Gruppe Bären.`,
  `Sie schrieb weiter, ohne aufzusehen. Dienstag davor, 07:12, Hof. Nora am Briefkasten, Mila habe ihr „schon Tschüss gesagt", bevor Eva aus der Tür trat. Objekt: Milas rote Mütze, die Eva noch in der Hand hielt. Nachricht: keine. Zeugen: keine, außer Nora selbst.`,
  `Montag, 16:55, Spielplatz Grünstraße. Nora mit einem Becher Tee, den Eva nicht bestellt hatte, und der Bemerkung, Mila sei seit zehn Minuten da. Objekt: Tee in Evas eigenem Thermobecher, der am Morgen in Evas Küche gestanden hatte. Nachricht: eine Sprachnachricht Nora, 16:31, „ich geh schon mal vor". Zeugin: eine Mutter vom Schwimmkurs, Name offen.`,
  `Freitag, 14:05, Kinderarzt Dr. Halm. Nora im Wartezimmer, „nur zufällig", mit Milas Impfpass, den Eva im Flur liegen gelassen hatte. Objekt: Impfpass. Nachricht: keine. Zeugin: Arzthelferin am Tresen.`,
  `Samstag, 09:20, Treppenhaus. Nora mit einem warmen Brot in der Hand, eine Minute bevor die Paketbotin klingelte, für ein Paket, das auf Evas Namen lief. Objekt: Paket, Brot. Nachricht: Klingel. Zeugin: Paketbotin.`,
  `Sie tippte, bis die Liste vierzehn Zeilen hatte. Die App-Benachrichtigung über die angebliche Abholung gestern. Das Notizzettelchen in Milas Dienstagstasche, in Noras Sprache, aber Evas Strichführung. Simons Vorschlag am Nachmittag, Nora solle Mila nie mehr allein übernehmen, formuliert, als wäre das ein Zugeständnis, nicht eine Grenze. Milas Satz am Abend, „Nora-Montag ist, wenn wir Pfannkuchen machen", ausgesprochen wie eine Regel, die es in diesem Haus nie gegeben hatte.`,
  `Unter jede Zeile setzte sie ein Kürzel für das Belegobjekt. Screenshot. Foto. Zettel im Umschlag. Sprachnachricht gesichert. Zeuge ansprechbar.`,
  `Dann sortierte sie nach Uhrzeit.`,
  `Sie griff nach dem roten Stift und markierte in der Spalte Uhrzeit alles, was innerhalb von zehn Minuten vor oder nach einem formalen Übergang lag. Kita-Tor. Arzttür. Spielplatzbank, an der die Schwimmmütter übergaben. Treppenabsatz vor Evas Wohnungstür. Das Klingeln des Telefons, wenn die Schule anrief.`,
  `Der rote Stift ging durch fast jede Zeile.`,
  `07:12. 15:42. 16:55. 14:05. 09:20.`,
  `Sie nahm den grünen Stift und umkreiste die Objekte, die aus ihrer eigenen Wohnung kamen. Thermobecher. Impfpass. Mütze. Notizzettel mit ihrer Strichführung. Vier grüne Kreise auf der ersten Seite, drei auf der zweiten. Sie zählte sie, weil Zählen half, nicht weil die Zahl etwas bedeutete.`,
  `Gelb für alles, was Nora in der Hand hatte, ohne dass Eva es ihr gegeben hatte.`,
  `Blau für Zeugen, die sich erinnern würden, wenn man sie fragte, bevor Nora es tat.`,
  `Die Stiftkappen lagen in einer Reihe am oberen Rand des Papiers, als wäre das ein Bastelnachmittag. Eva drückte den roten Stift an, bevor sie ihn weglegte. Er rollte zwei Zentimeter und stoppte an der Laptopkante.`,
  `Eva las die Spalte Ort von oben nach unten. Kita. Hof. Arzt. Spielplatz. Treppenhaus. Telefon. Kita.`,
  `Sie fügte eine sechste Spalte ein. Abstand zur Schnittstelle, in Minuten. Zwei. Eins. Fünf. Eins. Drei. Zwei. Null.`,
  `Eva speicherte. Sie nannte die Datei nicht nach Nora. Sie nannte sie nach dem Datum und „Chronologie". Sie legte eine Kopie auf einen USB-Stick, zog ihn ab, steckte ihn in die Innentasche ihrer Jacke, die über der Stuhllehne hing. Den Stick hatte sie einmal für ein Arbeitsprojekt gekauft, grün mit weißer Kappe, und nie richtig benutzt. Jetzt lag er neben ihrem Wohnungsschlüssel, zwei kleine Dinge, von denen niemand sonst wusste, wo sie steckten.`,
  `Sie öffnete das Deckblatt, schrieb Petras Namen hin, Datum, Uhrzeit dieser Nacht, ihre eigene Unterschrift in Druckbuchstaben darunter, damit niemand später behaupten konnte, die Handschrift sei nicht ihre. Darunter, kleiner: *Anlage für persönliches Gespräch. Nicht weitergeben.*`,
  `Drucken. Beidseitig. Farbe.`,
  `Der Drucker im Flur setzte sich in Gang, dieses kleine Einatmen, bevor das erste Blatt einzog. Eva hörte die Walzen. Sie ging hinüber, die Socken leise auf den Dielen, und blieb vor dem Gerät stehen, während Seite für Seite in das Fach fiel.`,
  `Im Fach lag etwas.`,
  `Sie dachte zuerst, eines ihrer Blätter sei vorzeitig durchgelaufen. Sie zog es heraus, bevor der Drucker die nächste Seite obendrauf schob.`,
  `Es war nicht ihre Chronologie.`,
  `Es war eine Einkaufsliste. A4, einspaltig, Handschrift oben, darunter sauber getippt. Milch, Haferflocken, Bananen, Toastbrot vollkorn, Apfelmus ohne Zucker, Frischkäse, Gurken, die kleinen, Joghurt, der mit dem Bären. Kinderzahnpasta Erdbeere. Pflaster, bunt.`,
  `An den Rändern Markierungen. Rot für Dinge, die heute dringend waren. Gelb für Dinge, die Mila mochte. Grün für Bio. Blau für „über Eva besorgen lassen".`,
  `Dieselben Farben. Dieselbe Logik. Dieselbe Spaltenordnung wie das Blatt, das gerade hinter ihr in den Drucker fiel.`,
  `Unten rechts ein kleiner Vermerk in derselben sauberen Handschrift. *N., Donnerstag.*`,
  `Eva hielt das Blatt am Rand, damit sie es nicht zerknüllte. Hinter ihr fiel die letzte Seite ihrer Chronologie ins Fach, genau auf Noras Liste.`
];

const sceneFifteenParagraphs = [
  `Petra las die Chronologie zweimal. Eva sah es an der Art, wie ihr Finger an den Zeitangaben hängen blieb, bei vierzehn Uhr sieben, bei vierzehn Uhr zweiundzwanzig, bei der Zeile, in der Eva notiert hatte, dass sie an der Ampel in der Rheinuferstraße gestanden hatte, als die App den Abholeintrag gesetzt haben soll.`,
  `„Das ist sauber aufgeschrieben", sagte Petra. Ihre Stimme war leiser als sonst. Sie legte die beiden Blätter nebeneinander auf den Schreibtisch, das Original und Evas Kopie. „Ich sehe die Differenz."`,
  `„Dann ändern Sie etwas."`,
  `„Ich kann nichts ändern, Frau Berger. Nicht heute. Nicht ohne den Träger." Petra zog die Schultern hoch, nicht abwehrend, eher wie jemand, der ein Paket trägt, das zu schwer ist. „Ich kann die Liste weitergeben. Ich kann schreiben, dass wir den Eintrag prüfen. Mehr nicht. Heute nicht mehr."`,
  `„Heute ist Freitag."`,
  `„Ich weiß."`,
  `„Das heißt, bis Montag steht der Eintrag so im System, wie er steht."`,
  `„Ja."`,
  `„Und wer darf Mila am Montag abholen?"`,
  `Petra sah auf die Liste. Sie antwortete nicht gleich. „Das ist der Punkt, an dem ich den Träger brauche."`,
  `Eva hörte den Schritt im Flur, bevor sie ihn einordnete. Simon trug seine dunkle Jacke, die Schlüssel noch in der Hand, und blieb in der offenen Tür stehen, als hätte er geklopft, obwohl er nicht geklopft hatte.`,
  `„Petra", sagte er. „Danke für den Anruf."`,
  `Eva drehte sich halb auf dem Stuhl. „Du hast sie angerufen."`,
  `„Sie hat mich angerufen." Simon sah nicht sie an, sondern die Blätter auf dem Tisch. „Können wir draußen reden."`,
  `„Ich rede hier."`,
  `„Eva. Draußen."`,
  `Petra sammelte die Chronologie ein, faltete sie an der Mittellinie und hielt sie einen Moment fest, bevor sie sie Eva zurückreichte. Ihre Hand zitterte nicht, aber sie ließ das Blatt zu früh los.`,
  `Auf dem Parkplatz stand Simons Wagen quer, als wäre er in Eile eingeparkt. Mila saß schon auf der Rückbank. Eva sah den Schopf über der Kopfstütze, den Ärmel, der gegen das Fenster gedrückt war.`,
  `„Wann hast du sie geholt."`,
  `„Vor zehn Minuten. Bevor ich mit dir geredet habe." Simon stützte sich mit der Hand auf das Dach. „Sie bleibt das Wochenende bei mir."`,
  `„Nein."`,
  `„Und die Woche."`,
  `„Simon."`,
  `„Hör mir zu." Er sprach nicht lauter. „Du schläfst schlecht. Du läufst mit Listen durch die Kita. Petra ruft mich an, weil sie nicht weiß, wie sie mit dir umgehen soll. Ich sage nicht, dass du lügst. Ich sage, dass du gerade nicht in einem Zustand bist, in dem Mila ihren Alltag bei dir hat."`,
  `„Es geht nicht um meinen Zustand. Es geht um Nora."`,
  `„Das ist genau, was ich meine."`,
  `Sie sah ihn an. Er hatte nicht den Blick, den sie erwartet hatte. Kein Triumph. Nur diese ruhige Art, mit der er früher Verträge gelesen hatte, bevor er etwas unterzeichnete.`,
  `„Ich unterschreibe nichts."`,
  `„Du musst nichts unterschreiben. Ich nehme sie einfach mit. Am Montag bringe ich sie in die Kita, am Dienstag auch, den Rest besprechen wir." Er öffnete die Fahrertür, ließ sie offen, ging einen halben Schritt zurück. „Wir fahren gleich bei dir vorbei. Sie braucht Sachen."`,
  `„Du kannst sie nicht einfach –"`,
  `„Eva." Er senkte die Stimme noch eine Stufe. „Ich will kein Verfahren. Du willst auch keins. Dann machen wir das jetzt so."`,
  `Mila winkte, als Eva sich zum Fenster beugte. „Papa sagt, wir machen Pfannkuchen."`,
  `„Schön", sagte Eva.`,
  `„Mit Apfel?"`,
  `„Mit Apfel."`,
  `Sie fuhren hintereinander her, Simon voraus, Eva in ihrem eigenen Wagen, und auf den fünf Minuten zwischen Kita und Wohnung hörte sie, wie sie selbst das Lenkrad zu fest hielt. Sie zwang die Finger, nacheinander loszulassen, und hielt es wieder zu fest.`,
  `In der Einfahrt blieb Simon unten am Auto stehen. Er ging nicht mit hinein. Das war vielleicht das Einzige, was er ihr an diesem Nachmittag ließ, dieser halbe Raum oben, in den er ihr nicht folgte.`,
  `Mila lief vor ihr die Treppe hoch. In der Wohnung stellte sie sich in die Küchentür und sah zu, wie Eva den kleinen Koffer aus dem Schrank zog, den sie seit der Trennung bereithielt, für die Wochenenden, die geplant waren.`,
  `„Die Schlafhose mit den Sternen", sagte Eva.`,
  `„Hab ich schon zwei."`,
  `„Dann die mit den Sternen und eine andere."`,
  `Sie packte, was ihr einfiel. Zwei Pullover. Die Zahnbürste im Plastiketui. Das Buch mit dem Fuchs. Unterwäsche für fünf Tage. Sie zählte beim zweiten Paar Socken und hörte, dass sie zählte, und hörte wieder auf.`,
  `„Nimm den Becher mit", sagte sie.`,
  `„Den gelben?"`,
  `„Ja."`,
  `Mila stellte sich auf die Zehenspitzen und holte den gelben Plastikbecher aus dem unteren Fach. Sie hielt ihn mit beiden Händen, wie sie ihn immer hielt, am Henkel und am Boden. Die abgebrochene Ecke am Rand zeigte nach innen.`,
  `In der Garderobe hing die Ersatzjacke, die Nora vorgestern hergebracht hatte. Eva nahm sie vom Haken, legte sie auf den Koffer, hob sie wieder ab, legte sie zurück auf den Haken.`,
  `„Die nicht?", fragte Mila.`,
  `„Die nicht."`,
  `Sie schloss den Koffer. Er war nicht voll. Er war weniger voll, als er für eine Woche hätte sein müssen. Sie öffnete ihn noch einmal, legte die dicken Strümpfe oben drauf, schloss ihn wieder.`,
  `Unten kurbelte Simon das Fenster auf der Beifahrerseite herunter, als sie herunterkamen. „Alles?"`,
  `„Alles."`,
  `Er nahm ihr den Koffer ab, ohne ihn anzuheben, wie man jemandem ein Glas aus der Hand nimmt. Er stellte ihn in den Kofferraum, ordnete ihn neben einer Einkaufstasche, die schon dort lag, und schloss die Klappe.`,
  `Dann schnallte er Mila an. Er tat es schnell und geübt, mit der linken Hand am Gurt, der rechten am Schloss, und Eva sah, dass er das in den letzten Monaten oft getan hatte, öfter, als sie gedacht hatte.`,
  `„Ich rufe dich morgen an", sagte er.`,
  `„Simon."`,
  `„Morgen."`,
  `Er schloss die Tür. Der Motor sprang an.`,
  `Mila drehte sich auf der Rückbank um. Sie hob den gelben Becher ans Seitenfenster, presste den Boden gegen die Scheibe, und Eva sah für einen Moment die ausgefranste Unterseite, die kleine abgebrochene Ecke am Rand, die sie seit einem halben Jahr kannte.`,
  `Der Wagen rollte aus der Einfahrt. An der Hofausfahrt blinkte er kurz nach links, dann bog er ab.`,
  `Eva blieb auf dem Pflaster stehen. Der Wind schlug gegen ihren Ärmel, bevor sie ihn bemerkte.`,
  `Auf der anderen Hofseite, zwischen Mülltonnen und Fahrradständer, stand Nora. Sie hatte eine Papiertüte vom Bäcker in der Hand, oben zweimal umgeschlagen. Sie blickte nicht zu Eva. Sie blickte dem Auto hinterher, bis es um die Ecke gebogen war, und erst dann wandte sie den Kopf, langsam, als wäre sie gerade erst aus dem Seiteneingang getreten.`,
  `„Oh", sagte Nora. „Ist Mila bei Simon?"`,
  `Eva antwortete nicht.`,
  `Nora hob die Tüte, als wollte sie etwas zeigen, Brötchen, Hefeteilchen, irgendetwas Warmes. „Ich hab zu viel geholt. Ich dachte, vielleicht magst du –"`,
  `Eva ging an ihr vorbei ins Haus. Im Flur hing nur noch die Ersatzjacke am Haken, leicht, leer, in der richtigen Größe.`
];

const sceneSixteenParagraphs = [
  `Die Wohnung war zum ersten Mal zu still.`,
  `Eva blieb auf der Schwelle zu Milas Zimmer stehen, die Hand noch am Türrahmen. Das Bett gemacht, so wie sie es am Sonntagabend gemacht hatte, die Decke glatt, der Stoffhase auf dem Kissen. Sie hatte erwartet, dass etwas herumläge. Ein Socken, ein Buch, irgendein Beweis dafür, dass hier jemand wohnte, der wiederkam.`,
  `Sie zog die Tür nicht zu. Sie zog sie auch nicht weiter auf.`,
  `In der Küche stand die zweite Tasse noch im Schrank. Eva nahm nur die eine heraus, füllte Wasser nach, drückte den Knopf der Maschine. Das Mahlwerk war in der stillen Küche zu laut. Sie trank den Kaffee im Stehen, las die Kita-App, die nichts Neues anzeigte. Seit Mila bei Simon war, sah Eva dort nur noch Hinweise und Termine, nicht mehr den ganzen Tag.`,
  `Um zwanzig nach sieben schloss sie die Wohnungstür. Eine halbe Stunde zu früh.`,
  `Im Büro funktionierte sie. Das war ihr Wort dafür. Sie schrieb drei Mails, die sie am Freitag hätte schreiben sollen, und eine Freigabe, die bis Mittwoch Zeit gehabt hätte. Der Kalender rechts auf dem Monitor füllte sich in ordentlichen Kacheln. Links lag das Telefon, Display nach oben.`,
  `Um neun kam die erste Nachricht von Simon. *Sie ist drin. Alles gut.* Kein Punkt am Ende.`,
  `Um halb elf die zweite. *Mittag Nudeln mit Tomate. Sie hat gut geschlafen.*`,
  `Eva tippte zweimal eine Antwort und löschte sie zweimal. Sie schrieb schließlich *Danke*, weil alles andere wie eine Forderung ausgesehen hätte. Sie wollte nicht fordernd klingen. Sie wollte den Ton treffen, in dem nichts nach mehr aussah, als es war.`,
  `Kurz nach zwölf vibrierte das Telefon wieder.`,
  `Ein Bild. Absender Nora.`,
  `Mila saß am langen Tisch in der Kita, die Brotdose offen vor ihr, ein halb gegessenes Käsebrot, eine Gurke in Sticks, zwei Weintrauben. Sie schaute nicht in die Kamera. Die Aufnahme war aus der Distanz gemacht, unauffällig, wie man eben fotografierte, wenn man gerade da war und etwas Schönes sah.`,
  `*Nur damit du siehst, dass sie gegessen hat*, schrieb Nora darunter. *Sie ist gut drauf heute.*`,
  `Eva sah das Bild lange an. Die Brotdose war die blaue mit den weißen Sternen. Die Gurke war in Sticks geschnitten, nicht in Scheiben. Simon schnitt in Scheiben.`,
  `Sie schrieb *Danke dir* und legte das Telefon auf den Tisch, Display nach unten.`,
  `Zehn Minuten später rief Simon an.`,
  `„Hat sie dir das Foto geschickt? Das mit dem Brot?"`,
  `„Ja."`,
  `„Gut. Ich hab ihr gleich geantwortet, das war lieb von ihr. Sie hatte Spätschicht heute, da ist sie eh an der Kita vorbeigekommen."`,
  `„Wer, Nora?"`,
  `„Ja. Sie hat gefragt, ob sie mal reinschauen soll, weil Mila den ersten Tag wieder dort hatte. Ich fand das okay."`,
  `„Du hast ihr zuerst geantwortet."`,
  `Pause.`,
  `„Was?"`,
  `„Du hast Nora vor mir geschrieben, dass es lieb war."`,
  `„Eva." Er atmete aus. „Sie hat das Foto gemacht. Ich hab ihr Danke gesagt. Dann hab ich es dir weitergeleitet. Das sind doch keine zwei Minuten Unterschied."`,
  `„Nein." Sie rieb sich mit dem Daumen über die Augenbraue. „Nein, du hast recht. Entschuldige."`,
  `„Kommst du nachher rüber? Sie will dir den Zahn zeigen, der wackelt."`,
  `„Ich komme nachher rüber."`,
  `Er blieb noch einen Moment in der Leitung, als wolle er etwas sagen. Dann legte er auf.`,
  `Den Nachmittag über bearbeitete sie Rechnungen, die keiner Bearbeitung bedurften. Zweimal öffnete sie die Kita-App und schloss sie wieder. Die App zeigte für Montag kein Abholprotokoll an, weil sie nicht die abholende Person war, und sie hatte in acht Monaten nicht gelernt, das nicht persönlich zu nehmen.`,
  `Um halb sechs stand sie in Simons Flur. Mila hing an ihrem Bein, roch nach Kita und nach dem Shampoo, das Simon benutzte, und zeigte den wackelnden Zahn, indem sie ihn mit der Zunge hin und her schob, bis Eva lachte. Eva kniete in der Garderobe, damit die Arme ihrer Tochter um ihren Hals passten, und hielt so lange still, wie Mila es zuließ.`,
  `Simon kam aus der Küche, Geschirrtuch über der Schulter, Telefon in der Hand. „Ich hab Petra zurückgerufen wegen des Elternabends, die wollte wissen, ob —" Er hielt das Telefon hoch, um ihr den Termin zu zeigen, und wischte in der Kontaktliste ein Stück nach unten.`,
  `Eva sah das Display, weil sie daneben stand. Sie wollte nicht hinsehen. Sie sah hin.`,
  `Auf dem Display standen nacheinander: Petra Löwen. Nora Seidel. Kita Sonnenstraße. Kinderarzt Lindner.`,
  `Zwischen Kita und Kinderarzt wirkte Noras Name nicht fremd.`,
  `Simon tippte Petras Nummer an, das Telefon ging ans Ohr, er drehte sich zur Küche zurück und sprach schon. Mila zog an Evas Hand, sagte etwas über einen Hasen, den sie gemalt hatte, über die Ohren, die zu lang geworden seien. Eva nickte, ohne den Kopf zu bewegen.`,
  `So sah es aus, wenn sich etwas ohne Streit an den richtigen Platz schob.`
];

export default function DieFalscheAbholungSamplePage() {
  return (
    <main className="reader-shell sample-reader">
      <header className="reader-topbar sample-reader__topbar">
        <div>
          <p className="reader-eyebrow">EMBER Leseprobe</p>
          <h1>Die falsche Abholung</h1>
          <p>Szenen 1 bis 16 sind live. Die Leseprobe wird fortlaufend ergänzt.</p>
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

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 3</p>
          <h2>Der Verdacht</h2>
          <p>
            Nach einem Telefonat mit Simon und einer irritierenden Begegnung mit Nora
            macht Eva zu Hause eine Entdeckung in Milas Rucksack, die den Fall in ein
            völlig neues Licht rückt.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneThreeParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s3-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 4</p>
          <h2>Die Listen</h2>
          <p>
            Eva vergleicht Kalender, App und alte Papierformulare. Ein Fund im
            Kita-Ordner und eine nächtliche Begegnung im Hof verstärken das Gefühl,
            dass jemand ihre Identität bis in die kleinsten Details kennt.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneFourParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s4-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 5</p>
          <h2>Das Codewort</h2>
          <p>
            Eva legt in der Kita neue Sicherheitsregeln und ein geheimes Codewort fest.
            Doch beim Blick in die alten Unterlagen zögert sie, Nora offiziell zu
            streichen – und macht kurz darauf eine Beobachtung auf der Straße.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneFiveParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s5-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 6</p>
          <h2>Zwei Wahrheiten</h2>
          <p>
            Ein Anruf in der Praxis und eine Begegnung an der Supermarktkasse
            bestätigen Evas schlimmsten Verdacht: Jemand führt ihr Leben,
            während sie selbst an einem anderen Ort ist – und Simon beginnt,
            an ihrer Wahrnehmung zu zweifeln.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneSixParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s6-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 7</p>
          <h2>Eine Woche</h2>
          <p>
            Eva konfrontiert Simon mit ihren Belegen. Unten im Hof wird sichtbar,
            wie selbstverständlich Nora längst in Milas Alltag steht und wie schnell
            Simon die Kontrolle über jede weitere Abholung an sich zieht.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneSevenParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s7-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 8</p>
          <h2>Papier</h2>
          <p>
            Ein Gespräch und ein Gang zur Dienststelle verschieben Evas Verdacht in
            eine neue Richtung: Nicht nur das Kind, auch die Dokumentation selbst
            kann zur Waffe werden. Zuhause wartet bereits der nächste Beweis.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneEightParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s8-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 9</p>
          <h2>Ersatz</h2>
          <p>
            Eva prüft Schlüssel, Kopien und Kellerbeutel und stößt auf Spuren, die
            sich nicht mehr als Zufall lesen lassen. Als Nora nachts im Treppenhaus
            auftaucht, kippt der Verdacht endgültig in konkrete Bedrohung.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneNineParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s9-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 10</p>
          <h2>Waldtag</h2>
          <p>
            Beim Elternabend erfährt Eva, dass Nora Informationen über Mila besitzt,
            bevor die Eltern sie offiziell bekommen. Vor der Wohnungstür liegt kurz
            darauf bereits der nächste Beweis.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneTenParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s10-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 11</p>
          <h2>Die Stimme</h2>
          <p>
            Eva hört alte Nachrichten, Hofclips und beiläufige Sprachreste ab und
            begreift, dass Nora nie Technik brauchte. Es genügte, Evas Alltag lange
            genug zu sammeln, bis ein vertrauter Satz wie eine Bestätigung klang.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneElevenParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s11-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 12</p>
          <h2>Ein guter Vorschlag</h2>
          <p>
            Simon bringt einen Vorschlag ins Spiel, der nach Entlastung klingt und
            Nora in Wahrheit tiefer in den Alltag drückt. Der schlimmste Satz kommt
            nicht von ihm, sondern von Mila.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneTwelveParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s12-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 13</p>
          <h2>Dienstagstasche</h2>
          <p>
            Eva prüft Milas gepackte Tasche und findet darin eine fast perfekte
            Imitation ihrer eigenen Mutterroutine. Verraten wird sie nicht durch die
            Dinge, sondern durch ein einziges Wort.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneThirteenParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s13-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 14</p>
          <h2>Protokoll</h2>
          <p>
            Eva baut aus Uhrzeiten, Objekten und Zeugen erstmals eine belastbare
            Chronologie. Als der Drucker anspringt, liegt im Fach schon etwas, das
            dort nicht liegen dürfte.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneFourteenParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s14-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 15</p>
          <h2>Der falsche Nachmittag</h2>
          <p>
            Eva bringt Petra ihre Chronologie und hofft auf eine klare Linie. Statt einer
            Entscheidung bekommt Simon den Alltag an sich gezogen, und genau darin liegt
            der eigentliche Verlust.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneFifteenParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s15-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 16</p>
          <h2>Die Woche bei Simon</h2>
          <p>
            Mila ist nicht verschwunden, aber Eva steht nicht mehr im Zentrum ihres
            eigenen Alltags. Nora füllt die Lücke über hilfreiche Bilder und Simon
            merkt nicht, wie sehr er sie dabei schon mit in seine Ordnung zieht.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneSixteenParagraphs.map(function (paragraph, index) {
            return <p key={`dfa-s16-p-${index}`}>{paragraph}</p>;
          })}
        </section>

        <section className="sample-reader__divider">
          <p className="reader-eyebrow">Fortsetzung folgt</p>
          <h3>Szene 17</h3>
          <p>
            Die Leseprobe endet hier vorerst. Im EMBER Studio kannst du den weiteren
            Verlauf der Geschichte entwickeln.
          </p>
        </section>
      </article>
    </main>
  );
}
