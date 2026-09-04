import { SectionHub } from "@/components/layout/section-hub";
import { requireUser } from "@/lib/server/session";

export default async function ExplorePage() { await requireUser(); return <SectionHub eyebrowFa="برای آن سؤال همیشگی: حالا چی‌کار کنیم؟" eyebrowEn="For the eternal question: what do we do now?" titleFa="با هم کشف کنیم" titleEn="Explore together" introFa="اول سلیقه‌هایمان را بی‌خبر از هم انتخاب می‌کنیم؛ بعد سایت نقطه‌ی مشترک را پیدا می‌کند." introEn="We choose privately first; then the site finds where our moods overlap." items={[
  { href:"/explore/decisions", titleFa:"تصمیم دونفره", titleEn:"Decide together", bodyFa:"رأی‌های مخفی، نتیجه‌ی مشترک.", bodyEn:"Private votes, one shared result.", mark:"✓" },
  { href:"/explore/date-roulette", titleFa:"قرار شانسی", titleEn:"Date roulette", bodyFa:"با حال، وقت و بودجه‌ی واقعی خودمان.", bodyEn:"Using our actual mood, time, and budget.", mark:"↻" },
  { href:"/explore/places", titleFa:"تهرانِ ما", titleEn:"Our Tehran", bodyFa:"کافه‌ها و جاهایی که رفتیم یا دلمان می‌خواهد برویم.", bodyEn:"Places we visited or still want to find.", mark:"⌖" },
]}/>; }
