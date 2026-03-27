-- 1) stage_windows lentelė
create table if not exists stage_windows (
  id bigint generated always as identity primary key,
  stage text not null unique,
  window_label text,
  start_day int,
  end_day int,
  focus text,
  order_index int default 0,
  created_at timestamptz default now()
);

create index if not exists stage_windows_order_idx on stage_windows(order_index);

alter table stage_windows enable row level security;

create policy "read stage_windows" on stage_windows for select to anon, authenticated using (true);
create policy "insert stage_windows" on stage_windows for insert to authenticated with check (true);
create policy "update stage_windows" on stage_windows for update to authenticated using (true);
create policy "delete stage_windows" on stage_windows for delete to authenticated using (true);
