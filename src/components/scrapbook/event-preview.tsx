import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import type { EventFixture } from "@/lib/mock-data";
import type { Locale } from "@/lib/locale";
import { PhotoStack } from "@/components/scrapbook/photo-compositions";

export function EventPreview({ event, locale }: { event: EventFixture; locale: Locale }) {
  const photo = event.photos[0];
  return (
    <article className="event-preview">
      {photo && <PhotoStack photos={event.photos.slice(0, 2)} locale={locale} label={locale === "fa" ? "دو عکس از این خاطره؛ برای جلو آوردن انتخاب کنید" : "Two photographs from this memory; select to bring forward"} />}
      <div className="event-preview__copy stack-md">
        <p className="eyebrow">{locale === "fa" ? "در چنین روزی" : "On this day"}</p>
        <h2 className="section-title display-type">{event.title[locale]}</h2>
        <p className="text-muted">{event.description[locale]}</p>
        <Link className="button button--quiet event-preview__link" href={`/days/events/${event.id}`}>
          {locale === "fa" ? "ورق زدن این خاطره" : "Open this memory"}<Icon name="back" className="icon-forward" />
        </Link>
      </div>
    </article>
  );
}
