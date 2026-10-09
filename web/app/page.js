import Link from "next/link";

const tools = [
  {
    title: "Dispatch Starter",
    label: "AVAILABLE NOW",
    text: "Create loads, track planned and active jobs, mark deliveries, and record estimated miles and pay. Jobs are saved in this browser on this device.",
    href: "/dispatch",
    action: "Open Dispatch",
  },
  {
    title: "Telemetry",
    label: "CONNECTION CHECK",
    text: "Check whether the BC TRUCK WORKS API is receiving ATS or ETS2 data from your Windows connector.",
    href: "/telemetry",
    action: "Check Connection",
  },
  {
    title: "Driver Hub",
    label: "ACCOUNT ACCESS",
    text: "Open the driver account area. Sign-in and account data require the connected backend to be configured.",
    href: "/dashboard",
    action: "Open Driver Hub",
  },
  {
    title: "Setup & Support",
    label: "HELP",
    text: "Find the connector setup steps and report a problem if something is not working.",
    href: "/support",
    action: "Get Help",
  },
];

export default function Home() {
  return (
    <main className="platform">
      <nav className="platform-nav">
        <Link className="platform-brand" href="/">
          <img src="/bc-truck-works-logo.png" alt="BC TRUCK WORKS logo" />
          BC TRUCK WORKS
        </Link>
        <div className="platform-links">
          <Link href="/dispatch">Dispatch</Link>
          <Link href="/telemetry">Telemetry</Link>
          <Link href="/support">Support</Link>
        </div>
        <Link className="back" href="/dashboard">Driver Hub →</Link>
      </nav>

      <section className="dashboard">
        <span className="eyebrow">ATS / ETS2 COMPANION</span>
        <h1>Your trucking tools, without the clutter.</h1>
        <p className="muted">
          BC TRUCK WORKS is being built in stages. Use the working starter tools below.
          Live game data appears only after the Windows connector and backend are configured.
        </p>

        <div className="panel" style={{ marginTop: "1.5rem" }}>
          <span className="eyebrow">CURRENT STATUS</span>
          <h2>Telemetry is not guaranteed to be connected</h2>
          <p className="muted">
            Open Telemetry to check the latest data received by the API. A website page by itself
            cannot read ATS or ETS2 running on your PC.
          </p>
          <Link className="primary" href="/telemetry">Check telemetry connection →</Link>
        </div>

        <div className="feature-grid" style={{ marginTop: "1.5rem" }}>
          {tools.map((tool) => (
            <article className="feature" key={tool.title}>
              <span className="eyebrow">{tool.label}</span>
              <h2>{tool.title}</h2>
              <p>{tool.text}</p>
              <Link className="learn" href={tool.href}>
                {tool.action} <b>→</b>
              </Link>
            </article>
          ))}
        </div>

        <div className="panel" style={{ marginTop: "1.5rem" }}>
          <span className="eyebrow">WHAT WE'RE KEEPING</span>
          <h2>Simple first. Connected next.</h2>
          <p className="muted">
            The Dispatch Starter works locally in your browser. Telemetry checks the API.
            Advanced features such as live AI co-driver controls, convoy radar, stream mixer,
            leaderboard, and fleet statistics will stay off the main screen until they are connected
            to real data and their controls work.
          </p>
        </div>
      </section>

      <footer className="footer-bar">
        BC TRUCK WORKS · ATS / ETS2 companion · Independent community project, not affiliated with SCS Software.
      </footer>
    </main>
  );
}
