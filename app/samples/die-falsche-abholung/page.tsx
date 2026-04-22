import Link from "next/link";

const sceneOneParagraphs = [
  "Um 16:18 Uhr hatte Eva elf Minuten zwischen dem Gespräch mit der Kanzlei Hoffmann und der internen Besprechung. Sie trank einen Schluck aus der Flasche auf dem Schreibtisch, schob die Kopfhörer in den Nacken und tippte im Vorbeigehen auf die Kita-App. Grüner Status. Mila abgeholt. Dann, eine Zeile tiefer, ein nachsynchronisiertes Ereignis von gestern, grau hinterlegt, mit dem kleinen Wolkensymbol für verspäteten Abgleich.",
  "*Abholung Mila Berger, 15:42 Uhr, durch Eva Berger.*",
  "Sie lachte kurz, einmal, ohne Ton. Ein App-Fehler. Irgendein Serverabgleich, der zwei Tage durcheinanderwarf. Gestern war Simons Tag gewesen, das wusste sie so sicher wie ihren eigenen Kalender. Mittwoch. Übergabe vierzehn Uhr, Simon holt, Eva arbeitet bis neunzehn und ruft danach zum Gutenachtgespräch an. Sie hatte um 19:04 Uhr mit Mila telefoniert, das Protokoll lag in ihrem Anrufverlauf, Simon hat zwischendurch etwas über Nudeln gesagt.",
  "Eva wischte den Bildschirm nach unten, ließ ihn neu laden. Der Eintrag blieb. Sie tippte auf die Zeile, bekam die Detailansicht, eine kleine Signaturvorschau, einen Haken, einen Zeitstempel, ihre Unterschrift, stilisiert, aber in der Form, die sie seit Jahren in diese App kritzelte.",
  "Sie rief nicht Simon an. Sie rief die Kita an.",
  "„Sonnengarten, Loewen.\"",
  "„Frau Loewen, Eva Berger. Es gibt einen Abgleichfehler in Ihrer App. Gestern steht bei mir ein Abholeintrag von mir um fünfzehn Uhr zweiundvierzig. Das kann nicht stimmen, Mila war bei ihrem Vater.\"",
  "Am anderen Ende blieb es einen Moment still. Kein überraschtes Einatmen, kein Blätterrascheln. Nur die gleichmäßige Ruhe von Petra Loewen.",
  "„Frau Berger, der Eintrag ist bei uns nicht grau. Der ist bei uns regulär gebucht.\"",
  "„Das ist unmöglich.\"",
  "„Ich sehe hier Ihre Unterschrift und den Haken von meiner Kollegin Frau Weiss. Vielleicht ist es besser, Sie kommen kurz vorbei, dann gehen wir das zusammen durch.\"",
  "„Frau Loewen, ich war gestern in Frankfurt. Ich war gestern nicht in Ihrem Haus.\"",
  "„Dann klären wir das, wenn Sie da sind. Haben Sie jetzt Zeit?\"",
  "Eva sah auf den Kalender. Die interne Besprechung begann in sieben Minuten. Sie schrieb Anita eine Zeile, *muss raus, Kita, bitte übernimm*, griff Mantel und Schlüssel und war unten an der Schranke, bevor der Aufzug wieder oben angekommen war.",
  "Im Auto ging sie den Mittwoch durch. Um neun die Präsentation. Um elf der Zug. Um vierzehn Uhr zehn Ankunft Frankfurt, Taxi, Vier-Augen mit Grau. Um sechzehn Uhr zwanzig Rückzug ins Hotel. Sie hat um 15:42 Uhr nicht an einer Kita gestanden, die vierhundertzwanzig Kilometer entfernt lag. Sie hat um 15:42 Uhr in einem Konferenzraum im siebten Stock Zahlen verteidigt. Es gab Zeugen. Es gab ihre BahnCard-Abrechnung. Es gab Fotos vom Hotelschlüssel, die sie Mila am Abend geschickt hatte.",
  "Sie fuhr zu schnell. Sie wusste es und bremste nicht.",
  "An einer roten Ampel sagte sie laut in den leeren Beifahrerraum: „Das ist ein Datenbankfehler.\" Sie umfasste das Lenkrad fester, bis die Knöchel weiß wurden.",
  "Der Sonnengarten lag in einer ruhigen Seitenstraße hinter der alten Brauerei, ein umgebauter Altbau mit einem sauber gefegten Vorhof und einem Holztor, das um halb vier noch offen stand und um Viertel vor fünf verschlossen war. Eva stellte den Wagen halb auf den Bordstein, ließ den Warnblinker laufen und ging zwei Stufen auf einmal.",
  "„Frau Berger.\" Petra Loewen stand schon im Eingang, nicht hinter dem Tresen. Sie trug den dunkelgrünen Wollpullover, den Mila immer mit „Tannenbaumpulli\" kommentierte, und hielt ein Tablet in der Hand, flach gegen die Brust wie eine Speisekarte. „Kommen Sie mit ins Büro.\"",
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
  "„Frau Loewen, ich war gestern nicht in der Stadt. Ich war in einer Besprechung in Frankfurt, ich kann Ihnen den ICE-Beleg zeigen, ich kann Ihnen Kollegen nennen, ich habe abends mit Mila telefoniert, während sie bei Simon war. Simon hat sie abgeholt.\"",
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
  "„Frau Loewen\", sagte sie leise, „wann haben Sie heute mit meinem Mann telefoniert?\"",
  "„Gegen halb neun.\"",
  "„Von welcher Nummer?\"",
  "Petra sah auf. Zum ersten Mal in diesem Gespräch zögerte sie.",
  "„Von der Nummer, die bei uns als seine hinterlegt ist.\"",
  "Eva legte die Fingerspitzen auf den Rand des Tisches, an dem der Monitor stand. Das Holz war kühl und real. Sie hielt sich an diesem Kühlen fest, während auf dem Bildschirm eine Frau, die sie war und nicht war, sich aufrichtete und Milas Hand nahm, um mit ihr aus dem Bild zu gehen."
];

