"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const prompts = ["How far to my destination?", "Check my fuel", "When should I rest?", "What gear should I use?", "Damage report", "Tell me a joke"];
const metrics = [["SPEED","—","mph","◉"],["FUEL","—","live data needed","⛽"],["TO DESTINATION","—","miles","⌖"],["NEXT REST","—","game data needed","◷"],["DEADLINE","—","not available","▤"],["ECO SCORE","—","trip data needed","✦"],["ALERTS","0","local callouts","♧"]];
const baseCallouts = { speed: true, speeding: true, milestones: true, rest: true, fuel: true, damage: true, shift: true };
const panel = { background: "linear-gradient(145deg,#101d30,#080f1b)", border: "1px solid #233d59", borderRadius: 13, padding: 16, boxShadow: "0 12px 30px #0004" };
const field = { width: "100%", minWidth: 0, boxSizing: "border-box", color: "#eef6ff", background: "#0a1423", border: "1px solid #294562", borderRadius: 8, padding: 11 };
const button = { color: "#fff", background: "linear-gradient(135deg,#1689ff,#075ac4)", border: "1px solid #2998ff", borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer" };

export default function LiveCompanionPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([{ from: "BC Co-Driver", text: "Welcome to BC Truck Works Live Companion. Connect a supported game telemetry source for real driving readings.", time: "Ready" }]);
  const [speaks, setSpeaks] = useState(true);
  const [voiceCommands, setVoiceCommands] = useState(false);
  const [personality, setPersonality] = useState("Friendly & Professional");
  const [voice, setVoice] = useState("Automatic English voice");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [callouts, setCallouts] = useState(baseCallouts);
  const [pushKey, setPushKey] = useState("V");
  const [profiles, setProfiles] = useState([]);
  const [profileName, setProfileName] = useState("");
  const [activeProfile, setActiveProfile] = useState("American Truck Simulator");
  const [showProfiles, setShowProfiles] = useState(false);
  const [listening, setListening] = useState(false);
  const [clock, setClock] = useState("");
  const [notice, setNotice] = useState("DEMO MODE — sample readings are shown until a compatible telemetry source is connected.");
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const timer = setInterval(tick, 15000);
    try {
      const saved = JSON.parse(localStorage.getItem("bcTwLiveCompanion") || "{}");
      if (saved.profiles) setProfiles(saved.profiles);
      if (saved.callouts) setCallouts({ ...baseCallouts, ...saved.callouts });
      if (saved.personality) setPersonality(saved.personality);
      if (saved.voice) setVoice(saved.voice);
      if (saved.speaks !== undefined) setSpeaks(saved.speaks);
      if (saved.voiceCommands !== undefined) setVoiceCommands(saved.voiceCommands);
      if (saved.pushKey) setPushKey(saved.pushKey);
      if (saved.activeProfile) setActiveProfile(saved.activeProfile);
    } catch {}
    if ("speechSynthesis" in window) {
      const load = () => setVoices(window.speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)).map((v) => v.name));
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
    fetch("/api/health", { cache: "no-store" }).then(async (r) => {
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) setNotice("WEBSITE API REACHABLE — in-game telemetry is a separate connection.");
    }).catch(() => {});
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try { localStorage.setItem("bcTwLiveCompanion", JSON.stringify({ profiles, callouts, personality, voice, speaks, voiceCommands, pushKey, activeProfile })); } catch {}
  }, [profiles, callouts, personality, voice, speaks, voiceCommands, pushKey, activeProfile]);

  function speak(text) {
    if (!speaks || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const list = window.speechSynthesis.getVoices();
    const selected = voice === "Automatic English voice" ? list.find((v) => /^en(-|_)/i.test(v.lang)) : list.find((v) => v.name === voice);
    if (selected) utterance.voice = selected;
    utterance.rate = Number(rate); utterance.pitch = Number(pitch); utterance.volume = Number(volume);
    window.speechSynthesis.speak(utterance);
  }

  function answer(text) {
    const q = text.toLowerCase();
    if (q.includes("fuel")) return "Live fuel level and estimated range require a connected game telemetry source.";
    if (q.includes("rest") || q.includes("sleep")) return "Rest planning needs your active route, remaining drive time, and fatigue data from a supported connector.";
    if (q.includes("far") || q.includes("destination") || q.includes("mile")) return "Your destination distance will appear here once a supported telemetry feed provides the active navigation route.";
    if (q.includes("gear") || q.includes("shift")) return "Live shift guidance requires speed, RPM, gear, and engine telemetry. Until then, follow your truck's RPM band and road load.";
    if (q.includes("damage")) return "A live damage report needs a connected telemetry source.";
    if (q.includes("delivery") || q.includes("deadline") || q.includes("make it")) return "Delivery estimates need the job deadline, remaining distance, and driving/rest limits.";
    if (q.includes("joke")) return "Why did the truck driver bring a ladder? To get to the next level of the highway. Keep on truckin'!";
    return "I'm your BC Truck Works Co-Driver. Ask about distance, fuel, rest, shifting, delivery timing, or damage. Accurate live answers need a supported telemetry connection.";
  }

  function ask(text = question) {
    const q = text.trim();
    if (!q) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const reply = answer(q);
    setMessages((old) => [...old, { from: "You", text: q, time }, { from: "BC Co-Driver", text: reply, time }]);
    setQuestion("");
    speak(reply);
  }

  function listen() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setNotice("Speech recognition is not supported here. Try current Chrome or Edge."); return; }
    const recognition = new Recognition();
    recognition.lang = "en-US"; recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); setNotice("Microphone stopped. Check browser microphone permissions."); };
    recognition.onresult = (event) => {
      const transcript = event.results && event.results[0] && event.results[0][0] ? event.results[0][0].transcript : "";
      if (transcript) ask(transcript);
    };
    recognition.start();
  }

  function addProfile(e) {
    e.preventDefault();
    const name = profileName.trim();
    if (!name) return;
    setProfiles((old) => [...old.filter((p) => p !== name), name]);
    setActiveProfile(name); setProfileName("");
    setNotice("App profile saved in this browser. Automatic integration still requires a supported connection.");
  }

  const calloutList = [["speed", "Speed limit changes"], ["speeding", "Speeding warnings"], ["milestones", "Miles-to-go milestones"], ["rest", "Rest reminders"], ["fuel", "Low fuel"], ["damage", "Damage and cargo hits"], ["shift", "Shift calls (up / down)"]];
  const voiceOptions = ["Automatic English voice", ...new Set(voices)];

  return <main style={{ minHeight: "100vh", color: "#edf5ff", background: "radial-gradient(ellipse at 70% 0%,#142a48 0,#080f1b 48%,#050a12 100%)", fontFamily: "Arial,Helvetica,sans-serif" }}>
    <style jsx global>{".bc-lc-toggle{appearance:none;width:40px;height:22px;border-radius:22px;background:#334155;border:1px solid #48627c;position:relative;cursor:pointer;flex-shrink:0}.bc-lc-toggle:checked{background:#1689ff}.bc-lc-toggle:after{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:white;top:2px;left:2px}.bc-lc-toggle:checked:after{transform:translateX(17px)}.bc-lc-range{accent-color:#48a9ff;width:100%}.bc-lc-scroll::-webkit-scrollbar{width:8px}.bc-lc-scroll::-webkit-scrollbar-thumb{background:#2a4968;border-radius:8px}@media(max-width:1050px){.bc-lc-shell{grid-template-columns:180px minmax(0,1fr)!important}.bc-lc-grid{grid-template-columns:minmax(0,1fr)!important}}@media(max-width:680px){.bc-lc-shell{display:block!important}.bc-lc-sidebar{display:none!important}.bc-lc-metrics{grid-template-columns:repeat(2,minmax(0,1fr))!important}.bc-lc-header{align-items:flex-start!important;flex-direction:column}.bc-lc-prompts{grid-template-columns:repeat(2,minmax(0,1fr))!important}.bc-lc-input{flex-direction:column}}"} </style>
    <div className="bc-lc-shell" style={{ display: "grid", gridTemplateColumns: "215px minmax(0,1fr)", minHeight: "100vh" }}>
      <aside className="bc-lc-sidebar" style={{ borderRight: "1px solid #1d3854", background: "rgba(5,12,22,.95)", padding: 14, display: "flex", flexDirection: "column", gap: 17 }}>
        <Link href="/" style={{ color: "#fff", textAlign: "center", padding: "8px 4px 18px", borderBottom: "1px solid #20344b", textDecoration: "none" }}><img src="/bc-truck-works-logo.png" alt="BC Truck Works" style={{ width: 110, height: 88, objectFit: "contain" }}/><b style={{ display: "block", letterSpacing: ".05em" }}>BC TRUCK WORKS</b><small style={{ color: "#4caeff", letterSpacing: ".12em" }}>LIVE COMPANION</small></Link>
        {[["DRIVE", [["⌂","Dashboard","/"],["◉","Co-Driver","/live-companion"],["⌖","Navigation","/navigation"],["▣","Truck Health","/truck-health"],["⇅","Shift Coach","/copilot"]]],["WORK", [["▰","Dispatch & BOL","/dispatch"],["▤","Trip History","/trips"],["▥","Earnings & Stats","/earnings"],["▧","Journal","/journal"],["▦","Company","/fleet"],["★","Career","/career"]]],["COMMUNITY", [["◉","Convoy Hub","/convoy"],["♧","Convoy","/convoy"],["🏆","Leaderboard","/leaderboard"]]]].map(([group, items]) => <section key={group}><div style={{ color: "#55b6ff", fontSize: 10, fontWeight: 900, letterSpacing: ".16em", margin: "0 9px 7px" }}>{group}</div>{items.map(([icon,label,href]) => <Link key={label} href={href} style={{ display: "flex", gap: 9, alignItems: "center", padding: 10, margin: "2px 0", borderRadius: 8, color: label === "Co-Driver" ? "#fff" : "#9fb2c9", background: label === "Co-Driver" ? "linear-gradient(100deg,#0d4c89,#102a49)" : "transparent", textDecoration: "none", fontSize: 13 }}><span style={{ width: 20, color: "#4caeff" }}>{icon}</span>{label}</Link>)}</section>)}
        <div style={{ marginTop: "auto", padding: 12, border: "1px solid #203b57", borderRadius: 10, color: "#91a8c3", fontSize: 11, lineHeight: 1.6 }}><b style={{ color: "#58b6ff" }}>DRIVE • BUILD • SUCCEED</b><br/>BC Truck Works<br/>Live Companion V1</div>
      </aside>
      <section style={{ minWidth: 0, padding: "18px clamp(12px,2vw,28px) 28px" }}>
        <header className="bc-lc-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><img src="/bc-truck-works-logo.png" alt="" style={{ width: 42, height: 42, objectFit: "contain" }}/><div><h1 style={{ fontSize: "clamp(20px,2vw,28px)", margin: 0 }}>BC TRUCK WORKS <span style={{ color: "#48a9ff" }}>• LIVE COMPANION</span></h1><p style={{ margin: "5px 0 0", color: "#91a7c1", fontSize: 11, letterSpacing: ".12em" }}>YOUR RIDE • YOUR ROUTE • YOUR SUPPORT</p></div></div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#0c1929", border: "1px solid #244363", borderRadius: 99, padding: "9px 13px", color: "#a8bdd5", fontSize: 11 }}><span style={{ width: 8, height: 8, background: "#f0b74c", borderRadius: "50%" }}/><b style={{ color: "#fff" }}>DEMO MODE</b>{clock}</div>
        </header>
        <div className="bc-lc-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 8, marginBottom: 12 }}>{metrics.map((m) => <div key={m[0]} style={{ ...panel, padding: "11px 9px", minWidth: 0 }}><div style={{ color: "#4eafff", fontSize: 18 }}>{m[3]}</div><small style={{ display: "block", color: "#8ea8c4", fontSize: 9, fontWeight: 900, letterSpacing: ".08em" }}>{m[0]}</small><strong style={{ display: "block", fontSize: 18, margin: "4px 0", overflowWrap: "anywhere" }}>{m[1]}</strong><small style={{ color: "#7e96b2", fontSize: 9 }}>{m[2]}</small></div>)}</div>
        <div style={{ border: "1px solid #4a3e20", background: "#3c2b0c33", color: "#c5d4e8", borderRadius: 9, padding: 11, fontSize: 12, marginBottom: 14 }}><b style={{ color: "#f2c05b" }}>STATUS</b> — {notice}</div>
        <div className="bc-lc-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(310px,.9fr)", gap: 14, alignItems: "start" }}>
          <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
            <section style={{ ...panel, padding: 0, overflow: "hidden" }}><header style={{ padding: 15, borderBottom: "1px solid #223954", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}><h2 style={{ margin: 0, fontSize: 13 }}>▰ TALK TO YOUR CO-DRIVER</h2><button onClick={listen} type="button" style={{ ...button, padding: "8px 10px", fontSize: 11 }}>{listening ? "Listening…" : "🎙 Speak"}</button></header><div style={{ padding: 14 }}>
              <form className="bc-lc-input" onSubmit={(e) => { e.preventDefault(); ask(); }} style={{ display: "flex", gap: 8 }}><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question — e.g. fuel, distance, rest, gear…" aria-label="Ask co-driver" style={{ ...field, flex: 1 }}/><button type="submit" style={button}>Ask</button></form>
              <div className="bc-lc-prompts" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 7, margin: "10px 0 12px" }}>{prompts.map((p) => <button key={p} type="button" onClick={() => ask(p)} style={{ background: "#0c1b2c", color: "#d8eaff", border: "1px solid #244766", borderRadius: 8, padding: 8, fontSize: 10, cursor: "pointer" }}>{p}</button>)}</div>
              <div className="bc-lc-scroll" aria-live="polite" style={{ display: "grid", gap: 6, maxHeight: 330, overflowY: "auto" }}>{messages.map((m, i) => <div key={m.time + "-" + i} style={{ background: m.from === "You" ? "#103a66" : "#0b1726", border: "1px solid #182d44", borderRadius: 8, padding: 10, lineHeight: 1.5, fontSize: 12 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}><b>{m.from}</b><small style={{ color: "#7e9bb9" }}>{m.time}</small></div>{m.text}</div>)}</div>
            </div></section>
            <section style={panel}><h2 style={{ margin: "0 0 13px", fontSize: 13 }}>🎙 VOICE COMMANDS</h2><div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}><div><b style={{ fontSize: 13 }}>Listen for voice commands</b><p style={{ color: "#91a8c2", fontSize: 11, lineHeight: 1.5, margin: "5px 0 0" }}>Browser speech recognition where supported; microphone permission may be required.</p></div><input className="bc-lc-toggle" type="checkbox" checked={voiceCommands} onChange={(e) => setVoiceCommands(e.target.checked)} aria-label="Enable voice commands"/></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}><label style={{ color: "#86a8cc", fontSize: 10, fontWeight: 900 }}>PUSH-TO-TALK KEY<input value={pushKey} onChange={(e) => setPushKey(e.target.value.toUpperCase().slice(0,1))} maxLength={1} style={{ ...field, marginTop: 7, textAlign: "center" }}/></label><label style={{ color: "#86a8cc", fontSize: 10, fontWeight: 900 }}>APP PROFILE<select value={activeProfile} onChange={(e) => setActiveProfile(e.target.value)} style={{ ...field, marginTop: 7 }}><option>American Truck Simulator</option><option>Euro Truck Simulator 2</option>{profiles.map((p) => <option key={p}>{p}</option>)}</select></label></div>{voiceCommands && <button type="button" onClick={listen} style={{ ...button, marginTop: 12, width: "100%" }}>{listening ? "Listening — speak now" : "Start one voice command"}</button>}</section>
          </div>
          <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
            <section style={panel}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}><h2 style={{ margin: 0, fontSize: 13 }}>♫ VOICE & PERSONALITY</h2><button type="button" onClick={() => speak("Welcome back to BC Truck Works. Keep on truckin'.")} style={{ ...button, padding: "8px 10px", fontSize: 11 }}>▶ Test voice</button></div><div style={{ borderTop: "1px solid #223954", margin: "13px 0" }}/><label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}><span><b style={{ fontSize: 13 }}>Co-driver speaks</b><small style={{ display: "block", color: "#8da6c1", fontSize: 11, marginTop: 3 }}>Use this device's speech output.</small></span><input className="bc-lc-toggle" type="checkbox" checked={speaks} onChange={(e) => setSpeaks(e.target.checked)} aria-label="Enable spoken responses"/></label><label style={{ display: "block", color: "#86a8cc", fontSize: 10, fontWeight: 900, marginTop: 14 }}>PERSONALITY<select value={personality} onChange={(e) => setPersonality(e.target.value)} style={{ ...field, marginTop: 6 }}><option>Friendly & Professional</option><option>Calm Long-Haul Partner</option><option>Energetic Convoy Buddy</option><option>Short & Straight to the Point</option><option>Funny Trucking Buddy</option></select></label><label style={{ display: "block", color: "#86a8cc", fontSize: 10, fontWeight: 900, marginTop: 13 }}>VOICE<select value={voice} onChange={(e) => setVoice(e.target.value)} style={{ ...field, marginTop: 6 }}>{voiceOptions.map((v) => <option key={v}>{v}</option>)}</select></label>{[["SPEED",rate,setRate,.6,1.5,.1],["PITCH",pitch,setPitch,.6,1.5,.1],["VOLUME",volume,setVolume,0,1,.05]].map(([label,value,setter,min,max,step]) => <label key={label} style={{ display: "block", color: "#86a8cc", fontSize: 10, fontWeight: 900, marginTop: 13 }}>{label}<input className="bc-lc-range" type="range" min={min} max={max} step={step} value={value} onChange={(e) => setter(Number(e.target.value))} style={{ display: "block", marginTop: 8 }}/></label>)}</section>
            <section style={{ ...panel, paddingBottom: 7 }}><h2 style={{ margin: "0 0 10px", fontSize: 13 }}>♧ AUTOMATIC CALLOUTS</h2>{calloutList.map(([key,label]) => <label key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: "1px solid #20344b", fontSize: 12 }}><span>{label}</span><input className="bc-lc-toggle" type="checkbox" checked={Boolean(callouts[key])} onChange={(e) => setCallouts((old) => ({ ...old, [key]: e.target.checked }))} aria-label={label}/></label>)}</section>
            <section style={panel}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h2 style={{ margin: 0, fontSize: 13 }}>APP PROFILES</h2><button type="button" onClick={() => setShowProfiles((v) => !v)} style={{ background: "transparent", border: 0, color: "#72beff", cursor: "pointer" }}>{showProfiles ? "Hide" : "Manage"}</button></div><p style={{ color: "#9db3cc", fontSize: 12, lineHeight: 1.5 }}>Current profile: <b style={{ color: "#fff" }}>{activeProfile}</b>. Add any app or game; V1 has no app whitelist.</p>{showProfiles && <form onSubmit={addProfile} style={{ display: "flex", gap: 7 }}><input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Any game or app name" style={{ ...field, flex: 1 }}/><button type="submit" style={{ ...button, padding: "9px 11px" }}>Add</button></form>}{showProfiles && profiles.map((p) => <div key={p} style={{ display: "flex", justifyContent: "space-between", gap: 8, borderTop: "1px solid #20344b", paddingTop: 8, marginTop: 8, fontSize: 12 }}><button type="button" onClick={() => setActiveProfile(p)} style={{ background: "transparent", border: 0, color: "#b8dfff", cursor: "pointer" }}>{p}</button><button type="button" onClick={() => setProfiles((old) => old.filter((x) => x !== p))} style={{ background: "transparent", border: 0, color: "#e59c9c", cursor: "pointer" }}>Remove</button></div>)}</section>
          </div>
        </div>
        <footer style={{ marginTop: 18, padding: "15px 4px", borderTop: "1px solid #1b3047", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, color: "#7994b1", fontSize: 10, letterSpacing: ".1em" }}><span>BC TRUCK WORKS • DRIVE • BUILD • SUCCEED</span><span>LIVE COMPANION V1 • {clock}</span><Link href="/" style={{ color: "#54b4ff" }}>Return to Driver Hub ↗</Link></footer>
      </section>
    </div>
  </main>;
}
