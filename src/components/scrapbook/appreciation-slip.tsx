"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/providers/app-provider";

export function AppreciationSlip() {
  const { locale, toast } = useApp();
  const [note, setNote] = useState("");
  return <section className="appreciation-slip" aria-labelledby="appreciation-title"><span className="appreciation-slip__clip" aria-hidden="true" /><div className="stack-sm"><p className="eyebrow">{locale === "fa" ? "یک تشکر کوچک" : "A small appreciation"}</p><h2 id="appreciation-title" className="section-title display-type">{locale === "fa" ? "امروز از کیمیا برای چه چیزی ممنونی؟" : "What do you appreciate about Kimia today?"}</h2></div><label className="field-label" htmlFor="appreciation-note">{locale === "fa" ? "یادداشت کوتاه برای کیمیا" : "A short note for Kimia"}</label><textarea id="appreciation-note" className="text-area appreciation-slip__input" value={note} onChange={(event) => setNote(event.target.value)} placeholder={locale === "fa" ? "مرسی که امروز…" : "Thank you for…"} /><motion.button type="button" className="button button--secondary" disabled={!note.trim()} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => { toast(locale === "fa" ? "یادداشتت برای کیمیا کنار گذاشته شد." : "Your note for Kimia is tucked away."); setNote(""); }}>{locale === "fa" ? "گذاشتن برای کیمیا" : "Leave it for Kimia"}</motion.button></section>;
}
