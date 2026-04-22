import Link from "next/link";

const sceneOneParagraphs = [
  "Um 16:18 Uhr hatte Eva elf Minuten zwischen dem Call mit der Kanzlei Hoffmann und dem internen Review. Sie trank einen Schluck aus der Flasche auf dem Schreibtisch, schob das Headset in den Nacken und tippte im Vorbeigehen auf die Kita-App. Grüner Status. Mila abgeholt. Dann, eine Zeile tiefer, ein nachsynchronisiertes Ereignis von gestern, grau hinterlegt, mit dem kleinen Wolkensymbol für verspäteten Abgleich.",
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
  "Eva sah auf den Kalender. Das interne Review begann in sieben Minuten. Sie schrieb Anita eine Zeile, *muss raus, Kita, bitte übernimm*, griff Mantel und Schlüssel und war unten an der Schranke, bevor der Aufzug wieder oben angekommen war.",
  "Im Auto ging sie den Mittwoch durch. Um neun die Präsentation. Um elf der Zug. Um vierzehn Uhr zehn Ankunft Frankfurt, Taxi, Vier-Augen mit Grau. Um sechzehn Uhr zwanzig Rückzug ins Hotel. Sie hat um 15:42 Uhr nicht an einer Kita gestanden, die vierhundertzwanzig Kilometer entfernt lag. Sie hat um 15:42 Uhr in einem Konferenzraum im siebten Stock Zahlen verteidigt. Es gab Zeugen. Es gab ihre Bahncard-Abrechnung. Es gab Fotos vom Hotelschlüssel, die sie Mila am Abend geschickt hatte.",
  "Sie fuhr zu schnell. Sie wusste es und bremste nicht.",
  "An einer roten Ampel sagte sie laut in den leeren Beifahrerraum: „Das ist ein Datenbankfehler.\" Sie umfasste das Lenkrad fester, bis die Knöchel weiß wurden.",
  "Der Sonnengarten lag in einer ruhigen Seitenstraße hinter der alten Brauerei, ein umgebauter Altbau mit einem sauber gefegten Vorhof und einem Holztor, das um halb vier noch offen stand und um Viertel vor fünf verschlossen war. Eva stellte den Wagen halb auf den Bordstein, ließ den Warnblinker laufen und ging zwei Stufen auf einmal.",
  "„Frau Berger.\" Petra Loewen stand schon im Eingang, nicht hinter dem Tresen. Sie trug den dunkelgrünen Wollpullover, den Mila immer mit „Tannenbaumpulli\" kommentierte, und hielt ein Tablet in der Hand, flach gegen die Brust wie eine Speisekarte. „Kommen Sie mit ins Büro.\"",
  "Das Büro war ein langer Raum with zwei Schreibtischen, einem Sideboard voller Ordner und einer Fotowand, auf der jedes Kind einmal lachte. Petra schob die Tür hinter Eva zu, was sie sonst nicht tat.",
  "„Ich weiß, dass Sie das aufregt\", sagte Petra, „und ich will Ihnen nicht zu nahe treten. Aber ich muss Ihnen zeigen, was wir haben, bevor wir darüber reden, was nicht sein kann.\"",
  "Sie legte das Tablet auf den Tisch, drehte es so, dass Eva direkt darauf sah, und tippte einmal.",
  "Der Eintrag vom Vortag.",
  "*15:42 Uhr. Abholung Mila Berger. Abholende Person: Eva Berger, Mutter. Eingetragen durch: S. Weiss. Bestätigt durch Unterschrift.*",
  "Darunter das kleine Unterschriftsfeld. Eva sah den Zug von unten nach oben, den kurzen Schlenker am zweiten *e*, den harten Abstrich beim *g*. Es war keine Kopie. Es sah aus wie live gezogen, mit dem stumpfen Stift aus der Holzschale am Tresen.",
  "„Das ist nicht meine Unterschrift\", sagte Eva. Ihre Stimme klang schmaler, als sie sein wollte.",
  "„Das ist die Unterschrift, die bei uns als Ihre hinterlegt ist.\"",
  "„Dann ist das, was bei Ihnen hinterlegt ist, falsch.\"",
  "Petra nickte nicht. Sie schüttelte auch nicht den Kopf. Sie hielt die Hände ruhig neben dem Tablet.",
  "„Frau Loewen, ich war gestern nicht in der Stadt. Ich war in einem Meeting in Frankfurt, ich kann Ihnen den ICE-Beleg zeigen, ich kann Ihnen Kollegen nennen, ich habe abends mit Mila telefoniert, während sie bei Simon war. Simon hat sie abgeholt.\"",
  "„Nach unserem Protokoll nicht.\"",
  "„Haben Sie Simon gefragt?\"",
  "„Wir rufen immer den Elternteil an, bei dem laut Plan das Kind nicht abgeholt werden sollte. Gestern war das auch Herr Berger. Er hat uns heute Morgen zurückgerufen.\" Petra machte eine kleine Pause. „Er hat gesagt, Mila sei ganz normal bei Ihnen.\"",
  "Eva spürte, wie sich etwas in ihrem Nacken zusammenschob. Ihre Hand lag neben dem Tablet, und sie hob sie nicht. Sie sagte: „Ich will die Kamera sehen.\"",
  "„Deshalb habe ich Sie hergebeten.\"",
  "Petra führte sie einen Gang weiter, in einen kleinen fensterlosen Raum, in dem ein Monitor stand und ein Rechner, der leise summte. An der Wand ein Putzplan, ein Feuerlöscher, ein Stapel sauber gefalteter Wechselhosen in einem offenen Karton. Auf dem Monitor war ein Standbild eingefroren: die Eingangstür von innen, der Garderobenbereich, die Reihe mit den Haken, an denen die kleinen Regenjacken hingen. Im Vordergrund eine Frau, halb abgewandt, die Hand auf Milas Schulter. Mila in ihrer gelben Mütze. Die Mütze saß schief, so wie Mila sie aufsetzte, wenn es schnell gehen sollte.",
  "Die Frau trug einen dunkelblauen Wollmantel, Kaschmirmischung, Gürtel hinten mit Schlaufe, der Schnitt vom letzten Winter bei Hoss, innen eine Stelle am Ärmel, an der Eva einmal Kaffee verschüttet hatte. Die Haare lagen in derselben Länge auf dem Mantelkragen. Die Schulter hat den leichten Fall nach links, den Eva an sich selbst auf Fotos zuerst sah, bevor sie etwas anderes sah.",
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
  "Eva saß im Wagen, die Tür einen Spalt offen, den Schlüssel in der Hand, ohne ihn ins Schloss zu stecken. Auf dem Display stand Simon, bevor sie ihn gewählt hatte. Sie hatte seinen Namen nur angetippt.",
  "„Eva.\"",
  "„Bei Mila ist nichts passiert\", sagte sie zuerst. Der Satz rutschte ihr heraus, bevor sie ihn geplant hatte.",
  "Eine Pause. „Warum rufst du dann so an?\"",
  "„Es gibt einen Eintrag in der App. Von gestern. Dass ich sie um 15:42 abgeholt hätte.\"",
  "„Hast du?\"",
  "„Nein.\"",
  "Sie wartete auf Luft, auf Einwand, auf irgendetwas Weiches. Simon atmete einmal durch.",
  "„Okay\", sagte er. „Okay. Wo bist du?\"",
  "„Parkplatz. Kita. Ich fahre gleich.\"",
  "„Haben die das schriftlich?\"",
  "„Video. Unterschrift. Garderobe.\"",
  "„Wessen Unterschrift?\"",
  "„Sieht aus wie meine.\"",
  "Sie hörte, wie er aufstand. Das Knarren seines Bürostuhls kannte sie noch.",
  "„Eva, hör zu. Fahr nicht allein irgendwohin und mach nichts Impulsives. Ich rufe Markwald an. Wir brauchen das dokumentiert, bevor irgendwer sonst damit arbeitet. Fotografier die Unterschrift, bevor du wegfährst. Lass dir den Videoausschnitt nicht bloß erzählen, lass ihn dir zeigen und notier dir Uhrzeit und Namen der Person, die ihn dir zeigt.\"",
  "„Ich war drin, Simon. Ich hab es gesehen.\"",
  "„Dann nochmal. Mit Notiz.\"",
  "Sie lehnte den Kopf gegen die Nackenstütze.",
  "„Ich beruhige mich nicht damit, dass du Markwald anrufst.\"",
  "„Ich versuche nicht, dich zu beruhigen. Ich versuche, das nicht auseinanderlaufen zu lassen.\"",
  "„Es ist noch keine Sache, die auseinanderläuft.\"",
  "„Es ist schon eine.\"",
  "Sie schluckte das. Draußen lief eine Erzieherin mit einem Müllsack zum Container, sah kurz zum Auto, sah weg. Eva drehte das Gesicht zur Seitenscheibe.",
  "„Ich melde mich, wenn ich zuhause bin.\"",
  "„Eva. Fahr heute Abend nicht allein nochmal hin. Wenn dir was einfällt, schreib's auf. Anrufen kannst du mich immer.\"",
  "„Und wenn die Kita dich anruft?\"",
  "„Dann weiß ich, was ich sage.\"",
  "„Was sagst du?\"",
  "„Dass wir das prüfen. Nicht mehr.\"",
  "Sie legte auf, bevor sie Ja sagen musste.",
  "Das Handy vibrierte in der Hand, noch warm. Nora.",
  "Sie nahm ab.",
  "„Evi, Schatz, ich hab grad das blödeste Gefühl. Ist bei Mila alles in Ordnung?\"",
  "„Warum fragst du?\"",
  "„Ich hab dich vorhin aus dem Hof fahren sehen, und du hattest so ein Gesicht. Ich hab mir gedacht, ich frag lieber einmal zu oft.\"",
  "„Es ist nichts Schlimmes passiert.\"",
  "„Aber was?\"",
  "Eva schloss die Augen.",
  "„Ein Verwaltungsding in der Kita. Kläre ich.\"",
  "„Ach Gott.\" Noras Stimme wurde weicher, dichter. „Eva, das klingt nach diesem falschen Abholvermerk, den die manchmal haben. Um 15:42, oder? Ist das bei euch aufgetaucht? *Abgeholt durch Kindsmutter um 15:42 Uhr*, so steht das dann da, und du kriegst 'nen halben Herzinfarkt.\"",
  "Eva hörte das Wort. Abgeholt. Durch Kindsmutter. 15:42. Der Satz stand so in der App. Wortwörtlich. Sie hatte Nora nichts davon gesagt.",
  "„Woher weißt du das?\"",
  "„Was?\"",
  "„Den Wortlaut.\"",
  "Nora lachte kurz, warm, überrascht. „Evi, das ist der Standardsatz. Den gibt das System so aus. Frag Petra, die lacht dich aus.\"",
  "„Die Uhrzeit auch?\"",
  "„Was?\"",
  "„Du hast eine Uhrzeit gesagt.\"",
  "„Hab ich?\" Eine winzige Pause. „Hast du die nicht vorhin erwähnt? Ich dachte, du hättest. Egal. Hör mal, wenn du willst, hol ich Mila die Tage mal, dann hast du Luft. Ich bin eh zuhause, du weißt. Ich hab ihre Gummibärchen da. Ich kann auch heute Abend noch kurz rüber, wenn du willst, bring Suppe mit. Du musst nichts. Sag einfach.\"",
  "„Ich muss fahren.\"",
  "„Evi, nur dass du das weißt. Ich bin da. Du musst nicht alles allein. Simon ist Simon, der macht Termine. Ich mach dir einen Tee.\"",
  "„Danke, Nora.\"",
  "„Ruf mich an, wenn du magst. Auch um elf. Ich mein das ernst.\"",
  "„Ja.\"",
  "Sie legte auf und saß. Die Hand lag noch am Schlüssel, als gehöre sie zu jemand anderem. Standardsatz. Vielleicht. Sie hatte die genaue Formulierung nie bewusst gelesen, auch heute nicht, das Hirn hatte nur das Wesentliche erfasst, Uhrzeit, Name. Vielleicht stand es wirklich überall so. Vielleicht hatte Nora so einen Vermerk aus ihrer Zeit mit dem Neffen gesehen. Vielleicht hatte Eva selbst die Uhrzeit beim Wegfahren gesagt und erinnerte sich nicht mehr. Sie war so in ihrem Kopf gewesen, als sie aus dem Hof fuhr, dass sie sich nicht einmal daran erinnerte, ob sie das Tor hinter sich geschlossen hatte.",
  "Sie drehte den Schlüssel.",
  "Auf der Landstraße zurück kam Simons Ton wieder, nicht seine Worte, sondern der Takt, in dem er Sätze baute, wenn etwas begann, groß zu werden. Sie zählte die Ampeln und beschloss zwischen der zweiten und dritten, niemandem mehr etwas zu erzählen, bevor sie nicht selbst etwas in der Hand hatte. Nicht Simon. Nicht Nora. Nicht ihrer Mutter, wenn die anrief. Keine Details, keine Uhrzeit, kein Wortlaut. Details, einmal draußen, gehörten ihr nicht mehr.",
  "An der vierten Ampel schrieb Simon. *Markwald Mittwoch 9. Ich komme mit.* Sie antwortete nicht.",
  "Zuhause drückte sie nicht den Lichtschalter im Flur, sondern ging gleich zum Garderobenhaken, an dem Milas kleiner Rucksack hing. Sie hatte ihn heute früh selbst hochgezogen. Sie öffnete den Reißverschluss, griff ins Seitenfach, zog die Wechselhose heraus, die Socken, den angebissenen Reiskeks in Folie. Sie wusste, was drin war. Sie hatte es gestern Abend gepackt. Die Hose lag gefaltet, wie sie sie gefaltet hatte. Die Socken mit den Punkten, nicht die Streifen. Alles stimmte.",
  "Ihre Finger fuhren an die innere Naht, wo sie den Ersatzgummi immer in ein kleines Stoffsäckchen steckte, damit er nicht im Futter verschwand.",
  "Der rote Haargummi, den sie eingewickelt hatte, lag da. Sie hatte ihn morgens selbst um Milas Zopf gelegt und dann den Ersatz reingesteckt. Mila verlor sie zu oft.",
  "Daneben lag ein zweiter.",
  "Dunkelgrün, mit einem kleinen Stoffstern, an der Knotenstelle etwas abgegriffen. Nicht ihrer. Nicht aus Milas Schublade. Sie zog ihn heraus und hielt ihn gegen das Licht im Flur. Der Stern war aus Filz, unsauber umnäht, an einer Ecke offen. Sie kannte den Stern. Sie hatte ihn an einem Schlüsselband gesehen, das über einer Garderobe hing, die nicht ihre war. Nora hatte solche Sterne genäht, im Winter, als sie sie mal wieder zu viel Projekte gleichzeitig vorgenommen hatte.",
  "Eva hielt den Gummi in der Hand. Er war warm von ihrer Faust.",
  "Sie legte ihn auf die Kommode, nicht in die Schale, in der Milas Gummis lagen, sondern daneben, einzeln, mit Abstand zu allem anderen.",
  "Dann griff nach ihrem Handy und öffnete die Kontakte, suchte nach Nora, und legte den Daumen nicht auf Anrufen.",
  "Sie ging in die Küche, stellte Wasser auf, ohne zu wissen, wofür, und kehrte zurück zum Flur.",
  "Er lag noch da.",
  "Sie machte ein Foto. Von oben, mit dem roten daneben, mit einem Streichholz als Maßstab, weil sie nicht wusste, wie man so etwas richtig macht und irgendetwas tun musste, das später nicht lächerlich aussah. Dann zog sie eine Tüte aus der Küchenschublade, eine von den Gefrierbeuteln, schob den grünen Gummi hinein und schrieb das Datum drauf, ohne Namen.",
  "Die Tüte legte sie nicht in die Schublade, sondern oben auf den Schrank, hinter den Karton mit den alten Fotos, dorthin, wo sie morgens nicht hinsah, wenn sie schnell los musste.",
  "Dann ging sie Mila holen."
];

