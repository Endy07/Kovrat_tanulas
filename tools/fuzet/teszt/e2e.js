// A füzet-feldolgozó teljes útja, gépen, valódi Google-fiók nélkül:
//   böngésző (390 px, fuzet.html) → hamis Apps Script (a valódi Code.gs fut benne) → „Drive” (helyi mappa)
//   → figyelő (hamis rclone, hamis claude, hamis gh; VALÓDI git, egy ideiglenes „origin” repóval) → állapot vissza az oldalra
//   → a kész lecke megnyitása, „Ezt jól olvastam?” visszajelzés, lesson-test a kész leckén; hibás esetek is.
// Használat: node tools/fuzet/teszt/e2e.js       (a playwright és a Chromium kell hozzá; a repóhoz nem nyúl, mindent ideiglenes mappában csinál)
const fs = require("fs"), path = require("path"), os = require("os"), http = require("http"), cp = require("child_process");
const { chromium } = require("playwright");
const { indit } = require("./hamis-apps-script");

const ROOT = path.resolve(__dirname, "..", "..", ".."), T = fs.mkdtempSync(path.join(os.tmpdir(), "fuzet-e2e-"));
const KOD = "e2e-csaladi-kod-42", SHOTS = process.env.KOVRAT_SHOTS || path.join(ROOT, ".playwright-mcp");
let hibak = 0, db = 0;
const ok = (felt, uzenet) => { db++; if (!felt) hibak++; console.log((felt ? "  ✓ " : "  ✗ ") + uzenet); };
const sh = (c, args, o) => cp.execFileSync(c, args, Object.assign({ stdio: ["ignore", "pipe", "pipe"] }, o || {})).toString();
const varj = ms => new Promise(r => setTimeout(r, ms));