const sceneTwoParagraphs = [
  "Das Leitungsbüro roch nach kaltem Kaffee und dem Klebstoff der Kinderplakate an den Wänden. Petra Wendt schloss die Tür, nicht hart, nur bestimmt, und deutete auf den Stuhl vor dem Schreibtisch. Sechzehn Uhr zweiundvierzig auf der Wanduhr. Der Sekundenzeiger lief gleichmäßig weiter, als gäbe es nichts zu klären.",
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
  "Eva legte die Hand auf das Telefon, ein Reflex, das Banner verschwinden zu lassen. Petra sah weg, so höflich, dass es schlimmer war, als hätte sie hingestarrt.",
  "\"Ich rufe Simon an\", sagte Eva.",
  "\"Heute noch.\"",
  "\"Heute noch.\"",
  "\"Danke.\"",
  "Petra stand nicht auf. Sie schloss auch das Video nicht. Das angehaltene Bild blieb auf dem Monitor, die Frau in Evas Mantel, in der Hand Milas gelber Becher, und Eva sah es, während sie ihre Tasche vom Boden hob.",
  "An der Tür drehte sie sich noch einmal um.",
  "\"Sie bewahren das Video auf.\"",
  "\"Selbstverständlich.\"",
  "\"Unverändert.\"",
  "Petra nickte. \"Unverändert.\"",
  "Im Flur schlug Eva der warme Geruch von Linsensuppe aus der Küche entgegen, Kinderstimmen hinter einer Tür, das Quietschen von Gummistiefeln. Sie ging an der Garderobe vorbei, sah Milas Haken, drittes Fach von links, roter Punkt, Affe. Der Haken war leer.",
  "Sie wusste, dass er leer sein musste. Sie hatte Mila heute Morgen nicht hergebracht. Mila war zu Hause, Mila war seit gestern Abend bei ihr, Mila hatte heute früh im Pyjama am Küchentisch gefrühstückt, die Milch halb auf der Serviette, den gelben Becher neben dem Teller.",
  "Den gelben Becher.",
  "Eva blieb stehen, eine Hand an der Garderobenbank. Der Becher stand zu Hause. Sie hatte ihn heute Morgen selbst gefüllt. Sie hatte ihn mitgenommen, als sie Mila zu Simon brachte, mittags, weil sie es nicht mehr geschafft hätte. Oder hatte sie ihn dagelassen. Sie musste kurz überlegen, und dieses Kurz-Überlegen schnitt ihr den Atem ab.",
  "Sie tippte im Gehen Simons Namen an, hielt das Telefon zu nah ans Ohr und spürte, wie ihr Puls gegen die Haut hinter dem Kiefer schlug. Auf dem Display blinkte noch immer Noras Nachricht, ungeöffnet, geduldig.",
  "Draußen war die Luft kälter, als sie erwartet hatte. Das Freisprechsignal ging im Fahrtwind unter. Evas Wagen stand am Ende der Reihe. Sie ging darauf zu, schneller als beim Herkommen, und hörte sich selbst denken, nur ein Satz, immer derselbe: Ich muss Simon erreichen, bevor Petra es tut.",
  "Beim Einsteigen fiel ihr Blick auf das Handy. Simon nahm nicht ab. Noras Nachricht blinkte weiter.",
  "Sie drückte auf Noras Namen, weil das schneller ging, und erst als das Freizeichen lief, merkte sie, dass sie gar nicht wusste, was sie sagen wollte."
];

