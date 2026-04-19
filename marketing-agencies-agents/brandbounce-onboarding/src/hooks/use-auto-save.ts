"use client";

import { useEffect, useRef } from "react";
import { useFormStore } from "@/hooks/use-form-store";
import type { OnboardingFormData } from "@/types/onboarding";

const STORAGE_KEY = "brandbounce_onboarding_draft";
const STEP_KEY = "brandbounce_onboarding_step";
const DEBOUNCE_MS = 2000;

export function saveStep(step: number) {
  try { localStorage.setItem(STEP_KEY, String(step)); } catch {}
}

export function loadStep(): number | null {
  try {
    const v = localStorage.getItem(STEP_KEY);
    return v ? Number(v) : null;
  } catch { return null; }
}

export function useAutoSave() {
  const data = useFormStore((s) => s.data);
  const isDirty = useFormStore((s) => s.isDirty);
  const hydrate = useFormStore((s) => s.hydrate);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as OnboardingFormData;
        hydrate(parsed);
      }
    } catch {
      // Corrupt or missing — start fresh
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced save on data change
  useEffect(() => {
    if (!isDirty) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // Storage full or unavailable — silently skip
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, isDirty]);
}

export function clearAutoSave() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
  } catch {
    // ignore
  }
}
