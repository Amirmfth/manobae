import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteEvent } from "@/app/actions/events";
import { db } from "@/lib/server/db";
import { requireUser } from "@/lib/server/session";
import { signedMemoryUrl } from "@/lib/server/storage";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const event = await db.event.findFirst({
    where: { id, coupleId: user.coupleId },
    include: { place: true, media: { orderBy: { sortOrder: "asc" } }, memories: { include: { author: true }, orderBy: { createdAt: "asc" } } },
  });
  if (!event) notFound();
  const photos = await Promise.all(event.media.map(async (item) => ({ ...item, url: await signedMemoryUrl(item.storagePath).catch(() => null) })));
  const visibleMemories = event.memories.filter((memory) => memory.visibility === "SHARED" || memory.authorId === user.id);
  const date = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { dateStyle: "long", timeZone: "UTC" }).format(event.happenedAt);
  const deleteAction = deleteEvent.bind(null, event.id);

  return <article className="real-event page-container">
    <header className="real-event__hero"><div className="real-event__stamp"><span>{date}</span><small>{event.type}</small></div><div className="stack-md"><p className="eyebrow">یک برگ از روزهای ما</p><h1 className="display-type">{event.title}</h1>{event.place && <p className="real-event__place">⌖ {event.place.name}</p>}</div></header>
    {photos.length > 0 && <div className={`real-event__photos real-event__photos--${Math.min(photos.length, 3)}`}>{photos.map((photo, index) => photo.url && <figure key={photo.id} style={{ "--photo-index": index } as React.CSSProperties}><Image src={photo.url} alt={photo.altFa ?? `عکس ${index + 1} از ${event.title}`} width={900} height={1100} sizes="(max-width: 768px) 84vw, 36vw" /><span aria-hidden="true" /></figure>)}</div>}
    {!photos.length && <div className="real-event__photo-placeholder"><span className="motif motif--photo-corner" aria-hidden="true" /><p>این خاطره فعلاً فقط با کلمه‌ها نفس می‌کشد.</p></div>}
    {event.summary && <section className="real-event__story"><span className="motif motif--underline-wave" aria-hidden="true" /><h2>قصه‌ی مشترکمان</h2><p>{event.summary}</p></section>}
    {visibleMemories.length > 0 && <section className="memory-notes"><h2 className="sr-only">یادداشت‌های ما</h2>{visibleMemories.map((memory) => <blockquote key={memory.id}><p>{memory.body}</p><footer>— {memory.author.nameFa}</footer></blockquote>)}</section>}
    <footer className="real-event__actions"><Link className="button button--secondary" href={`/days/events/${event.id}/edit`}>ویرایش این برگ</Link><form action={deleteAction}><button className="button button--danger" type="submit">پاک کردن این روز</button></form></footer>
  </article>;
}
