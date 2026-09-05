create index if not exists "User_coupleId_idx" on public."User"("coupleId");
create index if not exists "Event_createdById_idx" on public."Event"("createdById");
create index if not exists "Event_placeId_idx" on public."Event"("placeId");
create index if not exists "EventMemory_authorId_idx" on public."EventMemory"("authorId");
