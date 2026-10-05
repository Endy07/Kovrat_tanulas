# Kovrat tanulás

Interaktív tanulási segédlet Kovratnak, a debreceni Mechwart András Gépipari és Informatikai Technikum 9. évfolyamos programozás szakos diákjának.

**Megnyitás:** https://endy07.github.io/Kovrat_tanulas/

## Leckék

| Lecke | Tartalom |
|---|---|
| [Kettes számrendszer](kettes-szamrendszer.html) | Kapcsolótábla, 9 magyarázó dia, magától lejátszódó levezetések (osztogatás, helyiértékek, kettesből tízesbe), 5 típusú gyakorlófeladat 3 szinten, puska |
| [Hármas, ötös, hatos, hetes számrendszer](szamrendszerek.html) | Választható alapszám (3/5/6/7), számláló átvitellel, 11 dia, az iskolai módszer (helyiérték-táblázat + kivonás + próba) és az osztogatás, felolvasott levezetések, 6 típusú gyakorlás 3 szinten (vegyes számrendszerekkel is), próbadolgozat érdemjeggyel, puska |

Minden lecke egyetlen önálló HTML-fájl, telepítés és build nélkül: böngészőben megnyitva működik.

## Hol tartunk (2026. 10. 05.)

- Kész: kettes számrendszer lecke, felolvasós levezetés-lejátszóval.
- Kész: hármas, ötös, hatos, hetes számrendszer lecke. Kovrat füzete alapján az iskolai módszert tanítja (helyiérték-táblázat, „hányszor fér bele”, próba).
- Következő lépés: **egész éves tanmenet** a 9. évfolyamra. Ehhez Kovrattól kell megtudni:
  - milyen programozási nyelvet tanulnak (Python? C#?),
  - milyen témák vannak az iskolai tanmenetben (programozás, weboldal-készítés HTML/CSS, hálózatok, hardver, számrendszerek…).
- Utána: leckék hetekre/hónapokra bontva, mindegyik ugyanebben a formában (magyarázó diák, lejátszott példák, gyakorlófeladatok), és felvéve az `index.html` listájába.

## Dokumentáció

| Fájl | Kinek |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Munkadokumentum: mit, hogyan és miért csináltunk |
| [`docs/LECKE-RECEPT.md`](docs/LECKE-RECEPT.md) | Lépésenkénti recept új leckéhez, minden eddigi buktatóval |
| [`PROJEKT-KONTEXTUS.md`](PROJEKT-KONTEXTUS.md), [`PROJEKT-RESZLETES.md`](PROJEKT-RESZLETES.md) | A Könyvjelzők-elemzőnek (projekt-besorolás) |

## Új lecke hozzáadása

1. Új önálló HTML-fájl a gyökérben (legyen benne `<meta charset="utf-8">`).
2. Link az `index.html` listájába és a fenti táblázatba.
3. Commit és push: a GitHub Pages 1–2 perc alatt frissül.
