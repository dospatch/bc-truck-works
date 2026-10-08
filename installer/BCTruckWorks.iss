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
SetupIconFile=..\web\public\bc-truck-works.ico

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

; Connector README
Source: "..\connector\README.md"; \
    DestDir: "{app}\Connector"; \
    Flags: ignoreversion

[Dirs]

Name: "{app}\Connector"
Name: "{app}\Connector\logs"

Name: "{app}\Plugins"
Name: "{app}\Plugins\ATS"
Name: "{app}\Plugins\ETS2"

Name: "{app}\Config"

Name: "{app}\Updates"

[Icons]

Name: "{autodesktop}\BC TRUCK WORKS"
Filename: "{app}\Connector\BCTruckWorksConnector.exe"
WorkingDir: "{app}\Connector"

Name: "{group}\BC TRUCK WORKS"
Filename: "{app}\Connector\BCTruckWorksConnector.exe"
WorkingDir: "{app}\Connector"

Name: "{group}\BC TRUCK WORKS Website"
Filename: "{#MyAppURL}"

[Registry]

Root: HKCU; \
    Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; \
    ValueType: string; \
    ValueName: "BC TRUCK WORKS"; \
    ValueData: """{app}\Connector\BCTruckWorksConnector.exe"""; \
    Flags: uninsdeletevalue; \
    Tasks: startup

[Run]

Filename: "{app}\Connector\BCTruckWorksConnector.exe"; \
    Description: "Start BC TRUCK WORKS Connector now"; \
    Flags: nowait postinstall skipifsilent

[UninstallDelete]

Type: filesandordirs; \
    Name: "{app}\Connector\logs"

Type: filesandordirs; \
    Name: "{app}\Updates"

[Code]

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
      'C:\BC-TRUCK-WORKS\Plugins\ETS2',
      mbInformation,
      MB_OK
    );
  end;
end;