# BC TRUCK WORKS ATS Plugin Build

The ATS plugin uses the official SCS Telemetry SDK. The SDK is not committed to this repository.

Official SDK:
https://modding.scssoft.com/wiki/Documentation/Engine/SDK/Telemetry

The current SCS documentation lists Telemetry SDK 1.15 as stable. The plugin build must be performed against the SDK headers supplied by SCS.

## Local Windows build

1. Download the SCS Telemetry SDK.
2. Extract it somewhere such as:

C:\dev\scs_sdk_1_15

3. Configure:

cmake -S plugins/ats -B build/ats -DSCS_SDK_ROOT=C:\dev\scs_sdk_1_15\include

4. Build:

cmake --build build/ats --config Release

The resulting DLL is:

build/ats/Release/BCTruckWorksATS.dll

Copy it to:

C:\BC-TRUCK-WORKS\Plugins\ATS\

The plugin listens only on localhost port 25555 and exposes the connector-compatible telemetry path:

http://127.0.0.1:25555/api/ats/telemetry

The path is kept connector-compatible for the first integration pass so the existing Windows Connector does not need a breaking configuration change.
