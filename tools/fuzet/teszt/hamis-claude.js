#!/usr/bin/env node
// Hamis `claude -p` a teszthez. A promptot a szabványos bemenetről olvassa, kiveszi a végéről a feladat JSON-blokkját,
// és úgy viselkedik, ahogy a feldolgozó prompt előírja: elolvassa (itt: megnézi) a képeket, átiratot ír a munkamappába,
// a minta-leckéből leckét készít a munkafában, felveszi a kezdőlapra, lefordítja, commitol, és megírja az eredmeny.json-t.
// HAMIS_CLAUDE: ok (alap) | hiba (kilépési kód 1) | kep (képet commitol) | tiltott (tiltott szöveget ír) | lassu (időtúllépés) | nemlecke
const fs = require("fs"), path = require("path"), cp = require("child_process");
const mod = process.env.HAMIS_CLAUDE || "ok";
const a = process.argv.slice(2);
if (process.env.HAMIS_NAPLO) fs.appendFileSync(process.env.HAMIS_NAPLO, "claude " + a.map(x => x.length > 60 ? x.slice(0, 60) + "…" : x).join(" ") + " [cwd " + path.basename(process.cwd()) + "]\n");
if (a[0] === "--version") { console.log("2.0.0 (hamis Claude Code)"); process.exit(0); }
if (!a.includes("-p")) { console.error("csak -p"); process.exit(2); }
let be = "";
process.stdin.on("data", d => be += d);
process.stdin.on("end", () => {
  const blokkok = [...be.matchAll(/```json\n([\s\S]*?)\n```/g)];
  const job = JSON.parse(blokkok[blokkok.length - 1][1]);
  const addDir = a[a.indexOf("--add-dir") + 1];
  if (path.resolve(addDir) !== path.resolve(job.munkamappa)) { console.error("a munkamappa nincs --add-dir-rel megadva"); process.exit(3); }
  if (!/Ezt jól olvastam\?/.test(be) || !/LECKE-RECEPT/.test(be)) { console.error("nem a feldolgozó prompt jött"); process.exit(3); }
  for (const k of job.kepek) if (!fs.existsSync(k.fajl)) { console.error("nincs meg a kép: " + k.fajl); process.exit(3); }
  if (mod === "hiba") { console.error("hamis hiba"); process.exit(1); }
  if (mod === "lassu") { setTimeout(() => process.exit(0), 60000); return; }
  const sh = (c, args) => cp.execFileSync(c, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();
  fs.writeFileSync(job.atirat, "# Átirat\n\n" + job.kepek.map((k, i) => "## " + (i + 1) + ". kép (" + k.fajta + ")\n\n1/2 + 1/3 = 5/6\n3/4 + 1/6 [?] = 11/12\n").join("\n"));
  if (mod === "nemlecke") {
    fs.writeFileSync(job.eredmeny, JSON.stringify({ allapot: "nem-lecke", uzenet: "A képeken nem találtam tananyagot (üres oldal). Fotózd le újra." }));
    process.exit(0);
  }
  const lecke = job.leckeElotag + "tortek-osszeadasa", cim = "Törtek összeadása";
  const src = fs.readFileSync(path.join(process.cwd(), "tools", "fuzet", "minta-lecke.src.html"), "utf8").replace(/__LECKE__/g, lecke).replace(/__CIM__/g, cim);
  fs.writeFileSync(path.join("tools", "lessons", lecke + ".src.html"), mod === "tiltott" ? src.replace("<h1>", "<!-- " + process.env.HAMIS_TILTOTT + " --><h1>") : src);
  sh("node", ["tools/lessons/build.js", lecke]);
  let idx = fs.readFileSync("index.html", "utf8");
  const link = '    <a class="lesson" href="' + lecke + '.html">\n      <span class="bits">½ + ⅓</span>\n      <span><b>' + cim + '</b><span class="d">A füzetedből: közös nevező, bővítés, összeadás, egyszerűsítés. 3 dia, 2 levezetés, 2 feladattípus, próbadolgozat.</span></span>\n    </a>\n';
  if (!idx.includes('<h2>A füzetedből</h2>')) idx = idx.replace('  <div class="group">\n  <h2>Python a nulláról</h2>', '  <div class="group">\n  <h2>A füzetedből</h2>\n  <div class="list">\n' + link + '  </div>\n  </div>\n  <div class="group">\n  <h2>Python a nulláról</h2>');
  else idx = idx.replace('<h2>A füzetedből</h2>\n  <div class="list">\n', m => m + link);
  fs.writeFileSync("index.html", idx);
  const add = ["tools/lessons/" + lecke + ".src.html", lecke + ".html", "index.html"];
  if (mod === "kep") { fs.writeFileSync("fuzet-foto.jpg", fs.readFileSync(job.kepek[0].fajl)); add.push("fuzet-foto.jpg"); }
  sh("git", ["add", ...add]);
  sh("git", ["-c", "user.name=Hamis", "-c", "user.email=hamis@example.invalid", "commit", "-q", "-m", "Füzet-lecke: " + cim]);
  fs.writeFileSync(job.eredmeny, JSON.stringify({ lecke, cim, tantargy: "Matek", tema: "Törtek összeadása", bizonytalan: 1,
    osszefoglalo: "- Közös nevező, bővítés, összeadás, egyszerűsítés\n- 2 kidolgozott példa a füzetből\n- 2 feladattípus × 3 szint, próbadolgozat",
    teszt: "lesson-test: hamis futás", lektor: "hamis lektor: 0 pont" }));
  console.log(JSON.stringify({ type: "result", subtype: "success", result: "kész: " + lecke }));
});
