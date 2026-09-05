"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useApp } from "@/providers/app-provider";

type HubItem = { href: string; titleFa: string; titleEn: string; bodyFa: string; bodyEn: string; mark: string };

export function SectionHub({ eyebrowFa, eyebrowEn, titleFa, titleEn, introFa, introEn, items }: { eyebrowFa: string; eyebrowEn: string; titleFa: string; titleEn: string; introFa: string; introEn: string; items: HubItem[] }) {
  const { locale } = useApp();
  const fa = locale === "fa";
  return <div className="page-container hub-page stack-xl"><header className="hub-hero stack-md"><p className="eyebrow">{fa ? eyebrowFa : eyebrowEn}</p><h1 className="display-type">{fa ? titleFa : titleEn}</h1><p className="body-large text-muted reading-width">{fa ? introFa : introEn}</p></header><div className="hub-index">{items.map((item, index) => <motion.div key={item.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }}><Link href={item.href} className="hub-slip"><span className="hub-slip__mark" aria-hidden="true">{item.mark}</span><span><strong>{fa ? item.titleFa : item.titleEn}</strong><small>{fa ? item.bodyFa : item.bodyEn}</small></span><span className="hub-slip__arrow" aria-hidden="true">↗</span></Link></motion.div>)}</div></div>;
}