const sceneThreeParagraphs = [
  "Eva saß im Wagen, die Tür einen Spalt offen, den Schlüssel in der Hand, ohne ihn ins Schloss zu stecken. Auf dem Display stand Simons Name, bevor sie ihn gewählt hatte. Sie hatte ihn nur angetippt.",
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
  "„Ich weiß. Ich will.\" Ein kurzes Lachen, das nicht unpassend war, nur schnell. „Eva. Dass jemand behauptet, du hättest Mila um fünfzehn Uhr zweiundvierzig abgeholt, wo du nachweislich im Büro warst, das ist nicht dein Problem, das ist deren Problem. Das kriegen wir sortiert.\"",
  "Eva hielt das Telefon fester.",
  "Sie ging die letzten zehn Sekunden durch. Problem mit der App. Gestern. Video. Nein. Sie hatte keine Uhrzeit gesagt. Sie war sicher.",
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
  "Nach gestern. Nicht nach Ihrer Frage, nicht nach dem Vorfall. Nach gestern, als wäre gestern ein feststehender Punkt, an dem Eva etwas getan hatte.",
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
  "Eva hörte sich selbst atmen. Wenn sie jetzt sagte streichen, musste sie erklären, warum. Sie musste sagen, dass Nora seit gestern ein Detail gewusst hatte, das sie nicht wissen konnte. Dass eine Ersatzjacke in ihrem Flur hing, die dort nicht hingehörte. Sie musste, vor Petra, die ihre alte Unterschrift vor sich liegen hatte und ruhig abwartete, eine Frau als Gefahr benennen, die gestern noch Suppe gebracht hatte.",
  "Und Petra würde es notieren. Im Protokoll der heutigen Besprechung, unter dem Datum, unter Evas Namen. Frau Berger bittet um Streichung der bisherigen Zweitkontaktperson, Begründung. Die Begründung würde in einem Satz stehen, den jemand vorlesen konnte. Jemand wie ein Jugendamt. Jemand wie ein Familienrichter. Jemand wie Simons Anwältin, wenn es irgendwann so weit käme.",
  "\"Lassen Sie es vorerst so\", sagte Eva. \"Ich melde mich, wenn ich es ändern möchte.\"",
  "Petra nickte, ohne etwas zu bewerten. Sie setzte einen kleinen Haken an den Rand, nicht neben Noras Namen, sondern neben Evas Satz.",
  "\"Ich notiere nur, dass wir heute darüber gesprochen haben.\"",
  "\"Ja.\"",
  "\"Ohne Inhalt.\"",
  "\"Ja.\"",
  "Petra drehte das neue Blatt herum. \"Dann bitte hier, hier und hier.\"",
  "Eva unterschrieb. Dreimal. Ihre heutige Unterschrift, knapper, schneller, daneben die alte, runde von damals auf dem zweiten Blatt. Es sah aus wie zwei verschiedene Frauen. Die Jüngere hatte jemandem vertraut, den die Ältere jetzt nicht streichen durfte, weil die Ältere keine Worte dafür fand, die nicht nach Hysterie klangen.",
  "\"Eine Kopie für Sie.\" Petra schob ihr ein Blatt über den Tisch. \"Falls Sie etwas klarstellen möchten, rufen Sie mich direkt an, nicht das Gruppenhandy.\"",
  "\"Danke.\"",
  "\"Frau Berger.\" Petra hielt die Mappe noch kurz, bevor sie sie schloss. \"Wir machen das jetzt formal, weil es für alle sicherer ist. Auch für Sie. Verstehen Sie das bitte nicht als.\"",
  "Sie suchte ein Wort.",
  "\"Als was?\"",
  "\"Als Misstrauen.\"",
  "\"Nein\", sagte Eva. \"Natürlich nicht.\"",
  "Eva stand auf. Petra stand auch auf, reichte ihr die Hand. Der Händedruck war fest und kurz, freundlich und geschäftsmäßig.",
  "Im Flur kam ihr der Geruch der Gruppe entgegen, Apfel und feuchte Wolle. Durch die offene Tür sah sie Mila am niedrigen Tisch, den Kopf über ein Blatt gebeugt, die Zunge zwischen den Zähnen. Sie hob nicht den Blick. Eva blieb nicht stehen. Die Kopie der Vereinbarung raschelte in ihrer Hand.",
  "An der Garderobe hing Milas Anorak am Haken, der Ärmel halb in den Haken des Nachbarkindes gerutscht. Eva zog ihn nicht zurecht. Die Kopie in ihrer Hand war leicht, aber sie machte selbst diese kleine Bewegung ploetzlich zu etwas, das nicht mehr selbstverstaendlich war.",
  "Draußen schlug ihr die Luft kalt ins Gesicht. Sie atmete einmal tief ein und ging die drei Stufen hinunter zum Gehweg.",
  "Auf der anderen Straßenseite, schräg gegenüber der Einfahrt, stand Nora.",
  "Sie stand nicht auffällig. Sie stand, wie man steht, wenn man gerade aus der Bäckerei kommt und kurz in der Tasche etwas sucht. Dunkler Mantel, die Haare zurückgesteckt. Sie sah Eva nicht. Oder sie sah sie und tat, als sähe sie sie nicht.",
  "In ihrer Hand hielt sie etwas aus buntem Tonpapier, an den Rändern gezackt, eine Schere hatte es in die Form eines Sterns gebracht, in der Mitte ein Streifen Transparentpapier, gelb. Eva kannte diese Sterne. Sie klebten seit letzter Woche hinter den Gruppenfenstern, jedes Kind hatte einen gemacht, Milas war der mit dem gelben Transparentpapier gewesen, weil sie das rote zuerst zerrissen hatte und dann geweint hatte und dann das gelbe bekommen hatte.",
  "Nora schob den Stern in ihre Handtasche, drückte den Verschluss zu und ging weiter, Richtung Straßenbahn.",
  "Eva blieb auf der Stufe stehen, die Kopie der neuen Vereinbarung zwischen den Fingern, und das Papier gab an den Rändern nach."
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
  "Sie war schon im Mantel, bevor sie wusste, wohin. Am Ende ging sie in den Supermarkt an der Ecke, weil sie etwas brauchte, das normal war, weil in ihrem Kopf gerade kein Satz zu Ende lief und weil Milchpackungen sich ins Regal stellen ließen, ohne dass jemand dazu eine Unterschrift brauchte.",
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
  "Eva packte die Milch, den Joghurt, das Brot. Die Sterne waren auf Milas Winterjacke. Der Zopf war Evas Zopf, weil Mila am Kopf nicht stillhielt und Nora einmal vor zwei Wochen in der Küche gesagt hatte, man müsse den Scheitel eigentlich etwas tiefer setzen, dann rutsche er nicht.",
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
  "Auf der anderen Seite der Straße schob eine Frau einen Buggy über den Bordstein, das Kind darin schlief mit offenem Mund. Eva sah zu, wie der Buggy um die Ecke verschwand.",
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
  "Sie legte auf, bevor sie etwas sagte, das er später zitieren könnte.",
  "Oben in der Wohnung stand Milas Rucksack im Flur, wo sie ihn am Morgen abgestellt hatte. Der Inhalator lag in der Seitentasche, halb voll, wie gestern, wie vorgestern. Eva nahm ihn heraus und hielt ihn in der Hand. Das Plastik war kühl. Das Etikett war ihres.",
  "Sie ging in die Küche, legte den Inhalator auf den Tisch, daneben ihren Kalender, daneben das Handy. Drei Dinge, die ihr gehörten.",
  "Sie nahm einen Stift und schrieb auf die Rückseite eines Kassenzettels: *14:07 Praxis. 16:30 Supermarkt. Jacke Sterne. Zopf.* Ihre Hand war ruhig.",
  "Irgendwo in dieser Stadt hatte heute jemand ihren gestrigen Tag gelebt, halb fünf an der Süßigkeitenkasse, vierzehn Uhr sieben am Telefon, mit Milas Jacke und einem schiefen Zopf, und dieser Tag war, während Eva in einer Besprechung saß, sauberer dokumentiert worden als ihr eigener.",
  "Das Handy lag stumm neben dem Kalender. Simon rief nicht zurück.",
  "Sie bückte sich noch einmal in den Flur, holte die Tüte, stellte die Milch zurück in den Kühlschrank. Auf der Packung klebte der Bon, den sie beschrieben hatte. Sie zog ihn ab und legte ihn zu den anderen Zetteln, die sie seit heute Morgen sammelte. Der Stapel war schon zu groß für einen einzelnen Tag.",
  "Im Wohnzimmer klingelte das Festnetz. Sie ließ es dreimal klingeln, bevor sie abnahm.",
  "„Berger.\"",
  "„Frau Berger, entschuldigen Sie die Störung, hier ist noch einmal die Praxis.\" Dieselbe Stimme wie vorhin. „Ihr Mann hat angerufen. Ich wollte nur sichergehen, was jetzt mit dem Termin ist. Donnerstag oder morgen.\"",
  "Eva stand mit dem Hörer in der Hand und sah auf den Kalender auf dem Küchentisch, auf die zweimal unterstrichene Zehn.",
  "„Lassen Sie ihn auf Donnerstag\", sagte sie. „Bitte markieren Sie in der Akte, dass die Verschiebung nicht von mir kam.\"",
  "„Frau Berger, das kann ich so nicht —\"",
  "„Dann schreiben Sie daneben: *Patientin bestreitet den gestrigen Anruf.* Mit Datum.\"",
  "Schweigen. Dann Tastenklicken, langsamer als vorher.",
  "„Ich habe es notiert.\"",
  "„Danke.\"",
  "Sie legte auf, und die eigene Stimme klang in ihrem Kopf nach, ruhig, sachlich, fremd. Sie hatte gerade selbst darum gebeten, dass der Satz gegen sie in einer Akte stehen blieb.",
  "Auf dem Küchentisch lagen der Inhalator, der Kalender, das Handy und vier Zettel. Eva setzte sich, zog ein leeres Blatt heran und schrieb nur das Datum. Darunter: *14:07 Praxis. 16:30 Supermarkt. Jacke mit Sternen. Zopf schief.* Dann hielt sie inne.",
  "Unter der letzten Zeile blieb mehr leerer Platz, als auf die Seite passte."
];

