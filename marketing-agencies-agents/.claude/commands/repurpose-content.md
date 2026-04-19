# Repurpose Content

Take a blog post (or long-form content) and repurpose it into platform-specific social media content with images.

## Instructions

The user will provide a client name and a content source as `$ARGUMENTS`.

Format: `<client-slug> <--file path | --url URL | --text "content">`

### 1. Read the client data and blog

- Read `data/clients/{slug}/style-guide.md` for brand voice, colors, tone, audience, platforms
- Read the blog content from the provided source (file, URL via `curl`, or inline text)

### 2. Generate platform-specific text content

Using the style guide as your voice reference, rewrite the blog for each platform:

**Instagram Post:**
- Short punchy caption (< 2000 chars), hook first line, CTA at end
- 5-8 relevant hashtags
- Decide what text to overlay on the image (max 8 words — a key stat or hook)

**Instagram Story:**
- Ultra-short hook (1-2 lines)
- CTA: "Swipe up" / "Link in bio" / "Read more"
- Bold image text overlay (max 5 words)

**LinkedIn:**
- Long-form thought leadership (800-1500 chars)
- Hook first line, short paragraphs, end with engagement question
- Max 3 professional hashtags

**Facebook:**
- Conversational caption (300-800 chars)
- Include `[BLOG_LINK]` placeholder
- End with a question

### 3. Craft image prompts

For each image (Instagram post, Instagram story, Facebook), write a detailed generation prompt:

- Use the client's exact brand color hex codes
- Specify the aspect ratio (1080×1080 for IG post, 1080×1920 for IG story, 1200×630 for Facebook)
- Describe the text overlay, composition, and visual style
- Include these rules: no logos, no brand names, no people's faces, no phone/app UI mockups, no fake buttons or "swipe up" chrome — just the raw image creative
- Make prompts specific to the content and brand, not generic

### 4. Build prompts.json and run the script

Determine the output directory: `data/clients/{slug}/repurposed/{date}-{title-slug}/`

Write a `prompts.json` file to that directory:

```json
{
    "output_dir": "data/clients/{slug}/repurposed/{date}-{title-slug}",
    "text_files": {
        "source.md": "original blog content",
        "instagram-post.md": "# Instagram Post\n\n**Image:** instagram-post.png\n\n## Caption\n...\n\n## Hashtags\n...",
        "instagram-story.md": "# Instagram Story\n\n**Image:** instagram-story.png\n\n## Text\n...\n\n## CTA\n...",
        "linkedin.md": "# LinkedIn Post\n\n...",
        "facebook.md": "# Facebook Post\n\n**Image:** facebook.png\n\n## Caption\n..."
    },
    "images": [
        {
            "filename": "instagram-post.png",
            "prompt": "your detailed prompt..."
        },
        {
            "filename": "instagram-story.png",
            "prompt": "your detailed prompt..."
        },
        {
            "filename": "facebook.png",
            "prompt": "your detailed prompt..."
        }
    ]
}
```

Then run:
```bash
GEMINI_API_KEY=$GEMINI_API_KEY python scripts/repurpose_content.py data/clients/{slug}/repurposed/{date}-{title-slug}/prompts.json
```

### 5. Report back

- Show the generated text for each platform
- Report which images were generated
- Show the output directory path
