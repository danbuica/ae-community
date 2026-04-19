"use client";

import { motion } from "framer-motion";
import { Wand2, X } from "lucide-react";
import { useState } from "react";

export function AIPrefilledBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-xl bg-primary/5 border border-primary/20 px-3 py-2.5 flex items-center gap-2.5"
    >
      <Wand2 className="w-4 h-4 text-primary flex-shrink-0" />
      <p className="text-xs text-primary font-medium flex-1">
        We pre-filled these fields based on your website. Review and edit as needed.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-primary/50 hover:text-primary transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
