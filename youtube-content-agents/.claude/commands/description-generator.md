# Description Generator

Generate an SEO-optimized YouTube description for a video stored in your Notion content calendar. Auto-detects long-form vs short, builds a chapter list with placeholder timestamps for long-form, generates Title + YouTube + Instagram + TikTok captions for shorts, and appends the result back to the Notion page.

## Instructions

The user provides a video title as `$ARGUMENTS` (e.g., "Why I Stopped Using Zapier"). If no title is given, ask for one.

### 0. Load config (always first)

- Read `config.json`. If it does not exist, tell the user to run `/configure` first and stop.
- Read the `description` section:
  - `platform_notion.content_calendar_url` and `platform_notion.content_calendar_data_source` — where to search.
  - `community_link` + `community_blurb` — the first line for long-form (skip entirely if `community_link` is still a placeholder or empty).
  - `subscribe_cta` — the closing subscribe line.
  - `format_signals.long_form_icon`, `format_signals.short_icon`, `format_signals.shorts_batch_prefix` — used in format detection.
- Also read `brand.channel_name` for tone where useful.

### Required Notion tools

This command uses the Notion MCP — no Python script. Confirm these tool names are available before starting (load via ToolSearch if needed):
- `mcp__claude_ai_Notion__notion-search`
- `mcp__claude_ai_Notion__notion-fetch`
- `mcp__claude_ai_Notion__notion-update-page`

If the Notion MCP is not connected, tell the user to connect it and stop.

### 1. Find the page

- Run `notion-search` with the user-provided title against `content_calendar_data_source` (fall back to a workspace-wide search if the data source is a placeholder).
- If multiple plausible matches return, list the top 3 and ask which one.
- If zero matches return, ask the user for the URL or a more specific title.

### 2. Fetch the page

- Call `notion-fetch` on the chosen page ID.
- Keep the full markdown body in working memory — it is the source material for the description.

### 3. Detect format (multi-signal, fall back to asking)

Run these checks in order and stop at the first confident match:

1. **Explicit text marker**: a line like `> **Format:** Long-form …` or `> **Format:** Short …`. Most reliable.
2. **Icon emoji**: page icon is `format_signals.long_form_icon` → **long**; `format_signals.short_icon` → **short**.
3. **Containment**: page is nested under a parent whose title starts with `format_signals.shorts_batch_prefix` → **short**.
4. **Structural heuristics**:
   - H2 headings like `HOOK`, `SECTION 1`, `SECTION 2`, `Production Notes`, or any heading with a multi-minute timestamp range like `(0:30 – 2:00)` → **long**.
   - `Hook (spoken line)`, `Hook (show on screen)`, short bulleted `Steps`, and no `Production Notes` block → **short**.
5. **Title hints**: title starts with `Short`, contains the short icon, or matches a `## Short N — …` heading inside a batch page → **short**.
6. **Fallback**: if signals conflict or none resolve, ask: *"Is this a long-form video or a short?"*

Confirm the detected format in one line before generating ("Detected as long-form — proceeding.").

### 4. Branch by format

#### A) Long-form

1. **Generate chapter list with placeholder timestamps** — do NOT ask the user for timestamps.
   - Extract chapter titles from the script's section headings (H2/H3).
   - Rewrite headings into clean, viewer-facing chapter titles.
   - Format: first chapter `0:00 <title>` (intro/hook is always 0:00); all others `X:XX <title>`. The user fills real timestamps in after editing.

2. **Mine SEO keywords** from the page body: the title, any `> **Pillar:**` tag, Tags property values, and substantive nouns/phrases from the HOOK and section headings. Identify the 5–8 strongest searchable keywords (tools, company names, concepts).

