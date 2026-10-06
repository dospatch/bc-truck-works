# BC TRUCK WORKS ETS2 Plugin Build

The ETS2 plugin uses the official SCS Telemetry SDK 1.15. The SDK is downloaded during CI and is not committed to this repository.

## Windows build

```powershell
cmake -S plugins/ets2 -B build/ets2 -DSCS_SDK_ROOT=C:\dev\scs_sdk_1_15\include
cmake --build build/ets2 --config Release
```

Expected DLL:

`build/ets2/Release/BCTruckWorksETS2.dll`

The game loads SCS plugins from its game `bin\win_x64\plugins` directory. The BC TRUCK WORKS desktop connector then reads the plugin's loopback endpoint at:

`http://127.0.0.1:25555/api/ets2/telemetry`
