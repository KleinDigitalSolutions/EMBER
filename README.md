# EMBER — AI-Powered Novel Writing Studio

**[👉 Live Studio at ember-story.vercel.app](https://ember-story.vercel.app/studio/)**



![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![OpenAI](https://img.shields.io/badge/OpenAI-SDK-412991?logo=openai&logoColor=white)
![Anthropic](https://img.shields.io/badge/Anthropic-SDK-D4A574?logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)
A structured writing environment for long-form fiction, powered by OpenAI and Anthropic. EMBER combines a **scene-card pipeline**, a **memory backbone**, and a **stateful draft engine** to help authors write consistently across chapters and books — not just generate text.

---

## What is EMBER?

Most AI writing tools are stateless: each generation forgets what came before. EMBER is different. It maintains a persistent **Memory Backbone** — a living record of canon facts, character states, object tracking, open plot threads, and reader promises — and uses it to ensure every generated scene is consistent with everything that came before.

Built for commercial fiction. Designed for authors who want AI as a disciplined co-pilot, not an autocomplete.

---

## Core Features

### 📋 Scene Card Pipeline
Structured scene direction using YAML-like cards with hard (canon) and soft (guidance) fields. The writer reads the card but is not bound by its exact language.

### 🧠 Memory Backbone
- **Canon Ledger** — locked facts that can never be contradicted
- **Character State Ledger** — who knows what, who wants what, and how they've shifted
- **Object Ledger** — tracks physical objects, their holders, and their locations across scenes
- **Knowledge Ledger** — information asymmetry between characters and reader
- **Promise Ledger** — setup/payoff tracking for mysteries, emotional arcs, and plot threads

### 🔄 StateDiff Layer
After each draft is accepted, a typed `BookStateDiff` is extracted — a structured diff of what changed in the world (objects moved, knowledge revealed, promises reinforced). Human approval gates what enters the canon.

### 🎯 Draft Engine
- Lean remote pipeline via OpenAI or Anthropic
- `length_control` → `extract` → `continuity` → `quality_eval` stages
- Quality audit warns, never auto-rewrites
- Human Edit Memory: accepted edits are stored and influence future prompts

### 📚 Legacy Reader
A branching-fiction storefront and reader at `public/legacy/`, built in vanilla JS with localStorage-based progress resumption.

### 💬 Studio Assistant
An in-studio chat assistant (OpenAI / Anthropic / local Gemma) scoped to project, act, chapter, or scene context.

---

## Portfolio Sample

<details>
<summary><strong>Opus Direct First Scene</strong> — scene output, editorial notes, and pipeline proof</summary>

### Run Metadata

| Field | Value |
|-------|-------|
| Model | `claude-opus-4-7` |
| Duration | `61.352s` |
| Stop Reason | `end_turn` |
| Input Tokens | `1,278` |
| Output Tokens | `3,622` |

### Editorial Notes

| Point | Note |
|-------|------|
| Length | About 1,300 words for an opening scene: focused, not overextended. |
| Pacing dip | The passage about Erhan's mother, the Cemevi, and Semah is important, but slightly expository in rhythm. In a rewrite, it could be compressed into a sharper sensory impression. |
| "Blatt Papier" comparison | "Ich klappte zusammen wie ein Blatt Papier" is the only image that feels slightly generic. The rest of the prose is more specific, so this metaphor stands out. |
| Erhan ending | "Erhan war mein Freund. Erhan war weiterhin mein Freund." is strong. The following explanatory paragraph trusts the reader a little less than the scene otherwise does. |
| Smoothness markers | No "ein Hauch von", no "etwas in mir zerbrach", no "ohne es zu wissen". The draft is unusually clean on this axis. |

### Why It Matters

This sample is the clearest proof that EMBER is not a toy demo. Next to the pipeline architecture — Scene Card → Context Pack → Draft → Quality Eval — a technical reviewer can see that the system produces readable prose, and that Continuity Guards, Locked Facts, and the Memory Backbone are there to enable coherent, detail-rich drafting rather than add process for its own sake.

### Scene

Der Schulhof war asphaltiert und an den Rändern aufgeplatzt, als hätte jemand versucht, ihn von unten aufzubrechen. Zwischen den Rissen wuchs Gras, das keiner mähte. Im Sommer stand der Teer so heiß da, dass man den Geruch bis in die Klassenzimmer mitnahm, im Herbst klebte nasses Laub in Schichten darauf, und im Winter war er einfach nur grau. Ich erinnere mich an alle drei Zustände, weil ich in der dritten Klasse gelernt habe, den Boden genau anzusehen. Wer den Boden ansieht, sieht die Füße der anderen kommen.

Wir hatten große Pause, und ich stand an der Mauer neben dem Hausmeisterhäuschen, wo der Schatten war. Ich hatte ein Brot dabei, Sucuk, das Fett war durch das Papier gedrückt und hatte einen gelben Fleck auf meiner Jackentasche hinterlassen. Erhan stand ein paar Meter weiter, bei den Jungs aus der Vierten. Er war einen Kopf größer als ich und hatte Nike-Schuhe, die seine Mutter ihm aus Duisburg mitgebracht hatte. Er sah kurz zu mir rüber und nickte, so wie man nickt, wenn man sagen will: ich hab dich gesehen, mehr nicht.

Dann kam Mesut. Mesut war in meiner Klasse, aber er war älter, weil er einmal hängen geblieben war. Er hatte eine Oberlippe, auf der schon dunkler Flaum lag, und das gab ihm eine Art Vollmacht, die die anderen Jungs ihm sofort zugestanden. Neben ihm liefen zwei andere, deren Namen ich weiß, aber nicht mehr sagen will. Sie kamen nicht gezielt auf mich zu, sie schlenderten, und das war schlimmer, weil schlendern bedeutet, dass man Zeit hat.

»Ey«, sagte Mesut. »Bist du Kurde?«

Ich wusste nicht, was ich sagen sollte. Ich wusste, was das Wort bedeutete, ungefähr. Mein Vater hatte es zu Hause manchmal ausgesprochen, mit einer Stimme, die ich nicht einordnen konnte, nicht hasserfüllt, aber auch nicht leicht. Kars, hatte er gesagt, bei uns gibt es alles, Türken, Kurden, Aseris, Armenier früher. Wir sind Türkmenen. Er hatte das Wort Türkmene gesagt wie etwas, das man nicht erklären muss, wenn man es ist.

»Nein«, sagte ich. »Ich bin Türke.«

»Du lügst«, sagte Mesut. »Mein Vater sagt, du bist Kurde. Deine Familie ist aus dem Osten.«

»Wir sind aus Kars«, sagte ich. »Kars ist Osten, aber wir sind keine Kurden, wir sind Türkmenen.«

»Was ist das, Türkmene«, sagte einer der anderen und lachte, und an dem Lachen merkte ich, dass das Wort nichts half. Das Wort war nicht in der Liste der Wörter, die auf diesem Schulhof galten. Auf diesem Schulhof gab es Türken, Kurden, Araber, Deutsche, und wer zwischen diesen Wörtern war, war entweder nichts oder das, was die anderen entschieden.

»Und außerdem«, sagte Mesut, und jetzt kam er näher, »seid ihr Aleviten. Mein Vater sagt, Aleviten sind keine richtigen Muslime.«

Ich sah zu Erhan. Erhan war auch Alevit. Seine Mutter und meine Mutter kannten sich aus dem Cemevi, sie hatten zusammen Semah getanzt, ich hatte sie gesehen, in den langen Röcken, die Hände wie Vögel. Erhan sah mich jetzt an, und in seinem Blick war etwas, das ich damals nicht benennen konnte und heute nicht beschönigen will. Er sah weg. Nicht schnell, nicht panisch. Er sah einfach in die andere Richtung, dorthin, wo die Jungs aus der Vierten jetzt lauter wurden, weil sie bemerkten, dass gleich etwas passieren würde.

Der erste Schlag kam nicht ins Gesicht. Er kam auf den Oberarm, und er war nicht einmal besonders hart, er war mehr ein Stoß, mit dem Mesut prüfte, ob ich zurückstoßen würde. Ich stieß nicht zurück. Ich hatte das Brot noch in der Hand, und ich weiß noch, dass ich in dem Moment dachte, ich darf das Brot nicht fallen lassen, weil meine Mutter es gemacht hatte.

Dann ging es schneller. Der zweite Schlag traf die Seite, an den Rippen, und ich klappte zusammen wie ein Blatt Papier, nicht aus Schmerz, sondern weil der Körper in diesem Alter noch nicht gelernt hat, stehen zu bleiben. Auf dem Boden war der Teer warm, er roch nach Öl und nach dem Gummi der Turnschuhe. Jemand trat mir gegen den Schenkel, jemand zog an meiner Jacke, und das Sucuk-Brot fiel doch, es fiel auf das Papier und das Papier klebte fest. Ich sah es liegen und dachte: ich kann es nicht mehr mitnehmen, wenn sie weg sind, es ist jetzt schmutzig.

»Sag es«, sagte Mesut über mir. »Sag, du bist Kurde.«

»Ich bin kein Kurde«, sagte ich, und es war kein Mut, es war eher wie eine Formel, die man spricht, weil sie das Einzige ist, was man hat. »Ich bin Türkmene.«

»Es gibt keine Türkmenen«, sagte er, und das war der Satz, den ich mir gemerkt habe. Nicht der Schlag, nicht das Treten. Der Satz. *Es gibt keine Türkmenen.* Er sagte es nicht böse. Er sagte es so, wie man etwas Selbstverständliches sagt, das alle wissen. Für ihn gab es mich in der Form, in der ich mich benannte, einfach nicht.

Noch ein Tritt, in den Rücken, nicht fest, eher schon ein Abschluss. Dann hörte ich, wie die Schritte sich entfernten. Nicht rannten. Gingen. Mesut lachte etwas, und die anderen lachten mit, und ich hörte, wie Erhan auch lachte, kurz, halb, so ein Lachen, das ein Eintrittsgeld ist. Er lachte nicht über mich. Er lachte, damit sie nicht merkten, dass er zu mir gehörte.

Ich blieb liegen, bis ich sicher war, dass niemand mehr guckte. Das ist eine Fähigkeit, die man in diesem Alter sehr schnell lernt: den Moment abwarten, in dem die Aufmerksamkeit woanders hingeht. Dann stand ich auf. Mein Arm tat weh, meine Seite tat weh, aber mehr als alles brannte die Stelle auf dem Oberschenkel, wo der Schuh aufgetroffen war, das war die einzige Stelle, an der sich am nächsten Tag ein blauer Fleck zeigen würde, dunkel und gelb an den Rändern, und meine Mutter würde ihn sehen, wenn ich mich umzog, und nichts sagen, weil sie schon wusste, dass Fragen manchmal das Falsche sind.

Ich hob das Brot nicht auf. Ich ging zur Mauer zurück und setzte mich hin, den Rücken gegen den warmen Stein. Von dort sah ich Erhan. Er stand immer noch bei den Jungs aus der Vierten. Er sah einmal kurz zu mir her, und diesmal hielt er den Blick eine Sekunde länger, und in dieser Sekunde verstand ich etwas, das ich nicht in Worte gefasst habe, weil ich die Worte nicht hatte, aber das ich gespürt habe, körperlich, wie eine kalte Stelle unter der Haut.

Erhan war mein Freund. Erhan war weiterhin mein Freund. Am Nachmittag würden wir zusammen nach Hause laufen, und er würde mir vielleicht sagen, tut mir leid, oder er würde es nicht sagen und stattdessen über etwas anderes reden, ein Panini-Bild, einen Fußballer, den Film, der abends im Fernsehen lief. Am nächsten Tag würden wir zusammen zur Schule gehen, und übernächste Woche würden wir bei ihm zu Hause Playstation spielen, und seine Mutter würde uns Tee machen und mich fragen, wie es meiner Mutter geht. Nichts davon war falsch. Nichts davon war gelogen.

Und trotzdem wusste ich jetzt etwas, was ich vorher nicht gewusst hatte. Ich wusste, dass Erhan mich nicht schützen würde. Nicht weil er schlecht war. Weil er auch überleben musste. In diesem Viertel, auf diesem Schulhof, in dieser Luft, in der die Wörter Kurde und Türke und Alevit und Sunnit herumflogen wie Steine, die jemand aufgehoben hatte, um sie zu werfen, war Freundschaft eine Sache, die es gab, und Schutz war eine andere Sache, und die zwei hatten nichts miteinander zu tun.

Die Pausenglocke klingelte. Die anderen Kinder liefen zum Eingang, in Rudeln, lachend. Ich blieb noch einen Moment sitzen und sah auf das Brot, das auf dem Teer lag, mit dem gelben Fettfleck, der jetzt Staub angezogen hatte. Dann stand ich auf und ging hinein, und ich nahm mir vor, ab morgen kein Sucuk mehr mitzunehmen.

</details>

---

## Studio Impressions

### 🖋️ Manuscript Editor
Direct prose drafting with integrated scene context, word count tracking, and AI copilot selection.
![Studio Editor](/public/images/studio_editor.png)

### 📊 Blueprint & Memory Backbone
High-level project control across multiple phases, from foundation to market readiness.
![Blueprint Overview](/public/images/blueprint_overview.png)

### ⚖️ Writer Constitution
Fine-grained narrative rules and model orchestration instructions to maintain a consistent voice.
![Writer Constitution](/public/images/writer_constitution.png)

### 📖 Codex & World Bible
Centralized tracking of characters, locations, and objects with automated state updates.
![Codex & World Bible](/public/images/codex_world_bible.png)

### 🤖 Assistant Chat
Context-aware brainstorming and strategic feedback on manuscript chapters and scene cards.
![Assistant Chat](/public/images/assistant_chat.png)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15, React 19 |
| Language | TypeScript 5 |
| AI Providers | OpenAI SDK, Anthropic SDK |
| Database | Supabase (PostgreSQL) |
| Styling | Vanilla CSS (globals.css) |
| Local AI | MLX / Gemma 4 (optional) |

---

## Project Structure

```
ember-studio/
├── app/                    # Next.js App Router
│   ├── api/                # Route handlers (book jobs, assistant, etc.)
│   ├── studio/             # Studio UI pages
│   └── samples/            # Sample reader
├── components/             # React components
│   └── studio/             # All studio UI components
├── lib/                    # Core engine logic
│   ├── book-engine.ts      # Main draft pipeline (context → draft → extract → quality)
│   ├── story-schema.ts     # All TypeScript types + normalizers
│   ├── book-locked-facts.ts# Genre-specific canon fact profiles
│   ├── book-state-validator.ts # Deterministic StateDiff validation
│   ├── book-genre-engine-*.ts  # Genre-specific prompt engines
│   └── server/             # Supabase + provider integrations
├── scripts/                # CLI tools
│   ├── bootstrap-book-from-regie.ts  # Convert a Regie blueprint → Supabase book
│   └── book-state-validator.test.ts  # StateDiff test suite
├── public/legacy/          # Vanilla JS storefront + branching reader
└── supabase/migrations/    # SQL schema
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project (or local Supabase)
- OpenAI API key and/or Anthropic API key

### Setup

```bash
# 1. Clone and install
git clone https://github.com/KleinDigitalSolutions/EMBER.git
cd ember-studio
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in your API keys and Supabase credentials

# 3. Run database migrations
# Apply files in supabase/migrations/ to your Supabase project

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000/studio](http://localhost:3000/studio).

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Optional* | For OpenAI draft jobs |
| `ANTHROPIC_API_KEY` | Optional* | For Anthropic draft jobs |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `LOCAL_GEMMA_SERVER_URL` | No | Local Gemma/MLX for studio chat |

*At least one AI provider key is needed for draft generation.

---

## Architecture Notes

### Book Pipeline (Remote)
```
Scene Card
    ↓
Context Pack (canon + character state + open threads)
    ↓
Draft (direct from Scene Intention — no separate beat_plan call)
    ↓
Length Control (expand/compress only for strong outliers)
    ↓
Extract (StateDiff + canon candidates)
    ↓
Continuity Guard
    ↓
Quality Eval (warns, never blocks)
    ↓
Human Review → Accept / Reject
    ↓
StateDiff Approval → Memory Backbone Update
```

### Genre Engines
Pluggable genre engines extend the base pipeline with genre-specific locked facts, continuity rules, and prompt overlays. Current genres:
- `domestic_suspense_thriller`
- `ya_superhero_origin`

### StateDiff (typed state tracking)
Every accepted draft produces a `BookStateDiff` with object changes, knowledge state updates, promise reinforcements, and proposed canon facts. Promotion into the canon ledger requires explicit human approval.

---

## Scripts

```bash
# Run the StateDiff test suite
npm run test:book-state

# Type check
npm run typecheck

# Bootstrap a new book from a Regie blueprint
npx tsx scripts/bootstrap-book-from-regie.ts <path-to-regie.md>
```

---

## Status

This is an active portfolio / research project. The core pipeline is functional and used for real manuscript drafting. The UI is a working studio, not a polished SaaS product.

---

## License

MIT — see [LICENSE](LICENSE) for details.
