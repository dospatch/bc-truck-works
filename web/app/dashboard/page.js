export default function Dashboard() {
  return <main className="platform">
    <nav className="platform-nav">
      <a className="platform-brand" href="/"><img src="/bc-truck-works-logo.svg" alt="" />BC TRUCK WORKS</a>
      <div className="platform-links"><a href="/dashboard">Driver Hub</a><a href="/fleet">Fleet</a><a href="/events">Events</a><a href="/telemetry">Telemetry</a></div>
      <a className="back" href="/">← Website</a>
    </nav>
    <section className="dashboard">
      <span className="eyebrow">DRIVER HUB • PREVIEW</span>
      <h1>Your road starts here.</h1>
      <p className="muted">A central home for your BC TRUCK WORKS profile, trips, mileage, fleet activity, and events.</p>
      <span className="status-pill"><i className="status-dot" /> Platform online</span>
      <div className="metric-grid">
        <div className="metric"><small>TOTAL MILES</small><strong>12,840</strong><span>+420 this month</span></div>
        <div className="metric"><small>TRIPS</small><strong>86</strong><span>ATS + ETS2</span></div>
        <div className="metric"><small>DELIVERIES</small><strong>74</strong><span>Successful</span></div>
        <div className="metric"><small>DRIVER RANK</small><strong>#18</strong><span>Community leaderboard</span></div>
      </div>
      <div className="panel-grid">
        <div className="panel"><h2>Driver activity</h2><div className="row"><strong>Latest trip</strong><span>Seattle → Portland • ATS</span></div><div className="row"><strong>Last telemetry</strong><span>Connected • 42 min ago</span></div><div className="row"><strong>Current fleet</strong><span>BC Logistics • Active</span></div><div className="row"><strong>Next event</strong><span>Community Convoy • Saturday</span></div></div>
        <div className="panel"><h2>Quick access</h2><div className="action-grid"><a className="action" href="/fleet"><b>🚛 Fleet</b><span>Manage VTC & trucks</span></a><a className="action" href="/events"><b>🛣️ Events</b><span>View upcoming drives</span></a><a className="action" href="/telemetry"><b>📡 Telemetry</b><span>Review driving data</span></a><a className="action" href="/"><b>⚙️ Profile</b><span>Coming with login</span></a></div></div>
      </div>
    </section>
    <footer className="footer-bar">BC TRUCK WORKS • Driver platform foundation • Authentication and live game data are next.</footer>
  </main>
}