const fs = require("fs");
const path = require("path");
const axios = require("axios");

const configPath = path.join(__dirname, "config.json");
if (!fs.existsSync(configPath)) {
  console.error("Missing config.json. Copy config.example.json to config.json and configure it.");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const interval = Math.max(Number(config.intervalMs || 2000), 1000);

function normalizeTelemetry(raw) {
  const t = raw && (raw.telemetry || raw.data || raw);
  return {
    speed: Number(t.speed ?? t.speedKmh ?? t.speed_kmh ?? 0),
    fuel: t.fuel == null ? null : Number(t.fuel),
    odometer: t.odometer == null ? null : Number(t.odometer),
    latitude: t.latitude == null ? null : Number(t.latitude),
    longitude: t.longitude == null ? null : Number(t.longitude),
    payload: t
  };
}

async function poll() {
  try {
    const response = await axios.get(config.telemetryUrl, { timeout: 1500 });
    const telemetry = normalizeTelemetry(response.data);

    await axios.post(config.apiUrl, {
      driverId: config.driverId,
      game: config.game,
      ...telemetry
    }, {
      timeout: 5000,
      headers: { "x-telemetry-key": config.telemetryApiKey }
    });

    process.stdout.write(
      "[BC TRUCK WORKS] Connected • " +
      config.game + " • " +
      telemetry.speed + " km/h\n"
    );
  } catch (error) {
    process.stdout.write("[BC TRUCK WORKS] Waiting for game telemetry...\n");
  }
}

console.log("BC TRUCK WORKS Connector starting...");
setInterval(poll, interval);
poll();
