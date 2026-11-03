# Kovrat tanulás — munkadokumentum

Interaktív tanulási segédlet Kovratnak, a felhasználó (**Endi**) unokaöccsének. Kovrat 2026
szeptemberétől 9. évfolyamos a **Debreceni SZC Mechwart András Gépipari és Informatikai
Technikumban**, programozás (szoftverfejlesztő és -tesztelő) szakon, az informatika és távközlés
ágazatban. A 9–10. évfolyam ágazati alapoktatás, ami a 10. év végén **ágazati alapvizsgával** zárul.

- **Élő oldal:** https://endy07.github.io/Kovrat_tanulas/
- **Repó:** https://github.com/Endy07/Kovrat_tanulas (nyilvános, `main` ág, GitHub Pages a gyökérből)
- **Helyi mappa:** `C:\xampp\htdocs\Kovrat` → http://localhost/Kovrat/
- **claude.ai artifact (privát előnézet, csak az 1. leckéhez):** https://claude.ai/artifact/73Srdce3jbkXjNaefdA8Gk

**Belépési pont (hol tartunk, mivel folytatunk):** [`KOVETKEZO-SESSION.md`](KOVETKEZO-SESSION.md).

**Új leckénél először olvasd el:** [`docs/LECKE-RECEPT.md`](docs/LECKE-RECEPT.md). Abban van a
lépésenkénti menet és minden eddigi buktató a megoldásával együtt.

## Fájlok

| Fájl | Mi ez |
|---|---|
| `index.html` | Kezdőlap, a leckék listája. **Minden új leckét fel kell venni ide.** |
| `kettes-szamrendszer.html` | 1. lecke: kettes számrendszer (kész) |
| `szamrendszerek.html` | 2. lecke: hármas, ötös, hatos, hetes számrendszer, választható alapszámmal (kész) |
| `tanrend.html`, `docs/tanrend-9.md` | A 9. évfolyam éves tanrendje (hónapkártyák, melyikhez van már lecke). A `.md` a kutatás forrásokkal: ✅ biztos / ⚠️ feltételezés. |
| `8-visszatekintes.html` | Visszatekintés a 8. osztályra: hatványok, normálalak, törtek, százalék, arány, egyenletek, adatmennyiség (kész) |
| `tizenhatos-szamrendszer.html`, `logikai-muveletek.html`, `szoveg-es-kep.html`, `html-alapok.html`, `css-alapok.html`, `git-alapok.html` | A 2026. 10. 22-i leckék (kész). **A forrásuk a `tools/lessons/*.src.html`**, ne a kimenetet szerkeszd. |
| A 2026. 10. 23-i (éjszakai) leckék | 26 új lecke, a listájuk és a sorrend indoka: [`docs/leckek-terv.md`](docs/leckek-terv.md), a kezdőlapon csoportokban. Forrásuk szintén `tools/lessons/*.src.html`. |
| `tools/lessons/` | Közös leckekészlet: `kit.css`, `kit.js` (diák, lejátszó, gyakorló, HTML/CSS-szerkesztő, **elszigetelt JS-futtató** `K.jsrun`/`K.jseditor`, felolvasás), `update.js`, `build.js`. `node tools/lessons/build.js [név]` állítja elő a gyökérbeli önálló HTML-t. |
| `python-dolgozat.html` | A 9.-es Python-dolgozat leckéje (2026. 10. 25.), **böngészőben futó Pythonnal** (Pyodide). Forrás: `tools/lessons/python-dolgozat.src.html`. |
| `tools/lessons/py-check.js` | A Python-dolgozat ellenőrzője a helyi Pythonnal: `--write` (az 52 feladat példafutása a forrásba), `--verify N` (minden generált feladat mintamegoldása átmegy-e; a „Mit ír ki?” egyezik-e a valódi Pythonnal). |
| `python-1-kiiras.html`, `python-2-valtozok.html`, `python-3-input.html`, `python-4-muveletek.html`, `python-5-elagazas.html`, `python-6-while.html`, `python-7-for.html`, `python-8-listak.html`, `python-9-szovegek.html`, `python-10-fuggvenyek.html`, `python-11-modulok.html`, `python-12-kivetelek.html` | A **Python-sorozat a nulláról** (2026. 11. 01.): az 1–10. lecke, és a 10.-es tanterv folytatása (11. modulok, 12. kivételek; tervezett: 13. fájlok, ismétlő próbadolgozat). Terv: [`docs/python-terv.md`](docs/python-terv.md). Forrás: `tools/lessons/python-*.src.html`. |
| `tools/lessons/python.js`, `python.css` | A Python-sorozat közös modulja (a `<!--@PYJS-->` jelölő hozza be): Pyodide-futtató, futtató-szerkesztő, hibatippek, pontos kimenet-összevetés, a változók típusa/értéke, feladatfajták. Ellenőrző: `node tools/lessons/py-check.js --verify 40 <lecke>`. |
| `helyesiras-*.html`, `tollbamondasok.html` | Magyar helyesírás (2026. 10. 30.): 1. betűk, ábécé, elválasztás · 2. magánhangzók hossza · 3. mássalhangzók hossza · 4. j vagy ly · 5. hasonulások · 6. felszólító mód · 7. igekötők · 8. összetett szavak és számok · 9. kis- és nagybetű · 10. vessző · 11. gyakori tévesztések (2026. 11. 01.) · a 44 tollbamondás nyomtatható gyűjtőoldala. Forrás: `tools/lessons/*.src.html`. |
| `tools/lessons/helyesiras.js`, `helyesiras.css`, `helyesiras-check.js` | A helyesírás közös modulja (a `<!--@HJS-->` jelölő hozza be): betűk, elválasztás, ábécérend, hibatípusok, szövegösszevetés, **a tollbamondás-szövegek (`H.TEXTS`)**, a tollbamondás-felület. Ellenőrző: `node tools/lessons/helyesiras-check.js`. |
| `helyesiras-szintfelmero.html` | Helyesírási szintfelmérő (2026. 11. 01.): 22 kérdés (leckénként 2, véletlenül 54-ből), a végén ajánlott leckék, eredmény-előzmény (localStorage), összefoglaló Endinek, és **automatikus mentés Endi Google-űrlapjába** („Kovrat Szintfelmero”, a válaszok Endi táblázatában). |
| `docs/helyesiras-terv.md` | A helyesírás-leckesor terve (11 lecke, mind kész), sorrend és indok, ✅/⚠️. |
| `tools/lessons/lesson-test.js` | **Gépi, néma leckeellenőrző**: `node tools/lessons/lesson-test.js <név> 40` (minden típus × szint, 390 px, sötét téma, képernyőképek). Leírás: recept 9. szakasz vége. |
| `docs/leckek-terv.md`, `docs/tanrend-10.md` | A leckék sorrendje és indoka; a 10. évfolyam tanrend-vázlata (lecke nélkül). |
| `version.json` | Az aktuális verzió-időbélyeg. Az oldalak ebből tudják, hogy van-e újabb változat. **Kézzel ne írd**, a pre-commit hook állítja. |
| `tools/bump-version.sh` | Új időbélyeg a `version.json`-ba és minden oldal `kovrat-version` metájába |
| `.githooks/pre-commit` | HTML-t tartalmazó commitnál lefuttatja a bump-ot, és mindent hozzáad a commithoz |
| `szamrendszerek/` | Kovrat füzetének 5 fotója (`.jfif`). **Nincs commitolva** (`.gitignore`), mert a repó nyilvános. |
| `README.md` | GitHubos leírás + „Hol tartunk” szakasz |
| `docs/LECKE-RECEPT.md` | Runbook: hogyan készül egy lecke hibamentesen |
| `PROJEKT-KONTEXTUS.md`, `PROJEKT-RESZLETES.md` | A Könyvjelzők-elemző olvassa. **Nem** munkadokumentum, de a lényeges változásnál frissítjük. |
| `.playwright-mcp/` | A böngészős tesztek képernyőképei. Ideiglenes, nincs commitolva. |

