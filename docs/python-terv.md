# Python a nulláról, Kovratnak: terv

Endi kérése (2026. 11. 01., a pulton át): „utána egy pythonos kellene, nem tudom az hogy áll, de teljesen az alapoktól
kellene magyarázni, meg példák, gyakorló feladatok, mindent.”

Jelölés: ✅ biztos (forrással igazolva) · ⚠️ feltételezés (Kovrat vagy az iskola tudná megmondani).

## Mire építünk

- ✅ **A Mechwartban a Python már a 9. évfolyamon megy.** Kovrat októberben Python-dolgozatot írt; a gyakorló feladatsor
  (52 feladat) témái: változók, `input()`, `int()`/`float()`, műveletek (`/ // % **`, `+=`), `round`, `max`, `min`, `abs`,
  szövegek (`+`, `*`, `len`, index, `in`), metódusok (`upper`, `lower`, `strip`, `count`, `replace`), és **minden eredményt
  f-stringgel** kell kiírni. Elágazás és ciklus abban még nem volt (`docs/tanrend-9.md`, 2026-10-25).
- ✅ Az országos programtanterv a Pythont a 10.-re teszi (4 + 48 + 20 óra, `docs/tanrend-10.md`): `print`, literálok és típusok,
  típuskonverzió, operátorok, rövidített értékadás, `input`, sztringek, relációk, `if`/`elif`/`else`, `while`, `for`, listák,
  függvények; utána modulok, kivételek, fájlkezelés. A sorozat ezt a sorrendet követi, a Mechwart tempójában (9.-ben).
- ✅ **Az iskolában VS Code-ban dolgoznak** (Endi, 2026-11-01). A leckék a böngészőben futtatnak, de a 3. leckétől külön dia és
  levezetés mutatja, hogyan megy ugyanez a VS Code-ban: a `.py` fájl futtatása (▶ Run Python File, vagy `python program.py`), a
  terminál kimenete, a bekérés a terminálban, és a hibaüzenet (Traceback) ott.
- ✅ Nem tudjuk, volt-e már `if` az iskolában; Endi: „menjen az alapoktól”. A sorozat semmit nem tételez fel.
- ⚠️ Nem tudjuk a tanár sorrendjét az elágazástól kezdve. Ha Kovrat füzete vagy egy újabb feladatsor megjön, a 5–10. lecke
  sorrendjét és jelöléseit ahhoz igazítjuk (a recept 0. szakasza: az iskolai módszert tanítjuk).

### Kapcsolat a meglévő két Python-leckével

| Lecke | Mi ez | Viszonya a sorozathoz |
|---|---|---|
| `python-elozetes` (2026-10-23; 2026-11-01-től „Python – gyors áttekintés”) | Kódolvasás futtató nélkül: egy-egy dia az összes alapfogalomról (változó, `if`, `for`, `while`, lista, függvény). | **Áttekintés, nem tananyag.** A sorozat minden fogalmát lassabban, részletesebben, futtatóval tanítja. Nem módosítjuk; a jelölése (`print`, `range(5)` → 0…4, 4 szóköz behúzás) egyezik a sorozattal. A címkéje 2026-11-01-én Endi kérésére „Python – gyors áttekintés” lett (a „10. évfolyam” kikerült). |
| `python-dolgozat` (2026-10-25) | Dolgozatra készítő ismétlés: a gyakorló feladatsor 52 feladata, próbadolgozat. | **A sorozat 1–4. és 9. leckéjének ismétlője.** Ugyanaz a futtató (Pyodide 0.27.7, Web Worker), ugyanaz a bemenet-kezelés és a magyar hibatipp; a fogalmak és a szavak ugyanazok (bekérés, kiírás, típusváltás, f-string). A dolgozat-lecke nem változik; a sorozat leckéi a végükön linkelnek rá („Ha ez megy: próbadolgozat”). |

