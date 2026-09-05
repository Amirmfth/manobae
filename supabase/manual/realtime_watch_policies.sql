-- Run this once in Supabase Dashboard > SQL Editor.
-- The MCP migration role cannot own or alter realtime.messages on hosted projects.

alter table realtime.messages enable row level security;

drop policy if exists "manobae pair can receive watch realtime" on realtime.messages;
create policy "manobae pair can receive watch realtime"
on realtime.messages
for select
to authenticated
using (
  realtime.messages.extension in ('broadcast', 'presence')
  and (select realtime.topic()) = 'watch:' || coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'couple_id'), '')
  and (current_setting('request.jwt.claims', true)::jsonb ->> 'identity_key') in ('AMIR', 'KIMIA')
);

drop policy if exists "manobae pair can send watch realtime" on realtime.messages;
create policy "manobae pair can send watch realtime"
on realtime.messages
for insert
to authenticated
with check (
  realtime.messages.extension in ('broadcast', 'presence')
  and (select realtime.topic()) = 'watch:' || coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'couple_id'), '')
  and (current_setting('request.jwt.claims', true)::jsonb ->> 'identity_key') in ('AMIR', 'KIMIA')
);
