import type { Metadata } from "next";
import { TodayExperience } from "@/components/scrapbook/today-experience";

export const metadata: Metadata = {
  title: "Today",
  description: "A daily question, mood, appreciation, and shared memory.",
};

export default function TodayPage() {
  return <TodayExperience />;
}
