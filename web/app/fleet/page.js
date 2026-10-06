export default function Fleet() {
  return (
    <main className="platform">
      <nav className="platform-nav">
        <a className="platform-brand" href="/"><img src="/bc-truck-works-logo.png" alt="" />BC TRUCK WORKS</a>
        <div className="platform-links">
          <a href="/dashboard">Driver Hub</a><a href="/fleet">Fleet</a><a href="/events">Events</a><a href="/telemetry">Telemetry</a>
        </div>
        <a className="back" href="/dashboard">← Dashboard</a>
      </nav>
      <section className="dashboard">
        <span className="eyebrow">FLEET / VTC</span>
        <h1>Built for your fleet.</h1>
        <p className="muted">A future-ready VTC workspace for drivers, trucks, routes, and company operations.</p>
        <div className="hero-panel">
          <div className="big-card">
            <img src="/bc-truck-works-logo.png" alt="" />
            <h2>BC Logistics</h2>
            <p className="muted">Community fleet • North America</p>
            <span className="tag">ACTIVE</span>
            <div className="progress"><i /></div>
          </div>
          <div className="panel">
            <h2>Fleet overview</h2>
            <div className="row"><strong>Drivers</strong><span>24</span></div>
            <div className="row"><strong>Trucks</strong><span>31</span></div>
            <div className="row"><strong>Deliveries</strong><span>486</span></div>
            <div className="row"><strong>Fleet miles</strong><span>184,920</span></div>
          </div>
        </div>
      </section>
      <footer className="footer-bar">Fleet management UI foundation • Driver authentication and live VTC records will connect next.</footer>
    </main>
  );
}
