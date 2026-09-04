"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ThemeName } from "@/lib/theme";
import { motionEase, motionSettleEase } from "@/components/motion/motion-system";

type PatternProps = { reduced: boolean | null };

export function IdentityBackdrop({ theme }: { theme: ThemeName }) {
  const reduced = useReducedMotion();

  return (
    <div className="identity-backdrop" aria-hidden="true">
      <AnimatePresence mode="sync" initial={false}>
        <motion.svg
          key={theme}
          className={`identity-pattern identity-pattern--${theme}`}
          viewBox="0 0 1200 900"
          preserveAspectRatio="xMidYMid slice"
          initial={reduced ? false : { opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: reduced ? 0 : 0.72, ease: motionEase }}
        >
          {theme === "night" && <NightPattern reduced={reduced} />}
          {theme === "rose" && <RosePattern reduced={reduced} />}
          {theme === "shared" && <SharedPattern reduced={reduced} />}
        </motion.svg>
      </AnimatePresence>
    </div>
  );
}

function DrawPath({ d, reduced, delay = 0, className, opacity = 1 }: PatternProps & { d: string; delay?: number; className?: string; opacity?: number }) {
  return (
    <motion.path
      className={className}
      d={d}
      pathLength={1}
      initial={reduced ? false : { pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity }}
      transition={{ duration: reduced ? 0 : 1.25, delay, ease: motionEase }}
    />
  );
}

function NightPattern({ reduced }: PatternProps) {
  return (
    <>
      <defs>
        <pattern id="night-stationery" width="88" height="88" patternUnits="userSpaceOnUse">
          <path d="M0 87.5H88M87.5 0V88" className="pattern-rule" />
          <circle cx="11" cy="13" r="1.4" className="pattern-dot" />
          <path d="M62 20h12M68 14v12" className="pattern-cross" />
        </pattern>
        <pattern id="night-stars" width="240" height="190" patternUnits="userSpaceOnUse">
          <circle cx="34" cy="42" r="2.2" />
          <circle cx="112" cy="71" r="1.5" />
          <circle cx="187" cy="31" r="2" />
          <path d="M34 42l78 29 75-40M112 71l36 72" />
        </pattern>
      </defs>
      <rect className="pattern-wash pattern-wash--night" width="1200" height="900" />
      <motion.rect className="pattern-field pattern-field--night-grid" width="1288" height="988" x="-44" y="-44" fill="url(#night-stationery)" initial={reduced ? false : { x: -14, opacity: 0 }} animate={{ x: 0, opacity: 0.1 }} transition={{ duration: reduced ? 0 : 0.6, ease: motionEase }} />
      <motion.rect className="pattern-field pattern-field--night-stars" width="1440" height="1140" x="-120" y="-120" fill="url(#night-stars)" initial={reduced ? false : { x: -18, opacity: 0 }} animate={{ x: 0, opacity: 0.12 }} transition={{ duration: reduced ? 0 : 0.76, delay: reduced ? 0 : 0.08, ease: motionEase }} />
      <g className="pattern-foreground pattern-foreground--night">
        <motion.g className="night-postage" initial={reduced ? false : { y: -12, rotate: -3, opacity: 0 }} animate={{ y: 0, rotate: -2, opacity: 0.18 }} transition={{ duration: reduced ? 0 : 0.72, delay: reduced ? 0 : 0.14, ease: motionEase }}>
          <rect x="855" y="104" width="218" height="134" rx="3" />
          <path d="M884 146h158M884 174h116M884 202h142" />
          <circle cx="1036" cy="142" r="19" />
        </motion.g>
        <DrawPath reduced={reduced} delay={0.16} opacity={0.19} className="night-route" d="M-20 638C190 546 350 710 566 606S942 512 1224 584" />
        <path className="night-corner" d="M66 84h278v22H88v164H66zM1082 718h42v102H958v-22h124z" />
      </g>
    </>
  );
}

