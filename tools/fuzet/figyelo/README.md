# Füzet-figyelő (Endi Windows-gépén)

Pár percenként megnézi a Drive-on a `sor.json`-t (rclone). Ha Kovrat feldolgozást indított: letölti a képeket egy helyi
mappába, a repóból külön munkafát nyit egy új ágon, lefuttatja benne a `claude -p`-t a feldolgozó prompttal (az
előfizetés terhére), ellenőrzi az eredményt, pusholja az ágat, PR-t nyit, és visszaírja az állapotot (`allapot.json`).
A beolvasztás mindig Endié.

Ha a gép ki van kapcsolva, a kérés megvárja: a figyelő bejelentkezéskor indul, és először a várakozó kéréseket dolgozza fel.
Ha feldolgozás közben kapcsolták ki, induláskor újrakezdi (legfeljebb kétszer, utána „hiba”, és a képek visszakerülnek
Kovrat galériájába).

## Mi kell hozzá

| Eszköz | Ellenőrzés | Megjegyzés |
|---|---|---|
| Node 18+ | `node --version` | megvan (a leckék buildje is ezt használja) |
| rclone, `gdrive:` remote | `rclone lsf gdrive:` | megvan; a remote a My Drive gyökerét látja |
| Claude Code | `claude --version` | bejelentkezve az előfizetéssel (`claude` egyszer interaktívan) |
| git, a repó klónja | `git -C C:\xampp\htdocs\Kovrat status` | `git config core.hooksPath .githooks` legyen beállítva (verzió-hook) |
| GitHub CLI (ajánlott) | `gh auth status` | PR-hez. Ha nincs: `"gh": null` a beállításban, és a figyelő csak pushol, az állapotban összehasonlító link lesz |
| Python (a gépi teszthez) | `python --version` | a feldolgozó a `lesson-test.js`-hez helyi szervert indít |

A feldolgozó a Claude Code-ot Git Bashben futtatja (ahogy eddig a sessionök is), a `playwright` a globális csomagok közül jön
(mint eddig a `lesson-test.js`-nél).

## Telepítés

1. A repó legyen friss (a PR beolvasztása után): `git -C C:\xampp\htdocs\Kovrat pull`.
2. Beállítás: másold le a `figyelo.config.example.json`-t **`figyelo.config.json`** néven (ugyanide; nincs commitolva), és írd át:
   - `repo`: a repó klónja; `munkamappa`: egy mappa a repón **kívül** (ide jönnek a fotók, a naplók, az előnézetek);
   - `tavoli`: `gdrive:` + az Apps Script `GYOKER_MAPPA`-ja (pl. `gdrive:Füzetek`);
   - `tiltott`: a családi kód, a vezetéknév, a tanár neve… — ha ezek bármelyike bekerülne a változásba vagy a PR-be, a figyelő
     nem pusholja (kis- és nagybetű mindegy). Az Apps Script-cím (`script.google.com/macros/s/`) mindig tiltott;
   - `claudeModell`: üresen a Claude Code alapértelmezése; `idokorlatPerc`: egy lecke legfeljebb ennyi ideig készülhet.
3. Próba: `node tools\fuzet\figyelo\figyelo.js --proba` → minden sor ✓.
4. Háttérfeladat: `powershell -ExecutionPolicy Bypass -File tools\fuzet\figyelo\telepites.ps1`
   (Feladatütemező, „Fuzet-figyelo”: bejelentkezéskor indul, rejtett ablakban, hiba esetén 5 perc múlva újraindul).
   Eltávolítás: ugyanez `-Eltavolit`-tal.

Kézzel, látható ablakban: `egyszer.cmd` (egy kör, aztán vége).

## Hol mi van

```
<munkamappa>\
  figyelo.log                 napló (minden kör, minden hiba)
  <kérés>\kepek\              a letöltött fotók (01-fuzet.jpg, 02-tabla.jpg…) — csak itt, a repóba nem kerülnek
  <kérés>\prompt.md           amit a claude kapott
  <kérés>\claude.log          a claude kimenete
  <kérés>\atirat.md           amit a képekről kiolvasott, [?] a bizonytalan részeken
  <kérés>\eredmeny.json       a lecke neve, címe, téma, bizonytalan helyek száma
  <kérés>\elonezet\<lecke>.html   dupla kattintással megnyílik a böngészőben (átnézéshez, beolvasztás előtt)
  <kérés>\pr.md               a PR leírása
  fa\<kérés>\                 a munkafa feldolgozás közben (utána törli; az ág megmarad)
```

## Mit ellenőriz push előtt

- van commit az ágon, és van benne `<lecke>.html`, `tools/lessons/<lecke>.src.html`, és a lecke linkje az `index.html`-ben;
- **nincs kép** (jpg, png, heic…) és bináris fájl a változásban;
- a hozzáadott sorokban és a PR leírásában **nincs tiltott szöveg** (a `tiltott` lista + az Apps Script-cím);
- nem módosította a `tools/fuzet/`-et, a `.githooks/`-ot, a `.gitignore`-t, a `CLAUDE.md`-t; ha közös készletfájlt
  (`kit.js`, `python.js`…) módosított, a PR-ben külön figyelmeztetés van.

A munkafa mindig LF-es: a figyelő a saját munkafájában `core.autocrlf=false` és `core.eol=lf` beállítást ad (worktree-szinten,
ezért a gép rendszerszintű `core.autocrlf=true`-ja és a fő munkapéldány nem számít, és nem is változik).

Ha bármi nem stimmel: nincs push, az állapot „hiba”, a részlet a naplóban és az `allapot.json` `reszlet` mezőjében.

## Tesztelés (valódi Google-fiók nélkül)

```bash
node tools/fuzet/teszt/apps-script-teszt.js   # a Code.gs a hamis Apps Scriptben (38 eset)
node tools/fuzet/teszt/e2e.js                 # böngésző → hamis Apps Script → figyelő (hamis rclone/claude/gh, valódi git) → vissza
```
