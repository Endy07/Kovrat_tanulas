#!/usr/bin/env node
// Füzet-figyelő: Endi Windows-gépén fut (Node 18+), függőség nélkül.
//
// Pár percenként megnézi a Drive-on a sor.json-t (rclone), és ha van várakozó kérés:
//   1. letölti a kijelölt képeket egy helyi mappába (<munkamappa>/<kérés>/kepek/),
//   2. a repó helyi klónjából egy külön munkafát (git worktree) nyit egy új ágon (fuzet/<kérés>), az origin/main-ről,
//   3. ott lefuttatja a `claude -p`-t a feldolgozó prompttal (tools/fuzet/feldolgozo-prompt.md) — az előfizetés terhére,
//   4. ellenőrzi az eredményt (van lecke, nincs kép/kód/név a változásban), pusholja az ágat, PR-t nyit (gh),
//   5. visszaírja az állapotot a Drive-ra (allapot.json; ezt csak a figyelő írja, a sor.json-t csak az Apps Script).
// Ha a gép ki van kapcsolva, a kérés a sor.json-ban vár; bekapcsoláskor (a figyelő indulásakor) sorra kerül.
// Ha feldolgozás közben kapcsolták ki, induláskor újrakezdi (legfeljebb maxProba-szor).
//
// Használat:
//   node figyelo.js                 folyamatosan fut (a Feladatütemező ezt indítja bejelentkezéskor)
//   node figyelo.js --egyszer       egy kör: minden várakozó kérést feldolgoz, aztán kilép
//   node figyelo.js --proba         csak a beállítást ellenőrzi (rclone, claude, git, gh), nem dolgoz fel
//   --config <fájl>                 más beállításfájl (alapból: a mellette lévő figyelo.config.json)
// Leírás: tools/fuzet/figyelo/README.md
"use strict";
const fs = require("fs"), path = require("path"), cp = require("child_process");

const ARGS = process.argv.slice(2);
const kapcsolo = n => ARGS.includes(n);
const ertek = n => { const i = ARGS.indexOf(n); return i >= 0 ? ARGS[i + 1] : null; };
const CFG_UT = path.resolve(ertek("--config") || path.join(__dirname, "figyelo.config.json"));

const ALAP = {
  repo: "",                        // a repó helyi klónja (pl. C:\\xampp\\htdocs\\Kovrat)
  munkamappa: "",                  // ide kerülnek a képek, a naplók, a munkafák (NEM a repóban)
  tavoli: "gdrive:Füzetek",        // rclone-útvonal: a remote neve és az Apps Script GYOKER_MAPPA-ja
  percenkent: 3,
  rclone: ["rclone"],
  claude: ["claude"],
  claudeModell: "",                // üres: a claude alapértelmezése
  claudeEszkozok: "Read Write Edit Glob Grep Task Agent TodoWrite Bash(node:*) Bash(python:*) Bash(python3:*) Bash(py:*) Bash(git status:*) Bash(git diff:*) Bash(git log:*) Bash(git add:*) Bash(git commit:*) Bash(git show:*) Bash(ls:*) Bash(mkdir:*) Bash(cp:*) Bash(curl:*) Bash(sleep:*) Bash(kill:*)",
  git: ["git"],
  gh: ["gh"],                      // null: nincs PR, csak push és összehasonlító link
  github: "Endy07/Kovrat_tanulas",
  alapag: "main",
  remote: "origin",
  oldal: "https://endy07.github.io/Kovrat_tanulas/",
  tiltott: [],                     // ezek a szövegek nem lehetnek a változásban (családi kód, nevek…); kis- és nagybetű mindegy
  idokorlatPerc: 120,
  maxProba: 2,
  eletjelPerc: 10
};
const MINDIG_TILTOTT = ["script.google.com/macros/s/"];
const KEP_KITERJ = /\.(jpe?g|jfif|png|gif|webp|heic|heif|bmp|tiff?)$/i;
const NEM_NYULHAT = /^(tools\/fuzet\/|\.githooks\/|\.gitignore$|CLAUDE\.md$)/;
const KOZOS = /^tools\/lessons\/(kit\.|python\.|helyesiras\.|build\.js|lesson-test\.js|update\.js|py-check\.js|fuzet-lecke\.)/;

