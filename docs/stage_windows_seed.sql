-- Stage windows schema + seed script
-- Naudojimas: nukopijuok į Supabase SQL editorių (arba psql) ir paleisk vieną kartą.
-- Reikalauja service-level teisių (schema kūrimas, RLS politikos).

begin;

create table if not exists public.stage_windows (
  id bigint generated always as identity primary key,
  stage text not null unique,
  window_label text,
  start_day int,
  end_day int,
  focus text,
  order_index int default 0,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stage_windows
  add column if not exists inserted_at timestamptz;
alter table public.stage_windows
  add column if not exists updated_at timestamptz;

alter table public.stage_windows
  alter column inserted_at set default now();
alter table public.stage_windows
  alter column updated_at set default now();

update public.stage_windows set inserted_at = now() where inserted_at is null;
update public.stage_windows set updated_at = now() where updated_at is null;

alter table public.stage_windows
  alter column inserted_at set not null;
alter table public.stage_windows
  alter column updated_at set not null;

drop trigger if exists stage_windows_updated_at on public.stage_windows;

create or replace function public.handle_stage_windows_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger stage_windows_updated_at
before update on public.stage_windows
for each row
execute function public.handle_stage_windows_updated_at();

create index if not exists stage_windows_order_idx on public.stage_windows(order_index nulls last);
create index if not exists stage_windows_window_idx on public.stage_windows(start_day, end_day);
create unique index if not exists stage_windows_stage_key on public.stage_windows(stage);

alter table public.stage_windows enable row level security;
drop policy if exists stage_windows_read on public.stage_windows;
create policy stage_windows_read on public.stage_windows
  for select
  to anon, authenticated
  using (true);
drop policy if exists stage_windows_insert on public.stage_windows;
create policy stage_windows_insert on public.stage_windows
  for insert
  to authenticated
  with check (true);
drop policy if exists stage_windows_update on public.stage_windows;
create policy stage_windows_update on public.stage_windows
  for update
  to authenticated
  using (true);
drop policy if exists stage_windows_delete on public.stage_windows;
create policy stage_windows_delete on public.stage_windows
  for delete
  to authenticated
  using (true);

-- Seediniai duomenys (upsert, kad būtų idempotentiška)
insert into public.stage_windows (stage, window_label, start_day, end_day, focus, order_index)
values
  ('1 ETAPAS', 'D1–D7', 1, 7, 'Phuket Old Town + Krabi/Railay moduliai', 1),
  ('2 ETAPAS', 'D8–D9', 8, 9, 'Khao Sok · Cheow Lan 2D/1N', 2),
  ('3 ETAPAS', 'D10–D12', 10, 12, 'Samui / Ang Thong / Koh Phangan', 3),
  ('4 ETAPAS', 'D13–D17', 13, 17, 'Chiang Rai · Golden Triangle', 4),
  ('5 ETAPAS', 'D18–D23', 18, 23, 'Bangkokas + Naujieji', 5)
on conflict (stage) do update set
  window_label = excluded.window_label,
  start_day = excluded.start_day,
  end_day = excluded.end_day,
  focus = excluded.focus,
  order_index = excluded.order_index,
  updated_at = now();

commit;
