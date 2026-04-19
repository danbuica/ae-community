"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type {
  OnboardingFormData,
  ClientContactData,
  BusinessOverviewData,
  BrandIdentityData,
  TargetAudienceData,
  ContentStrategyData,
  GoalsBudgetData,
} from "@/types/onboarding";

// ── AI suggestions (raw prefill data per step, shown above inputs) ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StepSuggestions = Record<number, Record<string, any> | null>;
import { CONTENT_FORMATS } from "@/lib/constants";

// ── Default empty state ────────────────────────────────────────
const defaultFormData: OnboardingFormData = {
  clientContact: {
    contactName: "",
    email: "",
    phone: "",
    role: "",
    communicationChannel: "",
    websiteUrl: "",
    scrapedData: undefined,
  },
  businessOverview: {
    businessName: "",
    industry: "",
    elevatorPitch: "",
    productsServices: [],
    competitors: [],
    uniqueSellingProposition: "",
  },
  brandIdentity: {
    logoUrl: "",
    brandColors: [],
    archetypes: [],
    toneKeywords: [],
    brandVoiceDescription: "",
    guidelinesUrl: "",
  },
  targetAudience: {
    audienceDescription: "",
    ageMin: 18,
    ageMax: 45,

    locations: [],
    interests: [],
    painPoints: "",
  },
  contentStrategy: {
    platforms: [],
    platformFrequencies: [],
    contentPillars: [],
    contentFormatOrder: CONTENT_FORMATS.map((f) => f.id),
    preferredPostingTimes: {} as Record<string, string[]>,
    hashtagGroups: [],
    topicsToAvoid: [],
    exampleContent: [],
  },
  goalsBudget: {
    kpis: [],
    adBudget: "",
    keyDates: [],
    approvalWorkflow: "",
    socialHandles: [],
  },
};

// ── Store interface ────────────────────────────────────────────
interface FormStore {
  data: OnboardingFormData;
  isDirty: boolean;

  // AI suggestions (shown above inputs, not applied until user accepts)
  suggestions: StepSuggestions;
  setSuggestions: (step: number, data: Record<string, unknown>) => void;
  clearSuggestion: (step: number, field: string) => void;
  clearStepSuggestions: (step: number) => void;

  // Slice updaters
  updateClientContact: (patch: Partial<ClientContactData>) => void;
  updateBusinessOverview: (patch: Partial<BusinessOverviewData>) => void;
  updateBrandIdentity: (patch: Partial<BrandIdentityData>) => void;
  updateTargetAudience: (patch: Partial<TargetAudienceData>) => void;
  updateContentStrategy: (patch: Partial<ContentStrategyData>) => void;
  updateGoalsBudget: (patch: Partial<GoalsBudgetData>) => void;

  // Helpers
  addExampleContent: () => void;
  removeExampleContent: (id: string) => void;
  addKeyDate: () => void;
  removeKeyDate: (id: string) => void;

  // Hydrate from localStorage
  hydrate: (data: OnboardingFormData) => void;
  reset: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  data: defaultFormData,
  isDirty: false,

  suggestions: {},
  setSuggestions: (step, data) =>
    set((s) => ({ suggestions: { ...s.suggestions, [step]: data } })),
  clearSuggestion: (step, field) =>
    set((s) => {
      const current = s.suggestions[step];
      if (!current) return s;
      const { [field]: _, ...rest } = current;
      return { suggestions: { ...s.suggestions, [step]: Object.keys(rest).length > 0 ? rest : null } };
    }),
  clearStepSuggestions: (step) =>
    set((s) => ({ suggestions: { ...s.suggestions, [step]: null } })),

  updateClientContact: (patch) =>
    set((s) => ({
      isDirty: true,
      data: { ...s.data, clientContact: { ...s.data.clientContact, ...patch } },
    })),

  updateBusinessOverview: (patch) =>
    set((s) => ({
      isDirty: true,
      data: { ...s.data, businessOverview: { ...s.data.businessOverview, ...patch } },
    })),

  updateBrandIdentity: (patch) =>
    set((s) => ({
      isDirty: true,
      data: { ...s.data, brandIdentity: { ...s.data.brandIdentity, ...patch } },
    })),

  updateTargetAudience: (patch) =>
    set((s) => ({
      isDirty: true,
      data: { ...s.data, targetAudience: { ...s.data.targetAudience, ...patch } },
    })),

  updateContentStrategy: (patch) =>
    set((s) => ({
      isDirty: true,
      data: { ...s.data, contentStrategy: { ...s.data.contentStrategy, ...patch } },
    })),

  updateGoalsBudget: (patch) =>
    set((s) => ({
      isDirty: true,
      data: { ...s.data, goalsBudget: { ...s.data.goalsBudget, ...patch } },
    })),

  addExampleContent: () =>
    set((s) => ({
      isDirty: true,
      data: {
        ...s.data,
        contentStrategy: {
          ...s.data.contentStrategy,
          exampleContent: [
            ...s.data.contentStrategy.exampleContent,
            { id: uuidv4(), url: "", note: "" },
          ],
        },
      },
    })),

  removeExampleContent: (id) =>
    set((s) => ({
      isDirty: true,
      data: {
        ...s.data,
        contentStrategy: {
          ...s.data.contentStrategy,
          exampleContent: s.data.contentStrategy.exampleContent.filter(
            (e) => e.id !== id
          ),
        },
      },
    })),

  addKeyDate: () =>
    set((s) => ({
      isDirty: true,
      data: {
        ...s.data,
        goalsBudget: {
          ...s.data.goalsBudget,
          keyDates: [
            ...s.data.goalsBudget.keyDates,
            { id: uuidv4(), date: "", eventName: "" },
          ],
        },
      },
    })),

  removeKeyDate: (id) =>
    set((s) => ({
      isDirty: true,
      data: {
        ...s.data,
        goalsBudget: {
          ...s.data.goalsBudget,
          keyDates: s.data.goalsBudget.keyDates.filter((d) => d.id !== id),
        },
      },
    })),

  hydrate: (data) => set({ data, isDirty: false }),

  reset: () => set({ data: defaultFormData, isDirty: false }),
}));
