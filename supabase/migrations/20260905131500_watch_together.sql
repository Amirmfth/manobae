create table public."WatchSession" (
  id text primary key default 'main',
  "coupleId" text not null unique references public."Couple"(id) on delete cascade,
  "videoUrl" text,
  title text,
  playing boolean not null default false,
  "currentTime" double precision not null default 0,
  "playbackRate" double precision not null default 1,
  revision integer not null default 0,
  "updatedById" text references public."User"(id) on delete set null,
  "updatedAt" timestamptz not null default now(),
  constraint "WatchSession_currentTime_check" check ("currentTime" >= 0),
  constraint "WatchSession_playbackRate_check" check ("playbackRate" between 0.25 and 4)
);

create index "WatchSession_updatedById_idx" on public."WatchSession"("updatedById");

create table public."WatchMessage" (
  id text primary key,
  "sessionId" text not null references public."WatchSession"(id) on delete cascade,
  "userId" text not null references public."User"(id) on delete cascade,
  message varchar(1000) not null,
  "createdAt" timestamptz not null default now()
);

create index "WatchMessage_sessionId_createdAt_idx" on public."WatchMessage"("sessionId", "createdAt");
create index "WatchMessage_userId_idx" on public."WatchMessage"("userId");

alter table public."WatchSession" enable row level security;
alter table public."WatchMessage" enable row level security;
revoke all on table public."WatchSession" from anon, authenticated;
revoke all on table public."WatchMessage" from anon, authenticated;
