# Kovrat 9. évfolyam — éves tanrend (2026/27)

Készült: 2026-10-22. **Jelölés:** ✅ forrásból biztos · ⚠️ feltételezés / becslés. Ahol csak az egyik van, odaírtam.

## Mit találtam, és mit nem

- ✅ **Van országos programtanterv** az *Informatika és távközlés* ágazat ágazati alapoktatásához (9–10. évfolyam).
  A tanulási területek és az óraszámok **az ágazat összes szakmájában közösek**, és a szoftverfejlesztő és
  -tesztelő technikus is ezt az alapozást kapja. Az általam kiolvasott dokumentum az *Informatikai rendszer- és
  alkalmazásüzemeltető technikus* (5 0612 12 02) programtanterve, mert a szoftverfejlesztőé (5 0613 12 03) nem jött
  le olvasható formában. A közös ágazati rész ebből olvasható.
- ❌ **A Mechwart saját helyi tanterve / tanmenete nincs fent**, a tanár sorrendje és hangsúlyai ismeretlenek.
  Minden hónapra bontás ezért ⚠️ **becslés**, az országos óraszámokból és a dokumentum témasorrendjéből.
- ⚠️ A Mechwart szoftveres képzése a Debreceni Egyetemmel is együttműködik (okleveles technikusi képzés,
  2021 óta). Ez a mi tanrendünket nem változtatja, de a 12. után számít.

## Óraszámok (✅ programtanterv)

| Tantárgy / tanulási terület | 9. évf. | 10. évf. | Összesen |
|---|---|---|---|
| **Informatikai és távközlési alapok** (I. a 9.-ben, II. a 10.-ben) | 108 óra | 144 óra | 252 |
| **Programozási alapok** | 72 óra | 72 óra | 144 |

Egy tanév ~36 hét → ⚠️ a 9.-ben **kb. 3 óra/hét informatikai alapok + 2 óra/hét programozás**. Mindkettő
80%-ban gyakorlati. A 10. év végén ágazati alapvizsga.

## Informatikai és távközlési alapok I. — 108 óra (9. évf.)

✅ Az országos programtanterv témakörei:

| Témakör | Óra |
|---|---|
| Bevezetés az elektronikába (egyenáram, Ohm-törvény, teljesítmény) | 28 |
| A PC részei, PC szét- és összeszerelése, bővítése | 12 |
| Megelőző karbantartás és hibakeresés | 10 |
| Laptopok és más eszközök tulajdonságai, hibakeresés | 10 |
| Nyomtatók és egyéb perifériák | 10 |
| Virtualizáció és felhőtechnológiák | 15 |
| Windows telepítése és konfigurációja | 15 |
| A dolgok internete | 8 |

⚠️ **Egy másik iskola (helyi lista, nem a Mechwart) ugyanezt a tantárgyat így sorolja**, és ez
sokkal közelebb áll ahhoz, amit Kovrat az első hónapokban tanult (számrendszerek!): kommunikációs csatorna
(kód, zaj, redundancia) · **számrendszerek (kettes, tizenhatos)** · **logikai műveletek (NEM, ÉS, VAGY, KIZÁRÓ VAGY)** ·
digitális jelek (**ASCII, Unicode, UTF-8**, pixel, színmélység, DPI, raszter/vektor, képformátumok) ·
**tömörítés, rejtjelezés (Caesar, Vigenère)** · mikroprocesszor (CU, ALU, regiszterek, órajel, gyorsítótár) ·
PC-összeszerelés · haladó hardver (POST, BIOS, UEFI, RAID) · karbantartás · hálózatok · nyomtatók · laptopok · virtualizáció.
Forrás: lásd lent. Mivel Kovrat füzete **számrendszerekkel** kezdődött, a Mechwart tanára valószínűleg ezt a sorrendet
követi (számrendszerek → logika → kódolás), **de ez nem biztos**.

## Programozási alapok — 9. évf.: 72 óra, 10. évf.: 72 óra

✅ **A 9. évfolyam nem Pythonnal kezdődik.** A programtanterv szerint:

