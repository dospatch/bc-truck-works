"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const nav = [
  ["DRIVE", [["▶", "Drive", "/dashboard"], ["✦", "Co-Driver", "/copilot"], ["➤", "Navigation", "/navigation"], ["▣", "Truck Health", "/truck-health"], ["⚙", "Under the Hood", "/truck-health"], ["⇅", "Shift Coach", "/copilot"]]],
  ["WORK", [["▰", "Dispatch & BOL", "/dispatch"], ["▤", "Trip History", "/trips"], ["▥", "Earnings & Stats", "/earnings"], ["▧", "Journal", "/journal"], ["▦", "Company", "/fleet"], ["★", "Career", "/career"]]],
  ["CONVOY", [["◉", "Convoy Hub", "/convoy"], ["⊙", "Convoy", "/convoy"], ["🏆", "Leaderboard", "/leaderboard"], ["♦", "Convoy Radar", "/convoy"], ["⚑", "Convoy Sessions", "/events"], ["✓", "Convoy Pre-Flight", "/events"], ["✦", "Convoy Intelligence", "/copilot"], ["⌘", "Command Center", "/dashboard"]]],
  ["STREAM", [["▣", "Stream Studio", "/stream"], ["▤", "Mixer & OBS", "/stream"]]],
  ["SETUP", [["⚠", "Alerts & Discord", "/support"], ["▤", "Dashboard Studio", "/settings"], ["◆", "Mods", "/mods"], ["⚙", "Settings", "/settings"], ["✦", "Suggestions", "/support"]]],
];

const metrics = [
  ["SPEED", "—", "mph"], ["FUEL", "—", "game data needed"], ["TO DESTINATION", "—", "miles"], ["NEXT REST", "—", "game data needed"], ["DEADLINE", "—", "not available"], ["ECO SCORE", "—", "awaiting trip data"], ["ALERTS", "—", "live status unavailable"]
];

function Tile({label, value, unit, tone}) {
  return <div className={"btw-metric "+(tone || "")}><small>{label}</small><strong>{value}</strong><span>{unit}</span></div>;
}

