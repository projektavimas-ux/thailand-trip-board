## 2026-04-06 15:45 EEST
- `flights.json`: Duomenų rinkmena atnaujinta pagal Turkish Airlines išduotą bilietą (PNR: VNQSUK, 2026-04-04 21:57). Įkeltos bilieto sumos (viso EUR 6,142.22 už 3 suaugusius + 1 vaiką), mokėjimo detalės (Mastercard), ir skrydžių struktūra. Dabar `flights.html` rodys galutinę įvykdytą operaciją.
- `places_overrides.json` ir `hidden_spot_focus.json`: Atnaujinta Khao Sok (Cheow Lan Lake) kaina ir operatyvi logistika pagal šiandien išgrynintus vietinių agentūrų pasiūlymus (GuilinLake, Chieolan Line grupių pasiūlymai ~1.7k–3.2k ฿/asm., bei vietinių longtail nuomos tarifai). Ši informacija padės tiksliau suplanuoti biudžetą.

## 2026-04-06 09:20 EEST
- `places.html`: vietų valdymo puslapis naudoja bendrą `StatusIndicator` helperį (Duomenys badge + meta), todėl demo/offline būsenos rodomos taip pat kaip kitur. Pašalintas rankinis klasėmis paremtas kodas.

## 2026-04-05 09:25 EEST
- `routes-dashboard.html`: „Etapų langų“ statusas prijungtas prie `StatusIndicator`. Dabar tiek Supabase režimas, tiek fallback/error būsenos rodomos vienodai kaip kituose puslapiuose, o meta eilutė automatiškai rodo paskutinį atnaujinimą.

## 2026-04-04 18:05 EEST
- `flights.html`: prisijungimo badge/meta taip pat perkelti į `StatusIndicator` helperį, todėl skrydžių lenta turi tą pačią live/fallback/error semantiką (prisijunk → fallback, data/flights.json → live, klaidos → error). Pašalintas rankinis klasėmis paremtas kodas.

## 2026-04-04 09:35 EEST
- `index.html`: Duomenų statuso badge/meta perkelti į bendrą `scripts/status-indicator.js` helperį. Tai sulygina live/fallback/error semantiką su kitais puslapiais ir sumažina dubliuotą CSS klasėmis paremtą logiką.
- JS: sukurtas `dataIndicator` (StatusIndicator.create), o `markAwaitingAuth` / `markConfigMissing` / `markSupabaseError` dabar naudoja helperio API. Tai pirmas žingsnis į bendrą statuso komponento naudojimą per visą UI.

## 2026-04-03 09:40 EEST
- `places.html`: Hidden grandinė gavo naują perjungiklį „Tik Gruodis–Sausis“. Jis leidžia greitai filtruoti 10 prioritetinių spotų pagal mūsų kelionės žiemos langą, kad matytume tik aktualias vietas be kitų sezonų triukšmo.
- JS: išplėstas `renderHiddenShowcase()` filtras ir įdiegta `matchesWinterWindow()` pagalbinė funkcija, todėl naujasis filtravimo režimas veikia kartu su klasterių filtru ir meta žyma.

## 2026-04-02 18:15 EEST
- `places.html`: Hidden grandinės bloke atsirado naujas santraukos grid’as (4 kortelės su bendru spotų kiekiu, top klasteriu, Gruodis–Sausis langais ir vidutiniu score). Tai padeda greitai matyti prioritetų balansą prieš filtruojant korteles Supabase aplinkoje.
- JS: pridėta `renderHiddenFocusSummary()` ir pakoreguota `loadHiddenSpotFocus()` pipeline, kad santrauka būtų rodoma tiek sėkmingai užkrovus JSON, tiek „no data“ atveju. Layout’ai derinasi prie `hiddenClusterFilter` ir `hiddenMetaStamp` būsenų.

## 2026-04-01 11:50 EEST
- `signal_radar.json`: pridėtas naujas signalas **tomorrowland-pattaya-2026** apie 2026-12-11 → 12-13 vyksiantį Tomorrowland festivalį Wisdom Valley (Pattaya). Įrašiau rekomendacijas vengti Pattajos srauto D0–D3 arba laiku rezervuoti nakvynę/bilietus, nes nėra camping zonos.
- Šaltinis: sparkroam.com „Tomorrowland Thailand 2026 guide“ (publ. 2026-03-26, atnaujinta 6 d. prieš tikrinimą).
- `places_catalog.json`: papildymų šiandien nėra – TAT News / ThaiNationalParks / Experience Travel Group nepaskelbė naujos info mūsų kelionės langui.

## 2026-04-01 09:25 EET
- `index.html`: pridėtas naujas UI blokas **Hidden spot logistika** (panaudojamas `data/hidden_spot_focus.json`) – rodo klasterių statistiką, langus ir „quick logistics“ sąrašus kiekvienam iš 10 prioritetinių spotų.
- `hidden_spot_focus.json`: struktūra nepakeista, tik sujungta į pagrindinį valdymo skydą, kad nereikėtų atskiro failo naršymo.

