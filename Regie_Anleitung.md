Datei 1: EMBER_UNIVERSAL.md
# ============================================================
# EMBER REGIE-VORLAGE — UNIVERSAL
# ============================================================
#
# Diese Datei ist die vollständige Produktionsgrundlage
# für ein Buch in der EMBER-Pipeline.
#
# Sie besteht aus zwei Ebenen:
#
# EBENE 1 — Pipeline-Pflicht
# Wird maschinell gelesen. Fehlende Pflichtfelder können
# Writer-Prompts, Continuity-Audits oder Scene-Audits beschädigen.
#
# EBENE 2 — Dramaturgisches Rückgrat
# Wird nicht direkt in den Writer gegeben. Diese Ebene hält
# Arc, Payoff, Drucklogik und Figurenentwicklung zusammen.
#
# Trennregel:
# Alles, was mit "wird später", "stellt sich heraus",
# "in Wirklichkeit" oder "am Ende" beginnt, gehört NICHT
# in World Bible oder Scene Card.
#
# Es gehört in:
# - characterLedger
# - lossLadder
# - antagonistMap / pressureMap
# - openThreads
# - reviewOnly-Felder
#
# ============================================================


# ============================================================
# EBENE 1 — PIPELINE-PFLICHT
# ============================================================

projectMeta:
  title: >
    # Arbeitstitel des Buches.

  language: "de"

  genreModule: >
    # Name oder Pfad des aktiven Genre-Moduls.
    # Beispiel: "GENRE_THRILLER.md"
    # Beispiel: "GENRE_FANTASY.md"
    # Beispiel: "GENRE_ROMANCE.md"

  version: "1.0"


masterBrief:
  premise: >
    # Ein Satz: Wer ist die Hauptfigur, was passiert ihr,
    # und wodurch wird sie bedroht oder gezwungen zu handeln.
    #
    # Universelle Formel:
    # "Eine/Ein [Hauptfigur] gerät in [zentrale Störung],
    # als [Auslöser] geschieht, und muss [konkretes Ziel]
    # erreichen, bevor [Druck / Verlust / Konsequenz] eintritt."

  readerPromise: >
    # Was der Leser spüren soll.
    # Kein Genre-Label, keine Plotzusammenfassung.
    #
    # Beispiel:
    # "Der Leser soll spüren, wie eine vertraute Ordnung
    # unzuverlässig wird, sobald andere Menschen beginnen,
    # die sichtbaren Beweise anders zu lesen."

  thematicCore: >
    # Was das Buch unter der Oberfläche verhandelt.
    # Keine Moral, kein Schlusssatz, keine These als Vortrag.
    #
    # Beispiel:
    # "Wer bestimmt, welche Version eines Menschen glaubwürdig ist,
    # bestimmt auch, welche Handlungsspielräume dieser Mensch behält."

  authorIntent: >
    # Wie die Regie Druck aufbauen soll.
    # Konkret, handlungsbezogen, nicht stilistisch.
    #
    # Beispiel:
    # "Jede Szene soll ein konkretes Alltagsdetail, ein Objekt,
    # eine Beziehung oder ein Verfahren so verschieben, dass die
    # Hauptfigur weniger Zugriff, weniger Glaubwürdigkeit oder
    # weniger Kontrolle hat."

  currentFocus: >
    # Was in den nächsten Szenen immer geprüft wird.
    #
    # Beispiel:
    # "Bleibt die zentrale Störung konkret sichtbar?
    # Variiert der ending_type?
    # Hat jeder Druckzug Kosten?
    # Verändert jede Szene Zugriff, Wissen, Loyalität oder Risiko?"

  forbidden:
    - "Kein endingPromise im Master Brief."
    - "Keine vollständige Story Architecture im Master Brief."
    - "Keine Auflösung, keine Täterwahrheit, kein Finale-Leak."


marketBrief:
  categoryLane: >
    # Genre / Subgenre / Ton in einem kurzen Ausdruck.
    #
    # Beispiel:
    # "Psychological Thriller / Domestic Suspense"
    # "Romantic Drama / Second Chance"
    # "Epic Fantasy / Political Court Intrigue"
    # "Literary Fiction / Family Secrets"

  hook: >
    # Ein Satz, der den Kaufimpuls erklärt.
    # Nicht die ganze Handlung, sondern der Kernreiz.
    #
    # Beispiel:
    # "Was, wenn der Mensch, dem du am meisten vertraust,
    # ausgerechnet durch dieses Vertrauen Macht über dich gewinnt?"

  audienceExperience: >
    # Welche Leseerfahrung soll entstehen?
    # Spannung, Sehnsucht, moralischer Druck, Wunder, Intimität,
    # Kontrollverlust, soziale Enge, emotionale Umkehr usw.

  publishingGuardrails:
    - >
      # Lesbarkeitsregel für Writer-Prompts.
      # Beispiel: "Kapitel bevorzugt zwischen 1000 und 1500 Wörtern,
      # außer Fusionsszenen sind ausdrücklich markiert."
    - >
      # Genre- oder Marktregel.
      # Beispiel: "Konflikte müssen über Handlung, Dialog oder Objekt
      # sichtbar werden, nicht über abstrakte Erklärung."
    - >
      # Weitere Regeln nach Bedarf.


