# Kovrat tanulás — hogyan dolgozunk

## A lánc lépésről lépésre

1. **Téma kiválasztása.** A téma az iskolai tanmenetből jön, vagy abból, amiben Kovrat éppen
   segítséget kér (így indult a kettes számrendszer lecke).
2. **Tartalom megtervezése** egy bevált ötrészes szerkezetben:
   - interaktív „hero” elem, ami rögtön kipróbálható,
   - 8–10 lapozható magyarázó dia, benne saját bemenettel és lépésenkénti léptetéssel,
   - levezetés-lejátszó, ami a példákat lassan, magától, felolvasással játssza le, és kézzel is léptethető,
   - gyakorlófeladatok véletlen generálással, azonnali ellenőrzéssel és célzott hibaüzenettel,
   - puska.
3. **Elkészítés egyetlen önálló HTML-fájlként:** inline CSS és JS, betűk a Google Fontsról,
   nincs függőség.
4. **Előnézet** claude.ai artifactként, ellenőrzés helyben (XAMPP).
5. **Publikálás** nyilvános GitHub repóba, GitHub Pages-en. Kovrat egy linket kap.

## Miért így (a döntések)

- **Egyfájlos HTML vs. keretrendszer:** ugyanannak a fájlnak kell futnia három helyen
  (claude.ai előnézet, helyi szerver, GitHub Pages). Build és függőség nélkül semmi nem avul el.
- **Böngészős felolvasás vs. előre felvett hangfájlok:** bármilyen saját számra működik,
  és nincs mit tárolni. Az ára, hogy a hang minősége a böngészőtől függ.
- **Generált feladatok vs. fix feladatsor:** végtelenül gyakorolható, a válaszok nem tanulhatók meg.
- **Célzott hibaüzenetek:** a tipikus hibákat a program felismeri (pl. fordított sorrendben
  olvasott maradékok), és megnevezi őket. Egy kezdőnek a puszta „rossz” nem segít.
- **Lejátszó előre generált pillanatképekkel:** minden lépés teljes állapotként van eltárolva,
  ezért a visszaléptetés triviális és hibamentes.

## Ahol most fáj (ide keresünk jobb megoldást)

- **A felolvasás minősége eszközfüggő:** Chrome-ban csak akkor van magyar hang, ha a
  Windowsra telepítve van a magyar beszédcsomag. Edge-ben jó. Kellene egy megbízható,
  ingyenes, böngészőben futó magyar TTS, szerver nélkül.
- **A magyar toldalékolás dinamikus szövegben:** a számok utáni ragok hangrendfüggők
  („13-ba”, de „45-be”). Most átfogalmazással kerüljük meg a problémát. Egy kis, megbízható
  JS-függvény a számnevek toldalékolására jól jönne.
- **A tanmenet ismeretlen:** az iskola saját tanmenete nem nyilvános.
- **Programozós leckékhez böngészőben futó Python kellene** (pl. Pyodide-szerű megoldás),
  ha Pythont tanulnak. Ez még nincs kipróbálva.
- **Nincs tanári vagy szülői visszajelzés** arról, hol tart a diák. A haladás csak az ő
  böngészőjében van (localStorage).

## Kizárt utak (ne ajánld)

- **Fizetős vagy bejelentkezős platformok:** a diák egy linkre kattintva, fiók nélkül érje el.
- **Keretrendszer és build-lánc** (React, bundler): egy tanulási oldalhoz fölösleges bonyolítás,
  és megtörné az egyfájlos, bárhol futó modellt.
- **Nyomtatott vagy PDF anyag elsődleges formaként:** a felhasználó az interaktív változatot választotta.

## Vaskorlátok

- Statikus hoszting (GitHub Pages): nincs szerveroldali kód, nincs adatbázis.
- Célközönség: 14–15 éves kezdő diák, magyar nyelv, telefon és asztali gép is.
- A böngészőn kívül semmi nem telepíthető a diák gépére.
- A tartalomnak a magyar szakképzési programtantervhez kell igazodnia
  (informatika és távközlés ágazat, 9–10. évfolyam, ágazati alapvizsga).
