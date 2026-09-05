"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useApp } from "@/providers/app-provider";

type CalendarEvent = { id: string; title: string; happenedAt: string; type: string; photoUrl?: string | null };

export function DaysCalendar({ month, events }: { month: string; events: CalendarEvent[] }) {
  const { locale } = useApp();
  const reduced = useReducedMotion();
  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, monthNumber - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const leading = (first.getUTCDay() + 1) % 7;
  const cells = Array.from({ length: leading + daysInMonth }, (_, index) => index < leading ? null : index - leading + 1);
  const eventByDay = new Map<number, CalendarEvent[]>();
  for (const event of events) {
    const day = new Date(event.happenedAt).getUTCDate();
    eventByDay.set(day, [...(eventByDay.get(day) ?? []), event]);
  }
  const title = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-persian" : "en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
  const weekdays = locale === "fa" ? ["ش", "ی", "د", "س", "چ", "پ", "ج"] : ["S", "S", "M", "T", "W", "T", "F"];
  const previous = shiftMonth(year, monthNumber, -1);
  const next = shiftMonth(year, monthNumber, 1);

  return <section className="days-calendar" aria-label={title}>
    <header className="calendar-heading"><Link className="button button--quiet" href={`/days?month=${previous}`} aria-label="Previous month">‹</Link><h2 className="display-type">{title}</h2><Link className="button button--quiet" href={`/days?month=${next}`} aria-label="Next month">›</Link></header>
    <div className="calendar-weekdays" aria-hidden="true">{weekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
    <div className="calendar-grid">
      {cells.map((day, index) => {
        if (!day) return <span className="calendar-day calendar-day--empty" key={`empty-${index}`} />;
        const dayEvents = eventByDay.get(day) ?? [];
        const event = dayEvents[0];
        const label = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(day);
        const content = <><span className="calendar-day__number">{label}</span>{event && <><span className={`calendar-day__mark calendar-day__mark--${event.type.toLowerCase()}`} /><span className="calendar-day__title">{event.title}{dayEvents.length > 1 ? ` +${dayEvents.length - 1}` : ""}</span></>}</>;
        return event ? <motion.div key={day} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .012, .25) }}><Link className="calendar-day calendar-day--filled" href={`/days/events/${event.id}`}>{content}</Link></motion.div> : <span className="calendar-day" key={day}>{content}</span>;
      })}
    </div>
  </section>;
}

function shiftMonth(year: number, month: number, amount: number) {
  const date = new Date(Date.UTC(year, month - 1 + amount, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}
