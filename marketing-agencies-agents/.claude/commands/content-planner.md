# Weekly Content Planner

Generate a full week of content ideas for a client based on their brand style guide.

## Instructions

The user will provide a client name as `$ARGUMENTS` (e.g., "ardona").

### 1. Find the client's files

- Look in `data/clients/` for a folder matching the client name (e.g., `data/clients/ardona/`)
- Read `data/clients/{slug}/onboarding.json` for the raw submission data
- Read `data/clients/{slug}/style-guide.md` for the refined brand voice and strategy
- If no style guide exists, generate one first using the onboarding data (follow the generate-style-guide instructions)
- If no match is found, list available client folders and ask the user to pick one.

### 2. Extract what you need

From the style guide and onboarding JSON, extract:

- **Business name** and industry
- **Content pillars** (the recurring themes)
- **Platforms** and posting frequency per platform (posts/week)
- **Brand voice** — how the brand speaks, do's and don'ts
- **Tone keywords** — the feel of the content
- **Target audience** — who they're talking to, their pain points, interests
- **Hashtag groups** — per-pillar hashtag sets
- **Content format priority** — what types of content they prefer (video, carousel, reels, etc.)

### 3. Generate the content plan

Create a 7-day content calendar (Monday → Sunday) that:

- **Distributes posts across the week** based on the per-platform frequency. If Instagram = 3/week, space them out (e.g., Mon, Wed, Fri). Don't cluster everything on one day.
- **Rotates through ALL content pillars** — every pillar should appear at least once during the week. Don't repeat the same pillar on consecutive days.
- **Matches format to platform** — Reels/Shorts for TikTok and Instagram Reels, long-form for YouTube, carousels for Instagram feed, etc.
- **Writes captions in the brand's voice** — use the tone keywords, follow the do's/don'ts from the voice guide. Captions should be ready-to-post, not placeholder text.
- **Includes hashtags** — pull from the relevant pillar's hashtag group. Add 3-5 per post for TikTok/Instagram, fewer for LinkedIn/YouTube.
- **Writes an image/visual description** — describe what the visual should look like so a designer or AI image tool can create it. Be specific: colors, composition, text overlays, style.

For each post, include:
```
### [Day] — [Platform] — [Format]
**Pillar:** [Content Pillar Name]

**Caption:**
[Full ready-to-post caption including CTA and line breaks]

**Hashtags:** #tag1 #tag2 #tag3 #tag4 #tag5

**Visual Description:**
[Detailed description of the image/video: what it shows, brand colors to use, text overlays, mood/style, aspect ratio]
```

### 4. Add a weekly overview at the top

Before the individual posts, add a summary table:

```
| Day | Platform | Pillar | Format | Hook (first line) |
|-----|----------|--------|--------|--------------------|
| Mon | Instagram | ... | Carousel | "..." |
| ... | ... | ... | ... | "..." |
```

### 5. Save the file

Save the content plan to `data/clients/{slug}/content-plans/week-{YYYY-MM-DD}.md` where:
- `{slug}` is the client's folder name
- `{YYYY-MM-DD}` is the Monday of the week being planned (use the upcoming Monday from today's date)

Create the `content-plans/` subdirectory if it doesn't exist.

### 6. Report back

Tell the user:
- Which client and style guide were used
- How many posts were generated across which platforms
- The file path where the plan was saved
- A 2-3 sentence summary of the week's content theme/focus
