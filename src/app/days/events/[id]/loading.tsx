import { LoadingSkeleton } from "@/components/ui/states";

export default function EventLoading() {
  return <div className="page-container"><div className="reading-width"><LoadingSkeleton label="Loading memory" /></div></div>;
}
