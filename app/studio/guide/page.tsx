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
        <span className="kicker">Deep Dive | Blueprint v2</span>
        <h1>Die perfekte Regie</h1>
        <p className="intro">
          EMBER schreibt nicht „einfach so“. Die Qualität des Drafts hängt direkt von der 
          Konfiguration in deiner Regie-Datei ab. Hier lernst du, wie du die Pipeline steuerst.
        </p>
      </header>

      <section>
        <h2>1. Das Strategische Fundament</h2>
        <p>
          Bevor eine einzige Zeile Prosa entsteht, muss die KI den „Sound“ und die Grenzen 
          des Projekts verstehen. Dies geschieht in der <strong>Writer Constitution</strong>.
        </p>
        
        <div className="grid">
          <div className="grid-item rule-pos">
            <span className="label">Positiv-Regeln (Stilanker)</span>
            <p style={{ fontSize: '0.85rem' }}>
              Definiere, wie EMBER schreiben soll. Vermeide Adjektive, nutze Beobachtungen.
            </p>
            <div className="example-block">
"Nahe dritte Person auf Eva. 
Sätze werden unter Druck nicht poetischer, 
sondern genauer und kürzer."</div>
          </div>
          <div className="grid-item rule-neg">
            <span className="label">Negativ-Regeln (Verbote)</span>
            <p style={{ fontSize: '0.85rem' }}>
              Harte Grenzen verhindern KI-Drift (z.B. „Kitsch“, „Erklärungsmonologe“).
            </p>
            <div className="example-block">
"Kein Täter-POV. 
Keine inkompetente Kita als billiger Plotmotor.
Kein Wahn- oder Psychose-Twist."</div>
          </div>
        </div>
      </section>

      <section>
        <h2>2. Das operative Gehirn: Scene Cards</h2>
        <p>
          Scene Cards sind die wichtigste Sektion. Sie wandeln deine Dramaturgie in 
          maschinelle Anweisungen für die Pipeline um.
        </p>

        <h3>Der Proof-Object-Guard</h3>
        <p>
          Das Feld <span className="code">proof_object</span> ist ein Sicherheitsmechanismus. 
          Der Draft wird vom System <strong>abgelehnt</strong>, wenn dieser Begriff nicht 
          im Text auftaucht.
        </p>

        <div className="highlight-box">
          <span className="label">Beispiel aus „Die falsche Abholung“ (Szene 1.2)</span>
          <div className="example-block">
Scene Card
  id: SC_1_2
  proof_object: Videoausschnitt, Unterschrift und gelber Becher
  coreAction: Petra zeigt ihr Videoausschnitt, Unterschrift und den gelben Becher...
  reversal: Gerade die alltagsnahe Unschärfe macht den Vorgang sozial glaubwürdig.</div>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            <strong>Warum das wichtig ist:</strong> Ohne den „gelben Becher“ als materiellen Anker 
            könnte die KI eine generische Büro-Szene schreiben. Der Guard zwingt sie zur 
            Konkretheit.
          </p>
        </div>

        <h3>Wortziele für Fusionskapitel</h3>
        <p>
          EMBER hat Standard-Ziele (1200–1600 Wörter). Für komplexe Wendepunkte kannst du diese 
          in der Scene Card überschreiben:
        </p>
        <div className="example-block">
