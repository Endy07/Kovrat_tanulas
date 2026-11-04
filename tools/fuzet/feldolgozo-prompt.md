# Feldolgozó prompt: füzet- és táblafotóból lecke

Ezt a promptot a figyelő (`tools/fuzet/figyelo/figyelo.js`) adja a `claude -p`-nek, a végén a mostani feladat adataival
(JSON-blokk: a képek helye, a tantárgy, ha Kovrat megadta, a munkamappa, az eredményfájl). Egyedül dolgozol, senki
nem válaszol a kérdéseidre: ahol döntés kell, a legóvatosabb, a füzethez leghűbb utat válaszd, és írd le az indokot.

A munkád egy önálló **lecke** a repóban, egy új ágon (a figyelő már létrehozta, rajta állsz). **Ne pusholj, ne nyiss
PR-t**: azt a figyelő csinálja, miután ellenőrizte a munkádat.

## 0. Először olvasd el

1. `CLAUDE.md` (a projekt, a döntések és az indokaik), `KOVETKEZO-SESSION.md` (hol tartunk).
2. `docs/LECKE-RECEPT.md`: hogyan készül egy lecke hibamentesen. **Ez a mérce.** Különösen: az A. szakasz (közös készlet),
   a 4. (magyar szöveg generálása: névelő, toldalék számok után), a 9. (eszköz-buktatók, gépi tesztelő).
3. `tools/fuzet/minta-lecke.src.html`: a füzetből készült lecke váza (`<!--@FUZETJS-->`: `F.olvasat`, `F.forras`).
4. A témához legközelebbi meglévő lecke forrása a `tools/lessons/` mappában (a kezdőlapon, `index.html`, keresd meg). Ha
   van már lecke a témáról, **ne másold le, és ne írd át**: a füzet-lecke a füzet feladataira épül, a régi leckére linkelhet.

## 1. Olvasd el a képeket

A képek a feladat `kepek` listájában vannak (`fajl`: helyi útvonal, `fajta`: füzet vagy tábla, `figyelmeztetes`: a
telefon szerint sötét vagy homályos lehet). Nézd meg mindet a Read eszközzel, sorban.

Írd le, mit olvastál ki, a feladat `atirat` fájljába (Markdown, a munkamappában, **nem a repóban**):

- képenként: mi van rajta (cím, dátum, feladatok, megoldások, rajzok szóban leírva), a füzet sorrendjében;
- **a bizonytalan részeket `[?]`-lel jelöld**, mellé, hogy mit láttál és mi lehet még (pl. `3/4 + 1/6 [?: a 6 lehet 8 is]`);
- külön sorban, ha a képen javítás, áthúzás, félbehagyott megoldás vagy hiba van (Kovrat elakadt): ezek a lecke
  legfontosabb pontjai, a helyes befejezéssel együtt kerüljenek bele (a CLAUDE.md 2. leckéje így készült);
- ha egy kép olvashatatlan vagy nem tananyag (pl. üres lap, fénykép valami másról), írd le, és hagyd ki.

Ha **egyik** képen sincs feldolgozható tananyag: ne írj leckét; az eredményfájlba `{"allapot": "nem-lecke", "uzenet": "<egy
rövid, kedves mondat Kovratnak, mi a baj, és mit csináljon (pl. fotózza újra világosban)>"}` kerüljön, és állj meg.

## 2. Ismerd fel a tantárgyat és a témát

- Ha Kovrat megadta a tantárgyat (`tantargy`), abból indulj, de ha a kép mást mutat, a kép dönt (írd le az indokot).
- A téma legyen szűk és pontos (pl. „Törtek összeadása, közös nevező”, nem „Matek”).
- **Ne menj előre.** A gyakorlás csak azt kérje, ami a füzetben van: ugyanazt a módszert, ugyanazt a jelölést, ugyanazt a
  nehézséget, legfeljebb nagyobb számokkal vagy több lépéssel. Amit a füzet nem tanít, az nem kerülhet feladatba (diára is
  csak „kitekintés” címkével, legfeljebb egy).
- **Az iskolai módszert tanítsd** (CLAUDE.md, „Döntések”): ha a füzet egy módszerrel számol, a lecke is azzal; a másik módszer
  legfeljebb ellenőrzés.

## 3. Készítsd el a leckét

**Név:** a feladat `leckeElotag`-ja + a téma rövid, ékezet nélküli, kötőjeles neve (pl. `fuzet-20261104-tortek-osszeadasa`).
Csak kisbetű, szám, kötőjel. Ha már van ilyen fájl, tegyél a végére `-2`-t.