## Mi készült eddig, és hogyan

### 1. lecke: kettes számrendszer (2026. 09. 27.)

Kapcsolótábla (8 lámpa), 9 dia, levezetés-lejátszó felolvasással (osztogatás, helyiértékek,
kettesből tízesbe), 5 feladattípus 3 szinten, puska.

### 2. lecke: hármas, ötös, hatos, hetes (2026. 10. 05–06.)

**A kiindulópont Kovrat füzete volt.** Endi 5 fotót tett a `szamrendszerek/` mappába. Ezekből
derült ki, hogy az iskola **nem osztogatással** tanítja az átváltást, hanem így:

1. a lap tetejére a hatványtáblázat (kitevők 6…0, alatta az alapszám hatványai és az értékük),
2. mellé: „ezek lehetnek: 0, 1, …” (a megengedett számjegyek),
3. a legnagyobb hatványtól lefelé: **hányszor fér bele** → az a jegy → kivonás → következő hatvány,
4. az eredmény bekeretezve, az alapszám bekarikázva,
5. a végén **Próba**.

A füzetben a 876-ot váltották át ötösbe (12001₅), hármasba (1012110₃) és hetesbe. A hetesnél
Kovrat elakadt („190 − 49 =”, mert a 49 háromszor fér bele, nem egyszer), a keretben javítás van;
helyesen **2361₇**. A hármasnál a „Próba =” sor üresen maradt.

Az oldal részei, fentről lefelé:

| Rész | Mi van benne |
|---|---|
| Számláló | Kilométerszámláló a választott alapszámban, +1 / −1 / magától számol. Az átvitelt teszi megfoghatóvá. |
| **Endi mondja** | Endi saját magyarázata, az ő gondolatmenetével: ahányas számrendszer, annyi számjegy → kettes (3 = 2 + 1 = 11₂) → a 3 hatványai szavakkal → 876 hármasban → ugyanígy a többi. |
| 0. rész · A füzeted | Kockás füzetlap, kézírás-betű (Caveat), kék toll. A füzet három feladata (+ hatos ráadásként) lépésenként, pontosan a füzet formájában. Befejezi a félbemaradt hetest és az üres próbát. |
| Endi mondja · 2. rész | A füzet feladatai kártyákon, nagyon részletesen: számjegyek, hatványok kiszámolása, hol kezdjük, „hányszor fér bele” felsorolva, **sáv-ábrák**, összetétel-ábra, próba. |
| 1. rész · 11 dia | Alapszám-választóval (3/5/6/7): számjegyek, számolás, hatványok, visszaváltás, iskolai módszer léptetve, hányszor fér bele, nullák, osztogatás, próba, hibák, trükkök. |
| 2. rész · Levezetések | Lejátszó felolvasással: táblázatos (iskolai), osztogatás, vissza tízesbe. |
| 3. rész · Gyakorlás | 7 típus (vissza tízesbe, táblázat lépésenként, tízesből, osztótábla, számlálás ±1, fejtörők, **próbadolgozat**), 3 szint (1–50, 51–300, 301–2000), vegyes alap is. |
| 4. rész · Puska | Hatványtáblázat mind a 4 alapra, számjegyek, 876 négyféleképpen, módszerek. |

### Automatikus frissítés (2026. 10. 06.)

Endi jelezte, hogy Ctrl+Shift+R-re sem frissült az oldal, és Kovrat mobilon néz. Minden oldal
megnyitáskor és a fülre visszatéréskor gyorsítótár nélkül lekéri a `version.json`-t, és ha
újabb, egyszer újratölt egy `?v=…` címen. (Akkor valójában GitHub-üzemzavar volt az oka, de a
10 perces Pages-gyorsítótár ettől függetlenül is gond lett volna.)

### A 9. évfolyam éves tanrendje és az új leckék (2026. 10. 22.)

Endi kérésére (a pulton át): éves tanrend, az első félév leckéi, 8. osztályos visszatekintés.

- **Tanrend** (`docs/tanrend-9.md`, `tanrend.html`): az országos programtanterv (Informatika és távközlés
  ágazati alapoktatás) szerint a 9.-ben **Informatikai és távközlési alapok I. 108 óra** és
  **Programozási alapok 72 óra**. A programozás a 9.-ben **játékos kódolás (Scratch és társai) → HTML → Git/GitHub →
  CSS → reszponzív → JavaScript-bevezető**; **a Python a 10. évfolyamon van** (4 + 48 + 20 óra), C# nincs a 9.-ben.
  A hónapokra bontás **becslés** (az iskola tanmenete nem nyilvános); a számrendszerek, logika, ASCII, Caesar egy másik
  iskola helyi listájából valók, Kovrat füzete támogatja. Az üzemeltető technikus programtantervét olvastuk (a
  szoftveresé nem jött le olvashatóan), az ágazati alapozás közös.
- **Új leckék** (mind: hero, diák, felolvasós levezetés-lejátszó, 5–7 feladattípus × 3 szint, próbadolgozat, puska):
  tizenhatos számrendszer, logikai műveletek, szöveg és kép kódolása, HTML alapok (élő szerkesztő), CSS alapok,
  Git és GitHub alapok, reszponzív weboldalak (a 2. félévi tanrendből), 8. osztályos visszatekintés.
- **Közös készlet** (`tools/lessons`): a leckék ugyanazt a CSS-t és JS-t használják, a forrás kicsi (`*.src.html`), a
  `build.js` önálló HTML-t állít elő belőle. A futás közben továbbra sincs függőség és build. A **tizenhatos
  leckénél** készült, a többi erre épül; a régi két lecke (kettes, szamrendszerek) érintetlen.
- **Kódolós feladatok**: a diák HTML/CSS-t ír egy élő szerkesztőbe (szkript nélküli, azonos eredetű `iframe`), az
  ellenőrzés a DOM-ot és a `getComputedStyle`-t nézi, tehát a böngésző tényleges megjelenéséből dönt.