**Ellentmondás nincs, mert:** a sorozat is f-stringgel írja ki az eredményt, amint a 2. leckében bevezeti (az 1. leckében még
csak `print("…")` és vessző van, mert az f-stringhez változó kell); a `/` mindig tizedes törtet ad; az index 0-tól indul; a
hibaüzeneteket ugyanazzal a magyar tippel magyarázzuk.

**Átfedés:** az 1–4. lecke témája a dolgozat-leckében is megvan, de ott tömörítve, a dolgozat feladatain át. A sorozat a
„miért”-et adja (mi a változó, miért szöveg az `input`), sok apró lépéssel; a dolgozat-lecke a „vizsga”. Új feladatsablonok
készülnek, a dolgozat 52 feladatát nem másoljuk át.

## A leckesor és a sorrend indoka

A sorrend elve: **egy új fogalom leckénként**, és minden lecke csak a korábbiakat használja. Az 1–4. a dolgozat anyaga
(azonnal hasznos), az 5–8. a vezérlés (elágazás, ciklus, lista), a 9–10. a szövegek mélyebben és a saját függvény.

| # | Lecke | Fájl | Fogalmak | Állapot |
|---|---|---|---|---|
| 1 | **Mi a program? A `print`** | `python-1-kiiras` | program, utasítás, sorrend, `print`, szöveg (idézőjel) és szám, több érték vesszővel, üres `print()`, megjegyzés `#`, egyszerű számolás, a hibaüzenet részei | ✅ kész (2026. 11. 01.) |
| 2 | **Változók és típusok** | `python-2-valtozok` | értékadás (`=` jobbról balra), felülírás, `x = x + 1`, névszabályok, `int` `float` `str` `bool`, `type()`, `"5"` ↔ `5`, `int()` `str()` `float()`, f-string | ✅ kész (2026. 11. 01.) |
| 3 | **Adatbekérés: `input` és a típusváltás** | `python-3-input` | `input()` mindig szöveg, `int(input())`, `float(input())`, a kérdező szöveg, több bemenet, a program váza (bekérés → számolás → kiírás), `ValueError`, a VS Code terminálja | ✅ kész (2026. 11. 01.) |
| 4 | **Műveletek és beépített függvények** | `python-4-muveletek` | `+ - * / // % **`, a műveleti sorrend, zárójel, `+=` `-=` `*=`, `round`, `abs`, `max`, `min`, maradékos osztás a gyakorlatban (perc → óra, páros-páratlan), a Python mint számológép a VS Code-ban | ✅ kész (2026. 11. 01.) |
| 5 | **Feltételek: `if`, `elif`, `else`** | `python-5-elagazas` | összehasonlítás (`== != < > <= >=`), `True`/`False`, `if`, kettőspont és behúzás, `else`, `elif`, `and` `or` `not`, egymásba ágyazás | ✅ kész (2026. 11. 01.) |
| 6 | **Ismétlés feltétellel: `while`** | `python-6-while` | ciklusfeltétel, ciklusváltozó, számláló és gyűjtő (`osszeg += x`), bekérés addig, amíg jó nem lesz, végtelen ciklus és megállítása, `break` | ✅ kész (2026. 11. 01.) |
| 7 | **Számlálós ciklus: `for` és `range`** | `python-7-for` | `range(n)`, `range(a, b)`, `range(a, b, lépés)`, a záró érték nincs benne, összegzés és megszámlálás `for`-ral, `for` szövegen | tervezett |
| 8 | **Listák** | `python-8-listak` | lista létrehozása, index (0-tól, `-1`), `len`, `append`, bejárás `for`-ral, `sum` `max` `min`, a programozási tételek Pythonban (összegzés, megszámlálás, maximum, keresés, kiválogatás) | tervezett |
| 9 | **Szövegek mélyebben** | `python-9-szovegek` | index és szelet (`s[1:4]`), `len`, `in`, metódusok (`upper` `lower` `strip` `count` `replace` `split`), bejárás karakterenként, a szöveg nem módosítható | tervezett |
| 10 | **Saját függvények** | `python-10-fuggvenyek` | `def`, paraméter, `return` vs. `print`, alapértelmezett érték, a függvény újrahasznosítása, helyi változó | tervezett |
| + | **Ismétlő próbadolgozat (később)** | – | vegyes feladatlap az 1–10. leckéből, a dolgozat-lecke mintájára | ötlet |

