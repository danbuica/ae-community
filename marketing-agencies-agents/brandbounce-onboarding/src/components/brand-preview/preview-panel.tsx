"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Palette, ImageIcon, Zap, Heart, MessageCircle, Send, Bookmark, MoreHorizontal,
} from "lucide-react";
import { useFormStore } from "@/hooks/use-form-store";
import { ARCHETYPES, PLATFORMS } from "@/lib/constants";

// ── Utility ──────────────────────────────────────────────────

function luminance(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// ── Preview Panel ────────────────────────────────────────────

export function PreviewPanel() {
  const { businessOverview, brandIdentity } = useFormStore((s) => s.data);

  const primary = brandIdentity.brandColors[0]?.hex ?? "#7C3AED";
  const secondary = brandIdentity.brandColors[1]?.hex ?? "#F43F5E";
  const hasName = !!businessOverview.businessName;

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md gradient-brand flex items-center justify-center">
            <Zap className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="text-xs font-semibold">Live Preview</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">Updates as you fill in details</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">

        {/* ── Brand identity card ──────────────────────────── */}
        <div className="rounded-xl border border-border bg-card">
          {/* Gradient banner */}
          <motion.div
            className="h-16 w-full relative rounded-t-xl overflow-hidden"
            animate={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative circles */}
            <div className="absolute -right-3 -top-3 w-12 h-12 rounded-full opacity-20 bg-white" />
            <div className="absolute right-8 -bottom-2 w-6 h-6 rounded-full opacity-15 bg-white" />
          </motion.div>

          <div className="px-3 pb-3">
            {/* Logo + Name */}
            <div className="flex items-center gap-3 -mt-6 mb-2 relative z-10">
              <motion.div
                className="w-10 h-10 rounded-xl border-2 border-card bg-muted flex items-center justify-center overflow-hidden shadow-md flex-shrink-0"
                animate={{ borderColor: primary }}
                transition={{ duration: 0.4 }}
              >
                {brandIdentity.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brandIdentity.logoUrl} alt="logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                )}
              </motion.div>
            </div>
            <div className="mt-1.5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={businessOverview.businessName || "placeholder"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`text-sm font-bold leading-tight truncate ${!hasName ? "text-muted-foreground italic" : ""}`}
                >
                  {hasName ? businessOverview.businessName : "Your Brand"}
                </motion.p>
              </AnimatePresence>
              {businessOverview.industry && (
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">{businessOverview.industry}</p>
              )}
            </div>

            {/* Archetypes */}
            {brandIdentity.archetypes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {brandIdentity.archetypes.map((id) => {
                  const a = ARCHETYPES.find((x) => x.id === id);
                  if (!a) return null;
                  return (
                    <motion.span
                      key={id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[10px] px-1.5 py-0.5 rounded-full border flex items-center gap-0.5"
                      style={{
                        borderColor: `${a.color}40`,
                        backgroundColor: `${a.color}15`,
                        color: a.color,
                      }}
                    >
                      {a.emoji} {a.label}
                    </motion.span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Color palette ─────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Palette className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Colors</span>
          </div>

          {brandIdentity.brandColors.length > 0 ? (
            <div className="space-y-1.5">
              {/* Full-width gradient bar */}
              <motion.div
                className="h-6 w-full rounded-lg overflow-hidden flex"
                layout
              >
                {brandIdentity.brandColors.map((color, i) => (
                  <motion.div
                    key={color.hex}
                    className="h-full flex-1"
                    style={{ backgroundColor: color.hex }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    layout
                  />
                ))}
              </motion.div>

              {/* Individual swatches with labels */}
              <div className="flex gap-1.5 flex-wrap">
                {brandIdentity.brandColors.map((color) => (
                  <motion.div
                    key={color.hex}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div
                      className="w-7 h-7 rounded-lg shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span
                      className="text-[9px] font-mono"
                      style={{ color: luminance(color.hex) > 0.5 ? "#555" : "#aaa" }}
                    >
                      {color.hex}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Tone keywords */}
              {brandIdentity.toneKeywords.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {brandIdentity.toneKeywords.slice(0, 4).map((kw) => (
                    <span key={kw}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-1.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-lg bg-muted animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
        </div>

        {/* ── Platform badges ───────────────────────────────── */}
        <PlatformBadges />

        {/* ── Mock Instagram post ───────────────────────────── */}
        <MockPost />

      </div>
    </div>
  );
}

// ── Platform Badges ──────────────────────────────────────────

function PlatformBadges() {
  const platforms = useFormStore((s) => s.data.contentStrategy.platforms);
  const freqs = useFormStore((s) => s.data.contentStrategy.platformFrequencies);

  if (platforms.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Platforms</p>
      <div className="flex flex-wrap gap-1">
        {platforms.map((id) => {
          const meta = PLATFORMS.find((p) => p.id === id);
          const freq = freqs.find((f) => f.platform === id);
          if (!meta) return null;
          return (
            <motion.div
              key={id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border"
              style={{ borderColor: `${meta.color}40`, color: meta.color, backgroundColor: `${meta.color}10` }}
            >
              <span className="font-medium">{meta.label}</span>
              {freq && <span className="opacity-60">{freq.postsPerWeek}×/wk</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mock Instagram Post ──────────────────────────────────────

function MockPost() {
  const { businessOverview, brandIdentity, contentStrategy, targetAudience } = useFormStore((s) => s.data);

  const primary = brandIdentity.brandColors[0]?.hex ?? "#7C3AED";
  const secondary = brandIdentity.brandColors[1]?.hex ?? "#F43F5E";
  const businessName = businessOverview.businessName || "yourbrand";
  const handle = businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const pillar = contentStrategy.contentPillars[0];
  const pillar2 = contentStrategy.contentPillars[1];
  const hashtags = contentStrategy.hashtagGroups.flatMap((g) => g.hashtags).slice(0, 4);
  const textOnBg = luminance(primary) > 0.5 ? "#1a1a1a" : "#ffffff";

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 mb-2">
        {/* Instagram gradient icon */}
        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{
          background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)"
        }} />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Post Preview</span>
      </div>

      <div className="rounded-xl overflow-hidden border border-border/60 text-[11px]">
        {/* Post header */}
        <div className="flex items-center gap-2 px-2.5 py-2 bg-card">
          <div className="w-6 h-6 rounded-full flex-shrink-0 ring-1 ring-border overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
            {brandIdentity.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brandIdentity.logoUrl} alt="" className="w-full h-full object-contain p-0.5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[11px] leading-tight truncate">@{handle}</p>
            <p className="text-[9px] text-muted-foreground">Sponsored</p>
          </div>
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        </div>

        {/* Post image */}
        <motion.div
          className="aspect-square relative flex flex-col items-center justify-center overflow-hidden"
          animate={{ background: `linear-gradient(145deg, ${primary}ee, ${secondary}cc)` }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative circles */}
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-white" />
          <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full opacity-10 bg-white" />
          <div className="absolute right-4 bottom-8 w-8 h-8 rounded-full opacity-15 bg-white" />

          <div className="relative z-10 text-center px-6 space-y-2">
            <AnimatePresence mode="wait">
              {pillar ? (
                <motion.div key="pillar"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: `${textOnBg}99` }}>
                    {businessOverview.industry || "Content"}
                  </p>
                  <p className="text-base font-bold leading-tight" style={{ color: textOnBg }}>
                    {pillar}
                  </p>
                  {pillar2 && (
                    <p className="text-[11px] font-medium opacity-80" style={{ color: textOnBg }}>
                      + {pillar2}
                    </p>
                  )}
                  {targetAudience.audienceDescription && (
                    <p className="text-[10px] leading-relaxed opacity-70 line-clamp-2 max-w-[140px] mx-auto" style={{ color: textOnBg }}>
                      {targetAudience.audienceDescription.slice(0, 60)}…
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div key="placeholder"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="space-y-2">
                  <div className="h-1.5 w-16 rounded-full bg-white/30 mx-auto" />
                  <div className="h-4 w-28 rounded bg-white/20 mx-auto" />
                  <div className="h-1.5 w-20 rounded-full bg-white/30 mx-auto" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Brand name watermark */}
          <div className="absolute bottom-2 right-2 text-[9px] font-semibold opacity-40" style={{ color: textOnBg }}>
            {businessName}
          </div>
        </motion.div>

        {/* Action bar */}
        <div className="flex items-center gap-3 px-2.5 py-1.5 bg-card">
          <Heart className="w-3.5 h-3.5 text-muted-foreground" />
          <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
          <Send className="w-3.5 h-3.5 text-muted-foreground" />
          <Bookmark className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
        </div>

        {/* Caption */}
        <div className="px-2.5 pb-2.5 bg-card space-y-1">
          <p className="font-semibold text-[10px]">@{handle}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={brandIdentity.brandVoiceDescription.slice(0, 20) || "empty"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-foreground/80 leading-relaxed line-clamp-2"
            >
              {brandIdentity.brandVoiceDescription
                ? brandIdentity.brandVoiceDescription.slice(0, 90) + "…"
                : <span className="text-muted-foreground italic">Your caption will appear here once you fill in your brand voice…</span>
              }
            </motion.p>
          </AnimatePresence>
          {hashtags.length > 0 && (
            <p className="text-[10px] leading-relaxed" style={{ color: primary }}>
              {hashtags.map((h) => `#${h}`).join(" ")}
            </p>
          )}
          <p className="text-[9px] text-muted-foreground">2 minutes ago</p>
        </div>
      </div>
    </div>
  );
}