- **Ellenőrzés**: minden gyakorlótípus × szint × 40–80 feladat szkripttel (a kiírt jó válasz átmegy, a kiinduló kód nem),
  lejátszók végigléptetve, 390 px-en nincs vízszintes görgetés (iframe-es mérés, minden feladat megoldással nyitva),
  sötét téma. Képernyőképek: `.playwright-mcp/` (nincs commitolva).
- **Nem készült el** (tervezett): JavaScript-bevezető, elektronika, hálózatok. Gyakorlati
  órák (PC-összeszerelés, nyomtató, Windows) szándékosan kimaradnak.
- **Hook-hiba**: az új klónban a `core.hooksPath` nem volt beállítva, ezért az első commitoknál nem futott a verzió-bump.
  Beállítva (`git config core.hooksPath .githooks`), külön commit javította. Új klónnál ne felejtsd el.

### Éjszakai leckék (2026. 10. 23., 03:45–07:00, a pult briefje alapján)

Endi a pultban: „Kovrat tanulás mehet tovább, reggel 7-ig, Opussal.” Később: „menjen minden, amit egy 8-os 9-es
gyereknek kell. Akár logikai feladatok, minden.” Kovrat válaszai nem jöttek meg, a döntések feltételezések
(`docs/tanrend-9.md`, „Döntések 2026-10-23 éjjel”).

- **26 új lecke**, mind a közös készlettel, gépi teszttel (minden típus × szint, 390 px, sötét téma), leckénként egy commit.
  A végén négy friss szemű **lektor** nézte át az 1–25. leckét (nyelv, szakmai és matematikai helyesség, két jó gombos
  feladatok), a javításuk egy commit (`d6e7a7a`); a nyitva hagyott apróságok: `docs/leckek-terv.md` vége.
  - *9.-es informatika:* hálózatok alapjai, elektronika alapjai, a számítógép felépítése, digitális áramkörök (kapuktól az
    összeadóig), hang és videó digitalizálása, fájlok/mappák és a Windows, virtualizáció és felhő, IT-biztonság alapjai, (10.-es előzetesként) Ethernet/kapcsoló/IPv6, Linux parancssor, mesterséges intelligencia.
  - *9.-es programozás:* algoritmusok és játékos programozás, programozási tételek (keresés, rendezés), JavaScript-bevezető,
    Python-előzetes (kódolvasás, futtató nélkül).
  - *Matek:* oszthatóság és statisztika, koordináták és függvények (8.-os), halmazok, algebrai kifejezések, egyenletek,
    geometria, valószínűség (9.-es).
  - *Egyéb:* logikai fejtörők, projektmunka (a 9.-es IKT projektmunka, 54 óra), táblázatkezelés (⚠️ nem biztos, hogy tanulja),
    informatikai angol.
- **Hogyan készült:** a leckék nagy részét párhuzamos alügynökök írták (forkok), egy-egy saját fájlba, commit nélkül; az
  összeillesztést (kezdőlap, tanrend, README, újraépítés a HEAD-beli készlettel, újratesztelés, commit) a fő session végezte.
  Ahol lehetett, a generált feladatokat **független számolás** is igazolta (pl. valódi Python a Python-leckénél, a Python
  `ipaddress` modulja az IPv6-nál, Node `path.posix` a Linux-útvonalaknál, nyers erő a fejtörőknél, leghosszabb út az ütemezésnél).
- **A közös készlet bővült:** elszigetelt JS-futtató (`iframe sandbox="allow-scripts"`, `postMessage`, ciklusszámláló,
  4 mp időkorlát) és aszinkron ellenőrzés a gyakorlóban; visszafelé kompatibilis, a régi leckéket újraépítve tesztelve.
- **A tesztelő néma:** a headless Chromium Windowson kimondta a felolvasást, és Endit éjjel zavarta. Azóta `--mute-audio`
  és kikapcsolt felolvasás.
- **Kezdőlap:** csoportok: Előkészítés · Első félév · Második félév · Matek, 9. évfolyam · Gondolkodás · Digitális kultúra.
- **Push:** reggel Endi jóváhagyta (a pulton át), élesben van (`928b1e6`).

### Python-dolgozat (2026. 10. 25., a pult briefje alapján)

Endi (a pulton át): „Pythonból írnak dolgozatot, itt van hozzá a gyakorló feladatsor. Ezt a feladatsort kérlek, hogy tedd be a
tanulás részbe, és még ehhez hasonló feladatokat csináljál, meg magyarázó, oktató részt is csinálj ehhez […] teljes tananyagot
kérek ehhez.” A forrás: `C:\KOVRAT\20261025\PYTHON DOLGOZAT GYAKORLÓ.docx` (**52 feladat**, nincs a repóban). Ebből derült ki,
hogy **a Mechwartban már a 9.-ben Python van** (a programtanterv a 10.-re teszi). A mellette lévő órai docx Word-formázás, nem Python.

- **Lecke:** `python-dolgozat` — futtató a hero-ban; 15 dia (a dolgozat témái + tipikus hibák + tanácsok, „▶ Kipróbálom” gombbal);
  4 levezetés; **az 52 eredeti feladat** fejezetenként, szó szerint (egy elírás javítva: „Íd ki” → „Írd ki”), mindegyiknél
  mintamegoldás, példafutás, magyarázat, „✎ Megoldom itt” szerkesztő és „Összevetés a mintával”; 7 gyakorlótípus × 3 szint
  (Mit ír ki?, 5 × „Írd meg”, Hibakereső), összesen 60 „Írd meg” sablon (néhány több változattal); feladatlap-generátor (témánként 2 feladat); puska.
- **Python-futtató: Pyodide 0.27.7** (jsDelivr), egy blob-URL-es **Web Workerben**, lustán (az első „Futtatás”/„Ellenőrzés”-kor).
  A Python-keret (`HARNESS`) az `input()`-ot a megadott bemenetekből szolgálja ki, a prompt + begépelt értéket külön jelöli
  (kékkel látszik), és az ellenőrzés **csak a print kimenetét** nézi. 6 mp időkorlát (a worker újraindul). Ha nem tölt be,
  a lecke használható marad (példafutások, Mit ír ki?, Hibakereső, mintamegoldások).
- **Gépi ellenőrzés („Írd meg”):** a diák programja **két különböző bemenettel** fut; a várt értékek (szám tűréssel, szöveg,
  egész sor) benne vannak-e a kimenetben (`cmpOut`), a kiírt mondat szabad. Utána: a feladat kért eszköze (`must`: `**`, `round`,
  `strip`…) és az **f-string** kötelező. Célzott üzenetek: kimaradt `int()` (összefűzött számok), kimaradt `f` (kapcsos zárójel a
  kimenetben), kerekítés, magyar hibatipp minden Python-hibához.
