import { NextResponse, type NextRequest } from "next/server";

const publicPaths = new Set(["/", "/enter"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicPaths.has(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/motifs") || pathname.startsWith("/images")) return NextResponse.next();
  if (!request.cookies.has("manobae_session")) return NextResponse.redirect(new URL("/enter", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!favicon.ico).*)"] };
