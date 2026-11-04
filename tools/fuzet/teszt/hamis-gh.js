#!/usr/bin/env node
// Hamis gh a teszthez: „pr create” → kiír egy PR-címet; „auth status” → rendben. Naplóz a HAMIS_NAPLO fájlba.
const fs = require("fs");
const a = process.argv.slice(2);
if (process.env.HAMIS_NAPLO) fs.appendFileSync(process.env.HAMIS_NAPLO, "gh " + a.join(" ") + "\n");
if (a[0] === "auth") { console.log("Logged in (hamis)"); process.exit(0); }
if (a[0] === "pr" && a[1] === "create") {
  const body = a[a.indexOf("--body-file") + 1];
  if (!body || !fs.existsSync(body)) { console.error("nincs body"); process.exit(1); }
  console.log("https://github.com/" + a[a.indexOf("--repo") + 1] + "/pull/" + (100 + Math.floor(Math.random() * 900)));
  process.exit(0);
}
if (a[0] === "pr" && a[1] === "view") { console.error("no pull requests found"); process.exit(1); }
console.error("hamis gh: ismeretlen: " + a.join(" "));
process.exit(1);
