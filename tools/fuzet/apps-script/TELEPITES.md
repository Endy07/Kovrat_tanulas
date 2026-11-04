# Az Apps Script telepítése (Endi, egyszer)

A `Code.gs` Endi saját Google-fiókjában fut, webappként. Ez fogadja a `fuzet.html` oldalról a fotókat, és ide írja a
feldolgozási kéréseket. A címe (URL) és a családi kód **nem kerül a repóba**: Kovrat telefonján a `fuzet.html`
beállításában (vagy egy linkben) adod meg.

## 1. A projekt

1. https://script.google.com → **Új projekt**. Név: pl. „Füzet-feldolgozó”.
2. A `Code.gs` tartalmát töröld, és másold be a repó `tools/fuzet/apps-script/Code.gs` fájlját. Mentés (Ctrl+S).
3. **Projektbeállítások** (fogaskerék, bal oldalt) → **Script Properties** → **Add script property**:

   | Tulajdonság | Érték | Kötelező? |
   |---|---|---|
   | `CSALADI_KOD` | egy legalább 6 karakteres kód (pl. három szó kötőjellel); csak ti tudjátok | **igen** |
   | `GYOKER_MAPPA` | a Drive-mappa neve (a pultnál megbeszélt név); alapból `Füzetek` | ajánlott |
   | `MAX_KEP_MB`, `MAX_NAPI_KEP`, `MAX_KEP_KERESENKENT`, `MAX_VARAKOZO` | korlátok (alap: 6 MB, napi 80, kérésenként 20, 5 várakozó) | nem |

   Az **időzóna**: Projektbeállítások → Time zone: `(GMT+01:00) Budapest`.

## 2. Engedélyek

1. A szerkesztőben fent a függvényválasztóban: **`proba`** → **Futtatás**.
2. A Google engedélyt kér (Drive-hozzáférés): „Advanced / Speciális” → „Go to … (unsafe)” → **Allow**. (Ez a saját szkripted,
   ezért figyelmeztet; a szkript csak a saját mappájában dolgozik.)
3. A **Végrehajtási napló** írja ki: „Mappa: …” és „Családi kód: beállítva (N karakter)”. A Drive-od gyökerében megjelenik a
   mappa, benne a `beerkezett`.

## 3. Közzététel webappként

1. **Telepítés → Új telepítés** → típus: **Webalkalmazás**.
2. Leírás: „Füzet-feldolgozó”. **Végrehajtás mint: Én** (a te fiókod). **Hozzáférés: Bárki** (ez kell, hogy Kovrat
   telefonja Google-bejelentkezés nélkül elérje; a védelem a családi kód).
3. **Telepítés** → másold ki a **webalkalmazás URL-jét** (`https://script.google.com/macros/s/…/exec`). Ezt ne tedd a repóba,
   ne küldd nyilvános helyre.
4. Próba: nyisd meg az URL-t a böngészőben → `{"ok":true,"szolgaltatas":"fuzet","verzio":1}`.

**Ha később módosítod a `Code.gs`-t:** Telepítés → Telepítések kezelése → ceruza → Verzió: **Új verzió** → Telepítés.
Így az URL ugyanaz marad. (Az „Új telepítés” új URL-t ad.)

## 4. Kovrat telefonja

Két lehetőség:

- **Link (kényelmes):** küldd el Kovratnak privát üzenetben ezt a linket (a `#` utáni rész nem megy el a szerverre, és az
  oldal a megnyitás után eltünteti a címsorból):
  `https://endy07.github.io/Kovrat_tanulas/fuzet.html#cim=<az URL>&kod=<a családi kód>`
  (Ha a kódban szóköz vagy `&` van, inkább a második módot használd.)
- **Kézzel:** `fuzet.html` → ⚙ Beállítás → cím és kód → „Mentés és próba” → „✓ Kapcsolat rendben”.

## Mit tárol a Drive-on

```
<GYOKER_MAPPA>/
  beerkezett/<dátum>/<idő>-<véletlen>.jpg   a fotók (kb. 2000 px-re kicsinyítve)
  kepek.json        a képek listája (bélyegkép, fajta, figyelmeztetés)       ← a szkript írja
  sor.json          a feldolgozási kérések                                   ← a szkript írja
  allapot.json      a kérések állapota, a figyelő életjele                   ← CSAK a figyelő írja (rclone)
  visszajelzesek/   a leckék „Ezt jól olvastam?” válaszai                    ← a szkript írja
```

Egy fájlt mindig csak egy fél ír, így nincs ütközés. A törölt kép a Drive kukájába kerül.

## Védelem

- Családi kód nélkül (vagy rossz kóddal) semmit nem csinál; 15 percen belül 20 rossz kód után 15 percig mindent elutasít.
- Csak JPEG/PNG/WebP (a fájl első bájtjai alapján), legfeljebb 6 MB, napi 80 kép, kérésenként 20, egyszerre 5 várakozó kérés.
- A böngésző `text/plain` POST-ot küld, így nincs CORS-előkérés (az Apps Script azt nem is szolgálná ki).
