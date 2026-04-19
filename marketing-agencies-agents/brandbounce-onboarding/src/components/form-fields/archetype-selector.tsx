"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ARCHETYPES } from "@/lib/constants";
import { staggerContainerFast, fadeInUp } from "@/lib/animations";
import type { BrandArchetype } from "@/types/onboarding";

interface ArchetypeSelectorProps {
  value: BrandArchetype[];
  onChange: (archetypes: BrandArchetype[]) => void;
  maxSelect?: number;
}

export function ArchetypeSelector({
  value,
  onChange,
  maxSelect = 3,
}: ArchetypeSelectorProps) {
  function toggle(id: BrandArchetype) {
    if (value.includes(id)) {
      onChange(value.filter((a) => a !== id));
    } else if (value.length < maxSelect) {
      onChange([...value, id]);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Select up to {maxSelect} archetypes that best describe your brand&apos;s personality.
      </p>

      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
      >
        {ARCHETYPES.map((archetype) => {
          const isSelected = value.includes(archetype.id);
          const isDisabled = !isSelected && value.length >= maxSelect;

          return (
            <motion.button
              key={archetype.id}
              type="button"
              variants={fadeInUp}
              onClick={() => toggle(archetype.id)}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={cn(
                "relative rounded-xl border-2 p-3 text-left transition-all duration-200 group",
                isSelected
                  ? "border-primary bg-primary/8 shadow-md shadow-primary/15"
                  : "border-border hover:border-primary/40 bg-card",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {/* Selected checkmark */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                  >
                    <Check className="w-3 h-3" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Emoji */}
              <div className="text-2xl mb-2 leading-none">{archetype.emoji}</div>

              {/* Color dot */}
              <div
                className="w-2 h-2 rounded-full absolute top-3 left-3 opacity-60"
                style={{ backgroundColor: archetype.color }}
              />

              {/* Labels */}
              <p
                className={cn(
                  "text-sm font-semibold leading-tight",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {archetype.label}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 italic">
                {archetype.tagline}
              </p>

              {/* Description tooltip on hover */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={isSelected ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[11px] text-primary/70 mt-1.5 leading-relaxed">
                  {archetype.description}
                </p>
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Selected summary */}
      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span>Selected:</span>
            {value.map((id) => {
              const a = ARCHETYPES.find((x) => x.id === id)!;
              return (
                <span key={id} className="inline-flex items-center gap-1 text-foreground font-medium">
                  {a.emoji} {a.label}
                </span>
              );
            })}
            <span className="text-muted-foreground/60">
              ({value.length}/{maxSelect})
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