lockedFacts:
  # ----------------------------------------------------------
  # Universelle Locked Facts
  # ----------------------------------------------------------
  #
  # Diese Felder bleiben in jedem Projekt vorhanden.
  # Wenn ein Feld für ein Buch nicht gilt, leer lassen,
  # aber nicht löschen.
  #
  # Die Pipeline darf diese Werte als harte Constraints
  # in Writer-Prompts und Audits verwenden.
  # ----------------------------------------------------------

  centralSystemName: >
    # Name der zentralen Ordnung, Institution, Familie, Gruppe,
    # Weltregel, Firma, Schule, Hofstruktur, Gemeinschaft oder
    # Beziehungsmatrix.
    #
    # Leer lassen, wenn es keine zentrale benannte Instanz gibt.

  centralEventLabel: >
    # Kurzname des zentralen Vorfalls, Auslösers oder Mechanismus.
    #
    # Beispiel:
    # "die Beschwerde"
    # "der Brand"
    # "der verschwundene Brief"
    # "die Verlobungsankündigung"
    # "die Prophezeiung"
    # "der Vertragsbruch"

  centralEventDate: >
    # Datum des zentralen Ereignisses.
    # Format bevorzugt: "Wochentag, TT. Monat JJJJ"
    #
    # Leer lassen, wenn kein datierter Vorfall existiert.

  centralEventTime: >
    # Dokumentierte Uhrzeit des zentralen Ereignisses.
    # Format bevorzugt: "HH:MM Uhr"
    #
    # Leer lassen, wenn keine Uhrzeit relevant ist.

  triggerOrNotificationTime: >
    # Wann die Hauptfigur vom Auslöser erfährt
    # oder wann der Auslöser für sie wirksam wird.

  protagonistVerifiedState: >
    # Was über die Hauptfigur zum relevanten Zeitpunkt
    # nachweislich, sozial sichtbar oder faktisch feststeht.
    #
    # Thriller-Beispiel: "war in der Kita"
    # Fantasy-Beispiel: "trug das Siegel nicht"
    # Romance-Beispiel: "hatte die Stadt bereits verlassen"
    # Drama-Beispiel: "war bei der Beerdigung nicht anwesend"

  protagonistVerifiedWindow: >
    # Zeitfenster oder Bedingungsfenster dieses nachweislichen Zustands.
    #
    # Beispiel:
    # "08:10 bis 08:42 Uhr"
    # "während der Ratssitzung"
    # "vor dem ersten Brief"
    # "seit dem Winterfest"

  documentedClaim: >
    # Welche Behauptung steht in einem Dokument, Gerücht,
    # Vertrag, Protokoll, Schwur, Brief, Zeugnis, magischen Zeichen,
    # öffentlichen Bild oder sozialen Konsens?
    #
    # Wichtig:
    # Nicht erklären, ob die Behauptung stimmt.
    # Nur den dokumentierten oder sichtbaren Claim eintragen.

  centralRecordOrObject: >
    # Das zentrale Dokument, Objekt, Zeichen, Artefakt,
    # Erinnerungsstück, digitale Spur oder materielle Beweisstück,
    # das wiederholt dramaturgisch relevant ist.

  additionalLockedFacts:
    - key: >
        # Eindeutiger maschinenlesbarer Schlüssel.
        # Beispiel: "heiratsvertragDatum"
      value: >
        # Exakter kanonischer Wert.
      audit: true
      note: >
        # Kurze Erklärung für Menschen.
        # Keine Auflösung, kein späterer Twist.


continuityGuardrails:
  figurennamen:
    - "Vorname Nachname"
    # Immer vollständiger Name.
    # Alle Figuren, die namentlich im Text auftauchen.
    # Pipeline prüft: Wenn Vorname erscheint, muss Nachname stimmen.

  objektfarben:
    - "Farbe Objekt von Figur"
    # Format:
    # "gelber Becher von Eva"
    # "roter Wollschal"
    # "blaue Tasche"
    # "silberner Schlüssel"
    #
    # Nur Objekte eintragen, die mehrfach vorkommen
    # und deren Farbe konstant bleiben muss.

  kanonischeBegriffe:
    - "Begriff"
    # Optional.
    # Für wiederkehrende Eigenbegriffe, Orte, Gruppen,
    # Titel, Rituale, Institutionen oder magische/politische Systeme.
    #
    # Keine Regelprosa.
    # Nur exakte Begriffe.


worldBible:
  # ----------------------------------------------------------
  # World Bible enthält NUR Gegenwartszustand und aktuelle
  # Funktion im Alltag oder System.
  #
  # Verboten:
  # - "wird später erkennen"
  # - "ist in Wirklichkeit"
  # - "stellt sich heraus"
  # - Täterwissen
  # - Finale
  # - Arc
  # - geheime Motivation
  # ----------------------------------------------------------

  - kind: "character"
    title: "Vorname Nachname"
    summary: >
      # Gegenwartszustand, soziale Rolle, sichtbares Verhalten,
      # aktuelle Funktion im Alltag.
      #
      # Erlaubt:
      # "X wirkt kontrolliert und reagiert empfindlich,
      # wenn Routinen unterbrochen werden."
      #
      # Verboten:
      # "X wird später verstehen, dass..."
      # "X ist eigentlich..."
      # "X hat heimlich..."

  - kind: "object"
    title: "Farbe Objektname"
    summary: >
      # Funktion und Alltagsbedeutung.
      # Farbe im Titel, wenn die Pipeline Farbanker extrahiert.
      #
      # Keine spätere Payoff-Erklärung.

  - kind: "place"
    title: "Ortname"
    summary: >
      # Gegenwärtige Funktion des Ortes.
      # Wie wird der Ort benutzt?
      # Wer hat dort Zugriff?
      # Welche soziale oder praktische Ordnung gilt dort?

  - kind: "institution"
    title: "Name der Institution oder Gruppe"
    summary: >
      # Aktuelle Rolle dieser Institution, Gruppe oder Ordnung.
      # Keine geheime Agenda, keine spätere Enthüllung.

  - kind: "rule"
    title: "Name der Regel / Norm / Weltbedingung"
    summary: >
      # Nur die gegenwärtig geltende Regel.
      # Besonders nützlich für Fantasy, Sci-Fi, Gericht, Schule,
      # Familie, Firma, religiöse Ordnung, Vertragssysteme.


