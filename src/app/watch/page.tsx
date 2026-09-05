import type { Metadata } from "next";
import { WatchRoom } from "@/components/watch/watch-room";
import { requireUser } from "@/lib/server/session";
import { getWatchPageData } from "@/lib/server/watch";

export const metadata: Metadata = {
  title: "Watch Together",
  description: "A private cinema for Amir and Kimia.",
};

export default async function WatchPage() {
  const user = await requireUser();
  const data = await getWatchPageData(user.coupleId);
  const realtimeConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL
    && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    && process.env.SUPABASE_JWT_SECRET,
  );

  return (
    <WatchRoom
      initialSession={data.session}
      initialMessages={data.messages}
      currentUser={{
        id: user.id,
        identityKey: user.identityKey,
        nameFa: user.nameFa,
        nameEn: user.nameEn,
        coupleId: user.coupleId,
      }}
      realtimeConfigured={realtimeConfigured}
    />
  );
}
