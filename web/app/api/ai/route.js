import {NextResponse} from "next/server";

function liveAnswer(message,driver,telemetry){
 const q=String(message||"").toLowerCase(),t=telemetry||{},d=driver||{};
 const speed=t.speed!=null?Number(t.speed):null,fuel=t.fuel!=null?Number(t.fuel):null,odo=t.odometer!=null?Number(t.odometer):null;
 if(/speed|fast|mph|km\\/h|kmh/.test(q)&&speed!=null)return "You are currently traveling at "+speed.toFixed(0)+" km/h in "+(t.game||d.game||"your truck")+".";
 if(/fuel|gas|diesel/.test(q)&&fuel!=null)return "Your current fuel reading is "+fuel.toFixed(1)+". Keep an eye on your fuel level during the drive.";
 if(/odometer|odo/.test(q)&&odo!=null)return "Your current odometer reading is "+odo.toFixed(1)+".";
 if(/mile|miles|distance/.test(q))return "Your BC TRUCK WORKS account has "+Number(d.total_miles||0).toLocaleString()+" tracked miles.";
 if(/trip|delivery/.test(q))return "You have "+(d.trips||0)+" recorded trips and "+(d.deliveries||0)+" recorded deliveries.";
 if(/game|playing|ats|ets2/.test(q))return "You are connected to "+(t.game||d.game||"the BC TRUCK WORKS platform")+".";
 if(/status|telemetry|connected|connection/.test(q))return t?"Telemetry is connected. Speed is "+(speed!=null?speed.toFixed(0):"0")+" km/h and the latest game data is available.":"Telemetry is currently waiting for a game connection.";
 if(/update|summary|report/.test(q))return t?"Driving update: "+(t.game||d.game||"Game")+" connected, "+(speed!=null?speed.toFixed(0):"0")+" km/h, fuel "+(fuel!=null?fuel.toFixed(1):"waiting")+", odometer "+(odo!=null?odo.toFixed(1):"waiting")+", and "+Number(d.total_miles||0).toLocaleString()+" total tracked miles.":"Driving update: BC TRUCK WORKS is waiting for live telemetry.";
 return "I can tell you your live speed, fuel, odometer, game, telemetry status, miles, trips, deliveries, and driving summary.";
}

export async function POST(request){
 try{
  const {message,driver,telemetry}=await request.json();
  if(!message)return NextResponse.json({error:"Message required"},{status:400});
  if(!process.env.OPENAI_API_KEY)return NextResponse.json({reply:liveAnswer(message,driver,telemetry)});
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5-mini",input:[{role:"system",content:"You are BC AI, the friendly trucking copilot for BC TRUCK WORKS. Answer using supplied live telemetry and driver data. Give exact current values for speed, fuel, odometer, game, miles, trips, deliveries and status. Be concise, safety-minded, and never encourage distracted driving. Current data: "+JSON.stringify({driver,telemetry})},{role:"user",content:message}]})});
  if(!response.ok)throw new Error("AI request failed");
  const data=await response.json();
  return NextResponse.json({reply:data.output_text||liveAnswer(message,driver,telemetry)});
 }catch{return NextResponse.json({reply:"BC AI is temporarily unavailable. Your live telemetry system is still running."});}
}