sceneCards:
  - id: "S01"

    pov: "Vorname Nachname"

    ort: "Konkreter Ort"

    location: "Konkreter Ort"
    # Gleich wie ort — für Parser-Kompatibilität.

    uhrzeit: "Datum und Uhrzeit"

    timeAnchor: >
      # Relativer Zeitanker zur vorherigen Szene.
      #
      # Beispiel:
      # "Drei Stunden nach S00"
      # "Am nächsten Morgen"
      # "Noch am selben Abend"
      # "Zwei Wochen vor dem Fest"

    situation: >
      # Was ist schon falsch, instabil, gefährdet oder verschoben,
      # wenn die Szene beginnt?
      #
      # Konkret, nicht atmosphärisch.
      #
      # Schlecht:
      # "Eine unheimliche Stimmung liegt über allem."
      #
      # Gut:
      # "Die Einladung liegt bereits auf dem Tisch,
      # obwohl die POV-Figur sie niemandem gegeben hat."

    want: >
      # Was will die POV-Figur in dieser Szene konkret erreichen?
      #
      # Es muss spielbar sein:
      # fragen, holen, verhindern, prüfen, unterschreiben,
      # öffnen, zurückgeben, gestehen, ablehnen, schützen usw.

    pressure: >
      # Wer oder was macht das Wollen schwer?
      #
      # Erlaubt:
      # Person, Institution, Objekt, Regel, Frist, Körper,
      # soziale Erwartung, Naturbedingung, magisches Gesetz,
      # ökonomische Abhängigkeit.
      #
      # Nicht abstrakt:
      # kein "Angst", kein "Schicksal", kein "Spannung".

    material: >
      # 1–3 konkrete Dinge, die in der Szene physisch,
      # sozial oder verfahrenstechnisch wirken.
      #
      # Beispiel:
      # "weißer Umschlag, zerkratzter Schlüssel, nasse Schuhe"
      #
      # Keine Konzepte.

    proof_object: >
      # Das eine Objekt, Dokument, Zeichen, Bild, Körperdetail,
      # Formular, Kleidungsstück, Brief, Artefakt oder Gerät,
      # das die Szene dramaturgisch trägt.

    beweisobjekt: >
      # Gleich wie proof_object — für Parser-Kompatibilität.

    turn: >
      # Was kippt in Wissen, Zugriff, Beziehung, Status,
      # Selbstbild, Gefahr oder Handlungsoption?
      #
      # coreAction beschreibt Handlung.
      # turn beschreibt Verschiebung.

    irreversible_change: >
      # Was kann nach dieser Szene nicht mehr so sein wie vorher?
      #
      # Muss konkret sein:
      # Zugriff verloren, Beziehung beschädigt, Frist gesetzt,
      # falsche Version öffentlich, Objekt verschwunden,
      # Loyalität gewechselt, Regel aktiviert.

    konkrete_folge: >
      # Was passiert direkt nach dieser Szene als Konsequenz?
      #
      # Nicht als ferner Payoff.
      # Direkt anschlussfähig für die nächste Szene.

    cost: >
      # Was verliert die POV-Figur konkret in dieser Szene?
      #
      # Beispiele:
      # Zeit, Glaubwürdigkeit, Zugang, Geld, Ruhe,
      # Verbündetenvertrauen, körperliche Sicherheit,
      # Deutungshoheit, soziale Stellung, Geheimnis.

    avoid: >
      # Welche Fehlfassung soll die Szene vermeiden?
      #
      # Beispiel:
      # "Nicht in Erklärung kippen — der Druck soll über
      # den Umschlag, die Unterschrift und die Reaktion
      # der Nebenfigur sichtbar werden."

    ending_type: >
      # Pflicht.
      # Nur eine ID aus dem aktiven Genre-Modul eintragen.
      #
      # Beispiel:
      # "access_loss"
      # "relationship_shift"
      # "proof_turn"
      # "moral_reframe"
      # "deadline_shift"

    moment: >
      # Optional.
      # Eine kurze menschliche Handlung, die nicht Plotbeweis,
      # nicht Symbol und nicht Erklärung ist.
      #
      # Beispiel:
      # "Jonas schiebt die kalten Pommes an den Tellerrand
      # und zählt nur die geraden."

    kindmoment: >
      # Optional, nur wenn ein Kind als Figur existiert.
      # Kindliche Handlung — kein Symbol, kein Beweis,
      # keine Plot-Erklärung.
      #
      # Beispiel:
      # "Mila legt dem Stoffhasen die Haarspange an und sagt,
      # er müsse hübsch sein, wenn Mama kommt."

    word_target_min: 1000
    word_target_max: 1500
    # Default-Werte.
    # Für Fusionskapitel oder bewusst längere Szenen direkt
    # in der Scene Card überschreiben.

    reviewOnly:
      # Diese Felder sind nur für Mensch, Audit oder Validator.
      # Sie dürfen nie ungefiltert in den Writer-Prompt.
      setup: >
        # Was diese Szene vorbereitet.
      payoff: >
        # Wo oder wie es später eingelöst wird.
      antagonist_kosten: >
        # Welche Kosten, Fehler oder Engführungen ein Druckzug erzeugt.
      scene_promise: >
        # Welche Erwartung diese Szene beim Leser öffnet.
      new_question: >
        # Welche neue Frage entsteht.
      wissensgrenze: >
        # Was die POV-Figur, der Leser oder andere Figuren
        # jetzt noch NICHT wissen dürfen.


# ============================================================
# EBENE 2 — DRAMATURGISCHES RÜCKGRAT
# ============================================================

