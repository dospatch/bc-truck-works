"use client";

import { useEffect, useState } from "react";

const actions = [
  ["pause","⏸️ Pause Game"],
  ["save","💾 Save Game"],
  ["screenshot","📸 Screenshot"],
];

export default function MobileControl() {
  const [status,setStatus] = useState("Checking...");
  const [commands,setCommands] = useState([]);
  const [message,setMessage] = useState("");

  async function refresh() {
    const r = await fetch("/api/game-commands",{cache:"no-store"});
    if (r.status === 401) { setStatus("Login required"); return; }
    const data = await r.json();
    setStatus(r.ok ? "Connected" : "Unavailable");
    setCommands(data.commands || []);
  }

  async function send(command,payload={}) {
    setMessage("Sending...");
    const r = await fetch("/api/game-commands",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({command,payload})
    });
    const data = await r.json();
    setMessage(r.ok ? "Command queued for your game." : (data.error || "Command failed."));
    refresh();
  }

  useEffect(()=>{ refresh(); const t=setInterval(refresh,3000); return()=>clearInterval(t); },[]);

  return (
    <main style={{maxWidth:720,margin:"0 auto",padding:"24px",fontFamily:"system-ui"}}>
      <a href="/dashboard">← Driver Hub</a>
      <h1>📱 BC TRUCK WORKS Mobile Control</h1>
      <p>Use your phone to send approved commands to the BC TRUCK WORKS connector running on your gaming PC.</p>
      <p><strong>Status:</strong> {status}</p>
      <div style={{display:"grid",gap:12,gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
        {actions.map(([command,label])=><button key={command} onClick={()=>send(command)} style={{padding:18,fontSize:16}}>{label}</button>)}
      </div>
      <p>{message}</p>
      <h2>Recent commands</h2>
      <ul>{commands.map(c=><li key={c.id}><strong>{c.command}</strong> — {c.status}</li>)}</ul>
    </main>
  );
}
