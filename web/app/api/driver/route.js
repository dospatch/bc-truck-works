import {NextResponse} from "next/server";
import {getDb} from "@/lib/db";
import {readSession} from "@/lib/session";

export async function GET(request){
  try{
    const s=readSession(request);
    if(!s)return NextResponse.json({error:"Authentication required"},{status:401});
    const db=getDb();
    const d=await db.query("select id,discord_id,display_name,game,total_miles,trips,deliveries,rank,created_at,updated_at from drivers where discord_id=$1 limit 1",[s.discordId]);
    if(!d.rows[0])return NextResponse.json({error:"Driver profile not found"},{status:404});
    const driver=d.rows[0];
    const [telemetry,trips]=await Promise.all([
      db.query("select game,speed,fuel,odometer,latitude,longitude,captured_at from telemetry where driver_id=$1 order by captured_at desc limit 1",[driver.id]),
      db.query("select id,game,origin,destination,miles,fuel_used,duration_seconds,started_at,completed_at,created_at from trips where driver_id=$1 order by coalesce(completed_at,created_at) desc limit 8",[driver.id])
    ]);
    return NextResponse.json({driver:{...driver,role:s.role||"driver"},latestTelemetry:telemetry.rows[0]||null,recentTrips:trips.rows});
  }catch{return NextResponse.json({error:"Driver service unavailable"},{status:503});}
}

export async function PATCH(request){
  try{
    const s=readSession(request);
    if(!s)return NextResponse.json({error:"Authentication required"},{status:401});
    const body=await request.json();
    const displayName=String(body.displayName||"").trim().slice(0,100);
    const game=String(body.game||"").toUpperCase();
    if(displayName.length<2)return NextResponse.json({error:"Display name must be at least 2 characters."},{status:400});
    if(!["ATS","ETS2"].includes(game))return NextResponse.json({error:"Game must be ATS or ETS2."},{status:400});
    const result=await getDb().query("update drivers set display_name=$1, game=$2, updated_at=now() where discord_id=$3 returning id,discord_id,display_name,game,total_miles,trips,deliveries,rank,created_at,updated_at",[displayName,game,s.discordId]);
    if(!result.rows[0])return NextResponse.json({error:"Driver profile not found"},{status:404});
    return NextResponse.json({ok:true,driver:{...result.rows[0],role:s.role||"driver"}});
  }catch{return NextResponse.json({error:"Unable to update driver profile."},{status:503});}
}