# Magyar helyesírás Kovratnak: terv

Endi kérése (2026. 10. 30., a pulton át): „Kovratnak helyesírást kellene tanítani. […] Teljesen az alapoktól. És
tollbamondás szöveget is írjon.” A tananyag **A magyar helyesírás szabályai, 12. kiadás (AkH 12, 2015)** szerint
készül; a szabályzat teljes szövege: https://helyesiras.mta.hu/helyesiras/default/akh12 (a pontszámokat a leckék
alján és itt is megadjuk).

Jelölés: ✅ biztos (forrással igazolva) · ⚠️ feltételezés (Kovrat vagy az iskola tudná megmondani).

## Mire építünk

- ✅ A szabályok forrása az AkH 12. Minden lecke alján ott a pontok listája.
- ⚠️ **Nem tudjuk, Kovrat mit ront el a leggyakrabban.** Endi kimenti a Facebook-csevegésüket a `C:\KOVRAT\chat\`
  mappába; ha megjön, hibastatisztika készül (`docs/helyesiras-hibak.md`, csak hibatípusok és általános példaszavak,
  **a csevegés szövege nem kerülhet a nyilvános repóba**), és a sorrendet, a súlypontot és a tollbamondásokat ehhez
  igazítjuk. 2026. 10. 30-án a mappa még üres volt.
- ⚠️ Nem tudjuk, mit vesznek magyarórán a 9.-ben. A technikumi kerettanterv 9.-ben a hangtant és a helyesírás
  alapelveit (kiejtés, szóelemzés, hagyomány, egyszerűsítés) szokta tartalmazni, de a tanár sorrendje ismeretlen.
- ✅ A leckék a meglévő készletre épülnek (`tools/lessons/`), és egy közös helyesírás-modulra
  (`tools/lessons/helyesiras.js` + `helyesiras.css`, a forrásban a `<!--@HJS-->` jelölő hozza be).

## A leckesor és a sorrend indoka

A sorrend elve: **alap → gyakori hiba → összetett szabály**. Az első három lecke azt adja, amire minden más épül
(betűk, hosszúság); a 4–6. a legtöbbet tévesztett szóalakok; a 7–9. a mondat szintje; a 10. a „szavak, amelyeket meg
kell tanulni” gyűjtése. A chatstatisztika után a 4–10. sorrendje változhat, a legtöbbet rontott típus előre jön.

| # | Lecke | AkH 12 | Miért itt | Állapot |
|---|---|---|---|---|
| 1 | **Betűk, ábécé, elválasztás** | 3–15., 223–238. | Alap: mi számít egy betűnek (cs, dzs), ábécérend, szótag. Az elválasztás a kézzel írt dolgozatban kell. | ✅ kész |
| 2 | **Magánhangzók hossza** (i/í, o/ó, ö/ő, u/ú, ü/ű) | 4–6., 20–24., 27., 31., 34–35. | A leggyakoribb hiba (ékezet), és jól tanítható: sok toldalék mindig hosszú vagy mindig rövid. | ✅ kész |
| 3 | **Mássalhangzók hossza** | 7., 9., 36–38., 46., 59., 87., 92–93. | Itt, akkor, lesz, kisebb: chatben is sokat tévesztett szavak; a hosszú többjegyű betű az 1. leckére épül. | ✅ kész |
| 4 | **j vagy ly** | 88. + szólista | Nincs szabály, meg kell tanulni: sok gyakorlás kell (szócsaládok: hely, folyik, király, -ly végű szavak, muszáj). | tervezett |
| 5 | **Kiejtés és szóelemzés: hasonulások** | 17–19., 48–60., 82–83. | -val/-vel, -vá/-vé (busszal, kővé), az ez/az + toldalék (abban, ezzel), zöngésség (népdal, nem nébdal), összeolvadás (barátság). | tervezett |
| 6 | **Igék: felszólító mód és tárgyas ragozás** | 42–43., 54–57., 80–81. | A legnehezebb igealakok: játsszon, eddz, lássa, tanítsa, fusson, hagyja, ért + jük = értjük. | tervezett |
| 7 | **Egybe- és különírás** | 99–138. (válogatva) | Igekötő (megcsinálom, de meg is csinálom), összetett szavak, jelentésváltozás, számok (kétezerig egybe). Chatben valószínűleg ez a sok hiba. ⚠️ | tervezett |
| 8 | **Nagy kezdőbetű és tulajdonnevek** | 139–205. (válogatva) | Mondatkezdés, nevek, földrajzi nevek, intézmények, címek; az -i képző kisbetűs (debreceni). | tervezett |
| 9 | **Központozás: a vessző** | 239–255. | Tagmondatok közé (és, de, mert, hogy, ami előtt), felsorolás, megszólítás, mint. Eddig a tollbamondás kimondja az írásjeleket; ettől a leckétől kikapcsolható. | tervezett |
| 10 | **Gyakori tévesztések** | vegyes | muszáj, egyelőre / egyenlőre, mindig, egészség, kíváncsi, eggyel, hülye, stb., pl., „-e” kérdőszó; a chatstatisztika ide gyűjti Kovrat saját szavait. | tervezett |
| + | **Tollbamondások** (`tollbamondasok.html`) | – | Minden lecke 3 szövege és vegyes, ismétlő szövegek; nyomtatható Endinek. | ✅ indul (3 × 3 + 3 vegyes) |

A 4–10. leckék szövegei a mostani formában készülnek: diák, levezetés-lejátszó, 4–5 gyakorlótípus × 3 szint,
tollbamondás (2–3 szöveg), puska. Minden új leckével bővül a vegyes, ismétlő tollbamondás.

## Ami az első három leckében van

- **Gyakorlótípusok** (a brief szerint): hiánypótlás (rövid/hosszú, egy/két betű), „Melyik a jó?” mondatban,
  hibakeresés a mondatban (a hibás szót helyesen kell beírni), elválasztás (beírva és választva), ábécérend, betűszám,
  szópárok, toldalékolás. Három szint: 1. megtanulandó szavak · 2. toldalék-szabályok · 3. kivételek, összetett esetek.
- **Tollbamondás:** a felolvasó (Web Speech API, Edge-ben a legjobb) mondatonként olvas, újra lehet hallgatni,
  darabonként is; az írásjeleket kimondja (kikapcsolható). A végén a lecke szavanként összeveti a szöveget, kiemeli az
  eltérést, és megmondja a hibatípust: kis/nagybetű, magánhangzó hossza, ékezet, mássalhangzó hossza, többjegyű betű,
  j/ly, egybe-/különírás, írásjel, kimaradt / fölösleges szó. A „▶ A javítás lejátszva” végigmegy a hibákon.
  Ha nem írta végig, csak a beírt mondatokat nézi. A legjobb eredményt a böngésző megjegyzi (localStorage).
- **Az összevető** a chatstatisztikához is jó lesz: ugyanazzal a hibatípus-felismerővel (`H.classify`) sorolhatók a
  saját hibái (Node-ban is fut).

## Döntések

| Döntés | Miért |
|---|---|
| A sorrend a brief javaslata, a **j/ly a 4.** | Az 1–3. egymásra épül (a hosszú többjegyű betű az 1. és a 3. leckében is kell); a j/ly önálló, a chatstatisztika után előrébb jöhet. |
| A tollbamondás **kimondja az írásjeleket** a 9. leckéig | A vesszőt még nem tanulta; enélkül minden szövegben vesszőhibák nyomnák el a lecke szabályát. |
| Az **elválasztást gép számolja** (`H.hyph`), csak egyszerű szavakra | Az AkH 226–227. szabálya algoritmus; több mint 60 AkH-példán igazolva (`helyesiras-check.js`). Összetett szót (vas-út) nem lát, ezért azok kézi listában vannak. |
| A tollbamondás-szövegek **egy helyen** (`H.TEXTS`) | A lecke, a gyűjtőoldal és a nyomtatható változat ugyanazt mutatja; egy javítás mindenhol érvényes. |
| **észszerű** (nem ésszerű) | A 12. kiadás (2015) óta így helyes (AkH 92.). A leckében jelezzük, hogy régi könyvekben még ésszerű áll. |
| Az ábécérendben a **rövid és a hosszú magánhangzó egyenrangú** | AkH 14. c); a gép az AkH saját példasoraival ellenőrizve. |

## Ellenőrzés

- `node tools/lessons/helyesiras-check.js` – elválasztás (AkH 226–227. példái), betűszám, ábécérend (AkH 14. táblái),
  hibatípusok, szövegösszevetés, a tollbamondás-mondatok formája.
- `node tools/lessons/lesson-test.js <név> 40` – minden típus × szint × 40 feladat, 390 px, sötét téma.
- A tollbamondás-felület próbája: szándékosan hibás begépelés → a hibák a jó típushoz kerülnek (a próba szkriptje a
  2026. 10. 30-i session munkamappájában volt; a lényege a recept 9. szakaszában).
- A magyar szövegeket (tollbamondások, mondatok, szólisták, diák) egy független lektor is átnézte az AkH 12 alapján.
