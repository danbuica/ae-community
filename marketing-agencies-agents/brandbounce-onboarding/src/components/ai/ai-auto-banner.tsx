"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Loader2 } from "lucide-react";

interface AIAutoBannerProps {
  loading: boolean;
}

export function AIAutoBanner({ loading }: AIAutoBannerProps) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-xl bg-primary/5 border border-primary/20 px-3 py-2.5 flex items-center gap-2.5"
        >
          <div className="relative flex-shrink-0">
            <Wand2 className="w-4 h-4 text-primary" />
            <Loader2 className="w-3 h-3 text-primary animate-spin absolute -bottom-0.5 -right-0.5" />
          </div>
          <p className="text-xs text-primary font-medium">
            AI is preparing suggestions based on your previous answers…
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
