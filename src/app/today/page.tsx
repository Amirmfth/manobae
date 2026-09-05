import type { Metadata } from "next";
import { TodayExperience } from "@/components/scrapbook/today-experience";
import { requireUser } from "@/lib/server/session";
import { getTodayInsight } from "@/lib/server/insights";

export const metadata: Metadata = {
  title: "Today",
  description: "A daily question, mood, appreciation, and shared memory.",
};

export default async function TodayPage() {
  const user = await requireUser();
  const insight = await getTodayInsight(user.coupleId);
  return <TodayExperience insight={insight} />;
}
