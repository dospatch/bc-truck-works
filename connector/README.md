# BC TRUCK WORKS Game Connector

This connector bridges ATS/ETS2 telemetry on the gaming PC to the BC TRUCK WORKS cloud API.

## Architecture

ATS / ETS2 → local telemetry provider → BC TRUCK WORKS Connector → Vercel API → PostgreSQL → Driver Hub

The connector source lives in GitHub. The connector itself must still run on the same PC as the game because that is where the game telemetry exists.

## Setup

1. Install/configure an ATS/ETS2 telemetry provider that exposes the local endpoint:
   http://127.0.0.1:25555/api/ets2/telemetry
2. Copy config.example.json to config.json.
3. Set the API URL, telemetry key, driver ID, and game.
4. Start the connector.

Never commit config.json or API keys.

## Release

GitHub Actions builds a Windows executable from this folder.


## 🎮 Discord / Mobile Game Commands

The connector can consume the BC TRUCK WORKS game command queue and send approved developer-console commands to the active game window.

Add these values to `Config\\config.json`:

```json
{
  "commandsUrl": "https://bcttruckworks.vercel.app/api/game-commands",
  "connectorCommandKey": "YOUR_CONNECTOR_COMMAND_KEY",
  "allowGameInput": true,
  "gameWindowTitle": "American Truck Simulator"
}
```

Use `Euro Truck Simulator 2` for ETS2.

Before enabling game input, enable the game's developer console with `g_console 1` and `g_developer 1`. The bridge only sends the allow-listed BC TRUCK WORKS commands; it does not accept arbitrary console commands.

Discord commands are sent through the website queue, so the desktop connector remains the only component that can reach the local game.
