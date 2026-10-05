# Lecke-recept — így készül egy lecke hibamentesen

Ez a runbook minden buktatót leír, amibe az 1. lecke (kettes számrendszer) közben belefutottunk.
Egy új leckénél haladj végig rajta sorban.

---

## 1. Tartalom megtervezése

A bevált szerkezet egy fájlon belül, ebben a sorrendben:

1. **Hero:** egy azonnal kipróbálható interaktív elem, ami a témát „megfoghatóvá” teszi
   (a kettes leckénél: 8 lámpás kapcsolótábla).
2. **Diák** (kb. 8–10): lapozható, és minden dia egy gondolatot visz. Ahol lehet, saját
   bemenettel és lépésenkénti léptetéssel. Az utolsó előtti dián a **tipikus hibák**, az
   utolsón a **trükkök**.
3. **Levezetés-lejátszó:** kész és saját példák, magától halad lassan, felolvasással. Kézzel is
   léptethető (Vissza / Tovább / Elejére), ilyenkor megáll.
4. **Gyakorlás:** 3 szint, több feladattípus, véletlen generálás, azonnali ellenőrzés,
   **célzott hibaüzenet**, „Megoldás lépésenként” és „▶ Nézd meg lejátszva” gomb.
5. **Puska:** a legfontosabb szabályok és táblázatok.

A szöveg a 9.-es diákhoz szól: tegező, rövid mondatok, konkrét példa minden szabály mellett.

## 2. A HTML-fájl kötelező elemei

