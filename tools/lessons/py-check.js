// A Python-dolgozat lecke ellenőrzője, böngésző nélkül, a helyi Pythonnal (ugyanazzal a kerettel, ami a Pyodide-ban fut).
// Használat:
//   node tools/lessons/py-check.js --write        az 52 eredeti feladat példafutását beírja a forrás /*@OUTS*/ blokkjába
//   node tools/lessons/py-check.js --verify [N]   minden „Írd meg” sablon × szint × N feladat: a mintamegoldás átmegy-e
//                                                 a saját ellenőrzésen; a „Mit ír ki?” válaszai egyeznek-e a valódi Pythonnal
//   node tools/lessons/py-check.js --verify N <lecke>   a Python-sorozat egy leckéje (python-1-kiiras, …), a közös
//                                                 python.js keretével: Mit ír ki? · Írd meg!/Javítsd ki! (a minta átmegy,
//                                                 a kiinduló kód nem) · Milyen hibát ad? · Milyen típusú? · változónév · a diák példái
const fs = require("fs"), path = require("path"), { spawnSync } = require("child_process");
const SRC = path.join(__dirname, "python-dolgozat.src.html");
let src = fs.readFileSync(SRC, "utf8");
const block = name => { const m = new RegExp("/\\*@" + name + "\\*/([\\s\\S]*?)/\\*@/" + name + "\\*/").exec(src); if (!m) throw new Error("nincs blokk: " + name); return m[1]; };
const HARNESS = new Function(block("HARNESS") + "\nreturn HARNESS;")();
const DRIVER = [
  "import sys, json",
  "sys.stdout.reconfigure(encoding='utf-8')",
  "d = json.loads(sys.stdin.buffer.read().decode('utf-8'))",
  "g = {}",
  "exec(d['harness'], g)",
  "res = [g['_kovrat_run'](j['code'], j['inputs']) for j in d['jobs']]",
  "sys.__stdout__.write(json.dumps(res, ensure_ascii=False))"
].join("\n");
// a sorozat-leckéknél minden futás legfeljebb 0,5 mp (végtelen ciklus → TimeoutError, mint a böngészőben az időkorlát).
// Platformfüggetlen (Windowson nincs SIGALRM): sys.settrace, és csak a diák programjának (<program>) soraiban dob.
const DRIVER_T = DRIVER.replace("res = [g['_kovrat_run'](j['code'], j['inputs']) for j in d['jobs']]", [
  "import time",
  "def _tracer(deadline):",
  "    def tr(frame, event, arg):",
  "        if frame.f_code.co_filename == '<program>' and time.monotonic() > deadline:",
  "            raise TimeoutError('időtúllépés')",
  "        return tr",
  "    return tr",
  "res = []",
  "for j in d['jobs']:",
  "    sys.settrace(_tracer(time.monotonic() + 0.5))",
  "    try:",
  "        r = g['_kovrat_run'](j['code'], j['inputs'], j.get('opts'))",
  "    finally:",
  "        sys.settrace(None)",
  "    res.append(r)"].join("\n"));