antagonistMap:
  # ----------------------------------------------------------
  # Universell verstanden:
  # antagonistMap beschreibt jede aktive Druckfigur oder
  # Druckkraft mit eigenem Plan oder eigener Logik.
  #
  # Das kann sein:
  # - klassische Antagonistin
  # - Liebesgegenpol
  # - Familienmitglied
  # - Institution
  # - Herrscherhaus
  # - Firma
  # - religiöse Ordnung
  # - politisches System
  # - magische Macht
  # - Naturbedingung
  # - innere Fehlannahme, wenn sie szenisch externalisiert wird
  #
  # Wichtig:
  # Keine folgenlose Allmacht.
  # Jeder Druckzug braucht Möglichkeit, Grenze und Kosten.
  # ----------------------------------------------------------

  - name: "Vorname Nachname / Name der Druckkraft"

    type: >
      # person / institution / system / family / rival /
      # lover / court / guild / law / magical_force /
      # social_order / inner_pattern

    herkunft: >
      # Wie kam diese Figur oder Kraft plausibel und legal
      # in den Alltag, die Welt oder das Leben der Hauptfigur?
      #
      # Diese Herkunft erklärt späteren Zugriff ohne Allmacht.

    wunde: >
      # Was hat diese Figur verloren, nie bekommen,
      # falsch verstanden oder zu stark verteidigt?
      #
      # Nur hier.
      # Nicht in World Bible Summary.

    motivation: >
      # Was will diese Figur oder Druckkraft aktiv erhalten,
      # zurückholen, erzwingen, verhindern oder beweisen?

    canKnow:
      - >
        # Was sie plausibel wissen kann.
      - >
        # Was sie durch Nähe, Rolle, Beobachtung, Akten,
        # Tradition, Weltregel oder Beziehung erfahren konnte.
      - >
        # Welche alten Zugänge, Beziehungen oder Routinen
        # noch offen stehen.

    canDo:
      - >
        # Was sie praktisch, sozial, institutionell, emotional,
        # magisch, ökonomisch oder körperlich tun kann.
      - >
        # Welche Handlungen innerhalb ihrer Macht plausibel sind.

    cannotDo:
      - >
        # Was sie NICHT kann.
      - >
        # Keine unerklärte Allmacht.
      - >
        # Kein Wissen ohne Quelle.
      - >
        # Kein perfektes Timing ohne Kosten.
      - >
        # Keine Fähigkeiten außerhalb der gesetzten Weltlogik.

    kostenLedger:
      - sceneId: "S01"
        erfolg: >
          # Was diese Figur oder Druckkraft in der Szene erreicht.
        restfehler: >
          # Welcher Fehler, welche Spur, welche moralische Kosten,
          # welche Überdehnung oder welche neue Grenze sichtbar bleibt.
        payoff: >
          # In welcher späteren Szene oder welchem Akt dieser Fehler
          # wieder relevant werden soll.


lossLadder:
  # ----------------------------------------------------------
  # Die Verlustleiter verhindert gleichförmige Druckszenen.
  # Sie beschreibt nicht nur äußeren Verlust, sondern auch:
  # - Glaubwürdigkeit
  # - Zugriff
  # - Nähe
  # - Status
  # - Selbstbild
  # - moralische Sicherheit
  # - Weltverständnis
  # - Handlungsspielraum
  # ----------------------------------------------------------

  act1:
    titel: "Die erste Verschiebung"

    protagonistVerliert:
      - >
        # Erster konkreter Verlust.
      - >
        # Zweiter konkreter Verlust.

    protagonistHaeltNochFestAn: >
      # Welche falsche Sicherheit, Fehlannahme oder alte Strategie
      # trägt die Hauptfigur am Ende von Act 1 noch?

    falseLesart: >
      # Was der Leser oder andere Figuren am Ende von Act 1
      # noch glauben dürfen.

    neueLesart: >
      # Was am Ende von Act 1 klar geworden sein muss.

    wasUnbewiesenBleibt: >
      # Was noch nicht bewiesen, ausgesprochen oder entschieden
      # werden darf.

  act2:
    titel: "Die Vertiefung"

    protagonistVerliert:
      - >
        # Verlust von Zugriff, Beziehung, Status, Sicherheit,
        # Deutungshoheit oder Selbstbild.
      - >
        # Weiterer Verlust.
      - >
        # Weiterer Verlust.

    protagonistErkennt: >
      # Was die Hauptfigur in Act 2 begreift,
      # ohne dass es als These erklärt werden muss.

    falseLesart: >
      # Was andere Figuren noch glauben dürfen.

    neueLesart: >
      # Was am Ende von Act 2 klar sein muss.

    rhythmusRegel:
      - >
        Nach spätestens zwei Informations-, Beweis- oder
        Erkenntnisszenen braucht es eine Szene mit direkter Folge
        für Zugriff, Loyalität, Status oder zentrale Routine.
      - >
        Nebenfiguren-Szenen sind keine Pausen.
        Sie sind Orte, an denen Beweise Konsequenzen bekommen.

  act3:
    titel: "Die Rückeroberung"

    protagonistGewinntZurueck:
      - >
        # Was die Hauptfigur aktiv zurückerobert.
      - >
        # Weiterer zurückgewonnener Handlungsspielraum.

    protagonistMussAufgeben:
      - >
        # Welche alte Strategie, Illusion, Bindung,
        # Selbstlüge oder Sicherheit muss sie loslassen?

    regelFuerAct3:
      - "Kein Geständnis als Abkürzung."
      - "Kein Wunderfund."
      - "Keine Lösung ohne vorher gesetztes Material."
      - "Beweise, Entscheidungen oder Handlungen schlagen härter als Lautstärke."
      - "Keine Dämonisierung der Gegenkraft im letzten Drittel."


openThreads:
  # ----------------------------------------------------------
  # Jeder Thread braucht:
  # - ID
  # - dramaturgische Frage
  # - Status
  # - geplanten Payoff-Akt
  #
  # Statuswerte:
  # offen / watch / resolved
  # ----------------------------------------------------------

  - id: "OT001"
    thread: >
      # Die zentrale dramaturgische Frage in einem Satz.
    status: "offen"
    payoff_act: "Act 2"

  - id: "OT002"
    thread: >
      # Weitere offene Frage.
    status: "offen"
    payoff_act: "Act 3"

  - id: "OT003"
    thread: >
      # Frage zu Beziehung, Loyalität oder Vertrauen.
    status: "offen"
    payoff_act: "Act 2"

  - id: "OT004"
    thread: >
      # Frage zur wahren Reichweite der Bedrohung,
      # Sehnsucht, Macht oder falschen Ordnung.
    status: "offen"
    payoff_act: "Act 3"