Mivel ugyanaz a fájl fut **claude.ai artifactként, localhoston és GitHub Pagesen**, ezeknek
**a fájl legelején** kell lenniük:

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Rövid név</title>
```

és a CSS-ben:

```css
[hidden]{display:none!important}
body{margin:0; background:var(--bg); ...}
```

⚠️ **Miért:** a claude.ai artifact magától köré tesz egy vázat (charset, reset, `[hidden]`
szabály), a localhost és a Pages viszont nem. Ezek nélkül:
- **elromlanak az ékezetek** („Összefoglaló” → „ĂsszefoglalĂł”). Ez egyszer meg is történt.
- **mind a 9 dia egyszerre látszik**, mert a `.slide{display:flex}` felülírja a `hidden`
  attribútumot.
- **a táblázatok betűje apró lesz**, mert doctype nélkül (quirks mód) a `table` nem örökli a
  betűméretet és a színt (sötét témában a füzetlapon halvány lett a táblázat). Kell egy `table{font-size:inherit;color:inherit;font-weight:inherit;line-height:inherit}` sor is.

`<!doctype html>`, `<html>`, `<head>`, `<body>` taget **ne** írj a lecke fájljába: az artifact
publikálás maga teszi köré, a böngészők pedig nélküle is helyesen kezelik. (Az `index.html`
kivétel: az teljes dokumentum, nem megy artifactba.)

## 3. Design-tokenek (hogy a leckék egységesek legyenek)

Másold át a `kettes-szamrendszer.html` `:root` blokkját **mindhárom** témablokkal együtt
(világos alap, `prefers-color-scheme: dark` a `:not([data-theme="light"])` védelemmel, és
`[data-theme="dark"]`).

- Betűk (Google Fonts): **Bricolage Grotesque** (címek), **Atkinson Hyperlegible** (szöveg,
  jól olvasható diákoknak), **JetBrains Mono** (számok, kód).
- Színek: kékes semleges alap, **borostyán „LED”** (`--led`) a kiemelt bitekhez és
  eredményekhez, **kék** (`--accent`) a struktúrához és a gombokhoz, zöld/piros csak a
  helyes/hibás jelzésre.
- Telefonon is menjen: 16 px oldalmargó, a széles táblázatok saját `overflow-x:auto`
  konténerben legyenek.
- `prefers-reduced-motion` esetén `transition` és `animation` is legyen kikapcsolva.

## 4. Magyar szöveg generálása JS-ből — nyelvtani csapdák

A feladatszövegek dinamikusak, és itt könnyű nyelvtani hibát ejteni.

- **Névelő számok előtt (a/az):** `az`, ha a szám 1, vagy 5-tel kezdődik (öt, ötven, ötszáz).
  Minden más `a`. Ez 1–255-ig pontos. Kettes számok mindig 1-gyel kezdődnek → `az`.
  (Kódban: `art(n)` / `Art(n)`.)
- **Toldalék számok után (-ba/-be, -os/-es/-as, -at/-et): KERÜLD.** Hangrendfüggő
  („13-ba”, de „45-be”), és a kód könnyen elrontja. Fogalmazz át úgy, hogy ne kelljen:
  - ❌ „16 belefér a 25-be” → ✅ „16 ≤ 25, belefér” vagy „Belefér a maradékba (25)?”
  - ❌ „a 8-as helyen” → ✅ „Helyiérték: 8, jegy: 1”
  - ❌ „Váltsd át 13-at” → ✅ „Váltsd át a 13 számot”
- A fix alakok rendben vannak: „1-et írunk”, „0-t írunk”.
- **Számrendszer neve + toldalék szintén hangrendfüggő:** hármas*ban*, de ötös*ben*; hatos*ban*, de
  hetes*ben*. Ugyanígy: hárommal / öttel / hattal / héttel, kétszer / háromszor / ötször / hétszer.
  Ezeket **szótárból** vedd (`INB`, `WITH`, `TIMES`, `FOLD` a `szamrendszerek.html`-ben), ne
  `NAME[b] + "ben"` összefűzéssel. A 2. leckében ez 12 helyen el is romlott, mielőtt észrevettük.
- Jegyenként felolvasott szám előtti névelő az első jegytől függ (egy, öt → `az`): `artB(s)`.
- Fájlnévnél a `.jfif` képet a Read tool nem ismeri fel: előbb másold `.jpg`-ként a scratchpadba.

## 5. Felolvasás (Web Speech API)

- Magyar hang kiválasztása: `lang` `hu`-val kezdődjön, és a `Natural`/`Online` nevű hangok
  legyenek előnyben (Edge: Noémi, Tamás). A hanglista aszinkron töltődik be, ezért a
  `voiceschanged` eseményre újra kell választani.
- **A kettes számokat jegyenként kell felolvastatni** („egy egy nulla egy”), különben
  „ezeregyszázegy” lesz belőle. Ehhez a szövegben a kettes számot mindig
  `1101<sub>2</sub>` alakban írd, a felolvasó erre a mintára keres. A tízes szám alakja
  `25<sub>10</sub>`.
- A jeleket szóvá kell alakítani: `:` → osztva, `·` → szorozva, `−` → mínusz,
  `=` → egyenlő, `≤` → kisebb vagy egyenlő, mint, `>` → nagyobb, mint. **Szóközzel körülvéve**
  írd őket a feliratokba, mert a csere így ismeri fel őket.
- Továbblépés: csak az `onend` után. **Biztonsági időzítő kell**, mert a Chrome néha nem küldi
  el az `onend`-et. `cancel()` után 60 ms-mal később indítsd a `speak()`-et (Chrome-hiba).
  Egy token-számlálóval dobd el az elavult visszahívásokat.
- Ha nincs magyar hang: látható figyelmeztetés, hogy Edge-ben biztosan működik.
- Hang csak felhasználói kattintás után szólhat. Ez adott, mert a Lejátszás gombra indul.

## 6. Levezetés-lejátszó felépítése

- Minden levezetés **előre legenerált képkockák listája**: `{cap, html}`. A `html` az adott
  lépés teljes pillanatképe. Így a Vissza gomb is triviális, nincs állapot-visszagörgetés.
- Az újonnan megjelenő elem `new` osztályt kap (pop animáció), az aktuális sor vagy doboz
  `cur` osztályt.
- Az időzítés `tempó × (0,7 + felirathossz/180)`. Felolvasásnál viszont a beszéd vége
  vezérel, utána egy rövid szünet jön.
- Kézi léptetés = szünet + az adott lépés felolvasása.

## 7. Ellenőrzés publikálás előtt

A beépített JS szintaxis-ellenőrzése (Git Bash):

```bash
cd /c/xampp/htdocs/Kovrat
S="$TEMP/claude/check.js"; mkdir -p "$(dirname "$S")"
awk '/^<script>/{f=1;next}/^<\/script>/{f=0}f' LECKE.html > "$S" && node --check "$S" && echo OK
```

(A `<script>` és a `</script>` sor elején legyen, különben az awk nem találja.)

Utána egyszer nézd meg böngészőben, localhoston: ékezetek, egy dia látszik-e egyszerre,
telefonszélesség.

## 8. Publikálás

1. **claude.ai artifact (előnézet):** `Artifact` tool, `file_path` = a lecke fájlja. Első
   publikáláskor `icon` is kell. Frissítéskor **ugyanaz a fájlút**, így ugyanazon az URL-en
   frissül. Az artifact privát, Kovrat a GitHub Pages linket kapja.
2. **index.html:** új `<a class="lesson">` blokk a listában.
3. **README.md:** új sor a leckék táblázatában, és frissítsd a „Hol tartunk” részt.
4. **Git:**
   ```bash
   git add <fájlok> && git commit -F - <<'EOF'
   <magyar üzenet>

   Claude-Session: <session link a system-reminderből>
   EOF
   git push
   ```
   A `LF will be replaced by CRLF` figyelmeztetés ártalmatlan.
5. A Pages 1–2 perc alatt frissül. Állapot: `gh api repos/Endy07/Kovrat_tanulas/pages/builds/latest --jq .status`

### Egyszeri beállítás (már kész, csak új repónál kell)

```bash
git init -b main
gh repo create Kovrat_tanulas --public --source=. --remote=origin --push --description "..."
gh api -X POST repos/Endy07/Kovrat_tanulas/pages -f "source[branch]=main" -f "source[path]=/"
```

## 9. Eszköz-buktatók ebben a környezetben

- **Firecrawl keresés 402-es hibát adott** (elfogyott a kredit). Helyette a `WebSearch` tool
  működik.
- Az iskola (Mechwart) saját tanmenete **nincs fent az interneten**. Ne keresgélj rá sokáig,
  kérdezd meg a felhasználót, ő megkérdezi Kovratot.
- Az artifact-keretben a `alert()`, `confirm()`, `window.print()` és letöltés nem működik.
  Ilyet ne építs be.
