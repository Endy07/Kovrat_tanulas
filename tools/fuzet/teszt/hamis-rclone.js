#!/usr/bin/env node
// Hamis rclone a teszthez: a „gdrive:” remote a HAMIS_DRIVE mappa (ugyanaz, amit a hamis Apps Script használ).
// Csak azt tudja, amit a figyelő használ: version, cat, copyto, lsf. Minden hívást naplóz a HAMIS_NAPLO fájlba.
const fs = require("fs"), path = require("path");
const DRIVE = process.env.HAMIS_DRIVE;
if (!DRIVE) { console.error("HAMIS_DRIVE nincs beállítva"); process.exit(2); }
const args = process.argv.slice(2).filter(a => !a.startsWith("--") || false), kapcs = process.argv.slice(2).filter(a => a.startsWith("--"));
if (process.env.HAMIS_NAPLO) fs.appendFileSync(process.env.HAMIS_NAPLO, "rclone " + process.argv.slice(2).join(" ") + "\n");
const helyi = p => /^gdrive:/.test(p) ? path.join(DRIVE, p.slice(7)) : p;
const [cmd, a, b] = args;
if (process.env.HAMIS_RCLONE_HALOZAT) { console.error("Failed to create file system: couldn't connect"); process.exit(1); }
if (cmd === "version") { console.log("rclone v1.68.0 (hamis)"); process.exit(0); }
if (cmd === "cat") {
  const p = helyi(a);
  if (!fs.existsSync(path.dirname(p))) { console.error("Failed to cat: directory not found"); process.exit(3); }
  if (fs.existsSync(p)) process.stdout.write(fs.readFileSync(p));
  process.exit(0);
}
if (cmd === "copyto") {
  const src = helyi(a), dst = helyi(b);
  if (!fs.existsSync(src)) { console.error("Failed to copy: object not found"); process.exit(3); }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  process.exit(0);
}
if (cmd === "lsf") { const p = helyi(a); if (!fs.existsSync(p)) { console.error("directory not found"); process.exit(3); } console.log(fs.readdirSync(p).join("\n")); process.exit(0); }
console.error("hamis rclone: ismeretlen parancs: " + cmd + " " + kapcs.join(" "));
process.exit(1);
