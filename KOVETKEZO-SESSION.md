# Következő session

## 🧭 BELÉPÉSI PONT — 2026-11-01 éjjel

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