const sceneSevenParagraphs = [
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
  `Kathrin saß schon, als Eva das Café betrat, zwei Tassen auf dem kleinen Tisch, die Hände um ihre Tasse gelegt, als wäre sie kalt geworden beim Warten. Sie hatte sich nicht viel verändert. Derselbe gerade Pony, derselbe Blick, der einen Satz früher ankam als die Stimme.`,
  `„Ich kann dir keine Akte zeigen", sagte Kathrin, bevor Eva sich richtig gesetzt hatte. „Das weißt du."`,
  `„Ich will keine Akte." Eva zog die Jacke aus, legte sie über die Stuhllehne. „Ich will wissen, ob ich mir etwas einbilde."`,
  `Kathrin schob ihre Tasse einen Zentimeter zur Seite.`,
  `„Nora Seidel", sagte Eva.`,
  `„Hab ich mir gedacht, als du geschrieben hast." Kathrin sah eine Sekunde zum Fenster. Draußen fuhr ein Bus vorbei, Werbung auf der Seite, irgendein Versicherungsslogan. „Es gab mal was. Ich war nicht zuständig, ich hab nur mitbekommen, was mitbekommen wurde. Ein Sorgekonflikt. Eine andere Mutter, ein Kind, keine Verwandtschaft, lange Geschichte."`,
  `„Wer hat gewonnen?"`,
  `„Es hat niemand gewonnen." Kathrin zog die Schultern hoch. „Aber am Ende hatte die eine Seite Listen, Ordner, Notizen mit Uhrzeiten. Und die andere hatte Tränen und eine zu laute Stimme auf dem Flur."`,
  `„Nora hatte die Ordner."`,
  `Kathrin antwortete nicht. Sie rührte in einem Kaffee, der schon lange keine Bewegung mehr brauchte.`,
  `„Hat sie das Kind genommen?"`,
  `„Es ging nicht um Nehmen. Es ging um die Frage, wer zuverlässig wirkt. Wer Kontakt zum Kinderarzt hat, wer die Impftermine kennt, wer die Schuhgröße weiß." Kathrin sah auf. „Eva, ich sage dir nichts, was in einer Akte steht. Ich sage dir nur, wie es gewirkt hat."`,
  `„Und wie hat es gewirkt?"`,
  `Kathrin zögerte. Dann, mit einer Ruhe, die zwischen ihnen stehen blieb wie ein drittes Möbelstück:`,
  `„Bei ihr wirkte immer alles sauberer als auf der anderen Seite."`,
  `Eva legte die Hände flach auf den Tisch.`,
  `„Danke", sagte sie.`,
  `„Ich hab dir nichts gesagt."`,
  `„Ich weiß."`,
  `Kathrin sah sie an, kurz und konzentriert. „Wenn du was tust, tu es mit Papier. Nicht mit Wut."`,
  `Eva nickte. Sie wartete nicht auf die Rechnung. Sie legte einen Fünfer unter den Unterteller, zog die Jacke wieder an und stand auf, bevor Kathrin noch etwas sagen konnte, das weniger sitzen würde als der Satz davor.`,
  `Die Dienststelle lag zehn Minuten zu Fuß. Eva ging sie schneller, als sie musste. Drinnen roch es nach Kaffeemaschine und Kopierer. Eine Frau mittleren Alters hinter der Scheibe, Namensschild, freundliche Müdigkeit, ein halb gegessenes Brötchen auf einer Serviette neben der Tastatur.`,
  `„Ich möchte keine Anzeige erstatten", sagte Eva. „Ich möchte verstehen, wie so etwas läuft."`,
  `„So etwas?"`,
  `„Wenn jemand behauptet, ein Kind abgeholt zu haben, obwohl das nicht stimmt. Wenn eine Unterschrift da ist. Wenn eine Vollmacht vorliegt, die nicht mehr gelten sollte."`,
  `Die Beamtin lehnte sich einen halben Zentimeter zurück. „Sie reden von Ihrem eigenen Kind."`,
  `„Ja."`,
  `„Und Ihrem eigenen Kita-Konto."`,
  `„Ja."`,
  `„Wer hat Zugriff auf das Konto?"`,
  `„Ich. Der Vater. Eine dritte Person, die als Notfallkontakt hinterlegt war."`,
  `„War."`,
  `„Ich habe sie rausnehmen lassen. Glaube ich."`,
  `Die Beamtin schrieb nichts. Sie sah Eva an, mit der Art von Geduld, die Papier ersetzt.`,
  `„Frau Berger, wenn die Kita eine Unterschrift hat und eine Person, die auf einer Liste stand, und das Kind erscheint am nächsten Tag wohlbehalten, dann ist das verwaltungstechnisch kein Fall. Es ist ein Missverständnis. Solange Sie keine harte Abweichung nachweisen können."`,
  `„Was wäre eine harte Abweichung?"`,
  `„Eine Unterschrift, die nachweislich gefälscht ist. Ein Zeitpunkt, an dem Sie belegbar woanders waren. Ein Video, das eine andere Person zeigt, nicht Sie. Eine widerrufene Vollmacht, die dokumentiert ist, mit Eingangsstempel, schriftlicher Bestätigung der Einrichtung, Datum."`,
  `„Und wenn nichts davon klar ist?"`,
  `„Dann ist es Ihre Aussage gegen eine Liste."`,
  `Eva hörte zu. Die Frau erklärte ihr nicht, was möglich war. Sie erklärte ihr, was jemand wissen musste, der es nicht treffen sollte. Zeitfenster. Unterschriftsprüfung. Dokumentationspflicht. Schriftliche Widerrufe mit Zugangsnachweis. Kameraaufzeichnungen, deren Löschfristen man kannte, wenn man auf der anderen Seite dieses Tresens gestanden hatte. Nora hatte gestanden. Nicht an diesem Tresen, aber an einem ähnlichen, lange genug, um die Dünnstellen zu sehen.`,
  `„Darf ich noch fragen", sagte Eva, „wie lange ein Kita-Träger so eine Unterschrift aufbewahrt?"`,
  `„Kommt auf den Träger an. Mindestens drei Jahre."`,
  `„Und die Videoaufzeichnungen vom Eingang?"`,
  `„Meist deutlich kürzer. Zwei Wochen, manchmal weniger."`,
  `„Weniger."`,
  `„Je nach System." Die Beamtin sah Eva länger an, als sie es getan hatte, seit Eva hereingekommen war. „Kommen Sie wieder, wenn Sie etwas Schriftliches haben. Mit Datum. Möglichst bald."`,
  `Eva nickte.`,
  `Sie lief nach Hause, die Hände tief in den Jackentaschen. Der Satz ging mit. *Sauberer als auf der anderen Seite.* Keine Metapher, keine Anklage. Eine Beobachtung, wie man sie über ein gebügeltes Hemd macht. Sie zählte, während sie lief. Zwei Wochen bei den Videos. Drei Jahre bei den Unterschriften. Sie zählte, was sie heute schon hätte anfordern sollen und nicht angefordert hatte, weil ihr niemand gesagt hatte, wie schmal die Fenster sind.`,
  `Das Treppenhaus roch nach dem Essen der Nachbarn, etwas mit Zwiebeln. Sie schloss auf, ohne hinzusehen, Jacke an den Haken, Schlüssel in die Schale. Im Flur brannte noch das kleine Licht, das sie morgens angelassen hatte, weil Mila sich davor nicht fürchtete. Mila war heute nicht hier. Mila war seit dem Frühstück bei Simon.`,
  `Sie ging in die Küche, um ein Glas Wasser zu trinken.`,
  `Auf der Ablage, zwischen Brettchen und Wasserkocher, stand Milas rosa Brotdose. Der Deckel offen, leicht schräg. Die Dose ausgespült, noch feucht an den Rändern. Ein Tropfen lief innen die Wand hinunter und sammelte sich in der Ecke, wo sonst die Apfelschnitze lagen.`,
  `Eva stand sehr still.`,
  `Sie hatte die Dose heute früh eingepackt. Simon hatte sie mitgenommen. Mila hatte sie mitgenommen. Die Dose war den ganzen Tag nicht in dieser Wohnung gewesen.`,
  `Sie fasste den Deckel nicht an. Dann doch, mit zwei Fingern, an einer Stelle, an der niemand einen Finger hinlegt, der spült. Das Plastik war kühl. Das Wasser war nicht alt.`,
  `Sie zog die Hand zurück.`,
  `Im Ausguss lag ein einzelner Apfelkern.`,
  `Eva sah von der Dose zum Ausguss und zurück. Dann zu den Haken im Flur, an denen ihre Jacke hing, sonst nichts. Zur Tür. Die Kette hing lose am Rahmen, so wie sie immer hing, wenn Eva morgens aus dem Haus ging und am Abend zurückkam.`,
  `Sie holte ihr Handy heraus. Die Finger wussten, was sie tun sollten, bevor der Kopf es sortiert hatte. Sie öffnete die Kamera. Sie fotografierte die Brotdose von drei Seiten, den offenen Deckel, den Tropfen an der Innenwand, den Apfelkern im Ausguss. Sie fotografierte die Ablage aus dem Winkel, in dem das Licht auf die Feuchtigkeit traf. Sie sah auf den Zeitstempel. Sie machte noch ein Foto, auf dem die Dose neben der heutigen Zeitung lag, die sie am Morgen aus dem Briefkasten geholt und ungelesen auf den Tisch geworfen hatte.`,
  `Dann schrieb sie Simon.`,
  `*Hast du Milas Brotdose heute mitgegeben?*`,
  `Sie schickte die Nachricht, bevor sie sie umformulieren konnte.`,
  `Die drei Punkte erschienen schnell. Verschwanden. Erschienen wieder.`,
  `*Ja. Die rosa. Warum?*`,
  `Eva sah die Nachricht an. Sie sah die Dose an. Sie sah das kleine Licht im Flur, das für Mila brannte, die heute nicht hier war.`,
  `Sie tippte nichts zurück. Nicht sofort.`,
  `Sie ging in den Flur, schloss die Tür zweimal ab, legte die Kette vor. Sie ging zurück in die Küche und ließ die Dose stehen, wo sie stand. Sie würde sie nicht wegräumen. Sie würde sie nicht abwaschen. Sie würde nichts an diesem Bild verändern, bis sie wusste, was es zeigte.`,
  `Sie setzte sich an den Küchentisch, das Handy vor sich, und schrieb auf die Rückseite der Quittung vom Café mit einem Kugelschreiber, der schlecht lief: *Dose, 19:40, Deckel offen, feucht, Kern im Ausguss.* Sie schrieb das Datum daneben. Sie schrieb die Uhrzeit zweimal, weil sie sich beim ersten Mal verschrieben hatte.`,
  `Papier. Nicht Wut.`,
  `Sie legte den Stift hin und sah die Dose an, und die Dose blieb, wo sie war, rosa, offen, still.`
];

