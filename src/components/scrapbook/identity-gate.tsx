"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/ui/icons";
import { DEMO_PASSCODES, identities } from "@/lib/mock-data";
import { useApp } from "@/providers/app-provider";

type GateStatus = "idle" | "loading" | "invalid" | "limited" | "success";

export function IdentityGate() {
  const router = useRouter();
  const { locale, setLocale, selectIdentity } = useApp();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<GateStatus>("idle");
  const [attempts, setAttempts] = useState(0);
  const isFa = locale === "fa";
  const reduced = useReducedMotion();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const identity = DEMO_PASSCODES[code];
    if (!identity) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setStatus(nextAttempts >= 3 ? "limited" : "invalid");
      return;
    }
    setStatus("loading");
    window.setTimeout(() => {
      selectIdentity(identity);
      setStatus("success");
      window.setTimeout(() => router.push("/today"), 600);
    }, 420);
  }

  const detected = DEMO_PASSCODES[code];

  return (
    <motion.section className={`gate ${status === "success" ? "gate--revealed" : ""}`} aria-labelledby="gate-title" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <button type="button" className="gate__locale button button--quiet" onClick={() => setLocale(isFa ? "en" : "fa")}>
        <Icon name="globe" /> {isFa ? "English" : "فارسی"}
      </button>
      <div className="gate__thread motif motif--thread" aria-hidden="true" />
      <motion.div className="gate__paper" initial={reduced ? false : { opacity: 0, y: 14, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.62 }}>
        <div className="gate__brand"><span className="brand__mark" aria-hidden="true">m</span><span>manobae</span></div>
        <div className="stack-md">
          <p className="eyebrow">{isFa ? "فقط برای ما دو نفر" : "Just for the two of us"}</p>
          <h1 id="gate-title" className="gate__title display-type">{isFa ? "کدام‌یک از مایی؟" : "Which one of us is here?"}</h1>
          <p className="body-large text-muted">{isFa ? "کد شش‌رقمی را وارد کن تا دفترمان رنگ خودش را پیدا کند." : "Enter the six-digit code and our scrapbook will find your colors."}</p>
        </div>
        <form className="gate__form stack-lg" onSubmit={submit}>
          <div>
            <label className="field-label" htmlFor="passcode">{isFa ? "کد ورود آزمایشی" : "Demo entry code"}</label>
            <input id="passcode" className="passcode-input" value={code} onChange={(event) => { setCode(event.target.value.replace(/\D/g, "").slice(0, 6)); if (status === "invalid") setStatus("idle"); }} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} dir="ltr" aria-describedby="passcode-help passcode-status" aria-invalid={status === "invalid"} disabled={status === "limited" || status === "loading" || status === "success"} placeholder="••••••" />
            <p id="passcode-help" className="gate__help">{isFa ? "نسخه‌ی نمایشی: امیر 111111 · کیمیا 222222" : "Prototype only: Amir 111111 · Kimia 222222"}</p>
          </div>
          <div id="passcode-status" className="gate__status" role="status" aria-live="polite">
            {status === "invalid" && <><span className="gate__status-mark">×</span>{isFa ? "این کد را نمی‌شناسیم. دوباره امتحان کن." : "We don’t recognize that code. Try again."}</>}
            {status === "limited" && <><Icon name="lock" />{isFa ? "تلاش‌های زیادی بود. برای نمونه، کد را پاک کن و صفحه را تازه کن." : "Too many tries. For this prototype, clear the code and refresh."}</>}
            {status === "loading" && <motion.span key="loading" className="gate__status-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.span className="gate__spinner" animate={reduced ? undefined : { rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />{isFa ? "داریم نامه‌ات را پیدا می‌کنیم…" : "Finding your letter…"}</motion.span>}
            {status === "success" && detected && <><Icon name="check" />{isFa ? `خوش آمدی، ${identities[detected].name.fa}` : `Welcome, ${identities[detected].name.en}`}</>}
          </div>
          <button type="submit" className="button button--primary gate__submit" disabled={code.length !== 6 || status === "limited" || status === "loading" || status === "success"}>
            {status === "loading" ? (isFa ? "یک لحظه…" : "One moment…") : (isFa ? "باز کردن دفتر ما" : "Open our scrapbook")}
          </button>
        </form>
        <p className="gate__disclaimer">{isFa ? "این فقط یک نمونه‌ی رابط کاربری است و ورود امن واقعی نیست." : "This is a UI prototype, not production authentication."}</p>
      </motion.div>
    </motion.section>
  );
}
