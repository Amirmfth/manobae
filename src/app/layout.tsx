import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppShell } from "@/components/layout/app-shell";
import { AppProvider } from "@/providers/app-provider";
import "./globals.css";

const manrope = localFont({
  src: "./fonts/Manrope-Variable.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

const fraunces = localFont({
  src: "./fonts/Fraunces-Variable.ttf",
  variable: "--font-fraunces",
  weight: "100 900",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.ttf",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

const estedad = localFont({
  src: "./fonts/Estedad-Variable.ttf",
  variable: "--font-estedad",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Tahoma", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "manobae — جایی برای روزهای ما",
    template: "%s — manobae",
  },
  description: "A private, bilingual scrapbook for two people and the life they are making together.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${manrope.variable} ${fraunces.variable} ${vazirmatn.variable} ${estedad.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
