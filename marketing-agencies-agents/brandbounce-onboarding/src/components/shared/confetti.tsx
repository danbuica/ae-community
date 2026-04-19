"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiBurst() {
  useEffect(() => {
    const end = Date.now() + 2000;
    const colors = ["#7C3AED", "#F43F5E", "#A78BFA", "#FB7185", "#10B981"];

    function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    }

    frame();
  }, []);

  return null;
}
