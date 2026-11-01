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
| 4 | **j vagy ly** | 88., 55–57., 92–93. | Nincs szabály, meg kell tanulni: sok gyakorlás kell (szócsaládok: hely, folyik, király, -ly végű szavak, muszáj). | ✅ kész, élesben (2026. 11. 01.) |
| 5 | **Kiejtés és szóelemzés: hasonulások** | 41., 48–60., 82–83., 90. | -val/-vel, -vá/-vé (busszal, kővé), az ez/az + toldalék (abban, ezzel), zöngésség (népdal, nem nébdal), összeolvadás (barátság). | ✅ kész (2026. 11. 01.) |
| 6 | **Igék: felszólító mód és tárgyas ragozás** | 38., 42–44., 55–57., 76–81. | A legnehezebb igealakok: játsszon, eddz, lássa, tanítsa, fusson, hagyja, ért + jük = értjük. | ✅ kész (2026. 11. 01.) |
| 7 | **Igekötők: egybe vagy külön** (Endi kérése, 2026. 11. 01.) | 120. a)–e) | Mikor egybe (megcsinálom, elmegyek), mikor külön (csináld meg, nem csinálom meg, meg is csinálom, meg fogom csinálni), ismételt igekötő (meg-megáll), igekötő vagy határozószó (abbahagyta ↔ abba tette); a nem (nem tudom, nemsokára). Chatben valószínűleg sok a hiba. ⚠️ | ✅ kész (2026. 11. 01.) |
| 8 | **Összetett szavak és számok** | 94–95., 101–113., 116–119., 139., 291. | Jelző + főnév vagy összetétel (gyors írás ↔ gyorsírás), jelöletlen kapcsolat (kéményseprő), névutó (ház mellett ↔ délután), kötőjel (ide-oda, Petőfi-szobor, tv-műsor), anyagnév, számnév + képző, színnév, a 6 szótag szabály, számok (kétezerig egybe, fölötte kötőjel, évszám egybe). | ✅ kész (2026. 11. 01.) |
| 9 | **Kis- és nagy kezdőbetű, tulajdonnevek** | 144–145., 153., 163–166., 170–200. (⚠️ kivonatból) | Mondatkezdés, nevek, földrajzi nevek, intézmények, címek; az -i képző kisbetűs (debreceni). | ✅ kész (2026. 11. 01.) |
| 10 | **Központozás: a vessző** | 239–255. | Tagmondatok közé (és, de, mert, hogy, ami előtt), felsorolás, megszólítás, mint. Eddig a tollbamondás kimondja az írásjeleket; ettől a leckétől kikapcsolható. | tervezett |
| 11 | **Gyakori tévesztések** | vegyes | muszáj, egyelőre / egyenlőre, mindig, egészség, kíváncsi, eggyel, hülye, stb., pl., „-e” kérdőszó; a chatstatisztika ide gyűjti Kovrat saját szavait. | tervezett |
| + | **Tollbamondások** (`tollbamondasok.html`) | – | Minden lecke 3 szövege és vegyes, ismétlő szövegek; nyomtatható Endinek. | ✅ 9 × 3 + 9 vegyes = 36 |

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

## A 4. lecke (j vagy ly), 2026. 11. 01.

- ✅ A fogódzók az AkH 88. pontjából, szó szerint ellenőrizve (helyesiras.mta.hu): a) szó elején csak a lyuk és rokonai;
  b) egy szótagú szó végén ly csak néhányban (boly, foly(ik), hely, mély, moly, súly, süly, gally), a névmásokban ly (ilyen, olyan,
  milyen, amely); több szótagú szó végén legtöbbször ly (kivétel: lakáj, muszáj, papagáj), de az -aj, -ej végűek többsége j (kivétel:
  karvaly, pehely, tavaly, zsindely); c) -lya, -lye végű szavak (kivétel: bója, cserje, héja, perje).
- ✅ A toldalék j-je: AkH 55. (tanulja, állj, ítéljük, beszéljetek) és 56–57. (partja, látja, adja, hordja). Elsőre tévesen 51.
  állt itt és a lecke alján (a kivonatban egy szomszédos pont száma tapadt a táblázathoz); 2026. 11. 01-én a 48–60. pont
  teljes listájával javítva. Az 51. az n hasonulása (azonban).
- ✅ -val/-vel: osztállyal, hellyel (92.), gally + val = gallyal (93.). Elválasztás: süly-lyed, osz-tály-lyal (226. f, a gép számolja).
- Gyakorlótípusok: j vagy ly? (hiánypótlás, a pár mindig kézzel, egyik rossz alak sem létező szó) · Melyik a jó? · Hibás szó a
  mondatban · Szócsalád, toldalék · Kakukktojás (négy hiányos szóból egybe más betű kerül). Tollbamondás: j1–j3 és a vegyes v4.
