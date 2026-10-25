# Lecke-recept — így készül egy lecke hibamentesen

Ez a runbook minden buktatót leír, amibe az 1. lecke (kettes) és a 2. lecke (hármas, ötös,
hatos, hetes) közben belefutottunk, a megoldással együtt. Új leckénél haladj végig rajta sorban.
Ha új buktatóba futsz, **írd ide** a végén, a megfelelő szakaszba.

---

## A. Új lecke a közös készlettel (2026. 10. 22-től ez az alap)

A 3.–9. lecke a `tools/lessons` mappából épül. **A kimenet (`*.html`) generált, a forrást szerkeszd.**

```bash
node tools/lessons/build.js <név>     # tools/lessons/<név>.src.html → ./<név>.html (név nélkül mindet)
```

- A forrás váza: `<!--@HEAD-->` (meta, betűk, közös CSS) · `<title>` · saját `<style>` · a tartalom · `<!--@KITJS-->` ·
  saját `<script>` · `<!--@UPDATE-->` (frissítés-szkript). Minta: `tizenhatos-szamrendszer.src.html` (számrendszer),
  `html-alapok.src.html` (kódolós feladatok), `logikai-muveletek.src.html` (kifejezésfa).
- A `K` objektum (kit.js): `K.deck(el, slides)` diák · `K.player(el)` + `.load(frames, cím, auto)` lejátszó, a képkocka
  `{cap, html}` · `K.practice(el, {id, types, play, examN})` gyakorlás · `K.editor(el, {code})` élő HTML/CSS szerkesztő ·
  `K.tts.rules` felolvasás-szabályok (regex, csere) · segédek: `rnd, pick, shuffle, esc, norm, art`.
- Feladat (`gen(szint)` visszatérése): `{q, kind:"input"|"choice"|"code", check(érték)→{ok,msg}, answer, sol, frames, title}`.
  Választós: `options:[{l, ok}]`, a `check` kapja `{idx, v}`-t. Kódos: `starter`, a `check` kapja `{doc, win, parsed, code}`-t
  (a `parsed` a begépelt kód DOMParser-es dokumentuma, a `doc`/`win` az élő előnézet: `getComputedStyle`-hoz).
- **Gépi ellenőrzés:** `node tools/lessons/lesson-test.js <név> 40` (a részletek a 9. szakasz végén).
- **Ellenőrzés (kötelező):** minden típus × szint × 40–80 feladat szkripttel: a megoldásban kiírt „Jó válasz” átmegy-e;
  kódos feladatnál a kiinduló kód **ne** menjen át. Telefonszélesség: iframe-ben 390 px, minden feladat megoldással
  megnyitva, `documentElement.scrollWidth` ne nőjön (az iframe görgetősávja miatt 371 az alapérték). Sötét téma.
- A kimenet verziója: a `build.js` a `version.json`-ból veszi, a hook commitkor újat ír.

A 0–9. szakaszok (füzet, tartalom, tokenek, nyelvtan, felolvasás, ellenőrzés, publikálás) ezután is érvényesek.

---

## 0. Forrás: hogyan tanítják az iskolában?

**Mielőtt bármit terveznél, derítsd ki, milyen módszerrel tanítják.** A 2. leckénél Kovrat
füzetéből derült ki, hogy nem osztogatással váltanak át (amit az 1. lecke fő módszerként
tanított), hanem hatványtáblázattal és kivonással. Ha más módszert tanítunk, összezavarjuk.

- Endi fotókat tesz egy almappába (pl. `szamrendszerek/`). Ezek **`.jfif`** kiterjesztésűek, és a
  Read tool **nem ismeri fel képként** (bináris szemetet ad). Előbb másold őket `.jpg`-ként a
  scratchpadba, és onnan olvasd:
  ```bash
  S="<scratchpad>/kepek"; mkdir -p "$S"; i=1
  for f in /c/xampp/htdocs/Kovrat/MAPPA/*.jfif; do cp "$f" "$S/k$i.jpg"; i=$((i+1)); done
  ```
- Jegyezd fel: a füzet formáját (mit hova ír, milyen sorrendben), a konkrét példákat, és **hol
  akadt el** vagy hol hibázott. Ezek pontosan kerüljenek be a leckébe, a befejezéssel együtt.
