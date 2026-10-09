# 🚛 BC TRUCK WORKS — Latest Updates
**Update date: October 9, 2026**

BC TRUCK WORKS development is moving toward a simpler, fully branded connection for **American Truck Simulator (ATS)** and **Euro Truck Simulator 2 (ETS2)**.

## 📡 Our Own Telemetry System
- BC TRUCK WORKS has its own ATS and ETS2 telemetry plugin source in the project.
- The Windows connector reads game telemetry and sends it to the public Driver Hub API.
- The local 127.0.0.1:25555 address is a private loopback connection on the same gaming PC between the game plugin and connector. Drivers do not need to use it as a website.
- The local endpoint is expected to be unavailable when the game or telemetry plugin is not running.

## 🖥️ Installer & Setup
- The Windows installer builds through GitHub Actions.
- Setup attempts to install the matching ATS/ETS2 plugin into detected Steam game folders.
- A private configuration import wizard is being added so drivers can select their own config file rather than manually creating the file path.
- Private configuration files and API keys must never be posted in Discord or committed to GitHub.
- Game command input remains disabled by default unless intentionally configured and tested.

## 🌐 Driver Hub
- Public website: https://bcttruckworks.vercel.app
- Telemetry API endpoint: /api/telemetry
- Connected-driving flow: Game → BC TRUCK WORKS plugin → local connector → secure API → Driver Hub.
- The local connection and live telemetry still require a Windows/ATS/ETS2 test before we can call the full flow verified.

## 🧪 Verification Status
- A previous Windows installer build completed successfully.
- Still needs verification on the owner's Windows PC: installation, plugin loading in a live game, telemetry arriving in the Driver Hub, and end-to-end trip/mileage updates.
- If reporting setup errors, remove API keys, tokens, and private configuration data from logs before sharing them.

## 🔗 Project Links
- Website: https://bcttruckworks.vercel.app
- GitHub repository: https://github.com/dospatch/bc-truck-works
- Installer workflow: https://github.com/dospatch/bc-truck-works/actions
- Discord invite: https://discord.gg/YFE7tFGEsh

**BC TRUCK WORKS — Serious Trucking • Realism • Community Driven.** 🚛
