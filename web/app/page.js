import Link from "next/link";

const groups=[
["DRIVE",[["▶","Drive","/"],["◈","ETS2","/telemetry"],["🎙","Co-Driver","/dashboard"],["➤","Navigation","/dashboard"],["▣","Truck Health","/telemetry"],["⇅","Shift Coach","/dashboard"]]],
["WORK",[["⛟","Dispatch & BOL","/events"],["▤","Trip History","/dashboard"],["▥","Earnings & Stats","/dashboard"],["📷","Driver Journal","/profile"],["🏢","Company / VTC","/fleet"],["★","Career","/profile"]]],
["CONVOY",[["◉","Convoy Hub","/events"],["◎","Convoy","/events"],["🏆","Leaderboard","/dashboard"],["⌖","Convoy Radar","/telemetry"],["⚑","Sessions","/events"],["✔","Pre-Flight","/dashboard"],["✦","Intelligence","/dashboard"],["⌘","Command Center","/dashboard"]]],
["STREAM",[["🎥","Stream Studio","/dashboard"],["🎚","Mixer & OBS","/dashboard"]]],
["SETUP",[["⚠","Alerts & Discord","/support"],["▦","Dashboard Studio","/dashboard"],["◆","Mods","/dashboard"],["⚙","Settings","/profile"],["💡","Suggestions","/support"]]]
];

export default function Home(){
 return <div className="companion">
  <aside className="companion-sidebar">
   <Link href="/" className="companion-brand"><img className="companion-brand-logo" src="/bc-truck-works-logo.png" alt="BC TRUCK WORKS logo"/><div><strong>BC TRUCK WORKS</strong><small>ATS / ETS2 COMPANION</small></div></Link>
   <div className="version">LIVE COMPANION v2.1.0</div>
   <nav className="companion-nav">{groups.map(([title,items])=><div className="nav-section" key={title}><div className="nav-heading">{title}</div>{items.map(([icon,label,href])=><Link key={label} href={href} className={"companion-link "+(label==="Drive"?"active":"")}><span>{icon}</span>{label}</Link>)}</div>)}</nav>
   <div className="sidebar-game"><div className="mini-label">SIMULATORS</div><strong>🇺🇸 ATS</strong><strong>🇪🇺 ETS2</strong><span className="live-dot">● READY FOR TELEMETRY</span></div>
  </aside>
  <main className="companion-main">
   <header className="companion-header"><div><div className="crumb">BC TRUCK WORKS / ATS</div><h1>American Truck Simulator</h1></div><div className="connection live">● Companion ONLINE</div></header>
   <div className="companion-content tracker-page">
    <div className="tracker-topline"><div className="offline-status">● WAITING FOR TELEMETRY</div><div className="top-actions"><button className="small-action">🔊 AI Voice ON</button><button className="small-action">Pause Telemetry</button></div></div>
    <div className="telemetry-warning"><strong>TRUCK NOT CONNECTED</strong><span>Start ATS with your SCS telemetry plugin. The tracker will automatically begin receiving vehicle data.</span></div>
    <section className="tracker-hero"><div><div className="eyebrow">BC TRUCK WORKS • AMERICAN TRUCK SIMULATOR</div><h2>DRIVER COMMAND CENTER</h2><p>One dashboard for driving, jobs, miles, convoys and your AI co-driver.</p></div><div className="tracker-hero-actions"><button className="hero-action">▶ Start Trip</button><Link href="/events" className="hero-action secondary">◎ Convoy Hub</Link></div></section>
    <section className="tracker-kpis"><article className="kpi kpi-main"><span>TRIP MILES</span><strong>0.0</strong><small>Start a trip to track miles</small></article><article className="kpi"><span>SPEED</span><strong>0</strong><small>MPH • Current</small></article><article className="kpi"><span>ODOMETER</span><strong>0</strong><small>Vehicle miles</small></article><article className="kpi"><span>FUEL</span><strong>0.0</strong><small>Gallons</small></article><article className="kpi"><span>TRIP TIME</span><strong>00:00:00</strong><small>Not recording</small></article><article className="kpi"><span>TO GO</span><strong>0</strong><small>Estimated miles</small></article></section>
    <div className="tracker-layout"><div className="tracker-main">
     <section className="panel tracker-card"><div className="panel-header"><div><div className="eyebrow">AI CO-DRIVER</div><h3>BC Driver Intelligence</h3></div><span className="clear-pill">VOICE ACTIVE</span></div><div className="ai-driver"><div className="ai-avatar">BC</div><div><strong>Co-driver online. I’ll watch your speed, fuel, trip progress and route.</strong><p>I can speak when you start driving, exceed the limit, lose telemetry, change destinations, finish a trip, or need a reminder.</p></div></div><div className="ai-events"><div><span>●</span>Waiting for your first driving event.</div></div></section>
     <section className="panel tracker-card"><div className="panel-header"><div><div className="eyebrow">ACTIVE DELIVERY</div><h3>No active cargo</h3></div><span className="muted">READY</span></div><div className="route-big"><div><small>FROM</small><strong>—</strong></div><b>→</b><div><small>TO</small><strong>—</strong></div></div><div className="delivery-grid"><div><span>REMAINING</span><b>0.0 mi</b></div><div><span>PAY</span><b>$0</b></div><div><span>GEAR</span><b>N</b></div><div><span>RPM</span><b>0</b></div></div></section>
     <section className="panel tracker-card"><div className="panel-header"><div><div className="eyebrow">TRIP PERFORMANCE</div><h3>Driver Statistics</h3></div><span className="muted">LIVE</span></div><div className="performance-grid"><div><span>MILES DRIVEN</span><strong>0.0 mi</strong></div><div><span>FUEL USED</span><strong>0.0</strong></div><div><span>MAX SPEED</span><strong>0 MPH</strong></div><div><span>SPEEDING</span><strong>CLEAR</strong></div></div></section>
    </div><aside className="tracker-side">
     <section className="panel tracker-card"><div className="eyebrow">DRIVER STATUS</div><div className="status-list"><div><span>Telemetry</span><b className="bad">OFFLINE</b></div><div><span>Engine</span><b>OFF</b></div><div><span>Parking Brake</span><b>OFF</b></div><div><span>Speed Limit</span><b>0 MPH</b></div><div><span>Damage</span><b>0.0%</b></div></div></section>
     <section className="panel tracker-card"><div className="panel-header"><div className="eyebrow">CONVOYS</div><Link href="/events" className="panel-link">Open →</Link></div><div className="convoy-preview"><div className="convoy-icon">◎</div><div><strong>Convoy Center</strong><p>Drivers, sessions, radar and pre-flight.</p></div></div><Link href="/events" className="panel-button secondary full-button">Open Convoy Hub</Link></section>
     <section className="panel tracker-card"><div className="panel-header"><div className="eyebrow">AI CONTROLS</div><button className="panel-link">Hide</button></div><div className="ai-controls"><button>💬 Driver check-in</button><button>🧭 Route update</button><button>🚛 Speed report</button></div></section>
    </aside></div>
    <section className="panel tracker-card"><div className="panel-header"><div><div className="eyebrow">RECENT TRIPS</div><h3>Trip History</h3></div><Link href="/dashboard" className="panel-link">Full history →</Link></div><p className="muted history-empty">No saved trips yet. Start your first trip and BC TRUCK WORKS will keep the record in your browser.</p></section>
   </div>
  </main>
 </div>;
}