A 10.-es tanterv további része (modulok: `math`, `random`; kivételkezelés; fájlkezelés; az OOP alapjai) a sorozat után jöhet,
ha az iskola odaér.

## Minden lecke váza

- **Hero:** futtató (Python a böngészőben, bemenetekkel), a lecke egy jellemző programjával.
- **Diák (10–13):** egyszerű, kezdőnek szóló magyarázat; minden dián futtatható példa „▶ Kipróbálom” gombbal.
- **Levezetések (2–4):** a gép sorról sorra: a sárga sor fut, alatta a változók és a kimenet. Felolvasással.
- **Gyakorlás (4–6 típus × 3 szint, próbadolgozat):** mindig van „Mit ír ki?”, „Írd meg!” (gépi ellenőrzéssel), és hibás
  programmal kapcsolatos feladat („Milyen hibát ad?”, „Javítsd ki!”).
- **Hibaüzenetek:** külön dia a lecke tipikus hibáiról; a futtató minden Python-hibához magyar tippet ad (a hibaüzenet angol
  marad, mert a gépen is az lesz).
- **Puska** és link a következő leckére, az 1–4. leckéből a dolgozat-leckére is.

## Leckénként: cél, fogalmak, tipikus hibák, feladattípusok

### 1. Mi a program? A `print`

- **Cél:** tudja, hogy a program utasítások sora, amelyet a gép fentről lefelé, szó szerint hajt végre; ki tudjon írni szöveget
  és számot; el tudja olvasni a hibaüzenetet (melyik sor, milyen hiba).
- **Fogalmak:** program, utasítás, futtatás, kimenet; `print("…")`; szöveg idézőjelben (`"` vagy `'`), szám idézőjel nélkül;
  `print(2 + 3)` ↔ `print("2 + 3")`; több érték vesszővel (közéjük szóköz kerül); üres `print()`; megjegyzés `#`;
  `+ - * /` (a `/` eredménye tizedes tört: `10 / 2` → `5.0`); hibaüzenet: sor, típus, üzenet.
- **Tipikus hibák:** hiányzó záró zárójel vagy idézőjel (`SyntaxError`); idézőjel nélküli szöveg (`NameError: name 'Szia'`);
  nagybetűs `Print` (`NameError`); szóköz a sor elején (`IndentationError`); vessző és szóköz: `print("Szia","Anna")` szóközt tesz;
  „okos” idézőjel (`„…”`) a Wordből (`SyntaxError`).
- **Feladattípusok:** Mit ír ki? · Írd meg! (pontosan ezt írja ki; a gép betűre összeveti) · Milyen hibát ad? (a gép valódi
  Pythonnal ellenőrzi) · Javítsd ki! (hibás programot kap, a kimenetnek egyeznie kell).

### 2. Változók és típusok

- **Cél:** értse, hogy a változó egy név, amely egy értékre mutat, és az értékadás jobbról balra megy; tudja a négy alaptípust,
  és tudja, mi történik, ha szöveget és számot kever; f-stringgel írjon ki.
- **Fogalmak:** `nev = "Anna"`, `kor = 15`; az `=` nem egyenlőség, hanem értékadás; felülírás; `x = x + 1`; névszabályok
  (betűvel vagy `_`-sal kezdődik, nincs benne szóköz és kötőjel, a kis- és nagybetű számít, foglalt szó nem lehet; ékezet ne
  legyen benne); `int`, `float`, `str`, `bool`; `type()`; `"5" + "5"` → `55`, `5 + 5` → `10`, `"ha" * 3`; `int("5")`, `str(5)`,
  `float("2.5")`; f-string: `f"{nev} {kor} éves"`; két változó cseréje.
