# YouTube Content Agents

Agents for running a YouTube channel's content production: generating click-worthy thumbnails, writing SEO-optimized descriptions, and producing branded motion graphics. Everything is driven by a single `config.json` so the agents match **your** brand, not a hardcoded one.

Each agent is a **Claude Code slash command** — a markdown file in `.claude/commands/` that Claude Code exposes as `/command-name` when you open this folder. Some agents call small helper scripts in `scripts/`.

## Agents

### 0. `/configure` (run this first)
Interactive one-time setup. Run it with no arguments and answer the questions — it writes your brand colors, fonts, subject identity, thumbnail preferences, Notion + community settings, and OpenAI key into `config.json` and `.env`, then tells you how to drop in your subject photo and tool logos. Re-run any time to change settings.

### 1. `/thumbnail-generator "Video Title"`
Turns a title into 5 distinct thumbnail concepts, then renders the chosen one with **OpenAI GPT Image 2** (`gpt-image-2`) at native 1280×720 (16:9, no cropping). Uses your photo (`resources/subject.png`) as the subject and any matching tool logos from `resources/app-logos/`. Calls `scripts/generate_thumbnail.py`. Outputs to `thumbnails/<title-slug>/`.

### 2. `/description-generator "Video Title"`
Finds the video in your **Notion** content calendar, auto-detects long-form vs short, and writes an SEO-rich description. Long-form gets a chapter list with placeholder timestamps + a resources section; shorts get Title + YouTube + Instagram + TikTok captions. Appends the result back to the Notion page. Uses the Notion MCP (no script).

### 3. `/motion-animations-generator "what to animate"`
Builds code-based (HTML/CSS/GSAP) motion graphics in your brand colors and fonts, on a dark or transparent background. Embeds any matching tool logos from `resources/app-logos/` (the same folder the thumbnail agent uses). Optionally exports a transparent Apple ProRes 4444 `.mov` for Premiere / Final Cut via `scripts/motion/`. Outputs to `motion-animations/<animation-name>/`.

## Setup

### Prerequisites
- [Claude Code](https://claude.com/claude-code) installed (`npm install -g @anthropic-ai/claude-code`)
- An **OpenAI API key** with image access — for `/thumbnail-generator`. Get one at [platform.openai.com](https://platform.openai.com/api-keys)
- The **Notion MCP** connected in Claude Code — for `/description-generator`
- **Python 3.10+** — for the thumbnail script
- **Node.js 20+** and **ffmpeg** (`brew install ffmpeg`) — only if you want to export motion animations to video

### 1. Get this folder onto your machine
Either clone the full `ae-community` repo or download just `youtube-content-agents/` (see the root README for options). Open a terminal inside this folder.

### 2. Open Claude Code and run `/configure`
```bash
cd youtube-content-agents
claude
```
Then, inside Claude Code:
```
/configure
```
Answer the prompts. This creates `config.json` (your settings) and `.env` (your OpenAI key) — both gitignored. At the end it walks you through connecting the **Notion** MCP, then finds your content calendar and wires `/description-generator` to it automatically — you never copy a single ID.

### 3. Add your assets
- **Subject photo**: put a clear, well-lit photo of yourself at `resources/subject.png`.
- **Tool logos** (optional): drop PNGs into `resources/app-logos/` named `<tool>-logo.png` (e.g. `n8n-logo.png`).

That's it — the agents are ready.

## Running the agents

```
/thumbnail-generator "Why I Stopped Using Zapier"
/description-generator "Why I Stopped Using Zapier"
/motion-animations-generator "an animated revenue counter"
```

Typical flow for a video:
1. `/configure` once → `config.json` + `.env`
2. `/description-generator "<title>"` → SEO description written back to Notion
3. `/thumbnail-generator "<title>"` → pick a concept → final 1280×720 thumbnail
4. `/motion-animations-generator "<idea>"` → branded overlay / clip, export to `.mov` if needed

## Configuration

Everything brand-specific lives in `config.json` (created by `/configure` from `config.example.json`):

- `brand` — channel name, subject name, vibe, color palette, fonts. Shared by all three agents.
- `thumbnail` — clothing options, expressions, full `style` block (background, graphics, composition, text treatment, mood, reference notes), model/size/quality, asset paths.
- `description` — community link, subscribe CTA, format-detection emojis, and the Notion calendar pointers (auto-filled by `/configure` — no IDs to copy).
- `motion` — output dir, tool-logos dir (shared with thumbnails), and default export dimensions/length.

Edit `config.json` directly or re-run `/configure` any time.

## Data layout

```
youtube-content-agents/
├── .claude/commands/                 # the four slash commands
├── scripts/
│   ├── generate_thumbnail.py         # OpenAI GPT Image 2 helper
│   └── motion/                       # Puppeteer + ffmpeg video exporter
├── docs/
│   └── thumbnail-style-guide.md      # how the thumbnail aesthetic maps to config
├── resources/
│   ├── subject.png                   # YOU add this (gitignored)
│   └── app-logos/                    # YOU add tool logos here (gitignored)
├── config.example.json               # committed template
├── config.json                       # your settings (gitignored, made by /configure)
├── .env.example                      # committed template
├── .env                              # your OpenAI key (gitignored)
├── thumbnails/                        # /thumbnail-generator output (gitignored)
└── motion-animations/                # /motion-animations-generator output (gitignored)
```

## Adding a new agent

Drop a new markdown file into `.claude/commands/` (this becomes the slash command). If it needs to shell out for something heavy (image generation, API calls), add a helper in `scripts/` and have the command invoke it. Read shared brand values from `config.json` so it stays consistent with the others. Then add an entry to the list above.
