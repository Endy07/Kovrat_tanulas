// Hamis Apps Script: a VALÓDI Code.gs-t futtatja Node-ban, a Google-szolgáltatások helyett egyszerű pótlékokkal.
// A „Drive” egy helyi mappa (HAMIS_DRIVE): a gyökere a My Drive gyökere, ugyanezt a mappát látja a hamis rclone is.
//
// Használat:  HAMIS_DRIVE=<mappa> CSALADI_KOD=<kód> PORT=8790 node hamis-apps-script.js
// Modulként:  const { indit } = require("./hamis-apps-script"); const srv = await indit({ drive, kod, port, props });
//
// Mint a valódi webapp: a POST törzse text/plain JSON, a válasz JSON, Access-Control-Allow-Origin: *.
// Az OPTIONS-kérést (CORS-preflight) NEM szolgálja ki, és megszámolja: a tesztben ennek 0-nak kell lennie,
// mert a valódi Apps Script sem válaszol rá (ezért kell a text/plain).
const fs = require("fs"), path = require("path"), http = require("http"), vm = require("vm"), crypto = require("crypto");

function sandbox(drive, props) {
  fs.mkdirSync(drive, { recursive: true });
  const rel = p => path.relative(drive, p).split(path.sep).join("/");
  const idOf = p => "f_" + Buffer.from(rel(p) || ".").toString("base64url");
  const pathOf = id => path.join(drive, Buffer.from(String(id).slice(2), "base64url").toString());
  const trash = path.join(drive, ".kuka");
  const iter = arr => { let i = 0; return { hasNext: () => i < arr.length, next: () => arr[i++] }; };
  const mimeOf = n => /\.json$/.test(n) ? "application/json" : /\.png$/.test(n) ? "image/png" : /\.webp$/.test(n) ? "image/webp" : /\.jpe?g$/.test(n) ? "image/jpeg" : "text/plain";

  function Blob(bytes, mime, name) {
    const buf = Buffer.from(bytes);
    return {
      getBytes: () => Array.from(new Int8Array(buf.buffer, buf.byteOffset, buf.length)),
      getDataAsString: () => buf.toString("utf8"),
      getContentType: () => mime, getName: () => name, setName(n) { name = n; return this; }, _buf: buf
    };
  }
  function File(p) {
    return {
      getId: () => idOf(p), getName: () => path.basename(p), getSize: () => fs.statSync(p).size,
      getDateCreated: () => fs.statSync(p).birthtime, getMimeType: () => mimeOf(p),
      getBlob: () => Blob(fs.readFileSync(p), mimeOf(p), path.basename(p)),
      setContent(s) { fs.writeFileSync(p, s); return this; },
      isTrashed: () => !fs.existsSync(p),
      setTrashed(t) { if (t) { fs.mkdirSync(trash, { recursive: true }); fs.renameSync(p, path.join(trash, Date.now() + "-" + path.basename(p))); } return this; }
    };
  }
  function Folder(p) {
    const ls = () => fs.readdirSync(p, { withFileTypes: true }).filter(d => d.name !== ".kuka");
    return {
      getId: () => idOf(p), getName: () => path.basename(p),
      getFoldersByName: n => iter(ls().filter(d => d.isDirectory() && d.name === n).map(d => Folder(path.join(p, d.name)))),
      getFilesByName: n => iter(ls().filter(d => d.isFile() && d.name === n).map(d => File(path.join(p, d.name)))),
      createFolder(n) { const q = path.join(p, n); fs.mkdirSync(q); return Folder(q); },
      createFile(a, content, mime) {
        if (typeof a === "string") { const q = path.join(p, a); if (fs.existsSync(q)) throw new Error("hamis Drive: a teszt nem kezel azonos nevű fájlokat: " + a); fs.writeFileSync(q, content); return File(q); }
        const q = path.join(p, a.getName()); fs.writeFileSync(q, a._buf); return File(q);
      }
    };
  }
  const cache = new Map();
  const fmt = (d, tz, f) => {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(d).map(x => [x.type, x.value]));
    return f.replace(/'([^']*)'|yyyy|MM|dd|HH|mm|ss/g, (m, lit) => lit !== undefined ? lit : { yyyy: parts.year, MM: parts.month, dd: parts.day, HH: parts.hour, mm: parts.minute, ss: parts.second }[m]);
  };
  const logs = [];
  return {
    DriveApp: {
      getRootFolder: () => Folder(drive),
      getFileById(id) { const p = pathOf(id); if (!fs.existsSync(p)) throw new Error("Nincs ilyen fájl"); return File(p); }
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in props ? props[k] : null), setProperty(k, v) { props[k] = String(v); return this; } }) },
    CacheService: { getScriptCache: () => ({ get: k => { const e = cache.get(k); return e && e.t > Date.now() ? e.v : null; }, put: (k, v, s) => cache.set(k, { v, t: Date.now() + (s || 600) * 1000 }), remove: k => cache.delete(k) }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, tryLock: () => true, releaseLock() {} }) },
    ContentService: { MimeType: { JSON: "application/json" }, createTextOutput: s => ({ _s: s, setMimeType() { return this; }, getContent() { return s; } }) },
    Utilities: {
      base64Decode: s => Array.from(new Int8Array(Buffer.from(s, "base64"))),
      base64Encode: b => Buffer.from(b).toString("base64"),
      newBlob: (b, mime, name) => Blob(Buffer.from(Uint8Array.from(b, x => x & 255)), mime, name),
      formatDate: fmt, getUuid: () => crypto.randomUUID()
    },
    Logger: { log: s => logs.push(String(s)) },
    console, JSON, Math, Date, Array, Object, String, Number, Error, RegExp,
    _logs: logs
  };
}

