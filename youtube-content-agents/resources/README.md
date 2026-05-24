# Resources

This folder holds your personal thumbnail assets. The files you add here are **gitignored** — they stay on your machine.

## `subject.png` (required for `/thumbnail-generator`)
A clear, well-lit photo of the on-camera person. This is used as the first reference image for every thumbnail.
- Front-facing, good lighting.
- A transparent or simple background works best.
- Save it exactly as `resources/subject.png` (or change `thumbnail.subject_image` in `config.json`).

## `app-logos/` (optional, recommended for tool-specific videos)
PNG logos of the tools/apps you talk about. Name each one `<tool>-logo.png`:
- `n8n-logo.png`
- `openai-logo.png`
- `claude-logo.png`
- …

Both `/thumbnail-generator` and `/motion-animations-generator` scan this folder and pull in any logo whose tool is mentioned:
- **Thumbnails** use the logo as a reference image for the GPT Image 2 render.
- **Motion animations** embed the logo PNG as a real asset (e.g. floating, pulsing, or traveling along a connection line).

Transparent PNGs work best for both.