const sceneNineParagraphs = [
  `Das Schlüsselbrett hing neben der Garderobe, fünf Haken, beschriftet in Evas eigener Handschrift. Wohnung, Briefkasten, Keller, Fahrrad, Ersatz. Am Haken Ersatz hing nichts. Sie starrte auf den leeren Messingstift, als könnte er nachliefern, was er nicht hatte.`,
  `Sie holte die Notfallmappe aus dem Regal. Plastikhülle, Register, Reiter in Farben, die sie selbst angelegt hatte. Versicherung. Impfpass. Vollmacht. Kita. Im hinteren Fach, wo sie Kopien aufbewahrte, lag ein Schlüssel. Kleiner Anhänger aus Leder, mit Filzstift beschriftet: Ersatz Wohnung. Ihre Schrift. Nur hatte sie diesen Schlüssel nie dort abgelegt.`,
  `Sie hielt ihn in der Hand und versuchte, sich zu erinnern, ihn je vom Haken in die Mappe gelegt zu haben. Sie kam bis zu dem Tag, an dem Nora ihn offiziell zurückgebracht hatte. Kaffee, Küchentisch, ein kleines Gespräch darüber, wie gut es sei, wieder getrennte Dinge zu haben. Nora hatte den Schlüssel auf den Tisch gelegt. Eva hatte ihn an den Haken gehängt. Sie war sich sicher gewesen. Jetzt war sie es nicht mehr.`,
  `Sie legte die Mappe auf den Küchentisch und blätterte weiter, Reiter für Reiter. Unter Vollmacht lagen zwei Blätter, die sie kannte. Unter Kita lag eine Kopie der Abholberechtigung, zweifach gelocht, sauber abgeheftet. Sie hatte nur eine Kopie gemacht. Sie zog das Blatt heraus und hielt es gegen das Licht. Kein Wasserzeichen, kein Unterschied. Nur dass es doppelt da war.`,
  `Im Keller roch es nach altem Karton und feuchter Wand. Das Licht im Gang sprang mit Verzögerung an. Evas Abteil war der dritte Verschlag rechts. Sie schloss auf und zog die Kiste mit der Aufschrift Umzug 4 aus dem Stapel. Darin lag das Säckchen. Hellblauer Stoffbeutel, Kordelzug, mit Textstift beschriftet: Reserve. Sie hatte ihn in der Trennungszeit so angelegt, falls etwas mit der Wohnung wäre, falls Mila etwas, falls Nora. Falls Nora.`,
  `Eva kniete auf dem Betonboden und betrachtete den Knoten. Sie machte ihre Knoten immer nach rechts, das wusste sie so sicher, wie sie wusste, auf welcher Seite Mila im Bett schlief. Der Knoten saß links. Ein sauberer, fest gezogener Knoten, nicht hastig, nicht heimlich, einfach auf der falschen Seite.`,
  `Sie öffnete ihn. Der Schlüssel lag im Beutel, das Leder am Anhänger leicht abgegriffen. Sie hielt ihn unter die nackte Glühbirne. Am Bart, an der feinsten Kante, ein heller Streifen, wo Metall auf Metall gelaufen war. Eine dünne, stumpfe Spur, wie sie entsteht, wenn ein Schlüssel in eine Fräsmaschine eingespannt wird. Sie hatte es schon einmal gesehen, an einem Autoschlüssel ihres Vaters, nach einem Schlüsseldienst.`,
  `Sie drehte den Schlüssel, langsam, als ob die Drehung ihn in einen anderen verwandeln könnte. Ein Kratzer am Kopf, an den sie sich nicht erinnerte. Der Lederanhänger ein bisschen dunkler an den Rändern, als hätte ihn jemand länger in der Hand gehalten. In dem Karton darunter lag eine Postkarte, die Mila vor einem Jahr bemalt hatte, ein Haus, ein Baum, eine Sonne. Eva starrte darauf, bis die Linien verschwammen, dann legte sie den Schlüssel zurück, verknotete den Beutel, diesmal nach rechts, und blieb einen Moment auf den Knien. Irgendwo in einem anderen Abteil fiel etwas um, ein kleines Scheppern, dann Stille. Sie stand auf, nahm den Beutel mit und schloss das Abteil ab. Beim Rauslaufen zählte sie die Verschläge, weil sie etwas zählen musste. Acht bis zur Tür.`,
  `Oben rief sie den Notdienst an. Ein Mann mit ruhiger Stimme sagte, er könne in vierzig Minuten da sein, Nachtzuschlag. Sie sagte ja. Sie stellte den Wasserkocher an und ließ ihn wieder ausgehen. Auf der Küchenuhr war es kurz nach elf.`,
  `Der Schlüsseldienst kam um halb zwölf. Ein älterer Mann mit einer Werkzeugtasche, der nicht viel redete und die Tür einmal öffnete, einmal schloss, dann nickte. Er baute den alten Zylinder aus, legte ihn auf ein Stofftuch, setzte den neuen ein. Das Geräusch, als der neue Bart in die Stifte griff, war sauberer, härter. Er gab ihr drei neue Schlüssel, zeigte ihr die Nummer, ließ sie unterschreiben. Sie zahlte bar.`,
  `„Klemmt bei Ihnen was?" fragte er im Gehen, fast beiläufig.`,
  `„Nein", sagte Eva. „Warum?"`,
  `Er zuckte die Schultern. „Die Kollegin unten hat gesagt, im Haus klemmt seit Tagen was. Hat mich eine Nachbarin gefragt, hat sie gemeint. Ist nicht unser Auftrag, aber man hört sowas."`,
  `„Welche Nachbarin?"`,
  `„Keine Ahnung. Ich bin nicht der, der das annimmt." Er tippte kurz an die Mütze. „Gute Nacht."`,
  `Als er weg war, legte sie die alten Schlüssel auf den Küchentisch. Vier Stück. Der vom Haken, zwei aus der Mappe, der aus dem Keller. Sie lagen nebeneinander wie kleine, stumpfe Gegenstände. Nora wusste, in welchem Fach Milas Wechselkleidung lag. Nora wusste den Code vom Fahrradkeller. Nora wusste, wie lange das Wasser im Bad brauchte, bis es warm war, und dass Mila beim Zähneputzen immer am Fenster stand. Ein neuer Zylinder hielt nichts davon auf.`,
  `Sie packte die alten Schlüssel in eine Tüte, den Beutel dazu, und stellte die Tüte neben die Tür. Dann nahm sie den Müllsack aus der Küche, weil irgendetwas getan werden musste, das einfach war.`,
  `Im Treppenhaus brannte nur das Notlicht. Sie drückte den Sack gegen die Hüfte und zog die Wohnungstür ins Schloss. Das neue Schloss klickte trocken.`,
  `Nora stand vor ihrer eigenen Tür, zwei Meter weiter. Barfuß, graue Leggings, ein langes T-Shirt, einen Hausschlüssel in der Hand. Ihr Haar lag hinten platt, als wäre sie vom Sofa aufgestanden.`,
  `„Oh", sagte Nora leise, „du bist auch noch wach."`,
  `Eva blieb stehen. Der Müllsack war plötzlich sehr leicht.`,
  `„Ich krieg meine Tür nicht auf." Nora lachte kurz, tonlos. „Seit Tagen klemmt das. Ich muss immer zweimal drehen." Sie deutete mit dem Schlüssel auf ihr Schloss, ohne hinzusehen. Ihr Blick war bei Eva. Dann, kurz, an Evas Türklinke. Dann wieder bei Eva. „Klemmt bei dir auch?"`,
  `„Nein", sagte Eva.`,
  `„Nicht?" Nora zog die Augenbrauen hoch, freundlich, beinahe erleichtert. „Vielleicht ist es nur unsere Seite. Die Haustür war ja letzte Woche auch komisch."`,
  `Sie lächelte. Es war das Lächeln, das Mila auf dem Spielplatz erwidert hatte.`,
  `„Hattest du Besuch?" fragte Nora. „So spät noch. Ich hab jemanden gehört auf dem Gang."`,
  `„Geh schlafen", sagte Eva. „Ist spät."`,
  `„Ja." Nora sah an Evas Tür vorbei, zur Klinke, zum neuen, noch glänzenden Schild um das Schlüsselloch. Eine Viertelsekunde, nicht länger. „Gute Nacht, Eva."`,
  `Nora drehte sich um, steckte den Schlüssel in ihr eigenes Schloss und drehte. Einmal. Zweimal. Die Tür ging auf.`,
  `Eva trug den Müllsack bis zum Schacht, warf ihn hinein und ging zurück. Im Vorbeigehen an Noras Tür hörte sie drinnen kein Geräusch, kein Licht unter dem Türspalt, keinen Schritt. Nur die Tür, die von innen leise ins Schloss fiel, als sie schon drei Schritte weiter war.`,
  `In ihrer Wohnung lehnte sie sich von innen gegen die Tür und hörte, wie im Nachbarflur ein Riegel geschoben wurde.`,
  `Auf dem Küchentisch lagen die alten Schlüssel. Daneben das Säckchen mit dem Knoten, den sie neu gemacht hatte, nach rechts.`
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

export default function DieFalscheAbholungSamplePage() {
  return (
    <main className="reader-shell sample-reader">
      <header className="reader-topbar sample-reader__topbar">
        <div>
          <p className="reader-eyebrow">EMBER Leseprobe</p>
          <h1>Die falsche Abholung</h1>
          <p>Szenen 1 bis 10 sind live. Die Leseprobe wird fortlaufend ergänzt.</p>
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

        <section className="sample-reader__divider">
          <p className="reader-eyebrow">Fortsetzung folgt</p>
          <h3>Szene 11</h3>
          <p>
            Die Leseprobe endet hier vorerst. Im EMBER Studio kannst du den weiteren
            Verlauf der Geschichte entwickeln.
          </p>
        </section>
      </article>
    </main>
  );
}
