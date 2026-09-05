export type Locale = "fa" | "en";

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
};

export const navLabels = {
  fa: {
    today: "امروز",
    us: "ما",
    explore: "کشف کنیم",
    days: "روزهای ما",
    dreams: "رویاها",
    watch: "تماشا",
  },
  en: {
    today: "Today",
    us: "Us",
    explore: "Explore",
    days: "Our Days",
    dreams: "Dreams",
    watch: "Watch",
  },
} satisfies Record<Locale, Record<string, string>>;

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
}
