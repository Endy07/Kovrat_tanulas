// A Python-dolgozat lecke ellenőrzője, böngésző nélkül, a helyi Pythonnal (ugyanazzal a kerettel, ami a Pyodide-ban fut).
// Használat:
//   node tools/lessons/py-check.js --write        az 52 eredeti feladat példafutását beírja a forrás /*@OUTS*/ blokkjába
//   node tools/lessons/py-check.js --verify [N]   minden „Írd meg” sablon × szint × N feladat: a mintamegoldás átmegy-e
//                                                 a saját ellenőrzésen; a „Mit ír ki?” válaszai egyeznek-e a valódi Pythonnal
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
function pyRun(jobs){
  const r = spawnSync("python", ["-I", "-c", DRIVER], { input: Buffer.from(JSON.stringify({ harness: HARNESS, jobs }), "utf8"), maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error("python hiba: " + r.stderr.toString());
  return JSON.parse(r.stdout.toString("utf8"));
}
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const arg = process.argv[2];
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
