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
        <span className="kicker">Deep Dive | Book Track</span>
        <h1>So arbeitet der Book-Bereich</h1>
        <p className="intro">
          Der Book-Track ist kein normaler Texteditor. Du schärfst erst den Blueprint, dann
          die Scene Cards, und erst danach startest du einen Draft-Job. Der aktuelle
          Standardpfad ist bewusst schlank: direkter Draft, danach nur Kontrolle und
          Übernahme.
        </p>
      </header>

      <section>
        <h2>1. Womit du anfängst</h2>
        <div className="grid">
          <div className="grid-item rule-pos">
            <span className="label">Blueprint</span>
            <p style={{ fontSize: "0.9rem" }}>
              Master Brief, kurze Writer Rules und Canon geben Richtung und Grenzen vor.
              Market Brief bleibt vor allem Verpackung, nicht Prosa-Käfig.
            </p>
          </div>
          <div className="grid-item rule-pos">
            <span className="label">Scene Cards</span>
            <p style={{ fontSize: "0.9rem" }}>
              Szene für Szene legst du Situation, Want, Pressure, Material, Turn und
              irreversible Veränderung fest. Die Scene Card ist Kompass, nicht Checkliste.
            </p>
          </div>
          <div className="grid-item rule-pos">
            <span className="label">Joblauf</span>
            <p style={{ fontSize: "0.9rem" }}>
              Draft, Length Control, Extract, Continuity und Quality Eval laufen
              nacheinander. Danach entscheidest du über Accept und Save.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>2. Was im Blueprint sitzen muss</h2>
        <div className="grid">
          <div className="grid-item">
            <span className="label">Master Brief</span>
            <p style={{ fontSize: "0.9rem" }}>
              Premise, Reader Promise, Ending Promise, Author Intent, Current Focus und
              thematischer Kern. Das ist die Klammer der Story.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">Market Brief</span>
            <p style={{ fontSize: "0.9rem" }}>
              Hook, Category Lane und Verpackungslogik. Das hilft bei Positionierung,
              sollte aber den einzelnen Prosa-Draft nicht dominieren.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">Writer Constitution</span>
            <p style={{ fontSize: "0.9rem" }}>
              Kurze, prüfbare Regeln. Sie führen den Ton, ersetzen aber nicht die lebendige
              Szene.
            </p>
          </div>
        </div>
        <div className="highlight-box">
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            Für neue Nutzer reicht am Anfang oft schon diese Reihenfolge: erst Story-Kern,
            dann Marktspur, dann Author Intent und Current Focus, dann klare Schreibregeln.
          </p>
        </div>
      </section>

      <section>
        <h2>3. Was eine Scene Card wirklich steuert</h2>
        <p>
          Scene Cards werden als fenced Code Blocks gelesen. Die Pipeline trennt dabei harte
          Kontinuität von weicher Szenenintention.
        </p>

        <table>
          <thead>
            <tr>
              <th>Feld</th>
              <th>Wirkung</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="code">pov</span></td>
              <td>Harte Perspektive der Szene.</td>
            </tr>
            <tr>
              <td><span className="code">location</span> / <span className="code">ort</span>, <span className="code">timeAnchor</span> / <span className="code">uhrzeit</span></td>
              <td>Ort und Zeitanker für den Job-Kontext.</td>
            </tr>
            <tr>
              <td><span className="code">situation</span>, <span className="code">want</span>, <span className="code">pressure</span>, <span className="code">material</span>, <span className="code">turn</span>, <span className="code">irreversible_change</span>, <span className="code">avoid</span></td>
              <td>Scene Intention. Wichtig, aber nicht als Satzdiktat oder Objekt-Checkliste zu lesen.</td>
            </tr>
            <tr>
              <td><span className="code">proof_object</span> / <span className="code">beweisobjekt</span>, <span className="code">alltagswaffe</span>, <span className="code">ersetzungsmoment</span>, <span className="code">kindmoment</span> / <span className="code">mila_kindmoment</span></td>
              <td>Weiches Material- und Drucksignal. Opus darf organisch lösen, solange die Funktion erfüllt wird.</td>
            </tr>
            <tr>
              <td><span className="code">object_anchor</span>, <span className="code">prop_anchor</span>, <span className="code">locked_object</span></td>
              <td>Harte Kontinuitätsanker für Farbe, Funktion, Besitzlogik und Drift-Schutz.</td>
            </tr>
            <tr>
              <td><span className="code">ending_type</span>, <span className="code">false_friend_signal</span>, <span className="code">*_moment</span>, <span className="code">*_plant</span>, <span className="code">*_payoff</span>, <span className="code">subtext</span></td>
              <td>Zusätzliche Regiesignale. <span className="code">ending_type</span> hilft, monotone Kapitelenden zu erkennen.</td>
            </tr>
            <tr>
              <td><span className="code">reversal</span> und ähnliche Regiehinweise</td>
              <td>Hilfreich für Dramaturgie, aber nicht der harte Parser-Kern.</td>
            </tr>
          </tbody>
        </table>

        <div className="highlight-box">
          <span className="label">Beispiel</span>
          <div className="example-block">
