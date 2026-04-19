"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, X } from "lucide-react";
import { staggerContainerFast, fadeInUp } from "@/lib/animations";

interface AICardItem {
  name: string;
  description: string;
}

interface AICardResultsProps {
  suggestions: AICardItem[];
  onAccept: (names: string[]) => void;
  onDismiss: () => void;
  label?: string;
  existingValues?: string[];
}

export function AICardResults({
  suggestions,
  onAccept,
  onDismiss,
  label = "AI suggested content pillars",
  existingValues = [],
}: AICardResultsProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(suggestions.map((s) => s.name).filter((n) => !existingValues.includes(n)))
  );

  function toggleItem(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-primary">{label}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
      >
        {suggestions.map((item) => {
          const isSelected = selected.has(item.name);
          const alreadyAdded = existingValues.includes(item.name);

          return (
            <motion.button
              key={item.name}
              type="button"
              variants={fadeInUp}
              onClick={() => !alreadyAdded && toggleItem(item.name)}
              disabled={alreadyAdded}
              whileHover={!alreadyAdded ? { scale: 1.02, y: -1 } : {}}
              whileTap={!alreadyAdded ? { scale: 0.98 } : {}}
              className={
                alreadyAdded
                  ? "rounded-lg border border-border bg-muted/30 p-3 text-left opacity-50 cursor-not-allowed"
                  : isSelected
                  ? "rounded-lg border-2 border-primary bg-primary/8 p-3 text-left shadow-sm"
                  : "rounded-lg border border-border bg-card p-3 text-left hover:border-primary/40 transition-all"
              }
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : ""}`}>
                    {item.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <AnimatePresence>
                  {(isSelected || alreadyAdded) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        alreadyAdded ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </motion.div>
                  )}
                  {!isSelected && !alreadyAdded && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-5 h-5 rounded-full border border-border flex items-center justify-center flex-shrink-0 text-muted-foreground"
                    >
                      <Plus className="w-3 h-3" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="flex gap-2">
        <motion.button
          type="button"
          onClick={() => onAccept(Array.from(selected))}
          disabled={selected.size === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-1.5 rounded-lg gradient-brand text-white text-xs font-medium disabled:opacity-40 disabled:pointer-events-none"
        >
          Add {selected.size} pillar{selected.size !== 1 ? "s" : ""}
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
