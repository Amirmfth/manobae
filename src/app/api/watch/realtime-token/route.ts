import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/session";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) return NextResponse.json({ error: "Private realtime is not configured." }, { status: 503 });

  const token = await new SignJWT({
    role: "authenticated",
    couple_id: user.coupleId,
    identity_key: user.identityKey,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(user.id)
    .setAudience("authenticated")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(new TextEncoder().encode(secret));

  return NextResponse.json({ token });
}
