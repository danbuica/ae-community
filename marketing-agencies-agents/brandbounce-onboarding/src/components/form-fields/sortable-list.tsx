"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTENT_FORMATS } from "@/lib/constants";
import type { ContentFormat } from "@/types/onboarding";

interface SortableItemProps {
  id: ContentFormat;
  index: number;
}

function SortableItem({ id, index }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const format = CONTENT_FORMATS.find((f) => f.id === id)!;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 select-none transition-shadow",
        isDragging
          ? "shadow-xl shadow-primary/20 border-primary/40 z-50 opacity-90 scale-105"
          : "border-border hover:border-primary/30"
      )}
    >
      {/* Rank badge */}
      <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
        {index + 1}
      </div>

      {/* Format info */}
      <span className="text-lg">{format.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{format.label}</p>
        <p className="text-[11px] text-muted-foreground">{format.description}</p>
      </div>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none p-1"
      >
        <GripVertical className="w-4 h-4" />
      </div>
    </div>
  );
}

interface SortableListProps {
  value: ContentFormat[];
  onChange: (formats: ContentFormat[]) => void;
}

export function SortableList({ value, onChange }: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = value.indexOf(active.id as ContentFormat);
      const newIndex = value.indexOf(over.id as ContentFormat);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Drag to reorder — #1 is your top priority format.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={value} strategy={verticalListSortingStrategy}>
          <motion.div className="space-y-2" layout>
            {value.map((id, index) => (
              <SortableItem key={id} id={id} index={index} />
            ))}
          </motion.div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
