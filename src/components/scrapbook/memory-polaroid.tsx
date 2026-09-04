"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { EventFixture } from "@/lib/mock-data";
import type { Locale } from "@/lib/locale";

type Photo = EventFixture["photos"][number];

export function MemoryPolaroid({ photo, locale, caption, rotation = 0 }: { photo: Photo; locale: Locale; caption: string; rotation?: -0.8 | 0 | 0.7 }) {
  const reduced = useReducedMotion();
  return (
    <motion.figure className="polaroid" initial={reduced ? false : { opacity: 0, y: 20, rotate: 0, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, rotate: rotation, scale: 1 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -2, rotate: 0 }} transition={{ duration: 0.54 }}>
      <div className="photo-fixture">
        <Image src={photo.src} alt={photo.alt[locale]} fill sizes="(max-width: 767px) 84vw, 32vw" style={{ objectPosition: photo.position ?? "50% 50%" }} />
      </div>
      <figcaption>{caption}</figcaption>
    </motion.figure>
  );
}
