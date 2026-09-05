"use client";

import { useActionState } from "react";
import type { EventActionState } from "@/app/actions/events";

type EventDefaults = { title?: string; happenedAt?: string; type?: string; summary?: string; memory?: string; placeName?: string };

export function EventForm({ action, defaults = {}, submitLabel = "ذخیره‌ی این روز" }: { action: (state: EventActionState, formData: FormData) => Promise<EventActionState>; defaults?: EventDefaults; submitLabel?: string }) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form className="keepsake-form stack-lg" action={formAction}>
      <div className="form-pair">
        <label><span className="field-label">اسم این روز / Day title</span><input className="text-field" name="title" defaultValue={defaults.title} maxLength={120} required /></label>
        <label><span className="field-label">تاریخ / Date</span><input className="text-field" type="date" name="happenedAt" defaultValue={defaults.happenedAt} required dir="ltr" /></label>
      </div>
      <fieldset className="event-kind"><legend className="field-label">چه جور روزی بود؟ / Kind of day</legend><div className="event-kind__options">
        {[['MOMENT','لحظه'],['DATE','قرار'],['MILESTONE','نقطه‌ی مهم'],['TRIP','سفر']].map(([value, label]) => <label key={value}><input type="radio" name="type" value={value} defaultChecked={(defaults.type ?? "DATE") === value} /><span>{label}</span></label>)}
      </div></fieldset>
      <label><span className="field-label">کجا بودیم؟ / Place</span><input className="text-field" name="placeName" defaultValue={defaults.placeName} maxLength={160} placeholder="مثلاً کافه‌ای در کریمخان" /></label>
      <label><span className="field-label">قصه‌ی مشترک این روز / Shared story</span><textarea className="text-area" name="summary" defaultValue={defaults.summary} maxLength={4000} /></label>
      <label><span className="field-label">چیزی که خودت یادت مانده / Your memory</span><textarea className="text-area" name="memory" defaultValue={defaults.memory} maxLength={6000} /></label>
      {!defaults.title && <label className="photo-drop"><span className="field-label">عکس‌ها / Photos</span><input type="file" name="photos" accept="image/*" multiple /><span>تا ۸ عکس؛ هرکدام حداکثر ۱۲ مگابایت</span></label>}
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button button--primary" type="submit" disabled={pending}>{pending ? "داریم لای دفتر می‌گذاریم…" : submitLabel}</button>
    </form>
  );
}
