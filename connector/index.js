const fs = require("fs");
const path = require("path");
const axios = require("axios");

const ROOT = "C:\\BC-TRUCK-WORKS";
const CONNECTOR_DIR = path.join(ROOT, "Connector");
const PLUGINS_DIR = path.join(ROOT, "Plugins");
const CONFIG_DIR = path.join(ROOT, "Config");
const LOG_DIR = path.join(CONNECTOR_DIR, "logs");

for (const dir of [
  ROOT,
  CONNECTOR_DIR,
  PLUGINS_DIR,
  CONFIG_DIR,
  LOG_DIR,
  path.join(PLUGINS_DIR, "ATS"),
  path.join(PLUGINS_DIR, "ETS2")
]) {
  fs.mkdirSync(dir, { recursive: true });
}

const configCandidates = [path.join(CONFIG_DIR, "config.json"), path.join(CONNECTOR_DIR, "config.json")];
const configPath = configCandidates.find((file) => fs.existsSync(file));

if (!configPath) {
  console.error("");
  console.error("BC TRUCK WORKS Connector");
  console.error("--------------------------------");
  console.error("Missing configuration file:");
  console.error(path.join(CONFIG_DIR, "config.json"));
  console.error(path.join(CONNECTOR_DIR, "config.json"));
  console.error("");
  console.error("Create config.json before starting the connector.");
  process.exit(1);
}

let config;

try {
  config = JSON.parse(fs.readFileSync(configPath, "utf8"));
} catch (error) {
  console.error("[BC TRUCK WORKS] Invalid config.json.");
  console.error(error.message);
  process.exit(1);
}

const interval = Math.max(Number(config.intervalMs || 2000), 1000);
const telemetryTimeout = Math.max(Number(config.telemetryTimeoutMs || 1500), 500);
const requestTimeout = Math.max(Number(config.requestTimeoutMs || 5000), 1000);

const telemetryUrl =
  config.telemetryUrl ||
  "http://127.0.0.1:25555/api/ets2/telemetry";

const apiUrl = config.apiUrl;

const game =
  String(config.game || "ATS").toUpperCase();

function log(message) {
  const timestamp = new Date().toISOString();

  const line =
    `[${timestamp}] ${message}\n`;

  process.stdout.write(line);

  try {
    fs.appendFileSync(
      path.join(LOG_DIR, "connector.log"),
      line
    );
  } catch {}
}

function normalizeTelemetry(raw) {
  const t =
    raw &&
    (raw.telemetry ||
      raw.data ||
      raw);

  return {
    speed: Number(
      t.speed ??
      t.speedKmh ??
      t.speed_kmh ??
      0
    ),

    fuel:
      t.fuel == null
        ? null
        : Number(t.fuel),

    odometer:
      t.odometer == null
        ? null
        : Number(t.odometer),

    latitude:
      t.latitude == null
        ? null
        : Number(t.latitude),

    longitude:
      t.longitude == null
        ? null
        : Number(t.longitude),

    payload: t
  };
}

let connected = false;
let lastGame = null;

async function poll() {
  try {
    const response =
      await axios.get(
        telemetryUrl,
        {
          timeout: telemetryTimeout
        }
      );

    const telemetry =
      normalizeTelemetry(response.data);

    if (!connected) {
      connected = true;

      log(
        `Telemetry connected • ${game}`
      );
    }

    if (lastGame !== game) {
      lastGame = game;

      log(
        `Game detected • ${game}`
      );
    }

    if (!apiUrl) {
      log(
        "API URL is not configured."
      );

      return;
    }

    await axios.post(
      apiUrl,
      {
        driverId: config.driverId,
        game,
        ...telemetry
      },
      {
        timeout: requestTimeout,

        headers: {
          "x-telemetry-key":
            config.telemetryApiKey
        }
      }
    );

    log(
      `LIVE • ${game} • ${telemetry.speed.toFixed(0)} km/h`
    );

  } catch (error) {

    if (connected) {
      connected = false;

      log(
        "Game telemetry disconnected."
      );
    }

    log(
      "Waiting for ATS/ETS2 telemetry..."
    );
  }
}

log("================================");
log("BC TRUCK WORKS CONNECTOR");
log("================================");
log(`Installation: ${ROOT}`);
log(`Game mode: ${game}`);
log(`Telemetry: ${telemetryUrl}`);
log("Connector started.");
log("Waiting for game telemetry...");

poll();

setInterval(
  poll,
  interval
);