## 2026-03-31 12:05 EET
- Naujienų šaltiniai (Chiang Rai Times, Travel And Tour World, thailand.go.th) pateikė tik jau dokumentuotą Thailand Travel Fair 2026 info, todėl naujų signalų ar vietų šiam langui neradau.
- `places_catalog.json` / `signal_radar.json`: šiam ciklui **no update**.

## 2026-03-31 08:55 EET
- `places_catalog.json`: pridėjau bloką **Hidden Spots (2026 prioriteto langas)** su kortelėmis Koh Phayam, Koh Mak, Koh Kood, Koh Jum, Koh Phra Thong ir Nan – kiekvienai įrašyti naujausi šaltiniai, logistikos patarimai ir map nuorodos.
- Šaltiniai: Thrive in Thailand (2026-01-29), Postcards by Hannah (2026-01-18 ir 2026-02-11), Noa Travels (2025-01-23), PSU Natural History Museum (2026-02-04), Travel + Leisure Asia (2026-03-05).
- `signal_radar.json`: pakeitimų šiandien dar nėra.

## 2026-03-23 12:20 EET
- `places_catalog.json`: 4 etape pridėjau „Nan Slow Coffee Ridge“ kortelę – remtasi Travel + Leisure Asia (2026-03-05) aprašytu Nan „slow travel“ keliu (Nan → Pua → Bo Kluea) su debesų linijos kavinėmis ir Bo Suak amatų kaimu.
- `signal_radar.json`: atnaujintas `generated_at` ir įtrauktas naujas logistinis signalas „cheow-lan-longtail-crunch-2026“ apie toliau besitęsiantį Khao Sok longtail trūkumą (ThaiNationalParks.com, 2026-03), su veiksmais rezervuoti valtis iki rugsėjo.
- Šaltiniai: https://www.travelandleisureasia.com/sea/destinations/southeast-asia/nan-province-thailand-slow-travel/ ir https://www.thainationalparks.com/khao-sok-national-park

## 2026-03-22 11:40 EET
- `places_catalog.json`: pridėjau „Koh Libong dugong patrol“ kortelę (2 etapas) – aprašiau DMCR 2026-02-18 dronų stebėjimą (32 dugongai, vienas su žvejybos lynu) ir rekomendacijas rezervuoti rangerių longtail.
- `signal_radar.json`: atnaujinau laiko žymą ir įtraukiau du naujus signalus – \*QSNCC Thailand Travel Fair 2026 (event, medium) ir \*Koh Libong dugong entanglement (alert, high) su veiksmais dėl apsilankymo planų.
- Šaltiniai: Travel & Tour World (2026-03-21) ir IndoThai News (2026-02-18).

## 2026-03-12 12:15 EET
- Patikrinau naujienų šaltinius (TAT News, Phuket/Chiang Rai savivaldybių pranešimai, ICONSIAM event feed) – naujų signalų ar kelionės ribojimų nėra.
- places_catalog.json / signal_radar.json papildymų šiandien nėra → **no update**.

## 2026-03-17 12:40 EET
- `places_catalog.json`: į 2 etapą įtraukiau naują kortelę „Koh Wai Paradise (Trat · hidden)“ – pažymėta kaip slaptas spot'as su sezono langu (lapkr.→bal.) ir generatoriaus grafiku.
- `places_overrides.json`: pridėjau detailų aprašą + kainų žymas (400–800 THB, elektra tik vakarais) ir nuorodas į žemėlapį.
- Šaltiniai: 12Go Asia „Koh Wai travel guide“ (2024-11) ir iamkohchang „Koh Wai travel guide“ (2025-11).

## 2026-03-21 12:45 EET
- `places_catalog.json` (3 etapas · Koh Lanta / Khao Sok): pridėta nauja kortelė „Cheow Lan „deep jungle“ planas“ su ShippedAway (2025-11-15) rekomendacijomis dėl sausros sezono grafiko ir limituotų rafthouse vietų.
- `signal_radar.json`: atnaujintas `generated_at` ir pridėti trys nauji signalai – Koh Yao Noi infrastruktūros upgrade (Koyaobay, 2025-07-26), Koh Phra Thong savanos džipų kvotos (Experience Travel Group, 2025-11-18) ir Nan „slow coffee“ maršrutas (Travel + Leisure Asia, 2026-03 / ResponsibleThailand, 2025-06-28).
- Kiti šaltiniai tikrinti (TAT News, Thai Immigration, Experience Travel Group blog) – papildomų kritinių įspėjimų šį rytą nėra.
## 2026-03-24 12:05 EET
- Patikrinti šaltiniai: TAT News (kelionių/infrastruktūros pranešimai), ThaiNationalParks (Khao Sok / Cheow Lan statusas), Experience Travel Group + ResponsibleThailand tinklaraščiai – naujų signalų apie mūsų maršrutus nėra.
- `places_catalog.json` / `signal_radar.json`: **no update** (laukiame naujų šaltinių, todėl failai palikti 2026-03-23 versijoje).

