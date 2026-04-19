"use client";

import { motion } from "framer-motion";
import { CheckCircle, Edit2, User, Building2, Palette, Users, LayoutGrid, Target } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { useFormStore } from "@/hooks/use-form-store";
import { ARCHETYPES, PLATFORMS, KPIS, AD_BUDGET_OPTIONS, APPROVAL_WORKFLOW_OPTIONS } from "@/lib/constants";
import type { WizardStep } from "@/types/onboarding";

interface StepReviewSubmitProps {
  onEditStep: (step: WizardStep) => void;
}

function SectionCard({
  icon: Icon, title, step, onEdit, children,
}: {
  icon: React.ElementType;
  title: string;
  step: WizardStep;
  onEdit: (step: WizardStep) => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeInUp}
      className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <button type="button" onClick={() => onEdit(step)}
          className="flex items-center gap-1 text-xs text-primary hover:underline">
          <Edit2 className="w-3 h-3" /> Edit
        </button>
      </div>
      <div className="px-4 py-3 space-y-1.5 text-sm">{children}</div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value?: string | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex gap-3">
      <span className="text-muted-foreground w-32 flex-shrink-0 text-xs pt-0.5">{label}</span>
      <span className="text-xs flex-1">
        {Array.isArray(value) ? (
          <span className="flex flex-wrap gap-1">
            {value.map((v) => (
              <span key={v} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[11px]">{v}</span>
            ))}
          </span>
        ) : value}
      </span>
    </div>
  );
}

export function StepReviewSubmit({ onEditStep }: StepReviewSubmitProps) {
  const { clientContact, businessOverview, brandIdentity, targetAudience, contentStrategy, goalsBudget } = useFormStore((s) => s.data);

  const archetypeLabels = brandIdentity.archetypes.map(
    (id) => ARCHETYPES.find((a) => a.id === id)?.label ?? id
  );
  const kpiLabels = goalsBudget.kpis.map(
    (id) => KPIS.find((k) => k.id === id)?.label ?? id
  );
  const platformLabels = contentStrategy.platforms.map(
    (id) => PLATFORMS.find((p) => p.id === id)?.label ?? id
  );
  const budgetLabel = AD_BUDGET_OPTIONS.find((o) => o.value === goalsBudget.adBudget)?.label;
  const workflowLabel = APPROVAL_WORKFLOW_OPTIONS.find((o) => o.value === goalsBudget.approvalWorkflow)?.label;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Review & Submit</h2>
        </div>
        <p className="text-muted-foreground text-sm ml-[42px]">
          Everything look right? Hit Submit and {"we'll"} start building your strategy.
        </p>
      </motion.div>

      {/* Summary cards */}
      <SectionCard icon={User} title="Client Contact" step={1} onEdit={onEditStep}>
        <Row label="Name" value={clientContact.contactName} />
        <Row label="Email" value={clientContact.email} />
        <Row label="Role" value={clientContact.role} />
        <Row label="Website" value={clientContact.websiteUrl} />
      </SectionCard>

      <SectionCard icon={Building2} title="Business Overview" step={2} onEdit={onEditStep}>
        <Row label="Business" value={businessOverview.businessName} />
        <Row label="Industry" value={businessOverview.industry} />
        <Row label="Pitch" value={businessOverview.elevatorPitch} />
        <Row label="Products" value={businessOverview.productsServices} />
        <Row label="Competitors" value={businessOverview.competitors} />
      </SectionCard>

      <SectionCard icon={Palette} title="Brand Identity" step={3} onEdit={onEditStep}>
        <div className="flex gap-2 items-center">
          <span className="text-muted-foreground w-32 flex-shrink-0 text-xs">Colors</span>
          <div className="flex gap-1.5">
            {brandIdentity.brandColors.map((c) => (
              <div key={c.hex} className="w-6 h-6 rounded-md shadow-sm border border-white/20" style={{ backgroundColor: c.hex }} title={c.hex} />
            ))}
          </div>
        </div>
        <Row label="Archetypes" value={archetypeLabels} />
        <Row label="Tone" value={brandIdentity.toneKeywords} />
      </SectionCard>

      <SectionCard icon={Users} title="Target Audience" step={4} onEdit={onEditStep}>
        <Row label="Description" value={targetAudience.audienceDescription.slice(0, 120) + (targetAudience.audienceDescription.length > 120 ? "…" : "")} />
        <Row label="Age" value={`${targetAudience.ageMin}–${targetAudience.ageMax >= 65 ? "65+" : targetAudience.ageMax}`} />
        <Row label="Locations" value={targetAudience.locations} />
        <Row label="Interests" value={targetAudience.interests.slice(0, 5)} />
      </SectionCard>

      <SectionCard icon={LayoutGrid} title="Content Strategy" step={5} onEdit={onEditStep}>
        <Row label="Platforms" value={platformLabels} />
        <Row label="Pillars" value={contentStrategy.contentPillars} />
        <Row label="Avoid" value={contentStrategy.topicsToAvoid} />
      </SectionCard>

      <SectionCard icon={Target} title="Goals & Budget" step={6} onEdit={onEditStep}>
        <Row label="KPIs" value={kpiLabels} />
        <Row label="Budget" value={budgetLabel} />
        <Row label="Approval" value={workflowLabel} />
        {goalsBudget.keyDates.length > 0 && (
          <Row label="Key dates" value={`${goalsBudget.keyDates.length} date${goalsBudget.keyDates.length > 1 ? "s" : ""} added`} />
        )}
      </SectionCard>

      {/* Ready banner */}
      <motion.div variants={fadeInUp}
        className="rounded-xl gradient-brand p-4 text-white text-center">
        <p className="font-semibold text-sm">{"You're all set!"}</p>
        <p className="text-xs text-white/80 mt-1">
          Click Submit below — {"we'll"} save your brief and your Brand Bounce strategy will be ready within 24 hours.
        </p>
      </motion.div>
    </motion.div>
  );
}
