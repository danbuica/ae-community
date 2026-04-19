import type { Variants, Transition } from "framer-motion";

// ─────────────────────────────────────────────────────────────
//  Base Transitions
// ─────────────────────────────────────────────────────────────
export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

export const easeOut: Transition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
};

export const easeInOut: Transition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1],
};

// ─────────────────────────────────────────────────────────────
//  Wizard Step Transitions
// ─────────────────────────────────────────────────────────────
export const stepSlideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { ...easeOut },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-60%" : "60%",
    opacity: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  }),
};

// ─────────────────────────────────────────────────────────────
//  Staggered Container (for field lists)
// ─────────────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

// ─────────────────────────────────────────────────────────────
//  Fade + Slide Up (for form fields)
// ─────────────────────────────────────────────────────────────
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// ─────────────────────────────────────────────────────────────
//  Scale + Fade (for modals, cards, chips)
// ─────────────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...spring },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// Pop-in for chips/tags
export const popIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.6,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...spring, stiffness: 600, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.6,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

// ─────────────────────────────────────────────────────────────
//  Slide Down (for dropdowns, AI results)
// ─────────────────────────────────────────────────────────────
export const slideDown: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    y: -8,
  },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: { ...easeOut },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -8,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// ─────────────────────────────────────────────────────────────
//  Stepper Checkmark Path Draw
// ─────────────────────────────────────────────────────────────
export const pathDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 0.5, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  },
};

// ─────────────────────────────────────────────────────────────
//  Validation Shake
// ─────────────────────────────────────────────────────────────
export const shakeVariants: Variants = {
  shake: {
    x: [-4, 4, -4, 4, -2, 2, 0],
    transition: { duration: 0.4 },
  },
};

// ─────────────────────────────────────────────────────────────
//  Brand Preview Panel
// ─────────────────────────────────────────────────────────────
export const previewCrossfade: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// ─────────────────────────────────────────────────────────────
//  AI Button States
// ─────────────────────────────────────────────────────────────
export const aiButtonPulse: Variants = {
  idle: {
    boxShadow: "0 0 0 0 rgba(124, 58, 237, 0)",
  },
  pulsing: {
    boxShadow: [
      "0 0 0 0 rgba(124, 58, 237, 0.4)",
      "0 0 0 8px rgba(124, 58, 237, 0)",
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeOut",
    },
  },
};

// ─────────────────────────────────────────────────────────────
//  Color Swatch
// ─────────────────────────────────────────────────────────────
export const swatchPop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      ...spring,
      delay: i * 0.06,
    },
  }),
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// ─────────────────────────────────────────────────────────────
//  Submit Success
// ─────────────────────────────────────────────────────────────
export const successBounce: Variants = {
  hidden: { scale: 0, opacity: 0, rotate: -10 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};
