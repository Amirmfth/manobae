import { notFound } from "next/navigation";
import { updateEvent } from "@/app/actions/events";
import { EventForm } from "@/components/forms/event-form";
import { db } from "@/lib/server/db";
import { requireUser } from "@/lib/server/session";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const event = await db.event.findFirst({ where: { id, coupleId: user.coupleId }, include: { place: true, memories: { where: { authorId: user.id }, take: 1 } } });
  if (!event) notFound();
  const action = updateEvent.bind(null, event.id);
  return <div className="page-container editor-page"><header className="editor-intro stack-sm"><p className="eyebrow">برگردیم به آن روز</p><h1 className="display-type">ویرایش «{event.title}»</h1><p className="text-muted">قصه را کامل‌تر کن؛ بدون این‌که جای آن روز در تقویم عوض شود.</p></header><div className="editor-paper"><EventForm action={action} submitLabel="ذخیره‌ی تغییرها" defaults={{ title: event.title, happenedAt: event.happenedAt.toISOString().slice(0,10), type: event.type, summary: event.summary ?? "", memory: event.memories[0]?.body ?? "", placeName: event.place?.name ?? "" }} /></div></div>;
}
