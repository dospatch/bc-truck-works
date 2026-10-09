$ErrorActionPreference = "Stop"
$root = "C:\BC-TRUCK-WORKS"
$logDir = Join-Path $root "Setup"
$logPath = Join-Path $logDir "game-plugin-install.log"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

function Write-Log([string]$message) {
  $line = "$(Get-Date -Format o) $message"
  Add-Content -LiteralPath $logPath -Value $line
  Write-Output $line
}

function Get-SteamRoots {
  $roots = New-Object System.Collections.Generic.List[string]
  $registryPaths = @(
    "HKCU:\Software\Valve\Steam",
    "HKLM:\SOFTWARE\WOW6432Node\Valve\Steam",
    "HKLM:\SOFTWARE\Valve\Steam"
  )
  foreach ($rp in $registryPaths) {
    try {
      $p = (Get-ItemProperty -LiteralPath $rp -ErrorAction Stop).InstallPath
      if ($p -and (Test-Path -LiteralPath $p)) { $roots.Add($p) }
    } catch {}
  }
  $uniqueRoots = @($roots | Select-Object -Unique)
  $libraries = New-Object System.Collections.Generic.List[string]
  foreach ($steam in $uniqueRoots) {
    $libraries.Add($steam)
    $vdf = Join-Path $steam "steamapps\libraryfolders.vdf"
    if (Test-Path -LiteralPath $vdf) {
      $content = Get-Content -LiteralPath $vdf -Raw
      foreach ($match in [regex]::Matches($content, '"path"\s+"([^"]+)"')) {
        $path = $match.Groups[1].Value.Replace("\\", "\")
        if (Test-Path -LiteralPath $path) { $libraries.Add($path) }
      }
    }
  }
  return @($libraries | Select-Object -Unique)
}

function Install-Plugin([string]$gameName, [string]$folderName, [string]$dllName) {
  $source = Join-Path $root "Plugins\$folderName\$dllName"
  if (-not (Test-Path -LiteralPath $source)) {
    Write-Log "MISSING: plugin source not found: $source"
    return $false
  }

  $found = $false
  foreach ($library in (Get-SteamRoots)) {
    $gameRoot = Join-Path $library "steamapps\common\$gameName"
    $gameExe = Join-Path $gameRoot "bin\win_x64"
    if (Test-Path -LiteralPath $gameExe) {
      $pluginDir = Join-Path $gameExe "plugins"
      New-Item -ItemType Directory -Force -Path $pluginDir | Out-Null
      Copy-Item -LiteralPath $source -Destination (Join-Path $pluginDir $dllName) -Force
      Write-Log "INSTALLED: $dllName -> $pluginDir"
      $found = $true
    }
  }

  if (-not $found) { Write-Log "NOT FOUND: $gameName was not found in detected Steam libraries." }
  return $found
}

Write-Log "Starting BC TRUCK WORKS game plugin setup."
$ats = Install-Plugin "American Truck Simulator" "ATS" "BCTruckWorksATS.dll"
$ets2 = Install-Plugin "Euro Truck Simulator 2" "ETS2" "BCTruckWorksETS2.dll"
if (-not $ats -and -not $ets2) {
  Write-Log "No supported Steam game folder was found. Plugins remain available under C:\BC-TRUCK-WORKS\Plugins for manual installation."
}
Write-Log "Finished plugin setup. The game must be restarted after plugin installation."
