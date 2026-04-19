"use client";

import { motion } from "framer-motion";
import { User, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { COMMUNICATION_CHANNELS } from "@/lib/constants";
import { useFormStore } from "@/hooks/use-form-store";
import { useWizardErrors } from "@/contexts/wizard-context";

export function StepClientContact() {
  const data = useFormStore((s) => s.data.clientContact);
  const update = useFormStore((s) => s.updateClientContact);
  const { errors } = useWizardErrors();

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Client Contact</h2>
        </div>
        <p className="text-muted-foreground text-sm ml-[42px]">
          {"Who are we working with? We'll use this to personalise everything."}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={fadeInUp}>
          <FieldWrapper label="Full Name" required error={errors["contactName"]}>
            <Input placeholder="Alex Johnson" value={data.contactName}
              onChange={(e) => update({ contactName: e.target.value })}
              className={errors["contactName"] ? "border-destructive" : ""} />
          </FieldWrapper>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <FieldWrapper label="Role / Title" required error={errors["role"]}>
            <Input placeholder="Marketing Director" value={data.role}
              onChange={(e) => update({ role: e.target.value })}
              className={errors["role"] ? "border-destructive" : ""} />
          </FieldWrapper>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={fadeInUp}>
          <FieldWrapper label="Email Address" required error={errors["email"]}>
            <Input type="email" placeholder="alex@yourbrand.com" value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              className={errors["email"] ? "border-destructive" : ""} />
          </FieldWrapper>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <FieldWrapper label="Phone" hint="Optional">
            <Input type="tel" placeholder="+1 (555) 000-0000" value={data.phone}
              onChange={(e) => update({ phone: e.target.value })} />
          </FieldWrapper>
        </motion.div>
      </div>

      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Preferred Communication" required error={errors["communicationChannel"]}
          hint="How should we reach you day-to-day?">
          <Select value={data.communicationChannel}
            onValueChange={(v) => update({ communicationChannel: v as never })}>
            <SelectTrigger className={errors["communicationChannel"] ? "border-destructive" : ""}>
              <SelectValue placeholder="Select a channel…" />
            </SelectTrigger>
            <SelectContent>
              {COMMUNICATION_CHANNELS.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldWrapper>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <FieldWrapper label="Website URL" error={errors["websiteUrl"]}
          hint="We'll analyse your site when you continue to pre-fill fields and improve AI suggestions.">
          <div className="relative">
            <Input type="url" placeholder="https://yourbrand.com" value={data.websiteUrl}
              onChange={(e) => update({ websiteUrl: e.target.value })}
              className={`pr-9 ${errors["websiteUrl"] ? "border-destructive" : ""}`} />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </FieldWrapper>
      </motion.div>
    </motion.div>
  );
}
