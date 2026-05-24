# Thumbnail Style Guide

This is the reference aesthetic for `/thumbnail-generator`. The concrete values
(your colors, fonts, subject, vibe) all live in `config.json` under `brand` and
`thumbnail`. This guide explains how those values are meant to be used so the
output stays consistent across videos. Edit `config.json`, not this file.

## 1. Visual aesthetics
- **Vibe**: pulled from `brand.vibe` (e.g. tech-forward, high-contrast, cinematic, authoritative).
- **Lighting**: a natural studio key light on the subject plus a colored rim light using `palette.accent_1`.
- **Background**:
    - **Base**: `palette.background` (a deep, dark tone reads best behind text).
    - **Texture**: faded, on-topic screenshots / UI / nodes at 10–20% opacity for depth.
    - **Glow**: subtle `accent_1` glows behind the subject and text.

## 2. Color palette
Use the four roles from `brand.palette`:
- **Background** (`palette.background`) — the canvas.
- **Accent 1** (`palette.accent_1`) — cool accent for depth, glows, tech elements, rim light.
- **Accent 2** (`palette.accent_2`) — warm accent for arrows, highlights, urgent text.
- **Text** (`palette.text_primary` / `palette.text_secondary`) — high-contrast, readable.

Pick two accents that contrast (one cool, one warm) so arrows and key words pop.

## 3. Typography & layout
- **Font**: `brand.fonts.heading` — bold, modern, clean, readable at small sizes.
- **Placement**: VARIABLE — rotate between layouts so a channel page doesn't look repetitive:
    - **Split**: text left / subject right.
    - **Center**: subject center / text split top & bottom.
    - **Rule of thirds**: subject on a vertical third, text balancing the opposite side.
    - **Dynamic diagonal**: angled text or subject for a forward, energetic feel.

## 4. Subject & elements
- **Subject**: `resources/subject.png` (a clear, well-lit photo of `brand.subject_name`).
- **Expression**: vary per concept from `thumbnail.expressions`.
- **Clothing**: vary per concept from `thumbnail.clothing_options`.
- **Logos**: optional, recommended for tool-specific videos. Drop PNGs into
  `resources/app-logos/` named `<tool>-logo.png` (e.g. `n8n-logo.png`).
- **Graphics**: high-quality 3D icons, glassmorphism panels, connection lines, glowing arrows.

## 5. Model & output
- **Model**: `thumbnail.model` (default `gpt-image-2`) via `/v1/images/edits`.
- **Size**: `thumbnail.size` (default `1280x720` — native YouTube 16:9, no crop step).
- **Quality**: `thumbnail.quality` (default `high` — best results, slower, ~$0.16/image).
- **Format**: `thumbnail.output_format` (default `png`).

## 6. Prompt template
Compose naturally for a 16:9 frame (no header space needed — there is no crop).

```
A premium YouTube thumbnail. [Composition].
Background is {palette.background} with a faint overlay of [on-topic UI/workflow].
Subject is the first reference image (person) wearing a [clothing from config].
Expression: [expression from config].
IMPORTANT LIGHTING: [thumbnail.subject_lighting_block].
Incorporate the second reference image (App Logo) as a 3D glass element.
Colors: {palette.background}, {palette.accent_1}, {palette.accent_2}.
Text: "[Short Text, max 4 words]" in {brand.fonts.heading}, bold, colored {palette.text_primary}.
Overall vibe is {brand.vibe}. Keep all text and subjects well-balanced within the 16:9 frame.
```

> **CRITICAL — subject rendering**: always include the `subject_lighting_block`
> and a `clothing` choice in every prompt. This is what keeps faces cinematic
> and three-dimensional instead of flat and washed-out.
