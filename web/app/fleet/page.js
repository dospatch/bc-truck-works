import Link from "next/link";

export default function Fleet() {
  return (
    <main className="platform">
      <nav className="platform-nav">
        <Link className="platform-brand" href="/"><img src="/bc-truck-works-logo.png" alt="BC TRUCK WORKS logo" />BC TRUCK WORKS</Link>
        <div className="platform-links"><Link href="/dispatch">Dispatch</Link><Link href="/telemetry">Telemetry</Link><Link href="/support">Support</Link></div>
        <Link className="back" href="/">← Home</Link>
      </nav>
      <section className="dashboard">
        <span className="eyebrow">FLEET / VTC</span>
        <h1>Fleet tools are coming next.</h1>
        <p className="muted">We removed the sample driver, truck, delivery, and mileage totals because they were not connected to real fleet records.</p>
        <div className="panel">
          <h2>What works today</h2>
          <p className="muted">Use Dispatch Starter to manage your own haul list in this browser, or check Telemetry to see whether the backend is receiving game data.</p>
          <div className="actions">
            <Link className="primary" href="/dispatch">Open Dispatch Starter →</Link>
            <Link className="secondary" href="/telemetry">Check Telemetry</Link>
          </div>
        </div>
        <div className="panel" style={{ marginTop: "1rem" }}>
          <h2>What is not enabled yet</h2>
          <p className="muted">Shared company records, driver rosters, fleet totals, and multi-driver syncing need a connected fleet backend. This page will stay simple until those features are ready.</p>
        </div>
      </section>
      <footer className="footer-bar">BC TRUCK WORKS · Fleet management will be enabled when connected to real records.</footer>
    </main>
  );
}