/* ---------------- beállítás, napló ---------------- */

function beallitas() {
  let c;
  try { c = JSON.parse(fs.readFileSync(CFG_UT, "utf8").replace(/^\uFEFF/, "")); }
  catch (e) { throw new Error("Nem olvasható a beállításfájl: " + CFG_UT + " (" + e.message + "). Másold le a figyelo.config.example.json-t erre a névre."); }
  c = Object.assign({}, ALAP, c);
  for (const k of ["repo", "munkamappa"]) if (!c[k]) throw new Error("Hiányzik a beállításból: " + k);
  c.repo = path.resolve(path.dirname(CFG_UT), c.repo);
  c.munkamappa = path.resolve(path.dirname(CFG_UT), c.munkamappa);
  if (path.relative(c.repo, c.munkamappa).split(path.sep)[0] !== "..") throw new Error("A munkamappa ne legyen a repón belül (a képek nem kerülhetnek a repóba).");
  c.tavoli = c.tavoli.replace(/\/+$/, "");
  c.tiltott = (c.tiltott || []).filter(s => typeof s === "string" && s.trim().length >= 3).concat(MINDIG_TILTOTT);
  return c;
}
let CFG = null, NAPLO = null;
function naplo(...a) {
  const s = new Date().toISOString().replace("T", " ").slice(0, 19) + "  " + a.join(" ");
  console.log(s);
  if (NAPLO) try { fs.appendFileSync(NAPLO, s + "\n"); } catch (e) {}
}
const varj = ms => new Promise(r => setTimeout(r, ms));

/* ---------------- parancsok futtatása (Windowson is) ---------------- */

