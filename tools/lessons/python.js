/* A Python-sorozat (python-1-…, python-2-…) közös modulja. A forrásban a <!--@PYJS--> jelölő hozza be (a <!--@KITJS--> után).
   Tartalma: a Python-keret (HARNESS), a DOM nélküli logika (PYCORE: kimenet-összevetés, bírálat), és a böngészős rész (P):
   Pyodide-futtató Web Workerben, futtató-szerkesztő, magyar hibatippek, feladatfajták.
   A HARNESS és a PYCORE blokkot a py-check.js Node-ban is kiértékeli (a helyi Pythonnal): ugyanaz fut mindkét helyen.
   A python-dolgozat lecke a saját, régebbi példányát használja (nem ezt). */

/*@HARNESS*/
// A diák programját futtató Python-keret. A print csak a kimenetbe ír; a bemenetet (kérdés + begépelt érték) külön jelöli,
// így az ellenőrzés csak a print kimenetét nézi. A végén a program egyszerű változóit is visszaadja (név, típus, repr, str).
// opts (a 11. leckétől, elhagyható): rig = a random előre megadott értékei az ellenőrzéshez ({"randint": [3, 5], "choice": [0], "random": [0.5]});
// files = a program saját, üres munkamappájába előre kiírt szövegfájlok ({"adatok.txt": "…"}); ilyenkor a futás után a mappa
// fájljait is visszaadja (files), így a fájlba író program is ellenőrizhető.
const PY_HARNESS = String.raw`
import sys, traceback, builtins
def _kovrat_rig(rig):
    import random as _r
    saved = []
    for name, vals in dict(rig).items():
        orig = getattr(_r, name)
        q = list(vals)
        if name == "randint":
            def f(a, b, q=q, orig=orig):
                if q:
                    v = q.pop(0)
                    if a <= v <= b:
                        return v
                return orig(a, b)
        elif name == "choice":
            def f(seq, q=q, orig=orig):
                if q and len(seq):
                    return seq[q.pop(0) % len(seq)]
                return orig(seq)
        elif name == "random":
            def f(q=q, orig=orig):
                return q.pop(0) if q else orig()
        else:
            continue
        saved.append((name, orig))
        setattr(_r, name, f)
    return saved
def _kovrat_run(code, inputs, opts=None):
    import os
    inputs = [str(x) for x in inputs]
    opts = dict(opts) if opts else {}
    rig = opts.get("rig")
    files = opts.get("files")
    saved = _kovrat_rig(rig) if rig else []
    cwd0 = None
    tmp = None
    if files is not None:
        import tempfile
        cwd0 = os.getcwd()
        tmp = tempfile.mkdtemp()
        os.chdir(tmp)
        for n, c in dict(files).items():
            with open(n, "w", encoding="utf-8") as fh:
                fh.write(str(c))
    out = []
    segs = []
    used = [0]
    total = [0]
    class _W:
        def write(self, s):
            s = str(s)
            total[0] += len(s)
            if total[0] > 20000:
                raise RuntimeError("Túl sok kimenet: a program 20000 karakternél többet írt ki.")
            out.append(s)
            if segs and segs[-1][0] == "o":
                segs[-1][1] += s
            else:
                segs.append(["o", s])
            return len(s)
        def flush(self):
            pass
    def _input(prompt=""):
        p = str(prompt)
        if p:
            segs.append(["p", p])
        if used[0] >= len(inputs):
            raise EOFError("EOF when reading a line")
        v = inputs[used[0]]
        used[0] += 1
        segs.append(["i", v + chr(10)])
        return v
    g = {"__name__": "__main__", "__builtins__": builtins, "input": _input}
    old = sys.stdout
    sys.stdout = _W()
    err = ""
    etype = ""
    line = 0
    try:
        exec(compile(code, "<program>", "exec"), g)
    except SyntaxError as e:
        etype = type(e).__name__
        err = etype + ": " + str(e.msg)
        line = e.lineno or 0
    except BaseException as e:
        etype = type(e).__name__
        for fr in traceback.extract_tb(e.__traceback__):
            if fr.filename == "<program>":
                line = fr.lineno
        err = etype + (": " + str(e) if str(e) else "")
    finally:
        sys.stdout = old
        if saved:
            import random as _r
            for name, orig in saved:
                setattr(_r, name, orig)
    fout = None
    if tmp is not None:
        import shutil
        fout = {}
        try:
            for n in sorted(os.listdir(tmp)):
                fp = os.path.join(tmp, n)
                if os.path.isfile(fp) and os.path.getsize(fp) < 50000:
                    with open(fp, encoding="utf-8", errors="replace") as fh:
                        fout[n] = fh.read()
        finally:
            os.chdir(cwd0)
            shutil.rmtree(tmp, ignore_errors=True)
    vs = []
    for k, v in list(g.items()):
        if k.startswith("_") or k == "input":
            continue
        if type(v) in (int, float, str, bool, list, type(None)):
            r = repr(v)
            vs.append([k, type(v).__name__, r[:200], str(v)[:200]])
    r = {"out": "".join(out), "segs": segs, "err": err, "etype": etype, "line": line, "used": used[0], "vars": vs}
    if fout is not None:
        r["files"] = fout
    return r
`;
/*@/HARNESS*/

