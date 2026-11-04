# Füzet-figyelő: Windows Feladatütemező-feladat (bejelentkezéskor indul, a háttérben fut, hiba esetén újraindul).
# Futtatás (PowerShell, a repó gyökeréből):
#   powershell -ExecutionPolicy Bypass -File tools\fuzet\figyelo\telepites.ps1
# Eltávolítás:
#   powershell -ExecutionPolicy Bypass -File tools\fuzet\figyelo\telepites.ps1 -Eltavolit
param([switch]$Eltavolit)
$ErrorActionPreference = "Stop"
$nev = "Fuzet-figyelo"
if ($Eltavolit) {
  Unregister-ScheduledTask -TaskName $nev -Confirm:$false -ErrorAction SilentlyContinue
  Write-Host "Eltávolítva: $nev"
  exit 0
}
$mappa = Split-Path -Parent $MyInvocation.MyCommand.Path
$szkript = Join-Path $mappa "figyelo.js"
$config = Join-Path $mappa "figyelo.config.json"
if (-not (Test-Path $config)) { throw "Előbb készítsd el a beállítást: másold le a figyelo.config.example.json-t figyelo.config.json néven, és írd át." }
$node = (Get-Command node -ErrorAction Stop).Source

Write-Host "Beállítás ellenőrzése (node figyelo.js --proba)…"
& $node $szkript --proba
if ($LASTEXITCODE -ne 0) { throw "A próba hibát talált (fent). Javítsd, és futtasd újra ezt a szkriptet." }

# rejtett ablakban indul (a napló: <munkamappa>\figyelo.log)
$arg = "-NoProfile -WindowStyle Hidden -Command `"& '$node' '$szkript'`""
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $arg -WorkingDirectory $mappa
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable `
  -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 5) -ExecutionTimeLimit ([TimeSpan]::Zero) -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName $nev -Action $action -Trigger $trigger -Settings $settings `
  -Description "Füzetfotókból lecke: figyeli a Drive-on a sor.json-t (tools/fuzet/figyelo)." -Force | Out-Null
Start-ScheduledTask -TaskName $nev
Write-Host "Kész: a '$nev' feladat fut, és minden bejelentkezéskor elindul. Napló: a munkamappa figyelo.log fájlja."