- **Ellenőrizve:** `py-check.js --verify 40` (4800 futás + 760 „Mit ír ki?” a helyi CPython 3.12-vel, mind jó); `lesson-test.js
  python-dolgozat 40` (840/840, a kiinduló kód sehol nem megy át, 390 px, sötét téma, JS-hiba nincs); célzott Playwright-próba:
  az 52 minta Pyodide-ban betűre ugyanazt adja, mint CPythonban; feladatlap 10/10; CDN nélkül is használható.
- **A közös készlet bővült:** `kit.js` egyedi feladatfajta (`task.mount(el) → { raw() }`), visszafelé kompatibilis (két régi
  lecke újraépítve, tesztelve); `lesson-test.js` megvárja a lassú aszinkron ellenőrzést (`data-busy`, legfeljebb 90 mp).

### Magyar helyesírás (2026. 10. 30., a pult briefje alapján)

Endi (a pulton át): „Kovratnak helyesírást kellene tanítani. […] Teljesen az alapoktól. És tollbamondás szöveget is írjon.”
A szabályok forrása **A magyar helyesírás szabályai, 12. kiadás (AkH 12, 2015)**, https://helyesiras.mta.hu; minden lecke
alján ott a pontok listája.

- **Terv** (`docs/helyesiras-terv.md`): 10 lecke, alap → gyakori hiba → összetett szabály. Kész az **1–3.**: betűk, ábécé,
  elválasztás · magánhangzók hossza · mássalhangzók hossza. Tervezett: j/ly, hasonulások, felszólító mód, egybe-/különírás,
  nagybetű, vessző, gyakori tévesztések.
- **Leckék:** hero (betűbontó + ábécérendező, ill. szópárok), 12–13 dia, lejátszó, 4–5 gyakorlótípus × 3 szint (hiánypótlás,
  „Melyik a jó?”, hibás szó a mondatban, elválasztás, ábécérend, betűszám, szópárok, toldalékolás), tollbamondás, puska.
- **Tollbamondás:** mondatonként felolvas (újra, darabonként; az írásjeleket kimondja, mert a vesszőt még nem tanulta),
  Kovrat begépeli, a végén szavanként összeveti, kiemeli az eltérést, és hibatípusonként csoportosít (hossz, ékezet, kettőzés,
  többjegyű betű, j/ly, egybe-/különírás, kis/nagybetű, írásjel, kimaradt/fölösleges szó), linkkel a leckére; „▶ A javítás
  lejátszva”. 12 szöveg (3 × 3 + 3 vegyes), a `tollbamondasok.html` nyomtathatóan is mutatja Endinek.
- **Ellenőrizve:** `helyesiras-check.js` (227 eset: az AkH saját elválasztási és ábécérendi példái, hibatípusok, összevetés,
  mondatforma); `lesson-test.js` mindhárom leckén 40-nel (1560/1560: 600 + 480 + 480, 390 px, sötét téma, JS-hiba nincs); a tollbamondás-felület
  szándékosan hibás begépeléssel; nyomtatási nézet sötét témájú gépen is. A magyar szövegeket egy friss szemű lektor is átnézte.
- **Kovrat saját hibái (később):** Endi a Facebook-csevegést a `C:\KOVRAT\chat\` mappába teszi (2026-10-30-án még üres).
  Ha megjön: hibastatisztika hibatípusonként a `docs/helyesiras-hibak.md`-be (a `H.classify` Node-ban is fut), a sorrend és
  a tollbamondások ehhez igazítva. **A csevegés és belőle szó szerinti mondat nem kerülhet a repóba** (nyilvános), és a
  `C:\KOVRAT\` mappán kívülre sem.
- **Élesben** 2026-10-30-án (Endi igenjével a pulton át: push `3cfe37a..62ac1c0`, élő version.json egyezik).

### Helyesírás 4. lecke: j vagy ly (2026. 11. 01., felhős próbafutás a pulttól)

Endi (a pulton át): „Akkor a javaslatod elfogadom, próbáljuk ki a Kovrat következő leckéjén.” Felhős (claude.ai/code) session,
a `claude/dreamy-hopper-52jouj` ágon. **Élesben** 2026-11-01 (PR #1, Endi olvasztotta be: `25ed352`, Pages `success`, élő `version.json` egyezik).

- **Lecke:** `helyesiras-j-ly` — szócsalád-böngésző a hero-ban, 14 dia, 4 lejátszott fogódzó, 5 gyakorlótípus × 3 szint (j vagy ly?,
  Melyik a jó?, Hibás szó, Szócsalád/toldalék, Kakukktojás), tollbamondás (j1–j3), puska; forrás: AkH 88., 55–57., 92–93. (az 55. elsőre tévesen 51. volt, javítva)
  (a 88. pont szövege szó szerint ellenőrizve, `docs/helyesiras-terv.md`).
- **Közös modul:** `CAT.jly` a leckére mutat; a j/ly-normalizáló az lj-t és a jj-t is kezeli (tanujj ~ tanulj); új szövegek: `jly`
  csoport (3) és `v4` (vegyes, 1–4. lecke).
- **A tesztelő felhőben is fut:** `KOVRAT_URL=http://127.0.0.1:8765/ node tools/lessons/lesson-test.js <név> 40` (helyi
  `python3 -m http.server 8765` mellett; Linuxon a képek a repó `.playwright-mcp/` mappájába mennek). Windowson változatlan.
- **A felhős push** elsőre 403 volt: a Claude GitHub Appnak írási jog kellett az Endy07 fiókon (Endi beállította, „All repositories”).

### Helyesírás 5. lecke: hasonulások (2026. 11. 01. délután)

Endi: „Ahogy javaslod, mehet minden.” Ugyanazon az ágon, a `main`-ről újraindítva; PR-ral, a beolvasztás Endié.

- **Lecke:** `helyesiras-hasonulasok` — kiejtés–írás kártyák a hero-ban, 12 dia, 4 lejátszott bontás (népdal, egészség, házzal,
  ebben), 5 gyakorlótípus × 3 szint (Hogyan írjuk?, Bontsd szét!, -val/-vé/ez/az, Melyik a jó?, Hibás szó), tollbamondás (h1–h3), puska;
  forrás: AkH 41., 48–60., 82–83., 90.
- **Közös modul:** új hibatípus, `hason` (Hasonulás, szóelemzés): hangosztályokkal veti össze a beírt és a helyes alakot
  (`hasonKey`); új szövegek: `hason` (3) és `v5` (vegyes, 1–5. lecke) — összesen 20.

### Helyesírás 6. lecke: felszólító mód (2026. 11. 01. este)

Endi: „Mehet, ahogy javaslod.” Ugyanarra az ágra, a még nyitott PR #2-be.