characterLedger:
  # ----------------------------------------------------------
  # Arc-Material gehört hierher, nie in die World Bible.
  # ----------------------------------------------------------

  - characterId: "PROTAGONIST"
    name: "Vorname Nachname"

    functionInStory: >
      # Welche Funktion erfüllt die Hauptfigur dramaturgisch?
      # Nicht Plotauflösung, sondern Rolle im Drucksystem.

    wunde:
      wasPassiertIst: >
        # Was früher passiert ist und heute nachwirkt.
      wasEsHeuteMacht: >
        # Wie die Wunde aktuelles Verhalten formt.
      wasNiemalsGeschieht: >
        # Was diese Figur nie tun würde.
        # Hält Writer und Audit im Rahmen.

    arcPhasen:
      - phase: "Act 1"
        state: >
          # Welchen Irrtum, welche Schutzstrategie oder
          # falsche Sicherheit trägt die Figur am Anfang?
      - phase: "Act 2"
        state: >
          # Was erkennt sie, und was kostet es sie?
      - phase: "Act 3"
        state: >
          # Was muss sie aktiv zurückerobern oder loslassen?

    pressureBehavior: >
      # Wie handelt diese Figur unter Druck?
      # Konkret:
      # schweigt, kontrolliert Details, macht Witze,
      # sucht Verfahren, greift an, flieht in Fürsorge,
      # verhandelt, provoziert, ordnet Dinge.

    speechPattern: >
      # Wie spricht diese Figur unter Druck?
      # Satzlänge, Ausweichmuster, Direktheit,
      # Fachsprache, Humor, Höflichkeit, Härte.

    verboten:
      - "Keine langen Innenmonologe über das zentrale Thema."
      - "Kein Satz nach dem Muster: Jetzt verstand sie, dass..."
      - "Keine Arc-Erklärung anstelle von Handlung."

  - characterId: "ANTAGONIST_OR_PRESSURE"
    name: "Vorname Nachname / Name der Druckkraft"

    functionInStory: >
      # Nicht automatisch böse.
      # Beschreibt, welche Gegenlogik diese Figur oder Kraft
      # zur Hauptfigur bildet.

    wunde:
      wasPassiertIst: >
        # Ursprung von Mangel, Verlust, Kränkung,
        # Überzeugung oder Kontrollbedürfnis.
      wasEsHeuteMacht: >
        # Wie daraus aktuelles Handeln entsteht.
      wasNiemalsGeschieht: >
        # Grenze der Figur oder Kraft.

    speechPattern: >
      # Wie spricht diese Figur?
      # Was verrät sie?
      # Was verbirgt sie?
      # Wie bleibt sie sozial plausibel?

    verboten:
      - "Keine psychoanalytische Selbstauskunft."
      - "Kein offenes Erklären des eigenen Plans."
      - "Keine Allmacht ohne Kosten."
      - "Kein Wissen ohne plausiblen Zugang."

  - characterId: "KEY_RELATION"
    name: "Vorname Nachname"

    functionInStory: >
      # Diese Figur ist weder bloß Helfer noch bloß Hindernis.
      # Sie handelt aus eigener Logik.

    loyaltyLogic: >
      # Woran orientiert sich diese Figur?
      # Stabilität, Liebe, Status, Angst, Verfahren,
      # Pflicht, Glauben, Ehrgeiz, Schuld, Schutz?

    arcPhasen:
      - phase: "Act 1"
        state: >
          # Anfangsposition.
      - phase: "Act 2"
        state: >
          # Was verschiebt sich?
      - phase: "Act 3"
        state: >
          # Welche Entscheidung oder Grenze wird sichtbar?

    verboten:
      - "Nicht zum heimlichen Antagonisten umcodieren."
      - "Nicht als reine Erklärfigur benutzen."
      - "Keine Loyalitätswende ohne szenische Kosten."


rhythmusRegel:
  allgemein:
    - >
      Jede Szene verändert mindestens eines:
      Wissen, Zugriff, Loyalität, Status, Risiko,
      Beweislage, Nähe, Selbstbild oder Handlungsspielraum.

    - >
      Nach spätestens zwei reinen Informations-, Beweis-,
      Ermittlungs- oder Reflexionsszenen braucht es eine Szene
      mit direkter Folge für Zugriff, Loyalität, Beziehung,
      zentrale Routine oder äußeren Status.

    - >
      Nie mehr als drei Szenen hintereinander mit demselben
      ending_type.

    - >
      Nebenfiguren-Szenen sind keine Pausen.
      Sie sind Orte, an denen Beweise, Sehnsüchte, Lügen,
      Regeln oder Entscheidungen Konsequenzen bekommen.

    - >
      Druckfiguren dürfen nicht in jedem Kapitel perfekt getaktet
      erscheinen. Jeder größere Zug hinterlässt Restfehler,
      Kosten, moralische Spannung oder engeren Spielraum.

    - >
      Keine Szene darf nur wiederholen, dass die Lage schlimm ist.
      Jede Szene braucht eine neue Art von Druck.

  endingTypeVarianz:
    - >
      Nicht mehr als zwei reine Erkenntnis- oder Proof-Turn-Enden
      in Folge.

    - >
      Nach einem harten System-, Institutions-, Macht- oder
      Zugriffsendpunkt folgt bevorzugt eine Beziehungs-, Körper-,
      Alltags- oder Sozialfolge.

    - >
      Act 3 soll nicht dieselbe Ending-Type-Folge wiederholen,
      mit der Act 1 gearbeitet hat.

  momentRegel:
    - >
      Wenn Kinder, Tiere, Pflegepersonen, Geschwister,
      ältere Angehörige, Patientinnen, Schüler, Untergebene
      oder andere abhängige Figuren vorkommen:
      Mindestens alle drei Szenen ein konkreter Moment,
      der nicht Beweis, Symbol oder Erklärung ist.

    - >
      Solche Figuren bezeugen nicht bequem den Plot.
      Ihre Handlungen zeigen Wiederholung, Bedürfnis,
      Irritation, Bindung oder Alltag.


