// ─────────────────────────────────────────────────────────────
//  Prefill prompts — one per step transition.
//  Each returns a prompt that asks Gemini to infer ALL fields
//  for the next step based on everything collected so far.
// ─────────────────────────────────────────────────────────────

import type { ScrapedWebsiteData } from "@/types/onboarding";

/**
 * Step 1 → Step 2: Deduce business overview from scraped website data.
 */
export function prefillStep2Prompt(scraped: ScrapedWebsiteData): string {
  return `You are an expert business analyst. A marketing agency is onboarding a new client.
We scraped their website and got this data:

Business name: ${scraped.businessName || "unknown"}
Meta description: ${scraped.description || "none"}
Keywords: ${scraped.keywords?.join(", ") || "none"}
Social handles found: ${scraped.socialLinks ? Object.entries(scraped.socialLinks).map(([p, h]) => `${p}: @${h}`).join(", ") : "none"}

Based ONLY on this information, deduce the following about this business.
Be specific and accurate — do NOT make up information that isn't supported by the scraped data.
If you cannot determine something, make your best educated guess based on the business name and description.

Return a JSON object with these exact fields:
{
  "industry": "the most specific industry category, e.g. 'Fitness & Wellness', 'SaaS', 'Fashion & Apparel', 'Food & Beverage'",
  "elevatorPitch": "a compelling 2-3 sentence elevator pitch written in first person plural (We...) based on what this business actually does",
  "productsServices": ["product or service 1", "product or service 2", ...],
  "uniqueSellingProposition": "what makes them different based on the description",
  "competitors": ["competitor 1", "competitor 2", ...]
}

Keep the elevator pitch concise and authentic. List 3-6 products/services and 4-6 competitors.`;
}

/**
 * Step 2 → Step 3: Suggest brand identity from business overview.
 */
export function prefillStep3Prompt(ctx: {
  businessName: string;
  industry: string;
  elevatorPitch: string;
  productsServices: string[];
  uniqueSellingProposition: string;
  scrapedDescription?: string;
}): string {
  return `You are a brand strategist at a top marketing agency.
Based on this business profile, suggest a brand identity.

Business: "${ctx.businessName}" in ${ctx.industry}
Pitch: ${ctx.elevatorPitch}
Products/Services: ${ctx.productsServices.join(", ")}
USP: ${ctx.uniqueSellingProposition}
${ctx.scrapedDescription ? `Website description: ${ctx.scrapedDescription}` : ""}

Return a JSON object:
{
  "archetypes": ["archetype1", "archetype2"],
  "toneKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "brandVoiceDescription": "4-6 sentence brand voice guide with specific do's and don'ts"
}

For archetypes, choose exactly 2 from this list ONLY: creator, explorer, hero, magician, outlaw, lover, caregiver, ruler, jester, sage, innocent, everyman.
For tone keywords, pick 4-6 words like: bold, witty, empathetic, authoritative, playful, warm, edgy, luxurious, minimal, conversational, etc.
The brand voice description should be practical and actionable for social media copywriters.`;
}

/**
 * Step 3 → Step 4: Suggest target audience from business + brand identity.
 */
export function prefillStep4Prompt(ctx: {
  businessName: string;
  industry: string;
  elevatorPitch: string;
  productsServices: string[];
  archetypes: string[];
  toneKeywords: string[];
  scrapedDescription?: string;
}): string {
  return `You are an audience research expert at a marketing agency.
Based on this brand profile, define their ideal target audience.

Business: "${ctx.businessName}" in ${ctx.industry}
Pitch: ${ctx.elevatorPitch}
Products: ${ctx.productsServices.join(", ")}
Brand personality: ${ctx.archetypes.join(", ")}
Tone: ${ctx.toneKeywords.join(", ")}
${ctx.scrapedDescription ? `Website: ${ctx.scrapedDescription}` : ""}

Return a JSON object:
{
  "audienceDescription": "a vivid 3-4 sentence persona description written like a marketing brief",
  "ageMin": number (13-65),
  "ageMax": number (13-65),
  "locations": ["location1", "location2", "location3"],
  "interests": ["interest1", "interest2", "interest3", "interest4", "interest5"],
  "painPoints": "2-3 sentences describing the key problems this audience faces that the brand solves"
}

Be specific and realistic. Locations should be 2-4 cities or countries. Interests should be 4-6 relevant hobbies/topics.`;
}

