"use client";

import { useState, useCallback, useEffect } from "react";
import { STEP_SCHEMAS } from "@/lib/validation";
import { useFormStore } from "@/hooks/use-form-store";
import { saveStep, loadStep } from "@/hooks/use-auto-save";
import type { WizardStep, Platform } from "@/types/onboarding";

const TOTAL_STEPS = 7;

const STEP_DATA_KEYS: Record<number, keyof ReturnType<typeof useFormStore.getState>["data"]> = {
  1: "clientContact",
  2: "businessOverview",
  3: "brandIdentity",
  4: "targetAudience",
  5: "contentStrategy",
  6: "goalsBudget",
};

interface UseWizardReturn {
  currentStep: WizardStep;
  direction: number;
  errors: Record<string, string>;
  isValidating: boolean;
  isPrefilling: boolean;
  progress: number;
  canGoBack: boolean;
  goNext: () => Promise<boolean>;
  goBack: () => void;
  goToStep: (step: WizardStep) => void;
  clearErrors: () => void;
}

// ── Scrape a URL server-side ────────────────────────────────
async function scrapeWebsite(url: string) {
  try {

    const res = await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const json = await res.json();

    return json.data ?? null;
  } catch (err) {

    return null;
  }
}

// ── Ask AI to prefill the next step ─────────────────────────
async function fetchPrefill(targetStep: number, context: Record<string, unknown>) {
  try {

    const res = await fetch("/api/ai/prefill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetStep, context }),
    });
    if (!res.ok) {
      const err = await res.text();

      return null;
    }
    const json = await res.json();

    return json.prefill ?? null;
  } catch (err) {

    return null;
  }
}