word_target_min: 1700
word_target_max: 1950</div>
      </section>

      <section>
        <h2>3. Charakter-Gedächtnis & Ledger</h2>
        <p>
          Die KI muss wissen, was eine Figur antreibt (Wunde) und wie sie spricht (Speech Pattern). 
          Das <strong>Character State Ledger</strong> liefert diese Daten konsistent an jedes Kapitel.
        </p>

        <div className="card">
          <span className="label">Beispiel: Eva Berger (Wunde)</span>
          <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
            „Simon warf ihr Unzuverlässigkeit vor. Eva verteidigt sich über Kontrolle. 
            Wenn sie angezweifelt wird, wird sie schneller und härter.“
          </p>
          <p style={{ fontSize: '0.85rem' }}>
            <strong>Pipeline-Effekt:</strong> Wenn Eva in Szene 1.1 den App-Eintrag sieht, 
            schreibt die KI sie nicht „traurig“, sondern „kontrolliert-nervös“.
          </p>
        </div>
      </section>

      <section>
        <h2>4. Continuity Guardrails</h2>
        <p>
          Dieses Modul läuft nach jedem Draft-Lauf und prüft auf Fehler, die ein menschlicher 
          Lektor sofort sehen würde.
        </p>

        <table>
          <thead>
            <tr>
              <th>Typ</th>
              <th>Prüfung durch die Pipeline</th>
              <th>Beispiel-Schutz</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Namensdrift</strong></td>
              <td>Wurde eine Figur plötzlich umbenannt?</td>
              <td>„Eva Berger“ vs. „Frau Müller“</td>
            </tr>
            <tr>
              <td><strong>Farbdrift</strong></td>
              <td>Behalten Ankerobjekte ihre Farbe?</td>
              <td>„gelber Becher“ vs. „blauer Becher“</td>
            </tr>
            <tr>
              <td><strong>Rollen-Lock</strong></td>
              <td>Wird die Funktion der Figur beibehalten?</td>
              <td>„Sonnengarten“ muss eine Kita bleiben.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>5. Der Strategische Assistent (Chat)</h2>
        <p>
          Der EMBER Assistant ist kein gewöhnlicher Chatbot. Er ist ein integrierter Story-Stratege, 
          der den gesamten Kontext deines Projekts kennt.
        </p>

        <div className="grid">
          <div className="grid-item">
            <span className="label">Context Scopes</span>
            <p style={{ fontSize: '0.85rem' }}>
              Du entscheidest, wie viel der Assistent „weiß“. Wähle zwischen 
              <strong> Projekt</strong>, <strong>Act</strong>, <strong>Kapitel</strong> oder 
              einer spezifischen <strong>Szene</strong>. 
            </p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-faint)' }}>
              Im Scope „Szene“ sieht er alle relevanten Charakter-Stände und offenen Threads.
            </p>
          </div>
          <div className="grid-item">
            <span className="label">Output Modi</span>
            <p style={{ fontSize: '0.85rem' }}>
              <strong>Antwort (Chat):</strong> Schnelles Brainstorming und Analyse.<br />
              <strong>Regie (Dokument):</strong> Erzeugt einen formalen Regiebrief als persistentes Dokument (Artifact).
            </p>
          </div>
        </div>

        <div className="highlight-box">
          <h3 style={{ marginTop: 0 }}>Was ein Regiebrief (Artifact) leistet</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Wenn du den Modus auf „Regie“ stellst, analysiert der Assistent den **Pipeline-Fit** 
            deiner Idee. Er erzeugt Dokumente mit:
          </p>
          <ul style={{ fontSize: '0.85rem' }}>
            <li><strong>Strukturabgleich:</strong> Passt die Szene zum Master Brief?</li>
            <li><strong>Stable Prefix:</strong> Zusammenfassung der unumstößlichen Buchwahrheiten.</li>
            <li><strong>Nächste Schritte:</strong> Konkrete Aufgaben für die Writer-UI.</li>
          </ul>
        </div>

        <div className="error-box" style={{ background: 'rgba(224, 159, 102, 0.05)', borderLeftColor: 'var(--accent)' }}>
          <h4 style={{ color: 'var(--accent)' }}>Pro-Tipp: Die X-Ray Regel</h4>
          <p style={{ fontSize: '0.85rem' }}>
            Nutze vor jeder Revision ein Kapitel-X-Ray: 
            <strong> „Eva will X, tut Y, verliert oder gewinnt Z.“</strong> 
            Wenn ein Kapitel keine klare Veränderung (Z) hat, streiche oder fusioniere es.
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
