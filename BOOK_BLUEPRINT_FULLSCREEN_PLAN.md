# EMBER Studio: Plan fuer Fullscreen-/Wide-Layout im `Plan`-Tab

## Status
Noch **nicht umgesetzt**. Dieses Dokument ist der technische Umsetzungsplan fuer einen risikoarmen UI-Umbau des rechten Blueprint-Panels im `Plan`-Tab.

## Problem
Der aktuelle `Plan`-Tab rendert das Blueprint als rechtes, schmales `aside` neben dem Story-Board. Das ist fuer kurze Metadaten vertretbar, aber fuer lange Blueprint-Inhalte wie `Master Brief`, `Publishing Guardrails`, `Memory Backbone` und vor allem `Writer Constitution` unpraktisch:

- zu wenig horizontale Lesebreite
- sehr lange Scrollstrecken in einem gequetschten Panel
- Textareas und Rule-Listen wirken versteckt oder abgeschnitten
- zentrale Buchregeln gehen in der rechten Spalte visuell unter
- Nutzer erkennen nicht intuitiv, dass weiter unten noch kritische Bereiche kommen

Das ist aktuell vor allem ein **Layout- und Informationsarchitekturproblem**, kein Daten- oder Prompt-Problem.

## Ziel
Der `Plan`-Tab soll neben dem bisherigen angedockten Modus einen echten **Fullscreen-/Focus-Modus** fuer das Blueprint erhalten, ohne die bestehende Buchlogik, Save-Pfade oder Prompt-Verkabelung zu brechen.

Der Umbau soll:

- dieselbe `BookBlueprintPanel`-Logik weiterverwenden
- nur die Darstellung und Verteilung des Platzes veraendern
- fuer lange Texte deutlich bessere Lesbarkeit schaffen
- rueckwaertskompatibel zum bisherigen Arbeitsmodus bleiben

## Nicht-Ziele
Dieser Umbau soll zunaechst **nicht**:

- das Story-Datenmodell aendern
- Prompt-Generierung oder Modell-Orchestrierung aendern
- `Book`, `Review`, `Patch` oder `Playtest` gleichzeitig neu gestalten
- Inhalte des Blueprints fachlich umstrukturieren
- Speicher- oder Sync-Logik anfassen

## Relevante Stellen im Code

### Rendering / Komposition
- [components/studio/studio-workspace.tsx](/Users/bucci/EMBER/components/studio/studio-workspace.tsx:1800)
- [components/studio/studio-workspace.tsx](/Users/bucci/EMBER/components/studio/studio-workspace.tsx:1988)

Aktuell werden im Nicht-Writer-Modus `board-panel` und rechts daneben das `BookBlueprintPanel` als siblings gerendert.

### Blueprint-Komponente
- [components/studio/book-blueprint-panel.tsx](/Users/bucci/EMBER/components/studio/book-blueprint-panel.tsx:166)

Die Komponente ist bereits sauber isoliert und eignet sich fuer Wiederverwendung in mehreren Layout-Modi.

### Aktuelle CSS-Basis
- [app/globals.css](/Users/bucci/EMBER/app/globals.css:167)
- [app/globals.css](/Users/bucci/EMBER/app/globals.css:217)
- [app/globals.css](/Users/bucci/EMBER/app/globals.css:283)

Relevant sind vor allem:

- `.book-panel`
- `.book-panel__content`
- `.book-card`
- `.book-context-grid`
- `.book-rule-card`
- `.workspace-panels`

## Technische Leitentscheidung
Der sichere Weg ist **kein Neuaufbau des Blueprint-Inhalts**, sondern ein **Layout-Switch mit derselben Komponente**.

### Empfehlung
Einen neuen UI-Zustand fuer den `Plan`-Tab einfuehren:

- `docked`
- `focus`

Im Modus `docked` bleibt das Verhalten wie heute.  
Im Modus `focus` bekommt das Blueprint die Hauptarbeitsflaeche und das Board wird entweder komplett ausgeblendet oder in einen eingeklappten Zustand versetzt.

## Zielbild der UX

### Modus 1: `Docked`
Heutige Arbeitsweise beibehalten:

- links Story-Board / Kapitel-Grid
- rechts Blueprint-Panel

Nutzen:

- schneller Wechsel zwischen Struktur und Metadaten
- vertrautes Verhalten