- A fotók **ne kerüljenek a repóba** (nyilvános!). A `.gitignore`-ba vedd fel a mappát.
- Ha Endi saját magyarázatot küld („Endi mondja”), azt az ő gondolatmenetével és szavaival tedd
  be. Csak a tényleges hibát javítsd, finoman, és szólj róla neki.

## 1. Tartalom megtervezése

A bevált szerkezet egy fájlon belül, ebben a sorrendben (a 2. lecke szerint):

1. **Hero:** azonnal kipróbálható interaktív elem (kettes: lámpák; 2. lecke: kilométerszámláló).
2. **„Endi mondja”** (ha van): Endi magyarázata, kártyákon (`.story` / `.card`).
3. **A füzeted:** a füzet példái kockás füzetlapon, lépésenként, a füzet formájában (`.nb`).
4. **„Endi mondja · 2. rész”** (ha kéri): a füzet feladatai részletesen, szavakkal és ábrákkal.
5. **Diák** (kb. 9–11): lapozható, egy dia egy gondolat. Saját bemenettel és léptetéssel. Az
   utolsó előtti dián a **tipikus hibák**, az utolsón a **trükkök**.
6. **Levezetés-lejátszó:** magától halad lassan, felolvasással, kézzel is léptethető.
7. **Gyakorlás:** 3 szint, több feladattípus, véletlen generálás, azonnali ellenőrzés,
   **célzott hibaüzenet**, „Megoldás lépésenként”, „▶ Nézd meg lejátszva”, és **próbadolgozat**.
8. **Puska.**

A szöveg a 9.-es diákhoz szól: tegező, rövid mondatok, konkrét példa minden szabály mellett.
Ha Endi új részt kér, **a meglévő részeket ne módosítsd**, új szakaszt adj hozzá.

## 2. A HTML-fájl kötelező elemei

A lecke fájlja fut localhoston, GitHub Pagesen és (ha kell) claude.ai artifactként. Ezért
**a fájl legelején**:

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Rövid név</title>
<meta name="kovrat-version" content="0">
```

a CSS elején:

```css
[hidden]{display:none!important}
table{font-size:inherit;color:inherit;font-weight:inherit;line-height:inherit}
body{margin:0; background:var(--bg); ...}
```

és **a fájl legvégén** a frissítés-ellenőrző `<script>` (másold a `szamrendszerek.html`
aljáról, lásd 8. pont).

⚠️ **Miért:** az artifact magától vázat tesz a fájl köré, a localhost és a Pages nem. Ezek nélkül:
- **elromlanak az ékezetek** („Összefoglaló” → „ĂsszefoglalĂł”). Megtörtént.
- **minden dia egyszerre látszik**, mert a `.slide{display:flex}` felülírja a `hidden`-t.
- **a táblázatok betűje apró és rossz színű**, mert doctype nélkül (quirks mód) a `table` nem
  örökli a betűméretet és a színt. Sötét témában a kék tollas füzetlap táblázata majdnem fehér,
  olvashatatlan lett. Ezt csak sötét témában lehetett észrevenni, ezért **sötét témában is tesztelj**.

`<!doctype html>`, `<html>`, `<head>`, `<body>` taget **ne** írj a lecke fájljába (az
`index.html` kivétel: az teljes dokumentum).

## 3. Design-tokenek (hogy a leckék egységesek legyenek)

Másold át egy meglévő lecke `:root` blokkját **mindhárom** témablokkal együtt (világos alap,
`prefers-color-scheme: dark` a `:not([data-theme="light"])` védelemmel, és `[data-theme="dark"]`).

- Betűk (Google Fonts): **Bricolage Grotesque** (címek), **Atkinson Hyperlegible** (szöveg),
  **JetBrains Mono** (számok), **Caveat** (kézírás a füzetlapon).
- Színek: **borostyán „LED”** (`--led`) a kiemelt jegyekhez és eredményekhez, **kék**
  (`--accent`) a struktúrához és a gombokhoz, zöld/piros csak a helyes/hibás jelzésre.
- **Füzetlap** (`.nb`): fix világos papír és kék toll (`#1F3A93`) mindkét témában, mert
  „papír”. A táblázatnak örökölnie kell a színt (2. pont).
