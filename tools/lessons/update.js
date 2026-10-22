/* Mindig a legfrissebb változat: ha a szerveren újabb a version.json, az oldal újratölt egy olyan címen (?v=…), amit semmilyen gyorsítótár nem tárolt még. Mobilon a fülre visszatéréskor is ellenőriz. */
(function(){
  var m = document.querySelector('meta[name="kovrat-version"]'), mine = m ? m.content : "";
  function check(){
    if (!window.fetch || !/^https?:$/.test(location.protocol)) return;
    fetch("version.json?t=" + Date.now(), { cache: "no-store" })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(d){
        if (!d || !d.v || d.v === mine) return;
        var u = new URL(location.href);
        if (u.searchParams.get("v") === d.v) return; // ezt már kértük: nincs végtelen újratöltés
        u.searchParams.set("v", d.v);
        location.replace(u.toString());
      })
      .catch(function(){});
  }
  check();
  document.addEventListener("visibilitychange", function(){ if (document.visibilityState === "visible") check(); });
  window.addEventListener("pageshow", function(e){ if (e.persisted) check(); });
})();
