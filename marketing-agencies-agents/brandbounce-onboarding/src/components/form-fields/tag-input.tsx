"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { popIn, staggerContainerFast } from "@/lib/animations";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  maxTags?: number;
  className?: string;
  disabled?: boolean;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter…",
  suggestions = [],
  maxTags = 20,
  className,
  disabled,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      input.length > 0 &&
      s.toLowerCase().includes(input.toLowerCase()) &&
      !value.includes(s)
  );

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return;
    onChange([...value, trimmed]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Input area */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "min-h-[42px] w-full rounded-lg border bg-background px-3 py-2 text-sm transition-all duration-200 cursor-text flex flex-wrap gap-1.5 items-center",
          focused
            ? "border-primary ring-2 ring-primary/20"
            : "border-input hover:border-primary/50",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        {/* Tags */}
        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          animate="visible"
          className="contents"
        >
          <AnimatePresence mode="popLayout">
            {value.map((tag) => (
              <motion.span
                key={tag}
                variants={popIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-0.5 font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                  className="rounded-full hover:bg-primary/20 p-0.5 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Text input */}
        {value.length < maxTags && (
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); if (input.trim()) addTag(input); }}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            disabled={disabled}
          />
        )}
      </div>

      {/* Autocomplete suggestions */}
      <AnimatePresence>
        {focused && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-wrap gap-1.5 pt-1"
          >
            {filteredSuggestions.slice(0, 8).map((s) => (
              <motion.button
                key={s}
                type="button"
                onClick={() => addTag(s)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-1 rounded-md border border-dashed border-border bg-muted/50 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 text-xs px-2 py-0.5 transition-colors"
              >
                <Plus className="w-2.5 h-2.5" />
                {s}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Count */}
      {maxTags <= 20 && (
        <p className="text-[11px] text-muted-foreground text-right">
          {value.length} / {maxTags}
        </p>
      )}
    </div>
  );
}
