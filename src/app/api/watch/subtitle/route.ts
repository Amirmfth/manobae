import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/session";
import { getOrCreateWatchSession } from "@/lib/server/watch";

export const runtime = "nodejs";
const MAX_SUBTITLE_BYTES = 1024 * 1024;

function subtitleView(session: Awaited<ReturnType<typeof getOrCreateWatchSession>>) {
  return {
    subtitleContent: session.subtitleContent,
    subtitleType: session.subtitleType,
    subtitleLabel: session.subtitleLabel,
    subtitleLanguage: session.subtitleLanguage,
    subtitleFileName: session.subtitleFileName,
    revision: session.revision,
  };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ subtitle: subtitleView(await getOrCreateWatchSession(user.coupleId)) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an SRT or VTT file." }, { status: 400 });
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension !== "srt" && extension !== "vtt") return NextResponse.json({ error: "Only .srt and .vtt subtitles are supported." }, { status: 400 });
  if (file.size > MAX_SUBTITLE_BYTES) return NextResponse.json({ error: "Subtitle files must be smaller than 1 MB." }, { status: 413 });
  const content = (await file.text()).replace(/^\uFEFF/, "").trim();
  if (!content) return NextResponse.json({ error: "This subtitle file is empty." }, { status: 400 });
  const session = await getOrCreateWatchSession(user.coupleId);
  const updated = await db.watchSession.update({
    where: { id: session.id },
    data: {
      subtitleContent: content,
      subtitleType: extension,
      subtitleLabel: String(form.get("label") || "Subtitles").trim().slice(0, 80),
      subtitleLanguage: String(form.get("language") || "fa").trim().slice(0, 16),
      subtitleFileName: file.name.slice(0, 255),
      updatedById: user.id,
      revision: { increment: 1 },
    },
  });
  return NextResponse.json({ subtitle: subtitleView(updated) });
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const session = await getOrCreateWatchSession(user.coupleId);
  const updated = await db.watchSession.update({
    where: { id: session.id },
    data: {
      subtitleContent: null,
      subtitleType: null,
      subtitleLabel: null,
      subtitleLanguage: null,
      subtitleFileName: null,
      updatedById: user.id,
      revision: { increment: 1 },
    },
  });
  return NextResponse.json({ subtitle: subtitleView(updated) });
}
