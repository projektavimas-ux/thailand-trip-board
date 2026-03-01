# Thailand Trip V2 (su vartotojais + balsavimu)

## 1) Supabase DB schema (SQL)

```sql
create table if not exists places (
  id bigint generated always as identity primary key,
  name text not null,
  stage text,
  image_url text,
  description text,
  created_by uuid,
  created_at timestamptz default now()
);

create table if not exists votes (
  id bigint generated always as identity primary key,
  place_id bigint references places(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz default now(),
  unique(place_id, user_id)
);
```

## 2) RLS (paprastas variantas)

```sql
alter table places enable row level security;
alter table votes enable row level security;

create policy "read places" on places for select to anon, authenticated using (true);
create policy "insert places" on places for insert to authenticated with check (true);

create policy "read votes" on votes for select to anon, authenticated using (true);
create policy "insert votes" on votes for insert to authenticated with check (auth.uid() = user_id);
create policy "delete own votes" on votes for delete to authenticated using (auth.uid() = user_id);
```

## 3) Auth
- Supabase Authentication → Email/Password ON.

## 4) Konfigūracija
Failas `supabase-config.js`:
- `window.SUPABASE_URL`
- `window.SUPABASE_ANON_KEY`

## 5) Deploy
Šitas katalogas gali būti hostinamas per GitHub Pages / Cloudflare Pages.