- **Tipikus hibák:** használat értékadás előtt / elírt név (`NameError`); `"5" + 5` (`TypeError`); számmal kezdődő név
  (`SyntaxError`); szóköz a névben; fordított értékadás (`5 = x`); kimaradt `f` (a kapcsos zárójel betű szerint kiíródik);
  `int("2.5")` (`ValueError`); `print("kor")` a `print(kor)` helyett.
- **Feladattípusok:** Mit ír ki? (változók követése) · Milyen típusú? (`int`/`float`/`str`/`bool`, a gép `type()`-pal igazolja) ·
  Lehet ez változónév? (a gép valódi Pythonnal igazolja) · Írd meg! (változók + f-string; a gép a változók típusát és
  értékét is nézi) · Milyen hibát ad? · Javítsd ki!

### 3. Adatbekérés: `input` és a típusváltás

- **Cél:** a program kérdezzen, és a választ szövegként kapja; számhoz alakítsa át; a „bekérés → számolás → kiírás” vázat
  önállóan felépítse.
- **Fogalmak:** `input("Kérdés: ")`, a kérdés végén szóköz; az eredmény mindig `str`; `int(input(…))`, `float(input(…))`;
  több bemenet egymás után; a futtatóban a bemenetek soronként.
- **Tipikus hibák:** kimaradt `int()` (`"5" + "3"` → `53`, vagy `TypeError`); `int("3.5")` és `int("")` (`ValueError`);
  tizedesvessző (`3,5`); a kérdés kiírása külön `print`-tel, felesleges ismétléssel; zárójelhiba: `int(input("…")`.
- **Feladattípusok (kész):** Mit ír ki? (megadott bemenettel, csak a print kimenete) · Melyik kell? (int, float vagy semmi) ·
  Milyen típusú lesz? · Írd meg! (két különböző bemenettel ellenőrizve, mint a dolgozat-leckében) · Milyen hibát ad? (a megadott
  bemenettel) · Javítsd ki!
- **VS Code:** külön dia és levezetés: a `.py` fájl, a ▶ Run Python File és a `python program.py`, a kérdés és a válasz a
  terminálban (oda kell kattintani), a Traceback a terminálban; és hogy a böngészős futtatóban a bemenet előre megadandó.

### 4. Műveletek és beépített függvények

- **Cél:** a hét művelet és a műveleti sorrend biztos használata; a `//` és `%` a gyakorlatban; kerekítés.
- **Fogalmak:** `+ - * / // % **`, zárójel, `+=` `-=` `*=` `/=`, `round(x)`, `round(x, 2)`, `abs`, `max`, `min`; páros-páratlan
  `% 2`, utolsó számjegy `% 10`, perc → óra:perc.
- **Tipikus hibák:** `a + b / 2` az átlagnál; `/` a `//` helyett; `round(x), 2`; `^` a `**` helyett (Pythonban más művelet);
  a Python párosra kerekít (`round(2.5)` → 2); `ZeroDivisionError`.