function pyRun(jobs, harness){
  const r = spawnSync("python", harness ? ["-I", "-X", "utf8", "-c", DRIVER_T] : ["-I", "-c", DRIVER], { input: Buffer.from(JSON.stringify({ harness: harness || HARNESS, jobs }), "utf8"), maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error("python hiba: " + r.stderr.toString());
  return JSON.parse(r.stdout.toString("utf8"));
}
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const arg = process.argv[2];
if (arg === "--verify" && process.argv[4] && process.argv[4] !== "python-dolgozat") process.exit(series(process.argv[4], Number(process.argv[3] || 30)));
if (arg === "--write"){
  const ORIG = new Function(block("ORIG") + "\nreturn ORIG;")();
  const res = pyRun(ORIG.map(o => ({ code: o.code, inputs: o.ins })));
  const outs = {}; let bad = 0;
  ORIG.forEach((o, i) => {
    const r = res[i];
    if (r.err || r.used !== o.ins.length){ bad++; console.log("HIBA a mintában (" + o.n + ". feladat):", r.err || ("bemenet: " + r.used + "/" + o.ins.length)); }
    outs[o.n] = { segs: r.segs, err: r.err, line: r.line };
  });
  src = src.replace(/(\/\*@OUTS\*\/)[\s\S]*?(\/\*@\/OUTS\*\/)/, (m, a, b) => a + "\n  const OUTS = " + JSON.stringify(outs) + ";\n" + b);
  fs.writeFileSync(SRC, src);
  console.log("OUTS kész:", ORIG.length, "feladat,", bad, "hibás");
  process.exit(bad ? 1 : 0);
}
if (arg === "--verify"){
  const N = Number(process.argv[3] || 30);
  const L = new Function("rnd", "pick", "shuffle", "esc", block("LOGIC") + "\nreturn LOGIC;")(rnd, pick, shuffle, esc);
  const jobs = [], meta = [];
  const stripCom = L.stripCom;
  for (const [bn, B] of [["VALT", L.VALT], ["FV", L.FV], ["STR", L.STR], ["MET", L.MET], ["KOMP", L.KOMP]])
    B.forEach((lv, li) => lv.forEach((tpl, ti) => { for (let k = 0; k < N; k++){
      const T = tpl(), where = bn + " " + (li + 1) + ". szint #" + (ti + 1);
      const s = stripCom(T.code);
      (T.must || []).forEach(([re, m]) => { if (!re.test(s)) console.log("MUST nem teljesül:", where, m); });
      if (!L.fstr.test(s)) console.log("nincs f-string:", where);
      if (T.tests[0].ins.join("|") === T.tests[1].ins.join("|")) meta.push(null), jobs.push({ code: "", inputs: [] }), console.log("két egyforma próbabemenet:", where, T.tests[0].ins);
      T.tests.forEach(t => { jobs.push({ code: T.code, inputs: t.ins }); meta.push({ where, t, q: T.q }); });
    } }));
  const KJ = [];
  L.KIIR.forEach((lv, li) => lv.forEach((tpl, ti) => { for (let k = 0; k < N; k++){ const t = tpl(); KJ.push({ where: "KIIR " + (li + 1) + ". szint #" + (ti + 1), t }); } }));
  const res = pyRun(jobs.concat(KJ.map(x => ({ code: x.t.code, inputs: [] }))));
  let fails = 0, n = 0;
  meta.forEach((m, i) => { if (!m) return; n++; const r = res[i];
    if (r.err){ fails++; if (fails < 15) console.log("HIBA:", m.where, r.err, m.t.ins); return; }
    if (r.used !== m.t.ins.length){ fails++; if (fails < 15) console.log("BEMENET:", m.where, r.used, m.t.ins); return; }
    const miss = L.cmpOut(r.out, m.t.exp);
    if (miss.length){ fails++; if (fails < 15) console.log("ELTÉRÉS:", m.where, JSON.stringify(miss), "\n  bemenet:", JSON.stringify(m.t.ins), "\n  kimenet:", JSON.stringify(r.out)); }
  });
  let kf = 0;
  KJ.forEach((x, i) => { const r = res[jobs.length + i], out = r.out.replace(/\n$/, "");
    if (r.err || out !== x.t.ans){ kf++; if (kf < 15) console.log("KIIR ELTÉR:", x.where, JSON.stringify(x.t.code), "Python:", JSON.stringify(out), r.err, "JS:", JSON.stringify(x.t.ans)); } });
  console.log("Írd meg: " + (n - fails) + "/" + n + " futás jó · Mit ír ki?: " + (KJ.length - kf) + "/" + KJ.length + " jó");
  process.exit(fails || kf ? 1 : 0);
}
console.log("Használat: node tools/lessons/py-check.js --write | --verify [N]");

/* ---------- A Python-sorozat leckéi: a közös python.js keretével ---------- */
function series(name, N){
  const lib = fs.readFileSync(path.join(__dirname, "python.js"), "utf8");
  const lsrc = fs.readFileSync(path.join(__dirname, name + ".src.html"), "utf8");
  const blk = (txt, b) => { const m = new RegExp("/\\*@" + b + "\\*/([\\s\\S]*?)/\\*@/" + b + "\\*/").exec(txt); if (!m) throw new Error("nincs blokk: " + b); return m[1]; };
  const H = new Function(blk(lib, "HARNESS") + "\nreturn PY_HARNESS;")();
  const PC = new Function(blk(lib, "PYCORE") + "\nreturn PYCORE;")();
  // ismétlő lecke: a behúzott leckék logikája (<!--@PYLOGIC a b …-->) PYL-ként
  const PYL = {};
  const um = /<!--@PYLOGIC ([^>]*?)-->/.exec(lsrc);
  if (um) for (const l of um[1].trim().split(/\s+/)) PYL[l] = new Function("K", "P", blk(fs.readFileSync(path.join(__dirname, l + ".src.html"), "utf8"), "LOGIC") + "\nreturn LOGIC;")({ rnd, pick, shuffle, esc }, { C: PC });
  const L = new Function("K", "P", "PYL", blk(lsrc, "LOGIC") + "\nreturn LOGIC;")({ rnd, pick, shuffle, esc }, { C: PC }, PYL);
  const jobs = [], chk = [];
  const add = (code, ins, f, t) => { const o = PC.optsOf(t); jobs.push(o ? { code, inputs: ins || [], opts: o } : { code, inputs: ins || [] }); chk.push(f); };
  const cnt = {}; const bad = [];
  const fail = (where, m) => { bad.push(where + ": " + m); };
  for (const b of L.banks) b.L.forEach((lv, li) => lv.forEach((g, gi) => { for (let k = 0; k < N; k++){
    const where = b.id + " " + (li + 1) + ". szint #" + (gi + 1), t = g();
    cnt[b.kind] = (cnt[b.kind] || 0) + 1;
    if (b.kind === "kiir") add(t.vcode || t.code, t.ins, r => { if (r.err) return "hiba: " + r.err; if (PC.normOut(r.out) !== PC.normOut(t.ans)) return "Python: " + JSON.stringify(r.out) + " · JS: " + JSON.stringify(t.ans) + " · kód: " + JSON.stringify(t.code); }, t);
    else if (b.kind === "hiba"){
      add(t.code, t.ins, r => { if (r.etype !== t.err) return "várt hiba: " + (t.err || "nincs") + " · Python: " + (r.err || "nincs hiba") + " · kód: " + JSON.stringify(t.code); }, t);
      if (t.fix) add(t.fix, t.ins, r => { if (r.err) return "a javított kód is hibás: " + r.err + " · " + JSON.stringify(t.fix); }, t);
    }
    else if (b.kind === "tipus") add((t.pre ? t.pre + "\n" : "") + "print(type(" + t.expr + ").__name__)", t.ins || [], r => { const o = r.out.trim(); if (r.err || o !== t.type) return t.expr + " → Python: " + (r.err || o) + ", JS: " + t.type; });
    else if (b.kind === "nev") add(t.name + " = 1", [], r => { if (!r.err !== !!t.ok) return t.name + ": Python szerint " + (r.err ? "nem jó (" + r.err + ")" : "jó") + ", a feladat szerint " + (t.ok ? "jó" : "nem jó"); });
    else if (b.kind === "write"){
      const key = tt => JSON.stringify([tt.ins, PC.optsOf(tt), tt.calls]);
      if (t.tests.length > 1 && key(t.tests[0]) === key(t.tests[1])) fail(where, "két egyforma próbabemenet");
      const rs = [], n0 = jobs.length;
      t.tests.forEach((tt, i) => add(PC.withCalls(t.code, tt), tt.ins, r => { rs[i] = r; if (i < t.tests.length - 1) return; const j = PC.judge(t, t.code, rs); if (!j.ok) return "a minta nem megy át: " + j.why + " · kimenet: " + JSON.stringify(rs[j.k || 0].out) + (rs[j.k || 0].err ? " · " + rs[j.k || 0].err : "") + " · kód: " + JSON.stringify(t.code); }, tt));
      if (t.starter){ const ss = []; t.tests.forEach((tt, i) => add(PC.withCalls(t.starter, tt), tt.ins, r => { ss[i] = r; if (i < t.tests.length - 1) return; if (PC.judge(t, t.starter, ss).ok) return "a kiinduló (hibás) kód átmegy: " + JSON.stringify(t.starter); }, tt)); }
    }
    else fail(where, "ismeretlen fajta: " + b.kind);
    const last = chk.length; for (let q = 0; q < last; q++) if (!chk[q].where) chk[q].where = where;
  } }));
  (Array.isArray(L.EX) ? L.EX : Object.values(L.EX || {})).forEach((e, i) => { cnt.ex = (cnt.ex || 0) + 1; add(e.code, e.ins, r => { if ((r.etype || "") !== (e.err || "")) return "várt: " + (e.err || "nincs hiba") + " · Python: " + (r.err || "nincs hiba") + " · " + JSON.stringify(e.code); }, e); chk[chk.length - 1].where = "példa #" + (i + 1); });
  const res = pyRun(jobs, H);
  res.forEach((r, i) => { const m = chk[i](r); if (m) fail(chk[i].where, m); });
  console.log(name + ": " + Object.entries(cnt).map(([k, v]) => k + " " + v).join(" · ") + " · futás " + jobs.length + " · hiba " + bad.length);
  bad.slice(0, 20).forEach(b => console.log("  ✖ " + b));
  return bad.length ? 1 : 0;
}
