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

## 6) Etapų laiko juosta
- `data/stage_windows.json` laikomas kaip lokalus fallback, kurį `plan.html` užsikrauna dar prieš Supabase. Struktūra: `{ stage, window, start_day, end_day, focus }` (viskas skaičiuojama dienomis nuo D1).
- Supabase lentelė gali būti paprasta:
```sql
create table if not exists stage_windows (
  id bigint generated always as identity primary key,
  stage text not null,
  window_label text,
  start_day int not null,
  end_day int not null,
  focus text,
  order_index int default 0,
  inserted_at timestamptz default now()
);
```
- Jei Supabase tuščias, frontas automatiškai grįš prie `data/stage_windows.json` ir statuso eilutėje rodys „Duomenys: data/stage_windows.json“.
- Greitas importas iš JSON → CSV: `jq -r '.items[] | [.stage,.window,.start_day,.end_day,.focus] | @csv' data/stage_windows.json > tmp/stage_windows.csv` ir `COPY stage_windows(stage,window_label,start_day,end_day,focus) FROM 'tmp/stage_windows.csv' WITH (FORMAT csv);`.

## Sync 2026-03-12
- Atnaujintas `data/places_catalog.json` (perkopijuotas iš `travel-thailand-site` naujausio failo, 74 įrašai vietoje 38).
- Užkelta nauja `data/signal_radar.json` versija (TAT, ICONSIAM, Mae Sai e-immigration ir kt.).
- Toliau reikia sulyginti `index.html` ir kitus UI failus su `travel-thailand-site`, kad abi repo turėtų tas pačias sekcijas.