- Telefonon is menjen: 16 px oldalmargó, a széles táblázatok saját `overflow-x:auto`
  konténerben (`.ptwrap`). Hosszú sorok a füzetlapon tördelődjenek (`overflow-wrap:anywhere`).
- `prefers-reduced-motion` esetén `transition` és `animation` kikapcsolva.

## 4. Magyar szöveg generálása JS-ből — nyelvtani csapdák

Itt hibáztunk a legtöbbször. **Minden generált mondatot olvass el böngészőben, mind a négy
alapszámmal**, mert a hiba csak egy-egy alapszámnál jön elő.

- **Névelő számok előtt (a/az):** `az`, ha a szám 1, vagy 5-tel kezdődik (öt, ötven, ötszáz).
  Minden más `a`. 1–2000-ig pontos (1000–1999 „ezer…” → `a`). Kódban: `art(n)` / `Art(n)`.
  Ne felejtsd el kis számjegyeknél sem: „a legnagyobb jegy **az** 5”, „alá **az** 1 jegy kerül”.
  Ezt kétszer is elrontottuk (`'a '+(B-1)` és `'alá a '+q` volt a kódban).
- **Jegyenként felolvasott szám előtt** az első jegy dönt (egy, öt → `az`): `artB(s)`.
- **Toldalék számok után (-ba/-be, -tól/-től, -szor/-szer): KERÜLD.** Hangrendfüggő, és a kód
  elrontja. Fogalmazz át:
  - ❌ „16 belefér a 25-be” → ✅ „Belefér a maradékba (25)?”
  - ❌ „a 8-as helyen” → ✅ „Helyiérték: 8, jegy: 1”
  - ❌ „5³-tól 5⁰-ig” → ✅ „a legnagyobb ilyen hatványtól az 1-ig”
  - ❌ „Kezdünk a 343” → ✅ „Az első hatvány: a 343”
  - A fix alakok rendben vannak: „1-et írunk”, „0-t írunk”, „0-tól 9-ig”, „-ig”.
- **Számrendszer neve + toldalék, szorzószavak:** hármas*ban*, de ötös*ben*; hatos*ban*, de
  hetes*ben*; hárommal / öttel / hattal / héttel; háromszor / ötször / hatszor / hétszer;
  háromszorosára / ötszörösére. **Mindig szótárból** (`INB`, `WITH`, `TIMES`, `FOLD`, `FOLD_PL`
  a `szamrendszerek.html`-ben), soha nem `NAME[b] + "ben"` vagy `b + "-szeresére"` összefűzéssel.
  A 2. leckében ez 12+ helyen elromlott, mielőtt észrevettük.
- **Szótár indexhatár:** a `TIMES` tömbben legyen meg a „hétszer” is (7-es alap). Egyszer
  `TIMES[Math.min(B,6)]` volt a kódban, ami 7-nél „hatszor”-t írt.
- **Hatvány szóban:** „3 a harmadikon”, de „3 **az** elsőn / **az** ötödiken” (`artOrd(k)`).
- Pedagógiai pontosság: „kétszer írom le a 3-at, és összeszorzom” egyértelműbb, mint „kétszer
  szorzom önmagával”. A hatványokat **jobbról balra** írjuk fel (jobb szélen az 1).

## 5. Felolvasás (Web Speech API)

- Magyar hang: `lang` `hu`-val kezdődjön, `Natural`/`Online` nevű hangok előnyben (Edge: Noémi,
  Tamás). A hanglista aszinkron töltődik, ezért a `voiceschanged` eseményre újra kell választani.
- **A nem tízes számokat jegyenként kell felolvastatni** („egy kettő nulla nulla egy, ötös
  számrendszerben”). Ehhez a szövegben mindig `12001<sub>5</sub>` alakban írd, a felolvasó erre
  a mintára keres (`(\d+)<sub>(\d+)</sub>`). A tízes szám alakja `25<sub>10</sub>`.
- Hatvány: `5<sup>3</sup>` → „5 a harmadikon”.
- Jelek szóvá: `:` osztva, `·` szorozva, `−` mínusz, `+` plusz, `=` egyenlő, `≤` kisebb vagy
  egyenlő, mint, `>` nagyobb, mint. **Szóközzel körülvéve** írd őket a feliratokba.
