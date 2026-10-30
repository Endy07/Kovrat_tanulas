/* ===== Helyesírás-készlet: betűk, elválasztás, ábécérend, hibatípusok, tollbamondás =====
   A szabályok forrása: A magyar helyesírás szabályai, 12. kiadás (AkH 12, 2015), https://helyesiras.mta.hu
   Ez a fájl DOM nélkül is betölthető (Node-ban a helyesiras-check.js teszteli); a felület a H.dictation(). */
const H = (function(){
  const VOW = "aáeéiíoóöőuúüű";
  const isV = c => VOW.includes(String(c).toLowerCase());
  const DIG = ["dzs", "cs", "dz", "gy", "ly", "ny", "sz", "ty", "zs"];
  // egyszerűsítve kettőzött többjegyű betűk (AkH 7. b, 92.): ssz = sz + sz stb.
  const LONG = { ddzs: "dzs", ccs: "cs", ddz: "dz", ggy: "gy", lly: "ly", nny: "ny", ssz: "sz", tty: "ty", zzs: "zs" };
  const ABC = ["a", "b", "c", "cs", "d", "dz", "dzs", "e", "f", "g", "gy", "h", "i", "j", "k", "l", "ly", "m", "n", "ny", "o", "ö", "p", "q", "r", "s", "sz", "t", "ty", "u", "ü", "v", "w", "x", "y", "z", "zs"];
  const SHORT = { á: "a", é: "e", í: "i", ó: "o", ő: "ö", ú: "u", ű: "ü" };
  const ABC40 = ["a", "á", "b", "c", "cs", "d", "dz", "dzs", "e", "é", "f", "g", "gy", "h", "i", "í", "j", "k", "l", "ly", "m", "n", "ny", "o", "ó", "ö", "ő", "p", "r", "s", "sz", "t", "ty", "u", "ú", "ü", "ű", "v", "z", "zs"];

  /* ---------- Betűkre bontás: [{t: a betű az írott alakban, l: kisbetűs alak, v: magánhangzó?, long: egyszerűsített kettőzés fele}] ---------- */
  function letters(word){
    const w = String(word), lw = w.toLowerCase(), out = [];
    let i = 0;
    while (i < w.length){
      let hit = null;
      for (const k of Object.keys(LONG)) if (lw.startsWith(k, i)){ hit = k; break; }
      if (hit){
        // a két fele: az első jegy kettőzve (ssz → sz + sz); írott alakban az első fél csak egy jegy
        const d = LONG[hit], cut = hit.length - d.length;
        out.push({ t: w.slice(i, i + cut), l: d, v: false, long: 1 });
        out.push({ t: w.slice(i + cut, i + hit.length), l: d, v: false, long: 2 });
        i += hit.length; continue;
      }
      const dg = DIG.find(d => lw.startsWith(d, i));
      if (dg){ out.push({ t: w.slice(i, i + dg.length), l: dg, v: false }); i += dg.length; continue; }
      const c = w[i];
      out.push({ t: c, l: lw[i], v: isV(c) });
      i++;
    }
    return out;
  }
  const letterCount = w => letters(w).filter(x => /[a-záéíóöőúüű]/i.test(x.l)).length;

  /* ---------- Elválasztás a szótagolás szerint (AkH 224–227., egyszerű szavakra) ----------
     Két magánhangzó között: nincs mássalhangzó → a kettő közt; egy → az átkerül; több → csak az utolsó kerül át.
     A dz, dzs egy betű (227.), az ssz-féle egyszerűsített kettőzés két betű (226. f: hosz-szú).
     Összetett szónál a szóhatár dönt (233–236.): azt ez a függvény nem látja, ezért a szólistáink egyszerű szavak. */
  // a szótaghatárok helye a betűk listájában (az adott indexű betű előtt van határ)
  function cutsOf(L){
    const vi = [], cuts = new Set();
    L.forEach((x, i) => { if (x.v) vi.push(i); });
    for (let k = 0; k < vi.length - 1; k++){
      const a = vi[k], b = vi[k + 1];
      cuts.add(b - a - 1 === 0 ? b : b - 1);
    }
    return cuts;
  }
  // a kiírt alak: az egyszerűsített kettőzés elválasztáskor teljes lesz (hosz-szú), ezt a betűk szintjén kell összerakni
  const syllables = word => hyph(word).split("-");
  function hyph(word){
    const L = letters(word), cuts = cutsOf(L);
    if (!cuts.size) return word;
    let s = "";
    L.forEach((x, i) => {
      if (cuts.has(i)) s += "-";
      if (x.long === 1) s += cuts.has(i + 1) ? x.t + x.l.slice(1) : x.t;   // hosz-szú: a sor végén a teljes betű
      else s += x.t;
    });
    return s;
  }

  // a helyes határok helye a sima szóban (karakterindex), és tetszőleges határok beírása (rossz változatokhoz)
  function cutChars(word){
    const L = letters(word), cuts = cutsOf(L), out = [];
    let pos = 0;
    L.forEach((x, i) => { if (cuts.has(i)) out.push(pos); pos += x.t.length; });
    return out;
  }
  const putCuts = (word, pos) => pos.slice().sort((a, b) => b - a).reduce((s, p) => s.slice(0, p) + "-" + s.slice(p), word);
  // tipikus rossz elválasztások: egy határ eltolva egy betűvel; többjegyű betű szétvágva; hosszú kettős betű csonkán (hos-szú)
  function wrongHyphs(word){
    const good = hyph(word), base = cutChars(word), out = new Set();
    const ok = s => s.split("-").every(p => p && [...p].some(isV));
    out.add(putCuts(word, base));
    base.forEach((p, i) => [-1, 1].forEach(d => {
      const q = base.slice(); q[i] = p + d;
      if (new Set(q).size === q.length) out.add(putCuts(word, q));
    }));
    return [...out].filter(s => s !== good && ok(s) && s.replace(/-/g, "") === word);
  }

  /* ---------- Ábécérend (AkH 14.) ---------- */
  function key(word){
    const L = letters(word).filter(x => /[a-záéíóöőúüű]/i.test(x.l));
    return {
      p: L.map(x => ABC.indexOf(SHORT[x.l] || x.l)),       // 1. kör: a rövid és a hosszú magánhangzó egyenrangú
      s: L.map(x => ABC40.indexOf(x.l)),                   // 2. kör: a rövid megelőzi a hosszút
      c: /^[a-záéíóöőúüű]/.test(word) ? 0 : 1                // 3. kör: a kisbetűs a nagybetűs előtt
    };
  }
  function cmpArr(a, b){
    for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] - b[i];
    return a.length - b.length;
  }
  function collate(a, b){
    const A = key(a), B = key(b);
    return cmpArr(A.p, B.p) || cmpArr(A.s, B.s) || (A.c - B.c);
  }
  const sortAbc = list => list.slice().sort(collate);

  /* ---------- Hibatípusok egy szón belül ---------- */
  const lower = s => s.toLowerCase();
  const NORM = {
    kis: s => s.toLowerCase(),
    hossz: s => s.replace(/[áéíóőúű]/g, c => SHORT[c]).replace(/[ÁÉÍÓŐÚŰ]/g, c => SHORT[c.toLowerCase()].toUpperCase()),
    ekezet: s => s.replace(/[áà]/g, "a").replace(/[éè]/g, "e").replace(/í/g, "i").replace(/[óöőô]/g, "o").replace(/[úüű]/g, "u")
                  .replace(/Á/g, "A").replace(/É/g, "E").replace(/Í/g, "I").replace(/[ÓÖŐ]/g, "O").replace(/[ÚÜŰ]/g, "U"),
    jly: s => s.replace(/ly/g, "j").replace(/Ly/g, "J"),
    kettoz: s => s.replace(/(dzs|cs|dz|gy|ly|ny|sz|ty|zs)\1/gi, "$1")
                  .replace(/ddzs|ccs|ddz|ggy|lly|nny|ssz|tty|zzs/gi, m => m.slice(1))
                  .replace(/([bcdfghjklmnprstvz])\1/gi, "$1")
  };
  const CAT = {
    kis:    { n: "Kis- vagy nagybetű", d: "A mondat első szava és a tulajdonnév (név, város, csapat) nagybetűvel kezdődik, a többi kisbetűvel." },
    hossz:  { n: "Magánhangzó hossza", d: "Rövid vagy hosszú magánhangzó: i/í, o/ó, ö/ő, u/ú, ü/ű (a/á, e/é). Mondd ki lassan, és figyeld a szabályokat (-ból/-ről hosszú, -ul/-ül rövid…).", href: "helyesiras-maganhangzok.html" },
    ekezet: { n: "Ékezet", d: "Kimaradt vagy rossz az ékezet (o/ö/ő, u/ü/ű). Más betű, más szó: sor ≠ sör, kor ≠ kör.", href: "helyesiras-maganhangzok.html" },
    jly:    { n: "j vagy ly", d: "A j és az ly ugyanúgy hangzik. Az ly-os szavakat meg kell tanulni (pl. folyik, király, hely, -ly végű szavak).", href: "" },
    kettoz: { n: "Mássalhangzó hossza", d: "Egy vagy két betű? A hosszú mássalhangzót kettőzve írjuk (itt, mellett, akkor); a többjegyűnél szón belül csak az első jegyet (hosszú, asszony), összetett szó határán teljesen (jegygyűrű).", href: "helyesiras-massalhangzok.html" },
    tobbj:  { n: "Többjegyű betű", d: "A cs, dz, dzs, gy, ly, ny, sz, ty, zs egy-egy betű: minden jegyét le kell írni (dzseki, nem dzeki).", href: "helyesiras-betuk-elvalasztas.html" },
    egybe:  { n: "Egybeírás", d: "Ezt egy szóba kell írni (pl. igekötő az ige előtt: megcsinálom; összetett szó: számítógép).", href: "" },
    kulon:  { n: "Különírás", d: "Ezt két szóba kell írni.", href: "" },
    irasjel:{ n: "Írásjel", d: "Pont, vessző, kérdőjel. A mondat végére írásjel kell; a vessző a tagmondatok közé (a két tagmondatot összekötő és, de, mert, hogy elé is); a két szót összekötő és elé nem kell.", href: "" },
    hiany:  { n: "Kimaradt szó", d: "Ez a szó kimaradt. Ha nem hallottad jól, hallgasd meg újra a mondatot.", href: "" },
    tobblet:{ n: "Fölösleges szó", d: "Ez a szó nincs a szövegben.", href: "" },
    eliras: { n: "Egyéb elírás", d: "Más betű került a szóba. Olvasd el lassan, betűnként.", href: "" }
  };
  const ORDER = ["kis", "hossz", "kettoz", "jly", "ekezet"];
  function subsets(arr, k, start, cur, out){
    if (cur.length === k){ out.push(cur.slice()); return; }
    for (let i = start; i < arr.length; i++){ cur.push(arr[i]); subsets(arr, k, i + 1, cur, out); cur.pop(); }
  }
  const SUBS = (() => { const o = []; for (let k = 1; k <= 4; k++) subsets(ORDER, k, 0, [], o); return o.filter(s => !(s.includes("hossz") && s.includes("ekezet"))); })();
  // mely átalakítások teszik egyenlővé a beírt és a helyes szót? (a legkevesebb, ami elég)
  function classify(typed, right){
    if (typed === right) return [];
    for (const s of SUBS){
      const f = x => s.reduce((acc, k) => NORM[k](acc), x);
      if (f(typed) === f(right)) return s.slice();
    }
    const a = letters(typed), b = letters(right);
    if (a.length === b.length && a.every((x, i) => x.l === b[i].l || ((x.l.length > 1 || b[i].l.length > 1) && x.l[0] === b[i].l[0]))) return ["tobbj"];
    {
      // többjegyű betű csonkán vagy fölösleges jeggyel (dzeki ↔ dzseki, szinte ↔ sinte)
      const strip = x => lower(x).replace(/dzs/g, "1").replace(/cs/g, "2").replace(/dz/g, "3").replace(/gy/g, "4").replace(/ly/g, "5").replace(/ny/g, "6").replace(/sz/g, "7").replace(/ty/g, "8").replace(/zs/g, "9");
      const A = strip(typed), B = strip(right);
      if (A.length === B.length){
        let diff = 0, dig = true;
        for (let i = 0; i < A.length; i++) if (A[i] !== B[i]){ diff++; if (!/\d/.test(A[i] + B[i])) dig = false; }
        if (diff && diff <= 2 && dig) return ["tobbj"];
      }
    }
    return ["eliras"];
  }

  /* ---------- Szöveg összevetése szavanként (szerkesztési távolság, egybe/külön felismeréssel) ---------- */
  const TOK = /[0-9A-Za-zÀ-ž]+(?:-[0-9A-Za-zÀ-ž]+)*|[.,!?;:–—"„”»«'()]/g;
  const tokens = s => String(s).replace(/[’`]/g, "'").match(TOK) || [];
  const isP = t => !/[0-9A-Za-zÀ-ž]/.test(t);
  function lev(a, b){
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 1; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function subCost(t, r){
    if (t === r) return 0;
    if (isP(t) !== isP(r)) return Infinity;
    if (isP(t)) return 1;
    const a = NORM.ekezet(lower(t)), b = NORM.ekezet(lower(r));
    return lev(a, b) / Math.max(a.length, b.length) <= 0.5 ? 1 : 1.8;
  }
  // ops: {op:"ok"|"sub"|"ins"(fölösleges)|"del"(kimaradt)|"egybe"|"kulon", t: beírt, r: helyes, cats}
  function align(typed, right){
    const A = tokens(typed), B = tokens(right), m = A.length, n = B.length;
    const D = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(Infinity)), P = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(null));
    D[0][0] = 0;
    const same = (x, y) => lower(x) === lower(y);
    for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++){
      const c = D[i][j]; if (c === Infinity) continue;
      const tr = (ii, jj, cost, op) => { if (c + cost < D[ii][jj]){ D[ii][jj] = c + cost; P[ii][jj] = [i, j, op]; } };
      if (i < m && j < n) tr(i + 1, j + 1, subCost(A[i], B[j]), A[i] === B[j] ? "ok" : "sub");
      if (i < m) tr(i + 1, j, isP(A[i]) ? 0.9 : 1, "ins");
      if (j < n) tr(i, j + 1, isP(B[j]) ? 0.9 : 1, "del");
      // két beírt szó = egy helyes (külön írta, de egybe kell)
      if (i + 1 < m && j < n && !isP(A[i]) && !isP(A[i + 1]) && !isP(B[j]) && classify(A[i] + A[i + 1], B[j]).every(k => k !== "eliras")) tr(i + 2, j + 1, same(A[i] + A[i + 1], B[j]) ? 0.9 : 1.4, "egybe");
      // egy beírt szó = két helyes (egybeírta, de külön kell)
      if (i < m && j + 1 < n && !isP(A[i]) && !isP(B[j]) && !isP(B[j + 1]) && classify(A[i], B[j] + B[j + 1]).every(k => k !== "eliras")) tr(i + 1, j + 2, same(A[i], B[j] + B[j + 1]) ? 0.9 : 1.4, "kulon");
    }
    const ops = [];
    let i = m, j = n;
    while (i > 0 || j > 0){
      const p = P[i][j]; if (!p) break;
      const [pi, pj, op] = p;
      const t = A.slice(pi, i).join(" "), r = B.slice(pj, j).join(" ");
      let cats = [];
      if (op === "sub") cats = isP(r) ? ["irasjel"] : classify(t, r);
      else if (op === "ins") cats = isP(t) ? ["irasjel"] : ["tobblet"];
      else if (op === "del") cats = isP(r) ? ["irasjel"] : ["hiany"];
      else if (op === "egybe"){ cats = ["egybe"].concat(classify(A.slice(pi, i).join(""), r).filter(k => k !== "eliras")); }
      else if (op === "kulon"){ cats = ["kulon"].concat(classify(t, B.slice(pj, j).join("")).filter(k => k !== "eliras")); }
      ops.push({ op, t, r, cats });
      i = pi; j = pj;
    }
    return ops.reverse();
  }

  /* ---------- Karakterszintű kiemelés: a helyes szóban mely betűk térnek el ---------- */
  function markDiff(typed, right){
    const a = typed, b = right, m = a.length, n = b.length;
    const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) d[i][j] = a[i] === b[j] ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
    let i = 0, j = 0, out = "";
    const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    while (j < n){
      if (i < m && a[i] === b[j]){ out += esc(b[j]); i++; j++; }
      else if (i < m && d[i + 1][j] >= d[i][j + 1]) i++;
      else { out += "<u>" + esc(b[j]) + "</u>"; j++; }
    }
    return out;
  }

  /* ---------- Közös feladatfajták (a K a kit.js-ből, futáskor) ----------
     Hiánypótlás: "t[í]z" (a zárójelben a helyes; a párja magától: í ↔ i, ll ↔ l, ssz ↔ sz; vagy kézzel: "[ll|l]").
     Mondat: "A {tanító|tanitó} néni…" (az első a helyes, a többi rossz). */
  const PAIR = { i: "í", í: "i", o: "ó", ó: "o", ö: "ő", ő: "ö", u: "ú", ú: "u", ü: "ű", ű: "ü", a: "á", á: "a", e: "é", é: "e" };
  function altOf(x){
    if (PAIR[x]) return PAIR[x];
    const lx = x.toLowerCase();
    if (/^(cs|dz|gy|ly|ny|sz|ty|zs)\1$/.test(lx)) return x.slice(0, 1) + x.slice(2);     // gygy → ggy
    if (LONG[lx]) return LONG[lx];                                                     // ssz → sz
    if (/^(dzs|cs|dz|gy|ly|ny|sz|ty|zs)$/.test(lx)) return x[0] + x;                    // sz → ssz
    if (/^([bcdfghjklmnprstvz])\1$/.test(lx)) return x[0];                              // ll → l
    if (/^[bcdfghjklmnprstvz]$/.test(lx)) return x + x;                                 // l → ll
    return null;
  }
  function gapParse(item){
    const parts = [], re = /\[([^\]]+)\]/g; let m, last = 0;
    while ((m = re.exec(item))){ parts.push({ pre: item.slice(last, m.index), opts: m[1].split("|") }); last = re.lastIndex; }
    return { parts, tail: item.slice(last) };
  }
  const gapWord = item => item.replace(/\[([^\]|]+)(\|[^\]]*)?\]/g, "$1");
  function sentParse(s){
    const m = s.match(/\{([^}]+)\}/), alts = m[1].split("|");
    return { pre: s.slice(0, m.index), post: s.slice(m.index + m[0].length), good: alts[0], bad: alts.slice(1) };
  }
  const sentGood = s => s.replace(/\{([^}|]+)[^}]*\}/g, "$1");
  function choiceTask(q, good, others, sol, bad){
    const opts = K.shuffle([{ l: good, ok: true }].concat(others.map(x => ({ l: x, ok: false }))));
    return { q, kind: "choice", options: opts, answer: good, sol, check: v => ({ ok: !!opts[v.idx].ok, msg: opts[v.idx].ok ? "Helyes!" : bad }) };
  }
  // item: [jelölt szó, magyarázat]
  function gapTask(item){
    const esc = K.esc, G = gapParse(item[0]), k = K.rnd(0, G.parts.length - 1), p = G.parts[k];
    const good = p.opts[0], alt = p.opts[1] || altOf(good);
    let shown = "", full = "";
    G.parts.forEach((x, i) => { shown += esc(x.pre) + (i === k ? '<span class="gap">_</span>' : esc(x.opts[0])); full += esc(x.pre) + (i === k ? "<b><u>" + esc(x.opts[0]) + "</u></b>" : esc(x.opts[0])); });
    shown += esc(G.tail); full += esc(G.tail);
    return choiceTask("Mi kerül a vonal helyére? <span class='num'>" + shown + "</span>", good, [alt],
      "<p>Helyesen: <b>" + full + "</b></p>" + (item[1] ? "<p>" + item[1] + "</p>" : ""), "Nem ez. " + (item[1] ? item[1].replace(/<[^>]+>/g, "") : "Nézd meg a puskát."));
  }
  // „Melyik a helyes?” a mondatban
  function sentChoice(item){
    const esc = K.esc, S = sentParse(item[0]);
    return choiceTask("Melyik szó illik a mondatba?<div class='sent'>" + esc(S.pre) + '<span class="gap">?</span>' + esc(S.post) + "</div>", S.good, S.bad,
      "<p class='sent'>" + esc(S.pre) + "<b>" + esc(S.good) + "</b>" + esc(S.post) + "</p>" + (item[1] ? "<p>" + item[1] + "</p>" : ""), "Nem ez. " + (item[1] ? item[1].replace(/<[^>]+>/g, "") : ""));
  }
  // hibakeresés: a mondatban egy szó rossz; a diák beírja helyesen
  function sentFix(item){
    const esc = K.esc, S = sentParse(item[0]), wrong = K.pick(S.bad);
    const words = (S.pre + S.post).split(/\s+/).map(w => w.replace(/[.,!?:;]/g, "")).filter(Boolean);
    return { q: "Egy szó hibás ebben a mondatban. Írd be <b>helyesen</b>!<div class='sent'>" + esc(S.pre) + esc(wrong) + esc(S.post) + "</div>", kind: "input", ph: "a javított szó", answer: S.good,
      sol: "<p>A hibás szó: <s>" + esc(wrong) + "</s> → <b>" + markDiff(wrong, S.good) + "</b></p>" + (item[1] ? "<p>" + item[1] + "</p>" : ""),
      check: v => {
        const t = String(v).trim().replace(/[.,!?]$/, "");
        if (t === S.good || (t.toLowerCase() === S.good.toLowerCase() && !/^[A-ZÁÉÍÓÖŐÚÜŰ]/.test(S.good))) return { ok: true, msg: "Helyes!" };
        if (t.toLowerCase() === S.good.toLowerCase()) return { ok: false, msg: "Majdnem: a mondat első szava nagybetűvel kezdődik." };
        if (t === wrong) return { ok: false, msg: "Ezt a szót megtaláltad, de javítsd is ki!" };
        if (words.includes(t)) return { ok: false, msg: "Ez a szó jó a mondatban. Keresd a hibásat!" };
        const c = classify(t, S.good);
        return { ok: false, msg: c.includes("eliras") ? "Nem jó. Keresd meg a hibás szót, és írd le helyesen." : "Majdnem jó, de még mindig hibás: " + c.map(x => CAT[x].n.toLowerCase()).join(", ") + "." };
      } };
  }

  /* ---------- Tollbamondás-szövegek ----------
     Minden mondat kétszer ellenőrizve (AkH 12 szerint), lektorálva. A szöveg a lecke szabályait sűríti. */
  const TEXTS = {
    betuk: [
      { id: "b1", t: "Edzés után", s: [
        "Csütörtökön délután edzés volt a pályán.",
        "Az edzőnk új gyakorlatot hozott: futás közben kellett passzolni.",
        "Gyuri a kapuban állt, és szinte minden lövést kivédett.",
        "A végén a dzsekimet a padon felejtettem, de Zsolt utánam hozta.",
        "Hosszú nap volt, mégis jókedvűen mentem haza." ] },
      { id: "b2", t: "Az új gép", s: [
        "Anyáék szombaton vettek egy gyors számítógépet.",
        "A dobozban volt egy egér, egy billentyűzet és egy vastag kábel is.",
        "Bekapcsoltam, és rögtön frissítéseket kezdett letölteni.",
        "Nagyon vártam, hogy kipróbáljam az új játékomat.",
        "Este a bátyámmal együtt játszottunk, amíg anya ránk nem szólt." ] },
      { id: "b3", t: "Kirándulás", s: [
        "Az osztállyal hosszú kirándulásra mentünk a Mecsekbe.",
        "A poggyászunk a busz csomagtartójában volt.",
        "Útközben megálltunk egy kis faluban, ahol friss pogácsát vettünk.",
        "A tanárnő megmutatta, hogyan kell térképet olvasni.",
        "Egy idős asszony megkérdezte, honnan jöttünk." ] }
    ],
    maganhangzok: [
      { id: "m1", t: "A döntő", s: [
        "A döntőt hét órakor kezdték a sportcsarnokban.",
        "Húsz perccel korábban érkeztünk, mert jó helyet akartunk.",
        "A csapatunk végül háromszor talált be a kapuba.",
        "A szurkolók a lelátóról hangosan biztatták a játékosokat.",
        "Fáradtan, de boldogan indultunk haza a hűvös éjszakában." ] },
      { id: "m2", t: "Programozásóra", s: [
        "Kedden a tanár új feladatot írt fel a táblára.",
        "Egy olyan programot kellett írnunk, amely kiszámítja a számok átlagát.",
        "Először hibát kaptam, mert kifelejtettem egy zárójelet.",
        "A padtársam segített, és a program végül hibátlanul lefutott.",
        "Óra után még sokáig gyakoroltunk a gépteremben." ] },
      { id: "m3", t: "Az új szomszéd", s: [
        "A szomszédba egy fiú költözött, aki szintén szereti a focit.",
        "Tegnap az udvaron együtt rúgtuk a labdát.",
        "Megtudtam, hogy ő is műszaki technikumba jár.",
        "Szívesen kölcsönadta nekem az új kapuskesztyűjét.",
        "Hétvégén a barátaival együtt kimegyünk a pályára." ] }
    ],
    massalhangzok: [
      { id: "s1", t: "Az új telefon", s: [
        "Tegnap este anya hozott nekem egy új telefont.",
        "Rögtön beállítottam rajta a kedvenc alkalmazásaimat.",
        "Utána felhívtam Annát, hogy megkérdezzem, mit csinál.",
        "Azt mondta, hogy éppen a holnapi dolgozatra készül.",
        "Ezért inkább én is elővettem a füzetemet, és tanultam egy kicsit." ] },
      { id: "s2", t: "Csapatverseny", s: [
        "Az iskolai versenyen három csapat indult.",
        "A mi csapatunk lett a legjobb, mert senki sem adta fel.",
        "A döntő előtt mindenki izgult, de a végén nagyot ünnepeltünk.",
        "Az igazgató egy szép serleggel jutalmazta a győzteseket.",
        "Jövőre még több ember jelentkezik, mert mindenkinek tetszett a verseny." ] },
      { id: "s3", t: "A hosszú szünet", s: [
        "A hosszú szünetben kimentünk az udvarra focizni.",
        "Peti hozott egy vadonatúj labdát, amelyet a nagyapjától kapott.",
        "Egy rossz rúgás után a labda a kerítésen túlra repült.",
        "Hiába kerestük mindannyian, csak a csengetés után találtuk meg.",
        "Másnap már óvatosabban játszottunk, és senki sem rúgta át a kerítésen." ] }
    ],
    vegyes: [
      { id: "v1", t: "Programozóverseny", s: [
        "Pénteken az iskolában programozóversenyt rendeztek.",
        "Négyfős csapatokban kellett egy kis játékot készíteni.",
        "A mi csapatunk egy ugráló kockáról szóló programot írt.",
        "Nagy szerencsénk volt, mert az utolsó percben találtuk meg a hibát.",
        "Az eredményhirdetésen a második helyet szereztük meg, és mindannyian büszkék voltunk." ] },
      { id: "v2", t: "Esős délután", s: [
        "Esős délután volt, ezért nem mentünk ki a pályára.",
        "Inkább otthon maradtam, és rendet raktam a szobámban.",
        "A szekrény mögött megtaláltam a régi játékkonzolomat.",
        "Azonnal bekapcsoltam, és meglepődtem, hogy még mindig működik.",
        "Este a húgommal együtt játszottunk egy régi autóversenyes játékkal." ] },
      { id: "v3", t: "Iskolakezdés", s: [
        "Szeptemberben új iskolába kerültem Debrecenben.",
        "Az első napon kicsit izgultam, mert senkit sem ismertem.",
        "Az osztályfőnökünk kedvesen fogadott minket, és bemutatta a tanárokat.",
        "A szünetben megismerkedtem két fiúval, akik szintén szeretnek programozni.",
        "Azóta minden reggel együtt megyünk a buszmegállótól az iskoláig." ] }
    ]
  };
  const GROUPS = { betuk: "Betűk, ábécé, elválasztás", maganhangzok: "Magánhangzók hossza", massalhangzok: "Mássalhangzók hossza", vegyes: "Vegyes, ismétlő" };

  // felolvasáshoz: az írásjeleket kimondjuk (a vesszőt a 9. leckéig nem várjuk el fejből)
  const sayPunct = s => s.replace(/,/g, " vessző,").replace(/:/g, " kettőspont,").replace(/\?$/, " kérdőjel.").replace(/!$/, " felkiáltójel.").replace(/\.$/, " pont.");
  // darabonként: vesszőnél és kb. négy szavanként
  function chunks(s){
    const out = [];
    s.split(/(?<=[,:])\s+/).forEach(part => {
      const w = part.split(/\s+/);
      let i = 0;
      while (i < w.length){
        const rest = w.length - i, take = rest <= 5 ? rest : rest === 6 ? 3 : 4;   // a végén ne maradjon egy-két szó
        out.push(w.slice(i, i + take).join(" ")); i += take;
      }
    });
    return out;
  }

  /* ---------- A tollbamondás felülete (böngészőben, a kit.js K-jával) ---------- */
  function dictation(root, o){
    const esc = K.esc, $ = K.$, $$ = K.$$;
    const list = o.texts, player = o.player;
    const S = { k: 0, n: -1, punct: true };
    root.innerHTML =
      '<div class="dict">' +
      '<div class="tabs" role="tablist" aria-label="Szöveg">' + list.map((x, i) => '<button class="tab" data-d="' + i + '">' + (i + 1) + ". " + esc(x.t) + "</button>").join("") + "</div>" +
      '<div class="dict-bar"><button class="btn primary" data-a="say">▶ Első mondat</button><button class="btn" data-a="again" disabled>↺ Újra ezt</button>' +
      '<button class="btn" data-a="slow" disabled>🐢 Darabonként</button>' +
      '<select data-a="rate" aria-label="Tempó"><option value=".7">Lassú</option><option value=".85" selected>Normál</option><option value="1">Gyorsabb</option></select>' +
      '<label class="dict-chk"><input type="checkbox" data-a="punct" checked> Az írásjeleket is mondja</label></div>' +
      '<div class="dict-stat" aria-live="polite"></div>' +
      '<p class="warn" hidden style="color:var(--bad)">Ezen az eszközön nincs magyar felolvasó hang. Edge böngészőben biztosan működik, vagy Endi felolvassa a nyomtatható lapról.</p>' +
      '<textarea class="dict-in" rows="7" spellcheck="false" autocorrect="off" autocapitalize="off" autocomplete="off" aria-label="Ide írd a tollbamondást" placeholder="Ide írd, amit hallasz. Mondatonként halad: ha végeztél egy mondattal, nyomd meg a „Következő mondat” gombot."></textarea>' +
      '<div class="row"><button class="btn primary" data-a="check">✓ Kész, ellenőrizd</button><button class="btn" data-a="reset">Újrakezdem</button>' +
      '<button class="btn" data-a="show">Mutasd a szöveget</button>' + (o.print ? '<a class="btn" href="' + o.print + '">🖨 Nyomtatható változat</a>' : "") + "</div>" +
      '<div class="dict-res"></div></div>';
    const ta = $(".dict-in", root), stat = $(".dict-stat", root), res = $(".dict-res", root), rate = $('[data-a="rate"]', root);
    const btn = a => $('[data-a="' + a + '"]', root);
    const cur = () => list[S.k];
    function sync(){
      $$(".tab", root).forEach((b, i) => b.setAttribute("aria-selected", String(i === S.k)));
      const x = cur(), last = S.n >= x.s.length - 1;
      btn("say").textContent = S.n < 0 ? "▶ Első mondat" : last ? "Vége a szövegnek" : "▶ Következő mondat";
      btn("say").disabled = last;
      btn("again").disabled = btn("slow").disabled = S.n < 0;
      stat.textContent = S.n < 0 ? x.s.length + " mondat. Ha készen állsz, indítsd az első mondatot." :
        (S.n + 1) + ". mondat / " + x.s.length + (last ? " · Ez volt az utolsó. Olvasd át, amit írtál, aztán ellenőrizd." : "");
      $(".warn", root).hidden = !(K.tts.ok && !K.tts.hasHu()) && K.tts.ok;
    }
    function speak(text){ K.tts.rate = Number(rate.value); K.tts.say(S.punct ? sayPunct(text) : text); }
    function sayChunks(){
      const parts = chunks(cur().s[S.n]); let i = 0;
      const next = () => { if (i >= parts.length) return; const p = parts[i++]; K.tts.rate = Number(rate.value) * 0.9; K.tts.say(S.punct ? sayPunct(p) : p, () => setTimeout(next, 900)); };
      next();
    }
    function load(k){ K.tts.stop(); S.k = k; S.n = -1; ta.value = ""; res.innerHTML = ""; sync(); }
    function check(){
      K.tts.stop();
      // csak az eddig felolvasott mondatokkal vetjük össze (ha a gép diktált); ha nem, az egész szöveggel
      const x = cur(), upto = S.n >= 0 ? S.n + 1 : x.s.length, right = x.s.slice(0, upto).join(" "), typed = ta.value.trim();
      if (!typed){ res.innerHTML = '<div class="feedback bad">Még nem írtál semmit.</div>'; return; }
      // ha nem írta végig: azzal a mondatszámmal vetjük össze, amelyiknél a legkevesebb az eltérés; a hiányzó vég megjegyzés lesz
      let ops = align(typed, right), best = ops.filter(p => p.op !== "ok").length, kk = upto;
      for (let k = 1; k < upto; k++){
        const o = align(typed, x.s.slice(0, k).join(" ")), e = o.filter(p => p.op !== "ok").length;
        if (e < best){ best = e; ops = o; kk = k; }
      }
      const tailMissing = kk < upto ? x.s.slice(kk, upto).join(" ").split(/\s+/).length : 0;
      // az írásjelhibához az előtte álló szó is kell, hogy látsszon, hová kellett volna
      ops.forEach((p, i) => { if (p.cats.includes("irasjel")){ const prev = ops.slice(0, i).reverse().find(q => q.r && !isP(q.r)); p.ctx = prev ? prev.r : ""; } });
      const errs = ops.filter(p => p.op !== "ok");
      // a helyes szöveg, a hibák kiemelésével
      let html = "";
      ops.forEach(p => {
        const sp = (html && !(p.r && isP(p.r) && /^[.,!?;:)”]/.test(p.r))) ? " " : "";
        if (p.op === "ok") html += sp + esc(p.r);
        else if (p.op === "ins") html += sp + '<del title="fölösleges">' + esc(p.t) + "</del>";
        else if (p.op === "del") html += sp + '<mark class="miss" title="kimaradt">' + esc(p.r) + "</mark>";
        else html += sp + '<mark title="' + esc(p.cats.map(c => CAT[c].n).join(", ")) + '">' + (p.op === "sub" && !isP(p.r) ? markDiff(p.t, p.r) : esc(p.r)) + '</mark><span class="was">' + esc(p.t) + "</span>";
      });
      // hibák szabályonként
      const by = {};
      errs.forEach(p => p.cats.forEach(c => { (by[c] = by[c] || []).push(p); }));
      const words = errs.filter(p => !p.cats.includes("irasjel")).length, punct = errs.length - words;
      let sum = '<div class="feedback ' + (errs.length ? "bad" : "ok") + '">' +
        (errs.length ? "Helyesírási hiba: " + words + (punct ? " · írásjel: " + punct : "") : "✓ Hibátlan! Szép munka.") + "</div>";
      sum += '<div class="dict-text">' + html + "</div>";
      if (tailMissing) sum += '<div class="note">A szöveg végéről ennyi szó hiányzik: ' + tailMissing + ". Ha még nem írtad végig, ezt nem számoltuk hibának.</div>";
      Object.keys(CAT).filter(c => by[c]).forEach(c => {
        const L = by[c];
        sum += '<div class="dict-cat"><b>' + CAT[c].n + " (" + L.length + ")</b><span>" + CAT[c].d + (CAT[c].href ? ' <a href="' + CAT[c].href + '">Nézd át a leckét →</a>' : "") + "</span>" +
          '<span class="dict-pairs">' + L.map(p => c === "irasjel" ? "…" + esc(p.ctx || "") + (p.r ? "<b>" + esc(p.r) + "</b>" : " <s>" + esc(p.t) + "</s> (nem kell)") :
            (p.t ? '<s>' + esc(p.t) + "</s> → " : "") + "<b>" + esc(p.r || "(nem kell)") + "</b>").join(" · ") + "</span></div>";
      });
      if (errs.length && player) sum += '<div class="row"><button class="btn" data-a="replay">▶ A javítás lejátszva</button></div>';
      res.innerHTML = sum;
      S.lastErrs = errs;
      try { const k = "kovrat-tb-" + x.id, best = K.store.get(k); if (best === null || words < Number(best)) K.store.set(k, String(words)); } catch (e){}
    }
    function replayFrames(errs){
      const F = [{ cap: "Nézzük végig a hibákat egyenként. Összesen ennyi: " + errs.length + ".", html: '<div class="hw">' + esc(cur().t) + "</div>" }];
      errs.forEach((p, i) => {
        const c = p.cats.map(k => CAT[k]);
        const what = p.op === "del" ? "Kimaradt: " + p.r + "." : p.op === "ins" ? "Ezt nem kellett volna leírni: " + p.t + "." : "Ezt írtad: " + p.t + ". Helyesen: " + p.r + ".";
        F.push({ cap: what + " " + c.map(x => x.n + ": " + x.d).join(" "),
          html: '<div class="hw-row">' + (p.t ? '<span class="hw bad">' + esc(p.t) + "</span>" : "") + (p.r ? '<span class="hw">' + (p.op === "sub" && !isP(p.r) ? markDiff(p.t, p.r) : esc(p.r)) + "</span>" : "") + "</div>" +
            '<div class="dim">' + (i + 1) + ". hiba · " + c.map(x => x.n).join(", ") + "</div>" });
      });
      F.push({ cap: "Ennyi volt. Írd le még egyszer a hibás szavakat helyesen, háromszor: így megmaradnak.", html: '<div class="hw-row">' + errs.filter(p => p.r && !isP(p.r)).map(p => '<span class="hw">' + esc(p.r) + "</span>").join("") + "</div>" });
      return F;
    }
    root.addEventListener("click", e => {
      const t = e.target.closest(".tab"); if (t && t.dataset.d != null){ load(Number(t.dataset.d)); return; }
      const b = e.target.closest("[data-a]"); if (!b) return;
      const a = b.dataset.a;
      if (a === "say"){ if (S.n < cur().s.length - 1){ S.n++; sync(); speak(cur().s[S.n]); ta.focus({ preventScroll: true }); } }
      else if (a === "again" && S.n >= 0) speak(cur().s[S.n]);
      else if (a === "slow" && S.n >= 0) sayChunks();
      else if (a === "check") check();
      else if (a === "reset") load(S.k);
      else if (a === "show"){ const sh = res.querySelector(".dict-show"); if (sh) sh.remove(); else res.insertAdjacentHTML("afterbegin", '<div class="dict-show">' + cur().s.map(esc).join(" ") + "</div>"); }
      else if (a === "replay" && S.lastErrs){ player.load(replayFrames(S.lastErrs), "Javítás: " + cur().t, true); player.el && player.el.scrollIntoView({ behavior: "smooth", block: "center" }); }
    });
    $('[data-a="punct"]', root).addEventListener("change", e => { S.punct = e.target.checked; });
    load(0);
    return { load, check, set(v){ ta.value = v; } };
  }

  return { VOW, isV, ABC40, letters, letterCount, syllables, hyph, cutChars, putCuts, wrongHyphs, altOf, gapParse, gapWord, sentParse, sentGood, choiceTask, gapTask, sentChoice, sentFix, collate, sortAbc, NORM, CAT, classify, tokens, align, markDiff, TEXTS, GROUPS, sayPunct, chunks, dictation };
})();
if (typeof module !== "undefined") module.exports = H;