- A `H.classify` j/ly-normalizálója bővült: az lj és a jj is egy alakra kerül (tanujj ~ tanulj, fojjon ~ folyjon, osztájjal ~ osztállyal).

## Az 5. lecke (hasonulások), 2026. 11. 01.

- ✅ A pontok a szabályzat 47–60. pontjának listájából (helyesiras.mta.hu): 48. szóelemző írás · 50. zöngésség (ablakban, népdal,
  vízszint, adhat) · 51. az n [m]/[ny] (azonban, szénpor, tanmenet, öngyújtó) · 52. teljes hasonulás (átcsap, község, egészség) ·
  53–57. a j hasonulása és összeolvadása (4. lecke) · 58. t/d/gy + s/sz összeolvadás (barátság, egyszer, költség, nagyság) ·
  59. rövidülés (3. lecke) · 60. kiesés (mindnyájan, csukd be, most sincs).
- ✅ -val, -vel, -vá, -vé: 41. (babával, kővé; dobbal, emberré, szénnel) és 82. ⚠️ A 82. pont címét („A -val, -vel és a -vá, -vé
  alakmódosulásai”) kivonatból olvastuk, a 41. pont szövege hivatkozik rá.
- ✅ az, ez: 83. (abba, ahhoz, akkor, avval v. azzal, akkora, efféle). A „de: ezt, azt, ezért” a szabályból következik (a tárgyrag
  és a magánhangzós toldalék nem okoz hasonulást) — ⚠️ a szabályzat ezt külön példával nem mondja ki.
- ✅ Hagyomány: 90. (tetszik, játszik, mindjárt, rögtön, utca).
- Gyakorlótípusok: Hogyan írjuk? (kiejtésből) · Bontsd szét! · -val, -vé, ez, az · Melyik a jó? · Hibás szó a mondatban.
  Tollbamondás: h1–h3 és a vegyes v5.
- Új hibatípus a tollbamondásban: **Hasonulás (szóelemzés)** (`H.classify` → `hason`), a többi típus után nézzük, így a régi
  besorolások nem változtak (minden régi ellenőrzés átment).

## A 6. lecke (felszólító mód), 2026. 11. 01.

- ✅ A pontok a szabályzat 36–46. és 76–82. pontjának listájából: 38. (-d, -dd: írd, nézd; edd, idd) · 42. (a felszólító mód jele:
  -j, -jj a jön-nél, a tő végi mássalhangzóval azonos hang; eszik… -gy; hisz: ggy) · 43. (tárgyas: mossuk, nézzük) · 44. (kettős alakok:
  dobj – dobjál, írd – írjad) · 76. (mássalhangzó vagy hosszú magánhangzó + t: ts — tanítson, fűts) · 77. (rövid magánhangzó + t, lát,
  bocsát: ss — kössétek, lássuk) · 78. (st, szt: a t nélküli tőből — fessen, válasszon) · 79–80. (s, sz, z, dz) · 81. (lesz, tesz, vesz,
  visz, eszik, iszik: gy).
- Gyakorlótípusok: Felszólító alak · Tárgyas: -juk vagy -suk? · Kijelentő vagy felszólító? (tanítjuk ↔ tanítsuk, mondatban) · Melyik a jó? ·
  Hibás szó. Tollbamondás: f1–f3 és a vegyes v6. Új hibatípus: **Felszólító mód (ige)** (futsatok ~ fussatok, választsunk ~ válasszunk).
- ⚠️ A „Kijelentő vagy felszólító?” típusban mindkét gomb létező szó: ez szándékos, a mondat dönt.

## A 7. lecke (igekötők), 2026. 11. 01.

- ✅ AkH 120. a) közvetlenül az ige (igenév) előtt egybe, és a belőle képzett főnév is (megtartás); az igekötők listája (abba, agyon,
  alá, át, be, bele … végig, vissza) · b) az ige után külön · c) ha szó van közte, külön (el ne késs, újjá is építjük, közre kell
  bocsátani, haza szabad menni) · d) ismételt igekötő kötőjellel, egybe az igével (meg-megállt, vissza-visszatérve) · e) a határozószói
  szerep kiemelésekor külön (abba tette ↔ abbahagyta, ide jött ↔ idejött, fenn maradt ↔ fennmarad, félre állt ↔ félreállt).
- ⚠️ A nem tudom, nemsokára, nemrég, nemcsak, nemhogy alakok a helyesírási szótárból valók; a pontszámukat nem kértük le.
- Gyakorlótípusok: Egybe vagy külön? · Hogyan írjuk? · Melyik mondat a jó? · Hibás rész a mondatban. Tollbamondás: i1–i3 és a vegyes v7.
- A tollbamondás egybe-/különírás típusai most a leckére mutatnak; új típus: **Kötőjel** (megmegállt ~ meg-megállt).
- „Nem elváló igekötők” (Endi): úgy értettük, hogy az igekötő írása legyen a téma; az egybeírt (nem elváló) és a külön írt esetek
  egyaránt benne vannak. ⚠️ Ha Endi mást értett rajta, igazítjuk.

