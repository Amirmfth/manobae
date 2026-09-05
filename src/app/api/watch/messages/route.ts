import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { getOrCreateWatchSession } from "@/lib/server/watch";

export const runtime = "nodejs";

const messageSchema = z.object({ message: z.string().trim().min(1).max(1000) });

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = messageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Message must be between 1 and 1000 characters." }, { status: 400 });

  const session = await getOrCreateWatchSession(user.coupleId);
  const message = await db.watchMessage.create({
    data: { sessionId: session.id, userId: user.id, message: parsed.data.message },
    include: { user: { select: { id: true, identityKey: true, nameFa: true, nameEn: true } } },
  });
  return NextResponse.json({ message: { ...message, createdAt: message.createdAt.toISOString() } });
}
