"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { createSession, destroySession } from "@/lib/server/session";
import { fingerprintRequest, verifyPasscode } from "@/lib/server/security";

export type LoginState = { error?: string };

const loginSchema = z.object({ passcode: z.string().regex(/^\d{6}$/) });

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ passcode: formData.get("passcode") });
  if (!parsed.success) return { error: "کد باید دقیقاً شش رقم باشد. / Enter exactly six digits." };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const fingerprint = fingerprintRequest(ip, requestHeaders.get("user-agent") ?? "unknown");
  const now = new Date();
  const attempt = await db.loginAttempt.findUnique({ where: { fingerprint } });
  if (attempt?.blockedUntil && attempt.blockedUntil > now) {
    return { error: "چند دقیقه صبر کن و دوباره امتحان کن. / Please wait a few minutes." };
  }

  const users = await db.user.findMany();
  const user = users.find((candidate) => verifyPasscode(parsed.data.passcode, candidate.passcodeHash));
  if (!user) {
    const windowExpired = !attempt || now.getTime() - attempt.windowStart.getTime() > 10 * 60 * 1000;
    const nextCount = windowExpired ? 1 : attempt.count + 1;
    await db.loginAttempt.upsert({
      where: { fingerprint },
      create: { fingerprint, count: 1, windowStart: now },
      update: {
        count: nextCount,
        windowStart: windowExpired ? now : attempt.windowStart,
        blockedUntil: nextCount >= 5 ? new Date(now.getTime() + 15 * 60 * 1000) : null,
      },
    });
    return { error: "این کد را نمی‌شناسیم. / We don’t recognize that code." };
  }

  await db.loginAttempt.deleteMany({ where: { fingerprint } });
  await createSession(user.id);
  redirect("/today");
}

export async function logout() {
  await destroySession();
  redirect("/enter");
}
