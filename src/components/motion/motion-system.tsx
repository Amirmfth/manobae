"use client";

import { MotionConfig, useReducedMotion, type Transition } from "motion/react";
import type { ThemeName } from "@/lib/theme";

const enterEase = [0.16, 1, 0.3, 1] as const;
const settleEase = [0.22, 0.61, 0.36, 1] as const;

const themeTransition: Record<ThemeName, Transition> = {
  night: { duration: 0.52, ease: enterEase },
  rose: { type: "spring", stiffness: 150, damping: 20, mass: 0.85 },
  shared: { duration: 0.62, ease: settleEase },
};

export function ManobaeMotion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ ease: enterEase }}>{children}</MotionConfig>;
}

export function useMotionLanguage(theme: ThemeName, isRtl: boolean) {
  const reduced = useReducedMotion();
  const hidden = theme === "night"
    ? { opacity: 0, x: isRtl ? 30 : -30, y: 2, rotate: isRtl ? 0.2 : -0.2, scale: 0.995 }
    : theme === "rose"
      ? { opacity: 0, x: isRtl ? -5 : 5, y: 28, rotate: isRtl ? 0.9 : -0.9, scale: 0.97 }
      : { opacity: 0, x: 0, y: 18, rotate: 0, scale: 0.98 };
  const transition = themeTransition[theme];

  return {
    reduced,
    page: {
      initial: reduced ? false : hidden,
      animate: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
      transition,
    },
    reveal(delay = 0) {
      return {
        initial: reduced ? false : hidden,
        whileInView: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
        viewport: { once: true, amount: 0.16, margin: "0px 0px -8%" },
        transition: reduced ? { duration: 0 } : { ...transition, delay },
      };
    },
  };
}

export const motionEase = enterEase;
export const motionSettleEase = settleEase;
