"use client";

import { useEffect, useRef, useState } from "react";
import type { AISuggestionType } from "@/types/onboarding";

interface AutoSuggestRequest {
  type: AISuggestionType;
  context: Record<string, unknown>;
  /** Return true if there's enough prior-step data to warrant this call */
  shouldRun: () => boolean;
  /** Called with the API result */
  onResult: (suggestions: unknown) => void;
}

interface AutoSuggestState {
  loading: boolean;
  /** Which types are currently in-flight */
  pending: Set<AISuggestionType>;
}

/**
 * Fires one or more AI suggestion requests when the component mounts,
 * only if shouldRun() returns true and the field is still empty.
 * Won't re-fire on re-renders or if already fired this mount cycle.
 */
export function useAutoSuggest(requests: AutoSuggestRequest[]) {
  const firedRef = useRef(false);
  const [pending, setPending] = useState<Set<AISuggestionType>>(new Set());

  const loading = pending.size > 0;

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const toFire = requests.filter((r) => r.shouldRun());
    if (toFire.length === 0) return;

    setPending(new Set(toFire.map((r) => r.type)));

    for (const req of toFire) {
      fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: req.type, context: req.context }),
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => req.onResult(data.suggestions))
        .catch(() => {}) // silent — user can still click manual button
        .finally(() => {
          setPending((prev) => {
            const next = new Set(prev);
            next.delete(req.type);
            return next;
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading, pending } satisfies AutoSuggestState;
}
