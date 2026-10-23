# Leckék terve: mi jön, milyen sorrendben, miért

Készült: 2026-10-23 (éjszakai munka, 03:45–07:00). A pult bővítése szerint: „minden, ami egy 8.-os / 9.-es gyereknek kell”.
⚠️ Ez **feltételezés**: Kovrat válasza (mit vesznek most, a tanár sorrendje) felülírhatja.

## A sorrend elve

A legtöbbet érő, legkevésbé lefedett téma előbb. „Érték” = a 9.-es programtanterv óraszáma + mennyire épít rá
a későbbi anyag (10.-es Python, ágazati alapvizsga) + mennyire gyakorolható a gépen (nem tantermi, gyakorlati óra).
Elsőként a brief három témája jött (hálózatok, elektronika, JavaScript), utána a programtanterv lefedetlen 9.-es témái,
aztán a matek és a gondolkodás, végül a 10.-es előzetesek.

## A 2026-10-23-i leckék (mind kész és commitolva, push nélkül)

| # | Lecke | Fájl | Miért ez | Kezdőlap-csoport |
|---|---|---|---|---|
| 1 | Hálózatok alapjai | `halozatok-alapjai` | a brief első helye; a dolgok internete (8 óra) + a 10.-es hálózatos anyag alapja; ÉS a maszkkal | Második félév |
| 2 | Elektronika alapjai | `elektronika-alapjai` | a 9.-es informatikai alapok legnagyobb témaköre (28 óra) | Második félév |
| 3 | JavaScript-bevezető | `javascript-bevezeto` | a 9.-es programozás utolsó témája; elszigetelt futtató a közös készletben | Második félév |
| 4 | Algoritmusok és játékos programozás | `algoritmusok` | a 9.-es programozás első és legnagyobb témaköre (18 óra) | Első félév |
| 5 | A számítógép felépítése | `szamitogep-felepitese` | a tanrendben „tervezett” (december), 12 óra | Első félév |
| 6 | Virtualizáció és felhő | `virtualizacio-felho` | 15 óra a programtantervben | Második félév |
| 7 | Projektmunka: tervezés, csapat, prezentáció | `projektmunka` | a 9.-es IKT projektmunka (54 óra), eddig lefedetlen | Gondolkodás |
| 8 | Logikai fejtörők | `logikai-fejtorok` | a pult kérése („logikai feladatok”) | Gondolkodás |
| 9 | Oszthatóság, maradék, prímek, statisztika | `oszthatosag-statisztika` | 8.-os matek, a programozás `%` jele, euklideszi algoritmus | Előkészítés |
| 10 | Koordináták és függvények | `koordinatak-fuggvenyek` | 8.-os matek; CSS-pozicionálás, játékmozgás | Előkészítés |
| 11 | Halmazok | `halmazok` | a 9.-es matek első témája | Matek, 9. évfolyam |
| 12 | Algebrai kifejezések | `algebrai-kifejezesek` | 9.-es matek | Matek, 9. évfolyam |
| 13 | Egyenletek, egyenlőtlenségek, egyenletrendszerek | `egyenletek` | 9.-es matek, a 8.-os visszatekintésre épít | Matek, 9. évfolyam |
| 14 | Geometria | `geometria` | 8–9.-es matek, képernyő-példákkal | Matek, 9. évfolyam |
| 15 | Valószínűség és véletlen | `valoszinuseg` | 8–9.-es matek + véletlenszám a programozásban | Matek, 9. évfolyam |
| 16 | Programozási tételek | `programozasi-tetelek` | a 10.-es Python magja, nyelvfüggetlenül | Első félév |
| 17 | IT-biztonság alapjai | `it-biztonsag` | a 10.-es tanév legnagyobb informatikai témaköre (30 óra), és már most kell | Második félév |
| 18 | Linux parancssor | `linux-parancssor` | 10.-es témakör (18 óra), a Git mellé | Második félév |
| 19 | Ethernet, kapcsoló és IPv6 | `ethernet-ipv6` | 10.-es hálózatos témakörök (kapcsolás 20 óra, IPv6) | Második félév |
| 20 | Mesterséges intelligencia | `mesterseges-intelligencia` | 10.-es témakör (10 óra) | Második félév |
| 21 | Python-előzetes: kódolvasás | `python-elozetes` | a 10.-es Python alapjai, futtató nélkül | Második félév |
| 22 | Hang és videó digitalizálása | `hang-es-video` | digitális jelek, a szöveg és kép kódolása párja | Első félév |
| 23 | Digitális áramkörök | `digitalis-aramkorok` | logika + kettes számrendszer + elektronika; az ALU alapja | Első félév |
| 24 | Táblázatkezelés | `tablazatkezeles` | ⚠️ nem biztos, hogy tanulja (digitális kultúra / irodai alapok) | Digitális kultúra |
| 25 | Informatikai angol | `informatikai-angol` | minden eszköz, hibaüzenet és leírás angolul van | Digitális kultúra |
| 26 | Fájlok, mappák és a Windows | `windows-fajlkezeles` | a „Windows telepítése és konfigurációja” (15 óra) gépen gyakorolható része | Második félév |

Az 1–25. leckét a végén négy friss szemű lektor is átnézte (nyelv, szakmai és matematikai helyesség); a javítások
a `d6e7a7a` commitban vannak.

## Nyitott apróságok (a lektorok jelezték, nem sürgős)

- **Felolvasás:** szám vagy mértékegység utáni toldalék hibásan hangzik („10 A-t”, „B3-tól”); a felolvasó-szabály nem kezeli.
- **MI:** az élő k-NN síkon, ha a diák maga rak le pontokat, döntetlen előfordulhat; ilyenkor jelzés nélkül a sorrend dönt.
- **Programozási tételek:** az „eldöntés” és a „lineáris keresés” a „Van-e…?” kérdésnél mindkettő védhető; most az eldöntés
  a jó válasz (a szokásos tanítási megkülönböztetés). Endi döntse el.
- **Linux:** a játék-terminálban az `echo szia>f.txt` szóköz nélkül nem működik, a `cp`/`mv` nem létező célmappába is másol;
  a „Hol leszel?” feladat néha furcsa utat generál (iskola/iskola), de helyesen számol.
- **Egyenletek:** 1-es együtthatónál egy megoldássor kétszer ugyanazt írja; a könnyű „Melyik lépés hibás?” gyöke 0 is lehet.
- **Koordináták:** a grafikonos feladatok rajzát gépi teszt nézte, ember nem.
- **Projektmunka:** a Kanban, Scrum, SMART és konfliktuskezelés tartalmát forrással nem vetettük össze.

## Később (ha lesz idő, vagy Kovrat válasza alapján)

- **Python-leckék futtatóval a 10. évfolyamra** a [`tanrend-10.md`](tanrend-10.md) szerint. Döntés kell: Pyodide CDN-ről
  (kb. 10 MB az első megnyitáskor, külső függőség) vagy saját, kis Python-részhalmaz-értelmező.
- **IT-biztonság II.** (kártevők elemzése, titkosítás mélyebben, tűzfal-szabályok), **SQL-alapok** (11. évfolyam).
- Szándékosan kimarad: PC-összeszerelés, nyomtató, laptop, Windows-telepítés, otthoni hálózat építése (tantermi, gyakorlati).