| Témakör | Óra | Mi ez |
|---|---|---|
| Bevezetés a programozásba (játékos programozás) | 18 | Scratch, Kodu, Minecraft, robot, Arduino, MIT App Inventor; Code.org, freeCodeCamp, Khan Academy stb. |
| Webszerkesztési alapok | 14 | HTML5: oldalváz, címek, kép, link, lista, táblázat; VS Code; online szerkesztők (CodePen) |
| Hibakeresés weboldalakon, **verziókezelő** és csoportmunka | 10 | HTML-validátor, Chrome DevTools, **Git + GitHub** (init, add, commit, branch, merge, clone, pull, push) |
| Weboldalak formázása | 14 | CSS3: szelektorok, box modell, display, position, szemantikus elemek |
| Reszponzív weboldalak | 12 | mobile first, media query, em/rem/%/vw/vh, Bootstrap |
| Ismerkedés a JavaScripttel | 4 | beágyazás, `alert()`, külső fájl |

✅ **A Python a 10. évfolyamra esik** (4 + 48 + 20 óra): változók, `print`/`input`, elágazás, ciklus, listák,
buborékrendezés, függvények, sztringek, tuple, szótár, modulok, fájlkezelés, alap OOP.

> **A nyelv-kérdés válasza:** az országos tanterv szerint a 9.-ben **nincs C# és nincs Python**: a programozás
> játékos kódolás (blokkos), majd **HTML/CSS/JavaScript**, és a Python csak a 10.-ben jön. A C# a szoftverfejlesztő
> szakirányban (11–13. évf.) szokott megjelenni ⚠️. A Mechwart eltérhet; ezt Kovrat tudja megmondani.

## Hónapokra bontva (⚠️ becslés)

A tanév 2026. szeptember 1-jétől; az első félév ~január közepéig. A sorrend a tanterv sorrendje és Kovrat füzete
(a számrendszerek szeptemberben voltak) alapján.

| Hónap | Informatikai alapok (3 óra/hét) | Programozás (2 óra/hét) |
|---|---|---|
| **Szept.** | Bevezetés, **kettes számrendszer** *(kész)* | Játékos programozás: Scratch jellegű kódolás, algoritmus, folyamatábra |
| **Okt.** | **Más számrendszerek: 3-, 5-, 6-, 7-es** *(kész)*, tizenhatos | Játékos programozás vége; webszerkesztés kezdete: HTML-váz |
| **Nov.** | Logikai műveletek; szöveg és kép kódolása (ASCII, Unicode, pixel) | HTML: szöveg, kép, link, lista, táblázat; VS Code |
| **Dec.** | Tömörítés, rejtjelezés; mikroprocesszor; PC alkatrészei | Hibakeresés, DevTools, **Git/GitHub**; CSS kezdete |
| **Jan.** | PC-összeszerelés, **félévi összefoglalás** | CSS: szelektorok, box modell |
| **Feb.** | Elektronika alapjai (Ohm-törvény) | CSS: elrendezés (display, position) |
| **Márc.** | Karbantartás, hibakeresés; laptopok, nyomtatók | Reszponzív oldalak, Bootstrap |
| **Ápr.** | Virtualizáció, felhő; Windows telepítése | Reszponzív vége; JavaScript-bevezető |
| **Máj.** | A dolgok internete; hálózatok alapjai | Év végi weboldal-projekt |
| **Jún.** | Év végi összefoglalás | Projektbemutató |

## Mit építünk ebből az oldalra

- **Első félév (a legtöbbet érő, és ami Kovrat füzetéhez illik):** számrendszerek *(kész)* → tizenhatos számrendszer →
  logikai műveletek → szöveg és kép kódolása → HTML (élő szerkesztővel) → CSS.
- **8. osztályos visszatekintés:** a 9.-es anyag alapjai (hatványok, törtek, arányosság, egyenletek, normálalak).
- **Második félév, ha belefér:** reszponzív oldal, JavaScript-bevezető, Git alapok (ez szöveges magyarázat, nem futtatható).
- **Kimarad (nem programozás-oldali, gyakorlati, tanteremben kell):** PC-összeszerelés, nyomtató, laptop, Windows-telepítés.

## Döntések 2026-10-23 éjjel (⚠️ feltételezés, Kovrat válasza felülírhatja)

Kovrat válaszai még nem jöttek meg, ezért a programtanterv alapján döntöttem. A részletes sorrend és indoklás:
[`leckek-terv.md`](leckek-terv.md); a 10. évfolyam vázlata: [`tanrend-10.md`](tanrend-10.md).

