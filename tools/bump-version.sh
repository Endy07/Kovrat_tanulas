#!/bin/sh
# Új verzió-időbélyeg a version.json-ba és minden oldal kovrat-version metájába.
# Az oldalak ezt hasonlítják össze: ha a szerveren újabb a version.json, maguktól újratöltenek.
cd "$(dirname "$0")/.." || exit 1
v=$(date +%Y%m%d%H%M%S)
printf '{"v":"%s"}\n' "$v" > version.json
for f in *.html; do
  sed -i "s/<meta name=\"kovrat-version\" content=\"[0-9]*\">/<meta name=\"kovrat-version\" content=\"$v\">/" "$f"
done
echo "$v"
