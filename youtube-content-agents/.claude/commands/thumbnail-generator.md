# Thumbnail Generator

Generate a high-quality YouTube thumbnail from a video title using OpenAI GPT Image 2 (`gpt-image-2`). Produces 5 distinct concepts, then renders the chosen one at native 1280×720 (16:9) — no cropping needed.

## Instructions

The user provides a video title as `$ARGUMENTS` (e.g., "Why I Stopped Using Zapier"). If no title is given, ask for one.

### 0. Load config (always first)

- Read `config.json`. If it does not exist, tell the user to run `/configure` first and stop.
- Use the `brand` and `thumbnail` sections for every variable below (palette, fonts, vibe, subject name, clothing options, expressions, lighting block, model/size/quality).
- Confirm `thumbnail.subject_image` exists on disk (default `resources/subject.png`). If it is missing, tell the user to add their photo there (see `/configure` instructions) and stop.
- Read `docs/thumbnail-style-guide.md` for how to apply those values.

### 1. Conceptualize (the "idea phase")

**Goal**: translate the title into a visual hook. Generate **5 distinct concepts**, each built from these variables:

- **Face expression**: pick a DIFFERENT one per concept from `thumbnail.expressions`.
- **Clothing**: vary per concept from `thumbnail.clothing_options` (keep it close to the primary look with minor variation).
- **Subject framing**: `thumbnail.style.subject_framing`.
- **Text on thumbnail**: short, punchy, max 4 words. Must be DIFFERENT from the title. Treatment: `thumbnail.style.text_treatment`.
- **Palette**: use `brand.palette` (background + accent_1 + accent_2 + text).
- **Background**: `thumbnail.style.background`.
- **Composition**: rotate across concepts, drawing from `thumbnail.style.composition_preferences`.
- **Graphics**: draw from `thumbnail.style.graphics` (plus logos when relevant) — whatever fits the concept.
- **Typography**: `brand.fonts.heading`, massive and bold.
- **Mood / vibe**: `thumbnail.style.mood` and `brand.vibe`.
- **Reference notes**: if `thumbnail.style.reference_notes` is set, treat it as a steer on the look the user is going for.

**Output**: present the 5 concepts as a numbered list, each one line, e.g.:
1. **The "V.S." Battle**: split screen, Tool A vs Tool B, subject in the middle looking conflicted. Text: "Cheaper?".
2. **The "Trash Can"**: subject throwing a logo in the trash, accent arrow pointing to the alternative. Text: "I Quit.".
3. …

### 2. User selection

Ask the user to pick one concept (e.g., "Option 2") or suggest a custom idea.

### 3. Logo selection

Before generating, scan the **selected concept** for any apps/tools mentioned:
1. Look in `thumbnail.logos_dir` (default `resources/app-logos/`) for matching PNGs (e.g. `n8n-logo.png`).
2. If a match exists, include its path in the command. Multiple logos are fine.
3. In the prompt, refer to images by order: the **first** image is always the subject; subsequent images are logos.

### 4. Image generation (the "creation phase")

Build the prompt for a natural 16:9 frame (no header space — there is no crop step).

**Prompt construction** (substitute config values for the bracketed/braced parts):

> A premium YouTube thumbnail. [Composition detail from `thumbnail.style.composition_preferences`]. Mood is {thumbnail.style.mood}, vibe is {brand.vibe}. Background: {thumbnail.style.background} ({palette.background}).
>
> Subject is the first reference image (person), framed {thumbnail.style.subject_framing}, wearing a [clothing from `thumbnail.clothing_options`]. Expression: [chosen expression]. IMPORTANT LIGHTING: {thumbnail.subject_lighting_block — use `palette.accent_1` as the rim-light color}.
>
> Incorporate the second reference image (App Logo) as a 3D glass element. Use graphics in the style of {thumbnail.style.graphics}. Colors: {palette.background}, {palette.accent_1}, {palette.accent_2}. Text: "[Short Text]" in {brand.fonts.heading}, {thumbnail.style.text_treatment}, colored {palette.text_primary}. Keep all text and subjects well-balanced within the 16:9 frame.

> **CRITICAL**: always include the lighting block AND a clothing choice in every prompt — this is what keeps the face cinematic instead of flat.

**Run the helper script** (it reads `OPENAI_API_KEY` from `.env`; pass config values via env vars):

```bash
THUMBNAIL_OUTPUT_DIR="<thumbnail.output_dir>" \
THUMBNAIL_MODEL="<thumbnail.model>" \
THUMBNAIL_SIZE="<thumbnail.size>" \
THUMBNAIL_QUALITY="<thumbnail.quality>" \
THUMBNAIL_FORMAT="<thumbnail.output_format>" \
python3 scripts/generate_thumbnail.py "<PROMPT>" "<TITLE_SLUG>" "<OUTPUT_FILENAME>" "<thumbnail.subject_image>" "<thumbnail.logos_dir>/<LOGO_1>.png" "<thumbnail.logos_dir>/<LOGO_2>.png"
```

- `<TITLE_SLUG>`: kebab-case slug of the title (e.g. `why-i-stopped-using-zapier`). Becomes the subfolder under the output dir.
- `<OUTPUT_FILENAME>`: file name including `.png`. Use the slug as the base; for variants append a suffix (e.g. `..._v2.png`, `..._optA.png`).
- The first image path is always the subject; logo paths are optional and only included when the concept calls for them.

### 5. Final output

- The image saves to `<thumbnail.output_dir>/<title-slug>/<filename>`.
- Show the image to the user and report the path.
- Offer to generate variants (different expression, composition, or text) on request.
