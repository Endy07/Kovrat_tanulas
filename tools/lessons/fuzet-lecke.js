/* Füzetből készült leckék közös része (a forrásban: <!--@FUZETJS--> a <!--@KITJS--> után).
   F.olvasat(el, { lecke, tetelek }) — „Ezt jól olvastam?”: a bizonytalanul kiolvasott részek a lecke elején.
     tetelek: [{ id, hol, olvasat, kerdes? }]
       hol:     hol van a füzetben (pl. „2. feladat, a második sor”)
       olvasat: amit a gép kiolvasott (HTML; pl. „3x + 5 = 17”)
       kerdes:  ha nem a „Ezt jól olvastam?” a kérdés (pl. „5 vagy 6 a kitevő?”)
   A válasz ezen a gépen megmarad (localStorage). Ha a füzetfeltöltő be van állítva ezen a gépen, egy gombbal elküldhető
   (a feldolgozó Apps Script „visszajelzes” művelete); ha nincs, kimásolható szövegként, Endinek.
   F.forras(el, { tantargy, tema, kepDb, datum }) — rövid „Miből készült?” sor (személyes adat nélkül). */
const F = (function(){
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ls = {
    get(k){ try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } },
    set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  function olvasat(el, o){
    const key = "kovrat-olvasat-" + o.lecke, tetelek = o.tetelek || [];
    const v = ls.get(key) || {};   // id → { jo: true|false, javitas }
    if (!tetelek.length) {
      el.innerHTML = '<div class="fz-olv fz-kesz"><b>✓ Mindent biztosan el tudtam olvasni.</b> Ha mégis eltérést látsz a füzetedhez képest, szólj Endinek.</div>';
      return;
    }
    function render(){
      const kesz = tetelek.filter(t => v[t.id]).length, javit = tetelek.filter(t => v[t.id] && !v[t.id].jo).length;
      el.innerHTML = '<div class="fz-olv"><div class="fz-fej"><b>Ezt jól olvastam?</b> <span>' + kesz + " / " + tetelek.length + " megnézve" + (javit ? ", " + javit + " javítás" : "") + "</span></div>" +
        '<p class="fz-mag">Ezeket a helyeket nem tudtam biztosan elolvasni a fotón. Nézd meg a füzetedben, és jelöld, jó-e. Ha nem, írd be, mi áll ott.</p>' +
        tetelek.map(t => {
          const a = v[t.id];
          return '<div class="fz-t' + (a ? (a.jo ? " jo" : " nemjo") : "") + '" data-id="' + esc(t.id) + '">' +
            '<span class="fz-hol">' + esc(t.hol || "") + "</span>" +
            '<div class="fz-olvas">' + (t.olvasat || "") + "</div>" +
            (t.kerdes ? '<div class="fz-kerd">' + esc(t.kerdes) + "</div>" : "") +
            '<div class="fz-gombok"><button class="btn' + (a && a.jo ? " primary" : "") + '" data-v="jo">✓ Igen, ez áll ott</button><button class="btn' + (a && !a.jo ? " primary" : "") + '" data-v="nem">✗ Nem, mást</button></div>' +
            (a && !a.jo ? '<form class="fz-jav" data-f="1"><label>Mi áll a füzetedben?<input type="text" maxlength="300" value="' + esc(a.javitas || "") + '" autocomplete="off" spellcheck="false"></label><button class="btn" type="submit">Mentés</button></form>' : "") +
            "</div>";
        }).join("") +
        (kesz ? '<div class="fz-kuld"><button class="btn primary" data-kuld="1">Elküldöm Endinek</button><span class="fz-km" aria-live="polite"></span></div>' : "") +
        "</div>";
    }
    el.addEventListener("click", async e => {
      const t = e.target.closest(".fz-t"), b = e.target.closest("[data-v]");
      if (t && b) {
        const id = t.dataset.id, prev = v[id] || {};
        v[id] = b.dataset.v === "jo" ? { jo: true } : { jo: false, javitas: prev.javitas || "" };
        ls.set(key, v); render();
        if (b.dataset.v === "nem") { const inp = el.querySelector('.fz-t[data-id="' + CSS.escape(id) + '"] input'); if (inp) inp.focus(); }
        return;
      }
      if (e.target.closest("[data-kuld]")) kuld();
    });
    el.addEventListener("submit", e => {
      const f = e.target.closest(".fz-jav"); if (!f) return;
      e.preventDefault();
      const id = f.closest(".fz-t").dataset.id;
      v[id] = { jo: false, javitas: f.querySelector("input").value.trim() };
      ls.set(key, v); render();
    });
    el.addEventListener("input", e => {
      const f = e.target.closest(".fz-jav"); if (!f) return;
      const id = f.closest(".fz-t").dataset.id;
      v[id] = { jo: false, javitas: e.target.value.trim() }; ls.set(key, v);
    });
    async function kuld(){
      const km = el.querySelector(".fz-km"), valaszok = tetelek.filter(t => v[t.id]).map(t => ({ id: t.id, jo: !!v[t.id].jo, javitas: v[t.id].javitas || "" }));
      const cfg = ls.get("kovrat-fuzet");   // a fuzet.html beállítása (ugyanazon az oldalon tárolva)
      if (cfg && cfg.url && cfg.kod) {
        km.textContent = "Küldöm…";
        try {
          const r = await fetch(cfg.url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: "visszajelzes", kod: cfg.kod, lecke: o.lecke, valaszok }) });
          const d = await r.json();
          km.textContent = d.ok ? "✓ Elküldve. Köszönöm!" : "Nem sikerült: " + (d.hiba || "");
          return;
        } catch (e) { km.textContent = "Nem érem el a feldolgozót; másold ki inkább:"; }
      }
      const txt = o.lecke + "\n" + tetelek.filter(t => v[t.id]).map(t => (t.hol ? t.hol + ": " : "") + (v[t.id].jo ? "jó" : "NEM JÓ, a füzetben: " + (v[t.id].javitas || "?"))).join("\n");
      try { await navigator.clipboard.writeText(txt); km.textContent = "Kimásoltam: küldd el Endinek üzenetben."; }
      catch (e) { km.innerHTML = '<textarea readonly rows="4" style="width:100%">' + esc(txt) + "</textarea>"; }
    }
    render();
  }

  function forras(el, o){
    el.innerHTML = '<p class="fz-forras">📸 A füzetedből készült' + (o.datum ? " (" + esc(o.datum) + ")" : "") + (o.kepDb ? ", " + Number(o.kepDb) + " fotóból" : "") +
      (o.tantargy || o.tema ? ": " + esc([o.tantargy, o.tema].filter(Boolean).join(" · ")) : "") + ". A gyakorlás csak azt kéri, ami a füzetben van.</p>";
  }
  return { olvasat, forras };
})();
