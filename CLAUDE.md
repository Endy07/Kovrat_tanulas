# Kovrat tanulás — munkadokumentum

Interaktív tanulási segédlet Kovratnak, a felhasználó unokaöccsének. Kovrat 2026 szeptemberétől
9. évfolyamos a **Debreceni SZC Mechwart András Gépipari és Informatikai Technikumban**,
programozás (szoftverfejlesztő és -tesztelő) szakon, az informatika és távközlés ágazatban.
A 9–10. évfolyam ágazati alapoktatás, ami a 10. év végén **ágazati alapvizsgával** zárul.

- **Élő oldal:** https://endy07.github.io/Kovrat_tanulas/
- **Repó:** https://github.com/Endy07/Kovrat_tanulas (nyilvános, `main` ág, GitHub Pages a gyökérből)
- **Helyi mappa:** `C:\xampp\htdocs\Kovrat` → http://localhost/Kovrat/
- **claude.ai artifact (privát előnézet):** https://claude.ai/artifact/73Srdce3jbkXjNaefdA8Gk

**Új leckénél először olvasd el:** [`docs/LECKE-RECEPT.md`](docs/LECKE-RECEPT.md). Abban van a
lépésenkénti menet és minden eddigi buktató.

## Fájlok

| Fájl | Mi ez |
|---|---|
| `index.html` | Kezdőlap, a leckék listája. **Minden új leckét fel kell venni ide.** |
| `kettes-szamrendszer.html` | 1. lecke: kettes számrendszer (kész) |
| `szamrendszerek.html` | 2. lecke: hármas, ötös, hatos, hetes, választható alapszámmal, próbadolgozattal (kész) |
| `szamrendszerek/` | Kovrat füzetének fotói (nincs commitolva, a repó nyilvános). Ebből derült ki az iskolai módszer: helyiérték-táblázat + „hányszor fér bele” + kivonás + próba |
| `README.md` | GitHubos leírás + „Hol tartunk” szakasz |
| `docs/LECKE-RECEPT.md` | Runbook: hogyan készül egy lecke hibamentesen |
| `PROJEKT-KONTEXTUS.md`, `PROJEKT-RESZLETES.md` | A Könyvjelzők-elemző olvassa. **Nem** munkadokumentum. |

## Döntések és indokaik

| Döntés | Miért |
|---|---|
| **Interaktív weboldal** a nyomtatott füzet vagy doksi helyett | A felhasználó választotta. Telefonon is megy, és azonnal ellenőrzi a feladatokat. |
| **Minden lecke egyetlen önálló HTML-fájl** (inline CSS/JS, nincs build, nincs keretrendszer) | Egyszerre kell futnia három helyen: claude.ai artifactként, localhoston (XAMPP) és GitHub Pagesen. Nincs függőség, ami elromolhat. |
| **Nyilvános repó + GitHub Pages** | Kovrat egy egyszerű linken, fiók és megosztás nélkül eléri. A felhasználó választotta. |
| **Felépítés: diák → lejátszott levezetések → gyakorlás → puska** | Előbb megérti, aztán végignézi, aztán maga csinálja. A felhasználó kérte a diákat, a lassú, magától lejátszódó és kézzel is léptethető levezetést, és a felolvasást. |
| **Véletlen generált feladatok** fix feladatsor helyett | Végtelenül gyakorolható, és nem lehet megtanulni a válaszokat. |
| **Célzott hibaüzenetek** (pl. „fordítva olvastad a maradékokat”) | Egy 9.-esnek az „rossz” szó önmagában nem segít. A tipikus hibát fel kell ismerni és meg kell nevezni. |
| **Felolvasás a böngésző Web Speech API-jával**, nem hangfájlokkal | Bármilyen saját számra működik, és nincs mit hosztolni. Ára: a hang a böngészőtől függ (Edge-ben a legjobb). |
| **localStorage** csak kényelmi adatra (legjobb sorozat, felolvasás be/ki) | Nincs szerver. Try/catch-ben van, mert privát ablakban elszállhat. |

## Menet egy lecke elkészítéséhez (röviden, a részletek a receptben)

1. A lecke egyetlen HTML-fájl a gyökérben, a meglévő lecke tokenjeivel, betűivel és komponenseivel.
2. Beépített JS szintaxis-ellenőrzése `node --check`-kel (a parancs a receptben van).
3. Publikálás claude.ai artifactként előnézetnek: `Artifact` tool, **mindig ugyanazzal a fájlúttal**, így ugyanazon az URL-en frissül.
4. Felvétel az `index.html`-be és a README táblázatába.
5. Commit és push. A Pages 1–2 perc alatt frissül.

## Nyitott / következő

- **Egész éves tanmenet: FÜGGŐBEN.** A felhasználó megkérdezi Kovratot, milyen nyelvet tanulnak
  (Python? C#?) és milyen témák vannak. Az iskola saját tanmenete az interneten nem található.
  Az országos programtanterv alapján 9.-ben valószínű a Python-alapok és a HTML/CSS
  weboldal-készítés, de ez **feltételezés**, nem ellenőrzött tény.
- Ha megvan a válasz: brainstorming → tanmenet-spec (hetekre/hónapokra) → leckék egyenként.
- Egy 1–2 perces magyarázó videó is szóba került. A gépen telepítve van a **hyperframes** és a
  **videouse**, de egyelőre nem kellett.

## Munkastílus a felhasználóval

- Magyarul, ékezethelyesen kommunikálunk. A teendőket `TEENDŐ MOST:` / `TEENDŐ:` / `HALASZTVA:`
  jelölővel, sor elején írjuk (globális CLAUDE.md).
- A felhasználó gyors, gyakorlati eredményt vár. Ha pontosan megmondja, mit kér, nem kérdezünk
  vissza fölöslegesen. Valódi döntésnél (pl. nyilvános vagy privát repó) viszont rákérdezünk.
- Kifelé ható lépés (repó létrehozása, nyilvánossá tétel) előtt jóváhagyást kérünk.
