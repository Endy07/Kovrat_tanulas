# Kovrat tanulás

Interaktív tanulási segédlet Kovratnak, a debreceni Mechwart András Gépipari és Informatikai Technikum 9. évfolyamos programozás szakos diákjának.

**Megnyitás:** https://endy07.github.io/Kovrat_tanulas/

## Leckék

A kezdőlapról az **[éves tanrend](tanrend.html)** is elérhető: hónapról hónapra, melyik témához van már lecke.

| Lecke | Tartalom |
|---|---|
| [Visszatekintés a 8. osztályra](8-visszatekintes.html) | Hatványok, normálalak, törtek, százalék, arány, egyenletek, adatmennyiség: a 9.-es anyag alapjai. 9 dia, 3 levezetés, 6 feladattípus, próbadolgozat |
| [Kettes számrendszer](kettes-szamrendszer.html) | Kapcsolótábla, 9 magyarázó dia, magától lejátszódó levezetések (osztogatás, helyiértékek, kettesből tízesbe), 5 típusú gyakorlófeladat 3 szinten, puska |
| [Hármas, ötös, hatos, hetes számrendszer](szamrendszerek.html) | Kovrat füzetének példái (876 → ötös, hármas, hetes) kockás lapon lépésenként, befejezve, választható alapszám (3/5/6/7), számláló átvitellel, 11 dia, az iskolai módszer (helyiérték-táblázat + kivonás + próba) és az osztogatás, felolvasott levezetések, 6 típusú gyakorlás 3 szinten (vegyes számrendszerekkel is), próbadolgozat érdemjeggyel, puska |
| [Tizenhatos számrendszer](tizenhatos-szamrendszer.html) | Négy lámpa egy jegy, átváltás tízes, kettes és tizenhatos között, színkódok |
| [Logikai műveletek](logikai-muveletek.html) | NEM, ÉS, VAGY, KIZÁRÓ VAGY, igazságtábla, bitenkénti műveletek, Python-feltételek |
| [Szöveg és kép kódolása](szoveg-es-kep.html) | ASCII, Unicode, UTF-8, pixelek, színmélység, képméret, tömörítés (RLE), Caesar- és Vigenère-kód |
| [HTML alapok](html-alapok.html) | Élő szerkesztő, az oldal váza, címsorok, linkek, képek, listák, táblázatok, hibakeresés |
| [CSS alapok](css-alapok.html) | Szelektorok, színek, dobozmodell, display és position, melyik szabály nyer |
| [Git és GitHub alapok](git-alapok.html) | Munkamappa, staging, commit, ág, GitHub; parancsok beírása |
| [Reszponzív weboldalak](reszponziv-weboldalak.html) | Viewport, media query, relatív mértékegységek, flex és grid, Bootstrap-rács; szélességállítható előnézet, kódolós feladatok több ablakszélességen ellenőrizve |

Minden lecke egyetlen önálló HTML-fájl, telepítés és build nélkül: böngészőben megnyitva működik. (A forrásuk a `tools/lessons` mappában van, onnan állítja elő a `node tools/lessons/build.js`.)

## Hol tartunk (2026. 10. 22.)

- Kész: az **éves tanrend** (`docs/tanrend-9.md`, `tanrend.html`) az országos programtanterv alapján. Biztos: tantárgyak, óraszámok, témák. Becslés: a hónapokra bontás (az iskola tanmenete nem nyilvános).
- Kész: 10 lecke (a két számrendszeres és a nyolc új), mind felolvasós levezetéssel, 3 szintű feladatokkal és próbadolgozattal.
- Kész: automatikus frissítés (`version.json` + pre-commit hook; új klónnál `git config core.hooksPath .githooks`).
- A **programtanterv szerint a 9.-ben nincs Python**: játékos kódolás, HTML, CSS, Git, reszponzív oldal, JavaScript-bevezető. A Python a 10. évfolyamon jön.
- Következő: JavaScript-bevezető, hálózatok. Kovrat válaszai alapján igazítjuk a tanrendet (mit használnak programozásórán, mi a tanár sorrendje).

## Dokumentáció

| Fájl | Kinek |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Munkadokumentum: mit, hogyan és miért csináltunk |
| [`docs/LECKE-RECEPT.md`](docs/LECKE-RECEPT.md) | Lépésenkénti recept új leckéhez, minden eddigi buktatóval |
| [`docs/tanrend-9.md`](docs/tanrend-9.md) | Az éves tanrend forrásokkal (biztos / feltételezés) |
| [`PROJEKT-KONTEXTUS.md`](PROJEKT-KONTEXTUS.md), [`PROJEKT-RESZLETES.md`](PROJEKT-RESZLETES.md) | A Könyvjelzők-elemzőnek (projekt-besorolás) |

## Új lecke hozzáadása

1. Új forrás: `tools/lessons/<név>.src.html` (a többi lecke mintájára), `node tools/lessons/build.js <név>`.
2. Link az `index.html` listájába, a `tanrend.html` forrásába és a fenti táblázatba.
3. Commit és push: a GitHub Pages 1–2 perc alatt frissül.
