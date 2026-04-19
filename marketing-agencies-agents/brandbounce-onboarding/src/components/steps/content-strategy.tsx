"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";
import { TagInput } from "@/components/form-fields/tag-input";
import { PlatformSelector } from "@/components/form-fields/platform-selector";
import { SortableList } from "@/components/form-fields/sortable-list";

import { TagsSuggestion } from "@/components/ai/field-suggestion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { PLATFORMS } from "@/lib/constants";
import { useFormStore } from "@/hooks/use-form-store";
import { useWizardErrors } from "@/contexts/wizard-context";
import type { Platform, PlatformFrequency } from "@/types/onboarding";

export function StepContentStrategy() {
  const data = useFormStore((s) => s.data.contentStrategy);
  const update = useFormStore((s) => s.updateContentStrategy);
  const suggestions = useFormStore((s) => s.suggestions[5]) ?? {};
  const clearSuggestion = useFormStore((s) => s.clearSuggestion);
  const { errors } = useWizardErrors();

  function handlePlatformChange(platforms: Platform[]) {
    const currentFreqs = data.platformFrequencies;
    const updated: PlatformFrequency[] = platforms.map((p) => {
      const existing = currentFreqs.find((f) => f.platform === p);
      return existing ?? { platform: p, postsPerWeek: 3 };
    });
    update({ platforms, platformFrequencies: updated });
  }

  function acceptPlatformSuggestions(platforms: string[]) {
    const validPlatforms = platforms as Platform[];
    const freqs: PlatformFrequency[] = suggestions?.platformFrequencies
      ? (suggestions.platformFrequencies as { platform: Platform; postsPerWeek: number }[])
      : validPlatforms.map((p) => ({ platform: p, postsPerWeek: 3 }));
    update({ platforms: validPlatforms, platformFrequencies: freqs });
    clearSuggestion(5, "platforms");
    clearSuggestion(5, "platformFrequencies");
  }

  function handleFreqChange(platform: Platform, postsPerWeek: number) {
    update({
      platformFrequencies: data.platformFrequencies.map((f) =>
        f.platform === platform ? { ...f, postsPerWeek } : f
      ),
    });
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Content Strategy</h2>
        </div>
        <p className="text-muted-foreground text-sm ml-[42px]">
          Platforms, pillars, formats, and hashtags — the engine of your content machine.
        </p>
      </motion.div>

      {/* Platforms */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Active Platforms" required error={errors["platforms"]}
          hint="Select all the platforms you want to post on.">
          {suggestions?.platforms?.length > 0 && (
            <TagsSuggestion values={suggestions.platforms}
              picked={data.platforms}
              onAccept={acceptPlatformSuggestions}
              onDismiss={() => { clearSuggestion(5, "platforms"); clearSuggestion(5, "platformFrequencies"); }} />
          )}
          <PlatformSelector value={data.platforms} onChange={handlePlatformChange} />
        </FieldWrapper>
      </motion.div>

      {/* Posting frequency */}
      <AnimatePresence>
        {data.platforms.length > 0 && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <FieldWrapper label="Posts Per Week"
              hint="How often do you want to post on each platform?">
              <div className="space-y-2">
                {data.platforms.map((platform) => {
                  const freq = data.platformFrequencies.find((f) => f.platform === platform);
                  const meta = PLATFORMS.find((p) => p.id === platform)!;
                  return (
                    <div key={platform} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                        <span className="text-sm font-medium">{meta.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleFreqChange(platform, Math.max(0, (freq?.postsPerWeek ?? 3) - 1))}
                          className="w-6 h-6 rounded-full border border-border hover:border-primary flex items-center justify-center text-sm transition-colors">−</button>
                        <span className="text-sm font-semibold w-4 text-center tabular-nums">{freq?.postsPerWeek ?? 3}</span>
                        <button onClick={() => handleFreqChange(platform, Math.min(21, (freq?.postsPerWeek ?? 3) + 1))}
                          className="w-6 h-6 rounded-full border border-border hover:border-primary flex items-center justify-center text-sm transition-colors">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FieldWrapper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content pillars */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Content Pillars" required error={errors["contentPillars"]}
          hint="3–7 themes your content will revolve around.">
          {suggestions?.contentPillars?.length > 0 && (
            <TagsSuggestion values={suggestions.contentPillars}
              picked={data.contentPillars}
              onAccept={(v) => { update({ contentPillars: [...data.contentPillars, ...v] }); clearSuggestion(5, "contentPillars"); }}
              onAcceptOne={(v) => update({ contentPillars: [...data.contentPillars, v] })}
              onDismiss={() => clearSuggestion(5, "contentPillars")} />
          )}
          <TagInput value={data.contentPillars}
            onChange={(v) => update({ contentPillars: v })}
            placeholder="e.g. Behind the scenes, Customer stories…" maxTags={7} />
        </FieldWrapper>
      </motion.div>

      {/* Content format order */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Content Format Priority"
          hint="Drag to rank your preferred content formats, #1 first.">
          <SortableList value={data.contentFormatOrder}
            onChange={(formats) => update({ contentFormatOrder: formats })} />
        </FieldWrapper>
      </motion.div>

      {/* Hashtags */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Hashtag Strategy"
          hint="Hashtag groups based on your content pillars.">
          <div className="space-y-2">
            {data.hashtagGroups.length > 0 ? (
              data.hashtagGroups.map((group) => (
                <div key={group.pillar} className="rounded-lg border border-border bg-muted/30 p-2.5">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{group.pillar}</p>
                  <div className="flex flex-wrap gap-1">
                    {group.hashtags.slice(0, 8).map((tag) => (
                      <span key={tag} className="text-[11px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">#{tag}</span>
                    ))}
                    {group.hashtags.length > 8 && (
                      <span className="text-[11px] text-muted-foreground">+{group.hashtags.length - 8} more</span>
                    )}
                  </div>
                </div>
              ))
            ) : suggestions?.hashtagGroups?.length > 0 ? (
              <>
                {suggestions.hashtagGroups.map((group: { pillar: string; hashtags: string[] }) => (
                  <div key={group.pillar} className="rounded-lg border border-primary/20 bg-primary/5 p-2.5">
                    <p className="text-xs font-medium text-primary mb-1">{group.pillar}</p>
                    <div className="flex flex-wrap gap-1">
                      {group.hashtags.map((tag: string) => (
                        <span key={tag} className="text-[11px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button onClick={() => { update({ hashtagGroups: suggestions.hashtagGroups }); clearSuggestion(5, "hashtagGroups"); }}
                    className="flex-1 py-1.5 rounded-lg gradient-brand text-white text-xs font-medium">
                    Use these hashtags
                  </button>
                  <button onClick={() => clearSuggestion(5, "hashtagGroups")}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground">
                    Dismiss
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground italic">Hashtags will be generated based on your content pillars.</p>
            )}
          </div>
        </FieldWrapper>
      </motion.div>

      {/* Topics to avoid */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Topics to Avoid"
          hint="Subjects, keywords, or associations to keep off your feed.">
          <TagInput value={data.topicsToAvoid}
            onChange={(v) => update({ topicsToAvoid: v })}
            placeholder="e.g. politics, competitors by name…" maxTags={15} />
        </FieldWrapper>
      </motion.div>

    </motion.div>
  );
}
