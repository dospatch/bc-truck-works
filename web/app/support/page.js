export const metadata = {
  title: "Support | BC TRUCK WORKS",
  description: "BC TRUCK WORKS support center for Driver Hub, telemetry, connector, ATS, ETS2, and community help.",
};

const supportItems = [
  {
    icon: "🖥️",
    title: "Driver Hub",
    text: "Get help with Discord login, your driver profile, miles, trips, fleets, and dashboard access.",
    href: "/dashboard",
    action: "Open Driver Hub",
  },
  {
    icon: "📡",
    title: "Telemetry",
    text: "Troubleshoot live telemetry, ATS/ETS2 connections, mileage updates, and driver data.",
    href: "/telemetry",
    action: "Open Telemetry",
  },
  {
    icon: "🚛",
    title: "Windows Connector",
    text: "Get setup help for the BC TRUCK WORKS Connector running on your gaming PC.",
    href: "/support#connector",
    action: "Connector Help",
  },
  {
    icon: "📚",
    title: "Documentation",
    text: "Find setup information for the connector, installer, ATS, ETS2, and platform features.",
    href: "https://github.com/dospatch/bc-truck-works/tree/main/docs",
    action: "Open Docs",
  },
];

export default function SupportPage() {
  return (
    <main>
      <nav className="nav">
        <a className="brand" href="/">
          <span className="brand-mark">BC</span>
          <span>TRUCK WORKS</span>
        </a>

        <div className="nav-links">
          <a href="/fleet">Fleet</a>
          <a href="/telemetry">Telemetry</a>
          <a href="/events">Events</a>
          <a href="/support">Support</a>
        </div>

        <a className="nav-button" href="/api/auth/discord">
          🔐 Login
        </a>
      </nav>

      <section className="section" style={{ paddingTop: "7rem" }}>
        <div className="section-heading">
          <span>BC TRUCK WORKS SUPPORT</span>
          <h1>How can we help?</h1>
          <p>
            Find help for your Driver Hub, telemetry, Windows Connector,
            ATS/ETS2 setup, and BC TRUCK WORKS account.
          </p>
        </div>

        <div className="feature-grid">
          {supportItems.map((item) => (
            <a className="feature" href={item.href} key={item.title}>
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="learn">
                {item.action} <b>→</b>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="telemetry" id="connector">
        <div>
          <span className="section-label">CONNECTOR SUPPORT</span>
          <h2>Get connected.</h2>
          <p>
            The BC TRUCK WORKS Connector runs on the same Windows PC as
            ATS/ETS2 and sends supported telemetry to your Driver Hub.
          </p>
          <ol>
            <li>Install and configure a supported ATS/ETS2 telemetry provider.</li>
            <li>Create your connector configuration.</li>
            <li>Start the BC TRUCK WORKS Connector.</li>
            <li>Open Telemetry and confirm your connection.</li>
          </ol>
        </div>

        <div className="terminal">
          <div className="terminal-top">
            <span />
            <span />
            <span />
            <b>SUPPORT CHECK</b>
          </div>
          <div className="terminal-body">
            <p><small>STEP 01</small><strong>GAME RUNNING</strong></p>
            <p><small>STEP 02</small><strong>TELEMETRY READY</strong></p>
            <p><small>STEP 03</small><strong>CONNECTOR ONLINE</strong></p>
            <p><small>STEP 04</small><strong>DRIVER HUB CONNECTED</strong></p>
          </div>
        </div>
      </section>

      <section className="community">
        <span className="section-label">NEED MORE HELP?</span>
        <img className="community-logo" src="/bc-truck-works-logo.png" alt="BC TRUCK WORKS" />
        <h2>We can help you get back on the road.</h2>
        <p>
          If something is not working, provide the game, connector status,
          and what you were trying to do so the issue can be diagnosed faster.
        </p>
        <div className="actions">
          <a className="primary" href="https://github.com/dospatch/bc-truck-works/issues/new">
            Report an Issue <span>→</span>
          </a>
          <a className="secondary" href="/telemetry">
            Check Telemetry
          </a>
        </div>
      </section>

      <footer>
        <div>
          <strong>BC TRUCK WORKS</strong>
          <span>Serious trucking. Connected drivers.</span>
        </div>
        <span>© 2026 BC TRUCK WORKS</span>
      </footer>
    </main>
  );
}
