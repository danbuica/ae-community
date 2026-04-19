"use client";

import { motion } from "framer-motion";

interface WizardProgressProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ progress, currentStep, totalSteps }: WizardProgressProps) {
  return (
    <div className="relative w-full h-1 bg-border overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 gradient-brand"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
      {/* Step markers */}
      <div className="absolute inset-0 flex items-center">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const pos = (i / (totalSteps - 1)) * 100;
          const isReached = i + 1 <= currentStep;
          return (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2"
              style={{ left: `${pos}%` }}
              animate={{
                backgroundColor: isReached ? "rgb(124,58,237)" : "rgb(229,231,235)",
                scale: i + 1 === currentStep ? 1.4 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </div>
    </div>
  );
}
