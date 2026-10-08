# Lecke-recept — így készül egy lecke hibamentesen

Ez a runbook minden buktatót leír, amibe az 1. lecke (kettes) és a 2. lecke (hármas, ötös,
hatos, hetes) közben belefutottunk, a megoldással együtt. Új leckénél haladj végig rajta sorban.
Ha új buktatóba futsz, **írd ide** a végén, a megfelelő szakaszba.

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
