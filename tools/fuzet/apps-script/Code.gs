/**
 * Füzet-feldolgozó: Google Apps Script webapp (Endi saját Google-fiókjában fut).
 *
 * Mit csinál:
 *  - a fuzet.html oldalról érkező fotókat a Drive-ba menti: <GYOKER_MAPPA>/beerkezett/<dátum>/<idő>-<véletlen>.jpg
 *  - nyilvántartja őket (kepek.json, bélyegképpel), és listázza az állapotukkal együtt
 *  - a „Feldolgozás indítása” kéréseket a sor.json-ba írja
 *  - az állapotot az allapot.json-ból olvassa; ezt CSAK a figyelő (Endi gépe, rclone) írja
 *
 * Egy fájlt mindig csak egy fél ír: a sor.json-t és a kepek.json-t ez a szkript, az allapot.json-t a figyelő.
 * Így nincs versenyhelyzet akkor sem, ha Kovrat épp új kérést indít, amikor a figyelő állapotot ír.
 *
 * Védelem: családi kód (Script Properties: CSALADI_KOD, legalább 6 karakter; NEM a repóban),
 * méret- és darabkorlát, a hibás kódok számának korlátja.
 *
 * Hívás: POST, Content-Type: text/plain (így a böngésző nem küld előzetes OPTIONS-kérést, CORS-preflightot),
 * a törzs JSON: { "action": "...", "kod": "...", ... }. A válasz mindig JSON: { ok: true, ... } vagy { ok: false, hiba: "..." }.
 *
 * Telepítés: tools/fuzet/apps-script/TELEPITES.md
 */

/** A Script Properties-ben felülírható alapértékek. */
var ALAP = {
  GYOKER_MAPPA: "Füzetek",      // a Drive gyökerében ez a mappa; a figyelő configjában ugyanez legyen
  MAX_KEP_MB: "6",              // egy kép legfeljebb ennyi MB (a böngésző kb. 2000 px-re kicsinyít, ez jóval kisebb)
  MAX_NAPI_KEP: "80",           // naponta legfeljebb ennyi feltöltés
  MAX_KEP_KERESENKENT: "20",    // egy feldolgozási kérésben legfeljebb ennyi kép
  MAX_VARAKOZO: "5",            // egyszerre legfeljebb ennyi várakozó kérés
  MAX_THUMB_KB: "60",           // a bélyegkép (data URL) legfeljebb ennyi KB
  MAX_HIBAS_KOD: "20"           // 15 percen belül ennyi hibás kód után 15 percig minden kérést elutasít
};
var TZ = "Europe/Budapest";
var FAJTAK = ["fuzet", "tabla"];
var FIGYELMEZTETESEK = ["sotet", "homalyos"];

function beallitas_(nev) {
  var v = PropertiesService.getScriptProperties().getProperty(nev);
  return v === null || v === undefined || v === "" ? ALAP[nev] : v;
}
function szam_(nev) { return Number(beallitas_(nev)); }

/* ---------------- belépési pontok ---------------- */

function doGet() {
  // csak életjel, adat nélkül (a böngészőben megnyitva is látszik, hogy a telepítés működik)
  return valasz_({ ok: true, szolgaltatas: "fuzet", verzio: 1 });
}

function doPost(e) {
  var k;
  try { k = JSON.parse((e && e.postData && e.postData.contents) || ""); }
  catch (err) { return valasz_({ ok: false, hiba: "Hibás kérés (nem JSON)." }); }
  if (!k || typeof k !== "object") return valasz_({ ok: false, hiba: "Hibás kérés." });
  try {
    var tilt = tiltva_();
    if (tilt) return valasz_({ ok: false, hiba: tilt, kod: "tiltva" });
    var kodHiba = kodHiba_(k.kod);
    if (kodHiba) return valasz_({ ok: false, hiba: kodHiba, kod: "kod" });
    var fv = MUVELETEK[k.action];
    if (!fv) return valasz_({ ok: false, hiba: "Ismeretlen művelet." });
    return valasz_(fv(k));
  } catch (err) {
    return valasz_({ ok: false, hiba: "Szerverhiba: " + (err && err.message ? err.message : String(err)) });
  }
}

function valasz_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------------- védelem ---------------- */

