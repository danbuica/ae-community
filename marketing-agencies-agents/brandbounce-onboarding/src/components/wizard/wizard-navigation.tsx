"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  isValidating: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  canGoBack,
  isValidating,
  isSubmitting = false,
  onBack,
  onNext,
}: WizardNavigationProps) {
  const isLastStep = currentStep === totalSteps;
  const isReviewStep = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
      {/* Back */}
      <motion.div
        initial={false}
        animate={{ opacity: canGoBack ? 1 : 0, x: canGoBack ? 0 : -8 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={!canGoBack || isValidating || isSubmitting}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </motion.div>

      {/* Step counter */}
      <p className="text-xs text-muted-foreground tabular-nums">
        {currentStep} / {totalSteps}
      </p>

      {/* Next / Submit */}
      <Button
        onClick={onNext}
        disabled={isValidating || isSubmitting}
        className={
          isLastStep || isReviewStep
            ? "gap-2 gradient-brand text-white border-0 shadow-lg shadow-primary/25 hover:opacity-90 hover:shadow-primary/40 transition-all"
            : "gap-2"
        }
      >
        {(isValidating || isSubmitting) && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {isLastStep ? (
          <>
            Submit <Send className="w-4 h-4" />
          </>
        ) : (
          <>
            Continue <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
}
