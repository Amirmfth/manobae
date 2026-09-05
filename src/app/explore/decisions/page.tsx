import { ComingPage } from "@/components/layout/coming-page"; import { requireUser } from "@/lib/server/session";
export default async function Page(){await requireUser();return <ComingPage titleFa="تصمیم دونفره" titleEn="Decide together" bodyFa="هر نفر خصوصی انتخاب می‌کند و فقط نقطه‌های مشترک باز می‌شوند." bodyEn="Each person chooses privately; only the overlap is revealed." back="/explore"/>}
