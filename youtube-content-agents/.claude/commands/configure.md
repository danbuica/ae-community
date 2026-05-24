# Configure

Interactive one-time setup for the YouTube Content Agents. Run this with **no arguments** — it asks the questions, then writes `config.json` and `.env`, and tells you how to drop in your subject photo and tool logos.

## Instructions

This command configures all three agents (`/thumbnail-generator`, `/description-generator`, `/motion-animations-generator`) by populating a single `config.json`. Use the `AskUserQuestion` tool for the choices below — ask in small batches, offer sensible defaults, and let the user skip any question to accept the default.

### 0. Start from the template

- If `config.json` already exists, read it and treat its values as the current defaults (this is a re-configure, not a fresh start). Confirm to the user you are editing the existing config.
- Otherwise, read `config.example.json` and use it as the starting structure. Never overwrite `config.example.json`.

### 1. Brand identity (shared by all three agents)

Ask for:
- **Channel name** (`brand.channel_name`).
- **Subject / on-camera name** (`brand.subject_name`) — the person who appears in thumbnails.
- **Vibe** (`brand.vibe`) — a short phrase, e.g. "dark, intense, tech-forward, cinematic". Offer that as the default.
- **Palette** (`brand.palette`): background, accent 1 (cool), accent 2 (warm), primary text, secondary text. Ask for hex codes. Offer defaults `#121212` / `#00E5FF` / `#FF6D00` / `#FFFFFF` / `#E0E0E0`. Remind them: pick one cool + one warm accent so arrows and key words pop.
- **Fonts** (`brand.fonts`): heading and body (Google Fonts names). Offer `Inter` / `Roboto Mono` as defaults.

### 2. Thumbnail settings + style (`/thumbnail-generator`)

This is the agent with the most visual personality, so ask the most here. Spend real questions on the **style** so the thumbnails come out looking like the user's channel. Offer the example values as defaults and let them accept all defaults quickly if they want.

Wardrobe & subject:
- **Clothing options** (`thumbnail.clothing_options`) — wardrobe variations to rotate through.
- **Expressions** (`thumbnail.expressions`) — face expressions to rotate through.
- **Subject framing** (`thumbnail.style.subject_framing`) — e.g. head & shoulders cleanly cut out, waist-up, full background scene.

Style & look (ask these explicitly — this is what the user asked to expand):
- **Background style** (`thumbnail.style.background`) — e.g. dark mode with blurred tech, solid color, gradient, real scene/photo, abstract.
- **Graphic elements** (`thumbnail.style.graphics`) — which to favor: 3D glassmorphism icons, glowing arrows, connection nodes, UI screenshots, big numbers, emoji, none. (Multi-select.)
- **Composition preferences** (`thumbnail.style.composition_preferences`) — which layouts to rotate through: split (text left / subject right), rule of thirds, centered (text top & bottom), dynamic diagonal. (Multi-select.)
- **Text treatment** (`thumbnail.style.text_treatment`) — e.g. massive bold sans-serif white with accent highlights, outlined text, text in a highlight box.
- **Mood** (`thumbnail.style.mood`) — e.g. high-contrast cinematic premium; bright and playful; minimal and clean.
- **Reference notes** (`thumbnail.style.reference_notes`) — free text: any channels or specific thumbnails they want to emulate, or anything to avoid. Optional but very useful — capture whatever they say verbatim.

Output settings:
- **Quality** (`thumbnail.quality`) — `low` / `medium` / `high`. Default `high` (best results, ~$0.16/image, slower). Mention the trade-off.
- Leave `model` (`gpt-image-2`), `size` (`1280x720`), `output_format` (`png`), `subject_image`, `logos_dir`, and `output_dir` at their defaults unless the user wants to change them.

### 3. Description settings (`/description-generator`)

Keep this **short** — do NOT ask the user for any Notion IDs, URLs, or data source IDs. Those get wired up automatically in the final step. Only ask:
- **Community link** (`description.community_link`) — the free community / lead-magnet URL placed as the first line of long-form descriptions. If they have none, leave it empty and the agent will skip that line.
- **Community blurb** (`description.community_blurb`) — the text before the link. Default "Join my FREE community".
- **Subscribe CTA** (`description.subscribe_cta`) — the closing line. Offer the example default.

