"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";
import { TagInput } from "@/components/form-fields/tag-input";
import { TextSuggestion, TagsSuggestion, ValueSuggestion } from "@/components/ai/field-suggestion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { INDUSTRIES } from "@/lib/constants";
import { useFormStore } from "@/hooks/use-form-store";
import { useWizardErrors } from "@/contexts/wizard-context";

export function StepBusinessOverview() {
  const data = useFormStore((s) => s.data.businessOverview);
  const update = useFormStore((s) => s.updateBusinessOverview);
  const suggestions = useFormStore((s) => s.suggestions[2]) ?? {};
  const clearSuggestion = useFormStore((s) => s.clearSuggestion);
  const { errors } = useWizardErrors();

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Business Overview</h2>
        </div>
        <p className="text-muted-foreground text-sm ml-[42px]">
          Tell us about the brand — what you do, who you compete with, and what makes you different.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={fadeInUp}>
          <FieldWrapper label="Business Name" required error={errors["businessName"]}>
            <Input placeholder="Acme Co." value={data.businessName}
              onChange={(e) => update({ businessName: e.target.value })}
              className={errors["businessName"] ? "border-destructive" : ""} />
          </FieldWrapper>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <FieldWrapper label="Industry" required error={errors["industry"]}>
            {suggestions?.industry && !data.industry && (
              <ValueSuggestion label="Suggested" value={suggestions.industry}
                onAccept={(v) => { update({ industry: v }); clearSuggestion(2, "industry"); }}
                onDismiss={() => clearSuggestion(2, "industry")} />
            )}
            <Input placeholder="e.g. Fitness & Wellness" value={data.industry}
              onChange={(e) => update({ industry: e.target.value })}
              list="industries-list"
              className={errors["industry"] ? "border-destructive" : ""} />
            <datalist id="industries-list">
              {INDUSTRIES.map((i) => <option key={i} value={i} />)}
            </datalist>
          </FieldWrapper>
        </motion.div>
      </div>

      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Elevator Pitch" required error={errors["elevatorPitch"]}
          hint="2-3 sentences that capture what you do and for whom.">
          {suggestions?.elevatorPitch && !data.elevatorPitch && (
            <TextSuggestion value={suggestions.elevatorPitch}
              onAccept={(v) => { update({ elevatorPitch: v }); clearSuggestion(2, "elevatorPitch"); }}
              onDismiss={() => clearSuggestion(2, "elevatorPitch")} />
          )}
          <Textarea placeholder="We help ambitious fitness studios grow their online presence through strategic social media content that converts followers into members."
            value={data.elevatorPitch}
            onChange={(e) => update({ elevatorPitch: e.target.value })}
            rows={3}
            className={errors["elevatorPitch"] ? "border-destructive" : ""} />
        </FieldWrapper>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Products & Services" required error={errors["productsServices"]}
          hint="Add each one separately and press Enter.">
          {suggestions?.productsServices?.length > 0 && (
            <TagsSuggestion values={suggestions.productsServices}
              picked={data.productsServices}
              onAccept={(v) => { update({ productsServices: [...data.productsServices, ...v] }); clearSuggestion(2, "productsServices"); }}
              onAcceptOne={(v) => update({ productsServices: [...data.productsServices, v] })}
              onDismiss={() => clearSuggestion(2, "productsServices")} />
          )}
          <TagInput value={data.productsServices}
            onChange={(v) => update({ productsServices: v })}
            placeholder="Add a product or service…" maxTags={15} />
        </FieldWrapper>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Unique Selling Proposition" required error={errors["uniqueSellingProposition"]}
          hint="What makes you different from competitors?">
          {suggestions?.uniqueSellingProposition && !data.uniqueSellingProposition && (
            <TextSuggestion value={suggestions.uniqueSellingProposition}
              onAccept={(v) => { update({ uniqueSellingProposition: v }); clearSuggestion(2, "uniqueSellingProposition"); }}
              onDismiss={() => clearSuggestion(2, "uniqueSellingProposition")} />
          )}
          <Textarea placeholder="We're the only studio in the city offering AI-personalised workout plans alongside our group classes."
            value={data.uniqueSellingProposition}
            onChange={(e) => update({ uniqueSellingProposition: e.target.value })}
            rows={2}
            className={errors["uniqueSellingProposition"] ? "border-destructive" : ""} />
        </FieldWrapper>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Competitors" hint="Who are you up against?">
          {suggestions?.competitors?.length > 0 && (
            <TagsSuggestion values={suggestions.competitors}
              picked={data.competitors}
              onAccept={(v) => { update({ competitors: [...data.competitors, ...v] }); clearSuggestion(2, "competitors"); }}
              onAcceptOne={(v) => update({ competitors: [...data.competitors, v] })}
              onDismiss={() => clearSuggestion(2, "competitors")} />
          )}
          <TagInput value={data.competitors}
            onChange={(v) => update({ competitors: v })}
            placeholder="Add a competitor…" maxTags={10} />
        </FieldWrapper>
      </motion.div>
    </motion.div>
  );
}
