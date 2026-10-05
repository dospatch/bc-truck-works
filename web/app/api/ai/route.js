import {NextResponse} from "next/server";
export async function POST(request){
 try{
  const {message,driver,telemetry}=await request.json();
  if(!message)return NextResponse.json({error:"Message required"},{status:400});
  if(!process.env.OPENAI_API_KEY)return NextResponse.json({reply:"BC AI is online. I can track your miles, telemetry, trips, fuel, and driving status. Add OPENAI_API_KEY in Vercel to unlock full conversational AI."});
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5-mini",input:[{role:"system",content:"You are BC AI, the friendly trucking copilot for BC TRUCK WORKS. Be concise, encouraging, safety-minded, and useful. Never encourage distracted driving. Current driver data: "+JSON.stringify({driver,telemetry})},{role:"user",content:message}]})});
  if(!response.ok)throw new Error("AI request failed");
  const data=await response.json();
  return NextResponse.json({reply:data.output_text||"I'm ready, driver."});
 }catch{return NextResponse.json({reply:"BC AI is temporarily unavailable. Your live telemetry system is still running."});}
}