- **Feladattípusok (kész):** Mit ír ki? · Melyik művelet? (/, //, %, **) · int vagy float? · Írd meg! (két bemenettel) · Milyen hibát ad? ·
  Javítsd ki! (a tipikus hibák többsége itt hibaüzenet nélküli: `a + b / 2`, `^`, `=+`, `round(x), 2`).

### 5. Feltételek: `if`, `elif`, `else`

- **Cél:** a program döntsön; a feltétel `True` vagy `False`; a behúzás jelöli, mi tartozik a feltétel alá.
- **Fogalmak:** `==` (nem `=`!), `!=`, `<`, `>`, `<=`, `>=`; `if feltétel:` + 4 szóköz; `else`; `elif` (csak az első igaz ág fut);
  `and`, `or`, `not`; páros-páratlan, jegy pontszámból, intervallum (`10 <= x <= 20`).
- **Tipikus hibák:** `=` a `==` helyett (`SyntaxError`); kimaradt kettőspont; rossz behúzás (`IndentationError`, vagy rossz
  ág fut); `elif`-sorrend (a `>= 2` előbb, mint a `>= 4`); `if x == 1 or 2` (mindig igaz); szöveg és szám összehasonlítása.
- **Feladattípusok (kész):** Igaz vagy hamis? · Melyik ág fut? · Mit ír ki? · Írd meg! (3–5 bemenettel: minden ág és a határok;
  a kimenetben a kért szó legyen benne, a másik ágé ne) · Milyen hibát ad? · Javítsd ki!
- **VS Code:** dia és levezetés a behúzásról (kettőspont után Enter → automatikus behúzás, Tab/Shift+Tab, Spaces: 4, vezetővonalak).
- ⚠️ A ponthatárok (85/70/55/40) csak példák; a lecke kimondja, hogy az iskolában a tanár határai érvényesek.

### 6. Ismétlés feltétellel: `while`

- **Cél:** ismétlés, amíg egy feltétel igaz; számláló és gyűjtő változó; bekérés, amíg jó nem lesz.
- **Fogalmak:** `while feltétel:`, a ciklusváltozó változtatása, `osszeg += x`, `db += 1`, `break`; nyomkövetés táblázattal.
- **Tipikus hibák:** végtelen ciklus (kimarad az `i += 1`; a futtató 6 mp után leállítja); eggyel elcsúszás (`<` ↔ `<=`);
  a gyűjtő változó a cikluson belül nullázódik.
- **Feladattípusok (kész):** Hányszor fut le? · Mennyi lesz a végén? (nyomkövetés) · Mit ír ki? · Írd meg! · Milyen hibát ad? (a „végtelen
  ciklus” is válasz) · Javítsd ki!
- **Technika:** a keret 20 000 karakter kimenet után leállítja a programot (kiíró végtelen ciklus), a böngészőben 6 mp az időkorlát,
  a `py-check` minden futásnak 0,5 mp-et ad (TimeoutError). Számok utáni toldalékhoz: `C.nal`, `C.tol`, `C.acc`.

### 7. Számlálós ciklus: `for` és `range`

- **Cél:** ismert számú ismétlés; a `range` három alakja; összegzés, megszámlálás `for`-ral; bejárás szövegen.
- **Fogalmak:** `for i in range(5)` → 0…4; `range(1, 11)`; `range(10, 0, -1)`; `for betu in szo`; egymásba ágyazott ciklus (csillagháromszög).
- **Tipikus hibák:** a záró érték nincs benne (`range(1, 10)` nem írja ki a 10-et); a ciklusváltozó felülírása; a `print` behúzása
  (minden körben vagy csak a végén fut).
- **Feladattípusok:** range elemei · Mit ír ki? · Hányszor fut le? · Írd meg! · Hibakereső.

### 8. Listák

- **Cél:** sok adat egy változóban; bejárás; a programozási tételek Pythonban (a `programozasi-tetelek` lecke pszeudokódja után).
- **Fogalmak:** `[3, 5, 1]`, `lista[0]`, `lista[-1]`, `len`, `append`, `for x in lista`, `sum`, `max`, `min`, `in`; összegzés,
  megszámlálás, maximumkiválasztás, keresés, kiválogatás.
- **Tipikus hibák:** `IndexError` (`lista[len(lista)]`); a `range(len(lista))` és a `for x in lista` keverése; `append` értékadással
  (`lista = lista.append(x)` → `None`).
- **Feladattípusok:** Mit ír ki? · Melyik index? · Írd meg! (tételek) · Hibakereső.

### 9. Szövegek mélyebben

- **Cél:** a dolgozat szövegfeladatai mélyebben, ciklussal: karakterenként, szeletekkel, `split`-tel.
- **Fogalmak:** `s[0]`, `s[-1]`, `s[1:4]`, `s[::-1]`, `len`, `in`, `upper` `lower` `strip` `count` `replace` `split`, `for c in s`;
  a metódus új szöveget ad (`s = s.strip()`).
- **Tipikus hibák:** `s[len(s)]`; a metódus eredményét nem menti; `Upper()`; szelet vége nincs benne.
- **Feladattípusok:** Mit ír ki? · Szelet · Írd meg! · Hibakereső.

### 10. Saját függvények

- **Cél:** a programot részekre bontani; paraméter és visszatérési érték.
- **Fogalmak:** `def nev(parameter):`, `return`, hívás, `print` ↔ `return`, alapértelmezett paraméter, helyi változó.
- **Tipikus hibák:** a függvényt nem hívja meg; `return` helyett `print` (az eredmény `None`); a `return` utáni sor nem fut;
  hiányzó argumentum (`TypeError`).
- **Feladattípusok:** Mit ír ki? · Mit ad vissza? · Írd meg! (a gép a függvényt több argumentummal hívja) · Hibakereső.

## Technika

- ✅ **Közös Python-modul:** `tools/lessons/python.js` + `python.css`, a forrásban a `<!--@PYJS-->` jelölő hozza be (a
  `<!--@KITJS-->` után). Benne: a Python-keret (`HARNESS`), a Pyodide-futtató (Web Worker, lusta betöltés, 6 mp időkorlát),
  a futtató-szerkesztő (`P.editor`), a magyar hibatippek (`P.hint`), a kimenet-összevetés (`P.cmpOut`, `P.exact`), és a
  feladatfajták (`P.task`, „Írd meg!”). A `python-dolgozat` a saját, régi példányát használja tovább (nem nyúlunk hozzá).
- ✅ **A keret a változókat is visszaadja** (név → típus, érték), így a 2. leckétől a gép azt is meg tudja nézni, hogy a
  `kor` változó tényleg `int`-e.
- ✅ **Ellenőrzés valódi Pythonnal:** `node tools/lessons/py-check.js --verify N <lecke>`: minden „Írd meg!” sablon
  mintamegoldása átmegy-e a saját ellenőrzésén; minden „Mit ír ki?” válasz egyezik-e a valódi Pythonnal; minden „Milyen
  hibát ad?” programban tényleg az a hiba keletkezik-e (és a javítás hibátlanul fut); minden „Javítsd ki!” kiinduló kódja
  tényleg hibás, a javított egyezik a várt kimenettel; a diák példái hiba nélkül futnak (vagy a jelölt hibával).
- ✅ **Gépi leckeellenőrző Pyodide-dal, felhőben is:** a felhős gép a jsDelivr-t nem éri el, ezért a `lesson-test.js` a
  `KOVRAT_PYODIDE=<mappa>` változóval a Pyodide-ot helyi mappából szolgálja ki (az npm-es `pyodide@0.27.7` csomag elég).

## Döntések

| Döntés | Miért |
|---|---|
| **Új sorozat, a dolgozat-lecke érintetlen** | A dolgozat-lecke élesben van, és Kovrat a dolgozatra azzal készül. A sorozat a magyarázat, a dolgozat a vizsga. |
| **Közös modul a sorozatnak** (nem másolás leckénként) | 10 lecke ugyanazzal a futtatóval: egy javítás mindenhol érvényes (mint a helyesírásnál a `helyesiras.js`). |
| **Az 1. leckében még nincs f-string** | Az f-stringhez változó kell (2. lecke). Az 1. lecke a vesszős `print`-et tanítja; a 2. leckétől minden kiírás f-stringes, a dolgozat szabálya szerint. |
| **A hibaüzenetet angolul mutatjuk, magyar tippel** | A gépen (és a dolgozatnál) is angolul jön. Megtanulja olvasni: sor, típus, üzenet. |
| **„Írd meg!”: pontos kimenet az 1. leckében, értékek a 3.-tól** | Az 1–2. leckében a feladat maga a kiírás, ezért betűre nézzük (a sor végi szóköz nem számít). A bekéréstől a mondat szabad, a számolt érték számít (mint a dolgozat-leckében). |
| **Ékezetes változónév: „ne használd”** | Pythonban működne (`kör = 1`), de sok iskolai példa és más nyelv nem engedi; a dolgozat feladatsora is ékezet nélküli neveket használ (`uj_ar`, `osszeg`). |
