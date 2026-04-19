// ─────────────────────────────────────────────────────────────
//  Prompt templates for all 9 Gemini AI touchpoints
//  Each function returns a ready-to-send prompt string.
// ─────────────────────────────────────────────────────────────

export function competitorsPrompt(ctx: {
  industry: string;
  businessName: string;
  productsServices: string[];
}): string {
  return `You are a market research expert.
Given a ${ctx.industry} business called "${ctx.businessName}" that offers: ${ctx.productsServices.join(", ")},
suggest 6-8 well-known competitors or similar brands they compete with.

Return a JSON array of strings (brand/company names only):
["Competitor 1", "Competitor 2", ...]`;
}

export function elevatorPitchPrompt(ctx: {
  businessName: string;
  industry: string;
  productsServices: string[];
  uniqueSellingProposition: string;
}): string {
  return `You are a copywriter specialising in brand storytelling.
Write a compelling 2-3 sentence elevator pitch for "${ctx.businessName}", a ${ctx.industry} brand.
They offer: ${ctx.productsServices.join(", ")}.
Their unique angle: ${ctx.uniqueSellingProposition || "not specified"}.

Be concise, engaging, and avoid jargon. Write in second person ("We...").
Return a JSON object: { "pitch": "..." }`;
}

export function contentPillarsPrompt(ctx: {
  industry: string;
  businessName: string;
  productsServices: string[];
  targetAudience: string;
  archetypes: string[];
}): string {
  return `You are a social media strategist.
Suggest 5-7 content pillars for a ${ctx.industry} brand called "${ctx.businessName}".
Products/services: ${ctx.productsServices.join(", ")}.
Target audience: ${ctx.targetAudience || "general consumers"}.
Brand personality: ${ctx.archetypes.join(", ") || "professional"}.

Return a JSON array of objects:
[{ "name": "Pillar Name", "description": "One sentence description of the content pillar" }, ...]`;
}

export function audienceDescriptionPrompt(ctx: {
  industry: string;
  businessName: string;
  ageMin: number;
  ageMax: number;
  locations: string[];
  interests: string[];
  painPoints: string;
}): string {
  return `You are a brand strategist.
Write a detailed 3-4 sentence target audience persona for "${ctx.businessName}" (${ctx.industry} industry).
Demographics: aged ${ctx.ageMin}-${ctx.ageMax}${ctx.ageMax >= 65 ? "+" : ""}.
Locations: ${ctx.locations.join(", ") || "anywhere"}.
Interests: ${ctx.interests.join(", ") || "not specified"}.
Pain points: ${ctx.painPoints || "not specified"}.

Write in the style of a marketing brief. Be specific and vivid.
Return a JSON object: { "description": "..." }`;
}

export function hashtagsPrompt(ctx: {
  industry: string;
  platforms: string[];
  contentPillars: string[];
  competitors: string[];
  targetAudience: string;
}): string {
  return `You are a social media expert specialising in hashtag strategy.
Suggest 15-25 hashtags for a ${ctx.industry} brand active on: ${ctx.platforms.join(", ")}.
Content pillars: ${ctx.contentPillars.join(", ") || "general content"}.
Target audience: ${ctx.targetAudience || "general"}.

Group hashtags by content pillar. Mix high-volume (#1M+ posts) and niche (#10K-100K) tags.
Return a JSON array:
[{ "pillar": "Pillar Name", "hashtags": ["tag1", "tag2", ...] }, ...]
Do NOT include the # symbol in the hashtag strings.`;
}

export function postingFrequencyPrompt(ctx: {
  platforms: string[];
  industry: string;
  adBudget: string;
}): string {
  return `You are a social media strategist with expertise in content planning.
Based on 2025-2026 best practices, recommend weekly posting frequency for a ${ctx.industry} brand with a ${ctx.adBudget} monthly ad budget.
Platforms: ${ctx.platforms.join(", ")}.

Return a JSON array:
[{ "platform": "platform_id", "postsPerWeek": number, "reasoning": "one sentence explanation" }, ...]
Use these exact platform IDs: instagram, tiktok, facebook, linkedin, x, youtube, pinterest, threads`;
}

export function brandVoicePrompt(ctx: {
  archetypes: string[];
  toneKeywords: string[];
  industry: string;
  targetAudience: string;
}): string {
  return `You are a brand voice expert and copywriter.
Write a brand voice guide paragraph for a brand with these characteristics:
- Personality archetypes: ${ctx.archetypes.join(", ") || "professional"}
- Tone keywords: ${ctx.toneKeywords.join(", ") || "friendly, professional"}
- Industry: ${ctx.industry}
- Target audience: ${ctx.targetAudience || "general consumers"}

Describe how the brand should sound in social media posts. Include 2-3 specific do's and 1-2 don'ts.
Keep it practical and actionable. 4-6 sentences total.
Return a JSON object: { "voiceDescription": "..." }`;
}

export function logoColorsPrompt(imageUrl: string): string {
  return `Analyse this brand logo image at ${imageUrl} and extract the dominant colors.
Identify 2-4 key colors from the logo design.

Return a JSON array:
[{ "hex": "#RRGGBB", "name": "Color Name", "role": "primary|secondary|accent" }, ...]
Use proper hex codes with uppercase letters. Only include colors that are clearly visible in the logo.`;
}

export function postingTimesPrompt(ctx: {
  platforms: string[];
  industry: string;
  locations: string[];
  targetAudience: string;
}): string {
  return `You are a social media analytics expert.
Recommend optimal posting times for a ${ctx.industry} brand targeting: ${ctx.targetAudience || "general consumers"}.
Their audience is primarily in: ${ctx.locations.join(", ") || "worldwide"}.
Active platforms: ${ctx.platforms.join(", ")}.

Based on 2025-2026 platform algorithm and audience behaviour data.
Return a JSON array (limit to 3 best times per platform):
[{ "platform": "platform_id", "times": [{ "day": "Mon", "time": "9:00 AM" }, ...] }, ...]
Use these exact platform IDs: instagram, tiktok, facebook, linkedin, x, youtube, pinterest, threads`;
}
