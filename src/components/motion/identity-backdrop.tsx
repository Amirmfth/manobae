"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ThemeName } from "@/lib/theme";
import { motionEase } from "@/components/motion/motion-system";

export function IdentityBackdrop({ theme }: { theme: ThemeName }) {
  const reduced = useReducedMotion();
  return (
    <div className="identity-backdrop" aria-hidden="true">
      <AnimatePresence mode="sync" initial={false}>
        <motion.svg key={theme} className={`identity-pattern identity-pattern--${theme}`} viewBox="0 0 1200 900" preserveAspectRatio="xMidYMin slice" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.6 }}>
          {theme === "night" && <NightPattern reduced={reduced} />}
          {theme === "rose" && <RosePattern reduced={reduced} />}
          {theme === "shared" && <SharedPattern reduced={reduced} />}
        </motion.svg>
      </AnimatePresence>
    </div>
  );
}

function DrawPath({ d, reduced, delay = 0 }: { d: string; reduced: boolean | null; delay?: number }) {
  return <motion.path d={d} pathLength={1} initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: reduced ? 0 : 1.1, delay, ease: motionEase }} />;
}

function NightPattern({ reduced }: { reduced: boolean | null }) {
  return <g className="pattern-ink"><path className="pattern-geometry" d="M78 112H376V206H548 M882 86v240h220" /><DrawPath reduced={reduced} d="M40 410C252 338 344 478 548 388S872 278 1160 360" /><g className="pattern-stars"><circle cx="178" cy="188" r="4" /><circle cx="244" cy="144" r="3" /><circle cx="326" cy="242" r="4" /><circle cx="978" cy="210" r="3" /><path d="M178 188l66-44 82 98M978 210l58 40" /></g><g className="pattern-postage"><rect x="846" y="544" width="218" height="132" rx="2" /><path d="M876 586h154M876 612h112M876 638h142" /></g></g>;
}

function RosePattern({ reduced }: { reduced: boolean | null }) {
  return <g className="pattern-ink"><DrawPath reduced={reduced} d="M-20 260C176 92 330 438 526 244S862 100 1228 286" /><DrawPath reduced={reduced} delay={0.12} d="M704 744c118-210 292-186 470-74" /><g className="pattern-flowers"><path d="M176 182c-52-48-98 18-42 50-24 60 58 78 70 18 66 10 74-72 12-74-8-58-88-48-80 14" /><circle cx="176" cy="216" r="17" /><path d="M1014 318c-38-36-78 14-32 40-18 46 44 58 54 14 50 8 56-54 10-56-8-44-68-36-60 10" /><circle cx="1014" cy="344" r="12" /></g><path className="pattern-scallop" d="M90 670q28-38 56 0t56 0t56 0t56 0t56 0" /></g>;
}

function SharedPattern({ reduced }: { reduced: boolean | null }) {
  return <g className="pattern-ink"><rect className="pattern-paper" x="110" y="110" width="310" height="208" rx="8" transform="rotate(-2 110 110)" /><rect className="pattern-paper" x="288" y="176" width="322" height="214" rx="14" transform="rotate(2 288 176)" /><DrawPath reduced={reduced} d="M188 610C354 466 548 724 760 556S1014 458 1170 532" /><g className="pattern-pairs"><circle cx="188" cy="610" r="7" /><circle cx="760" cy="556" r="7" /><circle cx="1138" cy="536" r="7" /><circle cx="1164" cy="526" r="7" /></g></g>;
}
