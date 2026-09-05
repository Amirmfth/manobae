import Link from "next/link";
import { DaysCalendar } from "@/components/days/days-calendar";
import { db } from "@/lib/server/db";
import { requireUser } from "@/lib/server/session";
import { signedMemoryUrl } from "@/lib/server/storage";

export default async function DaysPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const user = await requireUser();
  const requested = (await searchParams).month;
  const month = /^\d{4}-\d{2}$/.test(requested ?? "") ? requested! : new Date().toISOString().slice(0, 7);
  const [year, monthNumber] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));
  const records = await db.event.findMany({
    where: { coupleId: user.coupleId, happenedAt: { gte: start, lt: end } },
    include: { media: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { happenedAt: "asc" },
  });
  const events = await Promise.all(records.map(async (event) => ({
    id: event.id, title: event.title, happenedAt: event.happenedAt.toISOString(), type: event.type,
    photoUrl: event.media[0] ? await signedMemoryUrl(event.media[0].storagePath).catch(() => null) : null,
  })));

  return <div className="page-container days-page stack-xl">
    <header className="page-header"><div className="stack-sm"><p className="eyebrow">تقویمی که کم‌کم شبیه ما می‌شود</p><h1 className="display-type">روزهای ما</h1><p className="text-muted reading-width">قرارهای بزرگ و لحظه‌های کوچکی که دلمان نمی‌خواهد گم شوند.</p></div><Link className="button button--primary" href="/days/events/new">گذاشتن یک روز تازه</Link></header>
    <DaysCalendar month={month} events={events} />
    {!events.length && <div className="empty-day-note"><span className="motif motif--date-stamp" aria-hidden="true" /><div><h2>این ماه هنوز سفید مانده</h2><p>اولین تکه‌اش را با یک عکس، یک جمله، یا اسم جایی که رفتید پر کن.</p></div><Link className="button button--secondary" href="/days/events/new">ثبت اولین روز</Link></div>}
  </div>;
}