Leave `description.format_signals` (the long-form / short / batch emojis) at their defaults silently — don't ask. Leave `description.platform_notion.*` as placeholders for now; the final step fills them in.

### 4. Motion settings (`/motion-animations-generator`)

- These mostly inherit from `brand`. Only ask if the user wants non-default export dimensions/length: `motion.default_width` (1920), `default_height` (1080), `default_fps` (60), `default_duration` (6 seconds). Otherwise keep defaults.

### 5. OpenAI API key (for `/thumbnail-generator`)

- Ask the user to paste their OpenAI API key, OR tell them they can edit `.env` themselves.
- If they paste it, write it to `.env` as `OPENAI_API_KEY=<key>` (this file is gitignored). Confirm the key looks like an OpenAI key (`sk-...`) but do not print it back in full.
- If they decline, leave the `.env` placeholder and remind them to fill it before running `/thumbnail-generator`.

### 6. Write the files

- Write the assembled config to `config.json` (pretty-printed, 2-space indent). Preserve any keys from the template you didn't ask about.
- Write `.env` if a key was provided.
- Validate the JSON parses before finishing.

### 7. Tell the user how to add assets (do this every time)

Print these instructions clearly:

**Subject photo (required for thumbnails):**
- Add a clear, well-lit photo of `{brand.subject_name}` at `resources/subject.png`.
- Front-facing, good lighting, ideally a transparent or simple background works best. The thumbnail model uses this as the first reference image.

**Tool logos (optional, recommended for tool-specific videos):**
- Drop PNG logos into `resources/app-logos/`, named `<tool>-logo.png` (e.g. `n8n-logo.png`, `openai-logo.png`, `claude-logo.png`).
- The thumbnail agent scans this folder and includes any logo whose tool is mentioned in the chosen concept.

**Reminders:**
- `config.json`, `.env`, your `resources/` assets, and all generated output are gitignored — they stay on your machine.
- For motion video export, install `ffmpeg` (`brew install ffmpeg`) and run `npm install` once inside `scripts/motion/`.

### 8. Confirm what's configured

Summarize what was just set up (channel name, palette, thumbnail style, which agents are ready, what's still missing — e.g. "subject.png not found yet", "OPENAI_API_KEY still a placeholder").

### 9. Final message — connect Notion and let me wire up the description generator

This is the **last thing you send** in the configure run. Do NOT ask for any Notion IDs. Instead, print clear instructions for adding the Notion MCP, then offer to point the description generator at their pages yourself.

Print roughly this:

> **Last step — connect Notion (for `/description-generator`):**
>
> 1. In Claude Code, run `/mcp` (or open Settings → Connectors).
> 2. Add the **Notion** connector and authenticate with your Notion account.
> 3. Make sure the integration has access to your **content calendar** database (in Notion: open the database → `•••` → Connections → add the connector).
>
> Once that's done, just **tell me "Notion is connected"** and I'll find your content calendar and point the description generator straight at it — no IDs for you to copy.

Then stop and wait for the user.

### 10. When the user says Notion is connected — auto-wire the calendar

When the user confirms the MCP is connected (this may be a later turn), do this yourself:

1. Confirm the Notion MCP tools are available (`mcp__claude_ai_Notion__notion-search`, `notion-fetch`). If not, tell the user it isn't connected yet and stop.
2. Use `notion-search` to find the user's content calendar database. Search broadly for likely names ("content calendar", "content", "video pipeline", "YouTube", the channel name). 
3. Present the top candidates and let the user confirm which one is their content calendar (skip the question only if there's a single obvious match).
4. `notion-fetch` the chosen database to resolve its canonical URL and its **data source / collection ID**.
5. Write those into `config.json` → `description.platform_notion.content_calendar_url` and `description.platform_notion.content_calendar_data_source`. Re-validate the JSON.
6. Confirm to the user: "Description generator is now pointed at `<database name>`. You're all set — try `/description-generator \"<a video title>\"`."

If the user doesn't use Notion, tell them they can skip this; `/description-generator` will fall back to a workspace-wide search at run time.