Scene Card
  id: SC_1_2
  pov: EVA
  where_when: Kita Sonnengarten, später Nachmittag.
  situation: Eva kommt wegen des falschen App-Eintrags in die Kita.
  want: Eva will den Vorgang korrigieren, ohne instabil zu wirken.
  pressure: Die Dokumentation der Kita ist ruhiger als ihre Erinnerung.
  material: Videoausschnitt, Unterschrift, gelber Becher.
  turn: Aus dem vermuteten App-Fehler wird ein real protokollierter Abholvorgang.
  irreversible_change: Eva kann die Abholung nicht mehr als reinen Systemfehler behandeln.
  avoid: Kein Technikmonolog, keine hysterische Eskalation.</div>
        </div>
      </section>

      <section>
        <h2>4. Wie ein Job läuft</h2>
        <div className="grid">
          <div className="grid-item">
            <span className="label">Ablauf</span>
            <ol style={{ fontSize: "0.9rem", paddingLeft: "1.2rem" }}>
              <li>Context</li>
              <li>Draft</li>
              <li>Length Control</li>
              <li>Extract</li>
              <li>Continuity</li>
              <li>Quality Eval</li>
            </ol>
          </div>
          <div className="grid-item">
            <span className="label">Provider</span>
            <p style={{ fontSize: "0.9rem" }}>
              In der UI wählst du nur <strong>Auto</strong>, <strong>OpenAI</strong> oder
              <strong> Anthropic</strong>. Wenn ein Key fehlt, läuft der Job im
              <span className="code">local_fallback</span> weiter.
            </p>
          </div>
        </div>
        <div className="highlight-box">
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            <strong>remote</strong> bedeutet: echter Modelllauf. <strong>local_fallback</strong>
            bedeutet: Sicherheitsnetz, nicht Qualitätsurteil.
          </p>
        </div>
        <div className="highlight-box">
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            Der Remote-Pfad ist bewusst schlank: Beat-Plan und Rewrite bleiben als Stage-Namen
            sichtbar, werden aber normalerweise übersprungen. Der Draft kommt direkt aus Scene
            Contract, Kontext und Director Note; Length Control greift nur bei starken Ausreißern.
          </p>
        </div>
        <div className="highlight-box">
          <span className="label">Quality Warnings</span>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            Smoothness, abstrakte Deutungswörter, zu perfekte Druckfiguren und wiederholte
            {" "}<span className="code">ending_type</span>-Muster sind Warnungen. Sie ändern keine Prosa
            automatisch und blockieren Accept nicht.
          </p>
        </div>
        <div className="highlight-box">
          <span className="label">Review Queue</span>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            Die Blueprint-Review-Queue sammelt Continuity-Blocker, Quality-/Market-Warnungen
            und Propagation Debt, wenn Jobs nach Kontextänderungen neu bewertet werden müssen.
          </p>
        </div>
      </section>

      <section>
        <h2>5. Generate, Accept, Save</h2>
        <p>
          Erst wird generiert, dann geprüft, dann übernommen. Nur so landet der Text sauber
          in Szene und Datenbank.
        </p>

        <div className="grid">
          <div className="grid-item">
            <span className="label">1. Generate</span>
            <p style={{ fontSize: "0.9rem" }}>
              Startet den Job und legt den Szenentext plus Notes an.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">2. Accept</span>
            <p style={{ fontSize: "0.9rem" }}>
              Schreibt den finalen Job-Text in die Szene.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">3. Save</span>
            <p style={{ fontSize: "0.9rem" }}>
              Erst danach ist der Stand in Supabase stabil und nicht nur ein lokaler Draft.
            </p>
          </div>
        </div>
        <div className="highlight-box">
          <span className="label">Human Edit Memory</span>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            Wenn du einen übernommenen Job vor dem Speichern weiterbearbeitest, speichert EMBER
            die Differenz als Lernsignal. Aktive Beispiele beeinflussen spätere Drafts als Muster,
            ohne alte Sätze oder Plotinhalte zu kopieren.
          </p>
        </div>
        <div className="highlight-box">
          <span className="label">Export</span>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>
            Im Amazon-Ops-Bereich kannst du den aktuellen Scene-Block-Stand als schlichtes
            Markdown-Manuskript exportieren.
          </p>
        </div>
      </section>

      <section>
        <h2>6. Erster Lauf für neue Nutzer</h2>
        <div className="highlight-box">
          <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.95rem" }}>
            <li>`npm run dev` starten.</li>
            <li>`/studio` öffnen und eine Szene mit klarer Summary wählen.</li>
            <li>Provider auf `OpenAI` oder `Anthropic` setzen.</li>
            <li>Wortziel auf einen normalen Bereich setzen, nicht zu hoch.</li>
            <li>Eine kurze operative Director Note schreiben.</li>
            <li>Job starten, Ergebnis lesen, dann Accept und Save prüfen.</li>
          </ol>
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
