# Kovrat tanulás — munkadokumentum

Interaktív tanulási segédlet Kovratnak, a felhasználó (**Endi**) unokaöccsének. Kovrat 2026
szeptemberétől 9. évfolyamos a **Debreceni SZC Mechwart András Gépipari és Informatikai
Technikumban**, programozás (szoftverfejlesztő és -tesztelő) szakon, az informatika és távközlés
ágazatban. A 9–10. évfolyam ágazati alapoktatás, ami a 10. év végén **ágazati alapvizsgával** zárul.

- **Élő oldal:** https://endy07.github.io/Kovrat_tanulas/
- **Repó:** https://github.com/Endy07/Kovrat_tanulas (nyilvános, `main` ág, GitHub Pages a gyökérből)
- **Helyi mappa:** `C:\xampp\htdocs\Kovrat` → http://localhost/Kovrat/
- **claude.ai artifact (privát előnézet, csak az 1. leckéhez):** https://claude.ai/artifact/73Srdce3jbkXjNaefdA8Gk

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
