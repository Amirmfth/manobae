"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMotionLanguage } from "@/components/motion/motion-system";
import { FoldedNote } from "@/components/scrapbook/folded-note";
import { Icon } from "@/components/ui/icons";
import { identities, todayQuestion, type QuestionState } from "@/lib/mock-data";
import { useApp } from "@/providers/app-provider";

export function DailyQuestion() {
  const { locale, identity, theme, toast } = useApp();
  const [state, setState] = useState<QuestionState>("locked");
  const [answer, setAnswer] = useState("");
  const isFa = locale === "fa";
  const activeIdentity = identity ?? "amir";
  const motionLanguage = useMotionLanguage(theme, isFa);

  return (
    <motion.section id="question" className={`question-section question-section--${state}`} {...motionLanguage.reveal()} aria-labelledby="question-title">
      <div className="prototype-strip">
        <span>{isFa ? "حالت پرسش" : "Question state"}</span>
        {(["locked", "waiting", "revealed"] as const).map((item) => <motion.button key={item} type="button" aria-pressed={state === item} onClick={() => setState(item)} whileTap={{ scale: 0.96 }}>{isFa ? { locked: "پاسخ من", waiting: "منتظر", revealed: "آشکار" }[item] : item}</motion.button>)}
      </div>
      <FoldedNote eyebrow={isFa ? "پرسش امروز · خصوصی تا وقتی هردو پاسخ دهیم" : "Today’s question · private until we both answer"} footer={<p className="status-line"><span className="status-dot" />{state === "locked" ? (isFa ? "پاسخت فقط بعد از پاسخ کیمیا دیده می‌شود." : "Your answer appears only after Kimia answers.") : state === "waiting" ? (isFa ? "پاسخ تو امن مانده؛ هنوز منتظر کیمیا هستیم." : "Your answer is tucked away; we’re waiting for Kimia.") : (isFa ? "هردو پاسخ داده‌اید. یادداشت باز شد." : "You both answered. The note is open.")}</p>}>
        <h2 id="question-title" className="question-title display-type">{todayQuestion.prompt[locale]}</h2>
        <AnimatePresence mode="wait" initial={false}>
          {state === "locked" && <motion.div key="locked" className="stack-md" initial={{ opacity: 0, y: motionLanguage.reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: motionLanguage.reduced ? 0 : -6 }}><label className="field-label" htmlFor="daily-answer">{isFa ? "پاسخ تو" : "Your answer"}</label><textarea id="daily-answer" className="text-area" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={isFa ? "یک لحظه‌ی واقعی و کوچک…" : "One small, real moment…"} /><motion.button type="button" className="button button--primary question-action" disabled={!answer.trim()} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => { setState("waiting"); toast(isFa ? "پاسخت تا زمان پاسخ هردو پنهان می‌ماند." : "Your answer stays private until you both answer."); }}>{isFa ? "پاسخم را نگه دار" : "Keep my answer"}</motion.button></motion.div>}
          {state === "waiting" && <motion.div key="waiting" className="waiting-note" initial={{ opacity: 0, scale: motionLanguage.reduced ? 1 : 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}><Icon name="lock" /><div><strong>{isFa ? (activeIdentity === "amir" ? "هنوز نوبت کیمیاست" : "هنوز نوبت امیر است") : `It’s ${activeIdentity === "amir" ? "Kimia’s" : "Amir’s"} turn`}</strong><p>{isFa ? "وقتی پاسخ برسد، این یادداشت برای هردوی شما باز می‌شود." : "When the answer arrives, this note will open for both of you."}</p></div></motion.div>}
          {state === "revealed" && <motion.div key="revealed" className="answer-reveal" initial="hidden" animate="shown" variants={{ hidden: {}, shown: { transition: { staggerChildren: motionLanguage.reduced ? 0 : 0.08 } } }}>{([activeIdentity, activeIdentity === "amir" ? "partner" : "amir"] as const).map((person, index) => <motion.blockquote key={person} variants={{ hidden: { opacity: 0, x: motionLanguage.reduced ? 0 : index ? -18 : 18 }, shown: { opacity: 1, x: 0 } }}><p>{todayQuestion.answers[person][locale]}</p><cite>— {identities[person].name[locale]}</cite></motion.blockquote>)}</motion.div>}
        </AnimatePresence>
      </FoldedNote>
    </motion.section>
  );
}