- **Lecke:** `helyesiras-felszolito` — igealak-táblázat a hero-ban (10 ige × 5 személy + rövid alak), 11 dia, 5 lejátszott szabály
  (olvasson, tanítson, lásson/fusson, válasszon, tanítjuk ↔ tanítsuk), 5 gyakorlótípus × 3 szint (Felszólító alak, Tárgyas: -juk vagy
  -suk?, Kijelentő vagy felszólító?, Melyik a jó?, Hibás szó), tollbamondás (f1–f3), puska; forrás: AkH 38., 42–44., 55–57., 76–81.
- **Közös modul:** új hibatípus, `felsz` (Felszólító mód, ige; `felszKey`); új szövegek: `felsz` (3) és `v6` — összesen 24.
- **Endi kérése:** „Legyen nem elváló igekötők is majd.” → a 7. lecke az igekötőké lett (`docs/helyesiras-terv.md`).

### Helyesírás 7. lecke: igekötők (2026. 11. 01. éjjel)

Endi: „Mehet, ahogy javaslod.” Ugyanarra az ágra, a még nyitott PR #2-be.

- **Lecke:** `helyesiras-igekotok` — „az igekötő vándorol” a hero-ban (7 mondat, a szabály betűjével), 10 dia, 4 lejátszott szabály,
  4 gyakorlótípus × 3 szint (Egybe vagy külön?, Hogyan írjuk?, Melyik mondat a jó?, Hibás rész), tollbamondás (i1–i3), puska;
  forrás: AkH 120. a)–e). Az összetett szavak és a számok egy későbbi leckébe kerültek (7/b).
- **Közös modul:** az egybe-/különírás hibatípus a leckére mutat; új típus: `kotojel` (megmegállt ~ meg-megállt); új szövegek: `igek`
  (3) és `v7` — összesen 28.

### Helyesírás 8. lecke: összetett szavak és számok (2026. 11. 01. éjjel)

Endi: „Szuper, így értettem, mehetünk tovább, ahogy javaslod.” (Az igekötős értelmezést megerősítette.) Ugyanabba a PR #2-be.

- **Lecke:** `helyesiras-osszetett` — számíró a hero-ban (1–99 999, évszám kapcsoló), 11 dia, 4 lejátszott szabály, 4 gyakorlótípus ×
  3 szint (Egybe, külön vagy kötőjel?, Melyik a jó?, Hibás rész, Számok betűvel — generált), tollbamondás (o1–o3), puska;
  forrás: AkH 94–95., 101–113., 116–119., 139., 291.
- **Közös modul:** a Kötőjel hibatípus általános lett (mellérendelés, tulajdonnév, betűszó, 6 szótag, számok); új szövegek: `ossz` (3)
  és `v8` — összesen 32. A terv számozása eltolódott: 9. nagybetű, 10. vessző, 11. gyakori tévesztések.

### Helyesírás 9. lecke: kis- és nagybetű (2026. 11. 01. hajnal)

Endi: „Folytasd, kérlek.” Ugyanabba a PR #2-be.

- **Lecke:** `helyesiras-nagybetu` — tippkártyák a hero-ban ([h/H]étfő), 11 dia, 4 lejátszott szabály, 4 gyakorlótípus × 3 szint
  (Kicsi vagy nagy?, Az -i képzős alak, Melyik a jó?, Hibás szó), tollbamondás (n1–n3), puska; forrás: AkH 144–145., 153., 163–166.,
  170–200. ⚠️ A pontszámokat kereszthivatkozásokkal azonosítottuk (két kivonat 10-zel eltért), lásd `docs/helyesiras-terv.md`.
- **Közös modul:** a `H.sentFix` már nem fogadja el a rossz kis-/nagybetűs alakot; a „Kis- vagy nagybetű” hibatípus a leckére mutat;
  új szövegek: `nagy` (3) és `v9` — összesen 36.
- **A megye:** 2026. október 1-jétől újra megye (nem vármegye); Endi szólt, a lecke ezt tanítja.

### Helyesírás 10. lecke: a vessző (2026. 11. 01. reggel)

Endi: „Minden mehet, ahogy javaslod.” Ugyanabba a PR #2-be.

- **Lecke:** `helyesiras-vesszo` — vesszőrakó a hero-ban (6 mondat, kattintható helyek, ellenőrzés), 11 dia, 4 lejátszott szabály,
  4 gyakorlótípus × 3 szint (Kell vessző?, Melyik mondat a jó?, Tedd ki a vesszőket!, Mondat végén), tollbamondás (k1–k3), puska;
  forrás: AkH 240–244., 248–252., 255–256., 261–262.
- **Közös modul:** a tollbamondás `punct: false` opcióval alapból nem mondja ki az írásjeleket (a vesszőleckében és a gyűjtőoldal
  vessző-csoportjában); az Írásjel hibatípus a leckére mutat; új szövegek: `vesszo` (3) és `v10` — összesen 40.

### Helyesírás 11. lecke: gyakori tévesztések (2026. 11. 01.) — a tervezett sor vége

Endi: „Mehet, ahogy javaslod.” Ugyanabba a PR #2-be.

- **Lecke:** `helyesiras-tevesztesek` — hibavadász a hero-ban (két chatüzenet, koppintható szavak), 12 dia (hibánként a lecke linkjével),
  4 lejátszott szabály, 4 gyakorlótípus × 3 szint (Melyik a jó?, Hibás szó, Melyik mondat a jó?, Rövidítés, -e), tollbamondás (g1–g3, írásjel-
  kimondás nélkül), puska; forrás: a 2–10. lecke pontjai, és 38., 248., 263., 278–284. (⚠️ az utóbbiak kivonatból).
- **Közös modul:** új hibatípus, `szopar` (egyelőre ↔ egyenlőre); új szövegek: `tev` (3) és `v11` — összesen 44.
- ⚠️ Kovrat chatje nem jött meg, ezért a hibák általánosak. Ha megjön, a hibastatisztika alapján igazítjuk.
- **Lektori kör (2026-11-01):** három független lektor az 5–11. leckén; a javítások listája `docs/helyesiras-terv.md` végén. A 9. lecke
  pontszámai az élő szövegen ellenőrizve helyesek.

### Python-sorozat a nulláról (2026. 11. 01. este, a pult briefje alapján)

Endi (a pulton át): „utána egy pythonos kellene, nem tudom az hogy áll, de teljesen az alapoktól kellene magyarázni, meg példák,
gyakorló feladatok, mindent.” Felhős session, a `claude/python-sorozat-alapok-wtcsgc` ágon; PR, a beolvasztás Endié.

- **Terv** (`docs/python-terv.md`): 10 lecke (print → változók → input → műveletek → if → while → for → listák → szövegek →
  függvények), leckénként cél, fogalmak, tipikus hibák, feladattípusok. A `python-elozetes` áttekintés marad, a `python-dolgozat`
  a dolgozat-ismétlő (az 1–4. és 9. lecke anyaga); egyikhez sem nyúltunk. Az 1. leckében még nincs f-string, a 2.-tól minden
  „Írd meg!” f-stringes (a dolgozat szabálya).