function RosePattern({ reduced }: PatternProps) {
  return (
    <>
      <defs>
        <pattern id="rose-garden" width="184" height="172" patternUnits="userSpaceOnUse">
          <path className="rose-stem" d="M28 160C52 124 39 72 86 43M86 43c-18-28-52-4-31 17-10 30 34 36 39 8 31 8 38-33 9-37-2-27-39-25-38 2" />
          <circle cx="84" cy="53" r="8" className="rose-center" />
          <path className="rose-leaf" d="M48 111c-19-18-34-4-30 15 18 3 31-3 30-15ZM57 91c13-22 31-18 35 0-13 10-25 11-35 0Z" />
          <path className="rose-spark" d="M145 24v14m-7-7h14" />
        </pattern>
        <pattern id="rose-dots" width="42" height="42" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="7" r="1.1" />
          <circle cx="30" cy="27" r="0.8" />
        </pattern>
      </defs>
      <rect className="pattern-wash pattern-wash--rose" width="1200" height="900" />
      <rect className="pattern-field pattern-field--rose-dots" width="1200" height="900" fill="url(#rose-dots)" />
      <motion.rect className="pattern-field pattern-field--rose-garden" width="1384" height="1072" x="-92" y="-86" fill="url(#rose-garden)" initial={reduced ? false : { y: 20, opacity: 0 }} animate={{ y: 0, opacity: 0.16 }} transition={{ duration: reduced ? 0 : 0.78, ease: motionEase }} />
      <g className="pattern-foreground pattern-foreground--rose">
        <motion.path className="rose-ribbon" d="M-28 258C154 82 312 402 505 224S846 90 1228 272" pathLength={1} initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.16 }} transition={{ duration: reduced ? 0 : 1.05, ease: motionSettleEase }} />
        <motion.g className="rose-label" initial={reduced ? false : { y: 14, rotate: 3, opacity: 0 }} animate={{ y: 0, rotate: 2, opacity: 0.2 }} transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.8, delay: reduced ? 0 : 0.14 }}>
          <path d="M852 610q18-18 36 0t36 0t36 0t36 0t36 0v124H852z" />
          <path d="M882 654h122M882 681h86" />
          <circle cx="1010" cy="704" r="17" />
        </motion.g>
        <DrawPath reduced={reduced} delay={0.22} opacity={0.2} className="rose-underline" d="M90 756c108-32 218-30 326 4" />
      </g>
    </>
  );
}

function SharedPattern({ reduced }: PatternProps) {
  return (
    <>
      <defs>
        <pattern id="shared-keepsakes" width="220" height="180" patternUnits="userSpaceOnUse">
          <rect x="24" y="30" width="74" height="54" rx="4" transform="rotate(-2 24 30)" />
          <rect x="79" y="55" width="82" height="58" rx="7" transform="rotate(2 79 55)" />
          <path d="M38 138c32-36 68 34 104-3 18-18 34-16 54-7" />
          <circle cx="38" cy="138" r="3" />
          <circle cx="142" cy="135" r="3" />
        </pattern>
      </defs>
      <rect className="pattern-wash pattern-wash--shared" width="1200" height="900" />
      <motion.rect className="pattern-field pattern-field--shared" width="1420" height="1080" x="-110" y="-90" fill="url(#shared-keepsakes)" initial={reduced ? false : { y: 18, opacity: 0 }} animate={{ y: 0, opacity: 0.11 }} transition={{ duration: reduced ? 0 : 0.7, ease: motionSettleEase }} />
      <g className="pattern-foreground pattern-foreground--shared">
        <motion.g className="shared-pair" initial={reduced ? false : { y: 12, rotate: -2, opacity: 0 }} animate={{ y: 0, rotate: -1, opacity: 0.13 }} transition={{ duration: reduced ? 0 : 0.76, delay: reduced ? 0 : 0.1, ease: motionSettleEase }}>
          <rect x="104" y="112" width="276" height="184" rx="8" />
          <rect x="274" y="172" width="288" height="190" rx="14" />
          <path d="M146 158h142M146 188h96M320 230h178M320 260h124" />
        </motion.g>
        <DrawPath reduced={reduced} delay={0.12} opacity={0.2} className="shared-thread" d="M154 630C334 466 526 730 758 552S1034 462 1182 530" />
        <motion.g className="shared-knots" initial={reduced ? false : { opacity: 0, scale: 0.86 }} animate={{ opacity: 0.82, scale: 1 }} transition={{ duration: reduced ? 0 : 0.44, delay: reduced ? 0 : 0.5, ease: motionSettleEase }}>
          <circle cx="154" cy="630" r="7" />
          <circle cx="758" cy="552" r="7" />
          <circle cx="1156" cy="535" r="7" />
        </motion.g>
      </g>
    </>
  );
}
