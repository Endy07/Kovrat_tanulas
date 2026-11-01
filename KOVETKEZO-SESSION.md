# Következő session

## 🧭 BELÉPÉSI PONT — 2026-11-01 éjjel (Python-sorozat: 4. lecke)

**Hol tartunk:**
- **Élesben:** a sorozatterv, a közös modul és az 1–3. lecke (PR #5 `7ea784c`, PR #6 `869ae3f`; a pult mindkettőt ellenőrizte).
- **Új PR-ban** (`claude/python-sorozat-alapok-wtcsgc`, a `main`-ről folytatva): **4. Műveletek és beépített függvények**
  (`python-4-muveletek`): `/ // % **`, műveleti sorrend, `+=`, `round` (páros felé), `abs`, `max`, `min`, a maradék a gyakorlatban,
  a Python REPL a VS Code termináljában. 12 dia, 4 levezetés, 6 feladattípus.
- **Tesztek:** `py-check --verify 40 python-4-muveletek` 3176 futás, 0 hiba; `lesson-test 40` (Pyodide-dal) 720/720, 390 px, JS-hiba nincs.

**Következő lépés:** a PR beolvasztása után az **5. lecke: feltételek (`if`, `elif`, `else`)** (`python-5-elagazas`), a terv szerint,
VS Code-os példákkal, az alapoktól (nem tudjuk, volt-e már `if` az iskolában).

**Felhős teszt Pyodide-dal:** `npm pack pyodide@0.27.7` egy scratchpad-mappában, kicsomagolva, `KOVRAT_PYODIDE=<…>/package`
(recept, utolsó szakasz). Ha az ág PR-jét beolvasztották: `git merge origin/main` az ágba (a force-push itt tiltott), új PR.

**Endi döntésére vár:** a 4. lecke PR-jének beolvasztása.

---

## (korábbi) BELÉPÉSI PONT — 2026-11-01 késő este (Python-sorozat: 3. lecke)

**Hol tartunk:**
- **Élesben (PR #5, Endi olvasztotta be: `7ea784c`):** a sorozatterv (`docs/python-terv.md`), a közös modul, az 1. és 2. lecke. A pult
  Endi gépén is ellenőrizte (py-check, lesson-test, valódi jsDelivr-es Pyodide: rendben).
- **Endi válaszai (2026-11-01):** az iskolában **VS Code**-ban dolgoznak; a `python-elozetes` új címe **„Python – gyors áttekintés”**;
  nem tudjuk, volt-e már `if` → a sorozat az alapoktól halad, semmit nem tételez fel.
- **Új PR-ban (ugyanaz az ág, a `main` beolvasztva):** **3. Adatbekérés: input és a típusváltás** (`python-3-input`), VS Code-os
  terminálrajzzal és levezetéssel; az áttekintés új címe; az 1. lecke két mondata VS Code-ra igazítva.
- **Tesztek:** `py-check --verify 40 python-3-input` 3487 futás, 0 hiba; `lesson-test 40` (Pyodide-dal): 3. lecke 720/720, 1. lecke
  480/480, áttekintés 720/720; 390 px, JS-hiba nincs.

**Következő lépés:** a PR beolvasztása után a **4. lecke: műveletek és beépített függvények** (`python-4-muveletek`: `// % **`,
műveleti sorrend, `+=`, `round`, `abs`, `max`, `min`), VS Code-os példákkal, a terv szerint.

**Tanulság:** ha az ág PR-jét beolvasztották, a `--force-with-lease` push tiltott ebben a környezetben; helyette `git merge origin/main`
az ágba, és új PR.

---

## (korábbi) BELÉPÉSI PONT — 2026-11-01 este (Python-sorozat: terv + 1–2. lecke)

**Hol tartunk:**
- **Terv:** `docs/python-terv.md`, 10 lecke a nulláról (print → változók → input → műveletek → if → while → for → listák →
  szövegek → függvények); leckénként cél, fogalmak, tipikus hibák, feladattípusok; a viszony a `python-elozetes` és a
  `python-dolgozat` leckéhez (egyikhez sem nyúltunk).
- **Kész, PR-ban** (`claude/python-sorozat-alapok-wtcsgc`, a beolvasztás Endié): **1. Mi a program? A print** (`python-1-kiiras`),
  **2. Változók és típusok** (`python-2-valtozok`), a közös modul (`tools/lessons/python.js` + `python.css`, `<!--@PYJS-->`),
  a `py-check.js` sorozat-módja, és a kezdőlapon új csoport: „Python a nulláról”.
- **Tesztek:** `py-check.js --verify 40` (1.: 2517, 2.: 3413 valódi Python-futás, 0 hiba; a régi dolgozat-mód is megy);
  `lesson-test.js` 40-nel, Pyodide-dal a böngészőben (1.: 480/480, 2.: 720/720), 390 px, sötét téma, JS-hiba nincs.

**Következő lépés:** a PR beolvasztása után élőben ellenőrizni (`version.json`, a két lecke futtatója). Utána a **3. lecke:
`input` és típusváltás** (`python-3-input`), a terv szerint; a „Írd meg!” itt már két bemenettel fut, mint a dolgozat-leckében
(`tests: [{ ins, exp }]`, `PYCORE.cmpOut`).

**Felhős teszt Pyodide-dal** (a jsDelivr nem érhető el): `npm pack pyodide@0.27.7` egy scratchpad-mappában, kicsomagolva, és
`KOVRAT_PYODIDE=<…>/package` a `lesson-test.js`-nek (részletek: `docs/LECKE-RECEPT.md`, utolsó szakasz).

**Eldőlt (2026-11-01):** a PR #5 beolvasztva; az iskolában VS Code; az áttekintés címe „Python – gyors áttekintés”; a sorozat
semmit nem tételez fel (`if` sem).

---

## (korábbi) BELÉPÉSI PONT — 2026-11-01 (lezárva: a helyesírás-sor kész és élesben)

**Hol tartunk:**
- **Élesben a teljes helyesírás-sor:** mind a 11 lecke (1–3.: 2026-10-30; 4.: PR #1 `25ed352`; 5–11.: PR #2 `e81870d`), lektorálva,
  44 tollbamondás, és a **szintfelmérő** (`helyesiras-szintfelmero.html`, a kezdőlapon a helyesírás-csoport elején).
- **A szintfelmérő eredménye automatikusan Endi Google-űrlapjába megy** (PR #3, `b014b7d`): „Kovrat Szintfelmero”, a válaszok a
  „Kovrat Szintfelmero (válaszok)” táblázatban. Élesben igazolva (a pult két próbakitöltése megérkezett; Endi törölte a próbasorokat,
  a B „Pontszám” oszlop el van rejtve).
- Minden ág beolvasztva; ez a lezáró dokumentációs PR az utolsó a `claude/dreamy-hopper-52jouj` ágról.

**Következő lépés: a Python-sorozat, új sessionben** (a pult indítja; a feladatleírás a pultnál:
`2026-11-01-kovrat-python-alapok.md`). Mi a programozás, kiírás → változók → adatbekérés → műveletek → feltételek → ciklusok → listák →
szövegek → függvények; az első két lecke elsőként. Építsen a `python-dolgozat` futtatójára és ellenőrzőjére (Pyodide, `py-check.js`,
a `LOGIC` blokk mintája). A `main`-ről, saját ágon; PR, a beolvasztás Endié.

**Közben (Endi, Kovrat):**
- Kovrat kitölti a szintfelmérőt; az eredmény a táblázatba érkezik. Ha szólnak, a gyenge leckékhez plusz gyakorlás készülhet.
- Ha megjön Kovrat chatje (`C:\KOVRAT\chat\`): hibastatisztika (`docs/helyesiras-hibak.md`, csak hibatípusok), és ehhez igazítás.
- Ha kiderül, mit vesznek magyarórán (vagy jön füzetfotó): a leckék sorrendjét ahhoz igazítani.

**Tanulság a felhős munkához** (részletek: `docs/LECKE-RECEPT.md`): a pontszámokat a szabályzatból egyben kérd le, és a
kereszthivatkozásokkal ellenőrizd; a lektori kör sok apró hibát fog; a háttérszervert PID alapján állítsd le (a `pkill -f` a saját
parancsot is leállíthatja); a felhős gép a github.io-t és a docs.google.com-ot nem éri el, az élő próbát Endi vagy a pult végzi.

---

## (korábbi) BELÉPÉSI PONT — 2026-11-01 (a helyesírás-leckesor kész)

**A PR #2-ben (beolvasztásra vár):** az 5–11. lecke, legutóbb a **11. (gyakori tévesztések,** `helyesiras-tevesztesek.html`**)**,
28 új tollbamondás (összesen 44). **A tervezett 11 leckés helyesírás-sor teljes.** Tesztek: a 11 helyesírás-lecke mind hibátlan,
`helyesiras-check.js` 627/627.

**Lektori kör kész (2026-11-01):** az 5–11. lecke átnézve és javítva, a 9. lecke pontszámai helyesek.
**Szintfelmérő kész** (`helyesiras-szintfelmero.html`, a kezdőlapon a helyesírás-csoport elején), szintén a PR #2-ben.

**Javasolt folytatás:**
1. A PR #2 beolvasztása és élő ellenőrzés.
2. Ha megjött Kovrat chatje: hibastatisztika, és a 11. lecke + tollbamondások igazítása.
3. Python-folytatás (elágazás, ciklus, lista), ha az iskola odaér.

---

## (korábbi) BELÉPÉSI PONT — 2026-11-01 reggel

**A PR #2-ben (beolvasztásra vár):** az 5–10. lecke, legutóbb a **10. (a vessző,** `helyesiras-vesszo.html`**)**, 24 új tollbamondás
(összesen 40). Tesztek: a 10 helyesírás-lecke mind hibátlan, `helyesiras-check.js` 576/576.

**Következő:** a 11. lecke, gyakori tévesztések (muszáj, egyelőre / egyenlőre, mindig, kíváncsi, eggyel, stb., pl., az -e kérdőszó).
Ha megjött Kovrat chatje, előbb a hibastatisztika, és a 11. lecke abból épüljön.

---

## (korábbi) BELÉPÉSI PONT — 2026-11-01 hajnal

**A PR #2-ben (beolvasztásra vár):** az 5–9. lecke, legutóbb a **9. (kis- és nagybetű,** `helyesiras-nagybetu.html`**)**, 20 új
tollbamondás (összesen 36). Tesztek: a 9 helyesírás-lecke mind hibátlan, `helyesiras-check.js` 534/534.

**Következő:** a 10. lecke, a vessző (AkH 239–255.?). ⚠️ A pontszámokat egyben kérd le, és a kereszthivatkozásokkal ellenőrizd
(a 9. leckénél két kivonat 10-zel eltért). A 10. leckétől a tollbamondás kikapcsolhatja az írásjelek kimondását (terv).

---

## (korábbi) BELÉPÉSI PONT — 2026-11-01 késő éjjel

**A PR #2-ben (beolvasztásra vár):** az 5–8. lecke (hasonulások, felszólító mód, igekötők, **összetett szavak és számok**,
`helyesiras-osszetett.html`), 16 új tollbamondás (összesen 32). Tesztek: a 8 helyesírás-lecke mind hibátlan,
`helyesiras-check.js` 491/491.

**Következő:** a 9. lecke, nagy kezdőbetű és tulajdonnevek (AkH 140–205., válogatva). A pontokat előbb egyben kérd le.

---

## (korábbi) BELÉPÉSI PONT — 2026-11-01 éjjel

**A PR #2-ben (beolvasztásra vár):** az 5. (hasonulások), a 6. (felszólító mód) és a **7. lecke (igekötők,** `helyesiras-igekotok.html`**)**,
12 új tollbamondás (összesen 28), új hibatípusok: `hason`, `felsz`, `kotojel`. Tesztek: a 7 helyesírás-lecke mind hibátlan,
`helyesiras-check.js` 448/448.

**Következő:** 7/b (összetett szavak, számok: AkH 99–138., 291.) vagy 8. (nagy kezdőbetű). A pontokat előbb egyben kérd le.

---

## (korábbi) BELÉPÉSI PONT — 2026-11-01 este

**A PR #2-ben (beolvasztásra vár):** az 5. lecke (hasonulások) és a **6. lecke (felszólító mód,** `helyesiras-felszolito.html`**)**,
8 új tollbamondás (összesen 24), két új hibatípus (`hason`, `felsz`). Tesztek: a 6 helyesírás-lecke mind hibátlan (600/600 ×4,
480/480 ×2), `helyesiras-check.js` 402/402.

**Következő:** a 7. lecke, egybe- és különírás, **benne külön rész az igekötőkről** (Endi kérése). A pontokat (AkH 99–138.)
előbb egyben kérd le, és nézd meg az igekötők pontjait külön.

---

## (korábbi) BELÉPÉSI PONT — 2026-11-01 délután

**Élesben:** a 4. lecke (j vagy ly), PR #1, `25ed352`. **Kész, PR-ra vár** (`claude/dreamy-hopper-52jouj`, a `main`-ről újraindítva):
az 5. lecke (`helyesiras-hasonulasok.html`), 4 új tollbamondás (`H.TEXTS.hason` h1–h3, `vegyes` v5; összesen 20), új hibatípus
(`hason`), és a j/ly-lecke forrásának javítása (AkH 55., nem 51.).

**Tesztek:** `helyesiras-check.js` 354/354 · `lesson-test.js` 40-nel: hasonulások 600/600, j/ly 600/600, betűk 600/600,
magánhangzók 480/480, mássalhangzók 480/480, tollbamondások hibátlan · tollbamondás-próba 6/6 a jó csoportba.

**Döntésre vár:** a PR beolvasztása (Endi). Utána élőben ellenőrizni (`version.json`, a lecke).

**Javasolt folytatás:** 6. lecke: felszólító mód és tárgyas ragozás (játsszon, eddz, lássa, tanítsa, fusson; AkH 42–43., 54–57., 80–81.
— a pontszámokat előbb teljes listából ellenőrizd), vagy ha megjött a chat, előbb a hibastatisztika.
**Endi kérése (2026-11-01):** „Legyen nem elváló igekötők is majd.” → a 7. leckében (egybe-/különírás) külön rész az
igekötőkről (megcsinálom ↔ meg is csinálom, nem csinálom meg). ⚠️ Ha Endi külön leckét vagy a 6. leckébe szánta, kérdezd meg.

---

## 🧭 BELÉPÉSI PONT — 2026-11-01 (felhős próbafutás)

**Kész a `claude/dreamy-hopper-52jouj` ágon (nincs a `main`-ben, élesítésre vár):** a 4. helyesírás-lecke
(`helyesiras-j-ly.html`, forrás `tools/lessons/helyesiras-j-ly.src.html`) és 4 új tollbamondás (`H.TEXTS.jly` j1–j3, `vegyes` v4;
összesen 16). A közös modulban a `CAT.jly` a leckére mutat, a j/ly-normalizáló az lj/jj alakot is kezeli.

**Tesztek (2026-11-01):** `helyesiras-check.js` 293/293 · `lesson-test.js helyesiras-j-ly 40` 600/600, 390 px rendben, JS-hiba nincs ·
újrafuttatva a régiek: betűk 600/600, magánhangzók 480/480, mássalhangzók 480/480, tollbamondások hibátlan · tollbamondás-próba
szándékos j/ly-hibákkal: 7/7 a jó csoportba.

**Döntésre vár:** a `claude/dreamy-hopper-52jouj` ág beolvasztása a `main`-be (Endi igene a pulton át); utána élőben ellenőrizni
(`version.json`, a lecke és a tollbamondások linkje).

**Javasolt folytatás:** a 5. lecke (hasonulások), vagy ha megjött a chat, előbb a hibastatisztika. A felhőben a tesztelő:
`python3 -m http.server 8765 --bind 127.0.0.1 &` és `KOVRAT_URL=http://127.0.0.1:8765/ node tools/lessons/lesson-test.js <név> 40`.

---

## 🧭 BELÉPÉSI PONT — 2026-10-30

**Javasolt folytatás:** ha Endi kitette a Facebook-csevegést a `C:\KOVRAT\chat\` mappába, előbb a hibastatisztika
(`docs/helyesiras-hibak.md`, csak hibatípusok, a `H.classify` Node-ban fut), és ehhez igazítjuk a leckesorrendet és a
tollbamondásokat. Ha még üres: a 4. helyesírás-lecke (j vagy ly) a `docs/helyesiras-terv.md` szerint.

**Félretéve (a felhasználó választ):**
- Helyesírás 5–10. lecke: hasonulások, felszólító mód, egybe-/különírás, nagybetű, vessző, gyakori tévesztések.
- Python-folytatás (elágazás, ciklus, lista), ha az iskola odaér — a futtató és az ellenőrző kész.
- Kovrat válaszai a tanrendhez (mit használnak programozásórán, a tanár sorrendje, táblázatkezelés).

**Döntésre vár:** a helyi dokumentációs commitok pusholása (`4a513fd` és a lezárás commitja) — csak dokumentáció, az
oldalakat nem érinti; Endi igene kell (a pult kérdezi).

**Először olvasd:** `CLAUDE.md` „Magyar helyesírás” szakasz · `docs/helyesiras-terv.md` · `docs/LECKE-RECEPT.md` (a 2026. 10. 30-i helyesírás-szakasz).

**Figyelj:**
- A csevegés és belőle szó szerinti mondat **nem kerülhet a repóba** (nyilvános), és a `C:\KOVRAT\` mappán kívülre sem.
- Hiánypótlásnál a „rossz” pár ne legyen létező szó (épen, mellet, dobot, halak, kin — a lektor ezeket fogta meg).
- A szavakat ellenőrizd (az „öcs” egy cs-vel helyes); minden szöveget kétszer nézz át, a helyesiras-check.js-t futtasd.
- A modulban `K`-t használj, ne `window.K`-t (a `const K` nem window-tulajdonság).