- Továbblépés csak az `onend` után. **Biztonsági időzítő kell** (a Chrome néha nem küldi az
  `onend`-et). `cancel()` után 60 ms-mal indítsd a `speak()`-et. Token-számlálóval dobd el az
  elavult visszahívásokat.
- Ha nincs magyar hang: látható figyelmeztetés, hogy Edge-ben biztosan működik.

## 6. Levezetés-lejátszó és füzetlap felépítése

- Minden levezetés **előre legenerált képkockák listája**: `{cap, html}`. A `html` a lépés
  teljes pillanatképe, így a Vissza gomb triviális. Egy `render()` függvény a változó állapotból
  rajzol, a `push(cap)` elmenti a pillanatképet. A füzetlap (`buildNotebook`) ugyanígy működik.
- Új elem: `new` osztály (pop animáció), aktuális: `cur` osztály.
- Időzítés: `tempó × (0,7 + felirathossz/180)`; felolvasásnál a beszéd vége vezérel.
- Négynél több ismételt összeadás helyett szorzást írj („7 · 6 = 42”, nem „7 + 7 + 7 + 7 + 7 + 7”).

## 7. Ellenőrzés publikálás előtt

**a) JS szintaxis** (Git Bash). A `<script>` és a `</script>` sor elején legyen, különben az
awk nem találja. Több script-blokk is lehet, az awk összefűzi őket:

```bash
cd /c/xampp/htdocs/Kovrat
S="$TEMP/claude/check.js"; mkdir -p "$(dirname "$S")"
awk '/^<script>/{f=1;next}/^<\/script>/{f=0}f' LECKE.html > "$S" && node --check "$S" && echo OK
```

**b) Böngészős teszt Playwrighttal** (`mcp__plugin_playwright_playwright__*`), localhoston:

- Egy `browser_evaluate` „stresszteszt”: `window.addEventListener('error', …)` gyűjti a hibákat,
  aztán végigkattint mindent: minden alapszám, minden dia, minden levezetés minden lépése, minden
  gyakorlótípus × szint × alap, többször „Megoldás” + „Új feladat”. Elvárt: `errs: []`.
- A matematika ellenőrzése: a füzet példái (876 = 12001₅ = 1012110₃ = 4020₆ = 2361₇) és a próba.
- A hibaüzenetek kipróbálása szándékosan rossz válaszokkal (fordított, nullák nélkül, csak
  jegyösszeg).
- Telefon: `browser_resize` 390×844, `document.documentElement.scrollWidth` ≤ 390 (nincs
  vízszintes görgetés), képernyőkép.
- **Sötét téma:** `browser_emulate_media colorScheme: dark`, képernyőkép. (Így derült ki a
  halvány táblázat.)
- Képernyőképet csak a repó alá menthetsz: `filename: ".playwright-mcp/x.png"` (a scratchpad
  tiltott útvonal). Utána a Read tool-lal nézd meg.

## 8. Publikálás

1. **index.html:** új `<a class="lesson">` blokk a listában.
2. **README.md:** új sor a leckék táblázatában, és frissítsd a „Hol tartunk” részt.
3. **Git:** csak a konkrét fájlokat add hozzá (soha `git add .`, a füzetfotók miatt).
   ```bash
   git add <fájlok> && git commit -F - <<'EOF'
   <magyar üzenet>

   Claude-Session: <session link a system-reminderből>
   EOF
   git push
   ```
   - A **pre-commit hook** HTML-t tartalmazó commitnál magától új verziót ír a `version.json`-ba
     és **minden** HTML-be, és mindet hozzáadja a commithoz. Ellenőrzés:
     `git show HEAD:version.json` és `git show HEAD:LECKE.html | grep kovrat-version` egyezzen.
   - A `LF will be replaced by CRLF` figyelmeztetés ártalmatlan.
4. **Élesítés ellenőrzése:**
   ```bash
   gh api repos/Endy07/Kovrat_tanulas/pages/builds/latest --jq .status   # built?
   curl -s "https://endy07.github.io/Kovrat_tanulas/version.json?t=$RANDOM"  # új verzió?
   ```
   Normál esetben 1–2 perc.
5. **claude.ai artifact előnézet (opcionális):** `Artifact` tool, mindig ugyanazzal a
   fájlúttal. Előtte az `artifact-design` skill. A 2. leckénél nem kellett.