- **Közös modul** (`tools/lessons/python.js` + `python.css`, `<!--@PYJS-->`): a dolgozat-lecke futtatója továbbfejlesztve: a keret a
  program változóit is visszaadja (név, típus, érték), pontos kimenet-összevetés magyar eltérés-üzenettel (szóköz, kis/nagybetű,
  írásjel, hiányzó sor), „Mit ír ki?” többsoros válasszal, „Milyen hibát ad?” választós feladat, bővített hibatippek
  (hiányzó idézőjel/zárójel, okos idézőjel, `Print`, `print "…"`, behúzás, számmal kezdődő név, fordított értékadás).
- **Leckék:** `python-1-kiiras` (12 dia, 3 levezetés, 4 típus: Mit ír ki?, Írd meg!, Milyen hibát ad?, Javítsd ki!) és
  `python-2-valtozok` (12 dia, 3 levezetés, 6 típus: + Milyen típusú?, Lehet ez változónév?). A kezdőlapon új csoport: „Python a nulláról”.
- **Ellenőrizve:** `py-check.js --verify 40` (1.: 2517 futás, 2.: 3413 futás, valódi CPython 3.13, mind jó: a „Mit ír ki?” egyezik,
  a hibák tényleg azok, a minták átmennek, a hibás kiinduló kódok nem, a diák példái futnak); `lesson-test.js` 40-nel, **a
  böngészőben futó Pyodide-dal** (a felhős gép a jsDelivr-t nem éri el: `KOVRAT_PYODIDE` helyi npm-csomagból szolgálja ki).
- **Lektori kör (2026-11-01):** egy friss szemű lektor 27 pontot talált (névelő és toldalék szám vagy név után, pl. „2027-ben”,
  „5-ször”, „az Anna”; félrevezető hibatippek; a puszta `print` nem hiba; az IndentationError és a SyntaxError ne legyen egymás
  rossz válasza); mind javítva, a tesztek újrafuttatva.
