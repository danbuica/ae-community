"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Loader2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardStepper } from "@/components/wizard/wizard-stepper";
import { WizardProgress } from "@/components/wizard/wizard-progress";
import { WizardNavigation } from "@/components/wizard/wizard-navigation";
import { StepTransition } from "@/components/wizard/step-transition";
import { PreviewPanel } from "@/components/brand-preview/preview-panel";
import type { WizardStep } from "@/types/onboarding";

interface WizardShellProps {
  currentStep: WizardStep;
  direction: number;
  progress: number;
  canGoBack: boolean;
  isValidating: boolean;
  isPrefilling?: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
  onStepClick: (step: WizardStep) => void;
  children: React.ReactNode;
}

const TOTAL_STEPS = 7;

export function WizardShell({
  currentStep,
  direction,
  progress,
  canGoBack,
  isValidating,
  isPrefilling = false,
  isSubmitting = false,
  onBack,
  onNext,
  onStepClick,
  children,
}: WizardShellProps) {
  const [previewVisible, setPreviewVisible] = useState(true);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Top progress bar */}
      <WizardProgress
        progress={progress}
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
      />

      <div className="flex flex-1 min-h-0 overflow-clip">
        {/* ── Left sidebar: stepper ── */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 border-r border-border bg-sidebar overflow-y-auto">
          {/* Brand tagline */}
          <div className="px-4 pt-6 pb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Onboarding
            </p>
            <h2 className="text-base font-semibold mt-0.5">Let&apos;s get started</h2>
          </div>

          <WizardStepper currentStep={currentStep} onStepClick={onStepClick} />

          {/* Bottom tagline */}
          <div className="mt-auto px-4 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Takes ~10 minutes. Your progress is saved automatically.
            </p>
          </div>
        </aside>

        {/* ── Main content area ── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Mobile stepper (top bar) */}
          <div className="lg:hidden px-4 pt-4 pb-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">
                Step {currentStep} of {TOTAL_STEPS}
              </p>
              <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 flex-1 rounded-full"
                  animate={{
                    backgroundColor: i + 1 <= currentStep ? "rgb(124,58,237)" : "rgb(229,231,235)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1 flex flex-col px-4 md:px-6 xl:px-8 py-6 max-w-2xl w-full mx-auto">
            <AnimatePresence mode="wait">
              {isPrefilling ? (
                <motion.div
                  key="prefilling"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                      <Wand2 className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-semibold">Analyzing your brand…</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        This usually takes a few seconds
                      </p>
                    </div>
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col"
                >
                  <StepTransition currentStep={currentStep} direction={direction}>
                    {children}
                  </StepTransition>

                  <WizardNavigation
                    currentStep={currentStep}
                    totalSteps={TOTAL_STEPS}
                    canGoBack={canGoBack}
                    isValidating={isValidating}
                    isSubmitting={isSubmitting}
                    onBack={onBack}
                    onNext={onNext}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* ── Right panel: live preview ── */}
        <aside
          className={`hidden xl:flex flex-col flex-shrink-0 border-l border-border bg-card transition-all duration-300 overflow-hidden ${
            previewVisible ? "w-72 2xl:w-80" : "w-10"
          }`}
        >
          {previewVisible ? (
            <div className="flex flex-col h-full min-h-0">
              {/* Toggle button row */}
              <div className="flex justify-end px-2 pt-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewVisible(false)}
                  className="w-7 h-7"
                  title="Hide preview"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                <PreviewPanel />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center pt-3 gap-2 h-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewVisible(true)}
                className="w-8 h-8 flex-shrink-0"
                title="Show preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
              <div
                className="flex-1 flex items-center"
                style={{ writingMode: "vertical-rl" }}
              >
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest rotate-180">
                  Preview
                </span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
