# Motion Animations Generator

Create high-quality, code-based motion animations (HTML/CSS/JS) that match your brand colors and typography, then optionally export them as transparent video for a video editor.

## Instructions

The user describes the animation they want as `$ARGUMENTS` (e.g., "a flowing data pipeline", "an animated revenue counter"). If nothing is given, ask what the animation should show and how it should move.

### 0. Load config (always first)

- Read `config.json`. If it does not exist, tell the user to run `/configure` first and stop.
- Use `brand.palette` (colors), `brand.fonts` (typography), `brand.vibe`, and `motion` (output dir + default width/height/fps/duration).

### 1. Analyze the request

- Clarify the subject, the desired motion behavior (flowing data, rotating elements, infinite loop, counter, reveal), and whether the background should be **dark** or **transparent**.
  - **Dark** background → for standalone clips / backgrounds.
  - **Transparent** background → for overlaying on video footage in an editor.
- Pick a short descriptive name for the animation (e.g. `data-flow`, `revenue-counter`, `hero-graphic`).

### 1.5 Logo selection (link tool logos, same source as `/thumbnail-generator`)

Before building, scan the request for any apps/tools mentioned (e.g. "a data flow from n8n into OpenAI"):

1. Look in `motion.logos_dir` (default `resources/app-logos/`) for matching PNGs (e.g. `n8n-logo.png`, `openai-logo.png`). This is the **same logo folder** the thumbnail agent uses.
2. For each match, embed the logo as a real asset in the animation (an `<img>` or CSS `background-image`), not a drawn approximation. Reference it with a **relative path from the animation's `index.html`**: `../../resources/app-logos/<tool>-logo.png` (the animation lives at `<motion.output_dir>/<animation-name>/`, two levels under the group root).
3. If a tool is mentioned but no logo file exists, tell the user which logo to drop into `resources/app-logos/`, then either proceed with a styled text/placeholder node or wait for them to add it.
4. Animate the logos like any other element (float, pulse, travel along a connection line, scale-in reveal).
5. **Transparent-background note**: keep logo PNGs as-is (don't add glows/shadows behind them). **Dark-background note**: a subtle glassmorphism panel behind a logo is fine.

### 2. Create the directory and files

- Create `<motion.output_dir>/<animation-name>/` in the group folder (default `motion-animations/<animation-name>/`).
- Inside it create: `index.html` (structure), `style.css` (styles + keyframes), and optionally `script.js` (complex logic).
- For perfect loop timing and clean exports, prefer **GSAP** (`gsap.globalTimeline`) — the export script controls its timeline frame-by-frame.

### 3. Apply brand aesthetics (from config)

- **Background**: deep dark mode using `palette.background`, OR `transparent` for overlays.
- **Size & resolution**: CRITICAL for transparent overlays — design close to full-screen resolution (most of a `motion.default_width`×`motion.default_height` viewport). Do not center a small element in the middle; scale elements so they look impactful as a full-screen overlay.
- **Accents**: use `palette.accent_1` and `palette.accent_2` for moving elements, borders, and active states.
- **Text**: `palette.text_primary` / `palette.text_secondary` for readable contrast.
- **Typography**: `brand.fonts.heading` for headings, `brand.fonts.body` for body/code (load via Google Fonts).
- **Vibe**: `brand.vibe`.
- **Dark backgrounds**: glassmorphism, neon glows (`box-shadow`, `text-shadow`), luminous effects are fine.
- **Transparent backgrounds**: NEVER use glows or shadows — they bleed into the alpha channel and look terrible composited. Use bold outlines/strokes, gradient fills, and high-contrast borders instead.

### 4. Implement the animation

- Prefer pure CSS `@keyframes` (or GSAP) for performance.
- Use smooth easing (`cubic-bezier`), staggered delays, and infinite/forwards-fill behavior for a fluid, premium feel.
- Write JS in `script.js` only when you need complex DOM manipulation or precise timing.

### 5. Export to video (optional)

If the user wants a transparent video file for Premiere / Final Cut:

1. Ensure `ffmpeg` is installed (`brew install ffmpeg` on Mac).
2. From `scripts/motion/`, run `npm install` (first time only — installs Puppeteer).
3. Export:
   ```bash
   cd scripts/motion && npm run export <animation-name> [width] [height] [duration]
   ```
   Defaults come from `config.json` `motion` if you omit width/height/duration. Output is an Apple ProRes 4444 `export-transparent.mov` in the animation's folder.
4. Quick visual QA without a full export:
   ```bash
   cd scripts/motion && npm run screenshot <animation-name> [seconds]
   ```

### 6. Finalize

- Verify the layout and animation render correctly.
- Tell the user the files were created and briefly describe the motion.
- Point them to `<motion.output_dir>/<animation-name>/index.html` to preview, or the `.mov` if exported.