## A 8. lecke (összetett szavak és számok), 2026. 11. 01.

- A tervben eredetileg 7/b volt; a folyamatos számozás miatt 8. lett, a nagybetű 9., a vessző 10., a gyakori tévesztések 11.
- ✅ Pontok a szabályzat 99–140. pontjának listájából: 94–95. (az összetétel, jelentésváltozás: gyors írás ↔ gyorsírás, jelző lámpa ↔
  jelzőlámpa, sok szög ↔ sokszög) · 101–103. (mellérendelés: süt-főz, ide-oda; ikerszók: irul-pirul ↔ csigabiga) · 105–106. (jelzős,
  raggal jelölt kapcsolat: külön) · 108. (névutó külön, de délután, hazafelé, földalatti) · 109–110. (jelöletlen: kéményseprő, napsugár,
  iskolaudvar) · 111. (jelentéstömörítés: bableves, motorcsónak, hófehér) · 112–113. (Petőfi-szobor, tv-műsor) · 116. (anyagnév: aranygyűrű,
  de bőr pénztárca) · 117. (kétéves, háromlábú) · 119. (színnév: sötétzöld) · 139. (hat szótag fölött, legalább 3 tag: kötőjel) ·
  291. (kétezer fölött a hármas csoportok közé kötőjel, kivéve az évszámot).
- A számíró és a „Számok betűvel” feladat ugyanazzal a függvénnyel ír (`num`), a szabályzat példáin ellenőrizve (2001, 47 563);
  a gombok egyediségét 9000 sorsolás igazolta. A százas helyén nincs 1 (ezeregyszáz ~ ezerszáz kettőssége miatt).
- ⚠️ A „kettő a szám végén, két a belsejében” a köznyelvi szokás; a szabályzat pontszámát nem kértük le.

## A 9. lecke (kis- és nagybetű), 2026. 11. 01.

- ⚠️ **A pontszámok:** a szabályzat oldalából két külön kivonat két, egymástól 10-zel eltérő számozást adott (például a személynevek
  143. vagy 153.). A kereszthivatkozások döntöttek: a 140. pont „Vö. 166.”-ja a Kossuth-nóta szabályára mutat, a Ferenc körút
  „Vö. 181.”-e a közterületekre. Ez alapján: 144. (ünnepek), 145. (népnevek), 153. (személynevek), 163. (állandó jelző), 164. (Zsófi néni),
  166. (Kossuth-szobor), 170. (állatnevek), 171. (tárgynevek), 172–183. (földrajzi nevek, közterületek), 184. (csillagok), 186–194.
  (intézmények, pályaudvarok, rendezvények, márkák), 196–200. (címek). A mondatkezdő nagybetű pontszámát nem találtuk meg.
  Egy friss, teljes lekérdezéssel érdemes újra ellenőrizni.
- A tartalom (melyik nagy, melyik kicsi) a kivonatok példáiból való, és mindkét kivonatban egyezett.
- A „megye” helyett „vármegye” van 2023 óta, ezért a megyés példa kimaradt; a „Lengyelország Kelet-Európában” vitatható, Ukrajna lett.
- Gyakorlótípusok: Kicsi vagy nagy? · Az -i képzős alak · Melyik a jó? · Hibás szó. Tollbamondás: n1–n3 és a vegyes v9.
- **Javítás a közös modulban:** a `H.sentFix` eddig elfogadta a rossz kis-/nagybetűs alakot, ha a jó szó kisbetűs volt (a „Hétfőn” átment
  a „hétfőn” helyett). Most csak a pontos alak jó; a kis-/nagybetű eltérésre célzott üzenet jön. Mind a 9 lecke újratesztelve.

## Ellenőrzés

- `node tools/lessons/helyesiras-check.js` – elválasztás (AkH 226–227. példái), betűszám, ábécérend (AkH 14. táblái),
  hibatípusok, szövegösszevetés, a tollbamondás-mondatok formája.
- `node tools/lessons/lesson-test.js <név> 40` – minden típus × szint × 40 feladat, 390 px, sötét téma.
- A tollbamondás-felület próbája: szándékosan hibás begépelés → a hibák a jó típushoz kerülnek (a próba szkriptje a
  2026. 10. 30-i session munkamappájában volt; a lényege a recept 9. szakaszában).
- A magyar szövegeket (tollbamondások, mondatok, szólisták, diák) egy független lektor is átnézte az AkH 12 alapján.
