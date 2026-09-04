import type { IdentityId, ThemeName } from "@/lib/theme";

export type LocalizedText = { fa: string; en: string };
export type QuestionState = "locked" | "waiting" | "revealed";

export type Identity = {
  id: IdentityId;
  name: LocalizedText;
  greeting: LocalizedText;
  theme: ThemeName;
};

export type EventFixture = {
  id: string;
  title: LocalizedText;
  date: LocalizedText;
  gregorianDate: string;
  type: LocalizedText;
  location: LocalizedText;
  description: LocalizedText;
  amirMemory: LocalizedText;
  partnerMemory: LocalizedText;
  relatedPlace: LocalizedText;
  relatedDream: LocalizedText;
  photos: Array<{ id: string; src: string; alt: LocalizedText; position?: string }>;
};

export const DEMO_PASSCODES: Record<string, IdentityId> = {
  "111111": "amir",
  "222222": "partner",
};

export const identities: Record<IdentityId, Identity> = {
  amir: {
    id: "amir",
    name: { fa: "امیر", en: "Amir" },
    greeting: { fa: "صبح بخیر، امیر", en: "Good morning, Amir" },
    theme: "night",
  },
  partner: {
    id: "partner",
    name: { fa: "کیمیا", en: "Kimia" },
    greeting: { fa: "صبح بخیر، کیمیا جان", en: "Good morning, Kimia" },
    theme: "rose",
  },
};

export const todayQuestion = {
  id: "small-warm-moment",
  prompt: {
    fa: "کدام لحظه‌ی کوچک این هفته دلت را گرم کرد؟",
    en: "Which small moment warmed your heart this week?",
  },
  answers: {
    amir: {
      fa: "وقتی وسط شلوغی خیابان دستم را گرفتی و بی‌دلیل خندیدیم.",
      en: "When you held my hand in the crowded street and we laughed for no reason.",
    },
    partner: {
      fa: "وقتی گفتی «رسیدی خبر بده» و بعد خودت زودتر پیام دادی که مطمئن شوی؛ همین توجه‌های ریزت.",
      en: "When you said “text me when you get there,” then checked first anyway. That tiny Amir kind of care.",
    },
  },
};

export const moods = [
  { id: "quiet", fa: "آرام", en: "Quiet", mark: "○" },
  { id: "bright", fa: "روشن", en: "Bright", mark: "✦" },
  { id: "tender", fa: "نرم", en: "Tender", mark: "⌒" },
  { id: "tired", fa: "خسته", en: "Tired", mark: "—" },
] as const;

export const appreciations = [
  {
    id: "tea",
    author: "partner" as const,
    text: { fa: "مرسی که باز هم آخرین سیب‌زمینی را گذاشتی برای من؛ حتی اگر وانمود کردی سیر شده‌ای.", en: "Thank you for leaving me the last fry again—even though you pretended you were full." },
  },
];

