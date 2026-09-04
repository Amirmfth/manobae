"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { BottomSheet } from "@/components/ui/overlay";
import { navLabels } from "@/lib/locale";
import { identities } from "@/lib/mock-data";
import { useApp } from "@/providers/app-provider";
import { IdentityBackdrop } from "@/components/motion/identity-backdrop";
import { ManobaeMotion } from "@/components/motion/motion-system";
import { logout } from "@/app/actions/auth";

const navItems = [
  { key: "today", href: "/today", icon: "today" },
  { key: "us", href: "/us", icon: "us" },
  { key: "explore", href: "/explore", icon: "explore" },
  { key: "days", href: "/days", icon: "days" },
  { key: "dreams", href: "/dreams", icon: "dreams" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { identity, locale, setLocale, theme } = useApp();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const isBare = pathname === "/enter" || pathname === "/";
  const effectiveTheme = pathname.startsWith("/days/events/") ? "shared" : theme;
  const labels = navLabels[locale];
  const name = identity ? identities[identity].name[locale] : locale === "fa" ? "مشترک" : "Shared";

  return (
    <ManobaeMotion>
      <div className="app-root" data-theme={effectiveTheme} dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
        <IdentityBackdrop theme={effectiveTheme} />
        {!isBare && <DesktopNav pathname={pathname} labels={labels} onPreferences={() => setPreferencesOpen(true)} name={name} />}
        {!isBare && <button type="button" className="mobile-preferences" onClick={() => setPreferencesOpen(true)} aria-label={locale === "fa" ? "تنظیم زبان و هویت" : "Set language and identity"}><Icon name="user" /><span>{name}</span></button>}
        <main className={isBare ? "shell-main shell-main--bare" : "shell-main"}>{children}</main>
        {!isBare && <MobileNav pathname={pathname} labels={labels} />}
        <BottomSheet open={preferencesOpen} onClose={() => setPreferencesOpen(false)} title={locale === "fa" ? "تنظیم این نمونه" : "Prototype settings"} closeLabel={locale === "fa" ? "بستن" : "Close"}>
          <div className="preferences stack-lg">
          <fieldset className="stack-sm">
            <legend className="field-label">{locale === "fa" ? "زبان و جهت" : "Language & direction"}</legend>
            <div className="segmented" aria-label={locale === "fa" ? "انتخاب زبان" : "Choose language"}>
              <button type="button" aria-pressed={locale === "fa"} onClick={() => setLocale("fa")}>فارسی</button>
              <button type="button" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>English</button>
            </div>
          </fieldset>
          <p className="status-line"><span className="status-dot" />{locale === "fa" ? "هویت از کد ورود امن تو می‌آید؛ زبان فقط روی همین دستگاه تغییر می‌کند." : "Your identity comes from your secure entry code; language changes only on this device."}</p>
          <form action={logout}><button className="button button--secondary" type="submit">{locale === "fa" ? "بستن دفتر" : "Close the scrapbook"}</button></form>
          </div>
        </BottomSheet>
      </div>
    </ManobaeMotion>
  );
}

function DesktopNav({ pathname, labels, onPreferences, name }: { pathname: string; labels: Record<string, string>; onPreferences: () => void; name: string }) {
  return (
    <header className="desktop-nav">
      <div className="page-container desktop-nav__inner">
        <Link href="/today" className="brand" aria-label="manobae"><span className="brand__mark" aria-hidden="true">m</span><span>manobae</span></Link>
        <nav aria-label="Primary navigation"><ul className="desktop-nav__links">{navItems.map((item) => <li key={item.key}><Link href={item.href} className={isActive(pathname, item.key) ? "is-active" : ""}><Icon name={item.icon} /><span>{labels[item.key]}</span></Link></li>)}</ul></nav>
        <button type="button" className="identity-chip" onClick={onPreferences}><Icon name="user" /><span>{name}</span></button>
      </div>
    </header>
  );
}

function MobileNav({ pathname, labels }: { pathname: string; labels: Record<string, string> }) {
  return <nav className="mobile-nav" aria-label="Primary navigation"><ul>{navItems.map((item) => <li key={item.key}><Link href={item.href} aria-current={isActive(pathname, item.key) ? "page" : undefined} className={isActive(pathname, item.key) ? "is-active" : ""}><Icon name={item.icon} /><span>{labels[item.key]}</span></Link></li>)}</ul></nav>;
}

function isActive(pathname: string, key: string) {
  if (key === "today") return pathname === "/today";
  if (key === "days") return pathname.startsWith("/days");
  if (key === "us") return pathname.startsWith("/us");
  if (key === "explore") return pathname.startsWith("/explore");
  if (key === "dreams") return pathname.startsWith("/dreams");
  return false;
}