export function useWizard(): UseWizardReturn {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [direction, setDirection] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  // Restore step from localStorage after hydration
  useEffect(() => {
    const saved = loadStep();
    if (saved && saved >= 1 && saved <= 7) {
      setCurrentStep(saved as WizardStep);
    }
    setHydrated(true);
  }, []);

  // Persist step on change (only after hydration to avoid overwriting with 1)
  useEffect(() => { if (hydrated) saveStep(currentStep); }, [currentStep, hydrated]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isPrefilling, setIsPrefilling] = useState(false);

  const data = useFormStore((s) => s.data);

  const progress = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (currentStep >= 7) return true;

    const schema = STEP_SCHEMAS[currentStep as keyof typeof STEP_SCHEMAS];
    const dataKey = STEP_DATA_KEYS[currentStep];
    const stepData = data[dataKey];

    setIsValidating(true);

    // Clean up invalid KPI values from AI suggestions before validating
    if (currentStep === 6) {
      const validKpis = ["follower-growth", "engagement-rate", "website-traffic", "lead-gen", "sales", "brand-awareness"];
      const store = useFormStore.getState();
      const cleaned = store.data.goalsBudget.kpis.filter((k) => validKpis.includes(k));
      if (cleaned.length !== store.data.goalsBudget.kpis.length) {
        store.updateGoalsBudget({ kpis: cleaned as typeof store.data.goalsBudget.kpis });
      }
    }

    const freshData = currentStep === 6 ? useFormStore.getState().data[dataKey] : stepData;
    const result = schema.safeParse(freshData);
    setIsValidating(false);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [currentStep, data]);

  // ── Store prefill data as suggestions (not applied to form) ──
  const storeSuggestions = useCallback((targetStep: number, prefill: Record<string, unknown>) => {
    useFormStore.getState().setSuggestions(targetStep, prefill);
  }, []);

  // ── Build context for the prefill API call ──────────────────
  const buildPrefillContext = useCallback((targetStep: number): Record<string, unknown> => {
    const d = useFormStore.getState().data;

    switch (targetStep) {
      case 2:
        // Context comes from scraped data — handled separately
        return {};
      case 3:
        return {
          businessName: d.businessOverview.businessName,
          industry: d.businessOverview.industry,
          elevatorPitch: d.businessOverview.elevatorPitch,
          productsServices: d.businessOverview.productsServices,
          uniqueSellingProposition: d.businessOverview.uniqueSellingProposition,
          scrapedDescription: d.clientContact.scrapedData?.description,
        };
      case 4:
        return {
          businessName: d.businessOverview.businessName,
          industry: d.businessOverview.industry,
          elevatorPitch: d.businessOverview.elevatorPitch,
          productsServices: d.businessOverview.productsServices,
          archetypes: d.brandIdentity.archetypes,
          toneKeywords: d.brandIdentity.toneKeywords,
          scrapedDescription: d.clientContact.scrapedData?.description,
        };
      case 5:
        return {
          businessName: d.businessOverview.businessName,
          industry: d.businessOverview.industry,
          productsServices: d.businessOverview.productsServices,
          competitors: d.businessOverview.competitors,
          archetypes: d.brandIdentity.archetypes,
          toneKeywords: d.brandIdentity.toneKeywords,
          audienceDescription: d.targetAudience.audienceDescription,
          locations: d.targetAudience.locations,
          scrapedSocialLinks: d.clientContact.scrapedData?.socialLinks,
        };
      case 6:
        return {
          businessName: d.businessOverview.businessName,
          industry: d.businessOverview.industry,
          platforms: d.contentStrategy.platforms,
          audienceDescription: d.targetAudience.audienceDescription,
          locations: d.targetAudience.locations,
          contentPillars: d.contentStrategy.contentPillars,
        };
      default:
        return {};
    }
  }, []);

  const goNext = useCallback(async (): Promise<boolean> => {
    const valid = await validateCurrentStep();
    if (!valid) return false;

    if (currentStep >= TOTAL_STEPS) return true;

    const nextStep = currentStep + 1;

    // ── Step 1 → 2: scrape website first, then prefill ────────
    if (currentStep === 1) {
      const websiteUrl = data.clientContact.websiteUrl;
      if (websiteUrl && websiteUrl.startsWith("http")) {
        setIsPrefilling(true);
        const scraped = await scrapeWebsite(websiteUrl);

        if (scraped) {
          useFormStore.getState().updateClientContact({ scrapedData: scraped });

          // Apply business name directly (it's a fact, not a suggestion)
          if (scraped.businessName) {
            useFormStore.getState().updateBusinessOverview({ businessName: scraped.businessName });
          }

          // Pre-fill social handles
          if (scraped.socialLinks) {
            const handles = Object.entries(scraped.socialLinks).map(([platform, handle]) => ({
              platform: platform as Platform,
              handle: String(handle),
            }));
            if (handles.length > 0) {
              const existing = useFormStore.getState().data.goalsBudget.socialHandles;
              useFormStore.getState().updateGoalsBudget({
                socialHandles: [
                  ...existing.filter((h) => !handles.find((n) => n.platform === h.platform)),
                  ...handles,
                ],
              });
            }
          }

          // AI prefill Step 2 using scraped data
          const prefill = await fetchPrefill(2, {
            businessName: scraped.businessName ?? "",
            description: scraped.description ?? "",
            keywords: scraped.keywords,
            socialLinks: scraped.socialLinks,
          });
          if (prefill) storeSuggestions(2, prefill);
        }
        setIsPrefilling(false);
      }
    }
    // ── Steps 2-5: AI prefill the next step ────────────────────
    else if (nextStep >= 3 && nextStep <= 6) {
      setIsPrefilling(true);
      const context = buildPrefillContext(nextStep);
      const prefill = await fetchPrefill(nextStep, context);
      if (prefill) storeSuggestions(nextStep, prefill);
      setIsPrefilling(false);
    }

    setDirection(1);
    setCurrentStep((s) => (s + 1) as WizardStep);
    return true;
  }, [currentStep, data, validateCurrentStep, storeSuggestions, buildPrefillContext]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1);
      setErrors({});
      setCurrentStep((s) => (s - 1) as WizardStep);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: WizardStep) => {
      if (step <= currentStep) {
        setDirection(step < currentStep ? -1 : 1);
        setErrors({});
        setCurrentStep(step);
      }
    },
    [currentStep]
  );

  const clearErrors = useCallback(() => setErrors({}), []);

  return {
    currentStep,
    direction,
    errors,
    isValidating,
    isPrefilling,
    progress,
    canGoBack: currentStep > 1,
    goNext,
    goBack,
    goToStep,
    clearErrors,
  };
}
