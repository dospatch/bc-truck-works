"use client";
import {useEffect,useState} from "react";

export default function Profile(){
  const [data,setData]=useState(null);
  useEffect(()=>{fetch("/api/driver").then(r=>r.ok?r.json():null).then(setData).catch(()=>{});},[]);
  const d=data?.driver;
  if(!d)return <main className="platform"><nav className="platform-nav"><a className="platform-brand" href="/"><img src="/bc-truck-works-logo.svg" alt=""/>BC TRUCK WORKS</a><a className="back" href="/dashboard">← Driver Hub</a></nav><section className="dashboard"><span className="eyebrow">DRIVER PROFILE</span><h1>Sign in to view your profile.</h1><p className="muted">Connect your Discord account to view your BC TRUCK WORKS driver record.</p><a className="primary" href="/api/auth/discord">🔐 Login with Discord →</a></section></main>;
  return <main className="platform">
    <nav className="platform-nav">
      <a className="platform-brand" href="/"><img src="/bc-truck-works-logo.svg" alt=""/>BC TRUCK WORKS</a>
      <div className="platform-links"><a href="/dashboard">Driver Hub</a><a href="/profile">Profile</a><a href="/fleet">Fleet</a><a href="/events">Events</a><a href="/telemetry">Telemetry</a></div>
      <a className="back" href="/dashboard">← Dashboard</a>
    </nav>
    <section className="dashboard">
      <span className="eyebrow">DRIVER PROFILE • {d.role==="owner"?"OWNER":"DRIVER"}</span>
      <h1>{d.display_name}</h1>
      <p className="muted">Your connected BC TRUCK WORKS identity and driving record.</p>
      <div className="metric-grid">
        <div className="metric"><small>GAME</small><strong>{d.game||"ATS"}</strong><span>Primary platform</span></div>
        <div className="metric"><small>TOTAL MILES</small><strong>{Number(d.total_miles||0).toLocaleString(undefined,{maximumFractionDigits:1})}</strong><span>Tracked mileage</span></div>
        <div className="metric"><small>TRIPS</small><strong>{d.trips||0}</strong><span>Recorded trips</span></div>
        <div className="metric"><small>DELIVERIES</small><strong>{d.deliveries||0}</strong><span>Completed records</span></div>
      </div>
      <div className="panel-grid">
        <div className="panel"><span className="eyebrow">ACCOUNT</span><h2>Driver information</h2><div className="row"><strong>Discord</strong><span>{d.display_name}</span></div><div className="row"><strong>Account role</strong><span>{d.role==="owner"?"Owner":"Driver"}</span></div><div className="row"><strong>Rank</strong><span>{d.rank?("#"+d.rank):"Not ranked yet"}</span></div><div className="row"><strong>Member since</strong><span>{d.created_at?new Date(d.created_at).toLocaleDateString():"—"}</span></div></div>
        <div className="panel"><span className="eyebrow">LIVE CONNECTION</span><h2>Telemetry</h2><div className="row"><strong>Game</strong><span>{data.latestTelemetry?.game||d.game||"Waiting"}</span></div><div className="row"><strong>Speed</strong><span>{data.latestTelemetry?.speed!=null?Number(data.latestTelemetry.speed).toFixed(0)+" km/h":"Waiting"}</span></div><div className="row"><strong>Odometer</strong><span>{data.latestTelemetry?.odometer!=null?Number(data.latestTelemetry.odometer).toFixed(1):"Waiting"}</span></div><div className="row"><strong>Status</strong><span>{data.latestTelemetry?"● Connected":"○ Waiting"}</span></div></div>
      </div>
    </section>
    <footer className="footer-bar">BC TRUCK WORKS • Driver Profile</footer>
  </main>;
}