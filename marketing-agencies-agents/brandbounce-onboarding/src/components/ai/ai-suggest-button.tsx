"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { AISuggestionType } from "@/types/onboarding";

interface AISuggestButtonProps {
  type: AISuggestionType;
  context: Record<string, unknown>;
  onResult: (suggestions: unknown) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function AISuggestButton({
  type,
  context,
  onResult,
  label = "AI Suggest",
  className,
  disabled,
  size = "sm",
}: AISuggestButtonProps) {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  async function handleClick() {
    if (loading || cooldown || disabled) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, context }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "AI suggestion failed");
      }

      const data = await res.json();
      onResult(data.suggestions);

      // 3s cooldown
      setCooldown(true);
      setTimeout(() => setCooldown(false), 3000);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "AI suggestion unavailable. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const isSmall = size === "sm";

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={loading || cooldown || disabled}
      whileHover={!loading && !cooldown && !disabled ? { scale: 1.03 } : {}}
      whileTap={!loading && !cooldown && !disabled ? { scale: 0.97 } : {}}
      animate={!loading && !cooldown && !disabled ? "pulsing" : "idle"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all",
        "bg-primary/5 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isSmall ? "text-xs px-2.5 py-1.5" : "text-sm px-3 py-2",
        cooldown && "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-400",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            <Loader2 className={cn("animate-spin", isSmall ? "w-3 h-3" : "w-3.5 h-3.5")} />
          </motion.span>
        ) : (
          <motion.span
            key="sparkle"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            <motion.span
              animate={!loading && !cooldown && !disabled
                ? { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }
                : {}
              }
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              className="inline-block"
            >
              <Wand2 className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
      {loading ? "Thinking…" : cooldown ? "Done!" : label}
    </motion.button>
  );
}