### Modus 2: `Focus`
Blueprint als primaere Arbeitsflaeche:

- keine rechte Quetschspalte mehr
- Blueprint nutzt die zentrale Breite
- Cards, Textareas und Rule-Listen koennen in vollwertiger Lesebreite arbeiten
- lange Bereiche wie `Writer Constitution` werden auffindbar und sinnvoll editierbar

## Risikoarme Umsetzungsstrategie

### Phase 1: Layout-Switch ohne Logikduplikation
Ziel: Fokusmodus einfuehren, ohne Datenfluss oder Event-Handling zu aendern.

#### Aenderungen
- In `studio-workspace.tsx` neuen lokalen UI-State einfuehren, z. B. `planLayoutMode`.
- Nur im `authorMode === "plan"` verwenden.
- Toolbar-Button oder Toggle in der Plan-Ansicht anbieten:
  - `Blueprint Focus`
  - `Split View`
- Im `focus`-Modus `BookBlueprintPanel` nicht rechts rendern, sondern in einem breiten Hauptcontainer.
- Props unveraendert lassen:
  - `story`
  - `selectedSceneId`
  - `onSelectScene`
  - `onUpdateStory`

#### Warum sicher
- keine Aenderung an Save-Logik
- keine Aenderung am Schema
- keine neue Form von State-Synchronisation
- kein doppeltes Blueprint-Rendering mit konkurrierenden Quellen

### Phase 2: Breiten- und Rasteroptimierung im Blueprint
Ziel: Die bestehende Komponente soll in breiter Ansicht wirklich davon profitieren.

#### Aenderungen
- Variantenklasse fuer Fokusmodus an `BookBlueprintPanel`, z. B.:
  - `book-panel--focus`
- In CSS:
  - groessere `max-width`
  - groesserer innerer Abstand
  - `book-context-grid` in Fokusmodus wo sinnvoll auf 1 Spalte oder adaptive Spalten umstellen
  - Textareas in `Writer Constitution` und langen Brief-Feldern mehr vertikale Ruhe geben
- Verhindern, dass wichtige Regelkarten auf enger Breite wie Formularreste wirken

#### Empfehlung fuer Fokusmodus
- Standard: einspaltiger Lesefluss
- Nur dichte Metrikblöcke oder kleine Side-by-Side-Felder optional zweispaltig

### Phase 3: UX-Veredelung nach dem Layout-Fix
Optional, nicht fuer die erste Lieferung noetig.

#### Mögliche Erweiterungen
- Sticky interne Blueprint-Navigation
  - `Master Brief`
  - `Market Brief`
  - `Publishing Guardrails`
  - `Memory Backbone`
  - `Draft Engine`
  - `Continuity Audit`
  - `Writer Constitution`
- ausklappbare Sektionen fuer selten genutzte Bereiche
- Deep links / Anchors zu Sektionen
- prominenter Sprungbutton zu `Writer Constitution`

## Konkreter Eingriffsbereich

### Datei 1: `studio-workspace.tsx`
Hauptverantwortung:

- neuen Plan-Layout-State einfuehren
- Toggle-UI rendern
- zwischen `docked` und `focus` umschalten
- Board-/Blueprint-Komposition fuer `authorMode === "plan"` anpassen

Wichtig:

- keine Veraenderung an `BookWriterPanel`
- keine Veraenderung an `ReviewPanel`, `PatchPanel`, `PlaytestPanel`

### Datei 2: `book-blueprint-panel.tsx`
Hauptverantwortung:

- optionalen Layout-Prop akzeptieren, z. B. `layoutMode?: "docked" | "focus"`
- Wrapper-Klassen darauf basierend setzen
- ansonsten Logik unveraendert lassen

Wichtig:

- keine inhaltliche Dopplung
- kein zweiter Datenpfad
- keine eigene Persistenzlogik

### Datei 3: `app/globals.css`
Hauptverantwortung:

- Fokusmodus-Stile fuer das Blueprint
- Lesebreite, Abstaende, responsive Regeln
- Grid-Anpassungen fuer breite Darstellung

## Empfohlene UX-Entscheidungen

### Entscheidung 1: Board im Fokusmodus ganz ausblenden
Empfehlung: **Ja**.

Grund:

- Der eigentliche Schmerz kommt von der geteilten Breite.
- Ein halb sichtbares Board bringt in diesem Modus wenig.
- Die Umstellung ist klarer: entweder Strukturarbeit oder Blueprint-Arbeit.