function betolt(drive, props) {
  const ctx = vm.createContext(sandbox(drive, props));
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "apps-script", "Code.gs"), "utf8"), ctx, { filename: "Code.gs" });
  return ctx;
}

function indit({ drive, kod, port = 0, props = {} } = {}) {
  const P = Object.assign({ CSALADI_KOD: kod }, props);
  const gs = betolt(drive, P);
  const stat = { preflight: 0, post: 0, contentTypes: [] };
  const srv = http.createServer((req, res) => {
    const vege = (code, body, extra) => { res.writeHead(code, Object.assign({ "Access-Control-Allow-Origin": "*", "Content-Type": "application/json; charset=utf-8" }, extra || {})); res.end(body); };
    if (req.method === "OPTIONS") { stat.preflight++; return vege(405, ""); }
    if (req.method === "GET") return vege(200, gs.doGet({ parameter: {} }).getContent());
    if (req.method !== "POST") return vege(405, "");
    stat.post++; stat.contentTypes.push(req.headers["content-type"] || "");
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => {
      const body = Buffer.concat(chunks).toString("utf8");
      let out;
      try { out = gs.doPost({ postData: { contents: body, type: req.headers["content-type"] } }).getContent(); }
      catch (e) { out = JSON.stringify({ ok: false, hiba: "hamis szerver: " + e.message }); }
      vege(200, out);
    });
  });
  return new Promise(r => srv.listen(port, "127.0.0.1", () => r({ srv, port: srv.address().port, stat, gs, props: P, close: () => new Promise(q => srv.close(q)) })));
}

module.exports = { indit, betolt };

if (require.main === module) {
  const drive = process.env.HAMIS_DRIVE || path.join(process.cwd(), "hamis-drive");
  indit({ drive, kod: process.env.CSALADI_KOD || "teszt-kod-123", port: Number(process.env.PORT || 8790) })
    .then(s => console.log("hamis Apps Script: http://127.0.0.1:" + s.port + "/  (Drive: " + drive + ")"));
}
