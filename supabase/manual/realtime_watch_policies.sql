-- Run this once in Supabase Dashboard > SQL Editor.
-- Supabase already enables RLS on realtime.messages. Do not ALTER this managed table.

create policy "manobae pair can receive watch realtime"
on realtime.messages
for select
to authenticated
using (
  realtime.messages.extension in ('broadcast', 'presence')
  and (select realtime.topic()) = 'watch:' || coalesce((select auth.jwt() ->> 'couple_id'), '')
  and (select auth.jwt() ->> 'identity_key') in ('AMIR', 'KIMIA')
);

create policy "manobae pair can send watch realtime"
on realtime.messages
for insert
to authenticated
with check (
  realtime.messages.extension in ('broadcast', 'presence')
  and (select realtime.topic()) = 'watch:' || coalesce((select auth.jwt() ->> 'couple_id'), '')
  and (select auth.jwt() ->> 'identity_key') in ('AMIR', 'KIMIA')
);
