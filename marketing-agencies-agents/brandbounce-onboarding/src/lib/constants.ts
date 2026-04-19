import type {
  BrandArchetype,
  ContentFormat,
  KPI,
  Platform,
  WizardStepMeta,
  WizardStep,
} from "@/types/onboarding";

// ─────────────────────────────────────────────────────────────
//  Wizard Steps
// ─────────────────────────────────────────────────────────────
export const WIZARD_STEPS: WizardStepMeta[] = [
  { step: 1 as WizardStep, title: "Client Contact", description: "Who are we working with?", icon: "User" },
  { step: 2 as WizardStep, title: "Business Overview", description: "What's the brand all about?", icon: "Building2" },
  { step: 3 as WizardStep, title: "Brand Identity", description: "Colors, logo, and personality", icon: "Palette" },
  { step: 4 as WizardStep, title: "Target Audience", description: "Who are we talking to?", icon: "Users" },
  { step: 5 as WizardStep, title: "Content Strategy", description: "Platforms, pillars, and formats", icon: "LayoutGrid" },
  { step: 6 as WizardStep, title: "Goals & Budget", description: "KPIs, budget, and workflow", icon: "Target" },
  { step: 7 as WizardStep, title: "Review & Submit", description: "Final check before we launch", icon: "CheckCircle" },
];

// ─────────────────────────────────────────────────────────────
//  Industries
// ─────────────────────────────────────────────────────────────
export const INDUSTRIES = [
  "Accounting & Finance",
  "Automotive",
  "Beauty & Cosmetics",
  "Clothing & Apparel",
  "Construction & Real Estate",
  "Consulting & Coaching",
  "Creative Agency",
  "E-commerce & Retail",
  "Education & eLearning",
  "Entertainment & Media",
  "Events & Hospitality",
  "Financial Services",
  "Fitness & Wellness",
  "Food & Beverage",
  "Health & Medical",
  "Home & Garden",
  "Interior Design",
  "IT & Software",
  "Law & Legal",
  "Manufacturing",
  "Marketing & Advertising",
  "Non-profit",
  "Personal Branding",
  "Pet & Animal",
  "Photography & Videography",
  "Real Estate",
  "Recruitment & HR",
  "Restaurant & Cafe",
  "SaaS & Technology",
  "Sports & Recreation",
  "Travel & Tourism",
  "Wedding & Events",
  "Other",
];

// ─────────────────────────────────────────────────────────────
//  Brand Archetypes
// ─────────────────────────────────────────────────────────────
export const ARCHETYPES: {
  id: BrandArchetype;
  label: string;
  emoji: string;
  tagline: string;
  description: string;
  color: string;
}[] = [
  {
    id: "innovator",
    label: "Innovator",
    emoji: "💡",
    tagline: "Change the game",
    description: "Pioneering, visionary, forward-thinking. Always pushing boundaries.",
    color: "#7C3AED",
  },
  {
    id: "creator",
    label: "Creator",
    emoji: "🎨",
    tagline: "Build something beautiful",
    description: "Imaginative, expressive, artistic. Turns ideas into reality.",
    color: "#EC4899",
  },
  {
    id: "caregiver",
    label: "Caregiver",
    emoji: "🤝",
    tagline: "Here for you",
    description: "Nurturing, empathetic, supportive. Puts others first.",
    color: "#10B981",
  },
  {
    id: "explorer",
    label: "Explorer",
    emoji: "🧭",
    tagline: "Discover what's possible",
    description: "Adventurous, curious, free-spirited. Always seeking new experiences.",
    color: "#F59E0B",
  },
  {
    id: "rebel",
    label: "Rebel",
    emoji: "⚡",
    tagline: "Break the rules",
    description: "Bold, disruptive, unconventional. Challenges the status quo.",
    color: "#F43F5E",
  },
  {
    id: "sage",
    label: "Sage",
    emoji: "📚",
    tagline: "Wisdom and truth",
    description: "Knowledgeable, trusted, analytical. A guide and expert.",
    color: "#3B82F6",
  },
  {
    id: "hero",
    label: "Hero",
    emoji: "🏆",
    tagline: "Make a difference",
    description: "Courageous, determined, inspiring. Overcomes challenges.",
    color: "#EF4444",
  },
  {
    id: "jester",
    label: "Jester",
    emoji: "😄",
    tagline: "Enjoy the journey",
    description: "Playful, fun, humorous. Brings joy and lightness.",
    color: "#F97316",
  },
  {
    id: "everyman",
    label: "Everyman",
    emoji: "👋",
    tagline: "Just like you",
    description: "Relatable, authentic, down-to-earth. Belongs and connects.",
    color: "#6B7280",
  },
  {
    id: "lover",
    label: "Lover",
    emoji: "💝",
    tagline: "Pure passion",
    description: "Romantic, intimate, indulgent. Creates deep connections.",
    color: "#BE185D",
  },
  {
    id: "ruler",
    label: "Ruler",
    emoji: "👑",
    tagline: "Lead with authority",
    description: "Commanding, premium, prestigious. Sets the standard.",
    color: "#92400E",
  },
  {
    id: "magician",
    label: "Magician",
    emoji: "✨",
    tagline: "Make the impossible happen",
    description: "Transformative, mystical, visionary. Turns dreams into reality.",
    color: "#5B21B6",
  },
];

