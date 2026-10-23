// Gépi leckeellenőrző (headless Chromium, a globális playwright-tal).
// Használat: node lesson-test.js <név> [feladat/típus/szint = 40]
// A localhoston futó, már lefordított <név>.html-t nézi: diák, lejátszók, minden gyakorlótípus × szint × N feladat
// (a „Jó válasz” átmegy-e; kódos feladatnál a kiinduló kód ne menjen át), próbadolgozat, 390 px-es szélesség, sötét téma.
const { execSync } = require("child_process");
const path = require("path");
const groot = execSync("npm root -g").toString().trim();
const { chromium } = require(path.join(groot, "playwright"));
const name = process.argv[2], N = Number(process.argv[3] || 40);
if (!name) { console.log("név kell"); process.exit(1); }
const URL = "http://localhost/Kovrat/" + name + ".html";
const SHOTS = "C:/xampp/htdocs/Kovrat/.playwright-mcp/";

(async () => {
  // a gépen lévő Chromium (a playwright saját letöltése nem kell)
  const fs = require("fs"), msp = path.join(process.env.LOCALAPPDATA, "ms-playwright");
  const exe = fs.readdirSync(msp).filter(d => /^chromium-\d+$/.test(d)).sort().reverse().map(d => path.join(msp, d, "chrome-win64", "chrome.exe")).find(p => fs.existsSync(p));
  // némán: a felolvasás (Web Speech API) Windowson headless módban is kimondja a feliratokat
  const browser = await chromium.launch({ executablePath: exe, headless: true, args: ["--mute-audio"] });
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 } });
  await ctx.addInitScript(() => {
    try { localStorage.setItem("kovrat-tts", "0"); } catch (e) {}
    try { if (window.speechSynthesis){ window.speechSynthesis.speak = () => {}; } } catch (e) {}
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error" && !/fonts\.g|Failed to load resource/.test(m.text())) errs.push("console: " + m.text()); });
  await page.goto(URL, { waitUntil: "load" });

  const res = await page.evaluate(async (N) => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const out = { slides: 0, frames: 0, types: {}, fails: [], exam: null };
    // diák
    for (const d of document.querySelectorAll(".deck .dot")) { d.click(); out.slides++; }
    // lejátszók (minden .pb; a hozzá tartozó fülek: a .pb előtti .tabs)
    for (const pb of document.querySelectorAll(".pb")) {
      const host = pb.parentElement, tabs = host.previousElementSibling && host.previousElementSibling.classList.contains("tabs") ? [...host.previousElementSibling.querySelectorAll(".tab")] : [null];
      for (const t of tabs) {
        if (t) t.click();
        let g = 0; const nx = pb.querySelector('[data-a="next"]');
        while (!nx.disabled && g++ < 300) { nx.click(); out.frames++; }
      }
    }
    // gyakorlás
    const pr = document.querySelector(".practice");
    if (!pr) return out;
    const box = pr.querySelector(".task");
    const waitFb = async () => { for (let i = 0; i < 100; i++) { const f = box.querySelector(".fb .feedback"); if (f) return f; await sleep(30); } return null; };
    const tabs = [...pr.querySelectorAll(".tabs .tab")], chips = [...pr.querySelectorAll(".chip")];
    for (const tab of tabs) {
      const st = out.types[tab.textContent] = { n: 0, ok: 0, starterPass: 0, code: 0 };
      for (const ch of chips) {
        tab.click(); ch.click();
        for (let i = 0; i < N; i++) {
          if (i) box.querySelector('[data-a="new"]').click();
          const q = (box.querySelector(".prompt") || {}).innerText || "";
          const ta = box.querySelector(".code-ed textarea");
          if (ta) {
            st.code++;
            box.querySelector('[data-a="check"]').click();
            const f0 = await waitFb();
            if (f0 && f0.classList.contains("ok")) { st.starterPass++; out.fails.push({ t: tab.textContent, l: ch.textContent, q, why: "a kiinduló kód átment" }); }
            box.querySelector(".fb").innerHTML = "";
          }
          box.querySelector('[data-a="sol"]').click();
          const sd = [...box.querySelectorAll(".solution > div")].pop();
          const ansEl = sd && (sd.querySelector("pre") || sd.querySelector("b"));
          const ans = ansEl ? ansEl.textContent : "";
          st.n++;
          if (ta) {
            ta.value = ans; ta.dispatchEvent(new Event("input"));
            box.querySelector('[data-a="check"]').click();
          } else if (box.querySelector(".opt")) {
            const opts = [...box.querySelectorAll(".opt")];
            const o = opts.find(b => b.textContent.trim() === ans.trim());
            if (!o) { out.fails.push({ t: tab.textContent, l: ch.textContent, q, ans, why: "nincs ilyen gomb", opts: opts.map(b => b.textContent) }); continue; }
            o.click();
          } else {
            const inp = box.querySelector("form input");
            inp.value = ans;
            box.querySelector("form").dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
          }
          const f = await waitFb();
          if (f && f.classList.contains("ok")) st.ok++;
          else out.fails.push({ t: tab.textContent, l: ch.textContent, q: q.slice(0, 300), ans, why: f ? f.textContent : "nincs visszajelzés" });
        }
      }
    }
    // próbadolgozat (válasz: üres / első gomb)
    const ex = pr.querySelector('[data-x="exam"]');
    if (ex) {
      ex.click();
      for (let g = 0; g < 40 && !box.querySelector(".exam-res"); g++) {
        const o = box.querySelector(".opt"), fm = box.querySelector("form"), chk = box.querySelector('[data-a="check"]');
        if (o) o.click(); else if (fm) fm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); else if (chk) chk.click();
        // aszinkron ellenőrzés (JS-futtató): amíg a gomb tiltva, a feladat még fut
        for (let i = 0; i < 150 && chk && chk.isConnected && chk.disabled; i++) await sleep(20);
        for (let i = 0; i < 60; i++) { await sleep(20); if (!box.querySelector(".fb .feedback")) break; }
        await sleep(40);
      }
      out.exam = box.querySelector(".exam-res") ? (box.querySelector(".grade") || {}).textContent : "NEM ÉRT VÉGET";
    }
    return out;
  }, N);

  // telefon: 390 px, minden dia, minden lejátszó-kocka, minden feladattípus megoldással nyitva
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL, { waitUntil: "load" });
  const wide = await page.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const bad = [];
    const W = () => document.documentElement.scrollWidth;
    const culprits = () => [...document.querySelectorAll("body *")].filter(e => e.getBoundingClientRect().right > 391 && getComputedStyle(e).position !== "fixed").slice(-3).map(e => e.tagName + "." + e.className + " → " + Math.round(e.getBoundingClientRect().right));
    const note = where => { if (W() > 390) bad.push({ where, w: W(), c: culprits() }); };
    note("betöltés");
    for (const d of document.querySelectorAll(".deck .dot")) { d.click(); note("dia " + d.textContent); }
    for (const pb of document.querySelectorAll(".pb")) {
      const host = pb.parentElement, tabs = host.previousElementSibling && host.previousElementSibling.classList.contains("tabs") ? [...host.previousElementSibling.querySelectorAll(".tab")] : [null];
      for (const t of tabs) { if (t) t.click(); let g = 0; const nx = pb.querySelector('[data-a="next"]'); while (!nx.disabled && g++ < 300) { nx.click(); note("lejátszó " + (t ? t.textContent : "") + " #" + g); } }
    }
    const pr = document.querySelector(".practice");
    if (pr) for (const tab of pr.querySelectorAll(".tabs .tab")) for (const ch of pr.querySelectorAll(".chip")) {
      tab.click(); ch.click();
      for (let i = 0; i < 6; i++) { pr.querySelector('[data-a="new"]').click(); pr.querySelector('[data-a="sol"]').click(); await sleep(5); note(tab.textContent + " " + ch.textContent); }
    }
    return bad.slice(0, 12);
  });
  await page.screenshot({ path: SHOTS + name + "-390.png", fullPage: false });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto(URL, { waitUntil: "load" });
  await page.screenshot({ path: SHOTS + name + "-dark.png", fullPage: true });
  await browser.close();

  const sum = Object.entries(res.types).map(([k, v]) => k + ": " + v.ok + "/" + v.n + (v.code ? " (kódos, kiinduló átment: " + v.starterPass + ")" : "")).join("\n  ");
  console.log("diák:", res.slides, "· lejátszó-kockák:", res.frames, "· dolgozat jegye:", res.exam);
  console.log("típusok:\n  " + sum);
  console.log("hibák (" + res.fails.length + "):", JSON.stringify(res.fails.slice(0, 8), null, 1));
  console.log("390 px-en túllóg:", wide.length ? JSON.stringify(wide, null, 1) : "nincs");
  console.log("JS-hibák:", errs.length ? errs.slice(0, 10) : "nincs");
  console.log("képek:", SHOTS + name + "-390.png", SHOTS + name + "-dark.png");
})();