## 2026-03-25 12:55 EET
- Patikrinti nauji šaltiniai: TAT News (Thailand Tourism Festival 2026, 2026-03-25→29) ir ThaiNationalParks (Cheow Lan longtail availability). Abu atnaujinimai nesusiję su mūsų kelionės laikotarpiu (2026-12-11 → 2027-01-02), todėl naujų veiksmų nereikia.
- `places_catalog.json` / `signal_radar.json`: **no update** – paliekame 2026-03-23 versiją.

## 2026-03-26 12:10 EET
- `signal_radar.json`: pridėtas signalas **cheow-lan-boat-surcharge-2026** su ThaiNationalParks (Laguna Cheow Lan, 2026-03-26) paskelbtu +2 500 THB (mažos valtys) / +4 000 THB (8+ svečių) antkainiu visoms rezervacijoms nuo 2026-07-01. Summary + veiksmai nukreipia rezervuoti iki 06-30 arba padidinti biudžetą.
- `places_catalog.json`: „Cheow Lan „deep jungle“ planas“ kortelėje pridėta pastaba apie tą patį kuro priedą, kad planuojant 2026-12 modulį matytųsi reali kaina.
- Šaltiniai tikrinti ir be naujienų: TAT News (TTM+ 2026, Thailand Tourism Festival), Experience Travel Group blog (hidden islands) – nė vienas neturi konkrečių mūsų laikotarpiui aktualių pokyčių.

## 2026-03-27 12:10 EET
- Patikrinti nauji šaltiniai: TAT Newsroom ("Songkran festival 2026 to proceed nationwide" - renginys balandį, neaktualus 2026-12), TravelPulse (Healing Journey Thailand) ir kiti. 
- Apie pasirinktas Hidden Chain salas (Koh Mak, Koh Kood, Koh Libong) ar Khao Sok papildomų naujų ribojimų (po vakar dienos pranešimo apie antkainius) ar įspėjimų nepublikuota.
- `places_catalog.json` / `signal_radar.json`: **no update** – paliekame esamas versijas ir laukiame kitų aktualijų.

## 2026-04-01 17:45 EET
- Patikrinti šaltiniai: TAT Newsroom pranešimas „Songkran festival 2026 to proceed nationwide…“ (2026-03-26) ir Travel Economic Times apžvalga apie Songkran 2026 kampanijos tęstinumą; taip pat ThaiNationalParks "Cheow Lan Lake" / "Laguna Cheow Lan" puslapiai dėl naujų kvotų ar kainų pasikeitimų.
- Nei TAT, nei ThaiNationalParks paskyrose nėra pranešimų, susijusių su 2026-12-11 → 2027-01-02 kelionės lango apribojimais, naujomis kvotomis ar kainų korekcijomis (naujausia informacija kartoja jau fiksuotas aukšto sezono rekomendacijas ir 2026-07-01 longtail antkainius).
- `places_catalog.json` / `signal_radar.json`: **no update** – paliekame 2026-03-27 versiją ir laukiame konkretesnių šaltinių apie mūsų prioritetines salas / regionus.
- 2026-04-11 12:00: Data feed check (signal_radar/places_catalog): no update.
- 2026-04-11 18:00: Data feed check (signal_radar/places_catalog): no update.
- 2026-04-13 12:00: Data feed check: no update. Tomorrowland Pattaya ir ICONSIAM Countdown jau fiksuoti, papildomų Andamanų / paslėptų salų signalų 2026 m. gruodžiui nerasta.
- 2026-04-13 12:00: Data feed check: no update. Tomorrowland Pattaya ir ICONSIAM Countdown jau fiksuoti.
- 2026-04-13 18:00: Data feed check: no update.
- 2026-04-14 12:00: Data feed check: no update. Naujienų sraute ir toliau vyrauja Tomorrowland Pattaya 2026 (gruodžio 11-13) bei ICONSIAM Countdown naujametiniai renginiai. Slaptų salų srautui įtakos neturi.
- 2026-04-14 12:00: Data feed check: no update.
- 2026-04-14 18:00: Data feed check: no update.
- 2026-04-15 12:00: Data feed check: no update. Išskyrus nesenus Songkran atgarsius bei masinius Tomorrowland Pattaya festivalio (gruodžio mėn.) anonsus, jokios naujos informacijos mūsų pietinių/slepiamų salų ratui nerasta.
- 2026-04-15 12:00: Data feed check: no update. Išskyrus nesenus Songkran atgarsius bei masinius Tomorrowland Pattaya festivalio (gruodžio mėn.) anonsus, jokios naujos informacijos pietinių salų ratui nerasta.
- 2026-04-15 18:00: Data feed check: no update.
- 2026-04-16 12:00: Data feed check: no update. Žiniasklaidoje dominuoja Songkran pabaigos rezultatai ir artėjantys Tomorrowland (gruodis) renginiai. „Hidden chain“ atžvilgiu jokių naujų perspėjimų ar apribojimų nefiksuota.
- 2026-04-16 12:00: Data feed check: no update.
