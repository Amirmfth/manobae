import { db } from "@/lib/server/db";

export type TodayInsight = { kind: "on-this-day" | "saved-place" | "anniversary" | "resurface"; titleFa: string; titleEn: string; bodyFa: string; bodyEn: string; href: string };

export async function getTodayInsight(coupleId: string, now = new Date()): Promise<TodayInsight | null> {
  const [couple, pastEvents, savedPlace] = await Promise.all([
    db.couple.findUnique({ where: { id: coupleId }, select: { togetherSince: true } }),
    db.event.findMany({ where: { coupleId, happenedAt: { lt: now } }, orderBy: { happenedAt: "desc" }, take: 120 }),
    db.place.findFirst({ where: { coupleId, status: { in: ["SAVED", "PLANNED"] }, events: { none: {} } }, orderBy: { createdAt: "asc" } }),
  ]);

  const sameDay = pastEvents.find((event) => event.happenedAt.getUTCFullYear() < now.getUTCFullYear() && event.happenedAt.getUTCMonth() === now.getUTCMonth() && event.happenedAt.getUTCDate() === now.getUTCDate());
  if (sameDay) return { kind: "on-this-day", titleFa: "امروز، یک سال دیگر", titleEn: "On this day", bodyFa: `یک روز شبیه امروز، «${sameDay.title}» را لای دفتر گذاشتید.`, bodyEn: `On a day like today, you tucked “${sameDay.title}” into the scrapbook.`, href: `/days/events/${sameDay.id}` };

  if (couple?.togetherSince) {
    const anniversary = new Date(Date.UTC(now.getUTCFullYear(), couple.togetherSince.getUTCMonth(), couple.togetherSince.getUTCDate()));
    if (anniversary < now) anniversary.setUTCFullYear(anniversary.getUTCFullYear() + 1);
    const days = Math.ceil((anniversary.getTime() - now.getTime()) / 86_400_000);
    if (days <= 30) return { kind: "anniversary", titleFa: "یک تاریخ نزدیک می‌شود", titleEn: "A date is getting closer", bodyFa: `${new Intl.NumberFormat("fa-IR").format(days)} روز تا سالگرد بعدی‌تان مانده.`, bodyEn: `${days} days until your next anniversary.`, href: "/days/events/new" };
  }

  if (savedPlace) return { kind: "saved-place", titleFa: "یک جای منتظر", titleEn: "A place still waiting", bodyFa: `«${savedPlace.name}» را ذخیره کرده‌اید، اما هنوز خاطره‌ای به آن وصل نشده.`, bodyEn: `You saved “${savedPlace.name}”, but it still has no memory attached.`, href: "/explore/places" };

  const oldMemory = pastEvents.find((event) => now.getTime() - event.happenedAt.getTime() > 60 * 86_400_000);
  return oldMemory ? { kind: "resurface", titleFa: "از تهِ کشوی خاطره‌ها", titleEn: "From the memory drawer", bodyFa: `بد نیست دوباره سری به «${oldMemory.title}» بزنید.`, bodyEn: `It might be a good day to revisit “${oldMemory.title}”.`, href: `/days/events/${oldMemory.id}` } : null;
}