const sceneFourParagraphs = [
  "Der Küchentisch trug alles, was Eva besaß, um sich selbst zu beweisen. Das Handy mit offener Kita-App, daneben der Papierkalender, die schwarze Kladde mit den Wochenplänen, ein Stapel Ausdrucke aus dem Drucker im Flur, noch warm vom Toner. Mila schlief seit einer halben Stunde. Durch die angelehnte Zimmertür kam das gleichmäßige Atmen, das Eva sonst beruhigte.",
  "Sie begann mit dem Gestern. Kalender: Besprechung bis siebzehn Uhr, danach Einkauf, Abholung Mila sechzehn Uhr fünfzehn durch sie selbst, handschriftlich eingetragen, Kugelschreiber, keine Korrektur. App: Abholung bestätigt, sechzehn Uhr zwölf, Unterschrift Eva Berger. Sie legte den Finger auf die Zahl im Kalender, dann auf die Zahl im Display. Drei Minuten Abweichung. In der Welt der Kita war das nichts. In ihrer eigenen Erinnerung war sie gestern um sechzehn Uhr zwölf in der Redaktion am Schreibtisch gesessen, zweites Glas Wasser, Kopfhörer auf.",
  "Sie öffnete die Wochenhistorie. Montag, Dienstag, Mittwoch. Alles in Reihe, alles ihre Unterschrift, alles ihre übliche Zeit. Kein verrutschter Eintrag, kein technischer Schluckauf, keine doppelte Bestätigung, die sie hätte anfechten können. Das System war zu sauber, um kaputt zu sein.",
  "Eva stand auf und holte den alten Ordner aus dem Schrank, den mit dem grünen Rücken, Kita-Unterlagen seit Milas Aufnahme. Sie blätterte rückwärts. Impfpass-Kopie, Elternbeitragsbescheid, die erste Eingewöhnungsnotiz mit Milas Namen in Petras Handschrift. Dahinter, in einer Klarsichthülle, die Reserve-Notfallliste. Ausgedruckt, abgezeichnet, Datum vor zwei Jahren.",
  "Sie zog das Blatt heraus.",
  "Oben stand ihr eigener Name, dann Simon. Darunter, handschriftlich ergänzt, mit ihrem eigenen blauen Kuli, die Zeile, die sie zu suchen vergessen hatte: Nora Seidel, Hofnachbarin, jederzeit erreichbar. Die Telefonnummer war Noras alte Festnetznummer, die sie längst nicht mehr benutzte. Daneben Evas Unterschrift, klein, eilig, die Schleife am E etwas zu weit ausgeholt, weil sie damals das Formular zwischen Tür und Angel ausgefüllt hatte.",
  "Sie hatte Nora gestrichen. Sie war sich sicher. Letztes Jahr, als Simon auszog, hatte sie alle Listen neu gemacht, die digitale in der App und die Papierfassung. Sie hatte es sich vorgenommen.",
  "Das Blatt in ihrer Hand widersprach ihr.",
  "Eva drehte es um. Rückseite leer. Sie suchte nach einem Stempel, einem Ungültig-Vermerk, irgendetwas, das zeigte, dass dieses Exemplar überholt war. Nichts. Nur ein kleiner Knick in der oberen Ecke, als hätte es jemand eingesteckt und wieder zurückgelegt.",
  "Sie legte das Blatt neben die App. Zwei Listen, zwei Wahrheiten. Auf dem Display stand oben, in der aktuellen Fassung, nur Eva und Simon. Auf Papier stand Nora immer noch, mit ihrer eigenen Hand eingetragen, mit ihrer eigenen Unterschrift beglaubigt. Eine davon war das, was die Kita im Notfall in die Hand nahm. Eva wusste nicht mehr, welche.",
  "Unten klingelte es kurz am Hoftor. Dann Schritte auf dem Kopfsteinpflaster, die sie ohne hinzusehen erkannt hätte.",
  "Sie trat ans Küchenfenster. Nora stand im Innenhof, einen Topf in beiden Händen, den Griff des Deckels mit einem Küchenhandtuch gesichert. Sie sah hoch, lächelte, hob den Topf ein Stück, eine Frage ohne Worte.",
  "Eva ging runter.",
  "„Hab zu viel gekocht\", sagte Nora. „Karottensuppe. Mila mag die doch. Nimmst du mir einen Teil ab.\"",
  "Es war keine Frage. Eva nahm den Topf. Er war noch warm.",
  "„Du bist ein Schatz.\"",
  "„Ach was.\" Nora schob die Hände in die Ärmel ihres Cardigans. „Wie geht's ihr? Heute Nachmittag war sie doch so aufgedreht, da kriegt sie abends schwer Ruhe.\"",
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
  "Oben in der Wohnung stellte sie den Topf auf dem Herd ab, ohne den Deckel abzunehmen. Der Flur lag halb dunkel, nur die Lampe über dem Schuhregal brannte. Sie zog die Wohnungstür hinter sich zu, den kleinen Zug, bis der Riegel einrastete, und legte die Kette vor. Sie legte nie die Kette vor.",
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
  "Eva sah auf den Namen. Nora Seidel, Hofnachbarin. Ihre eigene, damalige Formulierung. Der Haken bei in Ausnahmefällen von ihr selbst gesetzt, die Telefonnummer in ihrer Schrift. Daneben, in einem anderen Kugelschreiber, blasser, ein kleines Datum, das Eva nicht erinnerte, geschrieben zu haben. Vielleicht ein Zusatz bei einer späteren Aktualisierung. Vielleicht nicht.",
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
  "Petra drehte das neue Blatt herum. \"Dann bitte hier, hier und hier.\"" ,
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
  "An der Garderobe hing Milas Anorak am Haken, der Ärmel halb in den Haken des Nachbarkindes gerutscht. Eva zog ihn nicht zurecht. Es war nicht mehr ihre Aufgabe, jedenfalls nicht jetzt, nicht um zehn vor zehn, nicht mit dem Papier in der Hand, das sagte, in welchem Rahmen sie ihr Kind berühren durfte.",
  "Draußen schlug ihr die Luft kalt ins Gesicht. Sie atmete einmal tief ein und ging die drei Stufen hinunter zum Gehweg.",
  "Auf der anderen Straßenseite, schräg gegenüber der Einfahrt, stand Nora.",
  "Sie stand nicht auffällig. Sie stand, wie man steht, wenn man gerade aus der Bäckerei kommt und kurz in der Tasche etwas sucht. Dunkler Mantel, die Haare zurückgesteckt. Sie sah Eva nicht. Oder sie sah sie und tat, als sähe sie sie nicht.",
  "In ihrer Hand hielt sie etwas aus buntem Tonpapier, an den Rändern gezackt, eine Schere hatte es in die Form eines Sterns gebracht, in der Mitte ein Streifen Transparentpapier, gelb. Eva kannte diese Sterne. Sie klebten seit letzter Woche hinter den Gruppenfenstern, jedes Kind hatte einen gemacht, Milas war der mit dem gelben Transparentpapier gewesen, weil sie das rote zuerst zerrissen hatte und dann geweint hatte und dann das gelbe bekommen hatte.",
  "Nora schob den Stern in ihre Handtasche, drückte den Verschluss zu und ging weiter, Richtung Straßenbahn.",
  "Eva blieb auf der Stufe stehen, die Kopie der neuen Vereinbarung zwischen den Fingern, und das Papier gab an den Rändern nach."
];

export default function DieFalscheAbholungSamplePage() {
  return (
    <main className="reader-shell sample-reader">
      <header className="reader-topbar sample-reader__topbar">
        <div>
          <p className="reader-eyebrow">EMBER Leseprobe</p>
          <h1>Die falsche Abholung</h1>
          <p>Szenen 1 bis 5 sind live. Die Leseprobe wird fortlaufend ergänzt.</p>
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

        <section className="sample-reader__divider">
          <p className="reader-eyebrow">Fortsetzung folgt</p>
          <h3>Szene 6</h3>
          <p>
            Die Leseprobe endet hier vorerst. Im EMBER Studio kannst du den weiteren
            Verlauf der Geschichte entwickeln.
          </p>
        </section>
      </article>
    </main>
  );
}
