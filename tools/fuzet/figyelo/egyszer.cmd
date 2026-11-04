@echo off
rem Füzet-figyelő kézzel, látható ablakban: egy kör (minden várakozó kérés), aztán vége.
rem Ha a háttérfeladat is fut, ez kilép („A figyelő már fut”), és az dolgozik helyette.
cd /d "%~dp0"
node figyelo.js --egyszer
pause
