"use client";

import { useEffect, useState } from "react";

export default function Telemetry() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadTelemetry() {
    try {
      const response = await fetch("/api/driver", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load telemetry");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Telemetry load error:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTelemetry();

    const timer = setInterval(loadTelemetry, 5000);

    return () => clearInterval(timer);
  }, []);

  const telemetry = data?.telemetry;
  const driver = data?.driver;

  const connected = Boolean(telemetry);

  const speed = telemetry?.speed ?? 0;
  const fuel =
    telemetry?.fuel !== null && telemetry?.fuel !== undefined
      ? telemetry.fuel
      : "--";

  const odometer =
    telemetry?.odometer !== null && telemetry?.odometer !== undefined
      ? telemetry.odometer
      : "--";

  const game = telemetry?.game || driver?.game || "ATS / ETS2";

  return (
    <main className="platform">
      <nav className="platform-nav">
        <a className="platform-brand" href="/">
          <img
            src="/bc-truck-works-logo.svg"
            alt="BC TRUCK WORKS"
          />
          BC TRUCK WORKS
        </a>

        <div className="platform-links">
          <a href="/dashboard">Driver Hub</a>
          <a href="/fleet">Fleet</a>
          <a href="/events">Events</a>
          <a href="/telemetry">Telemetry</a>
        </div>

        <a className="back" href="/dashboard">
          ← Dashboard
        </a>
      </nav>

      <section className="dashboard">
        <span className="eyebrow">LIVE TELEMETRY</span>

        <h1>Every mile tells a story.</h1>

        <p className="muted">
          Monitor your connected ATS or ETS2 session in real time.
          BC TRUCK WORKS receives telemetry from the Windows connector
          and turns it into useful driving and fleet data.
        </p>

        <span className="status-pill">
          <i
            className="status-dot"
            style={{
              background: connected ? "#35d07f" : "#ffb020",
            }}
          />

          {loading
            ? "Checking connector..."
            : connected
              ? "Connector connected"
              : "Waiting for driver connection"}
        </span>

        <div className="metric-grid">
          <div className="metric">
            <small>CONNECTION</small>

            <strong>
              {loading
                ? "CHECKING"
                : connected
                  ? "LIVE"
                  : "WAITING"}
            </strong>

            <span>
              {connected
                ? "Telemetry received"
                : "Waiting for telemetry"}
            </span>
          </div>

          <div className="metric">
            <small>GAME</small>

            <strong>{game}</strong>

            <span>Connected driving platform</span>
          </div>

          <div className="metric">
            <small>SPEED</small>

            <strong>{speed} km/h</strong>

            <span>Current vehicle speed</span>
          </div>

          <div className="metric">
            <small>FUEL</small>

            <strong>
              {fuel === "--" ? "--" : `${fuel}`}
            </strong>

            <span>
              {fuel === "--"
                ? "Waiting for telemetry"
                : "Current fuel level"}
            </span>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric">
            <small>ODOMETER</small>

            <strong>
              {odometer === "--"
                ? "--"
                : `${odometer}`}
            </strong>

            <span>Current vehicle mileage</span>
          </div>

          <div className="metric">
            <small>DRIVER</small>

            <strong>
              {driver?.display_name || "Driver"}
            </strong>

            <span>Connected Driver Hub account</span>
          </div>

          <div className="metric">
            <small>TRIP DATA</small>

            <strong>
              {connected ? "LIVE" : "READY"}
            </strong>

            <span>
              {connected
                ? "Trip data being received"
                : "Available when connected"}
            </span>
          </div>

          <div className="metric">
            <small>FLEET SYNC</small>

            <strong>ON</strong>

            <span>
              Fleet statistics available
            </span>
          </div>
        </div>

        <div className="panel">
          <h2>Telemetry connection</h2>

          <div className="row">
            <strong>Connector</strong>

            <span>
              {connected
                ? "Connected"
                : "Waiting for connection"}
            </span>
          </div>

          <div className="row">
            <strong>Game</strong>

            <span>{game}</span>
          </div>

          <div className="row">
            <strong>Data pipeline</strong>

            <span>
              Game → Connector → BC TRUCK WORKS API → Driver Hub
            </span>
          </div>

          <div className="row">
            <strong>Dashboard</strong>

            <span>
              Driver + Fleet statistics
            </span>
          </div>

          <div className="row">
            <strong>Refresh</strong>

            <span>
              Automatic • Every 5 seconds
            </span>
          </div>
        </div>

        {!connected && !loading && (
          <div className="panel">
            <h2>Waiting for telemetry</h2>

            <p className="muted">
              Start American Truck Simulator or Euro Truck Simulator 2
              with the BC TRUCK WORKS Connector running. Once telemetry
              reaches the BC TRUCK WORKS API, this page will update
              automatically.
            </p>
          </div>
        )}
      </section>

      <footer className="footer-bar">
        BC TRUCK WORKS Telemetry • Automatic connector synchronization
      </footer>
    </main>
  );
}