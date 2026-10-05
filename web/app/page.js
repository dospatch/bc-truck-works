const features = [
  { icon: "🚛", title: "American Truck Simulator", text: "Build your fleet, log miles, and stay connected with the BC TRUCK WORKS community." },
  { icon: "🌍", title: "Euro Truck Simulator 2", text: "Bring the same connected trucking experience to the roads of Europe." },
  { icon: "📡", title: "Live Telemetry", text: "Connect supported telemetry data for richer driving stats and fleet tracking." },
  { icon: "🛣️", title: "Convoys & Events", text: "Join organized drives, community events, and future BC TRUCK WORKS convoys." },
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top"><span className="brand-mark">BC</span><span>TRUCK WORKS</span></a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#telemetry">Telemetry</a>
          <a href="#community">Community</a>
        </div>
        <a className="nav-button" href="#community">Get Started</a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="badge"><span className="dot" /> ATS • ETS2 • COMMUNITY</div>
          <h1>Drive farther.<br /><em>Connect smarter.</em></h1>
          <p className="hero-text">BC TRUCK WORKS is a growing trucking platform built for drivers who want a connected, organized, and serious virtual trucking experience.</p>
          <div className="actions">
            <a className="primary" href="#features">Explore BC TRUCK WORKS <span>→</span></a>
            <a className="secondary" href="#telemetry">View Telemetry</a>
          </div>
          <div className="stats">
            <div><strong>ATS</strong><span>American Truck Simulator</span></div>
            <div><strong>ETS2</strong><span>Euro Truck Simulator 2</span></div>
            <div><strong>24/7</strong><span>Community focused</span></div>
          </div>
        </div>
        <div className="hero-card">
          <div className="road-glow" />
          <div className="truck-icon">🚛</div>
          <div className="route"><span>BC TRUCK WORKS</span><strong>ROAD • FLEET • COMMUNITY</strong></div>
          <div className="route-line"><i /><i /><i /><i /></div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-heading"><span>WHAT WE DO</span><h2>Everything you need<br />to stay on the road.</h2></div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <span className="learn">Explore <b>→</b></span>
            </article>
          ))}
        </div>
      </section>

      <section className="telemetry" id="telemetry">
        <div>
          <span className="section-label">TELEMETRY READY</span>
          <h2>Turn your drive<br />into data.</h2>
          <p>BC TRUCK WORKS is designed around connected driving. Telemetry support can power mileage, trip, fleet, and event experiences as the platform grows.</p>
        </div>
        <div className="terminal">
          <div className="terminal-top"><span /><span /><span /><b>BC TELEMETRY</b></div>
          <div className="terminal-body">
            <p><small>STATUS</small><strong>● READY</strong></p>
            <p><small>PLATFORM</small><strong>ATS / ETS2</strong></p>
            <p><small>MODE</small><strong>CONNECTED</strong></p>
            <p><small>DRIVER</small><strong>BC TRUCKER</strong></p>
          </div>
        </div>
      </section>

      <section className="community" id="community">
        <span className="section-label">THE NEXT MILE</span>
        <h2>Ready to roll?</h2>
        <p>BC TRUCK WORKS is being built for drivers, fleets, convoys, and the trucking community.</p>
        <a className="primary" href="https://discord.com" target="_blank" rel="noreferrer">Join the Community <span>→</span></a>
      </section>

      <footer><div><strong>BC TRUCK WORKS</strong><span>Serious trucking. Connected drivers.</span></div><span>© 2026 BC TRUCK WORKS</span></footer>
    </main>
  );
}