import type { Metadata } from "next";
import { IdentityGate } from "@/components/scrapbook/identity-gate";

export const metadata: Metadata = {
  title: "Enter",
  description: "Open the private manobae prototype with a development-only passcode.",
};

export default function EnterPage() {
  return <IdentityGate />;
}
