import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { getOrCreateWatchSession } from "@/lib/server/watch";

export const runtime = "nodejs";

const stateSchema = z.object({
  currentTime: z.number().finite().min(0),
  playing: z.boolean(),
  playbackRate: z.number().finite().min(0.25).max(4),
});

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = stateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid playback state." }, { status: 400 });

  const session = await getOrCreateWatchSession(user.coupleId);
  const updated = await db.watchSession.update({
    where: { id: session.id },
    data: { ...parsed.data, updatedById: user.id, revision: { increment: 1 } },
    select: { revision: true, updatedAt: true },
  });
  return NextResponse.json({ revision: updated.revision, updatedAt: updated.updatedAt.toISOString() });
}
