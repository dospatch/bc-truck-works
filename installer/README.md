# BC TRUCK WORKS Installer

The BC TRUCK WORKS Installer packages the Windows connector and supporting files into a simple Windows installation.

## Installation location

The installer creates:

C:\BC-TRUCK-WORKS\

with:

- Connector\
- Plugins\ATS\
- Plugins\ETS2\
- Config\
- Updates\

## Startup

The installer can add BC TRUCK WORKS to Windows startup so the connector can run in the background.

## Build

The installer uses Inno Setup. The project file is:

installer/BCTruckWorks.iss

GitHub Actions is used to build the Windows installer automatically.

## Important

The ATS and ETS2 plugin folders are prepared by the installer, but plugin binaries should only be added after the actual telemetry bridge has been built and tested.