### Ha nem élesedik (GitHub-zavar)

2026. 10. 05-én a GitHub Actions órákig állt (előbb „degraded”, aztán „major outage”). A Pages
ezen fut, ezért az építések sorban álltak, majd `cancelled`/`failure` lett belőlük, és **a
helyreállás után sem indultak újra maguktól**.

- Állapot: `curl -s https://www.githubstatus.com/api/v2/summary.json` (Pythonnal kiírható a
  nem `operational` komponens és az incidens szövege). Mondd meg Endinek őszintén, hogy ez
  GitHub-oldali, mindenkit érint.
- Futások: `gh run list -L 5`.
- Helyreállás után: push (ha van helyi commit), vagy
  `gh api -X POST repos/Endy07/Kovrat_tanulas/pages/builds`. Utána egy perc alatt kiment.
- Hosszú háttérfigyelő (`run_in_background`) helyett inkább kérd meg Endit, hogy szóljon, ha a
  githubstatus zöld: a háttérfolyamatot a Claude Code memóriahiány miatt egyszer leállította.

### Automatikus frissítés (ne kelljen Ctrl+Shift+R)

A Pages 10 percig gyorsítótáraz, Kovrat mobilon néz. Ezért minden oldalon:

- `<meta name="kovrat-version" content="…">` a `<title>` után,
- a fájl végén a frissítés-szkript: megnyitáskor, a fülre visszatéréskor (`visibilitychange`)
  és a vissza gombos visszatéréskor (`pageshow` + `persisted`) `fetch("version.json?t=…",
  {cache:"no-store"})`. Ha a `v` más, mint a meta, egyszer `location.replace` egy `?v=<új>`
  címre (ezt a címet semmilyen gyorsítótár nem tárolta még). **Végtelen ciklus ellen:** ha az
  URL `v` paramétere már az új verzió, nem tölt újra. `file://`-on és artifactban (404) csendben
  kihagyja.
- A verziót **gép állítja**: `.githooks/pre-commit` → `tools/bump-version.sh`. Új klónozás után
  egyszer: `git config core.hooksPath .githooks`.
- Kipróbálás localhoston: írj a `version.json`-ba egy hamis jövőbeli verziót, töltsd be az
  oldalt. Elvárt: egyszer átvált `?v=<hamis>`-ra, és ott marad. Utána `sh tools/bump-version.sh`.

### Egyszeri beállítás (már kész, csak új repónál kell)

```bash
git init -b main
gh repo create Kovrat_tanulas --public --source=. --remote=origin --push --description "..."
gh api -X POST repos/Endy07/Kovrat_tanulas/pages -f "source[branch]=main" -f "source[path]=/"
git config core.hooksPath .githooks
```

## 9. Eszköz-buktatók ebben a környezetben

- **Heredoc fájlíráshoz tilos:** egy hook blokkolja a `cat > fájl <<'EOF'` alakot. Fájlt a
  **Write** tool-lal írj. (Commit-üzenethez a `git commit -F - <<'EOF'` megengedett.)
- **perl `$ENV{X}`** csak exportált változót lát: `export F=…` kell, különben üres, és a
  beszúrás csendben elmarad. Mindig ellenőrizd `grep -c`-vel, hogy tényleg bekerült-e.
- **CRLF sorvégű fájlok** (pl. `kettes-szamrendszer.html`): a perl `…$` mintája nem illik a
  `\r` miatt, és a csere csendben elmarad. Használj `(\r?)$`-t, és utána `grep`-pel ellenőrizz.
- **Edit tool „file modified on disk” figyelmeztetés** perl/sed szerkesztés után: ártalmatlan,
  de ha a környező tartalomra építesz, olvasd újra a fájlt.
- **Firecrawl keresés 402-es hibát adott** (kredit). Helyette a `WebSearch` működik.
- Az iskola (Mechwart) saját tanmenete **nincs fent az interneten**. Kérdezd meg Endit.
- Az artifact-keretben az `alert()`, `confirm()`, `window.print()` és letöltés nem működik.

### A 2026. 10. 22-i leckék új buktatói

- **Új klónban a verzió-hook nem fut**, ha a `core.hooksPath` nincs beállítva (`git config core.hooksPath .githooks`).
  Tünet: a `version.json` és a `kovrat-version` meta nem változik a commitnál. Ellenőrzés: `git show HEAD:version.json`.