// ─────────────────────────────────────────────────────────────
//  Platforms
// ─────────────────────────────────────────────────────────────
export const PLATFORMS: {
  id: Platform;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  { id: "instagram", label: "Instagram", color: "#E1306C", bgColor: "#FDF2F8" },
  { id: "tiktok", label: "TikTok", color: "#010101", bgColor: "#F9FAFB" },
  { id: "facebook", label: "Facebook", color: "#1877F2", bgColor: "#EFF6FF" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2", bgColor: "#EFF6FF" },
  { id: "x", label: "X (Twitter)", color: "#000000", bgColor: "#F9FAFB" },
  { id: "youtube", label: "YouTube", color: "#FF0000", bgColor: "#FEF2F2" },
  { id: "pinterest", label: "Pinterest", color: "#E60023", bgColor: "#FEF2F2" },
  { id: "threads", label: "Threads", color: "#000000", bgColor: "#F9FAFB" },
];

// ─────────────────────────────────────────────────────────────
//  Content Formats
// ─────────────────────────────────────────────────────────────
export const CONTENT_FORMATS: {
  id: ContentFormat;
  label: string;
  emoji: string;
  description: string;
}[] = [
  { id: "video", label: "Video", emoji: "🎬", description: "Long-form video content" },
  { id: "reels", label: "Reels / Shorts", emoji: "🎥", description: "Short-form vertical video" },
  { id: "image", label: "Single Image", emoji: "🖼️", description: "Static photo or graphic" },
  { id: "carousel", label: "Carousel", emoji: "🎠", description: "Swipeable multi-image posts" },
  { id: "stories", label: "Stories", emoji: "⭕", description: "24-hour disappearing content" },
  { id: "text", label: "Text Post", emoji: "📝", description: "Text-only updates or threads" },
];

// ─────────────────────────────────────────────────────────────
//  KPIs
// ─────────────────────────────────────────────────────────────
export const KPIS: {
  id: KPI;
  label: string;
  emoji: string;
  description: string;
}[] = [
  { id: "follower-growth", label: "Follower Growth", emoji: "📈", description: "Grow the audience size" },
  { id: "engagement-rate", label: "Engagement Rate", emoji: "💬", description: "Likes, comments, shares" },
  { id: "website-traffic", label: "Website Traffic", emoji: "🌐", description: "Drive clicks to the site" },
  { id: "lead-gen", label: "Lead Generation", emoji: "🎯", description: "Capture new prospects" },
  { id: "sales", label: "Sales & Conversions", emoji: "💰", description: "Direct revenue from social" },
  { id: "brand-awareness", label: "Brand Awareness", emoji: "✨", description: "Reach and impressions" },
];

// ─────────────────────────────────────────────────────────────
//  Ad Budget Options
// ─────────────────────────────────────────────────────────────
export const AD_BUDGET_OPTIONS = [
  { value: "no-ads", label: "No paid ads" },
  { value: "under-500", label: "Under $500 / month" },
  { value: "500-2k", label: "$500 – $2,000 / month" },
  { value: "2k-5k", label: "$2,000 – $5,000 / month" },
  { value: "5k-10k", label: "$5,000 – $10,000 / month" },
  { value: "10k-plus", label: "$10,000+ / month" },
];

// ─────────────────────────────────────────────────────────────
//  Approval Workflow Options
// ─────────────────────────────────────────────────────────────
export const APPROVAL_WORKFLOW_OPTIONS = [
  { value: "no-approval", label: "No approval needed — just post" },
  { value: "approve-all", label: "Approve every single post" },
  { value: "approve-first-batch", label: "Approve first batch, then trust" },
  { value: "weekly-review", label: "Weekly calendar review" },
];

// ─────────────────────────────────────────────────────────────
//  Communication Channels
// ─────────────────────────────────────────────────────────────
export const COMMUNICATION_CHANNELS = [
  { value: "email", label: "Email" },
  { value: "slack", label: "Slack" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone / Call" },
];

// ─────────────────────────────────────────────────────────────
//  Days of Week (for posting times)
// ─────────────────────────────────────────────────────────────
export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const POSTING_TIME_SLOTS = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM",
];

// ─────────────────────────────────────────────────────────────
//  Tone Keywords (suggestions for autocomplete)
// ─────────────────────────────────────────────────────────────
export const TONE_KEYWORD_SUGGESTIONS = [
  "Professional", "Friendly", "Witty", "Bold", "Empathetic", "Inspirational",
  "Educational", "Playful", "Luxurious", "Minimalist", "Authentic", "Energetic",
  "Calm", "Authoritative", "Conversational", "Motivational", "Warm", "Direct",
  "Humorous", "Sophisticated", "Passionate", "Trustworthy", "Creative", "Innovative",
];
