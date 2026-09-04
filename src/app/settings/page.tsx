import { logout } from "@/app/actions/auth";
import { requireUser } from "@/lib/server/session";

export default async function SettingsPage() { const user = await requireUser(); return <div className="page-container settings-page stack-xl"><header className="stack-sm"><p className="eyebrow">این نسخه‌ی دفتر برای توست</p><h1 className="display-type">تنظیمات {user.nameFa}</h1></header><section className="settings-paper stack-md"><h2>نشست امن</h2><p>با هویت {user.nameFa} وارد شده‌ای. برای عوض کردن هویت، اول دفتر را ببند.</p><form action={logout}><button className="button button--secondary" type="submit">بستن دفتر</button></form></section></div>; }
