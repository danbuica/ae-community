import { z } from "zod";

// ─────────────────────────────────────────────────────────────
//  Step 1: Client Contact
// ─────────────────────────────────────────────────────────────
export const clientContactSchema = z.object({
  contactName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  role: z.string().min(1, "Please enter your role or title"),
  communicationChannel: z.enum(["email", "slack", "whatsapp", "phone"]).or(z.literal("")),
  websiteUrl: z
    .string()
    .url("Please enter a valid URL (include https://)")
    .or(z.literal("")),
  scrapedData: z.any().optional(),
});

// ─────────────────────────────────────────────────────────────
//  Step 2: Business Overview
// ─────────────────────────────────────────────────────────────
export const businessOverviewSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Please select or enter an industry"),
  elevatorPitch: z
    .string()
    .min(20, "Tell us a bit more — at least 20 characters")
    .max(500, "Keep it under 500 characters"),
  productsServices: z
    .array(z.string())
    .min(1, "Add at least one product or service"),
  competitors: z.array(z.string()).default([]),
  uniqueSellingProposition: z
    .string()
    .min(10, "Tell us what makes you different — at least 10 characters"),
});

// ─────────────────────────────────────────────────────────────
//  Step 3: Brand Identity
// ─────────────────────────────────────────────────────────────
export const brandColorSchema = z.object({
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  name: z.string().min(1),
  role: z.enum(["primary", "secondary", "accent", "neutral", "other"]),
});

export const brandIdentitySchema = z.object({
  logoUrl: z.string().optional().or(z.literal("")),
  brandColors: z
    .array(brandColorSchema)
    .min(1, "Add at least one brand color")
    .max(5, "Maximum 5 brand colors"),
  archetypes: z
    .array(z.enum(["innovator","creator","caregiver","explorer","rebel","sage","hero","jester","everyman","lover","ruler","magician"]))
    .min(1, "Select at least one brand archetype")
    .max(3, "Select up to 3 archetypes"),
  toneKeywords: z
    .array(z.string())
    .min(2, "Add at least 2 tone keywords"),
  brandVoiceDescription: z.string().min(20, "Describe your brand voice — at least 20 characters"),
  guidelinesUrl: z.string().optional().or(z.literal("")),
});

// ─────────────────────────────────────────────────────────────
//  Step 4: Target Audience
// ─────────────────────────────────────────────────────────────
export const targetAudienceSchema = z.object({
  audienceDescription: z
    .string()
    .min(20, "Describe your audience — at least 20 characters"),
  ageMin: z.number().min(13).max(65),
  ageMax: z.number().min(13).max(65),
  locations: z.array(z.string()).min(1, "Add at least one target location"),
  interests: z.array(z.string()).min(1, "Add at least one interest"),
  painPoints: z.string().min(10, "Describe at least one pain point"),
}).refine((data) => data.ageMax >= data.ageMin, {
  message: "Max age must be greater than or equal to min age",
  path: ["ageMax"],
});

// ─────────────────────────────────────────────────────────────
//  Step 5: Content Strategy
// ─────────────────────────────────────────────────────────────
export const platformFrequencySchema = z.object({
  platform: z.enum(["instagram","tiktok","facebook","linkedin","x","youtube","pinterest","threads"]),
  postsPerWeek: z.number().min(0).max(21),
});

export const hashtagGroupSchema = z.object({
  pillar: z.string(),
  hashtags: z.array(z.string()),
});

export const exampleContentSchema = z.object({
  id: z.string(),
  url: z.string().url("Enter a valid URL").or(z.literal("")),
  note: z.string().optional(),
});

export const contentStrategySchema = z.object({
  platforms: z
    .array(z.enum(["instagram","tiktok","facebook","linkedin","x","youtube","pinterest","threads"]))
    .min(1, "Select at least one platform"),
  platformFrequencies: z.array(platformFrequencySchema),
  contentPillars: z
    .array(z.string())
    .min(3, "Add at least 3 content pillars")
    .max(7, "Maximum 7 content pillars"),
  contentFormatOrder: z.array(
    z.enum(["video","image","carousel","reels","stories","text"])
  ),
  preferredPostingTimes: z.record(z.string(), z.array(z.string())).default({}),
  hashtagGroups: z.array(hashtagGroupSchema).default([]),
  topicsToAvoid: z.array(z.string()).default([]),
  exampleContent: z.array(exampleContentSchema).default([]),
});

// ─────────────────────────────────────────────────────────────
//  Step 6: Goals & Budget
// ─────────────────────────────────────────────────────────────
export const keyDateSchema = z.object({
  id: z.string(),
  date: z.string().min(1, "Select a date"),
  eventName: z.string().min(1, "Enter an event name"),
});

export const socialHandleSchema = z.object({
  platform: z.enum(["instagram","tiktok","facebook","linkedin","x","youtube","pinterest","threads"]),
  handle: z.string(),
});

export const goalsBudgetSchema = z.object({
  kpis: z
    .array(z.enum(["follower-growth","engagement-rate","website-traffic","lead-gen","sales","brand-awareness"]))
    .min(1, "Select at least one KPI"),
  adBudget: z.enum(["no-ads","under-500","500-2k","2k-5k","5k-10k","10k-plus"]).or(z.literal("")),
  keyDates: z.array(keyDateSchema).default([]),
  approvalWorkflow: z.enum(["no-approval","approve-all","approve-first-batch","weekly-review"]).or(z.literal("")),
  socialHandles: z.array(socialHandleSchema).default([]),
});

// ─────────────────────────────────────────────────────────────
//  Full Form Schema
// ─────────────────────────────────────────────────────────────
export const onboardingFormSchema = z.object({
  clientContact: clientContactSchema,
  businessOverview: businessOverviewSchema,
  brandIdentity: brandIdentitySchema,
  targetAudience: targetAudienceSchema,
  contentStrategy: contentStrategySchema,
  goalsBudget: goalsBudgetSchema,
});

export type ClientContactValues = z.infer<typeof clientContactSchema>;
export type BusinessOverviewValues = z.infer<typeof businessOverviewSchema>;
export type BrandIdentityValues = z.infer<typeof brandIdentitySchema>;
export type TargetAudienceValues = z.infer<typeof targetAudienceSchema>;
export type ContentStrategyValues = z.infer<typeof contentStrategySchema>;
export type GoalsBudgetValues = z.infer<typeof goalsBudgetSchema>;
export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

// ─────────────────────────────────────────────────────────────
//  Per-step validation helper
// ─────────────────────────────────────────────────────────────
export const STEP_SCHEMAS = {
  1: clientContactSchema,
  2: businessOverviewSchema,
  3: brandIdentitySchema,
  4: targetAudienceSchema,
  5: contentStrategySchema,
  6: goalsBudgetSchema,
} as const;