writerConstitution:
  - "Nahe dritte Person auf die POV-Figur. Keine allwissende Erklärstimme."
  - "Szenen steigen spät ein und gehen früh raus."
  - "Objektspannung vor Reflexion. Dinge handeln, bevor Gedanken sie ausdeuten."
  - "Wenn Objekt, Blick, Körperdetail oder Verwaltungsdetail die Wirkung trägt, folgt kein erklärender Satz."
  - "Dialog verschiebt Vertrauen, Verfahren, Zugriff, Nähe, Status oder Risiko — kein atmosphärisches Füllgespräch."
  - "Gegenkräfte bleiben sozial, emotional oder systemisch plausibel."
  - "Keine folgenlose Allmacht."
  - "Jede Szene verändert mindestens eines: Wissen, Glaubwürdigkeit, Zugriff, Loyalität, Nähe, Status oder Risiko."
  - "Nach einem starken Bild oder Machtwechsel bevorzugt früh rausgehen."
  - "Kein routinemäßiger Echo-Absatz, wenn Bild oder Handlung bereits tragen."
  - "Keine drei Atmosphärenbeobachtungen vor dem eigentlichen Schlag."
  - "Kurze bis mittlere Kapitel bevorzugen. 1000–1500 Wörter sind Normalbereich."
  - "Im letzten Drittel keine Triumphprosa und keine Dämonisierung."
  - "Entscheidungen, Beweise, Handlungen und Kosten schlagen härter als Lautstärke."
Datei 2: GENRE_MODULE_TEMPLATE.md
# ============================================================
# EMBER GENRE-MODUL — TEMPLATE
# ============================================================
#
# Dieses Modul enthält alles, was NICHT universell ist:
#
# - Genre-spezifische Locked-Fact-Felder
# - erlaubte ending_types
# - typische Drucklogik
# - verbotene Abkürzungen
# - Figuren- und Szenenregeln pro Genre
#
# Das Universal-Template bleibt gleich.
# Dieses Modul wird pro Genre ausgetauscht.
# ============================================================