export const events: EventFixture[] = [
  {
    id: "darband-rain",
    title: { fa: "آن آینه‌ی بلند", en: "That Tall Mirror" },
    date: { fa: "۲ مرداد ۱۴۰۵", en: "July 24, 2026" },
    gregorianDate: "2026-07-24",
    type: { fa: "قرار دونفره", en: "A date together" },
    location: { fa: "یک کافه‌ی شلوغ، مرکز تهران", en: "A busy café, central Tehran" },
    description: {
      fa: "برای قهوه رفته بودیم، اما بیشترِ وقت را جلوی یک آینه‌ی قایقی‌شکل گذراندیم و سعی کردیم عکسی بگیریم که هیچ‌کداممان وسط خنده تکان نخورده باشیم. نشد؛ همین شد بهترین عکس روز.",
      en: "We went for coffee, then spent most of the time at a boat-shaped mirror trying to take one photo where neither of us moved mid-laugh. We failed. It became the best photo of the day.",
    },
    amirMemory: {
      fa: "کیمیا سه بار گفت «این آخریه» و هر سه بار دوباره برگشت سمت آینه. من هم هر سه بار کاملاً جدی باور کردم.",
      en: "Kimia said “last one” three times and walked back to the mirror every time. I very seriously believed her all three times.",
    },
    partnerMemory: {
      fa: "امیر می‌خواست خیلی جدی بایستد، ولی یک ثانیه بعد خندید. آن عکسِ تار از همه بیشتر شبیه خودمان است.",
      en: "Amir tried to look very serious, then laughed one second later. The blurry one feels the most like us.",
    },
    relatedPlace: { fa: "کافه آینه", en: "Ayeneh Café" },
    relatedDream: { fa: "پیدا کردن ده آینه‌ی عجیب دیگر در تهران", en: "Find ten more strange mirrors in Tehran" },
    photos: [
      { id: "mirror", src: "/images/IMG_20260724_000715_651.jpg", alt: { fa: "کیمیا و امیر در آینه‌ی چوبی بلند یک کافه", en: "Kimia and Amir reflected in a tall wooden café mirror" }, position: "50% 42%" },
      { id: "cafe", src: "/images/IMG_20260724_001742_112.jpg", alt: { fa: "عکس دیگری از قرار کافه‌ی کیمیا و امیر", en: "Another photograph from Kimia and Amir’s café date" }, position: "50% 35%" },
      { id: "portrait", src: "/images/PXL_20260822_141807083.jpg", alt: { fa: "کیمیا کنار جوی آب در پارکی در تهران", en: "Kimia beside a narrow stream in a Tehran park" }, position: "50% 44%" },
    ],
  },
  {
    id: "museum-afternoon",
    title: { fa: "بعدازظهرِ موزه", en: "Museum Afternoon" },
    date: { fa: "۹ خرداد ۱۴۰۵", en: "May 30, 2026" },
    gregorianDate: "2026-05-30",
    type: { fa: "روز آرام", en: "A quiet day" },
    location: { fa: "موزه هنرهای معاصر، تهران", en: "Tehran Museum of Contemporary Art" },
    description: {
      fa: "بدون برنامه وارد شدیم و بیشتر از خود آثار، درباره‌ی چیزهایی حرف زدیم که هرکدام در آن‌ها می‌دیدیم.",
      en: "We walked in without a plan and talked more about what we saw in the work than the work itself.",
    },
    amirMemory: { fa: "سکوت خنک راهروها و صدای آهسته‌ی قدم‌هایمان.", en: "Cool, quiet halls and the low sound of our footsteps." },
    partnerMemory: { fa: "آن کارت‌پستال آبی را هنوز لای کتابم نگه داشته‌ام.", en: "I still keep that blue postcard inside my book." },
    relatedPlace: { fa: "پارک لاله", en: "Laleh Park" },
    relatedDream: { fa: "یک سفر فقط برای دیدن هنر", en: "A trip built around art" },
    photos: [],
  },
];

export const places = [
  { id: "rue", name: { fa: "کافه روبرتو", en: "Roberto Café" }, area: { fa: "بلوار کشاورز", en: "Keshavarz Boulevard" } },
];

export const dreams = [
  { id: "first-snow", title: { fa: "دیدن تهران در اولین برف", en: "See Tehran in the first snow" }, status: "planning" as const },
];

export const recentMemories = [
  { id: "park", src: "/images/PXL_20260822_141807083.jpg", alt: { fa: "کیمیا کنار جوی پارک", en: "Kimia beside the park stream" }, caption: { fa: "قرارِ بی‌برنامه‌ی پارک", en: "An unplanned park date" } },
  { id: "cafe-selfie", src: "/images/PXL_20260831_062601119.jpg", alt: { fa: "سلفی کیمیا و امیر در یک کافه", en: "A café selfie of Kimia and Amir" }, caption: { fa: "قهوه بعد از یک روز طولانی", en: "Coffee after a long day" } },
  { id: "mirror-two", src: "/images/IMG_20260724_000715_651.jpg", alt: { fa: "کیمیا و امیر در آینه‌ی چوبی", en: "Kimia and Amir in a wooden mirror" }, caption: { fa: "همان آینه‌ی عجیب", en: "That strange mirror" } },
  { id: "evening", src: "/images/IMG_20260826_215402_611.jpg", alt: { fa: "یک لحظه‌ی عصرانه از مجموعه‌ی شخصی", en: "An evening moment from the personal collection" }, caption: { fa: "عصری که زود گذشت", en: "The evening that went too fast" } },
];

export function getEvent(id: string) {
  return events.find((event) => event.id === id) ?? events[0];
}