- **A hálózatok a 9.-ben „A dolgok internete” (8 óra) mellé kerültek (május)**, a másik iskola listája alapján. Az országos
  programtantervben a hálózatok részletesen a 10.-ben jönnek (Informatikai és távközlési alapok II.), a lecke ennek az előszobája.
- **Elektronika: február**, ahogy a becsült tanrendben volt. A 230 V-tal kísérletezést a lecke kifejezetten tiltja.
- **Algoritmusok és játékos programozás: szeptember.** A Scratch maga iskolai eszköz, a lecke a gondolkodást (szekvencia,
  ciklus, elágazás, folyamatábra) gyakoroltatja, és magyar kulcsszavas pszeudokódot használ (`ciklus i = 1-től N-ig`, `amíg`).
  Ha az iskola más jelölést használ, ehhez kell igazítani.
- **A számítógép felépítése: december** (mikroprocesszor, a PC részei). A PC-összeszerelés gyakorlata továbbra is iskolai.
- **Virtualizáció és felhő: április**, a jelszóerősséggel és a 3-2-1 mentéssel együtt (a 10.-es IT-biztonság előzménye).
- **JavaScript-bevezető: április.** A programtanterv csak 4 órát ad (beágyazás, `alert`, külső fájl); a lecke ennél bővebb
  (`prompt`, `if`, `for`, DOM, esemény), mert a 10.-es Python ugyanezekre épít.
- **Matek a programozáshoz** (a „minden, ami egy 8.–9.-esnek kell” kérés szerint): oszthatóság és statisztika,
  koordináták és függvények; a 9.-es matek elejéről halmazok, algebrai kifejezések, egyenletek. A matekórai sorrendet
  (melyik hónap) nem ismerjük, ezért ezek az „Előkészítés” csoportban vannak, nem hónaphoz kötve.
- **Logikai fejtörők** egész évre (versenyekre és a programozói gondolkodásra), nem hónaphoz kötve.

## Mit kell megkérdezni Kovrattól (a tanrend bizonytalanságai)

1. Mit használnak most programozásórán: Scratch vagy más blokkos eszköz, vagy már HTML?
2. Tanultak-e már logikai műveleteket (ÉS, VAGY, NEM), tizenhatos számrendszert, ASCII-t?
3. A tanár sorrendje: mikor jön a HTML / a Python? Van-e tankönyv vagy jegyzet (Teams)?
4. Melyik nyelv a szakirányban (Python vagy C#)? A 9.-ben ez még nem kérdés.
5. Van-e digitális kultúra vagy irodai óra (táblázatkezelés)? A táblázatkezelés-lecke ⚠️ feltételezésből készül.
6. Matekórán hol tartanak (halmazok, algebrai kifejezések, egyenletek)? Ehhez igazítjuk a matekos leckéket.
7. Milyen pszeudokód-jelölést használ a tanár (ha használ)?

## Források

- ✅ Országos programtanterv, Informatika és távközlés ágazat (Informatikai rendszer- és alkalmazásüzemeltető technikus, 5 0612 12 02), 89 oldal; az ágazati alapoktatás (3.3 és 3.4 fejezet) közös: https://api.ikk.hu/v1/media/730 (ugyanez: https://afg.hu/pdf/ptt_informatika_es_tavkozles_agazat_informatikai_rendszer-_es_alk.pdf)
- ⚠️ Egy másik iskola helyi témalistája az *Informatikai és távközlési alapok I.* tantárgyhoz (Technikum 9. évf., 2024): https://gy-szekely.cms.intezmeny.edir.hu/uploads/Agazati_alapoktatas_Informatikai_es_tavkoezlesi_alapok_I_temakoeroek_Technikum_9_evfolyam_34ae1d0470.pdf
- A Mechwart–Debreceni Egyetem együttműködés (okleveles technikus): https://inf.unideb.hu/sites/default/files/upload_documents/debreceniszc_okl_kepzesi_program_informatikai_rendszer-_es_alkalmazas-uzemelteto.pdf
- Nem találtam: a Mechwart helyi tanterve, pedagógiai programja vagy szakmai programja a szoftverfejlesztő és -tesztelő technikushoz.
