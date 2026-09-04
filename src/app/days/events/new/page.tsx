import { createEvent } from "@/app/actions/events";
import { EventForm } from "@/components/forms/event-form";
import { requireUser } from "@/lib/server/session";

export default async function NewEventPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  await requireUser();
  const date = (await searchParams).date ?? new Date().toISOString().slice(0, 10);
  return <div className="page-container editor-page"><header className="editor-intro stack-sm"><p className="eyebrow">یک برگ تازه</p><h1 className="display-type">امروز چه چیزی را نگه داریم؟</h1><p className="text-muted">لازم نیست یک قرار رسمی باشد؛ یک رانندگی طولانی یا خنده‌ی بی‌دلیل هم جای خودش را دارد.</p></header><div className="editor-paper"><span className="editor-paper__tape" aria-hidden="true" /><EventForm action={createEvent} defaults={{ happenedAt: date }} /></div></div>;
}
