# Füzetből lecke

Kovrat lefotózza a füzetét vagy a táblát, feltölti a `fuzet.html` oldalon, kijelöli, melyikből legyen lecke, és megnyomja
a „Feldolgozás indítása” gombot. Endi gépén a figyelő a `claude -p`-vel leckét készít belőle (a `docs/LECKE-RECEPT.md`
szerint), és PR-ként adja vissza. Endi átnézi és beolvasztja; utána a lecke Kovrat oldalán a „Hol tart?” résznél nyílik.

```
Kovrat telefonja                    Endi Google-fiókja                 Endi Windows-gépe
fuzet.html  ── POST text/plain ──▶  Apps Script (Code.gs)              figyelo.js (Feladatütemező)
 · fotó/galéria, kicsinyítés         · képek: Drive/<mappa>/beerkezett   · rclone: sor.json, képek ◀──┐
 · homályos/sötét figyelmeztetés     · kepek.json, sor.json  ──────────────────────────────────────┘
 · kijelölés, tantárgy, indítás      · allapot.json olvasása ◀───────── · rclone: allapot.json (életjel)
 · állapot, link a kész leckére                                         · git worktree + claude -p + push + gh pr
```

| Rész | Fájl | Leírás |
|---|---|---|
| Feltöltő- és galériaoldal | `tools/lessons/fuzet.src.html` → `fuzet.html` | Kamera vagy galéria, kicsinyítés 2000 px-re, homály- és sötétség-figyelmeztetés, füzet/tábla jelölés, galéria kijelöléssel, tantárgy, állapot (várakozik / dolgozik / kész / hiba), a figyelő életjele. A cím és a családi kód csak a telefon `localStorage`-ában. |
| Apps Script webapp | `apps-script/Code.gs`, `apps-script/TELEPITES.md` | Képek a Drive-ba, lista bélyegképpel és állapottal, kérések a `sor.json`-ba; családi kód (Script Properties), méret- és darabkorlát. |
| Figyelő | `figyelo/figyelo.js`, `figyelo/README.md`, `figyelo/telepites.ps1` | rclone-nal figyel, `claude -p`, ellenőrzés, ág + PR, állapot vissza. |
| Feldolgozó prompt | `feldolgozo-prompt.md` | Olvasás `[?]`-lel, tantárgy és téma, lecke a recept szerint, gépi teszt, lektor-kör, eredmény. |
| A lecke váza | `minta-lecke.src.html` | Hero, „Ezt jól olvastam?”, a füzeted, diák, levezetések, gyakorlás 3 szinten, próbadolgozat, puska. |
| Közös leckerész | `tools/lessons/fuzet-lecke.js`, `.css` (`<!--@FUZETJS-->`) | `F.olvasat` („Ezt jól olvastam?”, a válasz visszamegy a Drive-ra), `F.forras`. |
| Tesztek | `teszt/` | Hamis Apps Script (a valódi `Code.gs`-t futtatja), hamis rclone, claude, gh; `apps-script-teszt.js`, `e2e.js`. |

**Szabályok:** a fotó, a név, a családi kód és az Apps Script-cím nem kerül a repóba és a nyilvános oldalra. A kész lecke
csak tananyag. A beolvasztás Endié.

## Endi teendői (egyszer)

1. Apps Script telepítése: `apps-script/TELEPITES.md` (projekt, Script Properties: `CSALADI_KOD`, `GYOKER_MAPPA`; engedélyek; webapp).
2. Kovrat telefonja: a link a családi kóddal (`TELEPITES.md`, 4. pont).
3. Figyelő: `figyelo/README.md` (beállításfájl, `--proba`, `telepites.ps1`).
4. Első valódi próba (lent).

## Az első valódi próba: egy matekos füzetoldal

1. **Előtte:** a figyelő próbája zöld (`node tools\fuzet\figyelo\figyelo.js --proba`), és a háttérfeladat fut (vagy kéznél az `egyszer.cmd`).
2. **Fotó:** egy matekos oldal, amin **kidolgozott feladat és megoldás** is van (pl. törtek, egyenlet, számrendszer-átváltás),
   felülről, nappali fényben, a lap töltse ki a képet. Ha az oldal figyelmeztet (homályos/sötét), fotózd újra.
3. **Feltöltés** a telefonon (`fuzet.html`) → a galériában megjelenik → kijelölés → tantárgy: **Matek** (így a felismerést is
   ellenőrizni lehet: a lecke tantárgya egyezzen) → „Feldolgozás indítása”. A „Hol tart?” résznél: ⏳ Várakozik.
4. **Drive:** a mappában megjelenik a kép (`beerkezett/<dátum>/`) és a `sor.json`.
5. **Figyelő:** pár percen belül „⚙ Dolgozik” (a naplóban: `▶ kérés …`). Egy lecke várhatóan 20–60 perc.
   Ha elsőre kézzel akarod nézni: állítsd le a háttérfeladatot, és futtasd az `egyszer.cmd`-t; a claude kimenete a
   `<munkamappa>\<kérés>\claude.log`-ban követhető.
6. **Ellenőrzés:**
   - `atirat.md`: jól olvasta-e ki? A `[?]`-ek tényleg a nehezen olvasható helyek?
   - `elonezet\<lecke>.html`: a „Ezt jól olvastam?” tételei, a füzet-lap, a magyarázat, a példák a füzet feladatai szerint,
     a gyakorlás **nem megy előre**, a próbadolgozat működik; telefonon is (a böngésző fejlesztői eszközében 390 px).
   - A PR: csak a 3 fájl (+ a verzió-bump minden HTML-ben), nincs kép, nincs név; a leírás ellenőrzőlistája.
7. **Kovrat:** a „Hol tart?” résznél „✓ Kész, Endi most átnézi”. Ha a „Ezt jól olvastam?”-ra szükség van, nézzétek át együtt.
8. **Beolvasztás** → 1–2 perc múlva Kovrat oldalán „▶ Megnyitom a leckét”; a kezdőlapon „A füzetedből” csoportban.
9. **Visszajelzés:** írd meg a pultnak, mi volt jó és mi nem (olvasás, téma, nehézség, időtartam): ebből javítjuk a promptot.

Ha valami elakad: `figyelo.log`, az `allapot.json` `reszlet` mezője, és a `claude.log`.

## A 2. lépés (tervezett): második vélemény a helyi Qwen vision-modelltől

A bizonytalan (`[?]`) részeket egy helyi vision-modell (Qwen-VL, a gépen futó Ollama/LM Studio) is elolvassa, a figyelő a
két olvasatot összeveti: ahol egyeznek, a `[?]` lekerülhet; ahol eltérnek, mindkettő Kovrat elé kerül („6 vagy 8?”).
Bemenet: a munkamappa képei és az `atirat.md`; a `visszajelzesek/` (Kovrat válaszai) méri, melyik olvasat volt a jobb.
