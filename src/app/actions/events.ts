"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EventType } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { requireUser } from "@/lib/server/session";
import { getStorageClient, uploadPrivateMemory } from "@/lib/server/storage";

export type EventActionState = { error?: string };

const eventSchema = z.object({
  title: z.string().trim().min(2).max(120),
  happenedAt: z.coerce.date(),
  type: z.nativeEnum(EventType),
  summary: z.string().trim().max(4000).optional(),
  memory: z.string().trim().max(6000).optional(),
  placeName: z.string().trim().max(160).optional(),
});

export async function createEvent(_: EventActionState, formData: FormData): Promise<EventActionState> {
  const user = await requireUser();
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "عنوان، تاریخ و نوع روز را دوباره بررسی کن. / Check the title, date, and type." };

  const { title, happenedAt, type, summary, memory, placeName } = parsed.data;
  const event = await db.$transaction(async (tx) => {
    const place = placeName ? await tx.place.create({ data: { coupleId: user.coupleId, name: placeName } }) : null;
    const participants = await tx.user.findMany({ where: { coupleId: user.coupleId }, select: { id: true } });
    return tx.event.create({
      data: {
        coupleId: user.coupleId,
        createdById: user.id,
        placeId: place?.id,
        title,
        happenedAt,
        type,
        summary: summary || null,
        memories: memory ? { create: { authorId: user.id, body: memory } } : undefined,
        participants: { create: participants.map(({ id }) => ({ userId: id })) },
      },
    });
  });

  const photos = formData.getAll("photos").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  for (const [index, photo] of photos.slice(0, 8).entries()) {
    const upload = await uploadPrivateMemory(photo, event.id);
    await db.media.create({ data: { eventId: event.id, uploadedById: user.id, storagePath: upload.storagePath, mimeType: upload.mimeType, sortOrder: index } });
  }

  revalidatePath("/days");
  redirect(`/days/events/${event.id}`);
}

export async function updateEvent(eventId: string, _: EventActionState, formData: FormData): Promise<EventActionState> {
  const user = await requireUser();
  const parsed = eventSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "بعضی از جزئیات این روز کامل نیست. / Some day details are incomplete." };
  const existing = await db.event.findFirst({ where: { id: eventId, coupleId: user.coupleId }, select: { id: true, placeId: true } });
  if (!existing) return { error: "این روز پیدا نشد. / This day could not be found." };
  const { title, happenedAt, type, summary, memory, placeName } = parsed.data;

  await db.$transaction(async (tx) => {
    let placeId = existing.placeId;
    if (placeName) {
      const place = placeId
        ? await tx.place.update({ where: { id: placeId }, data: { name: placeName } })
        : await tx.place.create({ data: { coupleId: user.coupleId, name: placeName } });
      placeId = place.id;
    }
    await tx.event.update({ where: { id: eventId }, data: { title, happenedAt, type, summary: summary || null, placeId } });
    if (memory) {
      const existingMemory = await tx.eventMemory.findFirst({ where: { eventId, authorId: user.id } });
      if (existingMemory) await tx.eventMemory.update({ where: { id: existingMemory.id }, data: { body: memory } });
      else await tx.eventMemory.create({ data: { eventId, authorId: user.id, body: memory } });
    }
  });
  revalidatePath("/days");
  revalidatePath(`/days/events/${eventId}`);
  redirect(`/days/events/${eventId}`);
}

export async function deleteEvent(eventId: string) {
  const user = await requireUser();
  const event = await db.event.findFirst({ where: { id: eventId, coupleId: user.coupleId }, include: { media: true } });
  if (!event) redirect("/days");
  if (event.media.length && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const bucket = process.env.SUPABASE_MEDIA_BUCKET ?? "memories";
    await getStorageClient().storage.from(bucket).remove(event.media.map(({ storagePath }) => storagePath));
  }
  await db.event.delete({ where: { id: event.id } });
  revalidatePath("/days");
  redirect("/days");
}
