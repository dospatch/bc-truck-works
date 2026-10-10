import Link from "next/link";

const destinations = [
  { icon: "🧭", title: "Driver Hub", description: "Your home base for your driver profile, account tools, and connected driving.", href: "/dashboard", action: "Open Driver Hub" },
  { icon: "📡", title: "Live Telemetry", description: "Check the connection between your game, Windows connector, and the website.", href: "/telemetry", action: "Check telemetry" },
  { icon: "📦", title: "Dispatch Board", description: "Plan loads, track job progress, and keep a record of your deliveries.", href: "/dispatch", action: "Open dispatch" },
  { icon: "🚛", title: "Fleet", description: "Explore the fleet area and the tools being built for virtual trucking teams.", href: "/fleet", action: "View fleet" },
  { icon: "📅", title: "Community Events", description: "Find the events area for community drives and future convoy activities.", href: "/events", action: "View events" },
  { icon: "📱", title: "Mobile Hub", description: "Open the mobile-friendly companion experience from your phone.", href: "/mobile", action: "Open mobile hub" },
];

const steps = [
  { number: "01", title: "Open your Driver Hub", text: "Visit the dashboard and set up your driver profile." },
  { number: "02", title: "Install the connector", text: "Use the Windows connector with the ATS or ETS2 telemetry plugin." },
  { number: "03", title: "Start your drive", text: "Launch your game and check the Telemetry page for incoming data." },
];

export default function Home() {
  return (
    <main className="btw-home">
      <header className="btw-header">
        <Link className="btw-brand" href="/" aria-label="BC TRUCK WORKS home">
          <img src="/bc-truck-works-logo.png" alt="" />
          <span>BC <b>TRUCK WORKS</b><small>ATS / ETS2 COMPANION</small></span>
        </Link>
        <nav className="btw-nav" aria-label="Main navigation">
          <Link href="/dashboard">Driver Hub</Link>
          <Link href="/dispatch">Dispatch</Link>
          <Link href="/telemetry">Telemetry</Link>
          <Link href="/support">Support</Link>
        </nav>
        <Link className="btw-header-cta" href="/dashboard">Open Driver Hub <span>↗</span></Link>
      </header>

      <section className="btw-hero">
        <div className="btw-hero-copy">
          <div className="btw-kicker"><span className="btw-kicker-dot" /> BUILT FOR THE LONG HAUL</div>
          <h1>Your drive.<br />Your fleet.<br /><em>Your road.</em></h1>
          <p className="btw-hero-lead">One home for your American Truck Simulator and Euro Truck Simulator 2 journey. Track your work, manage your driver tools, and connect your drive when your setup is ready.</p>
          <div className="btw-hero-actions">
            <Link className="btw-button btw-button-primary" href="/dashboard">Enter Driver Hub <span>→</span></Link>
            <Link className="btw-button btw-button-ghost" href="/telemetry">Check game connection</Link>
          </div>
          <p className="btw-hero-note">Independent community project · Not affiliated with SCS Software</p>
        </div>
        <div className="btw-hero-art" aria-label="BC TRUCK WORKS platform overview">
          <div className="btw-art-glow" />
          <div className="btw-route-line" />
          <div className="btw-art-label"><span className="btw-live-dot" /> DRIVER PLATFORM <b>01 / 06</b></div>
          <div className="btw-truck-symbol">🚛</div>
          <div className="btw-art-bottom">
            <span>AMERICAN TRUCK SIMULATOR</span>
            <strong>KEEP MOVING FORWARD.</strong>
            <span>EURO TRUCK SIMULATOR 2</span>
          </div>
          <div className="btw-coordinate">BC / TW — ON THE ROAD</div>
        </div>
      </section>

      <section className="btw-trust-strip" aria-label="Platform highlights">
        <div><span>01</span><p><b>DRIVER TOOLS</b><small>One place to start</small></p></div>
        <div><span>02</span><p><b>GAME TELEMETRY</b><small>Connector-based setup</small></p></div>
        <div><span>03</span><p><b>FLEET & DISPATCH</b><small>Built for the journey</small></p></div>
        <div><span>04</span><p><b>COMMUNITY FIRST</b><small>Made for our drivers</small></p></div>
      </section>

      <section className="btw-section btw-tools" id="tools">
        <div className="btw-section-heading">
          <div><div className="btw-section-kicker">THE DRIVER TOOLBOX</div><h2>Everything starts <em>here.</em></h2></div>
          <p>Choose a tool to jump straight into the part of the platform you need.</p>
        </div>
        <div className="btw-tools-grid">
          {destinations.map((item, index) => (
            <article className="btw-tool-card" key={item.title}>
              <div className="btw-tool-card-top"><span className="btw-tool-icon">{item.icon}</span><span className="btw-tool-index">0{index + 1}</span></div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href={item.href}>{item.action} <span>↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="btw-connection">
        <div className="btw-connection-copy">
          <div className="btw-section-kicker">FROM GAME TO DASHBOARD</div>
          <h2>Your miles.<br /><em>Your story.</em></h2>
          <p>Live game data requires more than a webpage. The game telemetry plugin, Windows connector, API configuration, and driver account all need to be set up correctly.</p>
          <Link className="btw-text-link" href="/support">Read the setup and support guide <span>→</span></Link>
        </div>
        <div className="btw-steps">
          {steps.map((step) => <div className="btw-step" key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><b>↗</b></div>)}
          <div className="btw-connection-foot"><span className="btw-connection-indicator" /> Connection status is verified on the Telemetry page.</div>
        </div>
      </section>

      <section className="btw-community">
        <div><div className="btw-section-kicker">ROLL WITH THE COMMUNITY</div><h2>Better roads.<br /><em>Better together.</em></h2><p>Join the BC TRUCK WORKS community for updates, support, and trucking conversations.</p></div>
        <div className="btw-community-actions">
          <a className="btw-button btw-button-primary" href="https://discord.gg/YFE7tFGEsh" target="_blank" rel="noreferrer">Join our Discord <span>↗</span></a>
          <a className="btw-button btw-button-ghost" href="https://github.com/dospatch/bc-truck-works" target="_blank" rel="noreferrer">View project on GitHub <span>↗</span></a>
        </div>
      </section>

      <footer className="btw-footer">
        <Link className="btw-brand btw-footer-brand" href="/"><img src="/bc-truck-works-logo.png" alt="" /><span>BC <b>TRUCK WORKS</b><small>DRIVE IN. MOVE FORWARD.</small></span></Link>
        <div className="btw-footer-links"><Link href="/support">Support</Link><Link href="/telemetry">Telemetry</Link><Link href="/profile">Profile</Link><Link href="/mobile">Mobile</Link></div>
        <p>© {new Date().getFullYear()} BC TRUCK WORKS. Independent community project. Not affiliated with SCS Software.</p>
      </footer>
    </main>
  );
}