genreModule:
  id: "GENRE_NAME"

  categoryLane: >
    # Genre / Subgenre / Ton.
    #
    # Beispiel:
    # "Psychological Thriller / Domestic Suspense"
    # "Epic Fantasy / Court Intrigue"
    # "Romantic Drama / Second Chance"
    # "Literary Fiction / Family Secret"

  corePleasure: >
    # Was Leser an diesem Genre primär suchen.
    #
    # Thriller:
    # Kontrollverlust, Verdacht, Druck, Beweisverschiebung.
    #
    # Romance:
    # Nähe, Sehnsucht, Missverständnis, Wahl, emotionale Kosten.
    #
    # Fantasy:
    # Weltwunder, Machtlogik, Regelbruch, Opfer, Zugehörigkeit.

  lockedFactExtensions:
    # --------------------------------------------------------
    # Zusätzliche harte Felder, die dieses Genre braucht.
    # Diese Felder ergänzen lockedFacts aus UNIVERSAL.md.
    # --------------------------------------------------------

    - key: "genreSpecificFact01"
      label: >
        # Menschlich lesbarer Name.
      required: false
      description: >
        # Wofür braucht die Pipeline oder der Audit dieses Feld?
      emptyAllowed: true

    - key: "genreSpecificFact02"
      label: >
        # Beispiel:
        # "Name des magischen Artefakts"
        # "Datum des Vertrags"
        # "Status der Beziehung vor Kapitel 1"
        # "Erbfolgeregel"
        # "öffentliche Version des Skandals"
      required: false
      description: >
        # Beschreibung.
      emptyAllowed: true

  endingTypes:
    # --------------------------------------------------------
    # Nur IDs aus dieser Liste dürfen in sceneCards.ending_type
    # verwendet werden.
    #
    # Jeder ending_type beschreibt die Art des Szenenendes,
    # nicht den Plotinhalt.
    # --------------------------------------------------------

    - id: "access_loss"
      definition: >
        # Die Szene endet damit, dass eine Figur konkreten Zugriff
        # auf Ort, Person, Information, Objekt, Status oder Verfahren
        # verliert.
      useWhen: >
        # Wenn der direkte nächste Schritt blockiert wird.
      avoidWhen: >
        # Wenn nur ein Gefühl von Ohnmacht entsteht,
        # aber kein konkreter Zugriff verloren geht.

    - id: "relationship_shift"
      definition: >
        # Die Szene endet mit einer messbaren Verschiebung von Nähe,
        # Vertrauen, Loyalität, Begehren, Schuld oder sozialer Position.
      useWhen: >
        # Wenn eine Beziehung nach der Szene anders funktioniert.
      avoidWhen: >
        # Wenn nur ein Gespräch ohne Folge stattfindet.

    - id: "proof_turn"
      definition: >
        # Ein Objekt, Dokument, Zeichen, Körperdetail oder sichtbarer
        # Beleg bedeutet am Ende etwas anderes als am Anfang.
      useWhen: >
        # Wenn Material die Deutung kippt.
      avoidWhen: >
        # Wenn die POV-Figur nur nachdenkt.

    - id: "deadline_shift"
      definition: >
        # Eine Frist wird gesetzt, verkürzt, verschärft oder sichtbar.
      useWhen: >
        # Wenn Zeitdruck den nächsten Handlungsschritt erzwingt.
      avoidWhen: >
        # Wenn keine konkrete Frist entsteht.

    - id: "moral_reframe"
      definition: >
        # Die Szene endet damit, dass eine Handlung moralisch
        # anders lesbar wird als zuvor.
      useWhen: >
        # Wenn Schuld, Verantwortung oder Notwendigkeit kippt.
      avoidWhen: >
        # Wenn nur erklärt wird, wer recht hat.

    - id: "social_exposure"
      definition: >
        # Etwas Privates, Unsicheres oder Umstrittenes wird sozial
        # sichtbar und verändert den Raum.
      useWhen: >
        # Wenn Öffentlichkeit oder Beobachtung Druck erzeugt.
      avoidWhen: >
        # Wenn niemand im Umfeld anders reagieren muss.

    - id: "intimacy_threat"
      definition: >
        # Eine intime Beziehung, Gewohnheit, Erinnerung oder Nähe
        # wird bedroht, benutzt oder falsch gelesen.
      useWhen: >
        # Wenn persönliche Nähe zur Druckfläche wird.
      avoidWhen: >
        # Wenn nur allgemeine Gefahr entsteht.

    - id: "object_estrangement"
      definition: >
        # Ein vertrautes Objekt wirkt am Ende fremd, kompromittiert,
        # falsch platziert oder neu aufgeladen.
      useWhen: >
        # Wenn ein Ding die Szene trägt.
      avoidWhen: >
        # Wenn das Objekt austauschbar bleibt.

    - id: "quiet_countermove"
      definition: >
        # Eine Figur antwortet nicht laut, sondern mit einer kleinen,
        # konkreten Gegenhandlung.
      useWhen: >
        # Wenn leise Handlung stärker ist als Konfrontation.
      avoidWhen: >
        # Wenn die Szene eigentlich einen offenen Bruch braucht.

    - id: "physical_proximity"
      definition: >
        # Die Szene endet mit gefährlicher, ersehnter, unerwünschter
        # oder unausweichlicher Nähe im Raum.
      useWhen: >
        # Wenn Körper, Raum oder Distanz die Spannung tragen.
      avoidWhen: >
        # Wenn Nähe nur metaphorisch gemeint ist.

  pressureLogic:
    mainPressureKinds:
      - >
        # Welche Druckarten sind für dieses Genre typisch?
        # Beispiel:
        # soziale Ersetzung, verbotene Liebe, politische Intrige,
        # magische Kosten, Familienpflicht, ökonomische Abhängigkeit.

    validPowers:
      - >
        # Welche Mittel dürfen Gegenkräfte in diesem Genre haben?
        # Beispiel:
        # alte Nähe, sozialer Status, Gesetz, Magie, Besitz,
        # Charisma, Wissen, Begehren, Schuld, Verfahren.

    forbiddenShortcuts:
      - >
        # Welche Abkürzungen sind verboten?
        # Beispiel:
        # kein Geständnis als Lösung,
        # kein Wunderfund,
        # keine Allmacht,
        # keine zufällige Rettung,
        # kein Missverständnis, das durch einen Satz lösbar wäre.

    costRules:
      - >
        # Jeder größere Druckzug erzeugt Kosten.
        # Definiere, welche Kosten im Genre glaubwürdig sind.
        #
        # Beispiel:
        # sozialer Preis, magischer Preis, Vertrauensverlust,
        # öffentlicher Statusverlust, Schuld, körperliche Schwächung,
        # Verlust von Zugang, politische Gegenreaktion.

  figureRules:
    protagonist:
      mustRemain: >
        # Was muss an der Hauptfigur erhalten bleiben,
        # damit sie nicht generisch wird?
      mustNotBecome: >
        # Welche Fehlfassung ist verboten?

    antagonistOrPressure:
      mustRemain: >
        # Wie bleibt die Gegenkraft plausibel?
      mustNotBecome: >
        # Welche Genre-Abkürzung ist verboten?

    keyRelation:
      mustRemain: >
        # Wie bleibt die Schlüsselbeziehung eigenständig?
      mustNotBecome: >
        # Welche Fehlfassung ist verboten?

  sceneRules:
    - >
      # Genre-spezifische Szenenregel.
    - >
      # Beispiel:
      # "Nach jeder Weltregel-Erklärung muss eine konkrete Kostenhandlung folgen."
    - >
      # Beispiel:
      # "Nach jeder romantischen Annäherung braucht es eine neue praktische Folge,
      # nicht nur inneres Schwanken."
    - >
      # Beispiel:
      # "Nach jeder Beweisszene muss sichtbar werden, wer dadurch Zugriff,
      # Status oder Vertrauen verliert."

  writerRules:
    - >
      # Zusätzliche Stil- oder Dramaturgieregeln,
      # die nur für dieses Genre gelten.
    - >
      # Kurz halten.
      # Die Pipeline sollte nur eine Auswahl in den Writer-Prompt nehmen.

  auditChecks:
    - >
      # Was soll der Review-Pass prüfen?
      #
      # Beispiel:
      # "Hat jede magische Lösung vorher gesetzte Kosten?"
    - >
      # Beispiel:
      # "Wird Nähe durch Handlung verschoben, nicht durch bloße Erklärung?"
    - >
      # Beispiel:
      # "Hat die Gegenkraft für jeden Zugriff eine plausible Quelle?"
Datei 3: GENRE_UNIVERSAL_DEFAULT.md

Das ist ein neutrales Fallback-Modul, wenn du noch kein Genre-Modul gebaut hast.

