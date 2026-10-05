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