function feloldParancs(cmd) {
  if (process.platform !== "win32" || path.extname(cmd)) return cmd;
  const exts = (process.env.PATHEXT || ".EXE;.CMD;.BAT").split(";").filter(Boolean);
  const dirs = /[\\/]/.test(cmd) ? [""] : (process.env.PATH || "").split(path.delimiter);
  for (const d of dirs) for (const e of exts) { const p = d ? path.join(d, cmd + e) : cmd + e; if (fs.existsSync(p)) return p; }
  return cmd;
}
// cmd.exe-nek: idézőjelbe, a belső idézőjel és az előtte álló \ jelek a C-futtatókörnyezet szabálya szerint
const winArg = a => '"' + String(a).replace(/(\\*)"/g, '$1$1\\"').replace(/(\\+)$/, "$1$1") + '"';
function futtat(parancs, args, o = {}) {
  return new Promise(resolve => {
    const [cmd0, ...elo] = parancs, cmd = feloldParancs(cmd0), mind = [...elo, ...args];
    const win = process.platform === "win32", batch = win && /\.(cmd|bat)$/i.test(cmd);
    const opts = { cwd: o.cwd, env: Object.assign({}, process.env, o.env || {}), windowsHide: true, detached: !win };
    let ch;
    try {
      ch = batch ? cp.spawn(winArg(cmd) + " " + mind.map(winArg).join(" "), Object.assign(opts, { shell: true })) : cp.spawn(cmd, mind, opts);
    } catch (e) { return resolve({ code: -1, stdout: "", stderr: e.message }); }
    const out = [], err = [];
    let lejart = false;
    const t = o.idokorlat ? setTimeout(() => { lejart = true; olj(ch); }, o.idokorlat) : null;
    ch.stdout.on("data", d => { out.push(d); if (o.kiir) o.kiir.write(d); });
    ch.stderr.on("data", d => { err.push(d); if (o.kiir) o.kiir.write(d); });
    ch.on("error", e => err.push(Buffer.from(String(e.message))));
    ch.on("close", code => { if (t) clearTimeout(t); resolve({ code: lejart ? -2 : code, lejart, stdout: Buffer.concat(out).toString("utf8"), stderr: Buffer.concat(err).toString("utf8") }); });
    if (o.input != null) { ch.stdin.on("error", () => {}); ch.stdin.end(o.input); } else ch.stdin.end();
  });
}
function olj(ch) {
  try {
    if (process.platform === "win32") cp.spawnSync("taskkill", ["/pid", String(ch.pid), "/T", "/F"], { windowsHide: true });
    else process.kill(-ch.pid, "SIGKILL");
  } catch (e) { try { ch.kill("SIGKILL"); } catch (e2) {} }
}
async function kell(parancs, args, o) {
  const r = await futtat(parancs, args, o);
  if (r.code !== 0) throw new Error(parancs.join(" ") + " " + args.slice(0, 3).join(" ") + " → " + (r.lejart ? "időtúllépés" : "kilépési kód " + r.code) + ": " + (r.stderr || r.stdout).trim().slice(-500));
  return r.stdout;
}
const git = (args, cwd) => kell(CFG.git, args, { cwd: cwd || CFG.repo });

/* ---------------- Drive (rclone) ---------------- */

const tav = rel => CFG.tavoli + "/" + rel;
async function olvasTavoli(rel, alap) {
  const r = await futtat(CFG.rclone, ["cat", tav(rel)], { idokorlat: 120000 });
  if (r.code !== 0) {
    if (/not found|doesn't exist|does not exist|no such/i.test(r.stderr)) return alap;
    throw new Error("rclone cat " + rel + ": " + r.stderr.trim().slice(-300));
  }
  if (!r.stdout.trim()) return alap;
  try { return JSON.parse(r.stdout.replace(/^\uFEFF/, "")); } catch (e) { throw new Error(rel + " nem érvényes JSON: " + e.message); }
}
async function irTavoli(rel, adat) {
  const tmp = path.join(CFG.munkamappa, ".ki-" + path.basename(rel));
  fs.writeFileSync(tmp, JSON.stringify(adat, null, 1));
  await kell(CFG.rclone, ["copyto", "--ignore-times", tmp, tav(rel)], { idokorlat: 120000 });
}

/* ---------------- állapot ---------------- */

let ALL = { keresek: {}, figyelo: {} }, utolsoEletjel = 0;
async function allapot(id, adat) {
  ALL.keresek[id] = Object.assign({}, ALL.keresek[id] || {}, adat, { frissitve: new Date().toISOString() });
  ALL.figyelo = { utoljara: new Date().toISOString(), gep: "figyelo" };
  try { await irTavoli("allapot.json", ALL); utolsoEletjel = Date.now(); }
  catch (e) { naplo("! az állapot írása nem sikerült:", e.message); }
}
async function eletjel(kell_) {
  if (!kell_ && Date.now() - utolsoEletjel < CFG.eletjelPerc * 60000) return;
  ALL.figyelo = { utoljara: new Date().toISOString(), gep: "figyelo" };
  try { await irTavoli("allapot.json", ALL); utolsoEletjel = Date.now(); } catch (e) { naplo("! életjel:", e.message); }
}
const allapotOf = id => (ALL.keresek[id] && ALL.keresek[id].allapot) || "varakozik";

/* ---------------- egy kérés feldolgozása ---------------- */

const helyiNap = () => { const d = new Date(), z = n => String(n).padStart(2, "0"); return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); };

async function feldolgoz(r) {
  if (!/^k[0-9a-z-]{6,40}$/.test(r.id)) throw new Error("Furcsa kérésazonosító: " + r.id);
  const probak = ((ALL.keresek[r.id] || {}).probak || 0) + 1;
  naplo("▶ kérés", r.id, "·", (r.kepek || []).length, "kép ·", r.tantargy || "(tantárgy: felismeri)", "· próba", probak);
  await allapot(r.id, { allapot: "dolgozik", probak, uzenet: "", kezdve: new Date().toISOString() });

  const job = path.join(CFG.munkamappa, r.id), kepDir = path.join(job, "kepek"), fa = path.join(CFG.munkamappa, "fa", r.id);
  const ag = "fuzet/" + r.id, eredmenyUt = path.join(job, "eredmeny.json");
  fs.mkdirSync(kepDir, { recursive: true });
  try { fs.unlinkSync(eredmenyUt); } catch (e) {}

  // 1. képek
  const kepek = [];
  for (let i = 0; i < (r.kepek || []).length; i++) {
    const k = r.kepek[i];
    if (typeof k.ut !== "string" || !/^beerkezett\/[0-9-]+\/[0-9a-z-]+\.(jpg|png|webp)$/.test(k.ut)) throw new Error("Furcsa képútvonal: " + k.ut);
    const hova = path.join(kepDir, String(i + 1).padStart(2, "0") + "-" + (k.fajta === "tabla" ? "tabla" : "fuzet") + path.extname(k.ut));
    if (!fs.existsSync(hova)) await kell(CFG.rclone, ["copyto", tav(k.ut), hova], { idokorlat: 300000 });
    kepek.push({ fajl: hova, fajta: k.fajta === "tabla" ? "tábla" : "füzet", figyelmeztetes: k.figyelmeztetes || [] });
  }
  if (!kepek.length) throw new Error("A kérésben nincs kép.");
  naplo("  képek letöltve:", kepek.length, "→", kepDir);

  // 2. munkafa az origin/main-ről, új ágon (Endi saját munkapéldányához nem nyúl)
  await git(["fetch", CFG.remote, CFG.alapag]);
  await futtat(CFG.git, ["worktree", "remove", "--force", fa], { cwd: CFG.repo });
  if (fs.existsSync(fa)) fs.rmSync(fa, { recursive: true, force: true });
  await git(["worktree", "prune"]);
  fs.mkdirSync(path.dirname(fa), { recursive: true });
  // a munkafa mindig LF-es (Windowson a rendszerszintű core.autocrlf=true CRLF-et tenne ki): a munkafa SAJÁT beállítása
  // (worktree-szintű config, ez minden más szintet felülír), Endi fő munkapéldányát nem érinti. Előbb üresen jön létre,
  // a beállítás után kerülnek ki a fájlok.
  await git(["worktree", "add", "--no-checkout", "-B", ag, fa, CFG.remote + "/" + CFG.alapag]);
  await git(["config", "extensions.worktreeConfig", "true"]);
  await git(["config", "--worktree", "core.autocrlf", "false"], fa);
  await git(["config", "--worktree", "core.eol", "lf"], fa);
  await git(["reset", "-q", "--hard"], fa);
  const alap = (await git(["rev-parse", "HEAD"], fa)).trim();

  try {
    // 3. claude -p
    const prompt = fs.readFileSync(path.join(__dirname, "..", "feldolgozo-prompt.md"), "utf8") + "\n\n## A mostani feladat (a figyelő tölti ki)\n\n```json\n" + JSON.stringify({
      keres: r.id, datum: helyiNap(), ag, leckeElotag: "fuzet-" + helyiNap().replace(/-/g, "") + "-",
      kepek, tantargy: r.tantargy || "", megjegyzes: r.megjegyzes || "",
      eredmeny: eredmenyUt, atirat: path.join(job, "atirat.md"), munkamappa: job
    }, null, 2) + "\n```\n";
    fs.writeFileSync(path.join(job, "prompt.md"), prompt);
    const args = ["-p", "--output-format", "json", "--permission-mode", "acceptEdits", "--add-dir", job, "--allowedTools", CFG.claudeEszkozok];
    if (CFG.claudeModell) args.push("--model", CFG.claudeModell);
    naplo("  claude -p fut (legfeljebb", CFG.idokorlatPerc, "perc)… napló:", path.join(job, "claude.log"));
    const kiir = fs.createWriteStream(path.join(job, "claude.log"));
    const cr = await futtat(CFG.claude, args, { cwd: fa, input: prompt, idokorlat: CFG.idokorlatPerc * 60000, kiir, env: { KOVRAT_FUZET_KERES: r.id } });
    kiir.end();
    if (cr.lejart) throw hiba("A feldolgozás túl sokáig tartott.", "claude: időtúllépés (" + CFG.idokorlatPerc + " perc)");
    if (cr.code !== 0) throw hiba("A feldolgozás elakadt.", "claude kilépési kód " + cr.code + ": " + (cr.stderr || cr.stdout).trim().slice(-400));

    // 4. eredmény ellenőrzése
    let e;
    try { e = JSON.parse(fs.readFileSync(eredmenyUt, "utf8").replace(/^\uFEFF/, "")); }
    catch (x) { throw hiba("A feldolgozás nem adott eredményt.", "nincs vagy hibás eredmeny.json: " + x.message); }
    if (e.allapot === "nem-lecke") throw hiba(String(e.uzenet || "A képekből nem lehetett leckét készíteni.").slice(0, 300), "a feldolgozó szerint nem lecke: " + (e.uzenet || ""));
    if (typeof e.lecke !== "string" || !/^fuzet-[a-z0-9-]{3,80}$/.test(e.lecke)) throw hiba("A feldolgozás hibás eredményt adott.", "hibás leckenév: " + e.lecke);
    if ((await git(["status", "--porcelain"], fa)).trim()) {
      await git(["add", "-A"], fa);
      await git(["commit", "-q", "-m", "Füzet-lecke: a feldolgozó le nem commitolt módosításai"], fa);
    }
    const ellenorzes = await ellenoriz(fa, alap, e);
    if (ellenorzes.hibak.length) throw hiba("Az ellenőrzés hibát talált, Endi megnézi.", ellenorzes.hibak.join("; "));

    // előnézet Endinek (a gépén, nem a repóban): dupla kattintással megnyílik
    const elo = path.join(job, "elonezet");
    fs.mkdirSync(elo, { recursive: true });
    fs.copyFileSync(path.join(fa, e.lecke + ".html"), path.join(elo, e.lecke + ".html"));

    // 5. push és PR
    await git(["push", "--force", "-u", CFG.remote, ag], fa);
    const body = prSzoveg(r, e, ellenorzes);
    const tilt = tiltottBenne(body);
    if (tilt) throw hiba("Az ellenőrzés hibát talált, Endi megnézi.", "tiltott szöveg a PR leírásában: " + tilt);
    fs.writeFileSync(path.join(job, "pr.md"), body);
    const pr = await prNyit(ag, "Füzet-lecke: " + (e.cim || e.lecke), path.join(job, "pr.md"));
    naplo("  ✓ kész:", e.lecke, "·", pr);
    await allapot(r.id, {
      allapot: "kesz", uzenet: "", lecke: e.lecke, cim: String(e.cim || "").slice(0, 120), tantargy: String(e.tantargy || "").slice(0, 40),
      tema: String(e.tema || "").slice(0, 120), bizonytalan: Number(e.bizonytalan) || 0, pr, ag
    });
  } finally {
    await futtat(CFG.git, ["worktree", "remove", "--force", fa], { cwd: CFG.repo });
  }
}
function hiba(kovratnak, reszlet) { const e = new Error(reszlet); e.kovratnak = kovratnak; return e; }
function tiltottBenne(s) {
  const kis = String(s).toLowerCase();
  const t = CFG.tiltott.find(x => kis.includes(x.toLowerCase()));
  return t ? (t.length > 6 ? t.slice(0, 3) + "…" : "***") : "";   // a naplóba se kerüljön ki a teljes kód
}
async function ellenoriz(fa, alap, e) {
  const hibak = [], figyel = [];
  const fajlok = (await git(["diff", "--name-only", alap, "HEAD"], fa)).split("\n").filter(Boolean);
  if (!fajlok.length) hibak.push("nincs változás az ágon");
  for (const f of fajlok) {
    if (KEP_KITERJ.test(f)) hibak.push("kép a változásban: " + f);
    if (NEM_NYULHAT.test(f)) hibak.push("tiltott helyen módosított: " + f);
    if (KOZOS.test(f)) figyel.push(f);
  }
  for (const sor of (await git(["diff", "--numstat", alap, "HEAD"], fa)).split("\n")) if (/^-\t-\t/.test(sor)) hibak.push("bináris fájl: " + sor.slice(4));
  const hozzaadott = (await git(["diff", "-U0", alap, "HEAD"], fa)).split("\n").filter(l => l.startsWith("+") && !l.startsWith("+++")).join("\n");
  const t = tiltottBenne(hozzaadott);
  if (t) hibak.push("tiltott szöveg a változásban (" + t + ")");
  for (const f of [e.lecke + ".html", "tools/lessons/" + e.lecke + ".src.html"]) if (!fs.existsSync(path.join(fa, f))) hibak.push("hiányzik: " + f);
  const idx = fs.existsSync(path.join(fa, "index.html")) ? fs.readFileSync(path.join(fa, "index.html"), "utf8") : "";
  if (!idx.includes('href="' + e.lecke + '.html"')) hibak.push("a lecke nincs a kezdőlapon (index.html)");
  return { hibak, figyel, fajlok };
}
function prSzoveg(r, e, ell) {
  const L = [];
  L.push("Füzetfotóból készült lecke (a figyelő és a `claude -p` készítette, a `tools/fuzet/feldolgozo-prompt.md` szerint).", "");
  L.push("- **Lecke:** `" + e.lecke + ".html` (élesben a beolvasztás után: " + CFG.oldal + e.lecke + ".html)");
  if (e.tantargy || e.tema) L.push("- **Tantárgy, téma:** " + [e.tantargy, e.tema].filter(Boolean).join(" · "));
  L.push("- **Képek:** " + (r.kepek || []).length + " (" + (r.kepek || []).map(k => k.fajta === "tabla" ? "tábla" : "füzet").join(", ") + "); a fotók NEM kerültek a repóba");
  L.push("- **Bizonytalan olvasás:** " + (Number(e.bizonytalan) || 0) + " hely (a lecke elején: „Ezt jól olvastam?”)");
  if (e.osszefoglalo) L.push("", "### Mi van benne", "", String(e.osszefoglalo).slice(0, 3000));
  if (e.teszt) L.push("", "### Gépi teszt", "", String(e.teszt).slice(0, 1500));
  if (e.lektor) L.push("", "### Lektor", "", String(e.lektor).slice(0, 1500));
  if (ell.figyel.length) L.push("", "### ⚠️ Közös fájlt is módosított", "", ell.figyel.map(f => "- `" + f + "`").join("\n"), "", "Ezt nézd meg külön: a többi leckét is érinti.");
  L.push("", "### Endinek", "", "- [ ] A „Ezt jól olvastam?” részt Kovrattal átnézni (vagy a válaszát megvárni)",
    "- [ ] A lecke átnézése (helyi előnézet: a figyelő munkamappájában, `<kérés>/elonezet/`)", "- [ ] Beolvasztás, ha jó");
  L.push("", "🤖 Generated with [Claude Code](https://claude.com/claude-code)");
  return L.join("\n");
}
async function prNyit(ag, cim, bodyFajl) {
  const osszevet = "https://github.com/" + CFG.github + "/compare/" + CFG.alapag + "..." + ag + "?expand=1";
  if (!CFG.gh) return osszevet;
  const r = await futtat(CFG.gh, ["pr", "create", "--repo", CFG.github, "--base", CFG.alapag, "--head", ag, "--title", cim, "--body-file", bodyFajl], { cwd: CFG.repo, idokorlat: 120000 });
  const url = (r.stdout.match(/https:\/\/github\.com\/\S+\/pull\/\d+/) || [])[0];
  if (r.code === 0 && url) return url;
  const v = await futtat(CFG.gh, ["pr", "view", ag, "--repo", CFG.github, "--json", "url", "-q", ".url"], { cwd: CFG.repo, idokorlat: 60000 });
  if (v.code === 0 && /^https:/.test(v.stdout.trim())) return v.stdout.trim();
  naplo("  ! PR nem nyílt (gh):", (r.stderr || r.stdout).trim().slice(-300), "→ összehasonlító link");
  return osszevet;
}

/* ---------------- egy kör ---------------- */

async function kor() {
  const sor = await olvasTavoli("sor.json", { keresek: [] });
  const all = await olvasTavoli("allapot.json", null);
  if (all && all.keresek) ALL = all;
  if (!ALL.figyelo) ALL.figyelo = {};
  // feldolgozás közben kikapcsolt gép: újrakezdés (vagy feladás)
  for (const r of sor.keresek || []) {
    const a = ALL.keresek[r.id];
    if (a && a.allapot === "dolgozik") {
      if ((a.probak || 0) >= CFG.maxProba) await allapot(r.id, { allapot: "hiba", uzenet: "A feldolgozás többször megszakadt. Endi megnézi." });
      else { naplo("↺ megszakadt kérés, újra sorba:", r.id); ALL.keresek[r.id].allapot = "varakozik"; }
    }
  }
  const varo = (sor.keresek || []).filter(r => allapotOf(r.id) === "varakozik");
  await eletjel(false);
  for (const r of varo) {
    try { await feldolgoz(r); }
    catch (e) {
      naplo("✗ kérés", r.id, "hiba:", e.message);
      const probak = (ALL.keresek[r.id] || {}).probak || 1;
      await allapot(r.id, { allapot: "hiba", uzenet: e.kovratnak || "A feldolgozás nem sikerült. Endi megnézi.", reszlet: String(e.message).slice(0, 500), probak });
    }
  }
  return varo.length;
}

/* ---------------- próba ---------------- */

async function proba() {
  let jo = true;
  const p = async (nev, fv) => { try { const s = await fv(); console.log("✓", nev, s ? "— " + s : ""); } catch (e) { jo = false; console.log("✗", nev, "—", e.message); } };
  await p("beállítás", async () => CFG_UT);
  await p("munkamappa", async () => { fs.mkdirSync(CFG.munkamappa, { recursive: true }); return CFG.munkamappa; });
  await p("feldolgozó prompt", async () => { if (!fs.existsSync(path.join(__dirname, "..", "feldolgozo-prompt.md"))) throw new Error("nincs meg"); return "megvan"; });
  await p("git, repó", async () => (await git(["remote", "get-url", CFG.remote])).trim());
  await p("git hook (verzió)", async () => { const h = (await futtat(CFG.git, ["config", "core.hooksPath"], { cwd: CFG.repo })).stdout.trim(); if (h !== ".githooks") throw new Error("állítsd be: git config core.hooksPath .githooks"); return h; });
  await p("rclone", async () => (await kell(CFG.rclone, ["version"])).split("\n")[0]);
  await p("Drive-mappa (" + CFG.tavoli + ")", async () => { const s = await kell(CFG.rclone, ["lsf", CFG.tavoli, "--max-depth", "1"], { idokorlat: 60000 }); return s.split("\n").filter(Boolean).join(", ") || "üres (az Apps Script az első feltöltéskor tölti meg)"; });
  await p("claude", async () => (await kell(CFG.claude, ["--version"])).trim());
  if (CFG.gh) await p("gh (PR-hez)", async () => { await kell(CFG.gh, ["auth", "status"]); return "bejelentkezve"; });
  else console.log("– gh nincs beállítva: PR helyett összehasonlító link lesz");
  console.log(jo ? "\nMinden rendben." : "\nVan, amit be kell állítani (fent).");
  return jo;
}

/* ---------------- indulás ---------------- */

function zar() {
  const z = path.join(CFG.munkamappa, "figyelo.lock");
  const el_ = pid => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; } };
  let pid = 0;
  try { pid = Number(fs.readFileSync(z, "utf8")); } catch (e) {}
  if (pid && pid !== process.pid && el_(pid)) throw new Error("A figyelő már fut (PID " + pid + ").");
  fs.writeFileSync(z, String(process.pid));
  const torol = () => { try { if (Number(fs.readFileSync(z, "utf8")) === process.pid) fs.unlinkSync(z); } catch (e) {} };
  process.on("exit", torol);
  for (const s of ["SIGINT", "SIGTERM"]) process.on(s, () => { torol(); process.exit(130); });
}

async function main() {
  CFG = beallitas();
  fs.mkdirSync(CFG.munkamappa, { recursive: true });
  NAPLO = path.join(CFG.munkamappa, "figyelo.log");
  if (kapcsolo("--proba")) process.exit((await proba()) ? 0 : 1);
  zar();
  naplo("Füzet-figyelő indul ·", CFG.tavoli, "·", CFG.percenkent, "percenként");
  if (kapcsolo("--egyszer")) { const n = await kor(); naplo("kész, feldolgozott kérés:", n); return; }
  for (;;) {
    try { await kor(); } catch (e) { naplo("! kör hiba:", e.message); }
    await varj(CFG.percenkent * 60000);
  }
}
if (require.main === module) main().catch(e => { naplo("✗", e.message); process.exit(1); });
module.exports = { winArg, feloldParancs };
