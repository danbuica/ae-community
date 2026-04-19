"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";
import { TagInput } from "@/components/form-fields/tag-input";
import { RangeSlider } from "@/components/form-fields/range-slider";
import { TextSuggestion, TagsSuggestion, ValueSuggestion } from "@/components/ai/field-suggestion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useFormStore } from "@/hooks/use-form-store";
import { useWizardErrors } from "@/contexts/wizard-context";


export function StepTargetAudience() {
  const data = useFormStore((s) => s.data.targetAudience);
  const update = useFormStore((s) => s.updateTargetAudience);
  const suggestions = useFormStore((s) => s.suggestions[4]) ?? {};
  const clearSuggestion = useFormStore((s) => s.clearSuggestion);
  const { errors } = useWizardErrors();

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Target Audience</h2>
        </div>
        <p className="text-muted-foreground text-sm ml-[42px]">
          Who are you talking to? The more specific, the better the content.
        </p>
      </motion.div>

      {/* Audience description */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Audience Description" required error={errors["audienceDescription"]}
          hint="A vivid description of your ideal customer.">
          {suggestions?.audienceDescription && !data.audienceDescription && (
            <TextSuggestion value={suggestions.audienceDescription}
              onAccept={(v) => { update({ audienceDescription: v }); clearSuggestion(4, "audienceDescription"); }}
              onDismiss={() => clearSuggestion(4, "audienceDescription")} />
          )}
          <Textarea placeholder="Young urban professionals aged 25-35 who are passionate about fitness..."
            value={data.audienceDescription}
            onChange={(e) => update({ audienceDescription: e.target.value })}
            rows={3}
            className={errors["audienceDescription"] ? "border-destructive" : ""} />
        </FieldWrapper>
      </motion.div>

      {/* Age range */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Age Range" error={errors["ageMin"] || errors["ageMax"]}>
          {suggestions?.ageMin != null && suggestions?.ageMax != null && data.ageMin === 18 && data.ageMax === 45 && (
            <ValueSuggestion label="Suggested range" value={`${suggestions.ageMin}–${suggestions.ageMax}`}
              onAccept={() => { update({ ageMin: suggestions.ageMin, ageMax: suggestions.ageMax }); clearSuggestion(4, "ageMin"); clearSuggestion(4, "ageMax"); }}
              onDismiss={() => { clearSuggestion(4, "ageMin"); clearSuggestion(4, "ageMax"); }} />
          )}
          <div className="pt-2">
            <RangeSlider min={13} max={65} valueMin={data.ageMin} valueMax={data.ageMax}
              onChange={(min, max) => update({ ageMin: min, ageMax: max })} />
          </div>
        </FieldWrapper>
      </motion.div>

      {/* Locations */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Target Locations" required error={errors["locations"]}
          hint="Cities, countries, or regions.">
          {suggestions?.locations?.length > 0 && (
            <TagsSuggestion values={suggestions.locations}
              picked={data.locations}
              onAccept={(v) => { update({ locations: [...data.locations, ...v] }); clearSuggestion(4, "locations"); }}
              onAcceptOne={(v) => update({ locations: [...data.locations, v] })}
              onDismiss={() => clearSuggestion(4, "locations")} />
          )}
          <TagInput value={data.locations}
            onChange={(v) => update({ locations: v })}
            placeholder="e.g. New York, United States…" maxTags={10} />
        </FieldWrapper>
      </motion.div>

      {/* Interests */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Interests & Hobbies" required error={errors["interests"]}
          hint="What does your audience care about beyond your product?">
          {suggestions?.interests?.length > 0 && (
            <TagsSuggestion values={suggestions.interests}
              picked={data.interests}
              onAccept={(v) => { update({ interests: [...data.interests, ...v] }); clearSuggestion(4, "interests"); }}
              onAcceptOne={(v) => update({ interests: [...data.interests, v] })}
              onDismiss={() => clearSuggestion(4, "interests")} />
          )}
          <TagInput value={data.interests}
            onChange={(v) => update({ interests: v })}
            placeholder="e.g. yoga, travel, cooking…" maxTags={15} />
        </FieldWrapper>
      </motion.div>

      {/* Pain points */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Pain Points" required error={errors["painPoints"]}
          hint="What problems does your audience face that you solve?">
          {suggestions?.painPoints && !data.painPoints && (
            <TextSuggestion value={suggestions.painPoints}
              onAccept={(v) => { update({ painPoints: v }); clearSuggestion(4, "painPoints"); }}
              onDismiss={() => clearSuggestion(4, "painPoints")} />
          )}
          <Textarea placeholder="Not enough time to meal prep..."
            value={data.painPoints}
            onChange={(e) => update({ painPoints: e.target.value })}
            rows={2}
            className={errors["painPoints"] ? "border-destructive" : ""} />
        </FieldWrapper>
      </motion.div>
    </motion.div>
  );
}