/*@PYCORE*/
// DOM nélküli logika: kimenet-összevetés és bírálat. Böngészőben és a py-check.js-ben is ez fut.
const PYCORE = (function(){
  /* ---- Értékek a kimenetben (a 3. leckétől, mint a dolgozat-leckében): szám, szöveg, egész sor ---- */
  const NUMRE = /-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi;
  const isW = c => c != null && /[0-9A-Za-zÀ-ɏ_]/.test(c);
  function findShort(txt, s){
    let i = -1;
    while ((i = txt.indexOf(s, i + 1)) >= 0) if (!isW(txt[i - 1]) && !isW(txt[i + s.length])) return i;
    return -1;
  }
  function cmpOut(out, exp){
    const nums = []; String(out).replace(NUMRE, m => { nums.push({ v: parseFloat(m), m, used: false }); return m; });
    let txt = String(out);
    const lines = String(out).split("\n").map(l => ({ l, used: false }));
    const miss = [];
    for (const e of exp){
      if (typeof e === "number"){
        const tol = 1e-6 * Math.max(1, Math.abs(e));
        const k = nums.find(n => !n.used && Math.abs(n.v - e) <= tol);
        if (k){ k.used = true; continue; }
        const near = nums.find(n => !n.used && Math.abs(n.v - e) < 0.02 * Math.max(1, Math.abs(e)));
        miss.push({ e, near: near && near.m }); continue;
      }
      if (e.line){
        const L = lines.find(x => !x.used && (x.l === e.s || x.l.endsWith(" " + e.s)));
        if (L){ L.used = true; continue; }
        miss.push({ e: e.s, line: true }); continue;
      }
      const i = e.s.length <= 3 ? findShort(txt, e.s) : txt.indexOf(e.s);
      if (i < 0){ miss.push({ e: e.s }); continue; }
      txt = txt.slice(0, i) + "\u0001".repeat(e.s.length) + txt.slice(i + e.s.length);
    }
    return miss;
  }

  /* ---- Pontos kimenet: a sor végi szóköz és a záró üres sorok nem számítanak ---- */
  const normOut = s => String(s).replace(/\r/g, "").split("\n").map(l => l.replace(/[ \t]+$/, "")).join("\n").replace(/\n+$/, "");
  const vis = s => String(s).replace(/ /g, "·");
  // névelő sorszám elé: „az 1. sor”, „az 5. sor”, „a 2. sor”
  const az = n => /^(1|1\d{3}|5\d*)$/.test(String(n)) ? "az " : "a ";
  const Az = n => az(n) === "az " ? "Az " : "A ";
  const noSp = s => s.replace(/\s+/g, "");
  const noPunct = s => s.replace(/[.,!?;:'"„”]/g, "");
  // az első eltérés magyarul (null, ha egyezik)
  function diffExact(got, exp){
    const g = normOut(got), e = normOut(exp);
    if (g === e) return null;
    if (g === "") return { why: "A program nem írt ki semmit. Kell egy print(…)." };
    const G = g.split("\n"), E = e.split("\n");
    for (let i = 0; i < Math.max(G.length, E.length); i++){
      const a = G[i], b = E[i], n = i + 1;
      if (a === b) continue;
      if (a == null) return { line: n, why: "A kimenet rövidebb a vártnál. Ez a sor hiányzik: " + (b === "" ? "egy üres sor" : b) };
      if (b == null) return { line: n, why: "A kimenetben több sor van, mint kellene. Fölösleges: " + (a === "" ? "egy üres sor" : a) };
      if (a.toLowerCase() === b.toLowerCase()) return { line: n, why: Az(n) + n + ". sorban a kis- és nagybetű eltér. Vártam: " + b + " · Kiírta: " + a };
      if (noSp(a) === noSp(b)) return { line: n, why: Az(n) + n + ". sorban a szóközök eltérnek (a · most szóközt jelöl). Vártam: " + vis(b) + " · Kiírta: " + vis(a) };
      if (noPunct(a) === noPunct(b)) return { line: n, why: Az(n) + n + ". sorban egy írásjel eltér. Vártam: " + b + " · Kiírta: " + a };
      if (a === "" || b === "") return { line: n, why: a === "" ? Az(n) + n + ". sor üres, pedig ezt vártam: " + b : Az(n) + n + ". sorba üres sor kellene (üres print()), de ezt írta ki: " + a };
      return { line: n, why: Az(n) + n + ". sor nem egyezik. Vártam: " + b + " · Kiírta: " + a };
    }
    return { why: "A kimenet nem egyezik." };
  }

  // a # utáni megjegyzés levágása, de az idézőjelen belüli # marad ('#' * 5)
  const stripCom = c => String(c).split("\n").map(l => { let q = ""; for (let i = 0; i < l.length; i++){ const ch = l[i]; if (q){ if (ch === "\\") i++; else if (ch === q) q = ""; } else if (ch === '"' || ch === "'") q = ch; else if (ch === "#") return l.slice(0, i); } return l; }).join("\n");
  const fstr = /\bf["']/;
  const fmtE = e => typeof e === "number" ? String(e) : '"' + e + '"';
  const varOf = (r, n) => (r.vars || []).find(v => v[0] === n);
  const TYPE_HU = { int: "int (egész szám)", float: "float (tizedes tört)", str: "str (szöveg)", bool: "bool (logikai érték)", list: "list (lista)", NoneType: "None" };

  /* ---- Bírálat: a feladat (T) és a futások eredménye (rs) alapján. { ok, k, why } ---- */
  // T.tests[k]: { ins, exact?, exp?, seq?: [szövegek ebben a sorrendben], vars?: [[név, típus, érték]], rig?, files?, fout?: [[fájlnév, várt tartalom]] } · T.must / T.mustNot: [[regex, üzenet]] · T.fstr: kell-e f-string
  // a gép maga hívja meg a diák függvényét: tests[k].calls = [[hívás, várt kiírt érték], …] → a program végére „print("@@", hívás)” sorok
  // a 12. leckétől: _kerr(f, arg…) → a hívás által dobott kivétel neve, vagy "nincs hiba" (a raise ellenőrzéséhez)
  const KERR = ["def _kerr(_f, *_a):", "    try:", "        _f(*_a)", "    except Exception as _e:", "        return type(_e).__name__", '    return "nincs hiba"'].join(String.fromCharCode(10));
  const callPost = t => ((t.calls || []).some(c => /\b_kerr\(/.test(c[0])) ? KERR + String.fromCharCode(10) : "") + (t.calls || []).map(c => 'print("@@", ' + c[0] + ")").join(String.fromCharCode(10));
  const withCalls = (code, t) => t.calls && t.calls.length ? code + String.fromCharCode(10) + callPost(t) : code;
  function judge(T, code, rs){
    for (let k = 0; k < T.tests.length; k++){
      const t = T.tests[k], r = rs[k], ins = t.ins || [];
      const pre = !k ? "" : k === 1 ? "Az első próbára jó volt, de a másodikra nem. " : "Az előző próbákra jó volt, de " + az(k + 1) + (k + 1) + ". próbára nem. ";
      if (r.err && T.fname && r.etype === "NameError" && r.err.includes("'" + T.fname + "'")) return { ok: false, k, why: "Nincs " + T.fname + " nevű függvény a programodban. Pontosan így nevezd el: def " + T.fname + "(…):" };
      // t.crash (a 12. leckétől): célzott magyarázat, ha erre a próbára a program hibával leáll (például nincs try)
      if (r.err) return { ok: false, k, why: pre + "A program hibával állt le." + (t.crash ? " " + (typeof t.crash === "string" ? t.crash : t.crash[r.etype] || t.crash[""] || "") : "") };
      if (t.calls && t.calls.length){
        const got = String(r.out).split("\n").filter(l => l.startsWith("@@")).map(l => l.slice(3));
        for (let q = 0; q < t.calls.length; q++){
          const [call, want, msg] = t.calls[q], g = got[q];
          if (g === want) continue;
          if (msg) return { ok: false, k, why: msg + (g != null && g !== "True" && g !== "False" ? " (Ezt kaptam: " + g + ")" : "") };
          if (g === "None") return { ok: false, k, why: "A " + call + " hívás None-t ad vissza: a függvény nem ad vissza értéket. Valószínűleg print van benne return helyett (vagy kimaradt a return). Ezt kellene visszaadnia: " + want };
          return { ok: false, k, why: "A " + call + " hívás eredménye nem jó. Ezt vártam: " + want + " · A függvényed ezt adta vissza: " + g };
        }
      }
      if (r.used < ins.length) return { ok: false, k, why: pre + "A programod csak " + r.used + " adatot kért be az input()-tal, de " + ins.length + " kellene." };
      if (t.exact != null){
        const d = diffExact(r.out, t.exact);
        if (d) return { ok: false, k, why: pre + (/\{[^{}\n]+\}/.test(r.out) && !/\{[^{}\n]+\}/.test(t.exact) ? "A kimenetben kapcsos zárójel maradt: kimaradt az f a nyitó idézőjel elől? Helyesen: print(f\"… {valtozo} …\"). " : "")
          + (t.files && /\n[ \t]*\n/.test(normOut(r.out)) && !/\n[ \t]*\n/.test(normOut(t.exact)) ? "Üres sorok vannak a kimenetben: a fájl minden sora \\n-nel (sorvégjellel) végződik, és a print is tesz egyet. Vágd le: sor.strip(). " : "") + d.why, exact: true };
      }
      if (t.exp){
        const miss = cmpOut(r.out, t.exp);
        if (miss.length){
          const m = miss[0];
          const why = /\{[^{}\n]+\}/.test(r.out) ? "A kimenetben kapcsos zárójel maradt: kimaradt az f a print idézőjele elől? Helyesen: print(f\"… {valtozo} …\")."
            : typeof m.e === "number" && ins.length > 1 && r.out.includes(ins.join("")) ? "A számokat összefűzte, nem összeadta: kimaradt az int() vagy a float() az input() körül?"
            : m.near != null ? "Ezt az értéket vártam: " + fmtE(m.e) + ", de ezt írta ki: " + m.near + ". Nézd meg a számolást vagy a kerekítést!"
            : m.line ? "Ezt a sort vártam (pontosan így): " + fmtE(m.e)
            : "Ezt nem találom a kimenetben: " + fmtE(m.e) + ".";
          return { ok: false, k, why: pre + why };
        }
      }
      if (t.seq){
        let pos = 0, out = String(r.out);
        for (const x of t.seq){
          const i = out.indexOf(x, pos);
          if (i < 0) return { ok: false, k, why: pre + (out.includes(x) ? "A kiírások sorrendje nem jó (a feltétel fordítva van?). Ezt vártam, ebben a sorrendben: " : "Nem találom a kimenetben mindet. Ezt vártam, ebben a sorrendben: ") + t.seq.join(" · ") };
          pos = i + x.length;
        }
      }
      for (const [fn, want] of (t.fout || [])){
        const got = (r.files || {})[fn];
        if (got == null) return { ok: false, k, why: pre + "Nem jött létre " + azW(fn) + fn + " fájl. Nyisd meg írásra: open(\"" + fn + "\", \"w\", encoding=\"utf-8\"), és írj bele a write()-tal." };
        const d = diffExact(got, want);
        if (d && normOut(want).includes("\n") && !normOut(got).includes("\n") && got !== "") return { ok: false, k, why: pre + AzW(fn) + fn + " fájlban minden egy sorba került. A write() nem tesz sortörést: írd a szöveg végére: \\n (például f.write(nev + \"\\n\"))." };
        if (d) return { ok: false, k, why: pre + AzW(fn) + fn + " fájl tartalma nem jó. " + d.why.replace("A program nem írt ki semmit. Kell egy print(…).", "A fájl üres: írtál bele a write()-tal? (A print a képernyőre ír, nem a fájlba.)").replace("Kell egy print(…).", "") };
      }
      for (const x of (t.not || [])) if (String(r.out).includes(x)) return { ok: false, k, why: pre + "Erre a bemenetre ezt nem kellene kiírnia: " + fmtE(x) + ". Nézd meg a feltételt: melyik ág fut le?" };
      for (const [n, ty, val] of (t.vars || [])){
        const v = varOf(r, n);
        if (!v) return { ok: false, k, why: "Nincs a programodban " + n + " nevű változó. Pontosan így nevezd el (kisbetűvel, ékezet nélkül)." };
        if (v[1] !== ty) return { ok: false, k, why: "A változó típusa nem jó: " + n + " most " + (TYPE_HU[v[1]] || v[1]) + ", de " + (TYPE_HU[ty] || ty) + " kellene." + (ty === "int" && v[1] === "str" ? " Az idézőjel szöveget csinál belőle: 15, nem \"15\"." : ty === "str" && v[1] !== "str" ? " A szöveg idézőjelbe kerül." : "") };
        if (val != null){
          const okv = ty === "int" || ty === "float" ? Math.abs(parseFloat(v[3]) - Number(val)) < 1e-9 : v[3] === String(val);
          if (!okv) return { ok: false, k, why: "A változó értéke nem jó: " + n + " most " + v[2] + ", de ennek kellene lennie: " + (ty === "str" ? "\"" + val + "\"" : val) + "." };
        }
      }
    }
    const src = stripCom(code);
    for (const [re, m] of (T.must || [])) if (!re.test(src)) return { ok: false, why: "A kimenet jó, de a feladat ezt kéri: " + m };
    for (const [re, m] of (T.mustNot || [])) if (re.test(src)) return { ok: false, why: "A kimenet jó, de: " + m };
    if (T.fstr && !fstr.test(src)) return { ok: false, why: "A kimenet jó, de f-stringgel írd ki: print(f\"… {valtozo} …\")." };
    return { ok: true };
  }

  /* ---- „Mit ír ki?” válasz összevetése (Python nélkül) ---- */
  const normAns = s => normOut(String(s).replace(/[“”„]/g, '"').replace(/[‘’]/g, "'"));
  function kiirCheck(user, ans){
    const u = normAns(user), a = normOut(ans);
    if (u === a) return { ok: true, msg: "Helyes!" };
    if (!u.trim()) return { ok: false, msg: "Írd be, mit ír ki a program." };
    const U = u.split("\n"), A = a.split("\n");
    if (U.length !== A.length && noSp(u) === noSp(a)) return { ok: false, msg: "A szöveg jó, de a sorok száma nem: minden print új sorba ír. A program " + A.length + " sort ír ki." };
    if (U.length !== A.length) return { ok: false, msg: "Nem jó. A program " + A.length + " sort ír ki (minden print egy sort), te " + U.length + " sort írtál." };
    for (let i = 0; i < A.length; i++){
      const x = U[i], y = A[i], n = A.length > 1 ? Az(i + 1) + (i + 1) + ". sor: " : "";
      if (x === y) continue;
      if (x.replace(/^["']|["']$/g, "") === y || x.replace(/["']/g, "") === y.replace(/["']/g, "") && /["']/.test(x)) return { ok: false, msg: n + "majdnem: az idézőjel nem íródik ki, az csak a programban jelzi a szöveget." };
      if (y.endsWith(".0") && x === y.slice(0, -2)) return { ok: false, msg: n + "majdnem: a / osztás eredménye mindig tizedes tört, ezért .0 is van a végén." };
      if (x.toLowerCase() === y.toLowerCase()) return { ok: false, msg: n + "a kis- és nagybetű számít" + (/^(True|False)$/.test(y) ? ": True és False nagy kezdőbetűvel." : ".") };
      if (noSp(x) === noSp(y)) return { ok: false, msg: n + "majdnem, csak a szóközök nem stimmelnek. A vessző a print-ben egy szóközt tesz, a + nem tesz." };
      return { ok: false, msg: "Nem jó. " + (A.length > 1 ? "Az első eltérés " + az(i + 1) + (i + 1) + ". sorban van." : "Kövesd sorról sorra!") };
    }
    return { ok: false, msg: "Nem jó." };
  }

  // Python-szám kiírása: a float mindig tizedesponttal (4.0)
  const pyF = x => Number.isInteger(x) ? x.toFixed(1) : String(x);
    // toldalék szám után, az utolsó kiejtett szó szerint (3 három, 6 hat, 8 nyolc, 20 húsz, 60 hatvan, 80 nyolcvan, 100 száz: mély hangrend)
  const lastW = n => { n = Math.abs(n); if (n === 0) return "0"; return n % 10 ? n % 10 : n % 100 ? (n % 100) + "t" : n % 1000 ? "h" : "k"; };
  const deep = n => [3, 6, 8, "20t", "60t", "80t", "h", "0"].includes(lastW(n));
  const nal = n => n + (deep(n) ? "-nál" : "-nél");
  const tol = n => n + (deep(n) ? "-tól" : "-től");
  const ACC = { 1: "et", 2: "t", 3: "at", 4: "et", 5: "öt", 6: "ot", 7: "et", 8: "at", 9: "et", "10t": "et", "20t": "at", "30t": "at", "40t": "et", "50t": "et", "60t": "at", "70t": "et", "80t": "at", "90t": "et", h: "at", k: "et", "0": "t" };
  const acc = n => n + "-" + ACC[lastW(n)];
  // névelő név elé: „az Anna”, „a Bence”
  const azW = w => /^[aeiouáéíóöőúüű]/i.test(String(w)) ? "az " : "a ";
  const AzW = w => azW(w) === "az " ? "Az " : "A ";
  // a futás opciói egy próbához (random előre megadott értékei, előre kiírt fájlok), vagy null
  const optsOf = t => { const o = {}; if (t && t.rig) o.rig = t.rig; if (t && t.files) o.files = t.files; return Object.keys(o).length ? o : null; };
  return { cmpOut, normOut, diffExact, stripCom, fstr, judge, kiirCheck, pyF, vis, az, Az, azW, AzW, nal, tol, acc, withCalls, optsOf };
})();
/*@/PYCORE*/

const P = (function(){
  const { $, esc } = K;
  const C = PYCORE;

  /* ---------- Python-futtató: Pyodide egy Web Workerben, lustán (csak az első futtatáskor tölt be) ---------- */
  const PY = (function(){
    const BASE = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/";
    let worker = null, readyP = null, seq = 0, state = "idle", msg = "";
    const wait = {}, subs = [];
    const setState = (s, m) => { state = s; msg = m || ""; subs.forEach(f => f(state, msg)); };
    function start(){
      if (readyP) return readyP;
      setState("loading");
      readyP = new Promise(res => {
        const src = "importScripts(" + JSON.stringify(BASE + "pyodide.js") + ");\n" +
          "var H = " + JSON.stringify(PY_HARNESS) + ";\n" +
          "var ready = loadPyodide({ indexURL: " + JSON.stringify(BASE) + " }).then(function(p){ p.runPython(H); self.py = p; postMessage({ type: 'ready' }); }, function(e){ postMessage({ type: 'fail', msg: String(e && e.message || e) }); });\n" +
          "onmessage = function(e){ var d = e.data; ready.then(function(){ var r; try { var f = self.py.globals.get('_kovrat_run'); var x = d.opts ? f(d.code, self.py.toPy(d.inputs), self.py.toPy(d.opts)) : f(d.code, self.py.toPy(d.inputs)); r = x.toJs({ dict_converter: Object.fromEntries }); x.destroy(); f.destroy(); } catch (err){ r = { out: '', segs: [], err: 'Belső hiba: ' + err, etype: 'Error', line: 0, used: 0, vars: [] }; } r.id = d.id; r.type = 'res'; postMessage(r); }); };";
        let to = null;
        const failed = m => { clearTimeout(to); try { worker && worker.terminate(); } catch (e){} worker = null; readyP = null; setState("failed", m); res(false); };
        try { worker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" }))); }
        catch (e){ failed(String(e && e.message || e)); return; }
        to = setTimeout(() => failed("időtúllépés"), 120000);
        worker.onmessage = e => {
          const d = e.data;
          if (d.type === "ready"){ clearTimeout(to); setState("ready"); res(true); }
          else if (d.type === "fail") failed(d.msg);
          else if (wait[d.id]){ const w = wait[d.id]; delete wait[d.id]; w(d); }
        };
        worker.onerror = e => { e.preventDefault && e.preventDefault(); failed(e.message || "a Python nem töltődött be"); };
      });
      return readyP;
    }
    function restart(){ try { worker && worker.terminate(); } catch (e){} worker = null; readyP = null; setState("idle"); }
    async function run(code, inputs, opts){
      const ok = await start();
      if (!ok) return { fail: true, msg };
      const id = ++seq;
      return new Promise(res => {
        const t = setTimeout(() => { delete wait[id]; restart(); res({ out: "", segs: [], err: "Időtúllépés: a program 6 másodperc alatt sem fejeződött be.", etype: "Timeout", line: 0, used: 0, vars: [] }); }, 6000);
        wait[id] = d => { clearTimeout(t); res(d); };
        worker.postMessage({ id, code: String(code), inputs: (inputs || []).map(String), opts: opts || null });
      });
    }
    return { run, start, on(f){ subs.push(f); f(state, msg); }, get state(){ return state; } };
  })();

  /* ---------- Magyar hibatippek (a hibaüzenet angol marad, mert a gépen is az lesz) ---------- */
  function hint(etype, err){
    const m = String(err);
    if (etype === "NameError"){
      const n = (/name '(\w+)'/.exec(m) || [])[1] || "";
      if (n === "Print" || n === "PRINT") return "A print kisbetűvel írandó: print(…). A Python megkülönbözteti a kis- és nagybetűt.";
      if (/^(true|false)$/.test(n)) return "Az igaz és a hamis nagy kezdőbetűvel: True, False.";
      if (n === "math" || n === "random") return "Hiányzik az import: a program elejére írd be: import " + n + ". (Ha from " + n + " import …-tal hoztad be a függvényt, akkor " + n + ". nélkül írd, például " + (n === "math" ? "sqrt(4)" : "randint(1, 6)") + ".)";
      if (/^(sqrt|floor|ceil|pi)$/.test(n)) return "Ez a math modul része: math." + n + (n === "pi" ? "" : "(…)") + " (és a program elején import math). Vagy így hozd be: from math import " + n + ".";
      if (/(Error|Exception)$/.test(n) && n !== "Exception") return "A hiba neve pontosan így írandó, nagy kezdőbetűkkel: ValueError, ZeroDivisionError, IndexError, TypeError. (Az except sorban az elírt név csak akkor derül ki, ha tényleg hiba keletkezik.)";
      if (/^(randint|choice|shuffle|uniform)$/.test(n)) return "Ez a random modul függvénye: random." + n + "(…) (és a program elején import random). Vagy így hozd be: from random import " + n + ".";
      return "Nincs ilyen nevű változó" + (n ? ": " + n : "") + ". Ha szöveget akartál kiírni, tedd idézőjelbe" + (n ? ": \"" + n + "\"" : "") + ". Ha változó, előbb adj neki értéket (és ugyanígy írd: a kis- és nagybetű is számít).";
    }
    if (/unterminated string literal|EOL while scanning/.test(m)) return "Hiányzik a záró idézőjel. A szöveg elején és végén is kell: \"Szia\". Ha a szövegben aposztróf van, tedd dupla idézőjelbe: \"It's\".";
    if (/was never closed|unexpected EOF/.test(m)) return "Hiányzik egy záró zárójel. Minden nyitó zárójelhez kell egy záró: print(\"Szia\").";
    if (/unmatched '\)'/.test(m)) return "Fölösleges záró zárójel, vagy hiányzik a nyitó.";
    if (/invalid character/.test(m)) return "Furcsa karakter van a kódban. Gyakran a Wordből másolt „okos” idézőjel: csak az egyenes \" vagy ' jó.";
    if (/Missing parentheses in call to 'print'/.test(m)) return "A print után zárójel kell: print(\"Szia\").";
    if (/invalid decimal literal/.test(m)) return "Szám után betű: a változó neve nem kezdődhet számmal (nev2 jó, 2nev nem). Tizedes törtnél pontot írj: 3.5.";
    if (/cannot assign to (True|False|None)/.test(m)) return "A True, a False és a None foglalt szó, nem lehet változónév.";
    if (/cannot assign to expression/.test(m)) return "A változó neve nem tartalmazhat kötőjelet vagy más műveleti jelet: uj-ar helyett uj_ar. (Vagy fordítva írtad az értékadást? Balra a név: x = 5.)";
    if (/cannot assign to literal|cannot assign to function call/.test(m)) return "Az értékadásnál balra a változó neve áll, jobbra az érték: x = 5 (nem 5 = x).";
    if (/Maybe you meant '==' or ':=' instead of '='|invalid syntax. Maybe you meant/.test(m)) return "Az = értékadás; az egyenlőség vizsgálata ==. Itt valószínűleg vessző vagy operátor hiányzik.";
    if (/Perhaps you forgot a comma/.test(m)) return "Két érték között hiányzik a vessző (vagy a +). Például: print(\"Kor:\", 15).";
    if (/can only concatenate str/.test(m)) return "Szöveghez számot nem lehet +-szal hozzáfűzni. Írd vesszővel (print(\"Kor:\", 15)), f-stringgel, vagy alakítsd szöveggé: str(15).";
    if (/unsupported operand type\(s\) for [-+*\/%]+: '(int|float)' and 'str'|'str' and '(int|float)'|unsupported operand type\(s\) for [-\/%]+: 'str' and 'str'/.test(m)) return "Szöveggel akarsz számolni. Ha a szám idézőjelben van, az szöveg: \"5\". Alakítsd számmá: int(\"5\"). (Az input() is mindig szöveget ad!)";
    if (/can't multiply sequence by non-int/.test(m)) return "Szöveget csak egész számmal lehet szorozni (\"ha\" * 3). Szöveget szöveggel nem.";
    if (/invalid literal for int\(\)/.test(m)) return "Az int() csak egész számot tud átalakítani. Tizedes törthöz float() kell (és pont, nem vessző: 3.5); betűt nem lehet számmá alakítani.";
    if (/could not convert string to float/.test(m)) return "Ez nem szám. Tizedesvessző helyett pontot írj: 3.5.";
    if (/expected 'except' or 'finally' block/.test(m)) return "A try után kell egy except (vagy finally) blokk, a try-jal egy vonalban: try: … except ValueError: …. Ha a try blokk sorai nincsenek beljebb húzva, az is ezt a hibát adja.";
    if (/expected ':'/.test(m)) return "Hiányzik a kettőspont a sor végéről: if feltétel: (az elif és az else után is kell).";
    if (/expected an indented block/.test(m)) return "A kettőspont utáni sornak beljebb kell kezdődnie (4 szóköz, a VS Code-ban Tab): ez tartozik az if alá.";
    if (/unindent does not match/.test(m)) return "A behúzás nem egyezik: az egy blokkba tartozó sorok pontosan ugyanannyi szóközzel kezdődjenek.";
    if (etype === "IndentationError") return /unexpected indent/.test(m) ? "Szóköz (vagy tabulátor) van a sor elején. Az egyszerű utasítások a sor legelején kezdődnek." : "Behúzási hiba: a kettőspont utáni sor 4 szóközzel beljebb kezdődik.";
    if (etype === "SyntaxError") return "Szintaktikai hiba: a Python nem érti a sort. Nézd meg a zárójeleket, az idézőjeleket és a vesszőket. A hiba gyakran a jelzett sorban vagy közvetlenül előtte van.";
    if (etype === "ZeroDivisionError") return "Nullával osztottál.";
    if (etype === "EOFError") return "A program több adatot kér be (input), mint ahány bemenetet megadtál. Írj be még egy sort a bemenetekhez. (Ha while True ciklusban kérsz be: a jó adat után kimaradt a break?)";
    if (/math domain error/.test(m)) return "Ezt a math nem tudja kiszámolni: például negatív számnak nincs (valós) négyzetgyöke. Nézd meg, mit adtál a függvénynek.";
    if (/partially initialized module|circular import|consider renaming/.test(m)) return "A fájlod neve ugyanaz, mint a modulé (például random.py vagy turtle.py), ezért a Python a saját fájlodat tölti be. Nevezd át (például dobokocka.py).";
    if (/module '(math|random)' has no attribute/.test(m)) return "Ebben a modulban nincs ilyen nevű függvény. Nézd meg a nevét (math: sqrt, floor, ceil, pi; random: randint, choice, random, shuffle), és a kis- és nagybetűt.";
    if (/Cannot choose from an empty sequence/.test(m)) return "A random.choice üres listából nem tud választani.";
    if (/randint\(\) missing/.test(m)) return "A randint két számot vár: az alsó és a felső határt, például random.randint(1, 6).";
    if (/empty range (for|in) randrange/.test(m)) return "A randint alsó határa nagyobb a felsőnél: random.randint(1, 6), nem random.randint(6, 1).";
    if (etype === "ModuleNotFoundError") return "Nincs ilyen nevű modul. A modulok neve kisbetűs (math, random), pontosan így írd.";
    if (etype === "FileNotFoundError") return "Nincs ilyen fájl. Pontosan így hívják (kiterjesztéssel együtt, például adatok.txt)? A VS Code-ban a fájlnak a megnyitott mappában kell lennie (onnan fut a program a terminálban).";
    if (/not readable/.test(m)) return "A fájlt írásra nyitottad meg (\"w\" vagy \"a\"), ezért olvasni nem lehet belőle. Olvasáshoz: open(…, \"r\", encoding=\"utf-8\").";
    if (/not writable/.test(m)) return "A fájlt olvasásra nyitottad meg (ez az alapértelmezés), ezért írni nem lehet bele. Íráshoz: open(…, \"w\", encoding=\"utf-8\").";
    if (/I\/O operation on closed file/.test(m)) return "A fájl már be van zárva: a with blokkon kívül (vagy a close() után) nem lehet használni. Tedd a sort beljebb, a with alá.";
    if (/write\(\) argument must be str/.test(m)) return "A write() csak szöveget tud írni. A számot alakítsd szöveggé: f.write(str(x) + \"\\n\") vagy f.write(f\"{x}\\n\").";
    if (etype === "IndexError") return "Nincs ilyen indexű elem. Az index 0-tól len(lista) − 1-ig megy; az utolsó elem: lista[-1].";
    if (/'NoneType' object has no attribute/.test(m)) return "A változód értéke None (semmi). Gyakori ok: lista = lista.append(x). Az append nem ad vissza semmit; elég ennyi: lista.append(x).";
    if (/can only concatenate list/.test(m)) return "Listához számot nem lehet +-szal adni. Új elemet így adj hozzá: lista.append(x).";
    if (/'str' object does not support item assignment/.test(m)) return "A szöveg betűnként nem módosítható. Készíts új szöveget: s = \"X\" + s[1:], vagy s = s.replace(…).";
    if (/'list' object has no attribute '(upper|lower|strip|split|replace)'/.test(m)) return "Ez szöveg-metódus, de a változód lista (például a split eredménye). A lista elemein egyenként hívd meg, for ciklusban.";
    if (etype === "AttributeError") return "Nincs ilyen metódus ennek a típusnak, vagy elírtad (kisbetűvel: upper).";
    if (etype === "TypeError" && /missing \d+ required positional argument/.test(m)) return "Kevesebb argumentumot adtál meg, mint ahány paramétere van a függvénynek.";
    if (etype === "TypeError" && /not callable/.test(m)) return "Egy változót függvényként hívtál. Lehet, hogy egy változónak a függvény nevét adtad (például print = …)?";
    if (etype === "TypeError" && /len\(\)/.test(m)) return "A len() szöveg hosszát adja; számnak nincs hossza.";
    if (etype === "Timeout") return "Lehet, hogy végtelen ciklus van a programban: a ciklusfeltétel sosem lesz hamis. Változik a ciklusváltozó a cikluson belül (például i += 1)?";
    if (/Túl sok kimenet/.test(m)) return "Valószínűleg végtelen ciklus: a program nem akar megállni. Változik a ciklusváltozó a cikluson belül (például i += 1)? A VS Code-ban a Ctrl+C állítja le.";
    return "";
  }
  const segsHtml = (segs, err, line) => (segs || []).map(s => s[0] === "i" ? '<span class="i">' + esc(s[1]) + "</span>" : esc(s[1])).join("") +
    (err ? '<span class="e">✖ ' + (line ? line + ". sor: " : "") + esc(err) + "</span>" + (hint(err.split(":")[0], err) ? '\n<span class="h">💡 ' + esc(hint(err.split(":")[0], err)) + "</span>" : "") : "");
  const term = (segs, err, line) => '<pre class="term">' + (segsHtml(segs, err, line) || '<span class="dim">(nem írt ki semmit)</span>') + "</pre>";
  const failMsg = "A Python nem tudott betöltődni (nincs internet, vagy a böngésző nem engedi). A minták és a „Mit ír ki?” feladatok ettől még működnek.";

  /* ---------- Futtató-szerkesztő: kód (+ bemenetek) + futtatás ---------- */
  function tab4(ta){
    ta.addEventListener("keydown", e => {
      if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey){
        if (ta.dataset.esc === "1"){ ta.dataset.esc = ""; return; }
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
      } else if (e.key === "Escape") ta.dataset.esc = "1";
    });
  }
  // a mappa fájljai (a 13. leckétől): egy szerkeszthető mező fájlonként
  const filesBox = files => '<div class="pyfiles">' + (Object.keys(files).length ? Object.keys(files).map(n => '<div><label>📄 ' + esc(n) + ' (a program mappájában)</label><textarea class="pyfile" data-n="' + esc(n) + '" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="' + esc(n) + '"></textarea></div>').join("") : '<p class="dim pynote">A program mappája most üres. Amit a program fájlba ír, a futás után a kimenet alatt látod.</p>') + "</div>";
  // a futás után: az új vagy megváltozott fájlok tartalma
  const filesAfter = (before, after) => { const ch = Object.keys(after || {}).filter(n => (before || {})[n] !== after[n]); return ch.length ? ch.map(n => '\n<span class="fh">📄 ' + esc(n) + (n in (before || {}) ? " (megváltozott)" : " (új fájl)") + ":</span>\n" + (after[n] === "" ? '<span class="dim">(üres)</span>' : esc(after[n].replace(/\n$/, "")))).join("\n") : ""; };
  // o: { code, inputs, noInput, primary, rows, files? ({név: tartalom}; ha meg van adva, a program saját mappában fut ezekkel a fájlokkal) }
  function editor(root, o){
    o = o || {};
    root.innerHTML =
      '<div class="pyed"><div><label>Python-kód</label><textarea class="pyta" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Python-kód"></textarea></div>' +
      '<div class="pyright">' + (o.noInput ? "" : '<div><label>Bemenetek: amit a gépre beírnál, soronként egy</label><textarea class="pyin" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Bemenetek, soronként egy"></textarea></div>') + '<div class="pyfw"></div>' +
      '<div class="row"><button class="btn' + (o.primary ? " primary" : "") + '" type="button" data-p="run">▶ Futtatás</button><span class="pyst" aria-live="polite"></span></div>' +
      '<div class="pyout"><div class="pyout-h">Kimenet</div><pre class="pyout-b"><span class="dim">Nyomd meg: ▶ Futtatás</span></pre></div></div></div>';
    const ta = $(".pyta", root), inp = $(".pyin", root), out = $(".pyout-b", root), st = $(".pyst", root), btn = $('[data-p="run"]', root), fw = $(".pyfw", root);
    if (o.rows) ta.style.minHeight = o.rows * 22 + "px";
    ta.value = o.code || ""; if (inp) inp.value = (o.inputs || []).join("\n");
    let fmode = false;
    const setFiles = f => { fmode = !!f; fw.innerHTML = f ? filesBox(f) : ""; if (f) fw.querySelectorAll(".pyfile").forEach(t => { t.value = f[t.dataset.n]; t.rows = Math.min(8, Math.max(3, String(f[t.dataset.n]).split("\n").length)); }); };
    const curFiles = () => { const f = {}; fw.querySelectorAll(".pyfile").forEach(t => { f[t.dataset.n] = t.value.replace(/\r/g, ""); }); return f; };
    setFiles(o.files);
    tab4(ta);
    const stText = { idle: "Az első futtatáskor betölt a Python (kb. 10 MB, csak egyszer).", loading: "A Python betöltése… (az első alkalommal fél perc is lehet)", ready: "", failed: failMsg };
    PY.on(s => { st.textContent = stText[s] || ""; });
    const inputs = () => !inp || inp.value === "" ? [] : inp.value.replace(/\r/g, "").split("\n");
    async function run(){
      btn.disabled = true; out.innerHTML = '<span class="dim">Fut…</span>';
      const f0 = fmode ? curFiles() : null;
      const r = await PY.run(ta.value, inputs(), f0 ? { files: f0 } : undefined);
      btn.disabled = false;
      if (r.fail){ out.innerHTML = '<span class="e">' + esc(failMsg) + "</span>"; return r; }
      out.innerHTML = (segsHtml(r.segs, r.err, r.line) || '<span class="dim">(a program nem írt ki semmit)</span>') + (f0 ? filesAfter(f0, r.files) : "");
      return r;
    }
    btn.addEventListener("click", run);
    return { get: () => ta.value, set(c, ins, files){ ta.value = c; if (inp) inp.value = (ins || []).join("\n"); setFiles(files); }, inputs, run, raw: () => ({ code: ta.value }) };
  }

  /* ---------- „Írd meg!” / „Javítsd ki!”: a diák programja minden próbabemenettel lefut, a PYCORE.judge dönt ---------- */
  async function check(T, raw){
    const code = String(raw.code || "");
    if (!C.stripCom(code).trim()) return { ok: false, msg: "Még nincs program. Írd meg a kódmezőbe, és nyomd meg újra az Ellenőrzést." };
    const rs = [];
    for (const t of T.tests){
      const r = await PY.run(C.withCalls(code, t), t.ins || [], C.optsOf(t));
      if (r.fail) return { ok: false, msg: esc(failMsg) + " Hasonlítsd össze a programodat a mintamegoldással (Megoldás lépésenként)." };
      rs.push(r);
      if (r.err) break;
    }
    while (rs.length < T.tests.length) rs.push(rs[rs.length - 1]);
    const j = C.judge(T, code, rs), r = rs[j.k || 0];
    const shown = (T.tests[j.k || 0].ins || []).length ? " (Bemenet: " + T.tests[j.k || 0].ins.map(x => '"' + esc(x) + '"').join(", ") + ")" : "";
    if (j.ok) return { ok: true, msg: "Helyes!" + (T.tests.length === 2 ? " Két különböző bemenetre is jó eredményt adott." : T.tests.length > 2 ? " Mind " + C.az(T.tests.length) + T.tests.length + " próbabemenetre jó eredményt adott." : "") + term(rs[0].segs) };
    return { ok: false, msg: esc(j.why) + shown + term(r.segs, r.err, r.line) };
  }
  const STARTER = "# Írd ide a programot\n";
  // a mappában lévő fájlok a feladat szövegében
  const filesHtml = (files, lead) => { const ks = Object.keys(files || {}); return ks.length ? "<p>" + (lead || (ks.length > 1 ? "A program mappájában ezek a fájlok vannak:" : "A program mappájában ez a fájl van:")) + "</p>" + ks.map(n => '<div class="ffile"><span class="ffile-h">📄 ' + esc(n) + "</span><pre>" + (files[n] === "" ? '<span class="dim">(üres)</span>' : esc(String(files[n]).replace(/\n$/, ""))) + "</pre></div>").join("") : ""; };
  // T: { q, code (minta), starter?, tests, must, mustNot, fstr, ex }
  function task(T, title){
    const needIn = T.tests.some(t => (t.ins || []).length), f0 = T.tests[0].files;
    return { q: T.q + (f0 && !T.noFileShow ? filesHtml(f0, Object.keys(f0).length ? "A program mappájában ez van (a gép más tartalommal is kipróbálja):" : "") : ""), kind: "py", title,
      mount: el => editor(el, { code: T.starter || STARTER, inputs: (T.tests[0].ins || []), noInput: !needIn, files: f0 }),
      answer: '<pre class="code">' + esc(T.code) + "</pre>",
      sol: "<p>" + T.ex + "</p>" + (needIn ? "<p>Próbabemenet: " + T.tests[0].ins.map(x => "<code>" + esc(x) + "</code>").join(" ") + "</p>" : "") + "<p>Egy jó megoldás:</p>",
      check: raw => check(T, raw) };
  }

  /* ---------- „Mit ír ki?”: a választ soronként kell beírni (Python nélkül is megy) ---------- */
  // t: { code, ins?, ans, sol }
  function kiir(t, title){
    const n = C.normOut(t.ans).split("\n").length;
    return { q: (t.q || "Mit ír ki ez a program?") + (t.ins && t.ins.length ? " A bemenet: " + t.ins.map(x => "<code>" + esc(x) + "</code>").join(", ") + "." : "") + filesHtml(t.files) + "<pre class='code'>" + esc(t.code) + "</pre>",
      kind: "kiir", title,
      mount: el => { el.innerHTML = '<label class="kiirlbl">' + (t.lbl || "A kimenet, ahogy a képernyőn megjelenik") + (n > 1 ? " (" + n + " sor)" : "") + ":</label><textarea class=\"kiirta\" rows=\"" + Math.min(Math.max(n, 1), 8) + "\" wrap=\"off\" spellcheck=\"false\" autocapitalize=\"off\" autocomplete=\"off\" aria-label=\"A kimenet\"></textarea>"; const ta = $("textarea", el); return { raw: () => ta.value }; },
      answer: '<pre class="code">' + esc(t.ans) + "</pre>", sol: "<p>" + t.sol + "</p>",
      check: v => C.kiirCheck(v, t.ans) };
  }

  /* ---------- Választós feladat ---------- */
  function choice(q, good, others, sol, bad){
    const opts = K.shuffle([{ l: good, ok: true }].concat(others.map(x => ({ l: x, ok: false }))));
    return { q, kind: "choice", options: opts, answer: good, sol, check: v => ({ ok: !!opts[v.idx].ok, msg: opts[v.idx].ok ? "Helyes!" : (typeof bad === "function" ? bad(opts[v.idx].l) : bad) }) };
  }
  const ERRS = { TimeoutError: "Végtelen ciklus, sosem áll meg", "": "Nincs hiba, lefut", SyntaxError: "SyntaxError", NameError: "NameError", IndentationError: "IndentationError", TypeError: "TypeError", ValueError: "ValueError", ZeroDivisionError: "ZeroDivisionError", IndexError: "IndexError", AttributeError: "AttributeError", ModuleNotFoundError: "ModuleNotFoundError", EOFError: "EOFError", FileNotFoundError: "FileNotFoundError", UnsupportedOperation: "UnsupportedOperation" };
  const ERR_HU = { SyntaxError: "szintaktikai hiba: a Python el sem kezdi futtatni, mert nem érti a sort", NameError: "ismeretlen név: nincs ilyen változó vagy függvény", IndentationError: "behúzási hiba: rossz helyen van szóköz a sor elején", TypeError: "típushiba: ezzel a típussal nem végezhető el a művelet", ValueError: "értékhiba: az érték nem alakítható át (például int(\"alma\"))", ZeroDivisionError: "nullával osztás", IndexError: "indexhiba: nincs ilyen sorszámú elem a listában", AttributeError: "attribútumhiba: ennek az értéknek (vagy modulnak) nincs ilyen metódusa, függvénye", ModuleNotFoundError: "nincs ilyen nevű modul", EOFError: "elfogyott a bemenet: a program több adatot kér be, mint amennyit a felhasználó beírt", FileNotFoundError: "nincs ilyen nevű fájl", UnsupportedOperation: "a fájl nem úgy van megnyitva, ahogy használni akarod (olvasásra nyitottat írni, írásra nyitottat olvasni)", TimeoutError: "a program nem áll meg, mert a ciklusfeltétel mindig igaz marad", "": "nincs hiba" };
  // „Milyen hibát ad?”: t = { code, err, sol }, a választható hibák listája (pool)
  function hiba(t, pool, tip){
    // az IndentationError a SyntaxError egyik fajtája: ne legyen a kettő egymás rossz válasza
    const good = ERRS[t.err], others = K.shuffle(pool.filter(e => e !== t.err && !(t.err === "IndentationError" && e === "SyntaxError"))).slice(0, 3).map(e => ERRS[e]);
    return choice("Milyen hibát ad ez a program, ha lefuttatod?" + (t.files ? (Object.keys(t.files).length ? filesHtml(t.files) : "<p>A program mappája üres: nincs benne egy fájl sem.</p>") : "") + "<pre class='code'>" + esc(t.code) + "</pre>", good, others,
      "<p>" + (t.err === "TimeoutError" ? "<b>Végtelen ciklus</b> (hibaüzenet nincs): " + ERR_HU[t.err] + ". " : t.err ? "<b>" + t.err + "</b>: " + ERR_HU[t.err] + ". " : "") + t.sol + "</p>",
      l => !t.err ? "Nem ez. Ez a program hibátlanul lefut." : "Nem ez. " + (l === ERRS[""] ? "Ez a program nem fut le hibátlanul. " : "") + (tip || "Olvasd végig a sort betűről betűre: zárójel, idézőjel, kis- és nagybetű, szóköz a sor elején."));
  }

  /* ---------- Diák: futtatható példák a hero futtatójába ---------- */
  const TRY = [];
  let hero = null;
  const setHero = ed => { hero = ed; };
  const ex = (code, ins, files) => { TRY.push([code, ins || [], files]); return '<pre class="code">' + esc(code) + "</pre><p><button class='btn' data-try='" + (TRY.length - 1) + "'>▶ Kipróbálom</button></p>"; };
  const tryCode = (code, ins, files) => { if (!hero) return; hero.set(code, ins || [], files); hero.root.scrollIntoView({ behavior: "smooth", block: "center" }); hero.run(); };
  const bindTry = el => el.querySelectorAll("[data-try]").forEach(b => b.addEventListener("click", () => { const t = TRY[+b.dataset.try]; tryCode(t[0], t[1], t[2]); }));
  function heroEditor(root, o){ const ed = editor(root, Object.assign({ primary: true }, o)); ed.root = root; setHero(ed); return ed; }

  /* ---------- Levezetés-lejátszó képkockái ---------- */
  const srcHtml = (src, ln) => '<div class="src">' + src.map((l, i) => '<div class="' + (ln === i + 1 ? "cur" : "") + '"><span class="ln">' + (i + 1) + "</span>" + esc(l) + "</div>").join("") + "</div>";
  const varTbl = v => { const ks = Object.keys(v); return ks.length ? '<div class="ptwrap" style="margin-top:8px"><table class="pt"><tr><th>változó</th>' + ks.map(k => "<th>" + esc(k) + "</th>").join("") + "</tr><tr><td>érték</td>" + ks.map(k => "<td>" + esc(v[k]) + "</td>").join("") + "</tr></table></div>" : ""; };
  const outBox = s => '<div class="fout"><span class="fout-h">Kimenet</span><pre>' + (s ? esc(s) : '<span class="dim">(még üres)</span>') + "</pre></div>";

  return { C, PY, hint, term, segsHtml, editor, heroEditor, check, task, kiir, choice, hiba, ERRS, ex, bindTry, tryCode, srcHtml, varTbl, outBox, failMsg, filesHtml };
})();
