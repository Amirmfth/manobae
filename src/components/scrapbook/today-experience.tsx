"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { useMotionLanguage } from "@/components/motion/motion-system";
import { AppreciationSlip } from "@/components/scrapbook/appreciation-slip";
import { DailyQuestion } from "@/components/scrapbook/daily-question";
import { EventPreview } from "@/components/scrapbook/event-preview";
import { MoodSelector } from "@/components/scrapbook/mood-selector";
import { Icon } from "@/components/ui/icons";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/components/ui/states";
import { events, identities, places, recentMemories } from "@/lib/mock-data";
import { formatNumber } from "@/lib/locale";
import { useApp } from "@/providers/app-provider";

type ViewState = "ready" | "loading" | "empty" | "error";

export function TodayExperience() {
  const { locale, identity, theme } = useApp();
  const [view, setView] = useState<ViewState>("ready");
  const isFa = locale === "fa";
  const motionLanguage = useMotionLanguage(theme, isFa);
  const greeting = identity ? identities[identity].greeting[locale] : isFa ? "صبح بخیر، امیر و کیمیا" : "Good morning, Amir & Kimia";

  return (
    <div className="today-page page-container">
      <motion.header className="today-hero" {...motionLanguage.page}>
        <div className="today-hero__copy">
          <p className="eyebrow">{isFa ? `روز ${formatNumber(947, locale)} با هم` : `Day ${formatNumber(947, locale)} together`}</p>
          <h1 className="today-title display-type">{greeting}</h1>
          <p className="body-large text-muted">{isFa ? "امروز بوی قهوه می‌دهد، یک سؤال کوچک دارد و یادداشتی که کیمیا گوشه‌اش را تا زده." : "Today smells like coffee, holds one small question, and a note Kimia folded at the corner."}</p>
        </div>
        <span className="motif motif--star-chart theme-motif theme-motif--night" aria-hidden="true" />
      </motion.header>

      <details className="prototype-tools">
        <summary>{isFa ? "حالت‌های نمایشی صفحه" : "Page demo states"}</summary>
        <div className="prototype-tools__options">{(["ready", "loading", "empty", "error"] as const).map((state) => <button key={state} type="button" aria-pressed={view === state} onClick={() => setView(state)}>{isFa ? { ready: "عادی", loading: "بارگذاری", empty: "خالی", error: "خطا" }[state] : state}</button>)}</div>
      </details>

      {view === "loading" && <LoadingSkeleton label={isFa ? "در حال آماده کردن امروز" : "Preparing today"} />}
      {view === "empty" && <EmptyState title={isFa ? "صفحه‌ی امروز هنوز سفید است" : "Today’s page is still blank"} description={isFa ? "اولین رد امروز را با یک پاسخ واقعی و کوچک بگذار." : "Leave today’s first mark with one small, honest answer."} action={<button className="button button--primary" type="button" onClick={() => setView("ready")}>{isFa ? "شروع امروز" : "Start today"}</button>} />}
      {view === "error" && <ErrorState title={isFa ? "نخِ امروز گره خورد" : "Today’s thread got tangled"} description={isFa ? "این خطای نمایشی است؛ دوباره ورق بزن." : "This is a demo error. Turn the page once more."} retry={() => setView("ready")} retryLabel={isFa ? "دوباره ورق بزن" : "Try again"} />}

      {view === "ready" && <div className="today-journal">
        <DailyQuestion />
        <motion.aside className="partner-letter" {...motionLanguage.reveal(0.06)} aria-label={isFa ? "یادداشت نیمه‌باز کیمیا" : "Partially revealed note from Kimia"}>
          <span className="partner-letter__tape tape tape--top" aria-hidden="true" />
          <span className="motif motif--flower theme-motif theme-motif--rose" aria-hidden="true" />
          <p className="eyebrow">{isFa ? "گوشه‌ای از یادداشت کیمیا" : "A corner of Kimia’s note"}</p>
          <motion.div
            className="partner-letter__peek"
            initial={motionLanguage.reduced ? false : { opacity: 0, y: -8, scaleY: 0.82 }}
            whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
            viewport={{ once: true, amount: 0.75 }}
            transition={{ duration: 0.46, delay: motionLanguage.reduced ? 0 : 0.14 }}
            style={{ transformOrigin: "top" }}
          >
            <p className="keepsake-type">{isFa ? "امشب بستنی یادت نره… و این بار وانیلی حساب نیست!" : "Don’t forget ice cream tonight… vanilla doesn’t count this time!"}</p>
          </motion.div>
          <small>— {isFa ? "کیمیا" : "Kimia"}</small>
        </motion.aside>
        <motion.section className="daily-rituals" {...motionLanguage.reveal()} aria-label={isFa ? "حال و قدردانی امروز" : "Today’s mood and appreciation"}><MoodSelector /><AppreciationSlip /></motion.section>

        <motion.section className="filmstrip-section" {...motionLanguage.reveal()} aria-labelledby="recent-title">
          <div className="journal-heading"><div><p className="eyebrow">{isFa ? "تازه از دوربین" : "Fresh from the camera"}</p><h2 id="recent-title" className="section-title display-type">{isFa ? "چند تکه از این روزها" : "Pieces of lately"}</h2></div><span className="filmstrip-hint">{isFa ? "برای دیدن بکش" : "Swipe to browse"}</span></div>
          <div className="memory-filmstrip" tabIndex={0} aria-label={isFa ? "خاطره‌های اخیر، فهرست افقی" : "Recent memories, horizontal list"}>
            {recentMemories.map((memory, index) => <motion.figure className="film-frame" key={memory.id} initial={motionLanguage.reduced ? false : { opacity: 0, y: 16, rotate: index % 2 ? 0.6 : -0.6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.46, delay: motionLanguage.reduced ? 0 : index * 0.055 }} whileHover={{ y: -2, rotate: 0 }} whileTap={{ scale: 0.985 }}><div className="film-frame__image"><Image src={memory.src} alt={memory.alt[locale]} fill sizes="(max-width: 767px) 76vw, 28vw" /></div><figcaption><span>{String(index + 1).padStart(2, "0")}</span>{memory.caption[locale]}</figcaption></motion.figure>)}
          </div>
        </motion.section>

        <EventPreview event={events[0]} locale={locale} />

        <motion.section className="journal-tail" {...motionLanguage.reveal()} aria-label={isFa ? "ادامه‌ی امروز" : "More from today"}>
          <article className="plan-ticket"><span className="motif motif--date-stamp" aria-hidden="true" /><p className="eyebrow">{isFa ? "قرار بعدی · پنجشنبه" : "Next plan · Thursday"}</p><h2 className="section-title display-type">{isFa ? "قدم‌زدن از پارک لاله تا کافه" : "Laleh Park, then coffee"}</h2><p>{isFa ? "ساعت ۶؛ بدون برنامه‌ی دقیق، طبق معمول." : "Six o’clock; no strict plan, as usual."}</p></article>
          <article className="place-receipt"><Icon name="place" /><div><p className="eyebrow">{isFa ? "جای ذخیره‌شده" : "Saved place"}</p><h2>{places[0].name[locale]}</h2><p>{places[0].area[locale]} · {isFa ? "برای قهوه و کیک هویج" : "for coffee and carrot cake"}</p></div></article>
          <aside className="inside-joke"><span className="motif motif--underline-wave" aria-hidden="true" /><p className="keepsake-type">{isFa ? "قانون شماره‌ی ۱۲: «فقط یه عکس» هرگز فقط یه عکس نیست." : "Rule no. 12: “just one photo” is never just one photo."}</p></aside>
        </motion.section>

        <footer className="today-closing"><span className="motif motif--paired-connector" aria-hidden="true" /><p>{isFa ? "تا امشب، همین چند چیز کوچک کافی‌ست." : "Until tonight, these few little things are enough."}</p><Link href="/days/events/darband-rain" className="button button--quiet">{isFa ? "رفتن به روزهای ما" : "Visit our days"}<Icon name="back" className="icon-forward" /></Link></footer>
      </div>}
    </div>
  );
}
