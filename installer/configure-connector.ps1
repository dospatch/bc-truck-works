Add-Type -AssemblyName System.Windows.Forms
$ErrorActionPreference = "Stop"

$root = "C:\BC-TRUCK-WORKS"
$configDir = Join-Path $root "Config"
$target = Join-Path $configDir "config.json"
New-Item -ItemType Directory -Force -Path $configDir | Out-Null

if (Test-Path -LiteralPath $target) {
  [System.Windows.Forms.MessageBox]::Show(
    "A BC TRUCK WORKS config.json already exists. It was left unchanged." + [Environment]::NewLine + [Environment]::NewLine + "Config location:" + [Environment]::NewLine + $target,
    "BC TRUCK WORKS Setup",
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Information
  ) | Out-Null
  exit 0
}

[System.Windows.Forms.MessageBox]::Show(
  "Choose the private BC TRUCK WORKS config JSON file you previously saved. Do not choose a public example file with placeholder keys." + [Environment]::NewLine + [Environment]::NewLine + "Your private configuration stays on this PC and is not uploaded by this setup tool.",
  "BC TRUCK WORKS Setup",
  [System.Windows.Forms.MessageBoxButtons]::OK,
  [System.Windows.Forms.MessageBoxIcon]::Information
) | Out-Null

$dialog = New-Object System.Windows.Forms.OpenFileDialog
$dialog.Title = "Select your private BC TRUCK WORKS config.json"
$dialog.Filter = "JSON configuration (*.json)|*.json|All files (*.*)|*.*"
$dialog.CheckFileExists = $true
$dialog.Multiselect = $false

if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) {
  [System.Windows.Forms.MessageBox]::Show(
    "Configuration was not imported. Nothing was uploaded or changed. Run 'Configure BC TRUCK WORKS' from the Start menu when you have your private config file.",
    "BC TRUCK WORKS Setup",
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Warning
  ) | Out-Null
  exit 0
}

try {
  $config = Get-Content -LiteralPath $dialog.FileName -Raw | ConvertFrom-Json
  if ($config.game -notin @("ATS", "ETS2")) { throw "The game field must be ATS or ETS2." }
  if ([string]::IsNullOrWhiteSpace([string]$config.discordId) -or $config.discordId -eq "YOUR_DISCORD_USER_ID") { throw "The config is missing a real Discord user ID." }
  if ([string]::IsNullOrWhiteSpace([string]$config.apiUrl) -or [string]::IsNullOrWhiteSpace([string]$config.telemetryApiKey) -or $config.telemetryApiKey -eq "YOUR_TELEMETRY_API_KEY") { throw "The config is missing its private API URL or telemetry key." }

  Copy-Item -LiteralPath $dialog.FileName -Destination $target -Force
  [System.Windows.Forms.MessageBox]::Show(
    "Configuration imported successfully." + [Environment]::NewLine + [Environment]::NewLine + "BC TRUCK WORKS can now start its connector. Keep this config file private.",
    "BC TRUCK WORKS Setup",
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Information
  ) | Out-Null
} catch {
  [System.Windows.Forms.MessageBox]::Show(
    "The configuration was not imported:" + [Environment]::NewLine + [Environment]::NewLine + $_.Exception.Message + [Environment]::NewLine + [Environment]::NewLine + "No existing config was overwritten.",
    "BC TRUCK WORKS Setup",
    [System.Windows.Forms.MessageBoxButtons]::OK,
    [System.Windows.Forms.MessageBoxIcon]::Error
  ) | Out-Null
  exit 1
}
