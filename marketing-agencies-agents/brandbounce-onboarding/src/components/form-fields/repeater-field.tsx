"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { popIn } from "@/lib/animations";

// ── Example Content repeater ──────────────────────────────────

interface ExampleContentItem {
  id: string;
  url: string;
  note: string;
}

interface ExampleContentRepeaterProps {
  value: ExampleContentItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: "url" | "note", value: string) => void;
  maxItems?: number;
}

export function ExampleContentRepeater({
  value,
  onAdd,
  onRemove,
  onChange,
  maxItems = 5,
}: ExampleContentRepeaterProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {value.map((item, index) => (
          <motion.div
            key={item.id}
            variants={popIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="flex gap-2 items-start"
          >
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[11px] font-medium text-muted-foreground flex-shrink-0 mt-2">
              {index + 1}
            </div>
            <div className="flex-1 space-y-1.5">
              <Input
                placeholder="https://instagram.com/p/..."
                value={item.url}
                onChange={(e) => onChange(item.id, "url", e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="What do you like about this? (optional)"
                value={item.note}
                onChange={(e) => onChange(item.id, "note", e.target.value)}
                className="text-sm text-muted-foreground"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="w-8 h-8 mt-2 text-muted-foreground hover:text-destructive flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {value.length < maxItems && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="gap-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary"
        >
          <Plus className="w-3.5 h-3.5" />
          Add example
        </Button>
      )}
    </div>
  );
}

// ── Key Dates repeater ────────────────────────────────────────

interface KeyDateItem {
  id: string;
  date: string;
  eventName: string;
}

interface KeyDatesRepeaterProps {
  value: KeyDateItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, field: "date" | "eventName", value: string) => void;
  maxItems?: number;
}

export function KeyDatesRepeater({
  value,
  onAdd,
  onRemove,
  onChange,
  maxItems = 10,
}: KeyDatesRepeaterProps) {
  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {value.map((item) => (
          <motion.div
            key={item.id}
            variants={popIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className="flex gap-2 items-center"
          >
            <Input
              type="date"
              value={item.date}
              onChange={(e) => onChange(item.id, "date", e.target.value)}
              className="w-40 text-sm"
            />
            <Input
              placeholder="Event name (e.g. Black Friday)"
              value={item.eventName}
              onChange={(e) => onChange(item.id, "eventName", e.target.value)}
              className="flex-1 text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="w-8 h-8 text-muted-foreground hover:text-destructive flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {value.length < maxItems && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="gap-2 border-dashed text-muted-foreground hover:text-primary hover:border-primary"
        >
          <Plus className="w-3.5 h-3.5" />
          Add date
        </Button>
      )}
    </div>
  );
}
