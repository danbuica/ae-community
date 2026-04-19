"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { WizardStep } from "@/types/onboarding";

interface StepTransitionProps {
  currentStep: WizardStep;
  direction: number;
  children: React.ReactNode;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-50%" : "50%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  }),
};

export function StepTransition({ currentStep, direction, children }: StepTransitionProps) {
  return (
    <div className="relative overflow-hidden flex-1">
      <AnimatePresence mode="popLayout" custom={direction} initial={false}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
