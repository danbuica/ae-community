"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";
import { swatchPop } from "@/lib/animations";
import type { BrandColor } from "@/types/onboarding";

const COLOR_ROLE_OPTIONS: BrandColor["role"][] = ["primary", "secondary", "accent", "neutral", "other"];

const ROLE_LABELS: Record<BrandColor["role"], string> = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  neutral: "Neutral",
  other: "Other",
};

function isValidHex(hex: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

interface ColorPickerProps {
  value: BrandColor[];
  onChange: (colors: BrandColor[]) => void;
  maxColors?: number;
  suggestedColors?: BrandColor[];
  onSuggestedAccept?: (color: BrandColor) => void;
}

export function ColorPicker({
  value,
  onChange,
  maxColors = 5,
  suggestedColors = [],
}: ColorPickerProps) {
  const [inputHex, setInputHex] = useState("#");
  const [inputName, setInputName] = useState("");
  const [inputRole, setInputRole] = useState<BrandColor["role"]>("primary");
  const [showAdd, setShowAdd] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  function addColor() {
    if (!isValidHex(inputHex)) return;
    if (value.find((c) => c.hex === inputHex)) return;
    onChange([...value, { hex: inputHex, name: inputName || inputHex, role: inputRole }]);
    setInputHex("#");
    setInputName("");
    setShowAdd(false);
  }

  function removeColor(hex: string) {
    onChange(value.filter((c) => c.hex !== hex));
  }

  function updateRole(hex: string, role: BrandColor["role"]) {
    onChange(value.map((c) => (c.hex === hex ? { ...c, role } : c)));
  }

  return (
    <div className="space-y-4">
      {/* Existing swatches */}
      <div className="flex flex-wrap gap-3">
        <AnimatePresence mode="popLayout">
          {value.map((color, i) => (
            <motion.div
              key={color.hex}
              custom={i}
              variants={swatchPop}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="group relative flex flex-col items-center gap-1"
            >
              {/* Swatch */}
              <div
                className="relative w-12 h-12 rounded-xl shadow-md ring-2 ring-white/30 dark:ring-white/10 cursor-pointer overflow-hidden"
                style={{ backgroundColor: color.hex }}
              >
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeColor(color.hex)}
                  className={cn(
                    "absolute top-0.5 right-0.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                    luminance(color.hex) > 0.5 ? "bg-black/40 text-white" : "bg-white/40 text-black"
                  )}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Hex label */}
              <span className="text-[10px] font-mono text-muted-foreground">{color.hex}</span>

              {/* Role selector */}
              <select
                value={color.role}
                onChange={(e) => updateRole(color.hex, e.target.value as BrandColor["role"])}
                className="text-[10px] bg-transparent border border-border rounded px-1 py-0 text-muted-foreground cursor-pointer focus:outline-none focus:border-primary w-20 text-center"
              >
                {COLOR_ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add button */}
        {value.length < maxColors && (
          <motion.button
            type="button"
            onClick={() => setShowAdd(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center text-muted-foreground hover:text-primary transition-all"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Suggested colors from AI / logo scrape */}
      <AnimatePresence>
        {suggestedColors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Pipette className="w-3 h-3" />
              Suggested from your logo
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedColors.map((color) => (
                <motion.button
                  key={color.hex}
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (!value.find((c) => c.hex === color.hex)) {
                      onChange([...value, color]);
                    }
                  }}
                  disabled={!!value.find((c) => c.hex === color.hex)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 hover:border-primary/40 px-2 py-1.5 text-xs transition-all disabled:opacity-40"
                >
                  <div
                    className="w-5 h-5 rounded-md shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="font-mono text-muted-foreground">{color.hex}</span>
                  <span className="text-muted-foreground/60">{ROLE_LABELS[color.role]}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add color form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-muted/30 p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              {/* Native color input as visual picker */}
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-lg cursor-pointer shadow-sm ring-2 ring-border"
                  style={{ backgroundColor: isValidHex(inputHex) ? inputHex : "#7C3AED" }}
                  onClick={() => colorInputRef.current?.click()}
                />
                <input
                  ref={colorInputRef}
                  type="color"
                  value={isValidHex(inputHex) ? inputHex : "#7C3AED"}
                  onChange={(e) => setInputHex(e.target.value.toUpperCase())}
                  className="sr-only"
                />
              </div>

              {/* Hex input */}
              <div className="flex-1">
                <input
                  type="text"
                  value={inputHex}
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase();
                    setInputHex(v.startsWith("#") ? v : `#${v}`);
                  }}
                  maxLength={7}
                  placeholder="#7C3AED"
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              {/* Name input */}
              <div className="flex-1">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Color name (optional)"
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            {/* Role selector */}
            <div className="flex gap-1.5 flex-wrap">
              {COLOR_ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setInputRole(role)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full border transition-all",
                    inputRole === role
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {ROLE_LABELS[role]}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={addColor}
                disabled={!isValidHex(inputHex)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-1.5 rounded-lg gradient-brand text-white text-sm font-medium disabled:opacity-40 disabled:pointer-events-none"
              >
                Add Color
              </motion.button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:border-primary/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
