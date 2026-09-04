"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMotionLanguage } from "@/components/motion/motion-system";
import type { EventFixture } from "@/lib/mock-data";
import type { Locale } from "@/lib/locale";
import { useApp } from "@/providers/app-provider";

type Photo = EventFixture["photos"][number];

function PhotoImage({ photo, locale, sizes }: { photo: Photo; locale: Locale; sizes: string }) {
  return <Image src={photo.src} alt={photo.alt[locale]} fill sizes={sizes} style={{ objectPosition: photo.position ?? "50% 50%" }} />;
}

function usePhotoMotion(locale: Locale) {
  const { theme } = useApp();
  const language = useMotionLanguage(theme, locale === "fa");
  const rotations = theme === "rose" ? [-1.8, 1.8, -0.9, 1.15] : theme === "night" ? [-0.8, 0.8, -0.35, 0.45] : [-1, 1, -0.5, 0.6];
  return { language, rotations };
}

export function HeroPhotograph({ photo, locale, caption }: { photo: Photo; locale: Locale; caption: string }) {
  const { language, rotations } = usePhotoMotion(locale);
  return <motion.div initial={language.reduced ? false : { opacity: 0, y: 24, scale: 0.965 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.72 }}><motion.figure className="hero-photo" initial={{ rotate: rotations[0] }} whileHover={{ y: -2, rotate: 0 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.12 }}><motion.span className="tape tape--top" aria-hidden="true" initial={language.reduced ? false : { opacity: 0, scaleX: 0.7 }} whileInView={{ opacity: 0.9, scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.28, delay: language.reduced ? 0 : 0.48 }} /><div className="hero-photo__image"><PhotoImage photo={photo} locale={locale} sizes="(max-width: 767px) 100vw, 900px" /></div><figcaption>{caption}</figcaption></motion.figure></motion.div>;
}

export function PhotoStack({ photos, locale, label }: { photos: Photo[]; locale: Locale; label: string }) {
  const [front, setFront] = useState(0);
  const { language, rotations } = usePhotoMotion(locale);
  const visiblePhotos = photos.slice(0, 4);
  return <motion.div className="photo-stack" role="group" aria-label={label} {...language.reveal()}>{visiblePhotos.map((photo, index) => <motion.button key={photo.id} type="button" layout className={`photo-stack__item photo-stack__item--${index + 1}${front === index ? " is-front" : ""}`} onClick={() => setFront(index)} aria-pressed={front === index} aria-label={`${photo.alt[locale]} · ${locale === "fa" ? "آوردن عکس به جلو" : "bring photograph forward"}`} animate={{ y: front === index ? -4 : 0, rotate: front === index ? 0 : rotations[index], scale: front === index ? 1.015 : 1, zIndex: front === index ? 3 : index + 1 }} whileHover={{ y: -2, rotate: 0 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.8 }}><motion.span className={`tape ${index % 2 ? "tape--corner" : "tape--top"}`} aria-hidden="true" animate={{ opacity: front === index ? 0.94 : 0.74 }} /><span className="photo-stack__image"><PhotoImage photo={photo} locale={locale} sizes="(max-width: 767px) 70vw, 320px" /></span></motion.button>)}<div className="photo-stack__controls" aria-label={locale === "fa" ? "انتخاب عکس جلو" : "Choose front photograph"}>{visiblePhotos.map((photo, index) => <motion.button key={photo.id} type="button" aria-pressed={front === index} onClick={() => setFront(index)} aria-label={`${locale === "fa" ? "عکس" : "Photo"} ${index + 1}`} whileTap={{ scale: 0.9 }}>{index + 1}</motion.button>)}</div></motion.div>;
}

export function ContactSheet({ photos, locale, label }: { photos: Photo[]; locale: Locale; label: string }) {
  const { language, rotations } = usePhotoMotion(locale);
  return <motion.div className="contact-sheet" aria-label={label} {...language.reveal(0.06)}>{photos.map((photo, index) => <motion.figure className={`contact-sheet__item contact-sheet__item--${index + 1}`} key={photo.id} initial={language.reduced ? false : { opacity: 0, y: 14, rotate: rotations[index + 1] }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} whileHover={{ y: -2, rotate: 0 }} transition={{ duration: 0.48, delay: language.reduced ? 0 : index * 0.06 }}><div><PhotoImage photo={photo} locale={locale} sizes="(max-width: 767px) 45vw, 300px" /></div><figcaption>{String(index + 1).padStart(2, "0")}</figcaption></motion.figure>)}</motion.div>;
}

export function KeepsakePhotograph({ photo, locale, caption }: { photo: Photo; locale: Locale; caption: string }) {
  const { language, rotations } = usePhotoMotion(locale);
  return <motion.figure className="keepsake-photo" initial={language.reduced ? false : { opacity: 0, y: 16, rotate: rotations[1] }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} whileHover={{ y: -2, rotate: 0 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.54 }}><motion.span className="tape tape--corner" aria-hidden="true" initial={language.reduced ? false : { opacity: 0 }} whileInView={{ opacity: 0.9 }} viewport={{ once: true }} transition={{ delay: language.reduced ? 0 : 0.36 }} /><div><PhotoImage photo={photo} locale={locale} sizes="(max-width: 767px) 72vw, 340px" /></div><figcaption className="keepsake-type">{caption}</figcaption></motion.figure>;
}