genreModule:
  id: "UNIVERSAL_DEFAULT"

  categoryLane: >
    # Noch nicht festgelegt.

  corePleasure: >
    # Der Leser erlebt, wie eine stabile Ordnung durch konkrete
    # Entscheidungen, Objekte, Beziehungen und Folgen verschoben wird.

  lockedFactExtensions: []

  endingTypes:
    - id: "access_loss"
      definition: >
        Eine Figur verliert konkreten Zugriff auf Ort, Person,
        Objekt, Information, Status oder Verfahren.

    - id: "access_gain"
      definition: >
        Eine Figur gewinnt Zugriff, aber der Zugriff bringt neue Kosten,
        neues Wissen oder neue Gefahr.

    - id: "relationship_shift"
      definition: >
        Vertrauen, Nähe, Loyalität, Begehren oder soziale Position
        verschiebt sich messbar.

    - id: "trust_fracture"
      definition: >
        Eine Beziehung bleibt bestehen, aber ein Riss wird sichtbar
        und verändert künftiges Handeln.

    - id: "proof_turn"
      definition: >
        Ein Objekt, Zeichen, Dokument, Bild oder Detail bedeutet am Ende
        etwas anderes als am Anfang.

    - id: "object_estrangement"
      definition: >
        Ein vertrautes Objekt wird fremd, kompromittiert,
        falsch platziert oder neu aufgeladen.

    - id: "social_exposure"
      definition: >
        Etwas bisher Privates, Unsicheres oder Verborgenes wird
        sozial sichtbar.

    - id: "public_reframe"
      definition: >
        Andere Figuren lesen eine Situation öffentlich anders,
        wodurch Status oder Handlungsspielraum kippt.

    - id: "deadline_shift"
      definition: >
        Eine Frist wird gesetzt, verkürzt, verschärft oder neu verstanden.

    - id: "moral_reframe"
      definition: >
        Eine Handlung, Entscheidung oder Figur wird moralisch anders lesbar.

    - id: "choice_cost"
      definition: >
        Eine Figur trifft eine Entscheidung und zahlt sofort einen
        konkreten Preis.

    - id: "quiet_countermove"
      definition: >
        Eine Figur antwortet mit einer kleinen, konkreten Gegenhandlung
        statt mit Erklärung oder Konfrontation.

    - id: "physical_proximity"
      definition: >
        Räumliche oder körperliche Nähe wird unausweichlich,
        gefährlich, ersehnt oder unerwünscht.

    - id: "intimacy_threat"
      definition: >
        Eine intime Gewohnheit, Erinnerung, Beziehung oder Nähe
        wird bedroht, benutzt oder falsch gelesen.

    - id: "system_lock"
      definition: >
        Eine Regel, Institution, Weltordnung, Familie, Firma,
        Gruppe oder Hierarchie schließt eine Option aus.

    - id: "system_crack"
      definition: >
        Eine Ordnung wirkt stabil, zeigt aber erstmals einen Riss,
        eine Ausnahme oder eine Ausnutzbarkeit.

    - id: "identity_pressure"
      definition: >
        Eine Figur wird gezwungen, eine Version ihrer selbst zu spielen,
        zu verteidigen oder zu verlieren.

    - id: "quiet_dread"
      definition: >
        Die Szene endet leise, aber mit konkreter neuer Bedrohung,
        nicht nur mit Atmosphäre.

    - id: "revelation_with_cost"
      definition: >
        Eine Erkenntnis entsteht, aber sie kostet Zugriff, Vertrauen,
        Sicherheit, Nähe oder moralische Klarheit.

    - id: "no_return"
      definition: >
        Eine Grenze wird überschritten, nach der eine Rückkehr
        zur vorherigen Ordnung nicht mehr möglich ist.

  pressureLogic:
    mainPressureKinds:
      - "Zugriff wird verschoben."
      - "Vertrauen wird beschädigt oder neu verteilt."
      - "Ein Objekt oder Detail verändert seine Bedeutung."
      - "Eine soziale Ordnung liest die Hauptfigur anders."
      - "Eine Entscheidung erzeugt sofortige Kosten."

    validPowers:
      - "Nähe"
      - "Wissen"
      - "Status"
      - "Regel"
      - "Geld"
      - "Körperliche Anwesenheit"
      - "Dokument"
      - "Erinnerung"
      - "Öffentlichkeit"
      - "Schweigen"
      - "Timing mit plausibler Quelle"

    forbiddenShortcuts:
      - "Keine Allmacht ohne Quelle."
      - "Kein Zufallsfund als Lösung."
      - "Kein Geständnis als alleinige Auflösung."
      - "Keine Szene, die nur erklärt, was die vorige Szene bereits gezeigt hat."
      - "Keine Gegenkraft ohne Kosten."
      - "Keine Hauptfigur, die nur reagiert und nie eine konkrete Gegenhandlung versucht."

    costRules:
      - "Jeder größere Fortschritt kostet etwas Konkretes."
      - "Jede Gegenhandlung verengt mindestens eine andere Option."
      - "Jeder starke Beweis braucht eine soziale oder praktische Folge."
      - "Jede Machtbewegung der Gegenkraft hinterlässt Restfehler, Spur oder Preis."

  figureRules:
    protagonist:
      mustRemain: >
        Aktiv unter Druck. Auch wenn sie scheitert, versucht sie
        konkrete Handlungen.
      mustNotBecome: >
        Reine Beobachterfigur oder Erklärstimme.

    antagonistOrPressure:
      mustRemain: >
        Plausibel begrenzt. Zugriff braucht Quelle, Handlung braucht Kosten.
      mustNotBecome: >
        Allwissende, folgenlose Supertäterin oder abstrakte Symbolkraft
        ohne Szene.

    keyRelation:
      mustRemain: >
        Eigene Logik, eigenes Risiko, eigener Blick auf Stabilität.
      mustNotBecome: >
        Reine Helferfigur, Stichwortgeber oder künstliches Hindernis.

  sceneRules:
    - "Jede Szene braucht ein konkretes Wollen."
    - "Jede Szene braucht eine konkrete Gegenkraft."
    - "Jede Szene braucht Material: Objekt, Ort, Körperdetail, Dokument, Regel oder Handlung."
    - "Jede Szene endet mit einer Verschiebung, nicht nur mit Stimmung."
    - "Nach zwei Informationsszenen folgt eine Konsequenzszene."
    - "Keine drei Szenen hintereinander mit demselben ending_type."

  writerRules:
    - "Objekte, Handlungen und Reaktionen tragen mehr als Erklärung."
    - "Dialog verändert etwas."
    - "Innere Erkenntnis braucht äußeren Auslöser."
    - "Nach starken Bildern früh rausgehen."

  auditChecks:
    - "Hat die Szene Zugriff, Wissen, Beziehung, Status oder Risiko verändert?"
    - "Ist der ending_type korrekt und variiert?"
    - "Hat jedes zentrale Objekt dieselbe Farbe und Funktion wie im Kanon?"
    - "Bleiben Arc-Informationen aus der World Bible draußen?"
    - "Hat die Gegenkraft plausible Grenzen?"