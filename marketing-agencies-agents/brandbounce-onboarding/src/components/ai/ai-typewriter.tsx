"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RefreshCw, X } from "lucide-react";

interface AITypewriterProps {
  text: string;
  onAccept: (text: string) => void;
  onDismiss: () => void;
  speed?: number; // ms per character
}

export function AITypewriter({
  text,
  onAccept,
  onDismiss,
  speed = 12,
}: AITypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  function skipToEnd() {
    setDisplayed(text);
    setDone(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-primary flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          AI generated
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Text with cursor */}
      <div
        className="text-sm text-foreground leading-relaxed min-h-[60px] cursor-pointer"
        onClick={!done ? skipToEnd : undefined}
        title={!done ? "Click to skip animation" : undefined}
      >
        {displayed}
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
          />
        )}
      </div>

      {/* Actions */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <motion.button
              type="button"
              onClick={() => onAccept(text)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg gradient-brand text-white text-xs font-medium"
            >
              <Check className="w-3.5 h-3.5" />
              Use this
            </motion.button>
            <button
              type="button"
              onClick={onDismiss}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:border-primary/30 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Discard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
