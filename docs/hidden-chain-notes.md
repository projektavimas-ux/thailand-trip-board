# Hidden Chain · QA / Maintenance Notes (2026-03-24)

## Kas tai?
- Nauja `places.html` sekcija, rodanti 10 prioritetinių „hidden spots“ (Koh Phayam → Khao Sok) ir leidžianti greitai matyti sezono langus, kainų žymas bei rezervacijų nuorodas.
- Kortelės maitinamos `data/places_overrides.json` ir papildomu `hiddenSpotFocus` masyvu `places.html` faile.
- Blokas veikia tiek su Supabase (`places` lentelė), tiek su `data/places_catalog.json` fallback (automatinis `Data source` badge perjungimas).

## Duomenų grandinė
1. **`hiddenSpotFocus` masyvas** (`places.html`): čia laikomas prioritetų sąrašas (slug, label, sezonas, quick facts).
2. **`data/places_overrides.json`**: užpildo detales – aprašą, kainas, rezervacijų URL, žemėlapį.
3. **`placeOverrides` loaderis**: kai override’as rastas, kortelė gauna išplėstą turinį + custom slug.
4. **`setDataSourceBadge`**: rodo ar naudojami gyvi Supabase duomenys (`live`), JSON (`fallback`) ar įvyko klaida (`error`).

## Kaip pridėti naują hidden vietą
1. `places_overrides.json` pridėti įrašą su `hidden: true` + visais laukais (desc, duration, pricing, booking, maps, essentials).
2. `hiddenSpotFocus` masyve įtraukti objektą su `slug` (sutampa su override raktu), `label`, `cluster`, `window`, `score`, `quick`.
3. Jei reikia, papildyti `Grandinės seka` sąrašą `places.html` HTML bloke.
4. Paleisti `npm run lint` (jei vėliau pridėsime), o dabar – rankiniu būdu atsidaryti `places.html` per `live-server` ir patikrinti.

## QA kontrolinis sąrašas
- [ ] Supabase aktyvus → `Data source` badge rodo "Supabase" ir `hiddenBox` klasė nebėra `hidden`.
- [ ] Supabase išjungtas → fallback badge (geltonas) + kortelės kraunasi iš `data/places_catalog.json`.
- [ ] Kiekvienos kortelės „Quick facts“ atitinka `quick` masyvo duomenis.
- [ ] `booking` nuorodos atsidaro naujame tabe.
- [ ] Nėra dublikatų/tuščių kortelių (jei `places_overrides` neturi įrašo – kortelė slepiama).
- [ ] Screenshot’ai: `docs/hidden-chain-qa/2026-03-24/hidden-live.png` ir `hidden-fallback.png` (pakrovimo būsenoms užfiksuoti).

## Pending / to-do
- Automatizuoti `hiddenSpotFocus` masyvo generavimą iš atskiro JSON (kad nereikėtų redaguoti `places.html`).
- Papildyti `docs/hidden-chain-qa/` realiais screenshot’ais (šiuo metu pažymėta kaip TODO).
- Įdėti mažą CTA mygtuką („Atidaryti visas korteles JSON“), kad komanda galėtų eksportuoti `hidden` duomenis į Supabase per UI.

## 2026-03-25 10:45 EET – JSON grandinė
- `hiddenSpotFocus` masyvas perkeltas į `data/hidden_spot_focus.json` (vienintelis redaguotinas šaltinis su slug/cluster/window/quick faktais).
- `places.html` dabar krauna JSON per `loadHiddenSpotFocus()` ir renderina korteles net jei Supabase overrides dar nepasiruošę (fallback naudoja JSON laukus arba `places_overrides`).
- Įdėtas „kraunama“ state + aiškesni error pranešimai, jei JSON/override neatkeliauja.
- Sekantis žingsnis: generuoti šį JSON automatiškai iš Supabase ar atskiro CMS, bet jau nebėra rankinio HTML redagavimo.
- Pridėtas CTA blokas `Hidden JSON ↗ / Overrides JSON ↗`, kad komanda galėtų vienu paspaudimu parsisiųsti abiejų failų turinį QA/exportui.
