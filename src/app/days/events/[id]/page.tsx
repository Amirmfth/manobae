import type { Metadata } from "next";
import { EventPage } from "@/components/scrapbook/event-page";
import { events, getEvent } from "@/lib/mock-data";

type EventPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = getEvent(id);
  return { title: event.title.en, description: event.description.en, openGraph: { images: [] }, twitter: { images: [] } };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { id } = await params;
  return <EventPage event={getEvent(id)} />;
}
