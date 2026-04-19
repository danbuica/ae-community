// ─────────────────────────────────────────────────────────────
//  Brand Bounce Onboarding — Complete Form Types
// ─────────────────────────────────────────────────────────────

export type CommunicationChannel = "email" | "slack" | "whatsapp" | "phone";

export type GenderSplit = "all" | "mostly-male" | "mostly-female" | "mixed";

export type ApprovalWorkflow =
  | "no-approval"
  | "approve-all"
  | "approve-first-batch"
  | "weekly-review";

export type AdBudget =
  | "no-ads"
  | "under-500"
  | "500-2k"
  | "2k-5k"
  | "5k-10k"
  | "10k-plus";

export type Platform =
  | "instagram"
  | "tiktok"
  | "facebook"
  | "linkedin"
  | "x"
  | "youtube"
  | "pinterest"
  | "threads";

export type ContentFormat =
  | "video"
  | "image"
  | "carousel"
  | "reels"
  | "stories"
  | "text";

export type KPI =
  | "follower-growth"
  | "engagement-rate"
  | "website-traffic"
  | "lead-gen"
  | "sales"
  | "brand-awareness";

export type BrandArchetype =
  | "innovator"
  | "creator"
  | "caregiver"
  | "explorer"
  | "rebel"
  | "sage"
  | "hero"
  | "jester"
  | "everyman"
  | "lover"
  | "ruler"
  | "magician";

// ── Step 1: Client Contact ──────────────────────────────────
export interface ClientContactData {
  contactName: string;
  email: string;
  phone: string;
  role: string;
  communicationChannel: CommunicationChannel | "";
  websiteUrl: string;
  // Populated from website scrape
  scrapedData?: ScrapedWebsiteData;
}

export interface ScrapedWebsiteData {
  businessName?: string;
  description?: string;
  keywords?: string[];
  socialLinks?: Partial<Record<Platform, string>>;
  colors?: string[];
}

// ── Step 2: Business Overview ───────────────────────────────
export interface BusinessOverviewData {
  businessName: string;
  industry: string;
  elevatorPitch: string;
  productsServices: string[];
  competitors: string[];
  uniqueSellingProposition: string;
}

// ── Step 3: Brand Identity ──────────────────────────────────
export interface BrandColor {
  hex: string;
  name: string;
  role: "primary" | "secondary" | "accent" | "neutral" | "other";
}

export interface BrandIdentityData {
  logoUrl: string;          // path returned by /api/upload
  logoFile?: File;          // transient, not saved to JSON
  brandColors: BrandColor[];
  archetypes: BrandArchetype[];
  toneKeywords: string[];
  brandVoiceDescription: string;
  guidelinesUrl: string;    // path to uploaded PDF
}

// ── Step 4: Target Audience ─────────────────────────────────
export interface TargetAudienceData {
  audienceDescription: string;
  ageMin: number;
  ageMax: number;

  locations: string[];
  interests: string[];
  painPoints: string;
}

// ── Step 5: Content Strategy ────────────────────────────────
export interface PlatformFrequency {
  platform: Platform;
  postsPerWeek: number;
}

export interface HashtagGroup {
  pillar: string;
  hashtags: string[];
}

export interface ExampleContent {
  id: string;
  url: string;
  note: string;
}

export interface ContentStrategyData {
  platforms: Platform[];
  platformFrequencies: PlatformFrequency[];
  contentPillars: string[];
  contentFormatOrder: ContentFormat[];
  preferredPostingTimes: Record<Platform, string[]>;
  hashtagGroups: HashtagGroup[];
  topicsToAvoid: string[];
  exampleContent: ExampleContent[];
}

// ── Step 6: Goals & Budget ──────────────────────────────────
export interface KeyDate {
  id: string;
  date: string;           // ISO date string
  eventName: string;
}

export interface SocialHandle {
  platform: Platform;
  handle: string;
}

export interface GoalsBudgetData {
  kpis: KPI[];
  adBudget: AdBudget | "";
  keyDates: KeyDate[];
  approvalWorkflow: ApprovalWorkflow | "";
  socialHandles: SocialHandle[];
}

// ── Full Form Data ──────────────────────────────────────────
export interface OnboardingFormData {
  clientContact: ClientContactData;
  businessOverview: BusinessOverviewData;
  brandIdentity: BrandIdentityData;
  targetAudience: TargetAudienceData;
  contentStrategy: ContentStrategyData;
  goalsBudget: GoalsBudgetData;
}

// ── Wizard State ─────────────────────────────────────────────
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface WizardStepMeta {
  step: WizardStep;
  title: string;
  description: string;
  icon: string;
}

// ── AI Suggestion Types ──────────────────────────────────────
export type AISuggestionType =
  | "competitors"
  | "elevator-pitch"
  | "content-pillars"
  | "audience-description"
  | "hashtags"
  | "posting-frequency"
  | "brand-voice"
  | "logo-colors"
  | "posting-times";

export interface AIChipSuggestion {
  label: string;
  selected: boolean;
}

export interface AIContentPillarSuggestion {
  name: string;
  description: string;
}

export interface AIPostingFrequency {
  platform: Platform;
  postsPerWeek: number;
  reasoning: string;
}

export interface AILogoColor {
  hex: string;
  name: string;
  role: "primary" | "secondary" | "accent";
}

export interface AIPostingTime {
  platform: Platform;
  times: { day: string; time: string }[];
}

// ── Submission ───────────────────────────────────────────────
export interface OnboardingSubmission {
  id: string;
  submittedAt: string;
  data: OnboardingFormData;
}
