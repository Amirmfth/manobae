"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import type { ThemeName } from "@/lib/theme";

const enterEase = [0.16, 1, 0.3, 1] as const;

export function ManobaeMotion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ ease: enterEase }}>{children}</MotionConfig>;
}

export function useMotionLanguage(theme: ThemeName, isRtl: boolean) {
  const reduced = useReducedMotion();
  const hidden = theme === "night"
    ? { opacity: 0, x: isRtl ? 24 : -24, y: 3 }
    : theme === "rose"
      ? { opacity: 0, x: 0, y: 22, rotate: isRtl ? 0.55 : -0.55, scale: 0.985 }
      : { opacity: 0, x: 0, y: 14, scale: 0.985 };
  const duration = theme === "rose" ? 0.68 : theme === "night" ? 0.58 : 0.62;

  return {
    reduced,
    page: {
      initial: reduced ? false : hidden,
      animate: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
      transition: { duration, ease: enterEase },
    },
    reveal(delay = 0) {
      return {
        initial: reduced ? false : hidden,
        whileInView: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
        viewport: { once: true, amount: 0.16, margin: "0px 0px -8%" },
        transition: { duration, delay: reduced ? 0 : delay, ease: enterEase },
      };
    },
  };
}

export const motionEase = enterEase;
