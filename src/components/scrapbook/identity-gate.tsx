"use client";

import { useActionState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { login, type LoginState } from "@/app/actions/auth";
import { Icon } from "@/components/ui/icons";
import { useApp } from "@/providers/app-provider";

const initialState: LoginState = {};

export function IdentityGate() {
  const { locale, setLocale, selectIdentity } = useApp();
  const [state, action, pending] = useActionState(login, initialState);
  const isFa = locale === "fa";
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!state.success || !state.identity) return;
    selectIdentity(state.identity);
    window.location.replace("/today");
  }, [selectIdentity, state.identity, state.success]);

  return (
    <motion.section className="gate" aria-labelledby="gate-title" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <button type="button" className="gate__locale button button--quiet" onClick={() => setLocale(isFa ? "en" : "fa")}>
        <Icon name="globe" /> {isFa ? "English" : "فارسی"}
      </button>
      <div className="gate__thread motif motif--thread" aria-hidden="true" />
      <motion.div className="gate__paper" initial={reduced ? false : { opacity: 0, y: 14, rotate: -0.35 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.62 }}>
        <div className="gate__brand"><span className="brand__mark" aria-hidden="true">m</span><span>manobae</span></div>
        <div className="stack-md">
          <p className="eyebrow">{isFa ? "فقط برای ما دو نفر" : "Just for the two of us"}</p>
          <h1 id="gate-title" className="gate__title display-type">{isFa ? "کدام‌یک از مایی؟" : "Which one of us is here?"}</h1>
          <p className="body-large text-muted">{isFa ? "کد شش‌رقمی خودت را وارد کن؛ دفترمان تو را به یاد می‌آورد." : "Enter your six-digit code. Our scrapbook will remember you."}</p>
        </div>
        <form className="gate__form stack-lg" action={action}>
          <div>
            <label className="field-label" htmlFor="passcode">{isFa ? "کد ورود تو" : "Your entry code"}</label>
            <input id="passcode" name="passcode" className="passcode-input" inputMode="numeric" autoComplete="current-password" pattern="[0-9]{6}" maxLength={6} dir="ltr" aria-describedby="passcode-status" aria-invalid={Boolean(state.error)} disabled={pending} placeholder="••••••" required />
          </div>
          <div id="passcode-status" className="gate__status" role="status" aria-live="polite">
            {pending && <><motion.span className="gate__spinner" animate={reduced ? undefined : { rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />{isFa ? "داریم نامه‌ات را پیدا می‌کنیم…" : "Finding your letter…"}</>}
            {!pending && state.error && <><span className="gate__status-mark">×</span>{state.error}</>}
          </div>
          <button type="submit" className="button button--primary gate__submit" disabled={pending}>{pending ? (isFa ? "یک لحظه…" : "One moment…") : (isFa ? "باز کردن دفتر ما" : "Open our scrapbook")}</button>
        </form>
        <p className="gate__disclaimer">{isFa ? "هویتت در یک نشست امن و غیرقابل خواندن برای مرورگر نگه داشته می‌شود." : "Your identity is kept in a secure, unreadable browser session."}</p>
      </motion.div>
    </motion.section>
  );
}