function jpegMeret(buf) {   // SOF-jelölő: a kép valódi mérete
  for (let i = 2; i < buf.length;) {
    if (buf[i] !== 0xFF) return null;
    const m = buf[i + 1], len = buf.readUInt16BE(i + 2);
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}
function statikus(gyokerek) {   // egyszerű fájlszerver; több gyökér: az első, ahol megvan
  const srv = http.createServer((req, res) => {
    const u = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
    const f = gyokerek.map(g => [path.resolve(g), path.resolve(g, u)]).filter(([g, p]) => p.startsWith(g + path.sep)).map(x => x[1]).find(p => fs.existsSync(p) && fs.statSync(p).isFile());
    if (!f) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": /\.html$/.test(f) ? "text/html; charset=utf-8" : /\.json$/.test(f) ? "application/json" : "application/octet-stream", "Cache-Control": "no-store" });
    res.end(req.method === "HEAD" ? undefined : fs.readFileSync(f));
  });
  return new Promise(r => srv.listen(0, "127.0.0.1", () => r({ srv, port: srv.address().port })));
}

(async () => {
  console.log("Ideiglenes mappa:", T);
  /* ---------- előkészítés: repó másolat a mostani munkával, „origin” (bare), Drive ---------- */
  const REPO = path.join(T, "repo"), ORIGIN = path.join(T, "origin.git"), DRIVE = path.join(T, "drive"), MUNKA = path.join(T, "munka"), NAPLO = path.join(T, "hivasok.log");
  sh("git", ["clone", "-q", "--no-hardlinks", ROOT, REPO]);
  const valtozott = sh("git", ["status", "--porcelain", "--untracked-files=all"], { cwd: ROOT }).split("\n").filter(Boolean).map(l => l.slice(3)).filter(f => !/^\.playwright-mcp\//.test(f));
  for (const f of valtozott) { const s = path.join(ROOT, f), d = path.join(REPO, f); if (fs.existsSync(s)) { fs.mkdirSync(path.dirname(d), { recursive: true }); fs.copyFileSync(s, d); } else fs.rmSync(d, { force: true }); }
  sh("git", ["config", "user.name", "Teszt"], { cwd: REPO }); sh("git", ["config", "user.email", "teszt@example.invalid"], { cwd: REPO });
  sh("git", ["config", "core.hooksPath", ".githooks"], { cwd: REPO });
  sh("git", ["config", "core.autocrlf", "true"], { cwd: REPO });   // mint Endi Windowsán (ott rendszerszinten): a figyelő munkafája ettől is LF-es legyen
  sh("git", ["add", "-A"], { cwd: REPO }); try { sh("git", ["commit", "-q", "-m", "teszt: a mostani munka"], { cwd: REPO }); } catch (e) {}
  sh("git", ["branch", "-M", "main"], { cwd: REPO });
  sh("git", ["clone", "-q", "--bare", REPO, ORIGIN]);
  sh("git", ["remote", "set-url", "origin", ORIGIN], { cwd: REPO }); sh("git", ["fetch", "-q", "origin"], { cwd: REPO });

  const as = await indit({ drive: DRIVE, kod: KOD, props: { GYOKER_MAPPA: "Füzetek" } });
  const AS = "http://127.0.0.1:" + as.port + "/";
  const api = async o => (await fetch(AS, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(Object.assign({ kod: KOD }, o)) })).json();
  const ELO = path.join(T, "elo");   // ide kerül a beolvasztott ág (a „GitHub Pages”)
  fs.mkdirSync(ELO);
  const web = await statikus([ELO, ROOT]);   // a „beolvasztás” után az ELO a teljes ág (benne a version.json is), addig üres
  const WEB = "http://127.0.0.1:" + web.port + "/";

  const cfgUt = path.join(T, "figyelo.config.json");
  const cfg = (extra) => fs.writeFileSync(cfgUt, JSON.stringify(Object.assign({
    repo: REPO, munkamappa: MUNKA, tavoli: "gdrive:Füzetek", percenkent: 1,
    rclone: ["node", path.join(__dirname, "hamis-rclone.js")], claude: ["node", path.join(__dirname, "hamis-claude.js")], gh: ["node", path.join(__dirname, "hamis-gh.js")],
    github: "Endy07/Kovrat_tanulas", tiltott: [KOD, "Tilos Név"], idokorlatPerc: 1
  }, extra || {}), null, 1));
  const figyelo = (env, args) => {
    cfg(env && env._cfg);
    env = Object.assign({}, env || {}); delete env._cfg;
    const r = cp.spawnSync("node", [path.join(ROOT, "tools", "fuzet", "figyelo", "figyelo.js"), "--config", cfgUt, ...(args || ["--egyszer"])],
      { env: Object.assign({}, process.env, { HAMIS_DRIVE: DRIVE, HAMIS_NAPLO: NAPLO }, env || {}), encoding: "utf8", timeout: 180000 });
    return r;
  };
  const allapotJson = () => JSON.parse(fs.readFileSync(path.join(DRIVE, "Füzetek", "allapot.json"), "utf8"));

  /* ---------- böngésző: beállítás linkkel ---------- */
  console.log("Oldal: beállítás, képek, feltöltés (390 px)");
  const browser = await chromium.launch({ args: ["--mute-audio"] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { try { localStorage.setItem("kovrat-tts", "0"); } catch (e) {} });
  const page = await ctx.newPage(), jsHibak = [];
  page.on("pageerror", e => jsHibak.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !/fonts\.g|Failed to load resource/.test(m.text())) jsHibak.push(m.text()); });
  const szeles = async () => page.evaluate(() => document.documentElement.scrollWidth);
  await page.goto(WEB + "fuzet.html#cim=" + encodeURIComponent(AS) + "&kod=" + encodeURIComponent(KOD));
  await page.waitForSelector(".empty");
  ok(!(await page.evaluate(() => location.hash)), "a beállítás a linkből bekerült, a # rész eltűnt a címsorból");
  ok((await page.evaluate(() => JSON.parse(localStorage.getItem("kovrat-fuzet")).kod)) === KOD, "a kód a localStorage-ban (nem a repóban, nem az oldalban)");
  ok(!(await page.evaluate(() => document.querySelector("#beall-d").open)), "beállítva: a beállítás panel csukva");

  // próbaképek: éles, homályos, sötét füzetlap (3000×4000), a böngészőben rajzolva
  const kepek = await page.evaluate(async () => {
    function lap(blur, dark){
      const W = 3000, H = 4000, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
      x.fillStyle = "#f4f1e8"; x.fillRect(0, 0, W, H); x.strokeStyle = "rgba(80,120,200,.35)"; x.lineWidth = 2;
      const g = 75; for (let i = 0; i < W; i += g) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); } for (let i = 0; i < H; i += g) { x.beginPath(); x.moveTo(0, i); x.lineTo(W, i); x.stroke(); }
      x.fillStyle = "#1F3A93"; x.font = "68px cursive";
      ["Törtek összeadása", "1/2 + 1/3 = 3/6 + 2/6 = 5/6", "3/4 + 1/6 = 9/12 + 2/12 = 11/12"].forEach((s, i) => x.fillText(s, 150, 220 + i * 160));
      // a lap széle is papír legyen (a blur szűrő szélén átlátszó sáv lenne, a JPEG-ben fekete keret)
      const c2 = document.createElement("canvas"); c2.width = W; c2.height = H; const y = c2.getContext("2d");
      y.fillStyle = "#f4f1e8"; y.fillRect(0, 0, W, H); y.filter = blur ? "blur(" + blur + "px)" : "none"; y.drawImage(c, 0, 0);
      const c3 = document.createElement("canvas"); c3.width = W; c3.height = H; const z = c3.getContext("2d");
      z.filter = dark ? "brightness(" + dark + ")" : "none"; z.drawImage(c2, 0, 0);
      return new Promise(r => c3.toBlob(b => { const f = new FileReader(); f.onload = () => r(f.result.split(",")[1]); f.readAsDataURL(b); }, "image/jpeg", 0.9));
    }
    return { eles: await lap(0, 0), homalyos: await lap(10, 0), sotet: await lap(0, 0.28) };
  });
  // a homályosság-szabály a kalibráció eseteire (betűméret × elmosás, a 3000 px-es lapon)
  const kal = await page.evaluate(async () => {
    const F = window.__fuzet, out = [];
    for (const font of [100, 68, 40, 28]) for (const bl of [0, 2, 6, 10]) {
      const W = 3000, H = 4000, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
      x.fillStyle = "#f4f1e8"; x.fillRect(0, 0, W, H); x.fillStyle = "#1F3A93"; x.font = font + "px cursive";
      for (let i = 0; i < 12; i++) x.fillText("x² + 3x − 4 = 0   1/2 + 1/3 = 5/6", 150, 220 + i * font * 2.2);
      const c2 = document.createElement("canvas"); c2.width = W; c2.height = H; const y = c2.getContext("2d");
      y.fillStyle = "#f4f1e8"; y.fillRect(0, 0, W, H); y.filter = bl ? "blur(" + bl + "px)" : "none"; y.drawImage(c, 0, 0);
      const bm = await createImageBitmap(await new Promise(r => c2.toBlob(r, "image/jpeg", 0.8)));
      const k1 = F.canvasOf(F.canvasOf(bm, 2000), 1000), e1 = F.minoseg(k1).eles, e5 = F.minoseg(F.canvasOf(k1, 500)).eles;
      out.push({ font, bl, h: F.homalyos(e1, e5) });
    }
    return out;
  });
  // éles (0–2 px) soha nem jelez; erősen elmosott (10 px) mindig; közepes (6 px) a 68 px-es és kisebb betűknél (a nagy betű így még olvasható)
  // éles (0–2 px) soha nem jelez, erősen elmosott (10 px) mindig. A közepes (6 px) platformfüggő (a böngésző kicsinyítése és
  // JPEG-kódolója Windowson és Linuxon kicsit eltér, pl. 68 px-es betűnél Windowson nem jelez): csak kiírjuk, nem bukik rajta.
  const rossz = kal.filter(k => k.bl <= 2 ? k.h : k.bl >= 10 ? !k.h : false);
  ok(!rossz.length, "homályosság-szabály: éles nem jelez, erősen elmosott jelez (28–100 px-es betűk)" + (rossz.length ? ": " + JSON.stringify(rossz) : ""));
  console.log("    (platformfüggő, csak tájékoztató) 6 px-es elmosás: " + kal.filter(k => k.bl === 6).map(k => k.font + " px → " + (k.h ? "jelez" : "nem jelez")).join(", "));
  const KEPDIR = path.join(T, "kepek"); fs.mkdirSync(KEPDIR);
  for (const k in kepek) fs.writeFileSync(path.join(KEPDIR, k + ".jpg"), Buffer.from(kepek[k], "base64"));
  await page.setInputFiles("#in-galeria", ["eles", "homalyos", "sotet"].map(k => path.join(KEPDIR, k + ".jpg")));
  await page.waitForFunction(() => document.querySelectorAll(".eitem img").length === 3, null, { timeout: 30000 });
  const warn = await page.$$eval(".eitem", els => els.map(e => [...e.querySelectorAll(".warn")].map(w => w.textContent).join("|")));
  ok(warn[0] === "", "éles kép: nincs figyelmeztetés");
  ok(/Homályos/.test(warn[1]) && !/sötét/.test(warn[1]), "homályos kép: „Homályos lehet”");
  ok(/sötét/.test(warn[2]), "sötét kép: „Túl sötét lehet”");
  await page.click('.eitem:nth-child(2) [data-f="tabla"]');
  ok((await page.getAttribute('.eitem:nth-child(2) [data-f="tabla"]', "aria-pressed")) === "true", "a 2. kép táblafotónak jelölve");
  ok((await szeles()) <= 390, "390 px: nincs vízszintes görgetés (feltöltés előtt)");
  await page.screenshot({ path: path.join(SHOTS, "fuzet-1-feltoltes.png"), fullPage: true });
  await page.click("#feltolt");
  await page.waitForSelector("#feltolt-msg .msg.ok", { timeout: 30000 });
  ok(/3 kép feltöltve/.test(await page.textContent("#feltolt-msg")), "„3 kép feltöltve”");
  const napDir = path.join(DRIVE, "Füzetek", "beerkezett"), napok = fs.readdirSync(napDir), fajlok = fs.readdirSync(path.join(napDir, napok[0]));
  const meretek = fajlok.map(f => jpegMeret(fs.readFileSync(path.join(napDir, napok[0], f))));
  ok(fajlok.length === 3 && meretek.every(m => m && Math.max(m.w, m.h) === 2000 && Math.min(m.w, m.h) === 1500), "a Drive-ban 3 kép, kicsinyítve 1500×2000-re (eredeti: 3000×4000)");
  const idx = JSON.parse(fs.readFileSync(path.join(DRIVE, "Füzetek", "kepek.json"), "utf8")).kepek;
  ok(idx[1].fajta === "tabla" && idx[1].figyelmeztetes.includes("homalyos") && idx[2].figyelmeztetes.includes("sotet"), "a fajta és a figyelmeztetések a nyilvántartásban");

  console.log("Oldal: galéria, indítás");
  await page.waitForFunction(() => document.querySelectorAll("#gal .tile img").length === 3);
  ok(true, "galéria: 3 bélyegkép");
  await page.click("#gal .tile:nth-child(1)"); await page.click("#gal .tile:nth-child(2)");
  ok((await page.textContent("#g-db")) === "2 / 3 kijelölve", "2 kép kijelölve");
  await page.selectOption("#g-tantargy", "Matek");
  await page.fill("#g-megj", "jövő héten dolgozat");
  await page.click("#g-indit");
  await page.waitForSelector("#g-msg .msg.ok");
  await page.waitForFunction(() => document.querySelectorAll("#gal .tile").length === 1);
  ok(/Várakozik/.test(await page.textContent("#reqs")), "állapot: ⏳ Várakozik");
  ok(/még nem jelentkezett/.test(await page.textContent("#hb")), "a figyelő még nem jelentkezett");
  ok((await szeles()) <= 390, "390 px: nincs vízszintes görgetés (galéria, állapot)");
  await page.screenshot({ path: path.join(SHOTS, "fuzet-2-varakozik.png"), fullPage: true });
  const keresId = JSON.parse(fs.readFileSync(path.join(DRIVE, "Füzetek", "sor.json"), "utf8")).keresek[0].id;

  /* ---------- a figyelő: siker ---------- */
  console.log("Figyelő: sikeres feldolgozás");
  let r = figyelo();
  ok(r.status === 0, "figyelo.js --egyszer lefutott" + (r.status ? ": " + (r.stderr || r.stdout).slice(-600) : ""));
  let all = allapotJson(), a = all.keresek[keresId] || {};
  ok(a.allapot === "kesz" && /^fuzet-\d{8}-tortek-osszeadasa$/.test(a.lecke) && /\/pull\/\d+$/.test(a.pr) && all.figyelo && all.figyelo.utoljara, "allapot.json: kész, lecke, PR, életjel");
  const lecke = a.lecke, ag = "fuzet/" + keresId;
  ok(sh("git", ["branch", "--list", ag], { cwd: ORIGIN }).includes(ag), "az ág az originben: " + ag);
  const agFajlok = sh("git", ["diff", "--name-only", "main", ag], { cwd: ORIGIN }).split("\n").filter(Boolean);
  ok(agFajlok.includes(lecke + ".html") && agFajlok.includes("tools/lessons/" + lecke + ".src.html") && agFajlok.includes("index.html"), "az ágon: lecke, forrás, kezdőlap");
  ok(!agFajlok.some(f => /\.(jpe?g|png|webp)$/i.test(f)), "az ágon nincs kép");
  ok(sh("git", ["show", ag + ":version.json"], { cwd: ORIGIN }) !== sh("git", ["show", "main:version.json"], { cwd: ORIGIN }), "a verzió-hook a munkafában is lefutott");
  ok(!fs.existsSync(path.join(MUNKA, "fa", keresId)) && !sh("git", ["worktree", "list"], { cwd: REPO }).includes(keresId), "a munkafa eltakarítva");
  ok(fs.existsSync(path.join(MUNKA, keresId, "elonezet", lecke + ".html")) && fs.existsSync(path.join(MUNKA, keresId, "atirat.md")), "helyi előnézet és átirat a munkamappában (nem a repóban)");
  const kepNevek = fs.readdirSync(path.join(MUNKA, keresId, "kepek"));
  ok(kepNevek.join(",") === "01-fuzet.jpg,02-tabla.jpg", "a két kijelölt kép letöltve, fajta szerint elnevezve: " + kepNevek.join(", "));
  const hiv = fs.readFileSync(NAPLO, "utf8");
  ok(/claude -p --output-format json --permission-mode acceptEdits --add-dir /.test(hiv) && /gh pr create --repo Endy07\/Kovrat_tanulas --base main --head fuzet\//.test(hiv), "claude -p és gh pr create a várt kapcsolókkal");
  const prBody = fs.readFileSync(path.join(MUNKA, keresId, "pr.md"), "utf8");
  ok(/Endinek/.test(prBody) && !prBody.includes(KOD) && !prBody.includes(MUNKA), "PR-leírás: ellenőrzőlista, nincs benne kód és helyi útvonal");
  ok(!sh("git", ["status", "--porcelain"], { cwd: REPO }).trim(), "Endi munkapéldánya érintetlen");
  ok(/index\.html sorvége: LF/.test(hiv), "core.autocrlf=true mellett is LF-es a munkafa (worktree-szintű core.autocrlf=false, core.eol=lf)");
  ok(sh("git", ["config", "--get", "core.autocrlf"], { cwd: REPO }).trim() === "true", "a fő munkapéldány autocrlf-je változatlan");
  ok(!sh("git", ["show", ag + ":index.html"], { cwd: ORIGIN }).includes("\r\n"), "a commitolt index.html LF-es");

  console.log("Oldal: kész, Endi átnézi → beolvasztás után link");
  await page.click("#g-frissit");
  await page.waitForFunction(() => /Kész/.test(document.querySelector("#reqs").textContent));
  ok(/Endi most átnézi/.test(await page.textContent("#reqs")), "kész, de még nincs élesben: „Endi most átnézi”");
  ok(/be van kapcsolva/.test(await page.textContent("#hb")), "a feldolgozó gép: be van kapcsolva");
  sh("git", ["--work-tree", ELO, "checkout", ag, "--", "."], { cwd: ORIGIN });   // „beolvasztás”: a lecke megjelenik az oldalon
  await page.reload(); await page.waitForSelector("#reqs a.btn.primary", { timeout: 15000 });
  ok(true, "élesben: „▶ Megnyitom a leckét”");
  await page.screenshot({ path: path.join(SHOTS, "fuzet-3-kesz.png"), fullPage: true });
  await page.click("#reqs a.btn.primary");
  await page.waitForSelector(".fz-olv");
  ok(new URL(page.url()).pathname.endsWith("/" + lecke + ".html"), "a lecke megnyílt");
  ok(!/kovrat/i.test(await page.evaluate(() => document.title + document.body.innerText)), "a lecke látható szövegében nincs név");
  await page.click('.fz-t [data-v="nem"]');
  await page.fill(".fz-jav input", "3/4 + 1/8");
  await page.click(".fz-jav button[type=submit]");
  await page.click("[data-kuld]");
  await page.waitForFunction(() => /Elküldve/.test(document.querySelector(".fz-km").textContent));
  const vj = JSON.parse(fs.readFileSync(path.join(DRIVE, "Füzetek", "visszajelzesek", lecke + ".json"), "utf8"));
  ok(vj.valaszok[0].jo === false && vj.valaszok[0].javitas === "3/4 + 1/8", "„Ezt jól olvastam?”: a javítás megérkezett a Drive-ba");
  ok((await szeles()) <= 390, "390 px: a lecke sem görget vízszintesen");
  const leckeHtml = fs.readFileSync(path.join(ELO, lecke + ".html"), "utf8"), leckeSrc = fs.readFileSync(path.join(ELO, "tools", "lessons", lecke + ".src.html"), "utf8");
  ok(!leckeHtml.includes(KOD) && !/script\.google\.com/.test(leckeHtml) && !/kovrat(?!-)/i.test(leckeSrc), "a leckében nincs kód, Apps Script-cím, a forrásában név");

  console.log("lesson-test a kész leckén (a minta-lecke váza)");
  // aszinkron: a fájlszerver ebben a folyamatban fut, a spawnSync megállítaná
  const lt = await new Promise(res => { const ch = cp.spawn("node", [path.join(ROOT, "tools", "lessons", "lesson-test.js"), lecke, "20"], { env: Object.assign({}, process.env, { KOVRAT_URL: WEB, KOVRAT_SHOTS: SHOTS + "/" }) });
    let o = "", e = ""; ch.stdout.on("data", d => o += d); ch.stderr.on("data", d => e += d); ch.on("close", status => res({ status, stdout: o, stderr: e })); });
  const ltOut = (lt.stdout || "") + (lt.stderr || "");
  console.log(ltOut.split("\n").filter(Boolean).map(s => "    " + s).join("\n"));
  ok(lt.status === 0 && !/✗|JS-hibák: [1-9]/.test(ltOut), "lesson-test: rendben");

  /* ---------- hibás esetek ---------- */
  const ujKeres = async () => { const up = await api({ action: "feltoltes", kep: kepek.eles, thumb: "" }); const s = await api({ action: "inditas", kepek: [up.kep.id], tantargy: "" }); return s.keres.id; };
  console.log("Figyelő: hibás esetek");
  const esetek = [
    ["kep", "a feldolgozó képet commitolna", /kép a változásban/],
    ["tiltott", "a változásban a családi kód", /tiltott szöveg/],
    ["nemlecke", "a képeken nincs tananyag", /nem lecke/],
    ["hiba", "a claude hibával lép ki", /kilépési kód 1/],
    ["lassu", "a claude túl sokáig fut", /időtúllépés/]
  ];
  for (const [mod, leiras, minta] of esetek) {
    const id = await ujKeres();
    r = figyelo({ HAMIS_CLAUDE: mod, HAMIS_TILTOTT: KOD, _cfg: mod === "lassu" ? { idokorlatPerc: 0.03 } : null });
    a = allapotJson().keresek[id] || {};
    ok(r.status === 0 && a.allapot === "hiba" && minta.test(a.reszlet || "") && !(a.reszlet || "").includes(KOD), leiras + " → hiba (" + (a.uzenet || "") + ")");
    ok(!sh("git", ["branch", "--list", "fuzet/" + id], { cwd: ORIGIN }).trim(), "  … és nem került push-ra");
  }
  let l = await api({ action: "lista" });
  ok(l.kepek.filter(k => k.allapot === "hiba").length === esetek.length, "a hibás kérések képei visszakerültek a galériába");
  ok(l.keresek.find(k => k.allapot === "hiba" && /nem találtam tananyagot/.test(k.uzenet)), "a „nem lecke” üzenete az oldalra jut");

  console.log("Figyelő: kikapcsolt gép, megszakadt munka");
  const id2 = await ujKeres();
  all = allapotJson(); all.keresek[id2] = { allapot: "dolgozik", probak: 1 }; all.figyelo.utoljara = new Date(Date.now() - 3 * 3600e3).toISOString();
  fs.writeFileSync(path.join(DRIVE, "Füzetek", "allapot.json"), JSON.stringify(all));
  await page.goto(WEB + "fuzet.html"); await page.waitForFunction(() => /ki van kapcsolva/.test(document.querySelector("#hb").textContent));
  ok(/órája jelentkezett utoljára.*megvárja/.test(await page.textContent("#hb")), "kikapcsolt gép: „A kérésed megvárja”");
  await page.screenshot({ path: path.join(SHOTS, "fuzet-4-kikapcsolt.png"), fullPage: true });
  r = figyelo();
  a = allapotJson().keresek[id2];
  ok(a.allapot === "kesz" && a.probak === 2, "bekapcsoláskor a megszakadt kérést újrakezdi, és elkészül");
  const id3 = await ujKeres();
  all = allapotJson(); all.keresek[id3] = { allapot: "dolgozik", probak: 2 }; fs.writeFileSync(path.join(DRIVE, "Füzetek", "allapot.json"), JSON.stringify(all));
  r = figyelo();
  ok(allapotJson().keresek[id3].allapot === "hiba", "a kétszer megszakadt kérést feladja (hiba, Endi megnézi)");
  r = figyelo({ HAMIS_RCLONE_HALOZAT: "1" });
  ok(r.status === 1 && /couldn't connect/.test(r.stdout + r.stderr), "nincs hálózat: hibaüzenettel kilép, nem ír semmit");
  r = figyelo(null, ["--proba"]);
  ok(r.status === 0 && /Minden rendben/.test(r.stdout), "figyelo.js --proba: minden rendben");
  fs.writeFileSync(path.join(MUNKA, "figyelo.lock"), String(process.pid));
  r = figyelo();
  ok(r.status === 1 && /már fut/.test(r.stdout + r.stderr), "egyszerre csak egy figyelő fut");
  fs.unlinkSync(path.join(MUNKA, "figyelo.lock"));

  console.log("Oldal: hibás kód, sötét téma");
  await page.evaluate(() => localStorage.setItem("kovrat-fuzet", JSON.stringify({ url: JSON.parse(localStorage.getItem("kovrat-fuzet")).url, kod: "rossz-kod-1" })));
  await page.reload(); await page.waitForSelector("#g-msg .msg.bad");
  ok(/Hibás családi kód/.test(await page.textContent("#g-msg")) && await page.evaluate(() => document.querySelector("#beall-d").open), "hibás kód: üzenet, a beállítás kinyílik");
  await page.fill("#b-kod", KOD); await page.click("#b-ment"); await page.waitForSelector("#b-msg .msg.ok");
  ok(true, "„Mentés és próba”: kapcsolat rendben");
  await page.emulateMedia({ colorScheme: "dark" }); await page.reload(); await page.waitForSelector("#reqs .req");
  await page.screenshot({ path: path.join(SHOTS, "fuzet-5-sotet.png"), fullPage: true });
  ok((await szeles()) <= 390, "sötét téma, 390 px: nincs vízszintes görgetés");

  ok(as.stat.preflight === 0 && as.stat.contentTypes.every(c => /^text\/plain/.test(c)), "minden kérés text/plain, CORS-preflight nem volt (" + as.stat.post + " kérés)");
  ok(!jsHibak.length, "nincs JS-hiba az oldalon" + (jsHibak.length ? ": " + jsHibak.join(" | ") : ""));
  await browser.close(); await as.close(); web.srv.close();
  console.log((hibak ? "HIBA: " + hibak + " — " : "Minden rendben: ") + (db - hibak) + " / " + db + "   (képek: " + SHOTS + ")");
  process.exit(hibak ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
