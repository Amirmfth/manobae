import { PrismaClient, IdentityKey } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function hashPasscode(passcode) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(passcode, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const amirPasscode = process.env.AMIR_PASSCODE;
  const kimiaPasscode = process.env.KIMIA_PASSCODE;
  if (!amirPasscode || !kimiaPasscode) {
    throw new Error("AMIR_PASSCODE and KIMIA_PASSCODE are required for seeding.");
  }

  const couple = await prisma.couple.upsert({
    where: { slug: "amir-kimia" },
    update: {},
    create: { slug: "amir-kimia", title: "من و بی", togetherSince: new Date("2024-01-01T00:00:00.000Z") },
  });

  await Promise.all([
    prisma.user.upsert({
      where: { identityKey: IdentityKey.AMIR },
      update: { coupleId: couple.id, nameFa: "امیر", nameEn: "Amir", passcodeHash: hashPasscode(amirPasscode) },
      create: { coupleId: couple.id, identityKey: IdentityKey.AMIR, nameFa: "امیر", nameEn: "Amir", passcodeHash: hashPasscode(amirPasscode) },
    }),
    prisma.user.upsert({
      where: { identityKey: IdentityKey.KIMIA },
      update: { coupleId: couple.id, nameFa: "کیمیا", nameEn: "Kimia", passcodeHash: hashPasscode(kimiaPasscode) },
      create: { coupleId: couple.id, identityKey: IdentityKey.KIMIA, nameFa: "کیمیا", nameEn: "Kimia", passcodeHash: hashPasscode(kimiaPasscode) },
    }),
  ]);
}

main().finally(() => prisma.$disconnect());
