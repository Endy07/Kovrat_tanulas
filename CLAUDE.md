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

- **Egész éves tanmenet: FÜGGŐBEN.** Endi megkérdezi Kovratot, milyen nyelvet tanulnak
  (Python? C#?) és milyen témák vannak. Az iskola tanmenete nincs fent az interneten.
  Az országos programtanterv alapján 9.-ben valószínű a Python-alapok és a HTML/CSS, de ez
  **feltételezés**.
- Ha Endi újabb füzetoldalt vagy saját magyarázatot küld: „Endi mondja” stílusban, külön részként.

## Munkastílus Endivel

- Magyarul, ékezethelyesen. A teendőket `TEENDŐ MOST:` / `TEENDŐ:` / `HALASZTVA:` jelölővel,
  sor elején írjuk (globális CLAUDE.md).
- Endi gyakran nincs a gépnél, és azt kéri: „csináld, ahogy javaslod”. Ilyenkor önállóan
  dolgozunk, és **ha egy rész kész, azonnal push** (engedélyezte), hogy Kovrat egyből tanulhasson.
- Ha pontosan megmondja, mit kér, nem kérdezünk vissza. Valódi döntésnél rákérdezünk.
- Kifelé ható új lépés (új repó, nyilvánossá tétel) előtt jóváhagyást kérünk.
- Ha valami nem frissül élesben, előbb a https://www.githubstatus.com oldalt nézd meg, és
  mondd meg őszintén, hogy GitHub-oldali-e a hiba.