**Fájlok:**

1. `tools/lessons/<név>.src.html`: a `tools/fuzet/minta-lecke.src.html`-ből indulj (a `__LECKE__` és `__CIM__` helyére a
   név és a cím), és cseréld ki a tartalmát a füzetére. A közös készletet (`kit.js`, `kit.css`, `fuzet-lecke.js`, `python.js`,
   `helyesiras.js`) **ne módosítsd**; ha valami hiányzik, a lecke saját `<script>`-jében oldd meg.
2. `node tools/lessons/build.js <név>` → `<név>.html` a gyökérben.
3. `index.html`: a lecke linkje az **„A füzetedből”** csoportba. Ha még nincs ilyen csoport, hozd létre a „Python a nulláról”
   csoport elé, ugyanabban a formában, mint a többi (`<div class="group"><h2>A füzetedből</h2><div class="list">…`). A legújabb
   lecke legyen felül. A `bits` mező rövid jel a témából, a leírás egy mondat + a részek száma (mint a többi leckénél).
4. Mást ne módosíts (a `CLAUDE.md`-t, a `README.md`-t, a `docs/`-ot, a `tools/fuzet/`-et se: azt Endi frissíti a beolvasztáskor).

**A lecke részei** (a recept 1. szakasza szerint, a minta sorrendjében):

1. **Hero:** cím, egy-két mondat, mit tanultak az órán; `F.forras` (tantárgy, téma, a képek száma, a hónap; **dátum napra
   pontosan és név nélkül**).
2. **„Ezt jól olvastam?”** (`F.olvasat`): minden `[?]` egy tétel: `hol` (pl. „2. feladat, első sor”), `olvasat` (amit
   kiolvastál, HTML-ben), és ha kell, `kerdes` (pl. „A második tört nevezője 6 vagy 8?”). Ha nincs bizonytalan rész, üres
   lista (a komponens kiírja, hogy mindent el tudtál olvasni). A lecke a valószínűbb olvasattal számoljon, és ahol ez a
   bizonytalan részen múlik, a magyarázat mondja ki („ha a füzetedben 8 áll, akkor …”).
3. **A füzeted** (`.fuzet-lap`): a füzet tartalma a füzet formájában és sorrendjében, ahogy kiolvastad; a bizonytalan rész
   `<span class='bizonytalan'>`-ban. A hibás vagy félbehagyott részt mutasd meg, és fejezd be helyesen, jelölve.
4. **Magyarázat (diák, `K.deck`):** részletes, interaktív, 6–12 dia. Egy dia egy gondolat, minden szabály mellett konkrét
   példa a füzetből. Az utolsó előtti dián a tipikus hibák (a füzetben látott hibával, ha volt), az utolsón a trükkök.
5. **Kidolgozott példák (`K.player`):** a füzet feladatai és hozzájuk hasonlók, lépésenként, felolvasható feliratokkal
   (recept 5–6.). Legalább annyi, ahány feladattípus a füzetben van.
6. **Gyakorlás (`K.practice`):** a füzet feladatainak mintájára, **3 szinten**, véletlen generálással, célzott
   hibaüzenetekkel, „Megoldás lépésenként”, és ahol van lejátszó, „▶ Nézd meg lejátszva”. **Próbadolgozat** (`examN`, 8–12).
7. **Puska.**

**Tantárgyanként a feladatok:**

- **Matek, informatika (számrendszer, logika, algoritmus, programkód…):** gépi ellenőrzés. A gép számolja ki a jó
  választ, a diák beírja (`kind: "input"`), a `check` értelmezze a többféle helyes alakot (tört egyszerűsítve, tizedesvessző
  és -pont, szóköz), és a tipikus hibára célzott üzenetet adjon. Python-kódnál a `tools/lessons/python.js` (`<!--@PYJS-->`) és
  a `py-check.js` a minta. Minden generált feladatot igazolj független számolással (recept: „független számolás”).
- **Magyar, történelem, irodalom, földrajz, angol és a többi:** választós (`kind: "choice"`, pontosan egy jó gomb, a rossz
  válaszok hihetők, de egyértelműen rosszak) és kitöltős feladatok (`kind: "input"`, a `check` `K.norm`-mal hasonlít, és
  ha több jó alak van, mindet elfogadja). Csak a füzetben lévő tényekből és fogalmakból; ha egy tényt a füzet nem tartalmaz,
  és nem vagy biztos benne, ne kérdezz rá. Évszámnál, névnél a füzet írásmódja a mérvadó (ha az hibás, a magyarázatban jelezd).
