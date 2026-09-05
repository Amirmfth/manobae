create type public."IdentityKey" as enum ('AMIR', 'KIMIA');
create type public."EventType" as enum ('MOMENT', 'DATE', 'MILESTONE', 'TRIP');
create type public."Visibility" as enum ('SHARED', 'PRIVATE');
create type public."DreamStatus" as enum ('SOMEDAY', 'PLANNING', 'PLANNED', 'DONE');
create type public."PlaceStatus" as enum ('SAVED', 'PLANNED', 'VISITED', 'FAVORITE');

create table public."Couple" (
  id text primary key,
  slug text not null unique,
  title text not null,
  "togetherSince" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table public."User" (
  id text primary key,
  "coupleId" text not null references public."Couple"(id) on delete cascade,
  "identityKey" public."IdentityKey" not null unique,
  "nameFa" text not null,
  "nameEn" text not null,
  "passcodeHash" text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index "User_coupleId_idx" on public."User"("coupleId");

create table public."Session" (
  id text primary key,
  "userId" text not null references public."User"(id) on delete cascade,
  "tokenHash" text not null unique,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now()
);
create index "Session_userId_expiresAt_idx" on public."Session"("userId", "expiresAt");

create table public."LoginAttempt" (
  id text primary key,
  fingerprint text not null unique,
  count integer not null default 0,
  "windowStart" timestamptz not null default now(),
  "blockedUntil" timestamptz,
  "updatedAt" timestamptz not null default now()
);

create table public."Place" (
  id text primary key,
  "coupleId" text not null references public."Couple"(id) on delete cascade,
  "providerId" text,
  name text not null,
  address text,
  latitude decimal(9,6),
  longitude decimal(9,6),
  status public."PlaceStatus" not null default 'SAVED',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("coupleId", "providerId")
);

create table public."Event" (
  id text primary key,
  "coupleId" text not null references public."Couple"(id) on delete cascade,
  "createdById" text not null references public."User"(id),
  "placeId" text references public."Place"(id) on delete set null,
  title text not null,
  "happenedAt" timestamptz not null,
  "endedAt" timestamptz,
  type public."EventType" not null,
  summary text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index "Event_coupleId_happenedAt_idx" on public."Event"("coupleId", "happenedAt");
create index "Event_createdById_idx" on public."Event"("createdById");
create index "Event_placeId_idx" on public."Event"("placeId");

create table public."EventMemory" (
  id text primary key,
  "eventId" text not null references public."Event"(id) on delete cascade,
  "authorId" text not null references public."User"(id) on delete cascade,
  body text not null,
  visibility public."Visibility" not null default 'SHARED',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index "EventMemory_eventId_authorId_idx" on public."EventMemory"("eventId", "authorId");
create index "EventMemory_authorId_idx" on public."EventMemory"("authorId");

create table public."EventParticipant" (
  "eventId" text not null references public."Event"(id) on delete cascade,
  "userId" text not null references public."User"(id) on delete cascade,
  primary key ("eventId", "userId")
);
create index "EventParticipant_userId_idx" on public."EventParticipant"("userId");

create table public."Media" (
  id text primary key,
  "eventId" text not null references public."Event"(id) on delete cascade,
  "uploadedById" text not null references public."User"(id),
  "storagePath" text not null unique,
  "mimeType" text not null,
  width integer,
  height integer,
  "altFa" text,
  "altEn" text,
  "sortOrder" integer not null default 0,
  "createdAt" timestamptz not null default now()
);
create index "Media_eventId_sortOrder_idx" on public."Media"("eventId", "sortOrder");
create index "Media_uploadedById_idx" on public."Media"("uploadedById");

create table public."Question" (
  id text primary key,
  "coupleId" text not null references public."Couple"(id) on delete cascade,
  "promptFa" text not null,
  "promptEn" text not null,
  "availableOn" timestamptz not null,
  "createdAt" timestamptz not null default now()
);
create index "Question_coupleId_availableOn_idx" on public."Question"("coupleId", "availableOn");

create table public."Answer" (
  id text primary key,
  "questionId" text not null references public."Question"(id) on delete cascade,
  "authorId" text not null references public."User"(id) on delete cascade,
  body text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("questionId", "authorId")
);
create index "Answer_authorId_idx" on public."Answer"("authorId");

create table public."DailyCheckIn" (
  id text primary key,
  "authorId" text not null references public."User"(id) on delete cascade,
  day date not null,
  mood text not null,
  energy integer,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("authorId", day),
  check (energy is null or energy between 1 and 5)
);

create table public."Appreciation" (
  id text primary key,
  "coupleId" text not null references public."Couple"(id) on delete cascade,
  "authorId" text not null references public."User"(id) on delete cascade,
  body text not null,
  visibility public."Visibility" not null default 'SHARED',
  "createdAt" timestamptz not null default now()
);
create index "Appreciation_coupleId_createdAt_idx" on public."Appreciation"("coupleId", "createdAt");
create index "Appreciation_authorId_idx" on public."Appreciation"("authorId");

create table public."Dream" (
  id text primary key,
  "coupleId" text not null references public."Couple"(id) on delete cascade,
  "createdById" text not null references public."User"(id),
  "completionEventId" text references public."Event"(id) on delete set null,
  title text not null,
  notes text,
  status public."DreamStatus" not null default 'SOMEDAY',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index "Dream_coupleId_status_idx" on public."Dream"("coupleId", status);
create index "Dream_createdById_idx" on public."Dream"("createdById");
create index "Dream_completionEventId_idx" on public."Dream"("completionEventId");

create table public."Decision" (
  id text primary key,
  "coupleId" text not null references public."Couple"(id) on delete cascade,
  "createdById" text not null references public."User"(id),
  title text not null,
  "revealedAt" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index "Decision_coupleId_createdAt_idx" on public."Decision"("coupleId", "createdAt");
create index "Decision_createdById_idx" on public."Decision"("createdById");

create table public."DecisionOption" (
  id text primary key,
  "decisionId" text not null references public."Decision"(id) on delete cascade,
  label text not null,
  "sortOrder" integer not null default 0
);
create index "DecisionOption_decisionId_sortOrder_idx" on public."DecisionOption"("decisionId", "sortOrder");

create table public."Vote" (
  "optionId" text not null references public."DecisionOption"(id) on delete cascade,
  "voterId" text not null references public."User"(id) on delete cascade,
  rank integer,
  primary key ("optionId", "voterId"),
  check (rank is null or rank > 0)
);
create index "Vote_voterId_idx" on public."Vote"("voterId");

alter table public."Couple" enable row level security;
alter table public."User" enable row level security;
alter table public."Session" enable row level security;
alter table public."LoginAttempt" enable row level security;
alter table public."Place" enable row level security;
alter table public."Event" enable row level security;
alter table public."EventMemory" enable row level security;
alter table public."EventParticipant" enable row level security;
alter table public."Media" enable row level security;
alter table public."Question" enable row level security;
alter table public."Answer" enable row level security;
alter table public."DailyCheckIn" enable row level security;
alter table public."Appreciation" enable row level security;
alter table public."Dream" enable row level security;
alter table public."Decision" enable row level security;
alter table public."DecisionOption" enable row level security;
alter table public."Vote" enable row level security;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('memories', 'memories', false, 12582912, array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
