"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";
import { TagInput } from "@/components/form-fields/tag-input";
import { ColorPicker } from "@/components/form-fields/color-picker";
import { LogoUpload } from "@/components/form-fields/logo-upload";
import { ArchetypeSelector } from "@/components/form-fields/archetype-selector";
import { TextSuggestion, TagsSuggestion } from "@/components/ai/field-suggestion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { TONE_KEYWORD_SUGGESTIONS } from "@/lib/constants";
import { useFormStore } from "@/hooks/use-form-store";
import { useWizardErrors } from "@/contexts/wizard-context";
import type { BrandColor, BrandArchetype } from "@/types/onboarding";

export function StepBrandIdentity() {
  const data = useFormStore((s) => s.data.brandIdentity);
  const update = useFormStore((s) => s.updateBrandIdentity);
  const suggestions = useFormStore((s) => s.suggestions[3]) ?? {};
  const clearSuggestion = useFormStore((s) => s.clearSuggestion);
  const { errors } = useWizardErrors();

  const [suggestedColors, setSuggestedColors] = useState<BrandColor[]>([]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <Palette className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Brand Identity</h2>
        </div>
        <p className="text-muted-foreground text-sm ml-[42px]">
          Upload your logo, choose your colors, and define your brand personality.
        </p>
      </motion.div>

      {/* Logo */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Brand Logo" hint="PNG, JPG, or SVG · max 5MB · AI will extract your brand colors">
          <LogoUpload value={data.logoUrl}
            onChange={(url) => update({ logoUrl: url })}
            onSuggestColors={(colors) => setSuggestedColors(colors)} />
        </FieldWrapper>
      </motion.div>

      {/* Colors */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Brand Colors" required error={errors["brandColors"]}
          hint="Add up to 5 colors. Click the + to add, or accept suggestions from your logo.">
          <ColorPicker value={data.brandColors}
            onChange={(colors) => update({ brandColors: colors })}
            suggestedColors={suggestedColors} />
        </FieldWrapper>
      </motion.div>

      {/* Archetypes */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Brand Personality" required error={errors["archetypes"]}
          hint="Select up to 3 archetypes. These shape your tone and content style.">
          {suggestions?.archetypes?.length > 0 && (
            <TagsSuggestion values={suggestions.archetypes}
              picked={data.archetypes}
              onAccept={(v) => { update({ archetypes: [...data.archetypes, ...v] as BrandArchetype[] }); clearSuggestion(3, "archetypes"); }}
              onAcceptOne={(v) => update({ archetypes: [...data.archetypes, v as BrandArchetype] })}
              onDismiss={() => clearSuggestion(3, "archetypes")} />
          )}
          <ArchetypeSelector value={data.archetypes}
            onChange={(archetypes) => update({ archetypes })} />
        </FieldWrapper>
      </motion.div>

      {/* Tone keywords */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Tone of Voice Keywords" required error={errors["toneKeywords"]}
          hint="Words that describe how your brand sounds. Type your own or pick from suggestions.">
          {suggestions?.toneKeywords?.length > 0 && (
            <TagsSuggestion values={suggestions.toneKeywords}
              picked={data.toneKeywords}
              onAccept={(v) => { update({ toneKeywords: [...data.toneKeywords, ...v] }); clearSuggestion(3, "toneKeywords"); }}
              onAcceptOne={(v) => update({ toneKeywords: [...data.toneKeywords, v] })}
              onDismiss={() => clearSuggestion(3, "toneKeywords")} />
          )}
          <TagInput value={data.toneKeywords}
            onChange={(v) => update({ toneKeywords: v })}
            suggestions={TONE_KEYWORD_SUGGESTIONS}
            placeholder="e.g. bold, witty, empathetic…"
            maxTags={10} />
        </FieldWrapper>
      </motion.div>

      {/* Brand voice description */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Brand Voice Description" required error={errors["brandVoiceDescription"]}
          hint="How does your brand talk? Include do's and don'ts.">
          {suggestions?.brandVoiceDescription && !data.brandVoiceDescription && (
            <TextSuggestion value={suggestions.brandVoiceDescription}
              onAccept={(v) => { update({ brandVoiceDescription: v }); clearSuggestion(3, "brandVoiceDescription"); }}
              onDismiss={() => clearSuggestion(3, "brandVoiceDescription")} />
          )}
          <Textarea placeholder="We speak like a knowledgeable friend — warm, direct, and never condescending..."
            value={data.brandVoiceDescription}
            onChange={(e) => update({ brandVoiceDescription: e.target.value })}
            rows={4}
            className={errors["brandVoiceDescription"] ? "border-destructive" : ""} />
        </FieldWrapper>
      </motion.div>
    </motion.div>
  );
}