- **Helyesírás:** a `tools/lessons/helyesiras.js` (`<!--@HJS-->`) és a helyesírás-leckék a minta.

**Nyelv:** magyarul, ékezethelyesen, tegezve, rövid mondatokkal, egy 9.-esnek (recept 4.: névelő számok előtt `K.art`,
toldalék számok után: fogalmazd át).

## 4. Amit soha

- **Fotó nem kerül a repóba** (nyilvános!): se a kép, se kivágás, se base64. A rajzokat SVG-vel vagy szöveggel írd le.
- **Személyes adat nincs a leckében:** se Kovrat neve, se a tanáré, osztálytársaké, az iskoláé, se osztály, se pontos dátum
  a füzetből, se aláírás, jegy, megjegyzés a füzetből. Csak tananyag. (A „Kovrat” szó a leckében sehol ne szerepeljen; a
  diák „te”.)
- Ne írj ki semmit, ami a beállításról szól (Apps Script-cím, családi kód, Drive-mappa).
- Ne módosíts más leckét, a közös készletet, a figyelőt, a hookot.
- Ne pusholj, ne nyiss PR-t, ne válts ágat.

## 5. Minőség: gépi teszt és lektor

1. `node --check` a lecke szkriptjére (recept 7. a), és `node tools/lessons/build.js <név>`.
2. **Gépi teszt:** indíts egy helyi szervert a repó gyökeréből (`python -m http.server 8765 --bind 127.0.0.1`, vagy
   `python3`, a háttérben), és futtasd:
   `KOVRAT_URL=http://127.0.0.1:8765/ node tools/lessons/lesson-test.js <név> 40`
   (Windowson, Git Bashben ugyanígy). Minden típus × szint át kell menjen, 390 px-en nincs vízszintes görgetés, JS-hiba
   nincs. A képeket (`.playwright-mcp/<név>-390.png`, `-dark.png`) nézd meg. A végén állítsd le a szervert (a PID-jével,
   a recept szerint: a `pkill` mintája a saját parancsodat is megölheti).
3. **Lektor-kör:** indíts egy friss szemű alügynököt (Task/Agent eszköz), add oda neki a lecke forrását és az átiratot
   (az átirat útvonalát), és kérd meg, hogy nézze át: szakmai és matematikai helyesség, a füzethez hűség (nem megy-e előre),
   magyar nyelv, két jó gomb a választós feladatokban, személyes adat. A talált pontokat javítsd, utána a gépi tesztet
   futtasd újra.
4. `git add` a három fájllal (`tools/lessons/<név>.src.html`, `<név>.html`, `index.html`), és commit, magyar üzenettel:
   `Füzet-lecke: <cím>` + egy üres sor + 2–4 sor arról, mi van benne. (A pre-commit hook átírja a verziót minden HTML-ben, és
   hozzáadja a commithoz: ez rendben van.) **Soha ne `git add .` / `git add -A`.**

## 6. Eredmény

A végén írd meg a feladat `eredmeny` fájlját (JSON, UTF-8), pontosan így:

```json
{
  "lecke": "fuzet-20261104-tortek-osszeadasa",
  "cim": "Törtek összeadása",
  "tantargy": "Matek",
  "tema": "Törtek összeadása, közös nevező",
  "bizonytalan": 1,
  "osszefoglalo": "- 8 dia: …\n- 3 levezetés: …\n- 4 feladattípus × 3 szint, próbadolgozat (10)",
  "teszt": "lesson-test 40: 480/480, 390 px rendben, JS-hiba nincs",
  "lektor": "7 pont, mind javítva: …"
}
```

A `bizonytalan` a „Ezt jól olvastam?” tételeinek száma. Az `osszefoglalo`, a `teszt` és a `lektor` a PR leírásába kerül
(nyilvános), ezért **ezekben sincs személyes adat és átiratrészlet**, csak az, hogy mi van a leckében.

Ha valami miatt nem tudtad befejezni (pl. a gépi teszt nem megy át, és nem tudod javítani), ne commitolj félkész leckét:
az eredményfájlba `{"allapot": "nem-lecke", "uzenet": "A lecke elkészítése elakadt, Endi megnézi."}` kerüljön, és a
munkamappába egy `elakadt.md`, amiben leírod, mi a gond.