### Entscheidung 2: Modus persistent merken
Empfehlung: **spaeter optional**, nicht in Phase 1.

Erstversion:

- lokaler React-State reicht

Spaeter:

- Persistenz in URL oder Local Storage moeglich

### Entscheidung 3: `Writer Constitution` oben prominenter machen
Empfehlung: **nicht sofort strukturell verschieben**.

Begruendung:

- Erst den Platzfehler beheben.
- Danach pruefen, ob die Auffindbarkeit immer noch schlecht ist.
- Eventuell spaeter zusaetzlich Quick-Navigation statt Inhaltsverschiebung.

## Akzeptanzkriterien
Der Umbau ist erfolgreich, wenn:

1. Im `Plan`-Tab ein klarer Wechsel zwischen `Split/Docked` und `Focus` moeglich ist.
2. Im `Focus`-Modus nutzt das Blueprint die Hauptbreite statt einer rechten Sidebar.
3. `Writer Constitution` ist ohne gequetschten Sidebar-Charakter editierbar.
4. Lange Bereiche wie `Master Brief`, `Publishing Guardrails` und `Memory Backbone` sind lesbar und nicht mehr wie Nebenfelder versteckt.
5. Bestehende Story-Updates funktionieren unveraendert.
6. Kein Regressionsfehler in `Book`, `Review`, `Patch`, `Playtest`.
7. Mobile/kleine Breakpoints brechen nicht sichtbar.

## Risiken

### Risiko 1: Layout-Bruch in anderen Modi
Ursache:

- globale CSS-Aenderungen greifen zu breit

Gegenmassnahme:

- Fokusmodus nur ueber dedizierte Modifier-Klassen stylen
- keine generischen `.book-card`-Overrides ohne Scope

### Risiko 2: Zwei Renderpfade driften auseinander
Ursache:

- `BookBlueprintPanel` wird fuer `docked` und `focus` unterschiedlich gepflegt

Gegenmassnahme:

- exakt dieselbe Komponente
- nur Wrapper und Modifier
- keine Inhaltsduplikation

### Risiko 3: State-Verlust beim Umschalten
Ursache:

- harte Unmount-/Remount-Effekte

Gegenmassnahme:

- denselben Datenfluss verwenden
- Umschaltung auf Container-Ebene halten
- auf stabile Keys achten

## Manueller Testplan

### Plan-Tab
- `docked` -> `focus` -> `docked` umschalten
- Eingaben in `Master Brief` behalten ihren Wert
- neue Regel in `Writer Constitution` anlegen und Text editieren
- Regeln loeschen/hinzufuegen ohne UI-Fehler

### Uebergreifend
- Story speichern
- Seite neu laden
- `Book`-Tab oeffnen
- `Review`-Tab oeffnen
- Szene auswaehlen und zurueck in `Plan`

### Responsive
- Desktop breit
- Desktop schmal
- Tablet-Breite
- keine unlesbaren Quetsch-Textareas

## Rollout-Empfehlung

### Lieferung 1
- Layout-Switch
- Fokusmodus
- scoped CSS fuer breite Blueprint-Ansicht

### Lieferung 2
- interne Blueprint-Navigation
- Sektionen verfeinern
- evtl. Persistenz des letzten Layout-Modus

## Klare Implementierungsempfehlung
Nicht das Blueprint "neu designen".  
Nicht zuerst die Inhalte umsortieren.  
Nicht Save-/Prompt-/Schema-Logik anfassen.

Sondern:

1. denselben Blueprint-Component behalten
2. einen echten Focus-Modus ergaenzen
3. CSS scoped und breit machen
4. danach erst UX-Feinschliff

## Dateiablage fuer die naechste Instanz
Dieses Dokument ist bewusst als Repo-Datei abgelegt, damit eine naechste Instanz ohne erneute Analyse direkt ansetzen kann.

Empfohlener Startpunkt fuer die Umsetzung:

- [components/studio/studio-workspace.tsx](/Users/bucci/EMBER/components/studio/studio-workspace.tsx:1988)
- [components/studio/book-blueprint-panel.tsx](/Users/bucci/EMBER/components/studio/book-blueprint-panel.tsx:166)
- [app/globals.css](/Users/bucci/EMBER/app/globals.css:167)
