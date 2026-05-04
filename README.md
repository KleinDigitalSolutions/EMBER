# EMBER — AI-Powered Novel Writing Studio

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
