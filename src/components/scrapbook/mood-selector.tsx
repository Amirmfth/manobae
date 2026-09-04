"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { moods } from "@/lib/mock-data";
import { useApp } from "@/providers/app-provider";

export function MoodSelector() {
  const { locale, toast } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  return <fieldset id="mood" className="mood-selector"><legend className="section-title display-type">{locale === "fa" ? "حال امروزت چطور است؟" : "How does today feel?"}</legend><p className="text-muted">{locale === "fa" ? "فقط یک نشانه‌ی کوچک برای هردوی شما." : "Just a small signal between the two of you."}</p><div className="mood-options">{moods.map((mood) => <motion.button type="button" key={mood.id} aria-pressed={selected === mood.id} animate={{ y: selected === mood.id ? -2 : 0, scale: selected === mood.id ? 1.015 : 1 }} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => { setSelected(mood.id); toast(locale === "fa" ? `حال «${mood.fa}» ثبت شد.` : `${mood.en} mood noted.`); }}><span aria-hidden="true">{mood.mark}</span>{mood[locale]}</motion.button>)}</div></fieldset>;
}