- **A pult ellenőrzése után (Endi válaszai, 2026-11-01):** az iskolában **VS Code**-ban dolgoznak (a 3. leckétől külön dia és
  levezetés mutatja a terminált; az 1. lecke két mondata is erre utal); a `python-elozetes` új címe **„Python – gyors áttekintés”**;
  azt nem tudjuk, volt-e már `if`, ezért a sorozat semmit nem tételez fel. Ugyanabba a PR-be (#5): **3. Adatbekérés: input és a
  típusváltás** (`python-3-input`: 11 dia, 3 levezetés, köztük „A VS Code-ban”, 6 típus: Mit ír ki?, Melyik kell?, Milyen típusú
  lesz?, Írd meg! két bemenettel, Milyen hibát ad? bemenettel, Javítsd ki!).
  Lektor: 12 pont (egy szakmai: a Hibák-táblázat egyik kódjából hiányzott a `b`), mind javítva; a „Milyen hibát ad?” rossz válaszának
  tippje leckénként megadható (`P.hiba(t, pool, tip)`). PR #5 közben beolvadt, ezért az ág a `main`-nel összefésülve, új PR (#6, beolvasztva).
- **4. lecke: Műveletek és beépített függvények** (`python-4-muveletek`, a pult jóváhagyásával): 12 dia, 4 levezetés (17 // 5 és 17 % 5
  cukorkákkal, műveleti sorrend, perc → óra, a Python REPL a VS Code termináljában), 6 típus (Mit ír ki?, Melyik művelet?, int vagy
  float?, Írd meg!, Milyen hibát ad?, Javítsd ki!).
  Lektor: 12 pont (3 szakmai: `round(2.675, 2)` a valódi csapda, a `**` jobbról balra számolódik, a `max()`-nak legalább két érték kell),
  mind javítva, a tesztek újrafuttatva. Élesben (PR #7, `56ff92a`).
- **5. lecke: Feltételek** (`python-5-elagazas`): 13 dia, 4 levezetés (if és else, elif: jegy a pontszámból, mi tartozik az if alá,
  behúzás a VS Code-ban, szerkesztőrajzzal), 6 típus (Igaz vagy hamis?, Melyik ág fut?, Mit ír ki?, Írd meg!, Milyen hibát ad?,
  Javítsd ki!). A közös modul bővült: a próba `not` mezője (ami nem lehet a kimenetben), 3–5 próbabemenet, hibatipp a hiányzó
  kettőspontra és a behúzásra; a kódrajzokon nincs ligatúra (`>=` nem olvad `≥`-vé).
  Lektor: 9 pont (Python-hiba nincs; névelő, „próbálj ki minden ágat”, tinédzser 13-tól, a „nagyobb” feladat a kisebb számot
  sem engedi kiírni, az elif-levezetés kiemelése), mind javítva, a tesztek újrafuttatva. Élesben (PR #8, `ce8797a`).
- **6. lecke: while** (`python-6-while`): 12 dia, 4 levezetés (számolás nyomkövetéssel, összegzés 0-ig, végtelen ciklus, leállítás
  a VS Code-ban Ctrl+C-vel), 6 típus (Hányszor fut le?, Mennyi lesz a végén?, Mit ír ki?, Írd meg!, Milyen hibát ad?, Javítsd ki!).
  A közös keret: 20 000 karakter kimenet fölött leáll (kiíró végtelen ciklus), a `py-check` futásonként 0,5 mp-es időkorláttal
  (TimeoutError = „végtelen ciklus” válasz), toldalék-segédek számokhoz (`C.nal`, `C.tol`, `C.acc`).
  Lektor: 9 pont (Python-hiba nincs; névelő és „hármasával”, a csapda-kód valójában végtelen ciklus, a nyomkövetés-táblázat a
  levezetéshez igazítva, a „Végtelen ciklus” megoldásában nem a TimeoutError név áll), mind javítva, a tesztek újrafuttatva.
  Élesben (PR #9, `3d669cd`). A pult jelezte: a `py-check` SIGALRM-je Windowson nem létezik → `sys.settrace` + `time.monotonic` határidő.
- **7. lecke: for és range** (`python-7-for`): 11 dia, 4 levezetés (range(1, 6), for vagy while, ciklus a ciklusban, lépésenként a VS
  Code-ban: töréspont, F5, F10, Variables), 6 típus (Milyen számokat ad?, Hányszor fut le?, Mit ír ki?, Írd meg!, Milyen hibát ad?,
  Javítsd ki!). Lektor: 3 pont (Python-hiba nincs; a toldalék-segéd a 0-ra rossz alakot adott: „0-től” → „0-tól”, javítva a
  közös modulban; névelő; „(b − a)-szor”), mind javítva, a tesztek újrafuttatva. Élesben (PR #10, `326b86f`); a py-check Windowson is fut.
- **8. lecke: Listák** (`python-8-listak`): 13 dia, 4 levezetés (index, maximumkiválasztás, kiválogatás, a lista a VS Code Variables
  panelén), 6 típus (Mit ír ki?, Melyik elem?, Melyik tétel?, Írd meg!, Milyen hibát ad?, Javítsd ki!). A tételek elnevezése és a
  maximum kezdőértéke (az első elem) a `programozasi-tetelek` leckéhez igazodik. Közös modul: IndexError, AttributeError válasz,
  hibatipp a `lista = lista.append(x)`-re és a lista + számra.
  Lektor: 6 pont (kisebb szakmai: a `for x in lista: lista[x]` magyarázata, a maximum-levezetés i = 0 köre, a Variables panel
  `név: érték` jelölése, a 7. leckében is; nyelvi: „mely számok”, „hány napon”), mind javítva, a tesztek újrafuttatva.
  Élesben (PR #11, `e6184a5`).
- **9. lecke: Szövegek mélyebben** (`python-9-szovegek`): 12 dia, 4 levezetés (a szelet, szöveg építése ciklussal, split, a VS Code
  metódus-ajánlója), 6 típus (Mit ad a szelet?, Mit ír ki?, Melyik metódus?, Írd meg!, Milyen hibát ad?, Javítsd ki!). Közös modul:
  hibatipp a szöveg betűnkénti módosítására és a listán hívott szövegmetódusra. Lektor: 11 pont (szakmai: a split listát ad, nem
  szöveget; névelő, „szövegmetódus”; a nem tanult find kivéve, az isupper elmagyarázva; a strip-kérdés egyértelműsítve), mind javítva.
  Élesben (PR #12, `2bece5a`).
- **10. lecke: Saját függvények** (`python-10-fuggvenyek`), **a sorozat zárása**: 13 dia, 4 levezetés (mi történik híváskor, return vagy
  print, függvény a függvényben, F11 a VS Code-ban: Call Stack), 6 típus (Mit ír ki?, Mi lesz az értéke?, Melyik hívás a jó?, Írd meg!,
  Milyen hibát ad?, Javítsd ki!). A közös modul: a gép a diák függvényét maga hívja meg (`tests[k].calls`, `PYCORE.withCalls`), célzott
  üzenet a hiányzó függvényre és a None-t visszaadóra. A `lesson-test.js` a kódblokk-válasz végéről már nem vág le zárójeles részt.
  Lektor: 7 pont (szakmai: a return helye a ciklus után „a for-ral egy vonalban”, nem „behúzás nélkül”; a hibakereső visszatérése a
  hívó sorra két lépés; névelők, „negyzet” ékezet nélkül; „többször, különböző argumentumokkal”), mind javítva, a tesztek újrafuttatva.
  Élesben (PR #13, `26a2a3f`).
- **A 10.-es tanterv folytatása (Endi döntése, 2026-11-01):** modulok, kivételkezelés, fájlkezelés ugyanabban a felépítésben, utána
  ismétlő próbadolgozat az 1–10. leckéből (`docs/python-terv.md`, 11–14.).
- **11. lecke: Modulok: math és random** (`python-11-modulok`): 12 dia, 4 levezetés (import és a pont, floor/ceil/round/int számegyenesen,
  számkitaláló, a `random.py` fájlnév-csapda a VS Code-ban), 6 típus (Mit ír ki?, Milyen értéket adhat?, Melyik kell?, Írd meg!, Milyen
  hibát ad?, Javítsd ki!). A közös keret `opts` paramétert kapott: `rig` (a `random` előre megadott értékei a próbákhoz), `files` (saját
  munkamappa előre kiírt fájlokkal, a 13. leckéhez); a `judge`-ban új: `seq` (sorrend), `fout` (fájltartalom), a `calls` saját üzenete;
  a `py-check` `-X utf8`-cal fut. Lektor: 13 pont (szakmai: a `math.py` nem takarja el a math modult, mert beépített, ezért a csapda
  példája a `random.py` és a `turtle.py`; a pénzfeldobásnál a choice is jó lett volna; a névsorsolásnál a listát a diáknak kell beírnia),
  mind javítva, a tesztek újrafuttatva.
- **12. lecke: Kivételkezelés: try és except** (`python-12-kivetelek`, 2026-11-03, Endi kérésére külön PR-ban): 15 dia, 4 levezetés (try és
  except két bemenettel, else és finally, kérdezés amíg jó nem lesz, a kivétel a VS Code hibakeresőjében: Exception has occurred, BREAKPOINTS
  Uncaught / Raised Exceptions), 6 típus (Mit ír ki?, Hányszor kérdez?, Melyik except kell?, Írd meg! jó és rossz bemenettel, Milyen hibát ad?,
  Javítsd ki!). A közös modul: `tests[k].crash` (célzott üzenet leálláskor), `_kerr` a `calls`-ban (a `raise` ellenőrzése), EOFError válasz,
  hibatipp a hiányzó except-re és az elírt hibanévre. Lektor: 26 pont (szakmai: a 13. lecke `with`-je zárja a fájlt, nem a finally; a
  SyntaxError ↔ elírt név különbsége; a harmadik jelölő, User Uncaught Exceptions; a „7.0” matematikailag egész, kivéve; a 3,5 a diáknak szám,
  a feladat szól róla; csupasz except minden Javítsd ki!-ben tiltva), mind javítva, a tesztek újrafuttatva. A `.githooks/pre-commit` ebben a
  klónban nem volt futtatható (a verziót kézzel pótoltuk), a futtatási jog commitolva.

## Döntések és indokaik

| Döntés | Miért |
|---|---|
| **Interaktív weboldal** a nyomtatott füzet vagy doksi helyett | Endi választotta. Telefonon is megy, és azonnal ellenőrzi a feladatokat. |
| **Minden lecke egyetlen önálló HTML-fájl** (inline CSS/JS, nincs build, nincs keretrendszer) | Futnia kell localhoston (XAMPP), GitHub Pagesen és claude.ai artifactként is. Nincs függőség, ami elromolhat. |
| **Nyilvános repó + GitHub Pages** | Kovrat egy egyszerű linken, fiók nélkül eléri. Endi választotta. |
| **Az iskolai módszer az elsődleges**, az osztogatás csak második módszer és ellenőrzés | Ezt tanulják a füzet szerint. Ha mást tanítunk, összezavarjuk. **Új témánál is először a füzetből/órai anyagból derítsük ki, hogyan tanítják.** |
| **A füzet formája egy az egyben** (kockás lap, táblázat, „ezek lehetnek”, bekarikázott alap) | Kovrat így ismeri fel a saját órai munkáját, és a füzetébe is így kell írnia. |
| **Egy lecke a 3/5/6/7-es alapra**, alapszám-választóval, nem négy fájl | Ugyanaz a módszer, csak az alapszám más. Egy helyen javítható, és vegyes gyakorlás is lehet. |
| **„Endi mondja” részek** Endi saját szavaival | Endi így magyarázta Kovratnak, és kérte, hogy így kerüljön be. A te szövegedet ne írd át, csak a hibát javítsd finoman (pl. „jobbról balra” írjuk fel a hatványokat). |
| **A meglévő részeket nem módosítjuk, ha Endi új részt kér** | Endi kifejezetten kérte. Új rész = új szakasz, nem a régi átírása. |
| **A füzetfotók nincsenek commitolva** | Nyilvános repó, a képeken Kovrat keze és füzete. `.gitignore`-ban van. |
| **Nincs videó (hyperframes)** | Szóba került, de az interaktív oldal többet ér: Kovrat maga csinálja, és a lejátszó amúgy is olyan, mint egy felolvasott videó. |
| **Véletlen generált feladatok** fix feladatsor helyett | Végtelenül gyakorolható, a válaszok nem tanulhatók meg. |
| **Célzott hibaüzenetek** (fordított sorrend, kimaradt 0, csak a jegyeket adta össze, hatvány helyett szorzott) | Egy 9.-esnek a puszta „rossz” nem segít. |
| **Próbadolgozat** visszajelzés nélkül, a végén érdemjegy | Dolgozatra készít: ott sincs menet közbeni visszajelzés. |
| **Felolvasás a böngésző Web Speech API-jával** | Bármilyen számra működik, nincs mit hosztolni. Ára: a hang böngészőfüggő (Edge-ben a legjobb). |
| **Automatikus frissítés `version.json`-nal + pre-commit hook** | A Pages 10 percig gyorsítótáraz, a mobilos böngésző még tovább. A verziót gép állítja, hogy ne lehessen elfelejteni. |
| **localStorage** csak kényelmi adatra (legjobb sorozat, alapszám, felolvasás be/ki, legjobb dolgozat) | Nincs szerver. Try/catch-ben van, mert privát ablakban elszállhat. |
| **A 2. leckét nem tettük ki artifactként** | Kovrat a GitHub Pages linket használja, az előnézet nem kellett. Ha kell, a recept leírja. |

## Menet egy lecke elkészítéséhez (röviden, a részletek a receptben)

1. **Forrás:** kérd el (vagy nézd meg) a füzetet / órai anyagot. Az iskolai módszert tanítsd.
2. A lecke egyetlen HTML-fájl a gyökérben, a meglévő leckék tokenjeivel és komponenseivel, a
   `kovrat-version` metával és a fájl végi frissítés-szkripttel.
3. JS szintaxis-ellenőrzés `node --check`-kel, aztán böngészős teszt Playwrighttal (receptben).
4. Felvétel az `index.html`-be és a README táblázatába.
5. Commit (a hook beállítja a verziót) és push. A Pages 1–2 perc alatt frissül. Ellenőrizd élesben.
6. Frissítsd ezt a fájlt, a receptet (új buktató!) és a README „Hol tartunk” részét.

## Nyitott / következő

- **Az éves tanrend megvan** (`docs/tanrend-9.md`, `tanrend.html`), az országos programtanterv alapján. Ami bizonytalan,
  azt Kovrat tudja megmondani: mit használnak programozásórán (Scratch vagy már HTML?), tanultak-e logikát / tizenhatos
  számrendszert / ASCII-t, mi a tanár sorrendje, van-e tankönyv vagy Teams-jegyzet. A válaszok alapján igazítjuk a tanrendet.
- **A 9.-es tanrend minden programozás- és informatikai témája le van fedve** (a tantermi gyakorlatok kivételével).
  Következő lehetőségek: Python-leckék futtatóval a 10.-re (döntés kell: Pyodide CDN-ről kb. 10 MB, vagy saját részhalmaz-
  értelmező), IT-biztonság bővítése, SQL-alapok. Lásd `docs/tanrend-10.md` és `docs/leckek-terv.md`.
- **Élesben** (2026-10-23 reggel, Endi jóváhagyásával a pulton át): `dd3ee0d..928b1e6` push, a Pages-build `built`, az élő
  `version.json` egyezik, mind a 36 lecke elérhető. **Python-futtató a 10.-re: Pyodide** (CDN, lustán, csak a Python-leckéken);
  a 10.-es leckéket még nem építjük (`docs/tanrend-10.md`).
- Ha Endi újabb füzetoldalt vagy saját magyarázatot küld: „Endi mondja” stílusban, külön részként.
- **Helyesírás (2026-10-30):** az 1–3. lecke és 12 tollbamondás kész, **élesben** (2026-10-30, Endi igenjével a pulton át: `3cfe37a..62ac1c0`).
  A **4. lecke (j/ly)** élesben (2026-11-01, PR #1). Az **5–11. lecke** és a **szintfelmérő** **élesben** (2026-11-01, PR #2, Endi olvasztotta be: `e81870d`, Pages `success`; Endi képernyőképe a szintfelmérőről). **A tervezett helyesírás-leckesor teljes**, lektorálva.
  A szintfelmérő eredménye automatikusan Endi Google-űrlapjába megy (PR #3, `b014b7d`, élesben igazolva 2026-11-01). Következő: ha megjön a chat (`C:\KOVRAT\chat\`),
  a hibastatisztika (`docs/helyesiras-hibak.md`); a szintfelmérő eredményei (Endinek másolható összefoglaló) addig is mutatják Kovrat gyenge pontjait.
- **Python-sorozat (2026-11-01):** terv (`docs/python-terv.md`) és **mind a 10 lecke kész** (1–9. élesben, PR #5–#12; a 10. PR-ban).
  Folytatás, ha az iskola odaér: modulok, kivételkezelés, fájlok, ismétlő próbadolgozat (`docs/python-terv.md` vége). Belépési pont: `KOVETKEZO-SESSION.md`.
- **Python-dolgozat (2026-10-25):** kész, **élesben** (2026-10-26, Endi jóváhagyásával a pulton át: `aa702eb..755c902`, Pages `built`, élő `version.json` egyezik). Mivel az iskolában már a 9.-ben Python
  van, a következő Python-téma (elágazás, ciklus, lista) várhatóan hamarosan jön: a futtató és az ellenőrző kész, új lecke
  ugyanerre építhető (a `python-dolgozat.src.html` `LOGIC` blokkja és a `py-check.js` mintájára).

## Munkastílus Endivel

- Magyarul, ékezethelyesen. A teendőket `TEENDŐ MOST:` / `TEENDŐ:` / `HALASZTVA:` jelölővel,
  sor elején írjuk (globális CLAUDE.md).
- Endi gyakran nincs a gépnél, és azt kéri: „csináld, ahogy javaslod”. Ilyenkor önállóan
  dolgozunk, és **ha egy rész kész, azonnal push** (engedélyezte), hogy Kovrat egyből tanulhasson.
- Ha pontosan megmondja, mit kér, nem kérdezünk vissza. Valódi döntésnél rákérdezünk.
- Kifelé ható új lépés (új repó, nyilvánossá tétel) előtt jóváhagyást kérünk.
- Ha valami nem frissül élesben, előbb a https://www.githubstatus.com oldalt nézd meg, és
  mondd meg őszintén, hogy GitHub-oldali-e a hiba.
