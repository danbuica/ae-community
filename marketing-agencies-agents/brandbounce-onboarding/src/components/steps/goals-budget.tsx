"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";
import { KeyDatesRepeater } from "@/components/form-fields/repeater-field";
import { ValueSuggestion } from "@/components/ai/field-suggestion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { KPIS, AD_BUDGET_OPTIONS, APPROVAL_WORKFLOW_OPTIONS, PLATFORMS } from "@/lib/constants";
import { useFormStore } from "@/hooks/use-form-store";
import { useWizardErrors } from "@/contexts/wizard-context";
import type { KPI } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function StepGoalsBudget() {
  const data = useFormStore((s) => s.data.goalsBudget);
  const platforms = useFormStore((s) => s.data.contentStrategy.platforms);
  const update = useFormStore((s) => s.updateGoalsBudget);
  const addKeyDate = useFormStore((s) => s.addKeyDate);
  const removeKeyDate = useFormStore((s) => s.removeKeyDate);
  const suggestions = useFormStore((s) => s.suggestions[6]) ?? {};
  const clearSuggestion = useFormStore((s) => s.clearSuggestion);
  const { errors } = useWizardErrors();

  function toggleKpi(kpi: KPI) {
    if (data.kpis.includes(kpi)) {
      update({ kpis: data.kpis.filter((k) => k !== kpi) });
    } else {
      update({ kpis: [...data.kpis, kpi] });
    }
  }

  function updateHandle(platform: string, handle: string) {
    const existing = data.socialHandles.filter((h) => h.platform !== platform);
    if (handle) {
      update({ socialHandles: [...existing, { platform: platform as never, handle }] });
    } else {
      update({ socialHandles: existing });
    }
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Goals & Budget</h2>
        </div>
        <p className="text-muted-foreground text-sm ml-[42px]">
          What does success look like? KPIs, budget, and how you want to work together.
        </p>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Primary KPIs" required error={errors["kpis"]}
          hint="Select all that apply. These guide our content decisions.">
          {suggestions?.kpis?.length > 0 && data.kpis.length === 0 && (
            <ValueSuggestion
              label="Recommended"
              value={suggestions.kpis.map((id: string) => KPIS.find((k) => k.id === id)?.label ?? id).join(", ")}
              onAccept={() => { update({ kpis: suggestions.kpis as KPI[] }); clearSuggestion(6, "kpis"); }}
              onDismiss={() => clearSuggestion(6, "kpis")} />
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {KPIS.map((kpi) => {
              const isSelected = data.kpis.includes(kpi.id);
              return (
                <motion.button key={kpi.id} type="button"
                  onClick={() => toggleKpi(kpi.id)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all",
                    isSelected ? "border-primary bg-primary/8 shadow-sm" : "border-border hover:border-primary/40 bg-card"
                  )}>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="text-xl">{kpi.emoji}</span>
                  <p className={cn("text-xs font-semibold", isSelected ? "text-primary" : "")}>{kpi.label}</p>
                  <p className="text-[10px] text-muted-foreground">{kpi.description}</p>
                </motion.button>
              );
            })}
          </div>
        </FieldWrapper>
      </motion.div>

      {/* Budget + Approval */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={fadeInUp}>
          <FieldWrapper label="Monthly Ad Budget" required error={errors["adBudget"]}>
            {suggestions?.adBudget && !data.adBudget && (
              <ValueSuggestion label="Suggested" value={AD_BUDGET_OPTIONS.find((o) => o.value === suggestions.adBudget)?.label ?? suggestions.adBudget}
                onAccept={() => { update({ adBudget: suggestions.adBudget as never }); clearSuggestion(6, "adBudget"); }}
                onDismiss={() => clearSuggestion(6, "adBudget")} />
            )}
            <Select value={data.adBudget} onValueChange={(v) => update({ adBudget: v as never })}>
              <SelectTrigger className={errors["adBudget"] ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a range…" />
              </SelectTrigger>
              <SelectContent>
                {AD_BUDGET_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <FieldWrapper label="Approval Workflow" required error={errors["approvalWorkflow"]}
            hint="How do you want to review content?">
            {suggestions?.approvalWorkflow && !data.approvalWorkflow && (
              <ValueSuggestion label="Suggested" value={APPROVAL_WORKFLOW_OPTIONS.find((o) => o.value === suggestions.approvalWorkflow)?.label ?? suggestions.approvalWorkflow}
                onAccept={() => { update({ approvalWorkflow: suggestions.approvalWorkflow as never }); clearSuggestion(6, "approvalWorkflow"); }}
                onDismiss={() => clearSuggestion(6, "approvalWorkflow")} />
            )}
            <Select value={data.approvalWorkflow} onValueChange={(v) => update({ approvalWorkflow: v as never })}>
              <SelectTrigger className={errors["approvalWorkflow"] ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a workflow…" />
              </SelectTrigger>
              <SelectContent>
                {APPROVAL_WORKFLOW_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>
        </motion.div>
      </div>

      {/* Key dates */}
      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Key Dates & Events"
          hint="Product launches, seasonal moments, campaigns — we'll plan content around these.">
          <KeyDatesRepeater value={data.keyDates}
            onAdd={addKeyDate}
            onRemove={removeKeyDate}
            onChange={(id, field, value) => {
              update({
                keyDates: data.keyDates.map((d) => d.id === id ? { ...d, [field]: value } : d),
              });
            }} />
        </FieldWrapper>
      </motion.div>

      {/* Social handles */}
      <AnimatePresence>
        {platforms.length > 0 && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <FieldWrapper label="Social Media Handles"
              hint="Your usernames on each platform (without the @).">
              <div className="space-y-2">
                {platforms.map((platform) => {
                  const meta = PLATFORMS.find((p) => p.id === platform)!;
                  const existing = data.socialHandles.find((h) => h.platform === platform);
                  return (
                    <div key={platform} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ color: meta.color }}>
                        {meta.label.slice(0, 2)}
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                        <Input placeholder={`your${platform}handle`}
                          value={existing?.handle ?? ""}
                          onChange={(e) => updateHandle(platform, e.target.value)}
                          className="pl-7 text-sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </FieldWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
