"use client";

import Link from "next/link";
import { useState } from "react";

export default function CoDriverPage() {
  const [voiceOn, setVoiceOn] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("Connect ATS or ETS2 telemetry to let BC monitor your drive. Until then, this page stays in setup mode and will not claim to be receiving live vehicle data.");

  function ask() {
    const q = message.trim();
    if (!q) return;
    setReply("Your question is saved in this session. Live driving advice will be available when the BC TRUCK WORKS AI service and simulator telemetry are connected. For now, check the connector status before relying on any driving alerts.");
    setMessage("");
  }

  return <main className="platform" style={{minHeight:"100vh",background:"#070b12",color:"#eef5ff",padding:"24px",fontFamily:"Arial, sans-serif"}}>
    <div style={{maxWidth:1100,margin:"0 auto"}}>
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",borderBottom:"1px solid #203447",paddingBottom:18,marginBottom:22}}>
        <Link href="/" style={{color:"#63b4ff",fontWeight:800,textDecoration:"none"}}>← BC TRUCK WORKS</Link>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <Link href="/dashboard" style={{color:"#c7d7e8"}}>Driver Hub</Link>
          <Link href="/telemetry" style={{color:"#c7d7e8"}}>Telemetry</Link>
          <Link href="/settings" style={{color:"#c7d7e8"}}>Settings</Link>
        </div>
      </nav>
      <p style={{color:"#60b3ff",fontWeight:800,letterSpacing:".15em",fontSize:11}}>DRIVER INTELLIGENCE</p>
      <h1 style={{fontSize:"clamp(28px,5vw,44px)",margin:"8px 0"}}>BC AI Co-Driver</h1>
      <p style={{color:"#9bb0c6",maxWidth:720,lineHeight:1.7}}>Your companion for trip awareness, route updates, fuel planning, and driving reminders across American Truck Simulator and Euro Truck Simulator 2.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14,marginTop:24}}>
        <section style={{background:"#101b29",border:"1px solid #25435c",borderRadius:14,padding:18}}>
          <div style={{fontSize:11,color:"#8ca8c3",fontWeight:800}}>VOICE ASSISTANT</div>
          <h2 style={{fontSize:22,margin:"12px 0"}}>{voiceOn?"Voice preference enabled":"Voice preference off"}</h2>
          <p style={{color:"#91a7bc",fontSize:13,lineHeight:1.6}}>This toggle records your preference in this page only. It does not start audio until voice service is configured.</p>
          <button onClick={()=>setVoiceOn(v=>!v)} style={{background:voiceOn?"#173d32":"#12304a",color:"#eef5ff",border:"1px solid #31536e",padding:"10px 14px",borderRadius:8,cursor:"pointer"}}>{voiceOn?"Turn voice preference off":"Turn voice preference on"}</button>
        </section>
        <section style={{background:"#101b29",border:"1px solid #25435c",borderRadius:14,padding:18}}>
          <div style={{fontSize:11,color:"#8ca8c3",fontWeight:800}}>SIMULATOR CONNECTION</div>
          <h2 style={{fontSize:22,margin:"12px 0",color:"#f3b64b"}}>Waiting for telemetry</h2>
          <p style={{color:"#91a7bc",fontSize:13,lineHeight:1.6}}>The website can be online while the game connector is offline. Start your simulator and connector to enable live trip awareness.</p>
          <Link href="/telemetry" style={{color:"#60b3ff",fontWeight:700}}>Check telemetry →</Link>
        </section>
      </div>
      <section style={{background:"#101b29",border:"1px solid #25435c",borderRadius:14,padding:18,marginTop:14}}>
        <h2 style={{fontSize:17,marginTop:0}}>Co-Driver message</h2>
        <div role="status" style={{background:"#0b1420",borderLeft:"3px solid #4ca8ff",padding:14,borderRadius:8,color:"#c2d4e7",lineHeight:1.7}}>{reply}</div>
        <form onSubmit={e=>{e.preventDefault();ask();}} style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
          <input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask about your trip, fuel, or route…" style={{flex:"1 1 260px",background:"#080f18",border:"1px solid #29445d",borderRadius:8,padding:12,color:"#f4f8ff"}}/>
          <button type="submit" style={{background:"#1678c9",color:"white",border:0,borderRadius:8,padding:"11px 18px",fontWeight:800,cursor:"pointer"}}>Ask Co-Driver</button>
        </form>
      </section>
      <p style={{color:"#7189a1",fontSize:11,marginTop:22}}>BC TRUCK WORKS • CO-DRIVER • Live driving alerts require working AI configuration and real game telemetry.</p>
    </div>
  </main>;
}