function kodHiba_(kod) {
  var jo = PropertiesService.getScriptProperties().getProperty("CSALADI_KOD");
  if (!jo || String(jo).length < 6) return "A családi kód nincs beállítva a szerveren (Script Properties: CSALADI_KOD, legalább 6 karakter).";
  if (typeof kod !== "string" || !egyezik_(kod, String(jo))) { hibasKod_(); return "Hibás családi kód."; }
  return "";
}
// időzítéstől független összevetés (ne lehessen karakterenként kitalálni)
function egyezik_(a, b) {
  if (a.length !== b.length) return false;
  var d = 0;
  for (var i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
function hibasKod_() {
  var c = CacheService.getScriptCache(), n = Number(c.get("hibas-kod") || 0) + 1;
  c.put("hibas-kod", String(n), 15 * 60);
}
function tiltva_() {
  var n = Number(CacheService.getScriptCache().get("hibas-kod") || 0);
  return n >= szam_("MAX_HIBAS_KOD") ? "Túl sok hibás próbálkozás. Próbáld újra 15 perc múlva." : "";
}

/* ---------------- Drive-segédek ---------------- */

function gyoker_() {
  var nev = beallitas_("GYOKER_MAPPA"), root = DriveApp.getRootFolder(), it = root.getFoldersByName(nev);
  return it.hasNext() ? it.next() : root.createFolder(nev);
}
function almappa_(szulo, nev) {
  var it = szulo.getFoldersByName(nev);
  return it.hasNext() ? it.next() : szulo.createFolder(nev);
}
function fajl_(mappa, nev) {
  var it = mappa.getFilesByName(nev);
  while (it.hasNext()) { var f = it.next(); if (!f.isTrashed()) return f; }
  return null;
}
function olvasJson_(mappa, nev, alap) {
  var f = fajl_(mappa, nev);
  if (!f) return alap;
  try { return JSON.parse(f.getBlob().getDataAsString("utf-8").replace(/^﻿/, "")); } catch (e) { return alap; }
}
function irJson_(mappa, nev, adat) {
  var s = JSON.stringify(adat, null, 1), f = fajl_(mappa, nev);
  if (f) f.setContent(s); else mappa.createFile(nev, s, "application/json");
}
function most_() { return Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd'T'HH:mm:ss"); }
function veletlen_(n) {
  var abc = "abcdefghijkmnpqrstuvwxyz23456789", s = "";
  for (var i = 0; i < n; i++) s += abc.charAt(Math.floor(Math.random() * abc.length));
  return s;
}
function zarral_(fv) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fv(); } finally { lock.releaseLock(); }
}

/* ---------------- adatok ---------------- */

function adatok_() {
  var g = gyoker_();
  var kepek = olvasJson_(g, "kepek.json", { kepek: [] });
  var sor = olvasJson_(g, "sor.json", { keresek: [] });
  var all = olvasJson_(g, "allapot.json", { keresek: {} });
  if (!kepek.kepek) kepek.kepek = [];
  if (!sor.keresek) sor.keresek = [];
  if (!all.keresek) all.keresek = {};
  return { g: g, kepek: kepek, sor: sor, all: all };
}
// kérés állapota: amit a figyelő írt, vagy „varakozik”
function keresAllapot_(all, id) {
  var a = all.keresek[id];
  return a && a.allapot ? a.allapot : "varakozik";
}
// kép állapota: uj (még nem kérték) | sorban | kesz | hiba — a legutóbbi őt tartalmazó kérés szerint
function kepAllapotok_(d) {
  var m = {};
  d.sor.keresek.forEach(function (r) {
    var a = keresAllapot_(d.all, r.id);
    var ka = a === "kesz" ? "kesz" : a === "hiba" ? "hiba" : "sorban";
    (r.kepek || []).forEach(function (k) { m[k.id] = ka; });
  });
  return m;
}
function keresekKi_(d, n) {
  return d.sor.keresek.slice(-n).reverse().map(function (r) {
    var a = d.all.keresek[r.id] || {};
    return {
      id: r.id, letrehozva: r.letrehozva, kepDb: (r.kepek || []).length, tantargy: r.tantargy || "",
      allapot: keresAllapot_(d.all, r.id), frissitve: a.frissitve || "", uzenet: a.uzenet || "",
      lecke: a.lecke || "", cim: a.cim || "", tema: a.tema || "", felismertTantargy: a.tantargy || "",
      pr: a.pr || "", bizonytalan: a.bizonytalan || 0
    };
  });
}

/* ---------------- műveletek ---------------- */

var MUVELETEK = {
  ping: function () { return { ok: true }; },

  feltoltes: function (k) {
    var b64 = typeof k.kep === "string" ? k.kep.replace(/^data:[^,]*,/, "") : "";
    if (!b64) return { ok: false, hiba: "Nincs kép a kérésben." };
    var maxB = szam_("MAX_KEP_MB") * 1024 * 1024;
    if (b64.length * 3 / 4 > maxB) return { ok: false, hiba: "Túl nagy kép (legfeljebb " + beallitas_("MAX_KEP_MB") + " MB)." };
    var bajt = Utilities.base64Decode(b64);
    if (bajt.length > maxB) return { ok: false, hiba: "Túl nagy kép." };
    var mime = kepTipus_(bajt);
    if (!mime) return { ok: false, hiba: "Ez nem JPEG, PNG vagy WebP kép." };
    var thumb = typeof k.thumb === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(k.thumb) &&
      k.thumb.length <= szam_("MAX_THUMB_KB") * 1024 ? k.thumb : "";
    var fajta = FAJTAK.indexOf(k.fajta) >= 0 ? k.fajta : "fuzet";
    var figy = Array.isArray(k.figyelmeztetes) ? k.figyelmeztetes.filter(function (x) { return FIGYELMEZTETESEK.indexOf(x) >= 0; }) : [];
    return zarral_(function () {
      var d = adatok_(), nap = Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd");
      var maiDb = d.kepek.kepek.filter(function (x) { return String(x.datum).slice(0, 10) === nap; }).length;
      if (maiDb >= szam_("MAX_NAPI_KEP")) return { ok: false, hiba: "Mára elérted a feltöltési korlátot (" + beallitas_("MAX_NAPI_KEP") + " kép)." };
      var ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
      var nev = Utilities.formatDate(new Date(), TZ, "HHmmss") + "-" + veletlen_(4) + "." + ext;
      var mappa = almappa_(almappa_(d.g, "beerkezett"), nap);
      var f = mappa.createFile(Utilities.newBlob(bajt, mime, nev));
      var kep = { id: f.getId(), ut: "beerkezett/" + nap + "/" + nev, datum: most_(), meret: bajt.length, fajta: fajta, figyelmeztetes: figy, thumb: thumb };
      d.kepek.kepek.push(kep);
      irJson_(d.g, "kepek.json", d.kepek);
      return { ok: true, kep: { id: kep.id, datum: kep.datum, fajta: fajta } };
    });
  },

  // galéria (a még nem feldolgozott képek bélyegképpel) + kérések + a figyelő életjele
  lista: function () {
    var d = adatok_(), m = kepAllapotok_(d);
    var kepek = d.kepek.kepek.filter(function (x) { var a = m[x.id] || "uj"; return a === "uj" || a === "hiba"; })
      .map(function (x) { return { id: x.id, datum: x.datum, fajta: x.fajta, figyelmeztetes: x.figyelmeztetes || [], thumb: x.thumb || "", allapot: m[x.id] || "uj" }; });
    var db = { uj: 0, sorban: 0, kesz: 0, hiba: 0 };
    d.kepek.kepek.forEach(function (x) { db[m[x.id] || "uj"]++; });
    return { ok: true, kepek: kepek, darab: db, keresek: keresekKi_(d, 20), figyelo: d.all.figyelo || null };
  },

  // könnyű lekérdezés bélyegképek nélkül (az oldal ezt frissíti gyakran)
  allapot: function () {
    var d = adatok_();
    return { ok: true, keresek: keresekKi_(d, 20), figyelo: d.all.figyelo || null };
  },

  inditas: function (k) {
    return zarral_(function () {
      var d = adatok_(), m = kepAllapotok_(d);
      var szabad = d.kepek.kepek.filter(function (x) { var a = m[x.id] || "uj"; return a === "uj" || a === "hiba"; });
      var valasztott = k.mind === true ? szabad :
        szabad.filter(function (x) { return Array.isArray(k.kepek) && k.kepek.indexOf(x.id) >= 0; });
      if (!k.mind && Array.isArray(k.kepek) && valasztott.length !== k.kepek.length) return { ok: false, hiba: "Valamelyik kijelölt kép már sorban van vagy elkészült. Frissítsd az oldalt." };
      if (!valasztott.length) return { ok: false, hiba: "Nincs kijelölt (még feldolgozatlan) kép." };
      if (valasztott.length > szam_("MAX_KEP_KERESENKENT")) return { ok: false, hiba: "Egyszerre legfeljebb " + beallitas_("MAX_KEP_KERESENKENT") + " képet dolgozhatok fel." };
      var var_ = d.sor.keresek.filter(function (r) { var a = keresAllapot_(d.all, r.id); return a === "varakozik" || a === "dolgozik"; }).length;
      if (var_ >= szam_("MAX_VARAKOZO")) return { ok: false, hiba: "Már " + var_ + " kérés vár a sorban. Várd meg, amíg ezek elkészülnek." };
      var tantargy = tisztit_(k.tantargy, 40), megj = tisztit_(k.megjegyzes, 300);
      var r = {
        id: "k" + Utilities.formatDate(new Date(), TZ, "yyyyMMdd-HHmmss") + "-" + veletlen_(3),
        letrehozva: most_(), tantargy: tantargy, megjegyzes: megj,
        kepek: valasztott.map(function (x) { return { id: x.id, ut: x.ut, fajta: x.fajta, figyelmeztetes: x.figyelmeztetes || [] }; })
      };
      d.sor.keresek.push(r);
      if (d.sor.keresek.length > 100) d.sor.keresek = d.sor.keresek.slice(-100);
      irJson_(d.g, "sor.json", d.sor);
      // a már elkészült képek bélyegképe nem kell a galériához: így kicsi marad a kepek.json
      var torolt = 0;
      d.kepek.kepek.forEach(function (x) { if (m[x.id] === "kesz" && x.thumb) { x.thumb = ""; torolt++; } });
      if (torolt) irJson_(d.g, "kepek.json", d.kepek);
      return { ok: true, keres: { id: r.id, kepDb: r.kepek.length, allapot: "varakozik" } };
    });
  },

  torles: function (k) {
    return zarral_(function () {
      var d = adatok_(), m = kepAllapotok_(d), a = m[k.id] || "uj";
      var i = d.kepek.kepek.map(function (x) { return x.id; }).indexOf(k.id);
      if (i < 0) return { ok: false, hiba: "Nincs ilyen kép." };
      if (a === "sorban") return { ok: false, hiba: "Ez a kép épp feldolgozásra vár, most nem törölhető." };
      try { DriveApp.getFileById(k.id).setTrashed(true); } catch (e) { /* már nincs meg: csak a listából vesszük ki */ }
      d.kepek.kepek.splice(i, 1);
      irJson_(d.g, "kepek.json", d.kepek);
      return { ok: true };
    });
  },

  // a kész lecke „Ezt jól olvastam?” válaszai (a 2. lépés, a második vélemény is ebből dolgozik majd)
  visszajelzes: function (k) {
    if (typeof k.lecke !== "string" || !/^fuzet-[a-z0-9-]{1,80}$/.test(k.lecke)) return { ok: false, hiba: "Hibás leckenév." };
    var valaszok = Array.isArray(k.valaszok) ? k.valaszok.slice(0, 100).map(function (v) {
      return { id: tisztit_(v && v.id, 40), jo: !!(v && v.jo), javitas: tisztit_(v && v.javitas, 300) };
    }) : [];
    return zarral_(function () {
      var g = gyoker_(), m = almappa_(g, "visszajelzesek");
      irJson_(m, k.lecke + ".json", { lecke: k.lecke, ido: most_(), valaszok: valaszok });
      return { ok: true };
    });
  }
};

function tisztit_(s, max) {
  return typeof s === "string" ? s.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";
}
// a fájl első bájtjai alapján (az Apps Script bájtjai előjelesek: & 255)
function kepTipus_(b) {
  var u = function (i) { return b[i] & 255; };
  if (b.length > 3 && u(0) === 0xFF && u(1) === 0xD8 && u(2) === 0xFF) return "image/jpeg";
  if (b.length > 8 && u(0) === 0x89 && u(1) === 0x50 && u(2) === 0x4E && u(3) === 0x47) return "image/png";
  if (b.length > 12 && u(0) === 0x52 && u(1) === 0x49 && u(2) === 0x46 && u(3) === 0x46 && u(8) === 0x57 && u(9) === 0x45 && u(10) === 0x42 && u(11) === 0x50) return "image/webp";
  return "";
}

/**
 * Egyszer, kézzel futtatandó a szerkesztőből (Futtatás → engedélyek): létrehozza a mappát, és megmutatja,
 * hogy a beállítások rendben vannak-e. A családi kódot a Project Settings → Script Properties alatt add meg.
 */
function proba() {
  var g = gyoker_();
  almappa_(g, "beerkezett");
  var kod = PropertiesService.getScriptProperties().getProperty("CSALADI_KOD");
  Logger.log("Mappa: " + g.getName() + " (" + g.getId() + ")");
  Logger.log("Családi kód: " + (kod && kod.length >= 6 ? "beállítva (" + kod.length + " karakter)" : "HIÁNYZIK vagy rövidebb 6 karakternél"));
}
