import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { getOrCreateWatchSession } from "@/lib/server/watch";

export const runtime = "nodejs";

const sourceSchema = z.object({
  url: z.url().max(4096).refine((value) => value.startsWith("https://") || value.startsWith("http://")),
  title: z.string().trim().max(160).nullable().optional(),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = sourceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Use a complete http or https video URL." }, { status: 400 });

  const session = await getOrCreateWatchSession(user.coupleId);
  const updated = await db.watchSession.update({
    where: { id: session.id },
    data: {
      videoUrl: parsed.data.url,
      title: parsed.data.title || null,
      currentTime: 0,
      playing: false,
      playbackRate: 1,
      updatedById: user.id,
      revision: { increment: 1 },
    },
  });
  return NextResponse.json({
    session: { ...updated, updatedAt: updated.updatedAt.toISOString() },
  });
}
