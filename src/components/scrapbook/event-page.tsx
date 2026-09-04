"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMotionLanguage } from "@/components/motion/motion-system";
import { ContactSheet, HeroPhotograph } from "@/components/scrapbook/photo-compositions";
import { Icon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/overlay";
import { EmptyState } from "@/components/ui/states";
import { events, type EventFixture } from "@/lib/mock-data";
import { useApp } from "@/providers/app-provider";

export function EventPage({ event }: { event: EventFixture }) {
  const { locale, toast } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [longCopy, setLongCopy] = useState(false);
  const isFa = locale === "fa";
  const motionLanguage = useMotionLanguage("shared", isFa);
  const alternate = events.find((item) => item.id !== event.id) ?? events[0];

  return (
    <article className="event-page page-container">
      <header className="event-hero">
        <div className="event-hero__actions">
          <Link href="/today" className="button button--quiet"><Icon name="back" className="icon-back" />{isFa ? "امروز" : "Today"}</Link>
          <button type="button" className="button button--secondary" onClick={() => setEditOpen(true)}><Icon name="edit" />{isFa ? "ویرایش خاطره" : "Edit memory"}</button>
        </div>
        <motion.div className="event-hero__copy stack-md" {...motionLanguage.page}>
          <p className="eyebrow">{event.type[locale]}</p>
          <h1 className="event-title display-type">{event.title[locale]}</h1>
          <div className="event-meta"><time dateTime={event.gregorianDate}>{event.date[locale]}</time><span aria-hidden="true">·</span><span><Icon name="place" />{event.location[locale]}</span></div>
        </motion.div>
        <span className="event-hero__thread motif motif--thread" aria-hidden="true" />
        <motion.div className="event-stamp" aria-label={`${event.location[locale]} · ${event.date[locale]}`} initial={motionLanguage.reduced ? false : { opacity: 0, y: -18, rotate: -8, scale: 1.14 }} animate={{ opacity: 0.72, y: 0, rotate: -3, scale: 1 }} transition={{ duration: 0.76, delay: motionLanguage.reduced ? 0 : 0.18 }}><span>{isFa ? "خاطره" : "MEMORY"}</span><strong>{event.date[locale]}</strong><small>{event.location[locale]}</small></motion.div>
      </header>

      <section className={`event-photography ${event.photos.length === 0 ? "photo-composition--empty" : ""}`} aria-label={isFa ? "عکس‌های این خاطره" : "Photos from this memory"}>
        {event.photos.length ? <><HeroPhotograph photo={event.photos[0]} locale={locale} caption={event.location[locale]} />{event.photos.length > 1 && <ContactSheet photos={event.photos.slice(1)} locale={locale} label={isFa ? "برگه‌ی تماس عکس‌های دیگر" : "Contact sheet of the other photographs"} />}</> : <EmptyState title={isFa ? "هنوز عکسی به این روز وصل نشده" : "No photo is attached to this day yet"} description={isFa ? "وقتی عکس‌های خودتان آماده بود، اینجا جای آن‌هاست." : "When your own photos are ready, this is where they’ll live."} action={<button type="button" className="button button--secondary" onClick={() => toast(isFa ? "افزودن عکس در مرحله‌ی بعد پیاده‌سازی می‌شود." : "Photo upload comes in the next implementation phase.")}>{isFa ? "افزودن عکس" : "Add a photo"}</button>} />}
      </section>

      <motion.section className="event-story reading-width stack-lg" {...motionLanguage.reveal()}>
        <div className="stack-sm"><p className="eyebrow">{isFa ? "آنچه با هم به یاد می‌آوریم" : "What we remember together"}</p><h2 className="section-title display-type">{isFa ? "روایت این روز" : "The story of this day"}</h2></div>
        <p className="body-large">{event.description[locale]}</p>
        <AnimatePresence initial={false}>{longCopy && <motion.p key="long-event-note" className="body-large" initial={{ opacity: 0, y: motionLanguage.reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: motionLanguage.reduced ? 0 : -6 }}>{isFa ? "بعدتر، وقتی از پیچ آخر پایین می‌آمدیم، درباره‌ی سفرهایی حرف زدیم که هنوز نرفته‌ایم؛ از یک کلبه‌ی کوچک تا صبحی که شاید در استانبول با صدای کشتی‌ها بیدار شویم. هیچ تصمیم بزرگی نگرفتیم. فقط آهسته راه رفتیم و اجازه دادیم آن روز، همان‌طور ساده و خیس، در خاطرمان بماند." : "Later, on the last bend down, we talked about journeys we haven’t taken yet—from a tiny cabin to a morning in Istanbul waking to the ferries. We made no grand decisions. We just walked slowly and let the day remain simple, rain-soaked, and ours."}</motion.p>}</AnimatePresence>
        <button type="button" className="button button--quiet story-toggle" aria-expanded={longCopy} onClick={() => setLongCopy((value) => !value)}>{longCopy ? (isFa ? "کوتاه‌تر" : "Read less") : (isFa ? "خواندن یادداشت بلند" : "Read the long note")}</button>
        <p className="mixed-note"><span>{isFa ? "یادداشت کوچک:" : "Tiny note:"}</span> “Meet me by the tall mirror” — ساعت <bdi dir="ltr">17:40</bdi></p>
      </motion.section>

      <motion.section className="personal-memories thread-pair" {...motionLanguage.reveal()} aria-labelledby="personal-title">
        <div className="personal-memories__heading stack-sm"><p className="eyebrow">{isFa ? "دو نگاه به یک روز" : "Two views of one day"}</p><h2 id="personal-title" className="section-title display-type">{isFa ? "یادداشت‌های ما" : "Our private notes"}</h2></div>
        <article className="personal-note personal-note--amir"><span>Amir</span><p>{event.amirMemory[locale]}</p></article>
        <svg className="memory-thread" viewBox="0 0 320 90" preserveAspectRatio="none" aria-hidden="true"><motion.path d="M18 54 C92 5 214 86 302 34" pathLength={1} initial={motionLanguage.reduced ? false : { pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.82, delay: motionLanguage.reduced ? 0 : 0.28 }} /></svg><article className="personal-note personal-note--partner"><span>{isFa ? "کیمیا" : "Kimia"}</span><p>{event.partnerMemory[locale]}</p></article>
      </motion.section>

      <motion.section className="artifact-shelf" {...motionLanguage.reveal()} aria-labelledby="artifact-title">
        <div><p className="eyebrow">{isFa ? "چیزهایی که ماند" : "Things we kept"}</p><h2 id="artifact-title" className="section-title display-type">{isFa ? "ریزخاطره‌ها" : "Little evidence"}</h2></div>
        <div className="artifact-row"><span className="artifact artifact--ticket">{isFa ? "رسید دو قهوه" : "Two coffees"}</span><span className="artifact artifact--time" dir="ltr">17:40</span><span className="artifact artifact--quote keepsake-type">{isFa ? "«این آخریه!»" : "“Last one!”"}</span></div>
      </motion.section>

      <motion.section id="related" className="related-artifacts" {...motionLanguage.reveal()}>
        <div className="stack-sm"><p className="eyebrow">{isFa ? "نخ‌های وصل‌شده" : "Threads from this day"}</p><h2 className="section-title display-type">{isFa ? "این خاطره به کجا می‌رسد" : "Where this memory leads"}</h2></div>
        <div className="related-list"><div><Icon name="place" /><span><small>{isFa ? "جای مرتبط" : "Related place"}</small><strong>{event.relatedPlace[locale]}</strong></span></div><div><Icon name="dreams" /><span><small>{isFa ? "رویای مرتبط" : "Related dream"}</small><strong>{event.relatedDream[locale]}</strong></span></div></div>
        <Link href={`/days/events/${alternate.id}`} className="button button--secondary fixture-link">{isFa ? `دیدن حالت ${alternate.photos.length ? "چندعکسی" : "بدون عکس"}` : `View ${alternate.photos.length ? "multi-photo" : "empty-media"} fixture`}</Link>
      </motion.section>

      <motion.footer className="event-closing" {...motionLanguage.reveal()}><span className="motif motif--constellation" aria-hidden="true" /><p className="keepsake-type">{isFa ? "آخرش عکس خوب نگرفتیم؛ یک روز خوب داشتیم." : "We didn’t get the perfect photo. We got a good day."}</p><time dateTime={event.gregorianDate}>{event.date[locale]}</time></motion.footer>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={isFa ? "ویرایش این خاطره" : "Edit this memory"} closeLabel={isFa ? "بستن" : "Close"}>
        <form className="stack-lg" onSubmit={(event) => { event.preventDefault(); setEditOpen(false); toast(isFa ? "تغییرات نمونه ذخیره شد." : "Prototype changes saved."); }}>
          <div><label className="field-label" htmlFor="event-title-input">{isFa ? "نام خاطره" : "Memory title"}</label><input id="event-title-input" className="text-field" defaultValue={event.title[locale]} /></div>
          <div><label className="field-label" htmlFor="event-note-input">{isFa ? "روایت مشترک" : "Shared story"}</label><textarea id="event-note-input" className="text-area" defaultValue={event.description[locale]} /></div>
          <div className="cluster"><button className="button button--primary" type="submit">{isFa ? "نگه داشتن تغییرات" : "Keep changes"}</button><button className="button button--quiet" type="button" onClick={() => setEditOpen(false)}>{isFa ? "انصراف" : "Cancel"}</button></div>
        </form>
      </Modal>
    </article>
  );
}
