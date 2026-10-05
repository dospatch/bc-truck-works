# 🚛 BC TRUCK WORKS

<p align="center">
  <img src="https://raw.githubusercontent.com/dospatch/bc-truck-works/main/web/public/bc-truck-works-logo.svg" alt="BC TRUCK WORKS" width="240">
</p>

<p align="center"><strong>ATS & ETS2 • Driver Hub • Live Telemetry • Discord • Fleet Tools</strong></p>

<p align="center">
  <a href="https://bctruckworks.vercel.app"><img src="https://img.shields.io/badge/Website-Live-111827?style=for-the-badge" alt="Website"></a>
  <a href="https://github.com/dospatch/bc-truck-works/actions"><img src="https://img.shields.io/github/actions/workflow/status/dospatch/bc-truck-works/build-installer.yml?branch=main&style=for-the-badge&label=Build" alt="Build"></a>
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Discord.js-14-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord.js">
</p>

---

## 🚦 What Is BC TRUCK WORKS?

**BC TRUCK WORKS** is a connected trucking platform being built for **American Truck Simulator (ATS)** and **Euro Truck Simulator 2 (ETS2)**.

The vision is simple:

> **Drive in the game. Let BC TRUCK WORKS handle the rest.**

The platform brings together the website, Driver Hub, telemetry connector, Discord bot, fleet tools, trips, mileage, events, and future desktop tools.

---

## 🖼️ Platform

<p align="center">
  <img src="https://raw.githubusercontent.com/dospatch/bc-truck-works/main/web/public/bc-truck-works-logo.svg" alt="BC TRUCK WORKS platform" width="180">
</p>

### 🌐 Driver Hub

The Driver Hub is the main web dashboard for connected drivers.

| Area | Purpose |
|---|---|
| 🏠 Overview | Driver status and statistics |
| 👤 Profile | Driver information and game selection |
| 📡 Live Drive | Current telemetry |
| 🛣️ My Miles | Mileage tracking |
| 📦 Trips | Delivery and trip history |
| 🚛 Fleet | Fleet information |
| 📅 Events | Community events |
| 🤖 BC AI | Telemetry and driver assistance |

---

## 📡 Connected Driving

The intended flow is:

**🎮 ATS / ETS2 → 🧩 BC Connector → 🔐 Telemetry API → 🗄️ Database → 🖥️ Driver Hub**

The connector runs on the driver's Windows PC and acts as the bridge between supported game telemetry and the BC TRUCK WORKS platform.

Supported telemetry targets include:

- ⚡ Speed
- ⛽ Fuel
- 🧭 Odometer
- 📍 Location
- 🎮 Game
- 🛣️ Driving status
- 📦 Trip information

> ⚠️ **Important:** ATS/ETS2 telemetry plugin integration is still under development. This repository does not claim that an untested game plugin is production-ready.

---

## 🤖 BC AI Copilot

BC AI is built into the Driver Hub to make telemetry easier to understand.

Example questions:

- **What is my current speed?**
- **What is my fuel level?**
- **What is my odometer?**
- **How many miles have I driven?**
- **Give me a driving update.**

When configured, BC AI can use the OpenAI API. Without an OpenAI key, the dashboard can provide deterministic telemetry responses.

---

## 💬 Discord

The BC TRUCK WORKS Discord bot connects the trucking platform with the community.

Features include:

- ⚙️ Server setup
- 📢 Update announcements
- 📊 Telemetry commands
- 🎵 Music commands
- 🔔 Owner notifications
- 🛠️ TruckWorks management tools

The bot can monitor the GitHub repository and publish formatted update announcements when qualifying changes are detected.

---

## 👑 Owner Control Center

Owners have a dedicated management experience.

### Control areas

**👥 Drivers**  
Manage and review connected drivers.

**🚛 Fleets**  
Build the fleet-management side of the platform.

**📡 Telemetry**  
Monitor connected driving data.

**📦 Trips**  
Review trip and delivery activity.

**📅 Events**  
Manage trucking events.

**💬 Discord**  
Connect platform activity with Discord.

**⚙️ System**  
Future administration and platform controls.

---

## 🪟 Windows Connector

The Windows connector is designed around a simple experience:

**Install once → Start Windows → Play → Connect automatically**

