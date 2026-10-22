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
    ta.addEventListener("keydown", e => {
      if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && o.tab !== false){
        // Tab = két szóköz (Esc, majd Tab: kilépés a mezőből billentyűzettel)
        if (ta.dataset.esc === "1"){ ta.dataset.esc = ""; return; }
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 2; ta.dispatchEvent(new Event("input"));
      } else if (e.key === "Escape") ta.dataset.esc = "1";
    });
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
      if (t.kind === "code")
        return '<div class="code-ed"></div><div class="row"><button class="btn primary" data-a="check">Ellenőrzés</button></div>';
      return '<form class="row" data-a="form" autocomplete="off"><input type="text" inputmode="' + (t.mode || "text") + '" placeholder="' + (t.ph || "Válaszod") + '" aria-label="Válaszod" autocapitalize="off" spellcheck="false"><button class="btn primary" type="submit">' + (S.exam ? "Tovább" : "Ellenőrzés") + '</button></form>';
    }
    function mountTask(t){
      S.counted = false;
      let h = '<div class="prompt">' + t.q + '</div>' + inputHtml(t) + '<div class="fb" aria-live="polite"></div>';
      if (S.exam){
        h = '<div class="eyebrow">Próbadolgozat · ' + (S.exam.i + 1) + ' / ' + S.exam.tasks.length + '</div>' + h;
        if (t.kind === "code") h = h.replace('data-a="check">Ellenőrzés', 'data-a="check">Tovább');
      } else {
        h += '<div class="row"><button class="btn" data-a="sol">Megoldás lépésenként</button>' +
          (t.frames && cfg.play ? '<button class="btn" data-a="play">▶ Nézd meg lejátszva</button>' : "") +
          '<button class="btn primary" data-a="new">Új feladat</button></div><div class="solution" hidden></div>';
      }
      box.innerHTML = h;
      if (t.kind === "code") S.ed = editor($(".code-ed", box), { code: t.starter, hint: t.hint, rows: t.rows });
      const inp = $("input", box); if (inp && !S.exam) inp.focus({ preventScroll: true });
    }
    function newTask(){
      S.task = type().gen(S.lvl); mountTask(S.task); syncBar();
    }
    function raw(){
      const t = S.task;
      if (t.kind === "code") return { doc: S.ed.doc(), code: S.ed.get(), parsed: S.ed.parsed(), win: S.ed.win() };
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

  return { $, $$, rnd, pick, shuffle, esc, art, Art, norm, store, grade, tts, player, deck, editor, practice };
})();
