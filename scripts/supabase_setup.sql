-- 1) Places lentelė
create table if not exists places (
  id bigint generated always as identity primary key,
  name text not null,
  stage text,
  image_url text,
  description text,
  created_by uuid,
  created_at timestamptz default now()
);

-- 2) Votes lentelė balsavimui
create table if not exists votes (
  id bigint generated always as identity primary key,
  place_id bigint references places(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz default now(),
  unique(place_id, user_id)
);

-- 3) RLS aktyvavimas
alter table places enable row level security;
alter table votes enable row level security;

-- 4) Saugos taisyklės (Policies)
create policy "read places" on places for select to anon, authenticated using (true);
create policy "insert places" on places for insert to authenticated with check (true);
create policy "update places" on places for update to authenticated using (true);

create policy "read votes" on votes for select to anon, authenticated using (true);
create policy "insert votes" on votes for insert to authenticated with check (auth.uid() = user_id);
create policy "delete own votes" on votes for delete to authenticated using (auth.uid() = user_id);