export default function Home() {
  const [health, setHealth] = useState("CHECKING");
  const [healthDetail, setHealthDetail] = useState("Checking website API…");
  const [now, setNow] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/health", { cache: "no-store" }).then(async r => {
      const data = await r.json();
      if (active) {
        setHealth(r.ok && data.ok ? "ONLINE" : "CHECK");
        setHealthDetail(r.ok && data.ok ? "Website API reachable" : "API needs attention");
      }
    }).catch(() => { if (active) { setHealth("OFFLINE"); setHealthDetail("Website API not reachable"); } });
    const update = () => setNow(new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit", second:"2-digit"}));
    update();
    const timer = setInterval(update, 1000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  return <main className="btw-console">
    <aside className="btw-sidebar">
      <Link className="btw-console-logo" href="/"><img src="/bc-truck-works-logo.png" alt="BC TRUCK WORKS logo"/><strong>BC TRUCK<br/><span>WORKS</span></strong><small>DRIVER COMPANION</small></Link>
      <div className="btw-sidebar-scroll">{nav.map(([group, items]) => <section className="btw-nav-group" key={group}><h2>{group}</h2>{items.map(([icon,label,href],i) => <Link className={(group==="DRIVE"&&i===0?"active ":"")+"btw-side-link"} href={href} key={label}><span>{icon}</span>{label}</Link>)}</section>)}</div>
      <div className="btw-side-status"><i className={health==="ONLINE"?"ok":""}/><span>WEBSITE API <b>{health}</b><small>{healthDetail}</small></span></div>
    </aside>
    <section className="btw-console-main">
      <header className="btw-console-header"><div className="btw-title-wrap"><img src="/bc-truck-works-logo.png" alt=""/><div><h1>BC TRUCK WORKS <span>•</span> LIVE COMPANION</h1><p>ATS / ETS2 DRIVER CONSOLE</p></div></div><div className="btw-header-status"><i className={health==="ONLINE"?"ok":""}/><span>{health==="ONLINE"?"API ONLINE":"CONNECTOR NOT VERIFIED"}</span><b> {now}</b><Link href="/settings" aria-label="Settings">⚙</Link></div></header>
      <div className="btw-content">
        <div className="btw-metrics-row">{metrics.map(([label,value,unit])=><Tile key={label} label={label} value={value} unit={unit} tone={label==="ALERTS"?"warning":""}/>)}</div>
        <div className="btw-alert-row"><div className="btw-alert neutral"><b>i</b><span><strong>Telemetry setup</strong><small>Start the Windows connector and ATS/ETS2 telemetry plugin to receive live truck data.</small></span><em>SETUP</em></div><div className="btw-alert neutral"><b>↗</b><span><strong>Driver account</strong><small>Sign in to your Driver Hub and confirm your driver profile before sending telemetry.</small></span><Link href="/dashboard">OPEN</Link></div></div>
        <div className="btw-panels-top">
          <section className="btw-console-panel btw-smart"><header><h2><i/> SMART SHIFT</h2><Link href="/copilot">Details ↗</Link></header><p>Waiting for gearbox data from your truck. Connect ATS or ETS2 telemetry to show shift guidance here.</p><div className="btw-panel-footer">LIVE DATA ONLY <span>NO GEARBOX DATA YET</span></div></section>
          <section className="btw-console-panel"><header><h2><i/> FUEL & REST PLAN</h2><Link href="/dispatch">Plan ↗</Link></header><div className="btw-empty-plan"><b>Fuel plan waiting</b><span>Fuel estimates appear when live telemetry and a trip are available.</span></div><div className="btw-empty-plan"><b>Rest plan waiting</b><span>Rest recommendations require current trip and fatigue data.</span></div></section>
        </div>
        <div className="btw-status-row"><div className="btw-big-status"><strong>{health==="ONLINE"?"WEBSITE API ONLINE":"CONNECTOR NOT CONNECTED"}</strong><small>{healthDetail}. This does not yet confirm an in-game telemetry stream.</small></div><div className="btw-info-card"><small>TRUCK</small><strong>Waiting for game</strong><span>ATS / ETS2</span></div><div className="btw-info-card"><small>ACTIVE ROUTE</small><strong>No active trip</strong><span>Start a delivery in game</span></div><div className="btw-info-card"><small>TRIP LOGGER</small><strong className="amber">STANDBY</strong><span>Waiting for real telemetry</span></div></div>
        <div className="btw-truck-stats"><section className="btw-truck-card"><small>TRUCK PROFILE</small><h2>Your truck</h2><div className="btw-truck-placeholder"><span>🚛</span><b>No truck data received</b><small>Truck model appears when connected.</small></div><Link href="/profile">Manage driver profile ↗</Link></section><Tile label="SPEED" value="—" unit="MPH"/><Tile label="ENGINE RPM" value="—" unit="RPM"/><Tile label="FUEL" value="—" unit="GALLONS"/><Tile label="GEAR" value="—" unit="CURRENT"/></div>
        <div className="btw-bottom-grid"><section className="btw-console-panel btw-trip"><header><h2><i/> RECENT TRIP</h2><Link href="/trips">Trip history ↗</Link></header><div className="btw-trip-empty"><span>▤</span><strong>No trip recorded yet</strong><p>Your real cargo, route, miles, fuel used, speed, and income will appear here when trip data is available.</p><Link href="/dispatch">Open dispatch board →</Link></div></section><section className="btw-console-panel btw-quick"><header><h2><i/> QUICK SYSTEMS</h2><span>GAME INPUT DISABLED</span></header><div className="btw-quick-grid">{[["P","Parking brake"],["☼","Low beam"],["☀","High beam"],["◀","Left signal"],["▶","Right signal"],["◀▶","Hazards"],["✦","Beacon"],["●●","Brake lights"]].map(([symbol,name])=><div className="btw-quick-item" key={name}><strong>{symbol}</strong><small>{name}</small><b>NO DATA</b></div>)}</div><p>Controls display status only. Game inputs remain disabled until explicitly configured.</p></section></div>
        <footer className="btw-console-footer">BC TRUCK WORKS • ATS / ETS2 COMPANION • <Link href="/support">SUPPORT</Link> • <Link href="/settings">SETTINGS</Link> • {now}</footer>
      </div>
    </section>
  </main>;
}
