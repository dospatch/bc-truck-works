"use client";
import {useEffect,useState} from "react";

function formatDate(value){
  if(!value)return "—";
  const d=new Date(value);
  return Number.isNaN(d.getTime())?"—":d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
}

export default function Profile(){
  const [data,setData]=useState(null);
  const [form,setForm]=useState({displayName:"",game:"ATS"});
  const [saving,setSaving]=useState(false);
  const [notice,setNotice]=useState("");

  const load=async()=>{
    try{
      const r=await fetch("/api/driver",{cache:"no-store"});
      if(!r.ok){setData({error:"Sign in with Discord to view your profile."});return;}
      const j=await r.json();
      setData(j);
      setForm({displayName:j.driver?.display_name||"",game:j.driver?.game||"ATS"});
    }catch{
      setData({error:"Driver profile service is unavailable."});
    }
  };

  useEffect(()=>{load()},[]);

  const save=async(e)=>{
    e.preventDefault();
    setSaving(true);
    setNotice("");
    try{
      const r=await fetch("/api/driver",{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      });
      const j=await r.json();
      if(!r.ok){setNotice(j.error||"Unable to save your profile.");return;}
      setData(prev=>({...prev,driver:j.driver}));
      setNotice("Profile saved successfully.");
    }catch{
      setNotice("Unable to save your profile right now.");
    }finally{
      setSaving(false);
    }
  };

  if(data?.error)return <main className="platform"><section className="dashboard"><span className="eyebrow">DRIVER PROFILE</span><h1>Connect your driver account.</h1><p className="muted">{data.error}</p><a className="primary" href="/api/auth/discord">🔐 Login with Discord →</a></section></main>;

  const d=data?.driver,t=data?.latestTelemetry,trips=data?.recentTrips||[];

  return <main className="platform dashboard-shell">
    <aside className="sidebar">
      <a className="side-brand" href="/">
        <img src="/bc-truck-works-logo.png" alt="BC TRUCK WORKS" />
        <span>BC TRUCK<br/>WORKS</span>
      </a>
      <div className="side-status"><i/> DRIVER HUB</div>
      <nav>
        <a href="/dashboard"><span>⌂</span>Overview</a>
        <a className="active" href="/profile"><span>👤</span>Profile</a>
        <a href="/telemetry"><span>◉</span>Live Drive</a>
        <a href="/dashboard#miles"><span>↗</span>My Miles</a>
        <a href="/dashboard#trips"><span>▤</span>Trips</a>
        <a href="/fleet"><span>🚛</span>Fleet</a>
        <a href="/events"><span>★</span>Events</a>
      </nav>
      <a className="side-back" href="/">← Main Website</a>
    </aside>

    <section className="dashboard main-dashboard profile-page">
      <div className="dash-top">
        <div>
          <span className="eyebrow">DRIVER PROFILE • {d?.role==="owner"?"OWNER":"DRIVER"}</span>
          <h1>{d?.display_name}</h1>
          <p className="muted">Your connected identity, driving record, live connection, and recent activity.</p>
        </div>
        <a className="secondary" href="/dashboard">← Driver Hub</a>
      </div>

      <div className="metric-grid">
        <div className="metric"><small>GAME</small><strong>{d?.game||"ATS"}</strong><span>Primary platform</span></div>
        <div className="metric"><small>TOTAL MILES</small><strong>{Number(d?.total_miles||0).toLocaleString(undefined,{maximumFractionDigits:1})}</strong><span>Tracked mileage</span></div>
        <div className="metric"><small>TRIPS</small><strong>{d?.trips||0}</strong><span>Recorded trips</span></div>
        <div className="metric"><small>DELIVERIES</small><strong>{d?.deliveries||0}</strong><span>Completed records</span></div>
      </div>

      <div className="profile-grid">
        <form className="panel profile-form" onSubmit={save}>
          <span className="eyebrow">ACCOUNT SETTINGS</span>
          <h2>Driver details</h2>
          <label>Display name<input value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})} maxLength={100}/></label>
          <label>Primary game<select value={form.game} onChange={e=>setForm({...form,game:e.target.value})}><option value="ATS">American Truck Simulator</option><option value="ETS2">Euro Truck Simulator 2</option></select></label>
          <div className="profile-id"><span>Discord ID</span><strong>{d?.discord_id||"—"}</strong></div>
          <div className="profile-id"><span>Member since</span><strong>{formatDate(d?.created_at)}</strong></div>
          {notice&&<div className="profile-notice">{notice}</div>}
          <button className="primary profile-save" disabled={saving}>{saving?"Saving...":"Save Profile →"}</button>
        </form>

        <div className="panel">
          <span className="eyebrow">LIVE CONNECTION</span>
          <h2>Current drive</h2>
          <div className="row"><strong>Game</strong><span>{t?.game||d?.game||"Waiting"}</span></div>
          <div className="row"><strong>Speed</strong><span>{t?.speed!=null?Number(t.speed).toFixed(0)+" km/h":"Waiting"}</span></div>
          <div className="row"><strong>Fuel</strong><span>{t?.fuel!=null?Number(t.fuel).toFixed(1):"Waiting"}</span></div>
          <div className="row"><strong>Odometer</strong><span>{t?.odometer!=null?Number(t.odometer).toFixed(1):"Waiting"}</span></div>
          <div className="row"><strong>Status</strong><span>{t?"● Connected":"○ Waiting"}</span></div>
        </div>
      </div>

      <div className="panel profile-trips">
        <div className="profile-section-head">
          <div><span className="eyebrow">RECENT ACTIVITY</span><h2>Recent trips</h2></div>
          <a className="secondary" href="/dashboard#trips">Open Driver Hub →</a>
        </div>
        {trips.length?
          <div className="table-wrap"><table className="table"><thead><tr><th>ROUTE</th><th>GAME</th><th>MILES</th><th>FUEL</th><th>DATE</th></tr></thead><tbody>
            {trips.map(trip=><tr key={trip.id}><td>{trip.origin||"Unknown"} → {trip.destination||"Unknown"}</td><td><span className="tag">{trip.game}</span></td><td>{Number(trip.miles||0).toFixed(1)}</td><td>{Number(trip.fuel_used||0).toFixed(1)}</td><td>{formatDate(trip.completed_at||trip.created_at)}</td></tr>)}
          </tbody></table></div>
          :
          <div className="empty-state"><strong>No trips recorded yet.</strong><span>Connect the BC TRUCK WORKS connector and completed trips will appear here.</span></div>
        }
      </div>
    </section>
  </main>;
}