# Generate Ad Creatives

Generate multiple ad copy variations with images for a client's offer.

## Instructions

The user will provide a client name and an offer description as `$ARGUMENTS`.

Format: `<client-slug> --offer "description"` or `<client-slug> --file path/to/offer.txt`

### 1. Read the client data and offer

- Read `data/clients/{slug}/style-guide.md` for brand voice, colors, tone, audience
- Read the offer from the provided source

### 2. Generate 5 ad copy variations

Using the style guide as your voice reference, write ad copy for 5 different psychological angles:

| # | Angle | Strategy |
|---|-------|----------|
| 1 | Pain Point | Lead with the problem the audience faces |
| 2 | Social Proof | Lead with results, numbers, credibility |
| 3 | Curiosity | Tease the benefit without revealing how |
| 4 | Direct Offer | Straight value proposition |
| 5 | Story Hook | Open with a mini narrative |

For each variation, write:
- **Headline** (< 40 chars) — the hook above the image
- **Primary text** — 2-3 paragraphs of ad body copy in the brand voice, ending with CTA
- **CTA button** — one of: Learn More, Sign Up, Book Now, Get Started, Download, Shop Now, Contact Us
- **Image headline** (max 6 words) — bold text ON the image
- **Image subtext** (max 10 words) — smaller text below the headline on the image

### 3. Craft image prompts

For each of the 5 variations, write TWO image prompts:

**Feed ad (1080×1080):** Square format for Instagram/Facebook feed. Bold headline text, brand colors, clean design.

**Story ad (1080×1920):** Vertical format for stories. Larger, more dramatic text. Same brand colors.

Each prompt should:
- Use the client's exact brand color hex codes
- Specify the text overlay (image headline + subtext)
- Describe composition and visual style matching the brand
- Include: no logos, no brand names, no people's faces, no phone/UI mockups, no fake buttons — raw creative only

### 4. Build prompts.json and run the script

Determine the output directory: `data/clients/{slug}/ad-creatives/{date}-{offer-slug}/`

Write a `prompts.json` file to that directory:

```json
{
    "output_dir": "data/clients/{slug}/ad-creatives/{date}-{offer-slug}",
    "brief": "# Ad Creative Brief\n\n> Generated: ...\n\n## Offer\n...\n\n## Variations Overview\n\n| Angle | Headline | CTA |\n...",
    "variations": [
        {
            "folder": "variation-1-pain-point",
            "copy_md": "# Ad Variation: Pain Point\n\n## Headline\n...\n\n## Primary Text\n...\n\n## CTA Button\n...",
            "images": [
                {
                    "filename": "feed-ad.png",
                    "prompt": "your detailed prompt..."
                },
                {
                    "filename": "story-ad.png",
                    "prompt": "your detailed prompt..."
                }
            ]
        }
    ]
}
```

Then run:
```bash
GEMINI_API_KEY=$GEMINI_API_KEY python scripts/generate_ad_creatives.py data/clients/{slug}/ad-creatives/{date}-{offer-slug}/prompts.json
```

### 5. Report back

- Show the headline + CTA for each variation
- Report how many images were generated (should be 10: 5 × 2)
- Show the output directory path
- Suggest which 2-3 variations might work best for A/B testing and why
