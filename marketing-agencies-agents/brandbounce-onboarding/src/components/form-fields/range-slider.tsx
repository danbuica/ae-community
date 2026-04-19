"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  step?: number;
  formatLabel?: (v: number) => string;
  className?: string;
}

export function RangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  step = 1,
  formatLabel = (v) => (v >= max ? `${v}+` : String(v)),
  className,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const toPercent = (v: number) => ((v - min) / (max - min)) * 100;

  const fromPercent = useCallback(
    (pct: number) => {
      const raw = (pct / 100) * (max - min) + min;
      return Math.round(raw / step) * step;
    },
    [min, max, step]
  );

  function getPercentFromEvent(e: React.MouseEvent | React.TouchEvent) {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }

  function handleMinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Math.min(Number(e.target.value), valueMax - step);
    onChange(v, valueMax);
  }

  function handleMaxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Math.max(Number(e.target.value), valueMin + step);
    onChange(valueMin, v);
  }

  const leftPct = toPercent(valueMin);
  const rightPct = toPercent(valueMax);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Track */}
      <div className="relative h-12 flex items-center" ref={trackRef}>
        {/* Background track */}
        <div className="w-full h-2 rounded-full bg-muted relative">
          {/* Active range fill */}
          <motion.div
            className="absolute h-full rounded-full gradient-brand"
            style={{
              left: `${leftPct}%`,
              right: `${100 - rightPct}%`,
            }}
            layout
          />
        </div>

        {/* Native range inputs (stacked, invisible handles replaced by motion thumbs) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={handleMinChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
          style={{ pointerEvents: dragging === "max" ? "none" : "auto" }}
          onMouseDown={() => setDragging("min")}
          onMouseUp={() => setDragging(null)}
          onTouchStart={() => setDragging("min")}
          onTouchEnd={() => setDragging(null)}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={handleMaxChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
          style={{ pointerEvents: dragging === "min" ? "none" : "auto" }}
          onMouseDown={() => setDragging("max")}
          onMouseUp={() => setDragging(null)}
          onTouchStart={() => setDragging("max")}
          onTouchEnd={() => setDragging(null)}
        />

        {/* Custom thumb — min */}
        <motion.div
          className="absolute z-10 w-5 h-5 rounded-full bg-white border-2 border-primary shadow-md shadow-primary/30 cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${leftPct}% - 10px)` }}
          animate={{ scale: dragging === "min" ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Tooltip */}
          <motion.div
            animate={{ opacity: dragging === "min" ? 1 : 0, y: dragging === "min" ? -28 : -20 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 gradient-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none"
          >
            {formatLabel(valueMin)}
          </motion.div>
        </motion.div>

        {/* Custom thumb — max */}
        <motion.div
          className="absolute z-10 w-5 h-5 rounded-full bg-white border-2 border-primary shadow-md shadow-primary/30 cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${rightPct}% - 10px)` }}
          animate={{ scale: dragging === "max" ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <motion.div
            animate={{ opacity: dragging === "max" ? 1 : 0, y: dragging === "max" ? -28 : -20 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 gradient-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none"
          >
            {formatLabel(valueMax)}
          </motion.div>
        </motion.div>
      </div>

      {/* Labels row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Age</span>
          <span className="font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 tabular-nums">
            {formatLabel(valueMin)}
          </span>
          <span className="text-muted-foreground">to</span>
          <span className="font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 tabular-nums">
            {formatLabel(valueMax)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {valueMax - valueMin} year span
        </span>
      </div>

      {/* Tick marks */}
      <div className="flex justify-between text-[10px] text-muted-foreground/60 -mt-2 px-0.5">
        {[13, 18, 25, 35, 45, 55, 65].map((v) => (
          <span key={v} className="tabular-nums">{v === 65 ? "65+" : v}</span>
        ))}
      </div>
    </div>
  );
}
