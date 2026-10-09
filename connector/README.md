# BC TRUCK WORKS Game Connector

This is the Windows bridge for BC TRUCK WORKS telemetry. It connects our own SCS telemetry plugin inside ATS or ETS2 to the public BC TRUCK WORKS API.

## Architecture

ATS / ETS2 → BC TRUCK WORKS SCS plugin → private local loopback endpoint → BC TRUCK WORKS Connector → Vercel API → Driver Hub

## Installation

1. Run `BC-TRUCK-WORKS-Setup.exe` as administrator.
2. The installer attempts to find ATS and ETS2 in Steam libraries and copy the matching plugin DLL into each game's `bin\win_x64\plugins` folder.
3. If a game is not detected, check `C:\BC-TRUCK-WORKS\Setup\game-plugin-install.log` and copy the matching DLL from `C:\BC-TRUCK-WORKS\Plugins\ATS` or `C:\BC-TRUCK-WORKS\Plugins\ETS2` manually.
4. Put your private `config.json` in `C:\BC-TRUCK-WORKS\Config`. Do not commit it or share it publicly.
5. Start or restart the game, then start the BC TRUCK WORKS Connector.

## Why localhost exists

The local address `127.0.0.1:25555` is an internal connection between the game plugin and the connector on the same Windows PC. It is not the public website and normally should not be opened manually in a browser. It responds only while a supported game is running and the BC TRUCK WORKS plugin has loaded successfully.

The connector sends telemetry to `https://bcttruckworks.vercel.app/api/telemetry`. The local telemetry server binds only to the loopback interface, so it is not intended to be accessible from other computers on the network.

## Configuration

Copy `config.example.json` to `config.json` and configure:
- `game`: `ATS` or `ETS2`
- `discordId`: the driver's Discord user ID
- `apiUrl` and `telemetryApiKey`: private cloud API settings
- `commandsUrl` and `connectorCommandKey`: optional game-command queue settings

Keep `allowGameInput` set to `false` unless you intentionally configure and test game commands. Never commit real keys or a driver's private config.

## Troubleshooting

- If the local endpoint refuses the connection, first make sure the game is running and the matching plugin DLL is installed in the game's `bin\win_x64\plugins` folder.
- Check the game's `game.log.txt` for a BC TRUCK WORKS plugin initialization or bind error.
- Check `C:\BC-TRUCK-WORKS\Connector\logs\connector.log` for connector status.
- If port 25555 is already occupied, the plugin cannot start its local endpoint. Close other telemetry tools using that port before retrying.

## Discord / Game Commands

The connector can consume approved BC TRUCK WORKS game commands. Game input remains disabled by default. Only enable it after the allow-listed command flow has been deliberately configured and tested.
