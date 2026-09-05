alter table "WatchSession"
  add column "subtitleContent" text,
  add column "subtitleType" text,
  add column "subtitleLabel" text,
  add column "subtitleLanguage" text,
  add column "subtitleFileName" text;

alter table "WatchSession"
  add constraint "WatchSession_subtitleType_check"
  check ("subtitleType" is null or "subtitleType" in ('vtt', 'srt'));
