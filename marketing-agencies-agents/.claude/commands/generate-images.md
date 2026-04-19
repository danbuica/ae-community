# Generate Instagram Images

Generate branded Instagram post images for a client using their style guide and content plan.

## Instructions

The user will provide a client name as `$ARGUMENTS` (e.g., "ardona"). Optionally a specific plan: "ardona week-2026-03-30.md"

### 1. Read the client data

- Read `data/clients/{slug}/style-guide.md` for brand colors, typography, tone, visual identity
- Read the latest (or specified) content plan from `data/clients/{slug}/content-plans/`
- Extract all Instagram posts from the content plan (look for `### Day — Instagram — Format` headers)

### 2. Craft image prompts

For EACH Instagram post in the content plan, write a detailed image generation prompt. You have full context of the brand — use it.

Each prompt should:
- Specify the exact brand colors by hex code
- Describe the composition, layout, and typography style
- Reference the post's pillar, caption hook, and visual description from the plan
- Request square 1080×1080 format
- Include these rules: no logos, no brand names, no people's faces, no phone/UI mockups, no watermarks — just the raw creative

Write prompts that are specific and vivid. Generic prompts produce generic images.

### 3. Build prompts.json and run the script

Determine the output directory: `data/clients/{slug}/images/{plan-date}/`

Write a `prompts.json` file to that directory:

```json
{
    "output_dir": "data/clients/{slug}/images/{plan-date}",
    "images": [
        {
            "filename": "mon-instagram-pillar-slug.png",
            "prompt": "your detailed prompt here..."
        }
    ]
}
```

Then run:
```bash
GEMINI_API_KEY=$GEMINI_API_KEY python scripts/generate_instagram_images.py data/clients/{slug}/images/{plan-date}/prompts.json
```

### 4. Report back

- Show which images were generated
- Report any failures
- Show the output directory path
