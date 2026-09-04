"use client";

import Link from "next/link";
import { useApp } from "@/providers/app-provider";

export function ComingPage({ titleFa, titleEn, bodyFa, bodyEn, back }: { titleFa: string; titleEn: string; bodyFa: string; bodyEn: string; back: string }) {
  const { locale } = useApp();
  const fa = locale === "fa";
  return <div className="page-container coming-page"><article className="coming-note stack-md"><span className="coming-note__tape" aria-hidden="true"/><p className="eyebrow">{fa ? "جای این بخش رزرو شده" : "This section has a place"}</p><h1 className="display-type">{fa ? titleFa : titleEn}</h1><p>{fa ? bodyFa : bodyEn}</p><p className="text-muted">{fa ? "پوسته‌ی مسیر آماده است؛ رفتار کامل این بخش در برش بعدی پیاده می‌شود." : "The route foundation is ready; its complete behavior belongs to the next slice."}</p><Link className="button button--quiet" href={back}>{fa ? "برگشت" : "Back"}</Link></article></div>;
}
