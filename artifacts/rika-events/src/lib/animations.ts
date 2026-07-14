/**
 * animations.ts — Centralized Framer Motion animation variants
 *
 * All animation constants live here so components never duplicate code.
 * Import what you need and keep components clean.
 */

import { Variants } from 'framer-motion';

// ---------------------------------------------------------------------------
// Accessibility: detect reduced-motion preference
// ---------------------------------------------------------------------------
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// Page-level — fade + slide up (used on every page wrapper)
// ---------------------------------------------------------------------------
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

// ---------------------------------------------------------------------------
// Container — stagger children
// ---------------------------------------------------------------------------
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const containerVariantsFast: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

// ---------------------------------------------------------------------------
// Item — child within a stagger container
// ---------------------------------------------------------------------------
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const itemVariantsX: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

// ---------------------------------------------------------------------------
// Card hover
// ---------------------------------------------------------------------------
export const cardHover: Variants = {
  rest: { scale: 1, boxShadow: '0 0 0 0 rgba(0,0,0,0)' },
  hover: {
    scale: 1.025,
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

// ---------------------------------------------------------------------------
// Table row — fade + slide per row
// ---------------------------------------------------------------------------
export const tableRowVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ---------------------------------------------------------------------------
// Modal / Dialog overlay + content
// ---------------------------------------------------------------------------
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 4,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

// ---------------------------------------------------------------------------
// Sidebar nav item active indicator
// ---------------------------------------------------------------------------
export const sidebarItemVariants: Variants = {
  inactive: { x: 0 },
  active: { x: 0 },
};

// ---------------------------------------------------------------------------
// Empty state — floating loop animation
// ---------------------------------------------------------------------------
export const floatVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

// ---------------------------------------------------------------------------
// Fade-in only (simple, no translate)
// ---------------------------------------------------------------------------
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

// ---------------------------------------------------------------------------
// Shake — for form validation errors
// ---------------------------------------------------------------------------
export const shakeVariants: Variants = {
  shake: {
    x: [0, -6, 6, -5, 5, -3, 3, 0],
    transition: { duration: 0.45 },
  },
};

// ---------------------------------------------------------------------------
// Skeleton pulse helper (CSS-based; use with className animate-pulse)
// This is just a reference for documenting the pattern
// ---------------------------------------------------------------------------
export const SKELETON_CLASS =
  'bg-white/5 animate-pulse rounded';

// ---------------------------------------------------------------------------
// Progress bar — from 0% to target width
// ---------------------------------------------------------------------------
export const progressBar = (widthPercent: number) => ({
  initial: { width: '0%' },
  animate: {
    width: `${widthPercent}%`,
    transition: { duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
});

// ---------------------------------------------------------------------------
// Number count-up (used with useSpring or just as entry cue)
// ---------------------------------------------------------------------------
export const countUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ---------------------------------------------------------------------------
// Icon rotate on hover
// ---------------------------------------------------------------------------
export const iconRotateHover = {
  rest: { rotate: 0 },
  hover: {
    rotate: 15,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

// ---------------------------------------------------------------------------
// Button tap
// ---------------------------------------------------------------------------
export const buttonTap = { scale: 0.95 };
export const buttonHover = { scale: 1.04, brightness: 1.1 };

// ---------------------------------------------------------------------------
// Sidebar slide (for collapse/expand)
// ---------------------------------------------------------------------------
export const sidebarVariants = {
  open: { width: 256, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  closed: { width: 80, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

export const sidebarLabelVariants: Variants = {
  open: { opacity: 1, x: 0, display: 'block', transition: { delay: 0.1, duration: 0.2 } },
  closed: { opacity: 0, x: -8, transitionEnd: { display: 'none' } },
};