- **Generált mondatban tilos az „a(z)”**, és a változó szó után a toldalék („kékra”, „pirosra”). Fogalmazz át úgy, hogy
  a változó mögé fix szó kerüljön: „A h1 betűszíne legyen **piros**”, „Csatorna: piros. Jegyei: …”, „ezt a szót: „alma””.
  A `grep -c "a(z)"` a forráson 0 legyen.
- **Hosszú, szóköz nélküli szöveg telefonon** (URL, parancs a gombokon, megoldásban, `code`-ban) vízszintes görgetést okoz.
  A készlet CSS-e `overflow-wrap:anywhere`-t ad a `.opt`, `.solution`, `.prompt`, `.feedback` és `code` elemekre.
- **Kódolós feladat: a kiinduló kód ne menjen át.** A böngésző alapértékei miatt egy „állítsd 32 px-re” feladat a
  h1-nél eleve igaz (az alap 32 px). A szkriptes ellenőrzés `starterPass=0`-t várjon.
- **HTML-feladat ellenőrzése:** a böngésző kijavítja a hibás HTML-t (pl. `<ul>…</ol>`), ezért a hibakeresős feladatnál a
  **nyers kódot** is nézd regexszel (`</ol>` ne legyen, `</strong>` előbb legyen, mint `</p>`), ne csak a DOM-ot.
- **Élő előnézet:** `iframe sandbox="allow-same-origin"` (szkript nélkül), a tartalmat `document.write`-tal kell beírni
  (szinkron), akkor a `getComputedStyle` rögtön jó értéket ad. `srcdoc`-nál a dokumentum betöltése aszinkron.
- **PDF-ek (programtanterv):** a `WebFetch` nem olvassa a PDF-et. Töltsd le (a harness elmenti), majd
  `pdftotext -enc UTF-8 -layout fájl.pdf ki.txt` (Git Bash, `pdftotext` megvan), és grep-pel keress benne.
- **Szkriptes vizsgálat `browser_evaluate`-tel:** a lecke-IIFE belső változói nem érhetők el, ezért a gyakorlót a DOM-on
  át vezéreld (fül, szint, „Új feladat”, „Megoldás lépésenként”, a „Jó válasz” kiolvasása, beírás, `submit` esemény).

### A 2026. 10. 23-i (éjszakai) leckék: gépi tesztelő és új buktatók

**Gépi tesztelő:** `node tools/lessons/lesson-test.js <név> [N=40]` (a localhoston futó, már lefordított leckét nézi; a
globális `playwright` csomag és a gépen lévő `ms-playwright\chromium-*` kell hozzá, letöltés nélkül). Végigkattint minden
diát és lejátszó-kockát; minden gyakorlótípus × szint × N feladatnál beírja a „Jó válasz”-t (választósnál a gombot keresi),
kódos feladatnál előbb a kiinduló kódot is ellenőrzi; lefuttat egy próbadolgozatot; 390 px-en minden diánál, kockánál és
megnyitott megoldásnál méri a vízszintes túllógást (a bűnös elemekkel); képet ment világos 390 px-es és sötét témában
(`.playwright-mcp/<név>-390.png`, `-dark.png`). Kb. 10–30 másodperc leckénként.

- **A tesztelő néma legyen.** Windowson a headless Chromium is **kimondja** a felolvasást, ha a lejátszót léptetik (Endit
  éjjel zavarta). Ezért `--mute-audio`, és az init-szkript kikapcsolja a felolvasást (`kovrat-tts` = 0, `speak` üres).
- **A „Jó válasz” legyen a beírandó szöveg.** A tesztelő az alsó indexet (`92<sub>16</sub>`) és beírós feladatnál a záró
  zárójeles megjegyzést („3 (a 4 sorból)”) levágja, így a régi `logikai-muveletek` és `tizenhatos-szamrendszer` is átmegy.
  Választós feladatnál a teljes szöveget keresi a gombok között („NEM (A ÉS B)”).
