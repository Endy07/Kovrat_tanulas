// A Code.gs egységtesztje a hamis Apps Scripttel (HTTP-n át, ahogy a böngésző hívja).
// Használat: node tools/fuzet/teszt/apps-script-teszt.js
const fs = require("fs"), path = require("path"), os = require("os");
const { indit } = require("./hamis-apps-script");

const JPEG = Buffer.from("/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==", "base64");
const THUMB = "data:image/jpeg;base64," + JPEG.toString("base64");
let hibak = 0, db = 0;
const ok = (felt, uzenet) => { db++; if (!felt) { hibak++; console.log("  ✗ " + uzenet); } else console.log("  ✓ " + uzenet); };

(async () => {
  const drive = fs.mkdtempSync(path.join(os.tmpdir(), "fuzet-drive-"));
  const KOD = "csaladi-kod-teszt";
  const s = await indit({ drive, kod: KOD, props: { MAX_NAPI_KEP: "6", MAX_KEP_KERESENKENT: "3", MAX_VARAKOZO: "2", MAX_HIBAS_KOD: "5", GYOKER_MAPPA: "Tesztfüzetek" } });
  const url = "http://127.0.0.1:" + s.port + "/";
  const hiv = async (o, kod = KOD) => (await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(Object.assign({ kod }, o)) })).json();
  const G = path.join(drive, "Tesztfüzetek");

  console.log("Védelem");
  ok((await (await fetch(url)).json()).ok === true, "GET: életjel adat nélkül");
  let r = await hiv({ action: "lista" }, "rossz");
  ok(!r.ok && r.kod === "kod", "hibás kód → elutasítva");
  r = await hiv({ action: "ping" }, null);
  ok(!r.ok && r.kod === "kod", "kód nélkül → elutasítva");
  ok((await hiv({ action: "nincsilyen" })).hiba === "Ismeretlen művelet.", "ismeretlen művelet");
  r = await (await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain" }, body: "nem json" })).json();
  ok(!r.ok, "nem JSON törzs → hiba");

  console.log("Feltöltés");
  r = await hiv({ action: "feltoltes", kep: JPEG.toString("base64"), thumb: THUMB, fajta: "tabla", figyelmeztetes: ["sotet", "<script>"] });
  ok(r.ok && r.kep && r.kep.fajta === "tabla", "JPEG feltöltve, táblafotó");
  const nap = fs.readdirSync(path.join(G, "beerkezett"))[0];
  ok(/^\d{4}-\d\d-\d\d$/.test(nap), "dátum-mappa: beerkezett/" + nap);
  const fajlok = fs.readdirSync(path.join(G, "beerkezett", nap));
  ok(fajlok.length === 1 && /^\d{6}-[a-z0-9]{4}\.jpg$/.test(fajlok[0]) && fs.readFileSync(path.join(G, "beerkezett", nap, fajlok[0])).equals(JPEG), "a kép bájtra pontosan a Drive-ban: " + fajlok[0]);
  const idx = JSON.parse(fs.readFileSync(path.join(G, "kepek.json"), "utf8"));
  ok(JSON.stringify(idx.kepek[0].figyelmeztetes) === '["sotet"]', "ismeretlen figyelmeztetés kiszűrve");
  ok((await hiv({ action: "feltoltes", kep: Buffer.from("GIF89a....").toString("base64") })).hiba === "Ez nem JPEG, PNG vagy WebP kép.", "nem kép → elutasítva");
  ok(/Túl nagy/.test((await hiv({ action: "feltoltes", kep: Buffer.alloc(7 * 1024 * 1024, 0xFF).toString("base64") })).hiba || ""), "7 MB → túl nagy");
  r = await hiv({ action: "feltoltes", kep: JPEG.toString("base64"), thumb: "javascript:alert(1)" });
  ok(r.ok, "hibás bélyegkép: a kép megmarad");
  for (let i = 0; i < 4; i++) await hiv({ action: "feltoltes", kep: JPEG.toString("base64"), thumb: THUMB });
  r = await hiv({ action: "feltoltes", kep: JPEG.toString("base64") });
  ok(!r.ok && /korlát/.test(r.hiba), "napi korlát (6) után elutasítva: " + r.hiba);

  console.log("Lista és indítás");
  r = await hiv({ action: "lista" });
  ok(r.ok && r.kepek.length === 6 && r.darab.uj === 6, "lista: 6 elemzetlen kép");
  ok(r.kepek.filter(k => k.thumb).length === 5, "a hibás bélyegkép üres, a többi megvan");
  const ids = r.kepek.map(k => k.id);
  ok(/egyszerre legfeljebb 3/i.test((await hiv({ action: "inditas", kepek: ids.slice(0, 4) })).hiba || ""), "képkorlát kérésenként (3)");
  ok(!(await hiv({ action: "inditas", kepek: [] })).ok, "üres kijelölés → hiba");
  r = await hiv({ action: "inditas", kepek: ids.slice(0, 2), tantargy: "matek\u0000", megjegyzes: "  12. oldal  " });
  ok(r.ok && /^k\d{8}-\d{6}-[a-z0-9]{3}$/.test(r.keres.id), "kérés létrehozva: " + (r.keres && r.keres.id));
  const k1 = r.keres.id;
  const sor = JSON.parse(fs.readFileSync(path.join(G, "sor.json"), "utf8"));
  ok(sor.keresek[0].tantargy === "matek" && sor.keresek[0].megjegyzes === "12. oldal" && sor.keresek[0].kepek[0].ut.startsWith("beerkezett/"), "sor.json: tantárgy és megjegyzés megtisztítva, útvonalak");
  ok(/már sorban/.test((await hiv({ action: "inditas", kepek: ids.slice(0, 1) })).hiba || ""), "sorban lévő kép nem indítható újra");
  ok(/nem törölhető/.test((await hiv({ action: "torles", id: ids[0] })).hiba || ""), "sorban lévő kép nem törölhető");
  r = await hiv({ action: "lista" });
  ok(r.kepek.length === 4 && r.darab.sorban === 2 && r.keresek[0].allapot === "varakozik", "lista: 4 elemzetlen, 2 sorban, a kérés várakozik");
  r = await hiv({ action: "inditas", kepek: [ids[2]] });
  ok(r.ok, "második kérés");
  ok(/vár a sorban/.test((await hiv({ action: "inditas", kepek: [ids[3]] })).hiba || ""), "várakozó-korlát (2)");

  console.log("A figyelő állapota (allapot.json, a figyelő írja)");
  fs.writeFileSync(path.join(G, "allapot.json"), "﻿" + JSON.stringify({ keresek: { [k1]: { allapot: "kesz", lecke: "fuzet-20261104-tortek", cim: "Törtek", pr: "https://github.com/x/y/pull/1", bizonytalan: 2 }, [r.keres.id]: { allapot: "hiba", uzenet: "teszthiba" } }, figyelo: { utoljara: "2026-11-04T10:00:00" } }));
  r = await hiv({ action: "lista" });
  ok(r.keresek.find(x => x.id === k1).lecke === "fuzet-20261104-tortek" && r.figyelo.utoljara, "kész kérés: lecke, figyelő életjele (BOM-mal is)");
  ok(r.darab.kesz === 2 && r.kepek.length === 4 && r.kepek.some(k => k.allapot === "hiba"), "a hibás kérés képe visszakerül a galériába");
  r = await hiv({ action: "inditas", mind: true, tantargy: "" });
  ok(!r.ok && /legfeljebb 3/.test(r.hiba), "„mind” is betartja a korlátot");
  ok((await hiv({ action: "torles", id: ids[5] })).ok, "elemzetlen kép törölve");
  r = await hiv({ action: "lista" });
  ok(r.kepek.length === 3 && fs.existsSync(path.join(drive, ".kuka")), "a törölt kép a kukában, a listán nincs");
  r = await hiv({ action: "inditas", mind: true });
  ok(r.ok && r.keres.kepDb === 3, "„mind”: a 3 elemzetlen kép (a hibás is) egy kérésben");
  const idx2 = JSON.parse(fs.readFileSync(path.join(G, "kepek.json"), "utf8"));
  ok(idx2.kepek.filter(k => ids.slice(0, 2).includes(k.id)).every(k => !k.thumb), "a kész képek bélyegképe törölve (kicsi marad a kepek.json)");
  r = await hiv({ action: "allapot" });
  ok(r.ok && r.keresek.length === 3 && !("kepek" in r), "allapot: könnyű lekérdezés bélyegkép nélkül");

  console.log("Visszajelzés a leckéből");
  ok((await hiv({ action: "visszajelzes", lecke: "../x", valaszok: [] })).hiba === "Hibás leckenév.", "hibás leckenév");
  ok((await hiv({ action: "visszajelzes", lecke: "fuzet-20261104-tortek", valaszok: [{ id: "o1", jo: false, javitas: "3/4" }] })).ok, "visszajelzés mentve");
  ok(JSON.parse(fs.readFileSync(path.join(G, "visszajelzesek", "fuzet-20261104-tortek.json"), "utf8")).valaszok[0].javitas === "3/4", "visszajelzesek/<lecke>.json");

  console.log("Hibás kódok korlátja");
  for (let i = 0; i < 6; i++) await hiv({ action: "ping" }, "rossz" + i);
  r = await hiv({ action: "ping" });
  ok(!r.ok && r.kod === "tiltva", "sok hibás kód után a jó kód is várni kényszerül");

  console.log("Beállítatlan kód");
  const s2 = await indit({ drive: fs.mkdtempSync(path.join(os.tmpdir(), "fuzet-drive-")), kod: "" });
  r = await (await fetch("http://127.0.0.1:" + s2.port + "/", { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ action: "ping", kod: "" }) })).json();
  ok(!r.ok && /nincs beállítva/.test(r.hiba), "üres CSALADI_KOD → minden kérés elutasítva");
  await s2.close();

  ok(s.stat.preflight === 0, "nem volt CORS-preflight (OPTIONS)");
  await s.close();
  console.log((hibak ? "HIBA: " + hibak : "Minden rendben:") + " " + (db - hibak) + " / " + db);
  process.exit(hibak ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
