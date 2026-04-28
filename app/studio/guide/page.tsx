"use client";

import React from "react";
import Link from "next/link";

export default function StudioGuidePage() {
  return (
    <div className="guide-container">
      <style jsx>{`
        .guide-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 4rem 2rem;
          color: var(--text);
          background: var(--bg);
          font-family: var(--font-sans);
          line-height: 1.6;
        }

        header {
          margin-bottom: 5rem;
          border-bottom: 1px solid var(--line);
          padding-bottom: 3rem;
        }

        .kicker {
          display: block;
          color: var(--accent);
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          margin-bottom: 0.75rem;
        }

        h1 {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 1.5rem 0;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .intro {
          font-size: 1.25rem;
          color: var(--text-soft);
          max-width: 750px;
        }

        section {
          margin-bottom: 6rem;
        }

        h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: var(--text-strong);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        h2::before {
          content: "";
          width: 6px;
          height: 1.8rem;
          background: var(--accent);
        }

        h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 2.5rem 0 1rem 0;
          color: var(--text-strong);
        }

        p {
          margin-bottom: 1.5rem;
          color: var(--text-soft);
        }

        .highlight-box {
          background: var(--bg-sidebar);
          border: 1px solid var(--line);
          padding: 2rem;
          border-radius: 4px;
          margin: 2rem 0;
        }

        .warning-box {
          background: rgba(242, 161, 147, 0.08);
          border: 1px solid rgba(242, 161, 147, 0.35);
          padding: 1.5rem;
          border-radius: 4px;
          margin: 1.5rem 0;
        }

        .success-box {
          background: rgba(163, 230, 53, 0.07);
          border: 1px solid rgba(163, 230, 53, 0.32);
          padding: 1.5rem;
          border-radius: 4px;
          margin: 1.5rem 0;
        }

        .example-block {
          background: #16161a;
          border-left: 3px solid var(--accent);
          padding: 1.5rem;
          margin: 1.5rem 0;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          white-space: pre-wrap;
          color: #d1d1d6;
        }

        .label {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 0.9rem;
          background: var(--bg-sidebar);
          border: 1px solid var(--line);
        }

        th, td {
          padding: 1.25rem;
          text-align: left;
          border-bottom: 1px solid var(--line);
        }

        th {
          background: rgba(255, 255, 255, 0.03);
          font-weight: 600;
          color: var(--text-strong);
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
        }

        .code {
          font-family: var(--font-mono);
          color: var(--accent);
          background: rgba(224, 159, 102, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 2px;
          font-size: 0.85rem;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }

        .grid-item {
          border: 1px solid var(--line);
          padding: 1.5rem;
          border-radius: 4px;
        }

        .step-list {
          counter-reset: guide-step;
          display: grid;
          gap: 1rem;
          margin: 2rem 0;
        }

        .step-item {
          counter-increment: guide-step;
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 1.25rem 1.5rem 1.25rem 4rem;
          position: relative;
          background: var(--bg-sidebar);
        }

        .step-item::before {
          content: counter(guide-step);
          position: absolute;
          left: 1.25rem;
          top: 1.25rem;
          width: 1.8rem;
          height: 1.8rem;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: var(--accent);
          color: #16161a;
          font-weight: 800;
          font-size: 0.8rem;
        }

        .step-item h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }

        .step-item p {
          margin: 0;
          font-size: 0.95rem;
        }

        .rule-pos { border-top: 3px solid #a3e635; }
        .rule-neg { border-top: 3px solid #f2a193; }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-faint);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 4rem;
          padding: 1rem 1.5rem;
          border: 1px solid var(--line);
          border-radius: 4px;
          transition: all 0.2s;
        }

        .back-link:hover {
          color: var(--text-strong);
          border-color: var(--text-faint);
          background: var(--bg-sidebar);
        }

        @media (max-width: 850px) {
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header>
        <span className="kicker">Book Guide | Regie anlegen</span>
        <h1>So baust du ein Book-Projekt in EMBER</h1>
        <p className="intro">
          EMBER schreibt nicht gut, weil du einen langen Prompt gibst. EMBER schreibt gut,
          wenn du vorher eine klare Regie anlegst: Story-Kern, Regeln, Kanon und Scene Cards.
          Diese Seite zeigt dir den praktischen Ablauf von der Rohidee bis zum ersten
          testbaren Draft.
        </p>
      </header>

      <section>
        <h2>1. Der einfache Arbeitsplan</h2>
        <p>
          Denke in drei Ebenen: Blueprint ist die Strategie, Scene Cards sind die
          Produktionsanweisung, der Writer-Job ist nur der einzelne Modelllauf. Wenn eine
          Szene nur mit langer Director Note funktioniert, fehlt meistens in der Scene Card
          <span className="code">want</span>, <span className="code">pressure</span>,
          <span className="code">turn</span> oder <span className="code">irreversible_change</span>.
        </p>

        <div className="step-list">
          <div className="step-item">
            <h3>Story-Kern festlegen</h3>
            <p>Schreibe Premise, Reader Promise, Ending Promise, Author Intent und Current Focus. Das ist der Rahmen, in dem jede Szene später gelesen wird.</p>
          </div>
          <div className="step-item">
            <h3>Welt, Figuren und Kanon sammeln</h3>
            <p>Lege Namen, Rollen, wichtige Orte, verbotene Twists, feste Fakten und echte Kontinuitätsanker fest.</p>
          </div>
          <div className="step-item">
            <h3>Akte und Szenen planen</h3>
            <p>Plane nicht in Seiten, sondern in Szenen. Jede Szene braucht eine Funktion, einen Druck und eine Veränderung.</p>
          </div>
          <div className="step-item">
            <h3>Scene Cards schreiben</h3>
            <p>Für jede Szene formulierst du Situation, Want, Pressure, Material, Turn, irreversible Veränderung und Avoid.</p>
          </div>
          <div className="step-item">
            <h3>Regie in die DB synchronisieren</h3>
            <p>Nach größeren Änderungen an Regie, Scene Cards, Canon oder Narrative State muss das Book-Projekt neu synchronisiert werden, bevor du Jobs bewertest.</p>
          </div>
          <div className="step-item">
            <h3>Zwei Testszenen generieren</h3>
            <p>Teste zuerst eine objektlastige Szene und eine Beziehungs- oder Konfrontationsszene. Danach weißt du, ob die Regie trägt.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>2. Wo du in der Plattform arbeitest</h2>
        <p>
          Du musst nicht alles auf einmal verstehen. Arbeite von links nach rechts: erst
          Plan, dann Book, dann Review. Die Regie kann als Markdown-Vorlage entstehen oder
          direkt im Studio über Blueprint, Szenen und Scene Cards aufgebaut werden.
        </p>

        <div className="grid">
          <div className="grid-item">
            <span className="label">Plan / Blueprint</span>
            <p style={{ fontSize: "0.9rem" }}>
              Hier liegen Master Brief, Market Brief, Writer Rules, Author Intent und
              Current Focus. Das ist die strategische Regie des Buchs.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">Book / Writer</span>
            <p style={{ fontSize: "0.9rem" }}>
              Hier wählst du Szenen, bearbeitest Summary und Textblöcke, setzt eine kurze
              Director Note und startest Draft-Jobs.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">Scene Cards</span>
            <p style={{ fontSize: "0.9rem" }}>
              Sie sind die eigentliche Szenenregie. Eine Scene Card sagt, was die Szene
              leisten muss, nicht welche Sätze geschrieben werden sollen.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">Review</span>
            <p style={{ fontSize: "0.9rem" }}>
              Hier prüfst du Continuity, Quality Warnings, StateDiff-Hinweise, offene Fäden
              und Jobs, die nach Kontextänderungen neu bewertet werden sollten.
            </p>
          </div>
        </div>

        <div className="highlight-box">
          <span className="label">Merksatz</span>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            Blueprint erklärt das Buch. Scene Card erklärt die Szene. Director Note erklärt
            nur den nächsten Lauf.
          </p>
        </div>
      </section>

      <section>
        <h2>3. Was eine Regie-Datei leisten muss</h2>
        <p>
          Eine Regie ist keine fertige Prosa und kein Prompt-Roman. Sie ist eine
          Produktionsvorlage. Gute Regie übersetzt abstrakte Ideen in konkrete
          Entscheidungen, sichtbaren Druck, Material und Folgen.
        </p>

        <div className="grid">
          <div className="grid-item rule-pos">
            <span className="label">Gute Regie</span>
            <p style={{ fontSize: "0.9rem" }}>
              Beschreibt, was in der Szene auf dem Spiel steht, was kippt und welche Folge
              nicht zurückgedreht werden kann.
            </p>
          </div>
          <div className="grid-item rule-neg">
            <span className="label">Schwache Regie</span>
            <p style={{ fontSize: "0.9rem" }}>
              Diktiert einzelne Sätze, sammelt Symbolobjekte oder sagt nur „spannender,
              emotionaler, literarischer“.
            </p>
          </div>
        </div>

        <div className="highlight-box">
          <span className="label">Minimalstruktur</span>
          <div className="example-block">
{`# Regie: Arbeitstitel

## Core
Premise:
Reader Promise:
Ending Promise:
Thematic Core:
Author Intent:
Current Focus:

## World / Pressure System
Welche Institutionen, Routinen, Orte oder sozialen Regeln erzeugen Druck?

## Characters
Name:
Rolle:
Want:
Wunde / Angst:
Grenze:

## Canon Facts
- Fakt, der nicht driften darf.
- Verbotener Twist.
- Fester Name, Ort oder Beziehungsstatus.

## Open Threads
- Frage, die über mehrere Szenen offen bleibt.
- Setup, das später bezahlt werden muss.

## Act Map
Akt 1:
Akt 2:
Akt 3:

## Scene Cards
\`\`\`
Scene Card
  id:
  title:
  pov:
  where_when:
  situation:
  want:
  pressure:
  material:
  turn:
  irreversible_change:
  thread:
  avoid:
  aftertaste:
  ending_type: # nur Rhythmus-Metadatum, kein Schreibauftrag
\`\`\``}</div>
        </div>
      </section>

      <section>
        <h2>4. Blueprint ausfüllen</h2>
        <p>
          Der Blueprint gibt jeder Szene Richtung. Er sollte kurz genug sein, dass du ihn
          beim Lesen behalten kannst, aber konkret genug, dass ein Modell nicht in
          allgemeine Atmosphäre ausweicht.
        </p>

        <table>
          <thead>
            <tr>
              <th>Feld</th>
              <th>Was du hineinschreibst</th>
              <th>Beispiel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="code">Premise</span></td>
              <td>Die harte Ausgangslage des Buchs in einem Satz.</td>
              <td>Eine Mutter muss beweisen, dass die dokumentierte Abholung ihres Kindes falsch ist, obwohl alle Systeme das Gegenteil zeigen.</td>
            </tr>
            <tr>
              <td><span className="code">Reader Promise</span></td>
              <td>Welche Erfahrung der Leser bekommt.</td>
              <td>Psychologischer Druck, Alltagsparanoia, jede neue Information macht die Lage enger.</td>
            </tr>
            <tr>
              <td><span className="code">Ending Promise</span></td>
              <td>Was am Ende bezahlt werden muss.</td>
              <td>Die Wahrheit über die Abholung erklärt nicht nur den Fall, sondern auch, wem Eva nie hätte vertrauen dürfen.</td>
            </tr>
            <tr>
              <td><span className="code">Author Intent</span></td>
              <td>Die langfristige Absicht des Buchs.</td>
              <td>Ein Thriller über Kontrolle, institutionelle Kälte und den Moment, in dem Beweise gegen die eigene Erinnerung arbeiten.</td>
            </tr>
            <tr>
              <td><span className="code">Current Focus</span></td>
              <td>Worauf die nächsten 1 bis 3 Szenen besonders achten sollen.</td>
              <td>Material natürlich einbauen, Dialog weniger funktional, Mila als Kind sichtbar halten.</td>
            </tr>
          </tbody>
        </table>

        <div className="warning-box">
          <span className="label">Nicht so</span>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            „Es geht um Schuld, Wahrheit und dunkle Geheimnisse.“ Das klingt nach Thema,
            steuert aber keine Szene. Besser: Wer will was, wer verhindert es, welcher
            Beweis oder soziale Druck macht die Lage enger?
          </p>
        </div>
      </section>

      <section>
        <h2>5. Scene Cards richtig schreiben</h2>
        <p>
          Die Scene Card ist die wichtigste operative Einheit. Sie soll nicht die fertige
          Szene vorformulieren. Sie soll dem Modell sagen, welche lebendige Situation es
          schreiben muss.
        </p>

        <table>
          <thead>
            <tr>
              <th>Feld</th>
              <th>Bedeutung</th>
              <th>Merksatz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="code">pov</span></td>
              <td>Harte Perspektive.</td>
              <td>Wer darf wahrnehmen?</td>
            </tr>
            <tr>
              <td><span className="code">where_when</span></td>
              <td>Ort/Zeit als Szenenanker. Sobald konkret gesetzt, schützt es vor Drift.</td>
              <td>Nur konkret setzen, wenn Drift falsch wäre.</td>
            </tr>
            <tr>
              <td><span className="code">situation</span></td>
              <td>Was ist schon falsch, wenn die Szene beginnt?</td>
              <td>Kein neutraler Start.</td>
            </tr>
            <tr>
              <td><span className="code">want</span></td>
              <td>Was die POV-Figur jetzt konkret will.</td>
              <td>Kein allgemeines Lebensziel.</td>
            </tr>
            <tr>
              <td><span className="code">pressure</span></td>
              <td>Wer oder was macht das Want schwerer?</td>
              <td>Person, Routine, Dokument, Zeitdruck, Institution.</td>
            </tr>
            <tr>
              <td><span className="code">material</span></td>
              <td>1 bis 3 konkrete Dinge, die natürlich in die Szene gehören.</td>
              <td>Textur, keine Checkliste.</td>
            </tr>
            <tr>
              <td><span className="code">turn</span></td>
              <td>Was kippt in Wissen, Zugriff, Beziehung oder Selbstbild?</td>
              <td>Handlung allein ist noch keine Wendung.</td>
            </tr>
            <tr>
              <td><span className="code">irreversible_change</span></td>
              <td>Was kann danach nicht mehr so sein wie vorher?</td>
              <td>Das wichtigste Feld.</td>
            </tr>
            <tr>
              <td><span className="code">avoid</span></td>
              <td>Welche Fehlfassung soll der Draft vermeiden?</td>
              <td>Verbiete Muster, nicht Leben.</td>
            </tr>
            <tr>
              <td><span className="code">aftertaste</span></td>
              <td>Was bleibt spürbar?</td>
              <td>Kein Pflicht-Schlusssatz.</td>
            </tr>
          </tbody>
        </table>

        <div className="success-box">
          <span className="label">Gute Scene Card</span>
          <div className="example-block">
{`Scene Card
  id: scene13
  title: Die Tasche
  pov: Eva
  where_when: Kita-Flur, 16:20.
  situation: Eva bekommt Milas Tasche zurück, aber die Tasche wirkt nicht wie morgens gepackt.
  want: Eva will herausfinden, wer an Milas Sachen war, ohne vor der Erzieherin die Kontrolle zu verlieren.
  pressure: Die Erzieherin bleibt freundlich, aber behandelt jede Nachfrage als nervöse Mutterreaktion.
  material: Tasche, Notizzettel, Brotdosen-Reserve.
  turn: Aus einer vergessenen Tasche wird ein Hinweis, dass jemand Milas Routine kannte.
  irreversible_change: Eva kann nicht mehr glauben, dass der Fehler nur in der App passiert ist.
  thread: Wer kennt Milas Kita-Routine gut genug?
  avoid: Keine Objektliste, kein Beweis-Monolog, kein hysterischer Ausbruch.
  aftertaste: Der freundlichste Satz der Erzieherin klingt nach Abstand.
  ending_type: Object Intrusion # Audit only`}</div>
        </div>

        <div className="warning-box">
          <span className="label">Schwache Scene Card</span>
          <div className="example-block">
{`Scene Card
  title: Die Tasche
  summary: Eva findet komische Dinge und merkt, dass alles schlimmer ist.
  material: Tasche, Notizzettel, Brotdose, Jacke, Becher, Formular, Foto, App, Schlüssel.
  ending: Eva versteht, dass sie niemandem mehr trauen kann.`}</div>
          <p style={{ margin: "1rem 0 0 0", fontSize: "0.95rem" }}>
            Das ist zu abstrakt und gleichzeitig zu voll. Es erklärt das Ergebnis, aber
            gibt keine lebendige Situation, kein Want, keinen Druck und keine präzise
            irreversible Veränderung.
          </p>
        </div>
      </section>

      <section>
        <h2>6. Hart, weich und Audit</h2>
        <p>
          Diese Unterscheidung ist zentral. Harte Felder schützen Kanon. Weiche Felder
          führen Absicht. Audit-Felder helfen beim Prüfen, sollen aber nicht als
          Schreibauftrag im Prosa-Prompt landen.
        </p>

        <table>
          <thead>
            <tr>
              <th>Art</th>
              <th>Felder</th>
              <th>Wie du sie benutzt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hart</td>
              <td><span className="code">pov</span>, <span className="code">location</span>, <span className="code">timeAnchor</span>, Locked Facts, Kanon-Namen</td>
              <td>Nur setzen, wenn Drift wirklich falsch wäre.</td>
            </tr>
            <tr>
              <td>Harte Objektanker</td>
              <td><span className="code">object_anchor</span>, <span className="code">prop_anchor</span>, <span className="code">locked_object</span>, <span className="code">locked_material</span></td>
              <td>Für Farbe, Besitz, Funktion oder Kontinuität. Nicht für „wäre schön, wenn es vorkommt“.</td>
            </tr>
            <tr>
              <td>Weich</td>
              <td><span className="code">situation</span>, <span className="code">want</span>, <span className="code">pressure</span>, <span className="code">material</span>, <span className="code">turn</span>, <span className="code">aftertaste</span></td>
              <td>Das Modell darf organisch lösen, solange die Szenenfunktion stimmt.</td>
            </tr>
            <tr>
              <td>Legacy weich</td>
              <td><span className="code">proof_object</span>, <span className="code">alltagswaffe</span>, <span className="code">kindmoment</span>, <span className="code">closingLine</span></td>
              <td>Material, Drucksignal oder optionales Schlussbild / Tonhinweis. Kein Satzdiktat und keine Objektpflicht.</td>
            </tr>
            <tr>
              <td>Audit</td>
              <td><span className="code">ending_type</span></td>
              <td>Für Rhythmusprüfung. Nicht als Prosa-Auftrag.</td>
            </tr>
          </tbody>
        </table>

        <div className="warning-box">
          <span className="label">Wichtig</span>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            <span className="code">required_material</span> ist kein Runtime-Key mehr.
            Alte Regie kann beim Import nur dann auf <span className="code">locked_material</span>
            gemappt werden, wenn dieses Material echte Kontinuität schützt.
          </p>
        </div>
      </section>

      <section>
        <h2>7. Director Note verwenden</h2>
        <p>
          Die Director Note ist kein Ersatz für Regie. Sie ist eine kurze Justierung für
          genau diesen einen Lauf.
        </p>

        <div className="grid">
          <div className="grid-item rule-pos">
            <span className="label">Gut</span>
            <p style={{ fontSize: "0.9rem" }}>
              „Dialog weniger erklärend. Die Tasche soll in Handlung auftauchen, nicht als
              Beweis benannt werden. Ende leiser.“
            </p>
          </div>
          <div className="grid-item rule-neg">
            <span className="label">Schlecht</span>
            <p style={{ fontSize: "0.9rem" }}>
              „Schreib die Szene viel spannender, emotionaler, mit mehr Stil und dem Satz:
              Jetzt wusste Eva alles.“
            </p>
          </div>
        </div>

        <div className="highlight-box">
          <span className="label">Copy-Paste Muster</span>
          <div className="example-block">
{`Fokus für diesen Lauf:
- Material als Szenentextur, nicht als Beweisliste.
- Dialog mit Subtext: Figuren wollen etwas, sagen aber nicht alles direkt.
- Irreversible Veränderung klar halten.
- Kein erklärender Schlussabsatz.`}</div>
        </div>
      </section>

      <section>
        <h2>8. Ersten Testlauf machen</h2>
        <p>
          Nach größeren Regie-Änderungen nicht sofort zehn Szenen generieren. Teste zwei
          Gegensätze. So siehst du schneller, ob die Regie Freiheit erzeugt oder wieder
          mechanisch wird.
        </p>

        <div className="grid">
          <div className="grid-item">
            <span className="label">Test A: Objektlastige Szene</span>
            <p style={{ fontSize: "0.9rem" }}>
              Tasche, Jacke, Formular, Becher oder App-Eintrag. Prüfe, ob Material natürlich
              in Handlung und Dialog auftaucht statt als Liste.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">Test B: Beziehungsszene</span>
            <p style={{ fontSize: "0.9rem" }}>
              Mutter/Kind, Partner, Ermittler, Institution. Prüfe, ob Figuren eigene Ziele
              haben und der Dialog weniger funktional klingt.
            </p>
          </div>
        </div>

        <div className="highlight-box">
          <span className="label">Prüffragen</span>
          <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.95rem" }}>
            <li>Klingt die Szene weniger nach abgearbeiteter Regie?</li>
            <li>Bleibt die irreversible Veränderung klar?</li>
            <li>Wird Material als Textur benutzt, nicht als Checkliste?</li>
            <li>Driftet nichts bei Ort, POV, Zeit, Namen oder Locked Facts?</li>
            <li>Wird der Dialog freier und weniger funktional?</li>
          </ol>
        </div>
      </section>

      <section>
        <h2>9. Generate, Accept, Save</h2>
        <p>
          Der Joblauf erzeugt erst einen Vorschlag. Du entscheidest danach, ob dieser Text
          in die Szene gehört.
        </p>

        <div className="grid">
          <div className="grid-item">
            <span className="label">Generate</span>
            <p style={{ fontSize: "0.9rem" }}>
              Startet den Draft mit Scene Intention, Kontext, Human Edit Memory und kurzer
              Director Note.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">Review</span>
            <p style={{ fontSize: "0.9rem" }}>
              Lies Continuity, Quality Warnings und den extrahierten StateDiff, wenn vorhanden.
              Warnungen sind Hinweise, keine automatischen Rewrite-Befehle.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">Accept</span>
            <p style={{ fontSize: "0.9rem" }}>
              Übernimmt den Job-Text in die Szene. Danach kannst du menschlich editieren.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">Save</span>
            <p style={{ fontSize: "0.9rem" }}>
              Speichert den Stand in Supabase. Erst dann ist der Projektstand stabil.
            </p>
          </div>
        </div>

        <div className="highlight-box">
          <span className="label">Memory</span>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            Ein StateDiff ist ein Vorschlag für Memory-Updates: Objekte, Wissen, Promises und
            mögliche Canon-Fakten werden typisiert geprüft. Szenenlokale Details bleiben lokal;
            Canon entsteht erst nach expliziter Freigabe.
          </p>
        </div>

        <div className="highlight-box">
          <span className="label">Provider</span>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            In der UI nutzt du <strong>Auto</strong>, <strong>OpenAI</strong> oder{" "}
            <strong>Anthropic</strong>. <span className="code">local_fallback</span> ist ein
            Sicherheitsweg, kein Qualitätsurteil über die Regie.
          </p>
        </div>
      </section>

      <footer>
        <Link href="/studio" className="back-link">
          <span>←</span> Zurück zum Studio Workspace
        </Link>
      </footer>
    </div>
  );
}