- **Végtelen ciklus a generátorban:** a tesztelő ilyenkor nem ér véget (a böngésző lefagy). Ok: `do { x2 = … } while (… x1 …)`,
  ahol a feltétel olyan változótól is függ, amit a ciklus nem sorsol újra. **Minden változót, amitől a feltétel függ, a
  ciklusban sorsolj**, vagy tegyél bele őrszámlálót. Lefagyott tesztnél a saját `node` folyamatot állítsd le (PID alapján).
- **Ha a közös készletet (`kit.js`, `kit.css`) épp más módosítja** (párhuzamos munka), a kész leckét a HEAD-beli készlettel
  építsd: másold a `git show HEAD:tools/lessons/kit.js` (és `kit.css`, `update.js`, `build.js`) kimenetét egy ideiglenes
  `tools/lessons` mappába a forrással és a `version.json`-nal, ott futtasd a `build.js`-t, és a kimenetet másold vissza. Így a
  commitba nem kerül félkész készlet. A készlet módosítását a régi leckékkel is teszteld: építsd őket ideiglenesen
  (`.playwright-mcp/kcN/`, nincs commitolva), és futtasd rajtuk a tesztelőt.
- **A `.eq` osztály nem tördel** (`white-space:nowrap`): a diákon a hosszabb képletsor 390 px-en a dobozában görget. A tesztelő
  ezt nem jelzi (az oldal nem szélesebb), csak a képen látszik. Leckében: `.slide .eq{white-space:normal}`.
- **A lejátszó `pop` animációja 1,25-szörösére nagyít:** a teljes szélességű soroknál a bal szél levágódik; ezekre
  `transform-origin:left center`.
- **Saját CSS-osztály neve ne legyen `code`:** a `kit.css` `code,.code{background:…}` szabálya felülírja.
- **`</script>` a lecke szkriptjében lévő szövegben** lezárja a szkriptet („Invalid or unexpected token”): `<\/script>` kell.
- **JetBrains Mono ligatúrák:** a `===`, `!==`, `<=`, `>=`, `<>` egy jellé olvad (≡, ≤), a diák mást lát, mint amit be kell
  gépelnie. Kódnál `font-variant-ligatures:none`.
- **Felolvasandó feliratban `<` vagy `>`:** `&lt;`/`&gt;` alakban írd, és adj hozzá felolvasó-szabályt, különben a felolvasó
  címkének nézi, és lenyel egy darabot.
- **Változók felsorolásában ne `·` legyen az elválasztó** (a felolvasó szorzásnak olvassa): vessző.
- **A névelőt ne javítsd utólag `.replace`-szel** a generált mondatban (törékeny, csendben elmarad): eleve `K.art(n)`.
- **Szótárból kell minden toldalékolt alak** változó után: „osztható 3-mal” (`VEL` szótár), ismétlésszám („háromszor”),
  szereplőnevek toldalékolt alakjai.
- **Folyamatábra SVG-ben:** a feliratot ne tedd a rombusz élére (ráfut), a mellékág fölé tedd.
- **JS-futtató (`K.jsrun`, `K.jseditor`, `kind: "js"`):** `iframe sandbox="allow-scripts"` (azonos eredet nélkül), `srcdoc`,
  előtét-szkript + `postMessage` (e.source és futás-token); a ciklustörzsekbe számláló kerül, 4 mp időkorlát. A kapcsos zárójel
  nélküli ciklustörzsre nem kerül számláló: ott csak az időkorlát véd, és ha az iframe ugyanabban a folyamatban fut, az oldal
  addig megfagyhat. A `K.practice` aszinkron check-et is elfogad (Promise).
- **Törlés a munkafában:** a `rm -rf` parancsot egy védőhook megállítja; ideiglenes mappához inkább új, üres nevet használj.
- **Kifejezés a válasz** (algebra, képlet): ne szöveget hasonlíts, hanem értékeld ki több pontban saját elemzővel (`eval` nem),
  és külön ellenőrizd az alakot (kifejtett, kiemelt), különben a visszamásolt feladat átmegy.
- **Választós tippek:** ne legyen két jó gomb. Átfedő jelentésű szavak (bug/error, folder/directory) ne legyenek egymás rossz
  válaszai; generált tippeknél nézd meg a véletlen egyezést (pl. k = 2-nél két képlet ugyanaz); egyszerűsített arányt
  (16:10 → 8:5) is tegyél a gombok közé, vagy írd ki a megnevezett alakot.