3. **Generate description (~250–350 words)** in this structure (omit the community line if `community_link` is empty/placeholder):

   ```
   🎁 {community_blurb}: {community_link}

   <Hook paragraph — 1–2 lines that pull a viewer in. Use the script's actual hook as raw material, not a rephrase of the title.>

   <SEO paragraph 1 — 2–4 sentences on what the video covers. Weave in 2–3 mined keywords naturally.>

   <SEO paragraph 2 — 2–4 sentences on why it matters / what you'll learn. Weave in 2–3 more keywords.>

   ⏱ Chapters
   0:00 <chapter 1 — from the HOOK/intro>
   X:XX <chapter 2 — from SECTION 1 heading>
   X:XX <chapter 3 — from SECTION 2 heading>
   …
   (placeholder timestamps — user fills these in after editing)

   🔗 Resources mentioned
   <pull any URLs that appear in the script body>

   🔔 {subscribe_cta}
   ```

4. **Write back to Notion**:
   - Append a new H2 `## 📝 YouTube Description` at the end of the page body, followed by the description.
   - If a `## 📝 YouTube Description` H2 already exists, **replace** that block (and everything under it up to the next H2). Do not stack duplicates.
   - Use `notion-update-page` with the right command (`append_blocks` or `replace_content`). Load the Notion MCP tool schema via ToolSearch if you have not used it before.

5. **Confirm**: print the generated description as plain text in chat AND share the Notion page URL.

#### B) Short

1. **Locate the target block**:
   - Standalone short page → operate on that page directly.
   - Inside a `shorts_batch_prefix` batch page → scan for an H2 `## Short N — <title>`; the target is the content under it. If missing, ask which heading the description belongs to.

2. **Read the short's source**: Hook (spoken line), Hook (show on screen), Steps, Filming notes, any CTA hints.

3. **Mine SEO keywords** as in long-form but tighter (3–5 max).

4. **Generate Title + YouTube + Instagram + TikTok caption**:

   ```
   **Title (all platforms)**
   <Hook-driven title, ~60 chars max, keyword-front-loaded>

   **YouTube Description**
   <1–2 line hook>
   <Optional numbered steps if it's a mini-tutorial>
   <Optional "Get the repo / link" line — only if a real URL exists in the source>
   🔔 {subscribe_cta}

   **Instagram Description**
   <Short title in plain text>
   <1–2 line hook with 1 emoji>
   <Bullet/arrow steps if relevant>
   <"Comment X and I'll DM you the link 🔗" — only if a giveaway is implied>
   Follow for more.

   **TikTok Caption**
   <Punchy 1-line hook + 3–6 relevant hashtags, strongest keyword first>
   ```

   Do **not** include the community link in shorts.

5. **Write back to Notion**: append (or replace) a `### 📝 Descriptions` block beneath the `## Short N — <title>` heading (or at the bottom of the standalone short page). Do not stack duplicates.

6. **Confirm** the same way as long-form.

## Writing style rules (apply to ALL generated copy)

- **NEVER use em-dashes (`—`) or en-dashes (`–`) as sentence separators.** Strict, non-negotiable — they are a strong AI tell that hurts authenticity and reach.
  - Replace `—`/`–` with periods, commas, parentheses, or colons depending on rhythm.
  - In chapter titles and labels, use `:` or just a space (e.g. `What actually happened: the real target`).
  - Applies to body, titles, IG/TikTok captions, chapter titles, resource labels. Does NOT apply to URLs.
  - **Final-pass sweep**: before writing back to Notion, search the generated copy for `—` and `–` and replace every occurrence.

## SEO principles (both formats)

- **Front-load keywords** in the title and first sentence.
- **Weave naturally, do not stuff.**
- **Specific over generic** — "Claude Code skills" beats "AI tools".
- **Match search intent** — tutorial vs news reaction.
- **One question per description** boosts comment engagement.

## Searchability checklist (before writing back)

- [ ] Title and first 100 chars both contain the strongest keyword.
- [ ] 5–8 distinct keywords (long-form) or 3–5 (short).
- [ ] No keyword repeated more than 3 times.
- [ ] All supporting URLs included in `🔗 Resources mentioned` (long-form).
- [ ] Chapter list present with placeholder timestamps (`0:00` first, `X:XX` rest) — long-form.
- [ ] Community line is the very first line — long-form only, and only if `community_link` is set.
- [ ] Zero em-dashes (`—`) or en-dashes (`–`) anywhere in the copy.
