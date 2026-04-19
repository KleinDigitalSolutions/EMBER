# 📘 EMBER Studio: Betriebsanleitung (Bereich "Book")

EMBER ist kein einfacher Texteditor, sondern ein **mehrstufiges Orchestrierungswerkzeug**. Du schreibst nicht *mit* der KI, sondern du *steuerst* eine Pipeline, die ein konsistentes Buch erzeugt.

---

## 1. Das Drei-Säulen-Prinzip (Navigation)
In der UI (oben links) wechselst du zwischen den drei Hauptmodi für dein Buch:
1.  **Blueprint (Plan):** Definition von Zielgruppe, Prämisse und Stilregeln.
2.  **Writer (Book):** Das operative Zentrum für das Verfassen der Szenen.
3.  **Review:** Die narrative Qualitätskontrolle (Logik-Checks).

---

## 2. Phase 1: Die Architektur (Blueprint)
Bevor das erste Wort geschrieben wird, setzt du die Leitplanken im **Blueprint-Panel**:
*   **Master Brief:** Der Kern der Geschichte und das Versprechen an den Leser.
*   **Writer Constitution:** Die stilistische Verfassung (z.B. "Hard-boiled Noir", "Show, don't tell").
*   **Market Brief:** Strategische Ausrichtung für Plattformen wie Amazon (Kategorie, Hook).

---

## 3. Phase 2: Die Struktur (Szenen-Planung)
Nutze die linke Seitenleiste (**Manuscript Explorer**), um dein Buch zu strukturieren:
*   Organisiere Inhalte in **Akte -> Kapitel -> Szenen**.
*   Wähle eine Szene aus, um sie im **Writer-Panel** zu bearbeiten.
*   **Wichtig:** Jede Szene benötigt ein **Label** (z.B. "Opening") und eine **Summary** (Zusammenfassung). Diese Zusammenfassung dient der KI als Arbeitsgrundlage.

---

## 4. Phase 3: Der operative Schreibprozess (Writer Panel)
Dies ist das Herzstück des Studios. Rechts im Writer-Panel befindet sich der **AI-Copilot**.

### Der Pipeline-Workflow
Ein "Job" für eine Szene durchläuft automatisch folgende 6 Stufen:
1.  **Context:** Sammelt alle Infos (Codex, vorherige Szenen, Blueprint).
2.  **Outline:** Erstellt ein detailliertes Szenen-Skelett (Beats).
3.  **Draft:** Generiert den ersten Roh-Text.
4.  **Extract:** Liest den Text und extrahiert neue Fakten für das Gedächtnis (Codex).
5.  **Continuity:** Prüft den Text gegen den bisherigen Kanon (Logik-Check).
6.  **Rewrite:** Finale Politur basierend auf Stilregeln und Regieanweisungen.

### Steuerungselemente:
*   **Modell-Selektor:** Wahl des Providers (`OpenAI`, `Anthropic`, `Gemini`).
*   **Regieanweisung:** Dein wichtigster Hebel. Gib hier Befehle wie: *"Mehr Subtext"*, *"Erhöhe die Spannung"* oder *"Fokussiere dich auf sinnliche Details"*.
*   **Ziel-Länge:** Festlegen der Min/Max Wortzahlen für den Output.

---

## 5. Phase 4: Das Gedächtnis (Codex)
In der linken Leiste findest du den **Codex** (deine Welt-Bibel):
*   Hier werden Charaktere, Orte und Fakten persistent gespeichert.
*   Durch die **Extract-Phase** der Pipeline füllt sich der Codex teilautomatisch.
*   Der Codex stellt sicher, dass die KI konsistent bleibt (z.B. Augenfarbe eines Charakters in Kapitel 1 vs. Kapitel 20).

---

## 6. Phase 5: Qualitätskontrolle (Review Panel)
Nach Abschluss einer Szene erfolgt die Abnahme im **Review-Panel**:
*   **Continuity Report:** Visualisiert Warnungen bei Logikfehlern (z.B. "Charakter weiß Dinge, die er noch nicht wissen kann").
*   **Submission Gate:** Prüft, ob alle Pflichtfelder für die Veröffentlichung (Metadaten, Cover-Richtung) ausgefüllt sind.

---

## Profi-Tipp für innovative Arbeit:
Nutze die **Regieanweisung** für die emotionale Steuerung, nicht nur für den Plot:
> *"Lass die Umgebung wie einen Feind wirken. Jonas muss sich beobachtet fühlen, obwohl niemand da ist. Nutze kurze, abgehackte Sätze, um seine Nervosität zu spiegeln."*

---
*Dokument erstellt am 19. April 2026 für EMBER Studio v1.0*
