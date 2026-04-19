"use client";

import { motion } from "framer-motion";
import { Wand2, Check, X } from "lucide-react";

// ── Text suggestion (elevator pitch, USP, brand voice, etc.) ──
export function TextSuggestion({
  value,
  onAccept,
  onDismiss,
}: {
  value: string;
  onAccept: (v: string) => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 mb-2"
    >
      <div className="flex items-start gap-2">
        <Wand2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/80 leading-relaxed flex-1 line-clamp-4">
          {value}
        </p>
      </div>
      <div className="flex items-center gap-1.5 mt-2 ml-5">
        <button
          onClick={() => onAccept(value)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Check className="w-3 h-3" />
          Use this
        </button>
        <span className="text-border">·</span>
        <button
          onClick={onDismiss}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3 h-3" />
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}

// ── Tag suggestions (products, competitors, locations, etc.) ──
export function TagsSuggestion({
  values,
  picked,
  onAccept,
  onAcceptOne,
  onDismiss,
}: {
  values: string[];
  /** Already-accepted values — these show as greyed-out */
  picked?: string[];
  onAccept: (v: string[]) => void;
  onAcceptOne?: (v: string) => void;
  onDismiss: () => void;
}) {
  const remaining = values.filter((v) => !picked?.includes(v));

  if (remaining.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="rounded-lg border border-primary/20 bg-primary/5 p-2.5 mb-2"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Wand2 className="w-3.5 h-3.5 text-primary" />
        <span className="text-[11px] font-medium text-primary">Suggested</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {values.map((v) => {
          const isPicked = picked?.includes(v);
          return (
            <button
              key={v}
              onClick={() => !isPicked && onAcceptOne?.(v)}
              disabled={isPicked}
              className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                isPicked
                  ? "bg-primary/5 text-primary/30 line-through cursor-default"
                  : "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <button
          onClick={() => onAccept(remaining)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Check className="w-3 h-3" />
          {picked?.length ? `Add remaining (${remaining.length})` : "Add all"}
        </button>
        <span className="text-border">·</span>
        <button
          onClick={onDismiss}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3 h-3" />
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}

// ── Single value suggestion (industry, gender split, budget, etc.) ──
export function ValueSuggestion({
  label,
  value,
  onAccept,
  onDismiss,
}: {
  label: string;
  value: string;
  onAccept: (v: string) => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 mb-2"
    >
      <Wand2 className="w-3 h-3 text-primary" />
      <span className="text-[11px] text-muted-foreground">{label}:</span>
      <span className="text-[11px] font-medium text-foreground">{value}</span>
      <button
        onClick={() => onAccept(value)}
        className="ml-0.5 text-primary hover:text-primary/80 transition-colors"
      >
        <Check className="w-3 h-3" />
      </button>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
