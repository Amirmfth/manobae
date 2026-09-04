import { SectionHub } from "@/components/layout/section-hub";
import { requireUser } from "@/lib/server/session";

export default async function UsPage() { await requireUser(); return <SectionHub eyebrowFa="چیزهایی که فقط بین ما معنی دارند" eyebrowEn="Things that only make sense between us" titleFa="ما، از نزدیک" titleEn="Us, up close" introFa="جواب‌های خصوصی، توجه‌های کوچک و چیزهایی که با گذشت زمان بهتر همدیگر را یادمان می‌دهند." introEn="Private answers, small observations, and the things that teach us each other over time." items={[
  { href:"/us/questions", titleFa:"سؤال‌های دونفره", titleEn:"Questions for two", bodyFa:"اول جواب بده؛ بعد جواب کیمیا را ببین.", bodyEn:"Answer first, then reveal Kimia’s answer.", mark:"؟" },
  { href:"/us/appreciations", titleFa:"چیزهای کوچکی که دیدیم", titleEn:"Little things we noticed", bodyFa:"یک آرشیو آرام از توجه‌ها و تشکرها.", bodyEn:"A quiet archive of attention and appreciation.", mark:"✦" },
]}/>; }