/**
 * Step 4 → Step 5: Suggest content strategy from all prior data.
 */
export function prefillStep5Prompt(ctx: {
  businessName: string;
  industry: string;
  productsServices: string[];
  competitors: string[];
  archetypes: string[];
  toneKeywords: string[];
  audienceDescription: string;
  locations: string[];
  scrapedSocialLinks?: Partial<Record<string, string>>;
}): string {
  // Deduce platforms from scraped social links
  const detectedPlatforms = ctx.scrapedSocialLinks
    ? Object.keys(ctx.scrapedSocialLinks)
    : [];

  return `You are a social media strategist at a leading marketing agency.
Based on this complete brand profile, create a content strategy.

Business: "${ctx.businessName}" in ${ctx.industry}
Products: ${ctx.productsServices.join(", ")}
Competitors: ${ctx.competitors.join(", ")}
Brand personality: ${ctx.archetypes.join(", ")}
Tone: ${ctx.toneKeywords.join(", ")}
Audience: ${ctx.audienceDescription}
Audience locations: ${ctx.locations.join(", ")}
${detectedPlatforms.length > 0 ? `Platforms detected from website: ${detectedPlatforms.join(", ")}` : ""}

Return a JSON object:
{
  "platforms": ["platform1", "platform2", ...],
  "platformFrequencies": [{"platform": "platform_id", "postsPerWeek": number}, ...],
  "contentPillars": ["pillar1", "pillar2", "pillar3", "pillar4", "pillar5"],
  "hashtagGroups": [{"pillar": "Pillar Name", "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]}, ...]
}

Platform IDs must be from: instagram, tiktok, facebook, linkedin, x, youtube, pinterest, threads.
Choose 2-4 platforms that make sense for this brand and audience.
Content pillars are recurring THEMES for social media posts — simple, recognizable categories that the audience cares about.
Good examples for different industries:
- Fitness brand: "Workout Tips", "Client Transformations", "Nutrition Advice", "Behind the Scenes", "Motivational Quotes"
- SaaS company: "Product Updates", "Customer Stories", "Industry Insights", "Tips & Tutorials", "Team Culture"
- Restaurant: "Menu Highlights", "Chef Stories", "Food Prep BTS", "Customer Reviews", "Local Events"
- AI agency: "AI Use Cases", "Client Results", "Industry News", "How-To Guides", "Team & Culture"
DO NOT use abstract or corporate jargon. Use plain, recognizable names that a social media manager would immediately understand.
Suggest 4-6 content pillars.
Group 4-6 hashtags per pillar. Do NOT include the # symbol.
Posting frequency should be realistic (2-7 posts/week depending on platform).`;
}

/**
 * Step 5 → Step 6: Suggest goals & budget from all prior data.
 */
export function prefillStep6Prompt(ctx: {
  businessName: string;
  industry: string;
  platforms: string[];
  audienceDescription: string;
  locations: string[];
  contentPillars: string[];
}): string {
  return `You are a marketing strategist.
Based on this brand's profile, recommend goals and operational settings.

Business: "${ctx.businessName}" in ${ctx.industry}
Active platforms: ${ctx.platforms.join(", ")}
Audience: ${ctx.audienceDescription}
Locations: ${ctx.locations.join(", ")}
Content pillars: ${ctx.contentPillars.join(", ")}

Return a JSON object:
{
  "kpis": ["kpi1", "kpi2", "kpi3"],
  "adBudget": "budget_tier",
  "approvalWorkflow": "workflow_type"
}

KPI IDs must be EXACTLY from this list: follower-growth, engagement-rate, website-traffic, lead-gen, sales, brand-awareness.
Pick 2-4 most relevant for this brand. Use the exact IDs above — no other values are allowed.

Budget tier must be one of: no-ads, under-500, 500-2k, 2k-5k, 5k-10k, 10k-plus.
Make a reasonable estimate based on the business type and industry.

Approval workflow must be one of: no-approval, approve-all, approve-first-batch, weekly-review.
Recommend what works best for this type of client.`;
}
