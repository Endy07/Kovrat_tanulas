# Kovrat 10. évfolyam — tanrend-vázlat (2027/28)

Készült: 2026-10-23, **lecke nélkül, csak vázlat**. Jelölés: ✅ forrásból biztos · ⚠️ feltételezés / becslés.
Forrás: ugyanaz az országos programtanterv, mint a 9.-es tanrendnél (Informatika és távközlés ágazat, ágazati
alapoktatás; https://api.ikk.hu/v1/media/730, a 2–3. oldal óratáblája és a 3.3.2, 3.4.1 fejezet). A Mechwart helyi
tanmenete itt sem ismert, ezért a hónapokra bontás ⚠️ becslés. A 10. év végén **ágazati alapvizsga** van.

## Óraszámok (✅ programtanterv)

| Tantárgy | 10. évf. |
|---|---|
| Informatikai és távközlési alapok II. | 144 óra (heti kb. 4) |
| Programozási alapok (folytatás) | 72 óra (heti kb. 2) |

## Informatikai és távközlési alapok II. — 144 óra (✅ témakörök)

| Témakör | Óra | Mit érint az oldalon? |
|---|---|---|
| Gépi tanulás, neuronhálózatok, mesterséges intelligencia | 10 | új lecke kellene |
| Informatikai és távközlési hálózatok napjainkban | 8 | a 9.-es *Hálózatok alapjai* bevezeti |
| Hálózati protokollok és modellek, végponti eszközök hálózati beállítása | 18 | *Hálózatok alapjai* (rétegek, portok, DHCP, DNS) |
| Kapcsolás Ethernet hálózatokon, a kapcsoló alapszintű beállítása | 20 | új lecke (MAC-tábla, VLAN alapjai) ⚠️ Cisco-parancssor, tantermi |
| A hálózati réteg, IPv4 és IPv6 címzés, a forgalomirányító alapszintű beállítása | 8 | *Hálózatok alapjai* (maszk, hálózati cím); IPv6 bővítés kell |
| A szállítási és az alkalmazási réteg | 18 | *Hálózatok alapjai* (TCP/UDP, portok); bővíthető |
| Otthoni és kisvállalati hálózat építése és beállítása | 8 | tantermi |
| **IT-biztonság** | **30** | a 9.-es *Virtualizáció és felhő* (jelszó, mentés, kétlépcsős) bevezeti; **külön lecke kell** (kártevők, adathalászat, titkosítás, tűzfal) |
| Egyéb operációs rendszerek (mobil és macOS) | 6 | tantermi |
| Linux alapok | 18 | új lecke: parancssor (ls, cd, cp, mv, chmod), fájlrendszer, jogosultságok; böngészős „játék-terminállal”, mint a Git-leckében |

## Programozási alapok — 10. évf.: 72 óra (✅ témakörök)

| Témakör | Óra | Tartalom (a programtanterv felsorolásából, rövidítve) |
|---|---|---|
| Bevezetés a Python programozásba | 4 | fordított vs. értelmezett kód, telepítés, fejlesztőkörnyezet, „Hello World”, egyszerű hibák |
| A Python programozási nyelv alapjai | 48 | `print` (paraméterek, `\n`), literálok és típusok, típuskonverzió, operátorok, rövidített értékadás (`+=`), kifejezések, változók, megjegyzés, `input`, sztring-műveletek, relációk, `if`/`elif`/`else`, `while`, `for`, `range`, végtelen ciklus, `and`/`or`/`not`, bitműveletek, **lista** (index, negatív index, `append`, `insert`, darabolás, bejárás), **buborékrendezés**, `in`/`not in`, min/max keresése, **megszámlálás, kiválogatás, eldöntés**, egymásba ágyazott lista, **függvények** (paraméter, visszatérési érték, `None`, scope, rekurzió fogalma), sztringek (indexelés, darabolás, `ord`/`chr`, sok sztring-metódus), **tuple**, **szótár** |
| Modulok, objektumok, fájlkezelés Pythonban | 20 | `import`, `math`, `random`, `platform`, saját modul és csomag, kivételek és kezelésük, OOP alapjai (osztály, objektum, öröklés fogalma), szöveges fájlok (`open`, `readline`, `readlines`, `write`) |

## Hónapokra bontva (⚠️ becslés)

| Hónap | Informatikai alapok II. (4 óra/hét) | Programozás (2 óra/hét) |
|---|---|---|
| Szept. | Hálózatok napjainkban; protokollok, modellek | Bevezetés a Pythonba: telepítés, `print`, „Hello World” |
| Okt. | Végponti eszközök beállítása; Ethernet, kapcsoló | Típusok, operátorok, változók, `input`, típuskonverzió |
| Nov. | Kapcsoló beállítása; IPv4/IPv6, forgalomirányító | Elágazások (`if`/`elif`), logikai operátorok |
| Dec. | Szállítási és alkalmazási réteg | Ciklusok (`while`, `for`, `range`) |
| Jan. | Otthoni hálózat építése; félévi összefoglalás | Listák, bejárás, min/max, megszámlálás |
| Febr. | IT-biztonság I. | Buborékrendezés, kiválogatás, eldöntés; sztringek |
| Márc. | IT-biztonság II. | Függvények, tuple, szótár |
| Ápr. | Linux alapok | Modulok (`math`, `random`), kivételkezelés |
| Máj. | Mobil és macOS; mesterséges intelligencia | OOP alapjai, fájlkezelés |
| Jún. | **Ágazati alapvizsga**, ismétlés | Ismétlés, vizsgafeladatok |

## Mit építenénk ebből az oldalra (javasolt sorrend)

> **Döntés (2026-10-23, Endi a pulton át):** a Python-futtató a **Pyodide lesz, CDN-ről, lustán töltve, csak a
> Python-leckéken** (a többi lecke nem tölti be). Endi szavai: „És a Pyodide legyen a Python-futtató, ha ezt javaslod.
> De még nem kell a 10-est megépíteni.” A 10.-es leckéket és a futtatót **még nem építjük**.

1. **Python 1: kiírás, változók, típusok, `input`** — böngészőben futó Pythonnal (Pyodide, lásd a döntést fent; kb. 10 MB
   letöltés az első megnyitáskor). A JS-leckében elkészült elszigetelt futtató (`K.jsrun`) mintája szerint,
   `sandbox="allow-scripts"` iframe-ben.
2. **Python 2: elágazás és ciklus** — a 9.-es *Algoritmusok* és *Logikai fejtörők* pszeudokódja Pythonra fordítva.
3. **Python 3: listák és a programozási tételek** (megszámlálás, összegzés, min/max, kiválogatás, eldöntés, buborékrendezés
   lépésenkénti lejátszóval).
4. **Python 4: függvények, sztringek, szótár.**
5. **IT-biztonság** (30 óra, a legnagyobb 10.-es informatikai témakör): kártevők, adathalászat felismerése, titkosítás
   (Caesar → szimmetrikus/aszimmetrikus ötlete), tűzfal, jelszókezelő, biztonsági mentés.
6. **Linux parancssor** játék-terminállal (a Git-lecke mintájára).
7. **Mesterséges intelligencia alapjai** (gépi tanulás ötlete, neuron, tanítóadat; 10 óra).

## Kovrattól megkérdezendő (ha a 10.-hez közeledünk)

- Melyik Python-környezetet használják (IDLE, Thonny, VS Code)? Ugyanezt mutassuk.
- Van-e a 9.-ben már Python (a Mechwart eltérhet az országos sorrendtől)?
- Cisco Networking Academy (NetAcad) tananyagot használnak-e a hálózatokhoz? Akkor ahhoz igazítsuk a szóhasználatot.
