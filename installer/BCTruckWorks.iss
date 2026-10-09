#define MyAppName "BC TRUCK WORKS"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "BC TRUCK WORKS"
#define MyAppURL "https://bcttruckworks.vercel.app"
#define MyAppExeName "BCTruckWorksConnector.exe"

[Setup]
AppId={{BC-TRUCK-WORKS-CONNECTOR}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}

DefaultDirName=C:\BC-TRUCK-WORKS
DisableProgramGroupPage=yes

OutputDir=..\release
OutputBaseFilename=BC-TRUCK-WORKS-Setup
Compression=lzma
SolidCompression=yes

ArchitecturesInstallIn64BitMode=x64
ArchitecturesAllowed=x64

PrivilegesRequired=admin

WizardStyle=modern

[Tasks]
Name: "startup"; \
    Description: "Start BC TRUCK WORKS automatically with Windows"; \
    GroupDescription: "Startup options:"; \
    Flags: checkedonce

Name: "desktopicon"; \
    Description: "Create a desktop shortcut"; \
    GroupDescription: "Shortcuts:"

[Files]

; Main connector
Source: "..\connector\dist\BCTruckWorksConnector.exe"; \
    DestDir: "{app}\Connector"; \
    Flags: ignoreversion

; Configuration example
Source: "..\connector\config.example.json"; \
    DestDir: "{app}\Config"; \
    Flags: ignoreversion

; Native telemetry plugins. Copy the matching DLL into the game's bin\win_x64\plugins folder.
Source: "..\build\ats\Release\BCTruckWorksATS.dll"; DestDir: "{app}\Plugins\ATS"; Flags: ignoreversion
Source: "..\build\ets2\Release\BCTruckWorksETS2.dll"; DestDir: "{app}\Plugins\ETS2"; Flags: ignoreversion
; Connector README
Source: "..\connector\README.md"; \
    DestDir: "{app}\Connector"; \
    Flags: ignoreversion

; Automatic Steam game plugin setup
Source: "install-game-plugins.ps1"; DestDir: "{app}\Setup"; Flags: ignoreversion

[Dirs]

Name: "{app}\Connector"
Name: "{app}\Connector\logs"

Name: "{app}\Plugins"
Name: "{app}\Plugins\ATS"
Name: "{app}\Plugins\ETS2"

Name: "{app}\Config"

Name: "{app}\Updates"

[Icons]

Name: "{autodesktop}\\BC TRUCK WORKS"; Filename: "{app}\\Connector\\BCTruckWorksConnector.exe"; WorkingDir: "{app}\\Connector"
Name: "{group}\\BC TRUCK WORKS"; Filename: "{app}\\Connector\\BCTruckWorksConnector.exe"; WorkingDir: "{app}\\Connector"
Name: "{group}\\BC TRUCK WORKS Website"; Filename: "{#MyAppURL}"
[Registry]

Root: HKCU; \
    Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; \
    ValueType: string; \
    ValueName: "BC TRUCK WORKS"; \
    ValueData: """{app}\Connector\BCTruckWorksConnector.exe"""; \
    Flags: uninsdeletevalue; \
    Tasks: startup

[Run]

Filename: "{sys}\WindowsPowerShell\v1.0\powershell.exe"; \
    Parameters: "-NoProfile -ExecutionPolicy Bypass -File ""{app}\Setup\install-game-plugins.ps1"""; \
    Description: "Install BC TRUCK WORKS telemetry plugins into detected Steam game folders"; \
    Flags: runhidden waituntilterminated postinstall skipifsilent

Filename: "{app}\Connector\BCTruckWorksConnector.exe"; \
    Description: "Start BC TRUCK WORKS Connector now (requires Config\config.json)"; \
    Flags: nowait postinstall skipifsilent; \
    Check: ConfigExists

[UninstallDelete]

Type: filesandordirs; \
    Name: "{app}\Connector\logs"

Type: filesandordirs; \
    Name: "{app}\Updates"

[Code]

function ConfigExists: Boolean;
begin
  Result := FileExists(ExpandConstant('{app}\Config\config.json'));
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    MsgBox(
      'BC TRUCK WORKS has been installed.'#13#10#13#10 +
      'Your connector folder is:' #13#10 +
      'C:\BC-TRUCK-WORKS\Connector'#13#10#13#10 +
      'ATS plugin folder:'#13#10 +
      'C:\BC-TRUCK-WORKS\Plugins\ATS'#13#10#13#10 +
      'ETS2 plugin folder:'#13#10 +
      'C:\BC-TRUCK-WORKS\Plugins\ETS2'#13#10#13#10 +
      'Automatic Steam game plugin setup was attempted.'#13#10 +
      'Check C:\BC-TRUCK-WORKS\Setup\game-plugin-install.log if a game was not detected.'#13#10#13#10 +
      'The connector starts only when Config\config.json exists.',
      mbInformation,
      MB_OK
    );
  end;
end;