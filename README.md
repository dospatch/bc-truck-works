# 🚛 BC TRUCK WORKS

<p align="center">
  <img src="web/public/bc-truck-works-logo.png" alt="BC TRUCK WORKS truck artwork" width="300">
</p>

<p align="center">
  <strong>ATS & ETS2 • Driver Hub • Live Telemetry • Discord • Fleet Tools</strong>
</p>

<p align="center">
  <a href="https://bctruckworks.vercel.app">
    <img src="https://img.shields.io/badge/Website-Live-111827?style=for-the-badge" alt="Website">
  </a>
  <a href="https://github.com/dospatch/bc-truck-works/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/dospatch/bc-truck-works/build-installer.yml?branch=main&style=for-the-badge&label=Build" alt="Build">
  </a>
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Discord.js-14-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord.js">
</p>

---

## 🚛 What Is BC TRUCK WORKS?

**BC TRUCK WORKS** is a connected trucking platform being built for:

- 🚛 American Truck Simulator (ATS)
- 🌍 Euro Truck Simulator 2 (ETS2)
- 👤 Driver profiles
- 📡 Live telemetry
- 🛣️ Mileage and trip tracking
- 🚚 Virtual trucking fleets
- 💬 Discord integration
- 📅 Community events
- 🤖 BC AI Copilot
- 🖥️ Windows connector tools

The goal is simple:

> **Drive in the game. Let BC TRUCK WORKS handle the rest.**

---

## 🌐 Driver Hub

The **Driver Hub** is the main web platform for connected BC TRUCK WORKS drivers.

### Driver features

| Area | Purpose |
|---|---|
| 🏠 Overview | Driver status and statistics |
| 👤 Profile | Driver information and game selection |
| 📡 Live Drive | Current telemetry |
| 🛣️ My Miles | Mileage tracking |
| 📦 Trips | Delivery and trip history |
| 🚛 Fleet | Fleet information |
| 📅 Events | Community events |
| 🤖 BC AI | Telemetry and driving assistance |

### 👑 Owner Controls

Owners can access additional management areas for:

- Drivers
- Fleets
- Telemetry
- Trips
- Events
- Discord
- System controls

---

## 📡 Connected Driving

The planned connected-driving architecture is:

```text
🎮 ATS / ETS2
       ↓
🧩 BC TRUCK WORKS Connector
       ↓
🔐 Telemetry API
       ↓
🗄️ PostgreSQL Database
       ↓
🖥️ Driver Hub
---

## 🎮 BC TRUCK WORKS Game Connection

The connected-driving stack now has three layers:

```
ATS / ETS2
   ↓
BC TRUCK WORKS SCS Telemetry Plugin
   ↓
127.0.0.1:25555
   ↓
BC TRUCK WORKS Windows Connector
   ↓
Vercel API / PostgreSQL
   ↓
Driver Hub + Mobile PWA + Discord
```

### Plugins

- `plugins/ats/BCTruckWorksATS.dll`
- `plugins/ets2/BCTruckWorksETS2.dll`

Both plugins are built against the official SCS Telemetry SDK 1.15 in GitHub Actions. The SDK is downloaded during the build and is not committed to the repository. SCS documents Telemetry SDK 1.15 as the current stable release and notes that SDK 1.14+ also supports basic input devices.

The DLLs must ultimately be installed into the game's `bin\\win_x64\\plugins` directory. The connector then talks to the plugin over localhost.

### Mobile

Open:

`https://bcttruckworks.vercel.app/mobile`

The Driver Hub includes a mobile/PWA control page for connected drivers.

### Discord → Game

The new `/truck` command family queues approved game commands:

- `/truck status`
- `/truck pause`
- `/truck save`
- `/truck screenshot`
- `/truck echo`
- `/truck route`
- `/truck time`

The desktop connector consumes the command queue and sends the approved command through the game's developer console. SCS documents commands such as `pause`, `save`, `screenshot`, `route`, and `g_set_time`.

For this feature, enable the game console/developer mode and set the connector's `allowGameInput` to `true`. Keep the Discord command API key private.
