"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode; // e.g. AI suggest button
}

export function FieldWrapper({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
  action,
}: FieldWrapperProps) {
  return (
    <motion.div className={cn("space-y-1.5", className)}>
      {/* Label row */}
      <div className="flex items-center justify-between gap-2 min-h-[24px]">
        <Label
          htmlFor={htmlFor}
          className={cn("text-sm font-medium", error && "text-destructive")}
        >
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Field content */}
      {children}

      {/* Error + hint */}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs text-destructive"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
