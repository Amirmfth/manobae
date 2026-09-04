"use client";

import { motion, useReducedMotion } from "motion/react";

export function LoadingSkeleton({ label = "Loading" }: { label?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="state-panel" role="status" aria-label={label}>
      {[{ width: "38%", height: "0.9rem" }, { width: "82%", height: "1.5rem" }, { width: "64%", height: "1rem" }].map((style, index) => <div className="skeleton" style={style} key={style.width}><motion.span className="skeleton__shimmer" initial={reduced ? false : { x: "-100%" }} animate={reduced ? { opacity: 0.35 } : { x: "100%" }} transition={{ duration: 1.4, repeat: reduced ? 0 : Infinity, delay: index * 0.08 }} /></div>)}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="state-panel state-panel--centered">
      <EmptyStateIllustration />
      <h3 className="section-title display-type">{title}</h3>
      <p className="text-muted">{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({ title, description, retry, retryLabel = "Try again" }: { title: string; description: string; retry?: () => void; retryLabel?: string }) {
  return (
    <div className="state-panel state-panel--error" role="alert">
      <span className="state-mark">!</span>
      <div className="stack-xs">
        <h3>{title}</h3>
        <p className="text-muted">{description}</p>
      </div>
      {retry && <button type="button" className="button button--secondary" onClick={retry}>{retryLabel}</button>}
    </div>
  );
}

export function EmptyStateIllustration() {
  return <span className="empty-illustration motif motif--thread" aria-hidden="true" />;
}
