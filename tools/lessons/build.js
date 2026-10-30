// Leckék összeállítása: tools/lessons/<név>.src.html + a közös kit → ../../<név>.html
// A kimenet egyetlen önálló HTML-fájl (inline CSS/JS), futás közben nincs függőség.
// Használat: node tools/lessons/build.js [név ...]   (név nélkül mindet)
const fs = require("fs"), path = require("path");
const dir = __dirname, root = path.join(dir, "..", "..");
const rd = f => fs.readFileSync(path.join(dir, f), "utf8");
const css = rd("kit.css"), js = rd("kit.js"), upd = rd("update.js");
const FONTS = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@500;700&display=swap";
let ver = "0";
try { ver = JSON.parse(fs.readFileSync(path.join(root, "version.json"), "utf8")).v || "0"; } catch (e) {}
const head = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="kovrat-version" content="${ver}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<style>
${css}</style>`;
let names = process.argv.slice(2);
if (!names.length) names = fs.readdirSync(dir).filter(f => f.endsWith(".src.html")).map(f => f.replace(".src.html", ""));
for (const n of names) {
  let s = rd(n + ".src.html").replace(/\r\n/g, "\n");
  // a <title> a forrásban van; a head-blokk a title után kerül be
  s = s.replace("<!--@HEAD-->", () => head)
       .replace("<!--@KITJS-->", () => "<script>\n" + js + "</script>")
       .replace("<!--@UPDATE-->", () => "<script>\n" + upd + "</script>")
       // helyesírás-leckék: a közös helyesírás-készlet (betűk, elválasztás, ábécérend, tollbamondás)
       .replace("<!--@HJS-->", () => "<style>\n" + rd("helyesiras.css") + "</style>\n<script>\n" + rd("helyesiras.js") + "</script>");
  fs.writeFileSync(path.join(root, n + ".html"), s);
  console.log("kész:", n + ".html", Math.round(s.length / 1024) + " KB");
}
