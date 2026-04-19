"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, X } from "lucide-react";
import { staggerContainerFast, popIn } from "@/lib/animations";

interface AIChipResultsProps {
  suggestions: string[];
  onAccept: (items: string[]) => void;
  onDismiss: () => void;
  label?: string;
  existingValues?: string[];
}

export function AIChipResults({
  suggestions,
  onAccept,
  onDismiss,
  label = "AI suggestions",
  existingValues = [],
}: AIChipResultsProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(suggestions.filter((s) => !existingValues.includes(s)))
  );

  function toggleItem(item: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  function handleAccept() {
    onAccept(Array.from(selected));
  }

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-primary">{label}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-1.5"
      >
        {suggestions.map((item) => {
          const isSelected = selected.has(item);
          const alreadyAdded = existingValues.includes(item);
          return (
            <motion.button
              key={item}
              type="button"
              variants={popIn}
              onClick={() => !alreadyAdded && toggleItem(item)}
              disabled={alreadyAdded}
              whileHover={!alreadyAdded ? { scale: 1.05 } : {}}
              whileTap={!alreadyAdded ? { scale: 0.95 } : {}}
              className={
                alreadyAdded
                  ? "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground/50 cursor-not-allowed"
                  : isSelected
                  ? "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-primary bg-primary text-primary-foreground"
                  : "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
              }
            >
              {alreadyAdded ? (
                <Check className="w-2.5 h-2.5" />
              ) : isSelected ? (
                <Check className="w-2.5 h-2.5" />
              ) : (
                <Plus className="w-2.5 h-2.5" />
              )}
              {item}
            </motion.button>
          );
        })}
      </motion.div>

      <div className="flex gap-2">
        <motion.button
          type="button"
          onClick={handleAccept}
          disabled={selected.size === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-1.5 rounded-lg gradient-brand text-white text-xs font-medium disabled:opacity-40 disabled:pointer-events-none"
        >
          Add {selected.size} selected
        </motion.button>
        <button
          type="button"
          onClick={onDismiss}
          className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:border-primary/30 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}
