import { db } from "@/lib/server/db";

export async function getOrCreateWatchSession(coupleId: string) {
  return db.watchSession.upsert({
    where: { coupleId },
    create: { id: "main", coupleId },
    update: {},
  });
}

export async function getWatchPageData(coupleId: string) {
  const session = await getOrCreateWatchSession(coupleId);
  const messages = await db.watchMessage.findMany({
    where: { sessionId: session.id },
    include: { user: { select: { id: true, identityKey: true, nameFa: true, nameEn: true } } },
    orderBy: { createdAt: "desc" },
    take: 80,
  });

  return {
    session: {
      ...session,
      updatedAt: session.updatedAt.toISOString(),
    },
    messages: messages.reverse().map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
    })),
  };
}
