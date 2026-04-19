"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { useWizard } from "@/hooks/use-wizard";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useFormStore } from "@/hooks/use-form-store";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { Header } from "@/components/shared/header";
import { ConfettiBurst } from "@/components/shared/confetti";
import { WizardContextProvider } from "@/contexts/wizard-context";
import { StepClientContact } from "@/components/steps/client-contact";
import { StepBusinessOverview } from "@/components/steps/business-overview";
import { StepBrandIdentity } from "@/components/steps/brand-identity";
import { StepTargetAudience } from "@/components/steps/target-audience";
import { StepContentStrategy } from "@/components/steps/content-strategy";
import { StepGoalsBudget } from "@/components/steps/goals-budget";
import { StepReviewSubmit } from "@/components/steps/review-submit";
import { clearAutoSave } from "@/hooks/use-auto-save";
import type { WizardStep } from "@/types/onboarding";

export default function OnboardingPage() {
  const wizard = useWizard();
  useAutoSave();

  const data = useFormStore((s) => s.data);
  const reset = useFormStore((s) => s.reset);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit() {
    if (wizard.currentStep < 7) {
      await wizard.goNext();
      return;
    }

    // Final submit
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Submission failed");
      }

      setSubmissionId(json.id);
      setSubmitted(true);
      clearAutoSave();
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Success screen ─────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <ConfettiBurst />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="max-w-md w-full text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
              className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center mx-auto shadow-xl shadow-primary/30"
            >
              <Zap className="w-10 h-10 text-white fill-white" />
            </motion.div>

            <div>
              <h1 className="text-2xl font-bold mb-2">
                <span className="gradient-brand-text">You&apos;re all set!</span>
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your Brand Bounce brief has been submitted. Our team will review your brand details and have your strategy ready within 24 hours.
              </p>
            </div>

            {submissionId && (
              <div className="rounded-xl bg-muted/50 border border-border px-4 py-3">
                <p className="text-xs text-muted-foreground">Reference ID</p>
                <p className="text-sm font-mono font-medium mt-0.5">{submissionId}</p>
              </div>
            )}

            <button
              onClick={() => router.push("/")}
              className="w-full py-3 rounded-xl gradient-brand text-white font-medium text-sm"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Wizard ─────────────────────────────────────────────────
  const stepContent: Record<WizardStep, React.ReactNode> = {
    1: <StepClientContact />,
    2: <StepBusinessOverview />,
    3: <StepBrandIdentity />,
    4: <StepTargetAudience />,
    5: <StepContentStrategy />,
    6: <StepGoalsBudget />,
    7: <StepReviewSubmit onEditStep={wizard.goToStep} />,
  };

  return (
    <WizardContextProvider value={{ errors: wizard.errors, clearErrors: wizard.clearErrors }}>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <WizardShell
          currentStep={wizard.currentStep}
          direction={wizard.direction}
          progress={wizard.progress}
          canGoBack={wizard.canGoBack}
          isValidating={wizard.isValidating}
          isPrefilling={wizard.isPrefilling}
          isSubmitting={isSubmitting}
          onBack={wizard.goBack}
          onNext={wizard.currentStep === 7 ? handleSubmit : wizard.goNext}
          onStepClick={wizard.goToStep}
        >
          <AnimatePresence mode="wait">
            {stepContent[wizard.currentStep]}
          </AnimatePresence>
        </WizardShell>
      </div>
    </WizardContextProvider>
  );
}
