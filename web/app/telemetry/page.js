export default function Telemetry() {
  return (
    <main className="platform">
      <nav className="platform-nav">
        <a className="platform-brand" href="/"><img src="/bc-truck-works-logo.svg" alt="" />BC TRUCK WORKS</a>
        <div className="platform-links"><a href="/dashboard">Driver Hub</a><a href="/fleet">Fleet</a><a href="/events">Events</a><a href="/telemetry">Telemetry</a></div>
        <a className="back" href="/dashboard">← Dashboard</a>
      </nav>
      <section className="dashboard">
        <span className="eyebrow">LIVE TELEMETRY</span><h1>Every mile tells a story.</h1>
        <p className="muted">The telemetry dashboard is ready for the game connector. It will turn supported ATS/ETS2 data into trips, mileage, speed, fuel, distance, and fleet statistics.</p>
        <span className="status-pill"><i className="status-dot" /> Connector ready for integration</span>
        <div className="metric-grid"><div className="metric"><small>STATUS</small><strong>READY</strong><span>Awaiting driver connection</span></div><div className="metric"><small>PLATFORM</small><strong>ATS / ETS2</strong><span>Telemetry compatible</span></div><div className="metric"><small>TRIP DATA</small><strong>LIVE</strong><span>When connected</span></div><div className="metric"><small>FLEET SYNC</small><strong>ON</strong><span>Future VTC integration</span></div></div>
        <div className="panel"><h2>Telemetry connection</h2><div className="row"><strong>Local endpoint</strong><span>127.0.0.1:25555/api/ets2/telemetry</span></div><div className="row"><strong>Data pipeline</strong><span>Game → Connector → BC TRUCK WORKS</span></div><div className="row"><strong>Dashboard</strong><span>Driver + Fleet statistics</span></div></div>
      </section>
      <footer className="footer-bar">Telemetry UI foundation • Live connector/API integration is the next backend phase.</footer>
    </main>
  );
}