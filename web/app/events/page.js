import Link from "next/link";

export default function Events() {
  return (
    <main className="platform">
      <nav className="platform-nav">
        <Link className="platform-brand" href="/"><img src="/bc-truck-works-logo.png" alt="BC TRUCK WORKS logo" />BC TRUCK WORKS</Link>
        <div className="platform-links"><Link href="/dispatch">Dispatch</Link><Link href="/telemetry">Telemetry</Link><Link href="/support">Support</Link></div>
        <Link className="back" href="/">← Home</Link>
      </nav>
      <section className="dashboard">
        <span className="eyebrow">COMMUNITY</span>
        <h1>Convoys and events</h1>
        <p className="muted">The event calendar and attendance tracking are not connected yet. We removed the sample dates so you won't mistake demo information for real events.</p>
        <div className="panel">
          <h2>Join the BC TRUCK WORKS community</h2>
          <p className="muted">Check the Discord for current convoy announcements, event times, and community updates.</p>
          <a className="primary" href="https://discord.gg/YFE7tFGEsh" target="_blank" rel="noreferrer">Open BC TRUCK WORKS Discord →</a>
        </div>
      </section>
      <footer className="footer-bar">BC TRUCK WORKS · Community events will be listed here when event scheduling is connected.</footer>
    </main>
  );
}
