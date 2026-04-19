"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LogoUploadProps {
  value: string;           // URL of uploaded logo
  onChange: (url: string) => void;
  onSuggestColors?: (colors: { hex: string; name: string; role: "primary" | "secondary" | "accent" }[]) => void;
  className?: string;
}

export function LogoUpload({ value, onChange, onSuggestColors, className }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;

      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error("Upload failed");
        const { url } = await res.json();
        onChange(url);

        // Trigger AI color extraction if handler provided
        if (onSuggestColors) {
          setExtracting(true);
          try {
            const aiRes = await fetch("/api/ai/suggest", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "logo-colors",
                context: { imageUrl: url },
              }),
            });
            if (aiRes.ok) {
              const { suggestions } = await aiRes.json();
              if (Array.isArray(suggestions)) onSuggestColors(suggestions);
            }
          } finally {
            setExtracting(false);
          }
        }
      } catch {
        toast.error("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange, onSuggestColors]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading,
  });

  function clearLogo() {
    onChange("");
  }

  return (
    <div className={cn("space-y-3", className)}>
      <AnimatePresence mode="wait">
        {value ? (
          /* Preview state */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative group w-fit"
          >
            <div className="w-32 h-32 rounded-2xl border-2 border-border bg-muted/30 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Brand logo"
                className="w-full h-full object-contain p-3"
              />
            </div>
            <motion.button
              type="button"
              onClick={clearLogo}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </motion.button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {extracting ? (
                <span className="inline-flex items-center gap-1.5 text-primary">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Extracting brand colors…
                </span>
              ) : (
                "Logo uploaded ✓"
              )}
            </p>
          </motion.div>
        ) : (
          /* Drop zone */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer h-36 overflow-hidden",
                dragActive
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-muted/30",
                uploading && "pointer-events-none"
              )}
            >
            <input {...getInputProps()} />

            {/* Animated dashes on drag */}
            <AnimatePresence>
              {dragActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl border-2 border-primary"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 8px,
                      oklch(0.49 0.27 290 / 0.1) 8px,
                      oklch(0.49 0.27 290 / 0.1) 16px
                    )`,
                  }}
                />
              )}
            </AnimatePresence>

            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Uploading…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground relative z-10">
                <motion.div
                  animate={dragActive ? { scale: 1.2, rotate: -5 } : { scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {dragActive ? (
                    <ImageIcon className="w-8 h-8 text-primary" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </motion.div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {dragActive ? "Drop it!" : "Drop your logo here"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    PNG, JPG, SVG, WebP · max 5MB
                  </p>
                </div>
              </div>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!value && !uploading && (
        <p className="text-xs text-muted-foreground">
          We&apos;ll automatically extract your brand colors from the logo.
        </p>
      )}
    </div>
  );
}
