"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const suggestions = [
  "Give me a driving summary",
  "What is my current speed?",
  "Check my telemetry connection",
  "How many miles have I tracked?",
];


export default function CoDriverPage() {
  const [driverData, setDriverData] = useState(null);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("Hey driver — I’m BC AI, your BC TRUCK WORKS Co-Driver. Ask me about your drive, telemetry, miles, trips, or deliveries.");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/driver", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => { if (data) setDriverData(data); })
      .catch(() => {});
  }, []);

  async function ask(message = question) {
    const prompt = message.trim();
    if (!prompt || busy) return;
    setBusy(true);
    setError("");
    setQuestion("");
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          driver: driverData?.driver || null,
          telemetry: driverData?.latestTelemetry || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "BC AI could not answer right now.");
      setReply(data.reply || "I’m here, driver. Try asking me about your trip or telemetry.");
    } catch (err) {
      setError(err.message || "Could not reach BC AI. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="platform">
      <nav className="platform-nav">
        <Link className="platform-brand" href="/">
          <img src="/bc-truck-works-logo.png" alt="" />
          <span>BC TRUCK WORKS</span>
        </Link>
        <div className="platform-links">
          <Link href="/dashboard">Driver Hub</Link>
          <Link href="/telemetry">Telemetry</Link>
          <Link href="/support">Support</Link>
        </div>
      </nav>

      <section className="dashboard" style={{ maxWidth: 1000 }}>
        <span className="eyebrow">DRIVER COMPANION • BC AI</span>
        <h1>Meet your Co-Driver.</h1>
        <p className="muted" style={{ maxWidth: 700 }}>
          A second set of eyes for your BC TRUCK WORKS journey. Ask about live
          telemetry, speed, fuel, odometer readings, tracked miles, trips, and
          deliveries. Live answers depend on your account and game data being connected.
        </p>

        <div className="panel-grid" style={{ marginTop: 30, gridTemplateColumns: "minmax(0, 1.4fr) minmax(260px, .6fr)" }}>
          <section className="panel" aria-live="polite">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: 14, background: "#132b40", fontSize: 25 }}>✦</div>
              <div>
                <h2 style={{ margin: 0 }}>BC AI Co-Driver</h2>
                <span className="muted" style={{ fontSize: 12 }}>Your journey. Your miles. Your legacy.</span>
              </div>
            </div>
            <div style={{ padding: 18, borderRadius: 12, border: "1px solid #263646", background: "#09111a", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {busy ? "BC AI is checking that for you…" : reply}
            </div>
            {error && <p role="alert" style={{ color: "#ff9a9a", fontSize: 13 }}>{error}</p>}
            <form onSubmit={(event) => { event.preventDefault(); ask(); }} style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask your Co-Driver a question…"
                aria-label="Ask your Co-Driver a question"
                style={{ flex: 1, minWidth: 0, padding: "14px 15px", borderRadius: 10, border: "1px solid #263646", background: "#080e15", color: "#f5f7fa" }}
              />
              <button className="primary" type="submit" disabled={busy || !question.trim()} style={{ border: 0, cursor: busy ? "wait" : "pointer" }}>
                {busy ? "Thinking…" : "Ask AI →"}
              </button>
            </form>
          </section>

          <aside className="panel">
            <h2>Quick questions</h2>
            <p className="muted" style={{ fontSize: 12, marginTop: -8 }}>Choose a prompt to get started.</p>
            <div style={{ display: "grid", gap: 10 }}>
              {suggestions.map((item) => (
                <button key={item} type="button" className="action" onClick={() => ask(item)} disabled={busy} style={{ textAlign: "left", color: "#f5f7fa", cursor: busy ? "wait" : "pointer" }}>
                  <b>{item}</b><span>Ask BC AI →</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid #202d3b" }}>
              <span className="eyebrow">DRIVER STATUS</span>
              <p style={{ marginBottom: 6, fontSize: 13 }}>{driverData?.driver ? "Account connected" : "Sign in to view your account data"}</p>
              <p className="muted" style={{ fontSize: 12, marginTop: 0 }}>{driverData?.latestTelemetry ? "Latest telemetry received." : "Waiting for live game telemetry."}</p>
              {!driverData?.driver && <Link className="primary" href="/api/auth/discord">Login with Discord →</Link>}
            </div>
          </aside>
        </div>

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 24 }}>
          <Link className="back" href="/dashboard">← Back to Driver Hub</Link>
          <Link className="back" href="/telemetry">Open Telemetry →</Link>
        </div>
      </section>
    </main>
  );
}
