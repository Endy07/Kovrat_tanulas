/* ===== Közös leckekészlet: segédek, felolvasás, diák, lejátszó, gyakorlás, szerkesztő ===== */
const K = (function(){
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
  // a/az szám előtt (1 és az 5-tel kezdődők: az; minden más: a). Toldalékot számok után nem generálunk.
  const art = n => (Number(n) === 1 || String(n)[0] === "5") ? "az" : "a";
  const Art = n => { const a = art(n); return a[0].toUpperCase() + a.slice(1); };
  const norm = s => String(s == null ? "" : s).replace(/\s+/g, "").toUpperCase();
  const store = {
    get(k){ try { return localStorage.getItem(k); } catch (e){ return null; } },
    set(k, v){ try { localStorage.setItem(k, v); } catch (e){} }
  };
  const grade = p => p >= 85 ? 5 : p >= 70 ? 4 : p >= 50 ? 3 : p >= 35 ? 2 : 1;

  /* ---------- Felolvasás (Web Speech API) ---------- */
  const tts = (function(){
    const synth = window.speechSynthesis;
    const api = { on: false, voice: null, rules: [], ok: !!synth && typeof SpeechSynthesisUtterance !== "undefined", rate: 1, say(){}, stop(){}, onvoice: null };
    if (!api.ok) return api;
    let token = 0, safety = null;
    function speakable(html){
      let s = html;
      api.rules.forEach(r => { s = s.replace(r[0], r[1]); });
      return s.replace(/<[^>]+>/g, "")
        .replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
        .replace(/\s·\s/g, " szorozva ").replace(/\s−\s/g, " mínusz ").replace(/\s\+\s/g, " plusz ")
        .replace(/\s=\s/g, " egyenlő ").replace(/\s→\s/g, " ").replace(/✓/g, "")
        .replace(/\s+,/g, ",").replace(/,\s*\./g, ".").replace(/,\s*,/g, ",");
    }
    function pickVoice(){
      const hu = synth.getVoices().filter(v => /^hu/i.test(v.lang));
      api.voice = hu.find(v => /natural|online/i.test(v.name)) || hu[0] || null;
      api.onvoice && api.onvoice();
    }
    pickVoice();
    if (synth.addEventListener) synth.addEventListener("voiceschanged", pickVoice);
    api.hasHu = () => !!api.voice || !synth.getVoices().length;
    api.stop = () => { token++; clearTimeout(safety); synth.cancel(); };
    api.say = (html, done) => {
      api.stop();
      const my = token, text = speakable(html);
      let finished = false;
      const fin = () => { if (finished || my !== token) return; finished = true; clearTimeout(safety); done && done(); };
      // a Chrome néha nem jelzi a végét, ezért van egy biztonsági időzítő
      safety = setTimeout(fin, text.length * 160 + 6000);
      setTimeout(() => {
        if (my !== token) return;
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "hu-HU";
        if (api.voice) u.voice = api.voice;
        u.rate = api.rate;
        u.onend = fin;
        u.onerror = e => { if (e.error !== "interrupted" && e.error !== "canceled") fin(); };
        synth.speak(u);
      }, 60);
    };
    const saved = store.get("kovrat-tts");
    api.on = saved !== "0";
    api.set = v => { api.on = v; store.set("kovrat-tts", v ? "1" : "0"); };
    return api;
  })();

  /* ---------- Levezetés-lejátszó: előre legenerált képkockák {cap, html} ---------- */
  function player(root, o){
    o = o || {};
    root.innerHTML =
      '<div class="pb"><div class="pb-bar"><b class="pb-title"></b><span class="pb-count"></span></div>' +
      '<div class="pb-stage"></div><div class="pb-cap" aria-live="polite"></div>' +
      '<div class="pb-bar"><button class="btn" data-a="first" aria-label="Az elejére">⏮</button>' +
      '<button class="btn" data-a="prev">◀ Vissza</button><button class="btn primary" data-a="play">▶ Lejátszás</button>' +
      '<button class="btn" data-a="next">Tovább ▶</button>' +
      '<select data-a="speed" aria-label="Tempó"><option value="6000">Lassú</option><option value="4200" selected>Normál</option><option value="2800">Gyors</option><option value="1700">Nagyon gyors</option></select>' +
      '<button class="btn" data-a="voice" aria-pressed="false" hidden></button></div>' +
      '<p class="warn" hidden style="color:var(--bad)">Nincs magyar hang ezen az eszközön. Edge böngészőben biztosan működik a felolvasás.</p></div>';
    const P = { frames: [], k: 0, playing: false, timer: null };
    const stage = $(".pb-stage", root), cap = $(".pb-cap", root), cnt = $(".pb-count", root), playBtn = $('[data-a="play"]', root);
    const voiceBtn = $('[data-a="voice"]', root), warn = $(".warn", root), speed = $('[data-a="speed"]', root);
    const rates = { "6000": .8, "4200": .92, "2800": 1.05, "1700": 1.2 };
    function show(k){
      P.k = Math.max(0, Math.min(P.frames.length - 1, k));
      const f = P.frames[P.k];
      if (!f) return;
      stage.innerHTML = f.html; cap.innerHTML = f.cap;
      cnt.textContent = (P.k + 1) + " / " + P.frames.length;
      $('[data-a="prev"]', root).disabled = P.k === 0;
      $('[data-a="first"]', root).disabled = P.k === 0;
      $('[data-a="next"]', root).disabled = P.k === P.frames.length - 1;
    }
    function pause(){ P.playing = false; clearTimeout(P.timer); tts.stop(); playBtn.textContent = P.k >= P.frames.length - 1 && P.frames.length ? "↺ Újra" : "▶ Lejátszás"; }
    function advance(){
      if (!P.playing) return;
      if (P.k >= P.frames.length - 1){ pause(); return; }
      show(P.k + 1); schedule();
    }
    function schedule(){
      if (!P.playing) return;
      clearTimeout(P.timer); tts.stop();
      const f = P.frames[P.k];
      if (tts.on && tts.ok){
        tts.rate = rates[speed.value] || 1;
        tts.say(f.cap, advance);
      } else {
        const len = f.cap.replace(/<[^>]+>/g, "").length;
        P.timer = setTimeout(advance, Number(speed.value) * (0.7 + len / 180));
      }
    }
    function play(){
      if (P.k >= P.frames.length - 1) show(0);
      P.playing = true; playBtn.textContent = "⏸ Szünet"; schedule();
    }
    function step(k){ pause(); show(k); if (tts.on && tts.ok){ tts.rate = rates[speed.value] || 1; tts.say(P.frames[P.k].cap); } }
    function setVoice(){
      voiceBtn.hidden = !tts.ok;
      voiceBtn.setAttribute("aria-pressed", tts.on ? "true" : "false");
      voiceBtn.textContent = tts.on ? "🔊 Felolvasás: be" : "🔈 Felolvasás: ki";
      warn.hidden = !(tts.ok && tts.on && !tts.hasHu());
    }
    tts.onvoice = setVoice; setVoice();
    root.addEventListener("click", e => {
      const b = e.target.closest("[data-a]"); if (!b) return;
      const a = b.dataset.a;
      if (a === "play") P.playing ? pause() : play();
      else if (a === "next") step(P.k + 1);
      else if (a === "prev") step(P.k - 1);
      else if (a === "first") step(0);
      else if (a === "voice"){ tts.set(!tts.on); if (!tts.on) tts.stop(); setVoice(); if (P.playing) schedule(); }
    });
    speed.addEventListener("change", () => { if (P.playing) schedule(); });
    return {
      load(frames, title, auto){
        pause(); P.frames = frames; $(".pb-title", root).textContent = title || "";
        show(0); playBtn.textContent = "▶ Lejátszás";
        if (auto) play();
      }
    };
  }

  /* ---------- Diák ---------- */
  function deck(root, slides){
    root.innerHTML =
      '<div class="deck"><div class="deck-bar"><span class="eyebrow"></span><div class="dots"></div></div>' +
      '<div class="slide"></div><div class="deck-nav"><button class="btn" data-a="prev">← Előző</button>' +
      '<button class="btn primary" data-a="next">Következő →</button></div></div>';
    const dots = $(".dots", root), body = $(".slide", root), eyebrow = $(".eyebrow", root);
    let k = 0;
    slides.forEach((s, i) => {
      const d = document.createElement("button");
      d.className = "dot"; d.textContent = i + 1; d.setAttribute("aria-label", "Dia " + (i + 1) + ": " + s.t);
      d.addEventListener("click", () => go(i)); dots.appendChild(d);
    });
    function go(i){
      k = Math.max(0, Math.min(slides.length - 1, i));
      const s = slides[k];
      body.innerHTML = '<div class="kicker">' + s.k + '</div><h3>' + s.t + '</h3>' + (typeof s.h === "function" ? s.h() : s.h);
      s.init && s.init(body);
      eyebrow.textContent = (k + 1) + " / " + slides.length;
      $$(".dot", root).forEach((d, j) => d.classList.toggle("active", j === k));
      $('[data-a="prev"]', root).disabled = k === 0;
      $('[data-a="next"]', root).disabled = k === slides.length - 1;
    }
    root.addEventListener("click", e => {
      const b = e.target.closest("[data-a]"); if (!b) return;
      if (b.dataset.a === "prev") go(k - 1); else if (b.dataset.a === "next") go(k + 1);
    });
    go(0);
    return { go };
  }

  // Tab = két szóköz a kódmezőben (Esc, majd Tab: kilépés a mezőből billentyűzettel)
  function tabKeys(ta, o){
    ta.addEventListener("keydown", e => {
      if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && o.tab !== false){
        if (ta.dataset.esc === "1"){ ta.dataset.esc = ""; return; }
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2; ta.dispatchEvent(new Event("input"));
      } else if (e.key === "Escape") ta.dataset.esc = "1";
    });
  }

  /* ---------- Élő HTML/CSS szerkesztő (szkript nélküli, azonos eredetű előnézet) ---------- */
  function editor(root, o){
    o = o || {};
    root.innerHTML =
      '<div class="ed"><div><label>Kód' + (o.hint ? " — " + o.hint : "") + '</label><textarea spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Kód"></textarea></div>' +
      '<div><label>Eredmény</label><iframe sandbox="allow-same-origin" title="Előnézet"></iframe></div></div>';
    const ta = $("textarea", root), fr = $("iframe", root);
    if (o.rows) ta.style.minHeight = o.rows * 22 + "px";
    ta.value = o.code || "";
    let t = null;
    function render(){
      try { const d = fr.contentDocument; d.open(); d.write(ta.value); d.close(); } catch (e){}
    }
    ta.addEventListener("input", () => { clearTimeout(t); t = setTimeout(render, 120); o.onInput && o.onInput(); });
    tabKeys(ta, o);
    fr.addEventListener("load", () => {});
    render();
    return {
      get: () => ta.value,
      set(v){ ta.value = v; render(); },
      // a pillanatnyi kódból frissen épített dokumentum (szinkron): ellenőrzéshez
      doc(){ render(); return fr.contentDocument; },
      win: () => fr.contentWindow,
      parsed: () => new DOMParser().parseFromString(ta.value, "text/html")
    };
  }

  /* ---------- JavaScript-futtató: elszigetelt iframe (sandbox="allow-scripts", allow-same-origin nélkül) ----------
     A diák kódja egy srcdoc-os iframe-ben fut, saját (átlátszatlan) eredettel: a szülő oldalhoz és a localStorage-hoz
     nem fér hozzá. Az előtét-szkript elkapja a console.log, alert, prompt (előre megadott válaszokkal), confirm hívást
     és a hibákat (sorszámmal), és postMessage-dzsel küldi vissza; a szülő az e.source-t és a futás-tokent is nézi.
     Végtelen ciklus ellen: minden for / while / do ciklustörzs elejére számláló kerül (200 000 ismétlés felett hiba),
     és 4 mp után a futás eldobódik. Kattintásos feladatnál a kért elemekre a betöltés után kattint. */
  const JSR = { seq: 0, wait: {} };
  window.addEventListener("message", e => {
    const d = e.data; if (!d || typeof d !== "object" || !d.kovratRun) return;
    const w = JSR.wait[d.kovratRun]; if (!w || e.source !== w.frame.contentWindow) return;
    w.on(d);
  });
  // a ciklustörzsek elejére számláló (sortörést nem szúr be, így a hibák sorszáma nem csúszik el)
  function guardLoops(src){
    let out = "", i = 0;
    const n = src.length, idch = c => /[\w$]/.test(c || "");
    while (i < n){
      const c = src[i], d = src[i + 1];
      if (c === "/" && d === "/"){ const j = src.indexOf("\n", i); const e = j < 0 ? n : j; out += src.slice(i, e); i = e; continue; }
      if (c === "/" && d === "*"){ const j = src.indexOf("*/", i + 2); const e = j < 0 ? n : j + 2; out += src.slice(i, e); i = e; continue; }
      if (c === '"' || c === "'" || c === "`"){ let j = i + 1; while (j < n && src[j] !== c && src[j] !== (c === "`" ? "\u0000" : "\n")){ if (src[j] === "\\") j++; j++; } out += src.slice(i, j + 1); i = j + 1; continue; }
      const kw = /^(for|while|do)\b/.exec(src.slice(i, i + 6));
      if (kw && !idch(src[i - 1])){
        let j = i + kw[1].length;
        if (kw[1] !== "do"){
          while (j < n && /\s/.test(src[j])) j++;
          if (src[j] === "("){
            let depth = 0;
            for (; j < n; j++){ const ch = src[j]; if (ch === '"' || ch === "'" || ch === "`"){ const q = ch; j++; while (j < n && src[j] !== q){ if (src[j] === "\\") j++; j++; } continue; } if (ch === "(") depth++; else if (ch === ")"){ depth--; if (!depth){ j++; break; } } }
          }
        }
        let k = j; while (k < n && /\s/.test(src[k])) k++;
        if (src[k] === "{"){ out += src.slice(i, k + 1) + "__kg();"; i = k + 1; continue; }
        out += src.slice(i, j); i = j; continue;
      }
      out += c; i++;
    }
    return out;
  }
  // az iframe-ben fut, a diák kódja előtt
  const PRE = String(function(cfg){
    var inputs = cfg.inputs.slice();
    var send = function(m){ m.kovratRun = cfg.t; try { parent.postMessage(m, "*"); } catch (e){} };
    var fmt = function(v){
      if (typeof v === "string") return v;
      if (v === undefined) return "undefined";
      if (typeof v === "function") return "function";
      if (v && typeof v === "object"){ if (v.nodeType) return "<" + v.nodeName.toLowerCase() + ">"; try { return JSON.stringify(v); } catch (e){ return String(v); } }
      return String(v);
    };
    // legfeljebb 300 kiírás megy át (egy végtelen ciklus ne árassza el a szülőt üzenetekkel)
    var nlog = 0;
    var ev = function(kind, text, line){
      if (kind === "log" && ++nlog > 300){ if (nlog === 301) send({ type: "ev", kind: "log", text: "… (túl sok kiírás, a többit nem mutatom)", line: 0 }); return; }
      send({ type: "ev", kind: kind, text: text, line: line || 0 });
    };
    var args = function(a){ return Array.prototype.map.call(a, fmt).join(" "); };
    window.__kc = 0;
    window.__kg = function(){ if (++window.__kc > 200000) throw new Error("Túl sok ismétlés: végtelen ciklus?"); };
    console.log = console.info = console.warn = console.error = function(){ ev("log", args(arguments)); };
    window.alert = function(m){ ev("alert", m === undefined ? "" : fmt(m)); };
    window.prompt = function(m){ var v = inputs.length ? String(inputs.shift()) : null; ev("prompt", (m === undefined ? "" : fmt(m)) + " → " + (v === null ? "(nincs válasz, null)" : v)); return v; };
    window.confirm = function(m){ ev("alert", (m === undefined ? "" : fmt(m)) + " (OK)"); return true; };
    window.addEventListener("error", function(e){ var l = e.lineno ? e.lineno - cfg.off : 0; ev("error", String(e.message || "Hiba").replace(/^Uncaught\s+/, ""), l > 0 ? l : 0); e.preventDefault(); });
    document.addEventListener("click", function(){ window.__kc = 0; }, true);
    var texts = function(){ var o = {}; cfg.sels.forEach(function(s){ var el = document.querySelector(s); o[s] = el ? el.textContent : null; }); return o; };
    window.addEventListener("load", function(){
      var before = texts();
      cfg.clicks.forEach(function(s){ window.__kc = 0; var el = document.querySelector(s); if (el) el.click(); else ev("error", "Nincs ilyen elem az oldalon: " + s, 0); });
      send({ type: "done", before: before, after: texts(), html: document.body ? document.body.innerHTML : "" });
    });
  });
  function jsrun(frame, code, o){
    o = o || {};
    if (frame.__kr) delete JSR.wait[frame.__kr];
    const t = "r" + (++JSR.seq) + "x" + Math.random().toString(36).slice(2);
    frame.__kr = t;
    const cfg = { t, inputs: (o.inputs || []).map(String), clicks: o.clicks || [], sels: o.sels || [], off: 0 };
    const user = guardLoops(String(code)).replace(/<\/(script)/gi, "<\\/$1");
    const build = () => '<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;margin:12px;line-height:1.45;color:#17202B;background:#fff}button{font:inherit;padding:.3em .9em}</style><script>(' + PRE + ')(' + JSON.stringify(cfg) + ');<\/script></head><body>' + (o.html || "") + "\n<script>\n";
    cfg.off = build().split("\n").length - 1;
    const doc = build() + user + "\n<\/script></body></html>";
    return new Promise(res => {
      const R = { logs: [], alerts: [], prompts: [], errors: [], events: [], before: {}, after: {}, html: "", done: false, timeout: false };
      let over = false;
      const fin = () => { if (over) return; over = true; clearTimeout(timer); if (!o.keep) delete JSR.wait[t]; res(R); };
      JSR.wait[t] = { frame, on(d){
        if (d.type === "ev"){
          R.events.push(d);
          if (d.kind === "log") R.logs.push(d.text); else if (d.kind === "alert") R.alerts.push(d.text);
          else if (d.kind === "prompt") R.prompts.push(d.text); else R.errors.push({ msg: d.text, line: d.line });
          o.onEvent && o.onEvent(d);
        } else if (d.type === "done" && !over){ R.before = d.before; R.after = d.after; R.html = d.html; R.done = true; fin(); }
      } };
      const timer = setTimeout(() => {
        R.timeout = true; const d = { kind: "error", text: "Időtúllépés: a program 4 másodperc alatt sem fejeződött be (végtelen ciklus?)", line: 0 };
        R.errors.push({ msg: d.text, line: 0 }); R.events.push(d); o.onEvent && o.onEvent(d);
        delete JSR.wait[t]; frame.srcdoc = ""; fin();
      }, o.timeout || 4000);
      frame.srcdoc = doc;
    });
  }
  // a böngésző angol hibaüzenetéhez magyar tipp
  function jsHint(m){
    m = String(m);
    if (/végtelen|Időtúllépés/.test(m)) return "";
    if (/is not defined/.test(m)) return "Ilyen nevű változó vagy függvény nincs. Elírtad? Figyelj a kis- és nagybetűkre is (console, nem Console).";
    if (/Assignment to constant/.test(m)) return "A const változó értéke nem változhat. Ha változnia kell, let-tel hozd létre.";
    if (/already been declared/.test(m)) return "Ezt a változót már létrehoztad. Másodszor ne írd elé a let szót.";
    if (/of null/.test(m)) return "Nem találta az elemet. Nézd meg az id-t: a kis- és nagybetű is számít.";
    if (/is not a function/.test(m)) return "Ez nem függvény. Elírtad a nevét, vagy hiányzik egy pont?";
    if (/Unexpected|Unterminated|Invalid or unexpected|missing/i.test(m)) return "Szintaktikai hiba: hiányzik (vagy fölösleges) egy zárójel, kapcsos zárójel vagy idézőjel.";
    return "";
  }
  /* JavaScript-szerkesztő: kódmező + Futtatás + konzol + (ha van HTML) élő előnézet */
  function jseditor(root, o){
    o = o || {};
    root.innerHTML =
      '<div class="jsed">' + (o.html ? '<div><label class="jl">Az oldal HTML-je (ezt nem kell átírnod)</label><pre class="code jhtml">' + esc(o.html) + "</pre></div>" : "") +
      '<div class="ed"><div><label>JavaScript' + (o.hint ? " — " + o.hint : "") + '</label><textarea spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="JavaScript-kód"></textarea>' +
      '<div class="row jbar"><button class="btn" type="button" data-j="run">▶ Futtatás</button>' +
      (o.prompt ? '<label class="jin">prompt válaszai: <input type="text" data-j="in" aria-label="A prompt válaszai, pontosvesszővel elválasztva" autocapitalize="off" spellcheck="false"></label>' : "") + "</div></div>" +
      '<div class="jright"><label>Eredmény</label><iframe sandbox="allow-scripts" title="Előnézet"' + (o.html ? "" : " hidden") + '></iframe>' +
      '<div class="jsout" aria-live="polite"><div class="jsout-h">Konzol</div><div class="jsout-b"><span class="dim">Nyomd meg: ▶ Futtatás</span></div></div></div></div></div>';
    const ta = $("textarea", root), fr = $("iframe", root), con = $(".jsout-b", root), inp = $('[data-j="in"]', root);
    if (o.rows) ta.style.minHeight = o.rows * 22 + "px";
    ta.value = o.code || "";
    if (inp) inp.value = (o.inputs || []).join("; ");
    tabKeys(ta, o);
    const line = d => {
      const ph = $(".dim", con); if (ph) ph.remove();
      const div = document.createElement("div");
      if (d.kind === "log"){ div.className = "l"; div.textContent = d.text === "" ? " " : d.text; }
      else if (d.kind === "alert"){ div.className = "a"; div.textContent = "🔔 alert: " + d.text; }
      else if (d.kind === "prompt"){ div.className = "p"; div.textContent = "⌨ prompt: " + d.text; }
      else { div.className = "e"; const h = jsHint(d.text); div.innerHTML = "✖ " + (d.line ? d.line + ". sor: " : "") + esc(d.text) + (h ? "<br><span>" + esc(h) + "</span>" : ""); }
      con.appendChild(div); con.scrollTop = con.scrollHeight;
    };
    function run(ro){
      ro = Object.assign({ html: o.html || "" }, ro || {});
      con.innerHTML = ""; let any = false;
      const on = ro.onEvent;
      ro.onEvent = d => { any = true; line(d); on && on(d); };
      return jsrun(fr, ta.value, ro).then(r => { if (!any && r.done) con.innerHTML = '<span class="dim">(a program még nem írt ki semmit)</span>'; return r; });
    }
    $('[data-j="run"]', root).addEventListener("click", () => {
      const ins = inp ? inp.value.split(";").map(s => s.trim()).filter(s => s !== "") : (o.inputs || []);
      run({ inputs: ins, keep: true });
    });
    if (o.autorun) run({ inputs: o.inputs || [], keep: true });
    return { get: () => ta.value, set(v){ ta.value = v; }, run, frame: fr };
  }

  /* ---------- Gyakorlás: típusok × 3 szint, azonnali ellenőrzés, próbadolgozat ----------
     cfg = { id, types:[{id, name, gen(lvl) → task}], play(frames,title), examN }
     task = { q, kind:"input"|"choice"|"code", check(raw|val|{doc,code}) → {ok,msg},
              answer, sol, frames, title, options:[{l,v}], ph, starter, hint } */
  function practice(root, cfg){
    const key = "kovrat-" + cfg.id;
    const S = { type: cfg.types[0].id, lvl: 1, task: null, streak: 0, done: 0, okc: 0, counted: false, exam: null, ed: null };
    let best = Number(store.get(key + "-best")) || 0;
    let bestExam = Number(store.get(key + "-exam")) || 0;
    const lvlNames = cfg.levels || ["könnyű", "közepes", "nehéz"];
    root.innerHTML =
      '<div class="practice"><div class="tabs" role="tablist" aria-label="Feladattípus"></div>' +
      '<div class="chips"><span class="eyebrow">Szint</span></div><div class="stats"></div><div class="task"></div></div>';
    const tabs = $(".tabs", root), chips = $(".chips", root), stats = $(".stats", root), box = $(".task", root);
    cfg.types.forEach(t => {
      const b = document.createElement("button");
      b.className = "tab"; b.setAttribute("role", "tab"); b.dataset.t = t.id; b.textContent = t.name;
      tabs.appendChild(b);
    });
    lvlNames.forEach((n, i) => {
      const b = document.createElement("button");
      b.className = "chip"; b.dataset.l = i + 1; b.textContent = (i + 1) + " · " + n;
      chips.appendChild(b);
    });
    const ex = document.createElement("button");
    ex.className = "btn"; ex.dataset.x = "exam"; ex.textContent = "📝 Próbadolgozat"; ex.style.marginLeft = "auto";
    chips.appendChild(ex);

    const type = () => cfg.types.find(t => t.id === S.type);
    function syncBar(){
      $$(".tab", tabs).forEach(b => b.setAttribute("aria-selected", String(b.dataset.t === S.type && !S.exam)));
      $$(".chip", chips).forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.l) === S.lvl)));
      stats.innerHTML = S.exam ? "" :
        "<span>Sorozat: <b>" + S.streak + "</b></span><span>Legjobb sorozat: <b>" + best + "</b></span><span>Jó válasz: <b>" + S.okc + " / " + S.done + "</b></span>" +
        (bestExam ? "<span>Legjobb dolgozat: <b>" + bestExam + "%</b></span>" : "");
    }
    function inputHtml(t){
      if (t.kind === "choice")
        return '<div class="opts">' + t.options.map((o, i) => '<button class="opt" data-o="' + i + '">' + o.l + '</button>').join("") + "</div>";
      if (t.kind === "code" || t.kind === "js")
        return '<div class="code-ed"></div><div class="row"><button class="btn primary" data-a="check">Ellenőrzés</button></div>';
      return '<form class="row" data-a="form" autocomplete="off"><input type="text" inputmode="' + (t.mode || "text") + '" placeholder="' + (t.ph || "Válaszod") + '" aria-label="Válaszod" autocapitalize="off" spellcheck="false"><button class="btn primary" type="submit">' + (S.exam ? "Tovább" : "Ellenőrzés") + '</button></form>';
    }
    function mountTask(t){
      S.counted = false;
      let h = '<div class="prompt">' + t.q + '</div>' + inputHtml(t) + '<div class="fb" aria-live="polite"></div>';
      if (S.exam){
        h = '<div class="eyebrow">Próbadolgozat · ' + (S.exam.i + 1) + ' / ' + S.exam.tasks.length + '</div>' + h;
        if (t.kind === "code" || t.kind === "js") h = h.replace('data-a="check">Ellenőrzés', 'data-a="check">Tovább');
      } else {
        h += '<div class="row"><button class="btn" data-a="sol">Megoldás lépésenként</button>' +
          (t.frames && cfg.play ? '<button class="btn" data-a="play">▶ Nézd meg lejátszva</button>' : "") +
          '<button class="btn primary" data-a="new">Új feladat</button></div><div class="solution" hidden></div>';
      }
      box.innerHTML = h;
      if (t.kind === "code") S.ed = editor($(".code-ed", box), { code: t.starter, hint: t.hint, rows: t.rows });
      else if (t.kind === "js") S.ed = jseditor($(".code-ed", box), { code: t.starter, hint: t.hint, rows: t.rows, html: t.html, prompt: !!(t.inputs && t.inputs.length), inputs: t.inputs });
      const inp = $("input", box); if (inp && !S.exam) inp.focus({ preventScroll: true });
    }
    function newTask(){
      S.task = type().gen(S.lvl); mountTask(S.task); syncBar();
    }
    function raw(){
      const t = S.task;
      if (t.kind === "code") return { doc: S.ed.doc(), code: S.ed.get(), parsed: S.ed.parsed(), win: S.ed.win() };
      if (t.kind === "js") return { code: S.ed.get(), run: o => S.ed.run(o) };
      const i = $("input", box); return i ? i.value : "";
    }
    function feedback(res){
      const fb = $(".fb", box);
      fb.innerHTML = '<div class="feedback ' + (res.ok ? "ok" : "bad") + '">' + (res.ok ? "✓ " : "") + (res.msg || (res.ok ? "Helyes!" : "Nem jó.")) + "</div>";
    }
    function record(res){
      if (S.counted) return;
      S.counted = true; S.done++;
      if (res.ok){ S.okc++; S.streak++; if (S.streak > best){ best = S.streak; store.set(key + "-best", String(best)); } }
      else S.streak = 0;
      syncBar();
    }
    function examNext(res){
      const e = S.exam; e.results.push({ t: e.tasks[e.i], ok: res.ok });
      e.i++;
      if (e.i >= e.tasks.length) return examEnd();
      S.task = e.tasks[e.i]; mountTask(S.task);
    }
    function examEnd(){
      const e = S.exam, okn = e.results.filter(r => r.ok).length, p = Math.round(okn * 100 / e.results.length);
      if (p > bestExam){ bestExam = p; store.set(key + "-exam", String(p)); }
      const bad = e.results.filter(r => !r.ok);
      box.innerHTML = '<div class="exam-res"><div class="eyebrow">Próbadolgozat vége</div><div class="grade">' + grade(p) + '</div>' +
        '<p><b>' + okn + ' / ' + e.results.length + '</b> jó válasz (' + p + '%).</p>' +
        (bad.length ? "<h3>Ezeket nézd át</h3>" + bad.map(r => '<div class="exam-row">' + r.t.q + '<br><b>Jó válasz:</b> ' + (r.t.answer == null ? "" : r.t.answer) + "</div>").join("") : "<p>Hibátlan. Szép munka!</p>") +
        '<div class="row"><button class="btn primary" data-x="exam">Új dolgozat</button><button class="btn" data-a="back">Vissza a gyakorláshoz</button></div></div>';
      S.exam = null; syncBar();
    }
    function startExam(){
      const n = cfg.examN || 10, tasks = [];
      for (let i = 0; i < n; i++) tasks.push(cfg.types[i % cfg.types.length].gen(S.lvl));
      S.exam = { tasks: shuffle(tasks), i: 0, results: [] };
      S.task = S.exam.tasks[0]; mountTask(S.task); syncBar();
    }
    function answer(val){
      const t = S.task, res = t.check(val);
      // aszinkron ellenőrzés (pl. JavaScript-futtatás): a gomb addig tiltva, az eredmény csak a még aktuális feladathoz kerül
      if (res && typeof res.then === "function"){
        const btn = $('[data-a="check"]', box); if (btn){ btn.disabled = true; btn.dataset.busy = "1"; }
        const done = r => { if (btn){ btn.disabled = false; delete btn.dataset.busy; } if (S.task === t) settle(t, val, r); };
        return res.then(done, () => done({ ok: false, msg: "Nem sikerült lefuttatni a programot." }));
      }
      settle(t, val, res);
    }
    function settle(t, val, res){
      if (S.exam) return examNext(res);
      feedback(res); record(res);
      if (t.kind === "choice"){
        $$(".opt", box).forEach((b, i) => { b.disabled = true; b.classList.toggle("right", !!t.options[i].ok); if (Number(b.dataset.o) === val.idx && !res.ok) b.classList.add("wrong"); });
      }
    }
    root.addEventListener("click", e => {
      const tb = e.target.closest(".tab");
      if (tb){ S.type = tb.dataset.t; S.exam = null; newTask(); return; }
      const ch = e.target.closest(".chip");
      if (ch){ S.lvl = Number(ch.dataset.l); S.exam = null; newTask(); return; }
      if (e.target.closest('[data-x="exam"]')){ startExam(); return; }
      const o = e.target.closest(".opt");
      if (o && !o.disabled){ const i = Number(o.dataset.o); answer({ idx: i, v: S.task.options[i].v }); return; }
      const b = e.target.closest("[data-a]"); if (!b) return;
      const a = b.dataset.a, t = S.task;
      if (a === "new") newTask();
      else if (a === "back"){ S.exam = null; newTask(); }
      else if (a === "check") answer(raw());
      else if (a === "play" && t.frames) cfg.play(t.frames, t.title || "Levezetés");
      else if (a === "sol"){
        const s = $(".solution", box); s.hidden = !s.hidden; s.innerHTML = "<b>Megoldás</b>" + (t.sol || "") + "<div>Jó válasz: <b>" + (t.answer == null ? "" : t.answer) + "</b></div>";
        if (!S.counted){ S.counted = true; S.done++; S.streak = 0; syncBar(); }
      }
    });
    root.addEventListener("submit", e => {
      e.preventDefault();
      if (e.target.matches('[data-a="form"]')) answer(raw());
    });
    newTask();
    return { newTask };
  }

  return { $, $$, rnd, pick, shuffle, esc, art, Art, norm, store, grade, tts, player, deck, editor, practice, jsrun, jseditor, jsHint, guardLoops };
})();
