import { ComingPage } from "@/components/layout/coming-page"; import { requireUser } from "@/lib/server/session";
export default async function Page(){await requireUser();return <ComingPage titleFa="سؤال‌های دونفره" titleEn="Questions for two" bodyFa="پاسخ هر نفر تا وقتی هر دو جواب نداده‌اند بسته می‌ماند." bodyEn="Each answer stays folded until both people have answered." back="/us"/>}
