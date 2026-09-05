import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashOpaqueToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function createOpaqueToken() {
  return randomBytes(32).toString("base64url");
}

export function verifyPasscode(passcode: string, stored: string) {
  const [salt, expectedHex] = stored.split(":");
  if (!salt || !expectedHex) return false;
  const actual = scryptSync(passcode, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

export function fingerprintRequest(ip: string, userAgent: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters.");
  return createHash("sha256").update(`${secret}:${ip}:${userAgent}`).digest("hex");
}
