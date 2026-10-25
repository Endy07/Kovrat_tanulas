# Kovrat tanulás — hogyan dolgozunk

## A lánc lépésről lépésre

1. **Téma és módszer kiderítése.** A téma az iskolai tanmenetből jön, vagy abból, amiben Kovrat
   éppen segítséget kér. A felhasználó (Endi) lefotózza Kovrat füzetét. Ebből derül ki, **milyen
   módszerrel** tanítják az iskolában, és hol akadt el Kovrat. (A 2. leckénél így derült ki, hogy
   nem osztogatással, hanem hatványtáblázattal és kivonással váltanak számrendszert.)
2. **Tartalom megtervezése** a bevált szerkezetben:
   - interaktív „hero” elem, ami rögtön kipróbálható,
   - „Endi mondja”: a felhasználó saját magyarázata, az ő szavaival,
   - a füzet példái kockás füzetlapon, pontosan a füzet formájában, befejezve, ami félbemaradt,
   - a füzet feladatai részletesen, szavakkal és ábrákkal,
   - 9–11 lapozható magyarázó dia saját bemenettel és lépésenkénti léptetéssel,
   - levezetés-lejátszó felolvasással, kézzel is léptethető,
   - gyakorlófeladatok véletlen generálással, célzott hibaüzenettel és próbadolgozattal,
   - puska.
3. **Elkészítés egyetlen önálló HTML-fájlként:** inline CSS és JS, betűk a Google Fontsról.
4. **Ellenőrzés:** JS szintaxis `node --check`-kel, aztán automatizált böngészős teszt
   (`tools/lessons/lesson-test.js`, headless, néma): hibák, minden feladattípus × szint, telefonszélesség, sötét téma;
   ahol lehet, a generált feladatok független újraszámolása is.
5. **Publikálás** nyilvános GitHub repóba, GitHub Pages-en. Egy pre-commit hook verziót ír minden
   oldalba, az oldalak pedig maguktól újratöltenek, ha van újabb változat. Kovrat egy linket kap.

## Miért így (a döntések)

- **Az iskolai módszer az elsődleges:** ha mást tanítunk, mint az órán, összezavarjuk a diákot.
  A füzet formáját is egy az egyben átvesszük (táblázat, „ezek lehetnek”, bekarikázott alap, próba).
- **Egyfájlos HTML vs. keretrendszer:** ugyanannak a fájlnak kell futnia helyi szerveren, GitHub
  Pagesen és claude.ai előnézetben. Build és függőség nélkül semmi nem avul el.
- **Egy lecke több alapszámra, választóval:** ugyanaz a módszer, egy helyen javítható, és vegyes
  gyakorlás is lehet.
- **Böngészős felolvasás vs. hangfájlok:** bármilyen számra működik, nincs mit tárolni.
- **Generált feladatok vs. fix feladatsor:** végtelenül gyakorolható.
- **Célzott hibaüzenetek:** a tipikus hibákat (fordított sorrend, kimaradt 0, hatvány helyett
  szorzás) a program felismeri és megnevezi.
- **Lejátszó előre generált pillanatképekkel:** a visszaléptetés triviális és hibamentes.
- **Automatikus frissítés:** a GitHub Pages és a mobilböngésző gyorsítótáraz; a diák nem fog
  kézzel frissíteni. Egy `version.json` és egy pre-commit hook oldja meg, a verziót gép állítja.
- **Magyar toldalékolás szótárból:** a számrendszernevek és szorzószavak ragozása hangrendfüggő
  (hármasban, de ötösben). Összefűzés helyett előre megírt alakokat használunk.

## Ahol most fáj (ide keresünk jobb megoldást)

- **A felolvasás minősége eszközfüggő:** Chrome-ban csak telepített magyar beszédcsomaggal van
  magyar hang. Kellene egy megbízható, ingyenes, böngészőben futó magyar TTS, szerver nélkül.
- **Számok utáni toldalékok dinamikus szövegben** („13-ba”, de „45-be”): most átfogalmazással
  kerüljük meg. Egy megbízható JS-függvény a számnevek toldalékolására jól jönne.
- **A GitHub Pages a GitHub Actions-ön fut:** Actions-zavarnál az oldal órákig nem frissül, és
  a megszakadt építéseket kézzel kell újraindítani.
- **A tanmenet becslés:** az országos programtanterv alapján van éves tanrend (`docs/tanrend-9.md`), de az iskola saját
  sorrendje nem nyilvános; Kovrat válaszai igazítanak rajta. A programtanterv szerint a 9.-ben nincs Python, de a Mechwartban
  van: 2026 októberében Python-dolgozat (változók, műveletek, beépített függvények, szövegek).
- **Python a böngészőben (2026-10-25 óta kész):** Pyodide 0.27.7 a jsDelivr CDN-ről, egy Web Workerben, csak a Python-dolgozat
  leckén és csak az első futtatáskor töltődik be (kb. 10 MB). Az `input()` a „Bemenetek” mezőből olvas; a végtelen ciklust
  6 mp után a worker leállítása szakítja meg. Ha nem tölt be (nincs net, tiltó böngésző), a mintamegoldások és a példafutások
  akkor is láthatók. A JavaScript-futtató 2026-10-23 óta kész (`sandbox="allow-scripts"` iframe, `postMessage`).
- **Sok lecke gyorsan:** 2026-10-23 éjjel párhuzamos alügynökök írták a leckéket, a fő session illesztette össze. A minőséget
  a gépi, néma leckeellenőrző (`tools/lessons/lesson-test.js`) és leckénként egy független ellenőrzés (valódi Python,
  `ipaddress`, nyers erő) tartja; a szöveg nyelvhelyességét emberi szem még nem nézte át mindenhol.
- **Közös leckekészlet:** a leckék forrása `tools/lessons`, egy kis node-szkript állítja elő belőle az önálló HTML-t
  (új lecke = egy forrásfájl + a közös diák/lejátszó/gyakorló modulok).
- **Nincs visszajelzés arról, hol tart a diák:** a haladás csak az ő böngészőjében van.

## Kizárt utak (ne ajánld)

- **Fizetős vagy bejelentkezős platformok:** a diák egy linkre kattintva, fiók nélkül érje el.
- **Keretrendszer és build-lánc** (React, bundler): fölösleges, és megtörné az egyfájlos modellt.
- **Nyomtatott vagy PDF anyag elsődleges formaként:** a felhasználó az interaktívat választotta.
- **Magyarázó videó a leckék helyett:** az interaktív oldal többet ér, a lejátszó amúgy is
  felolvasott, lépésenkénti magyarázat.

## Vaskorlátok

- Statikus hoszting (GitHub Pages): nincs szerveroldali kód, nincs adatbázis.
- Nyilvános repó: személyes anyag (füzetfotók) nem kerülhet bele.
- Célközönség: 14–15 éves kezdő diák, magyar nyelv, főleg telefon.
- A böngészőn kívül semmi nem telepíthető a diák gépére.
- A tartalomnak az iskolai módszerhez és a magyar szakképzési programtantervhez kell igazodnia
  (informatika és távközlés ágazat, 9–10. évfolyam, ágazati alapvizsga).