- **Ligatúrák kikapcsolása** (`font-variant-ligatures:none`): a `table`, `input`, `code`, `.opt` elemekre külön is, mert
  quirks módban a táblázat nem örököl.
- **Névelő változó elé:** cellanév előtt `artC(név)` („az A1”, „a B2”), sorszám/index előtt fogalmazd át („a helye: 3”).
  Szám után a „-szor/-szer” is tilos („összesen ennyit: N”). Szövegben két szám közös többszörösénél az LKKT-t írd, ne a szorzatot.
- **A `grep -c "a(z)"` hamis találatot ad** a kódra (`extra(z)`): ilyenkor nevezd át a változót.
- **„Jó válasz” `<` jellel:** `esc()`-kel add meg (`x &lt; 5`).
- **SVG-felirat a szélen:** a `text-anchor="middle"` kilóg a viewBoxból; a széleken `start`/`end`. A tesztelő ezt nem látja.
### A 2026. 10. 25-i Python-dolgozat lecke buktatói (Pyodide)

- **Python-futtató = Pyodide egy blob-URL-es Web Workerben** (`importScripts` a jsDelivr-ről, `indexURL` ugyanoda). A workert
  le lehet állítani (`terminate`), így a végtelen ciklus nem fagyasztja le az oldalt; utána újra kell tölteni a Pyodide-ot
  (a böngésző gyorsítótárából gyors). Lusta betöltés: csak az első futtatáskor. Ha nem tölt be, minden statikus rész menjen.
- **Egy Python-keret két helyen:** a `HARNESS` (`String.raw` sablon, a Pythonban `chr(10)`, nem `\n`) fut a Pyodide-ban és a
  `py-check.js`-ben a helyi Pythonnal, így a példafutások (OUTS) és a böngészős futás betűre egyeznek (52/52 igazolva).
- **A logika jelölt blokkokban** (`/*@HARNESS*/`, `/*@LOGIC*/`, `/*@ORIG*/`, `/*@OUTS*/`): a `py-check.js` ezeket Node-ban
  kiértékeli. A `LOGIC` ne használjon DOM-ot; amit kívülről kap (`rnd, pick, shuffle, esc`), azt a szkript is megadja.
- **Kimenet-ellenőrzésnél a bemenet visszhangja ne számítson:** a `max`-os feladatnál a legnagyobb szám a beírt értékek között is
  ott van. Ezért a keret külön gyűjti a print kimenetét és a prompt + begépelt értéket.
- **Rövid szöveg (1–3 karakter) a kimenetben** csak önálló szóként számít (különben az „a” betű minden címkében megvan);
  ismétléses / csillagos sor egész sorként (`line`), különben a hosszabb sor is „tartalmazza”; strip-feladatnál tiltott minta
  (két szóköz előtte, egy utána), mert a címke utáni egy szóköz rendben van.
- **A megjegyzés levágása** (`#`) ne vágja el a szöveget: `'#' * 5`. Idézőjelet követő szűrő kell (`stripCom`).
- **Kerekítési határ:** a generált tizedes törtek jegyei között nincs 0 és 5, így egyik kerekítés sem esik ,5-re; a számolt
  értékeknél `tie()`-vel újrasorsolunk. A `round(x, k)` egész értéknél Pythonban `4.0`: a „Mit ír ki?” válasza `pyF`-fel.
- **Két különböző próbabemenet:** listából két `pick` gyakran egyforma; `two(lista)` (keverés, első kettő).
- **A gépi tesztelő** a Pyodide első betöltése miatt megvárja a foglalt (`data-busy`) Ellenőrzés gombot (legfeljebb 90 mp).
- **Telefonon a kódmező ne tördeljen** (`wrap="off"`): Pythonban a tördelt sor új sornak látszik.

- **Független ellenőrzés:** a Python `round()` párosra kerekít (4312,5 → 4312), a JS `Math.round` felfelé; adj tűrést a .5-ös
  határra. Számkiolvasásnál a `[\d,]+` a felsorolás vesszőjét is elnyeli: `\d+(?:,\d+)?`; a számot tartalmazó neveket (MP3, 4K)
  előbb töröld. Ha a rajz és a válasz ugyanabból a fából készül, a rajzot ez nem igazolja: azt nézd, egyedi-e a jó gomb.
