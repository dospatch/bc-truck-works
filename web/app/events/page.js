export default function Events() {
  const events = [
    ["BC TRUCK WORKS Community Convoy", "Saturday • 8:00 PM CT", "ATS", "Open"],
    ["European Night Run", "Next Friday • 7:00 PM CT", "ETS2", "Open"],
    ["Fleet Challenge", "October • All month", "ATS / ETS2", "Coming Soon"],
  ];

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
        <span className="eyebrow">CONVOYS / EVENTS</span>
        <h1>Get on the road.</h1>
        <p className="muted">Organized drives, fleet events, and community challenges in one place.</p>
        <div className="panel">
          <table className="table">
            <thead><tr><th>EVENT</th><th>DATE</th><th>GAME</th><th>STATUS</th></tr></thead>
            <tbody>{events.map(([name, date, game, status]) => (
              <tr key={name}><td>{name}</td><td>{date}</td><td><span className="tag">{game}</span></td><td>{status}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      <footer className="footer-bar">Events foundation • Registration, Discord announcements, and attendance tracking will connect next.</footer>
    </main>
  );
}