Target installation structure:

    C:\BC-TRUCK-WORKS\
    ├── Connector\
    │   ├── logs\
    │   └── BCTruckWorksConnector.exe
    ├── Plugins\
    │   ├── ATS\
    │   └── ETS2\
    ├── Config\
    ├── Updates\
    └── ...

The long-term connector goal includes:

- 🔄 Automatic reconnect
- 🟢 Background operation
- 🪟 Windows startup
- 📝 Logging
- 🎮 Game detection
- 🔐 Secure telemetry transmission
- 🔄 Automatic updates

---

## 📦 Windows Installer

The repository includes an **Inno Setup** installer configuration.

The installer is designed to automatically create the BC TRUCK WORKS directory structure instead of requiring drivers to manually create folders.

It can prepare:

- Connector directory
- Connector logs
- ATS plugin directory
- ETS2 plugin directory
- Config directory
- Updates directory
- Windows startup
- Connector launch after installation

GitHub Actions is configured to build the Windows installer.

---

## 🗂️ Project Structure

    bc-truck-works/
    ├── .github/
    │   └── workflows/
    │       └── build-installer.yml
    ├── connector/
    │   ├── index.js
    │   ├── package.json
    │   ├── config.example.json
    │   └── README.md
    ├── installer/
    │   ├── BCTruckWorks.iss
    │   ├── README.md
    │   ├── assets/
    │   └── scripts/
    ├── plugins/
    │   ├── ats/
    │   │   └── README.md
    │   └── ets2/
    │       └── README.md
    ├── docs/
    │   └── README.md
    ├── web/
    │   ├── app/
    │   ├── db/
    │   ├── lib/
    │   └── public/
    ├── index.js
    ├── package.json
    └── README.md

---

## 🧱 Technology Stack

| Component | Technology |
|---|---|
| 🌐 Website | Next.js / React |
| 🎨 Frontend | Responsive CSS |
| 🤖 AI | OpenAI API |
| 💬 Discord | discord.js |
| 🗄️ Database | PostgreSQL |
| 📡 API | Next.js API routes |
| 🖥️ Connector | Node.js |
| 📦 Windows App | pkg |
| 🛠️ Installer | Inno Setup |
| ☁️ Hosting | Vercel |
| 🔧 Source Control | GitHub |

---

## 🔐 Security

Never commit secrets to GitHub.

Examples include:

- DISCORD_TOKEN
- DISCORD_CLIENT_SECRET
- OPENAI_API_KEY
- DATABASE_URL
- TELEMETRY_API_KEY
- SESSION_SECRET

Use environment variables and local configuration files instead.

---

## 📚 Documentation

More documentation is separated by project area:

- 📘 **Docs** — technical project documentation
- 🧩 **Connector** — Windows connector documentation
- 🪟 **Installer** — Windows installation documentation
- 🎮 **ATS** — ATS telemetry integration area
- 🎮 **ETS2** — ETS2 telemetry integration area

---

## 🛣️ Roadmap

### Phase 1 — Foundation

- [x] Website
- [x] Driver login
- [x] Driver Hub
- [x] Driver profile
- [x] Database foundation
- [x] Discord integration
- [x] Telemetry API foundation
- [x] Windows installer workflow

### Phase 2 — Connected Driving

- [ ] Tested ATS telemetry bridge
- [ ] Tested ETS2 telemetry bridge
- [ ] Automatic game detection
- [ ] Automatic reconnect
- [ ] Background/tray operation
- [ ] Real-time driving status

### Phase 3 — Fleet Platform

- [ ] Fleet management
- [ ] Driver management
- [ ] Delivery management
- [ ] Advanced trip history
- [ ] Fleet statistics
- [ ] Events and dispatch tools

### Phase 4 — Full Ecosystem

- [ ] Automatic desktop updates
- [ ] Expanded Owner Control Center
- [ ] Advanced Discord automation
- [ ] More AI tools
- [ ] Dedicated updater
- [ ] Production-ready telemetry integrations

---

## 🚧 Development Status

BC TRUCK WORKS is an **active development project**.

Some components are functional today while other components are still being built and tested.

Planned features should not be confused with completed production features.

---

## 🎯 Mission

BC TRUCK WORKS is being built to create a connected trucking experience where drivers can focus on the road while the platform handles the technology around them.

**Drive. Connect. Track. Build.**

---

<p align="center">
  <strong>🚛 BC TRUCK WORKS</strong><br>
  ATS & ETS2 • Connected Trucking • Community
</p>
