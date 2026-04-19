"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  User, Building2, Palette, Users, LayoutGrid, Target, CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "@/lib/constants";
import type { WizardStep } from "@/types/onboarding";
import { pathDraw } from "@/lib/animations";

const ICONS = { User, Building2, Palette, Users, LayoutGrid, Target, CheckCircle };

interface WizardStepperProps {
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}

export function WizardStepper({ currentStep, onStepClick }: WizardStepperProps) {
  return (
    <nav className="flex flex-col gap-1 py-6 px-3">
      {WIZARD_STEPS.map((meta, idx) => {
        const Icon = ICONS[meta.icon as keyof typeof ICONS];
        const isCompleted = meta.step < currentStep;
        const isCurrent = meta.step === currentStep;
        const isClickable = meta.step <= currentStep;

        return (
          <button
            key={meta.step}
            onClick={() => isClickable && onStepClick(meta.step)}
            disabled={!isClickable}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
              isCurrent && "bg-primary/10",
              isClickable && !isCurrent && "hover:bg-muted cursor-pointer",
              !isClickable && "cursor-not-allowed opacity-40",
            )}
          >
            {/* Connector line */}
            {idx < WIZARD_STEPS.length - 1 && (
              <div
                className={cn(
                  "absolute left-[1.6rem] top-[3rem] w-px h-4 transition-colors duration-500",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}

            {/* Step indicator */}
            <div
              className={cn(
                "relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                isCompleted && "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg shadow-primary/30",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground border border-border",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isCompleted ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                      <motion.path
                        d="M3 8.5L6.5 12L13 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={pathDraw}
                        initial="hidden"
                        animate="visible"
                      />
                    </svg>
                  </motion.span>
                ) : (
                  <motion.span
                    key="icon"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Labels */}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium leading-tight truncate transition-colors",
                  isCurrent && "text-primary",
                  isCompleted && "text-foreground",
                  !isCurrent && !isCompleted && "text-muted-foreground",
                )}
              >
                {meta.title}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {meta.description}
              </p>
            </div>

            {/* Active indicator dot */}
            {isCurrent && (
              <motion.div
                layoutId="active-step-dot"
                className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
