import type { SVGProps } from "react";

type IconName = "today" | "us" | "explore" | "days" | "dreams" | "watch" | "send" | "globe" | "user" | "back" | "edit" | "close" | "place" | "lock" | "check";

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const paths: Record<IconName, React.ReactNode> = {
    today: <><path d="M5 11.5 12 5l7 6.5V20H5v-8.5Z"/><path d="M9 20v-6h6v6"/></>,
    us: <><circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3.5 20c.4-4 2-6 4.5-6s4.1 2 4.5 6M11.5 20c.4-4 2-6 4.5-6s4.1 2 4.5 6"/></>,
    explore: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/></>,
    days: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h.01M12 14h.01M17 14h.01M7 18h.01M12 18h.01"/></>,
    dreams: <><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.6 7 7 0 0 0 20.5 14.5Z"/><path d="m16 5 .4 1.3L18 7l-1.6.7L16 9l-.4-1.3L14 7l1.6-.7L16 5Z"/></>,
    watch: <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="m10 10 5 2.5-5 2.5v-5ZM8 3h8"/></>,
    send: <><path d="m3 11 18-8-7 18-3-7-8-3Z"/><path d="m11 14 4-4"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c.7-5 3.4-8 8-8s7.3 3 8 8"/></>,
    back: <path d="m15 18-6-6 6-6"/>,
    edit: <><path d="m14 5 5 5L9 20H4v-5L14 5Z"/><path d="m12 7 5 5"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    place: <><path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  };

  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
